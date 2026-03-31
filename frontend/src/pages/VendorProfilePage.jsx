import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vendorAPI, serviceAPI, reviewAPI, bookingAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { MapPin, Briefcase, Star, CalendarDays, Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORY_IMAGES = {
  CATERING: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&auto=format&fit=crop',
  DECORATION: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&auto=format&fit=crop',
  PHOTOGRAPHY: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop',
  VIDEOGRAPHY: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=1200&auto=format&fit=crop',
  MUSIC_DJ: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop',
  VENUE: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&auto=format&fit=crop',
  TRANSPORTATION: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&auto=format&fit=crop',
  LIGHTING: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop',
  FLORAL: 'https://images.unsplash.com/photo-1561181286-d3fee7d55ef6?w=1200&auto=format&fit=crop',
  BAKERY: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200&auto=format&fit=crop',
  ENTERTAINMENT: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop',
  OTHER: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop'
};

function StarRating({ rating }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`star ${i <= Math.round(rating) ? 'filled' : ''}`}>★</span>
      ))}
      <span style={{ marginLeft: '0.4rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        {rating?.toFixed(1) || '0.0'}
      </span>
    </div>
  );
}

function BookingModal({ service, vendor, onClose }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ eventId: '', specialRequests: '', bookingDate: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.role === 'USER') {
      import('../api/client').then(({ eventAPI }) => {
        eventAPI.getMyEvents().then(r => setEvents(r.data));
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await bookingAPI.create({
        eventId: Number(form.eventId),
        serviceId: service.id,
        notes: form.specialRequests,
        bookingDate: form.bookingDate
      });
      toast.success('Booking requested successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request booking');
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Book {service.name}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Vendor: <strong>{vendor.businessName}</strong> <br />
          Cost: <strong>₹{service.price?.toLocaleString()}</strong>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Event</label>
            <select className="form-select" required value={form.eventId} onChange={e => setForm({ ...form, eventId: e.target.value })}>
              <option value="">-- Choose an Event --</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id} disabled={ev.remainingBudget < service.price}>
                  {ev.title} (₹{ev.remainingBudget?.toLocaleString()} left) {ev.remainingBudget < service.price ? ' - Over Budget' : ''}
                </option>
              ))}
            </select>
            {events.length === 0 && (
              <p style={{ fontSize: '0.8rem', color: 'var(--accent-warning)', marginTop: '0.5rem' }}>
                You don't have any events. <Link to="/events/new">Create an event first</Link>.
              </p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Booking Date</label>
            <input type="date" className="form-input" required value={form.bookingDate} onChange={e => setForm({ ...form, bookingDate: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Special Requests (Optional)</label>
            <textarea className="form-textarea" value={form.specialRequests}
              onChange={e => setForm({ ...form, specialRequests: e.target.value })}
              placeholder="Any specific dietary requirements, themes, etc." />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving || !form.eventId || !form.bookingDate}>
              {saving ? 'Requesting...' : 'Confirm Booking Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VendorProfilePage({ isMyProfile = false }) {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(null);
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    const load = async () => {
      try {
        const vRes = isMyProfile ? await vendorAPI.getMyProfile() : await vendorAPI.getById(id);
        setVendor(vRes.data);
        const vendorId = vRes.data.id;
        const [sRes, rRes] = await Promise.all([
          serviceAPI.getByVendor(vendorId),
          reviewAPI.getByVendor(vendorId)
        ]);
        setServices(sRes.data);
        setReviews(rRes.data);
      } catch (err) {
        toast.error('Failed to load profile');
      } finally { setLoading(false); }
    };
    load();
  }, [id, isMyProfile]);

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!vendor) return <div className="empty-state">Vendor not found</div>;

  return (
    <div>
      {/* Cover Header */}
      <div style={{ height: 320, backgroundImage: `url(${CATEGORY_IMAGES[vendor.category] || CATEGORY_IMAGES.OTHER})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)' }}></div>
        <div className="container" style={{ height: '100%', position: 'relative' }}>
          <div style={{
            position: 'absolute', bottom: '-40px', left: '1.5rem',
            width: 120, height: 120, borderRadius: 'var(--radius-lg)',
            background: 'var(--gradient-primary)', border: '4px solid var(--bg-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3.5rem', boxShadow: 'var(--shadow-md)', zIndex: 10
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
              {vendor.businessName ? vendor.businessName.charAt(0).toUpperCase() : <Briefcase size={40} />}
            </div>
          </div>
        </div>
      </div>

      <div className="container page-content" style={{ marginTop: '2rem' }}>
        <div className="sidebar-layout">
          {/* Main Content */}
          <div>
            <div style={{ paddingLeft: '9rem', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>
                    {vendor.businessName}
                  </h1>
                  <span className="badge badge-primary">{vendor.category?.replace(/_/g, ' ')}</span>
                </div>
                {isMyProfile && (
                  <button className="btn btn-secondary"><Edit size={16} /> Edit Profile</button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} /> {vendor.city}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Briefcase size={16} /> {vendor.experience} Years Experience
                </span>
              </div>
            </div>

            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              {vendor.description}
            </p>

            {/* Tabs */}
            <div className="tabs" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
              <button className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
                Services ({services.length})
              </button>
              <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
                Reviews ({reviews.length})
              </button>
            </div>

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {isMyProfile && (
                  <div className="card" style={{ borderStyle: 'dashed', textAlign: 'center', cursor: 'pointer', background: 'transparent' }}>
                    <Plus size={24} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 600 }}>Add New Service</div>
                  </div>
                )}
                {services.length === 0 && !isMyProfile && (
                  <div className="empty-state">No services listed yet.</div>
                )}
                {services.map(s => (
                  <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 250 }}>
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{s.name}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{s.description}</p>
                      <div className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                        {s.category?.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 120 }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>
                        ₹{s.price?.toLocaleString()}
                      </div>
                      {!isMyProfile && isAuthenticated && user?.role === 'USER' && (
                        <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => setBookingModal(s)}>
                          Request to Book
                        </button>
                      )}
                      {isMyProfile && (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-ghost btn-sm"><Edit size={14} /></button>
                          <button className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{
                  padding: '2rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)',
                  display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1 }}>{vendor.averageRating?.toFixed(1) || '0.0'}</div>
                    <StarRating rating={vendor.averageRating} />
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      Based on {vendor.reviewCount} reviews
                    </div>
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <div className="empty-state">No reviews yet.</div>
                ) : (
                  reviews.map(r => (
                    <div key={r.id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ fontWeight: 600 }}>{r.userName}</div>
                        <StarRating rating={r.rating} />
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{r.comment}"</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '88px' }}>
              <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Vendor Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Rating</span>
                  <span style={{ fontWeight: 600 }}>{vendor.averageRating?.toFixed(1)} / 5.0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Reviews</span>
                  <span style={{ fontWeight: 600 }}>{vendor.reviewCount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Location</span>
                  <span style={{ fontWeight: 600 }}>{vendor.city}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Experience</span>
                  <span style={{ fontWeight: 600 }}>{vendor.experience} Years</span>
                </div>
              </div>
              {!isAuthenticated && (
                <div style={{ marginTop: '2rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', textAlign: 'center' }}>
                    Sign in to book this vendor
                  </p>
                  <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Login</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {bookingModal && (
        <BookingModal
          service={bookingModal}
          vendor={vendor}
          onClose={() => setBookingModal(null)}
        />
      )}
    </div>
  );
}
