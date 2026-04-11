import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventAPI, bookingAPI } from '../api/client';
import {
  ArrowLeft, CalendarDays, MapPin, DollarSign, Heart, Cake, Briefcase,
  PartyPopper, Edit, Trash2, Clock, CheckCircle, XCircle, AlertCircle,
  FileText, Users, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

const EVENT_TYPE_LABELS = {
  WEDDING: 'Wedding', BIRTHDAY_PARTY: 'Birthday Party',
  CORPORATE_EVENT: 'Corporate', CONFERENCE_SEMINAR: 'Conference',
  SOCIAL_GATHERING: 'Social', FESTIVAL_CULTURAL: 'Festival', CUSTOM: 'Custom'
};

const EVENT_TYPE_IMAGES = {
  WEDDING: '/images/events/wedding.png',
  BIRTHDAY_PARTY: '/images/events/birthday.png',
  CORPORATE_EVENT: '/images/events/corporate.png',
  CONFERENCE_SEMINAR: '/images/events/conference.png',
  SOCIAL_GATHERING: '/images/events/social.png',
  FESTIVAL_CULTURAL: '/images/events/festival.png',
  CUSTOM: '/images/events/custom.png'
};

function StatusBadge({ status }) {
  const map = {
    CONFIRMED: { cls: 'badge-success', icon: <CheckCircle size={12} /> },
    PENDING: { cls: 'badge-warning', icon: <Clock size={12} /> },
    CANCELLED: { cls: 'badge-danger', icon: <XCircle size={12} /> },
    COMPLETED: { cls: 'badge-secondary', icon: <CheckCircle size={12} /> }
  };
  const s = map[status] || { cls: 'badge-secondary', icon: null };
  return <span className={`badge ${s.cls}`}>{s.icon} {status}</span>;
}

function EditEventModal({ event, onClose, onSave }) {
  const [form, setForm] = useState({
    title: event.title || '',
    type: event.type || 'WEDDING',
    date: event.date || '',
    location: event.location || '',
    budget: event.budget || '',
    description: event.description || '',
    customType: event.customType || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await eventAPI.update(event.id, form);
      onSave(data);
      toast.success('Event updated!');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update event';
      toast.error(msg);
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Edit Event</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input className="form-input" required value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Event Type</label>
              <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {Object.entries(EVENT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" required value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>
          {form.type === 'CUSTOM' && (
            <div className="form-group">
              <label className="form-label">Custom Type Name</label>
              <input className="form-input" value={form.customType}
                onChange={e => setForm({ ...form, customType: e.target.value })} placeholder="e.g. Product Launch" />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-input" required value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Budget (₹)</label>
            <input type="number" className="form-input" required value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })} min="1" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Tell us about your event..." />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [evRes, bkRes] = await Promise.all([
          eventAPI.getById(id),
          bookingAPI.getByEvent(id).catch(() => ({ data: [] }))
        ]);
        setEvent(evRes.data);
        setBookings(bkRes.data || []);
      } catch (err) {
        console.error('Failed to load event:', err);
        if (err.response?.status === 404) {
          setError('Event not found');
        } else {
          setError('Failed to load event details');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this event? All associated bookings may be affected.')) return;
    setDeleting(true);
    try {
      await eventAPI.delete(id);
      toast.success('Event deleted');
      navigate('/events');
    } catch (err) {
      console.error('Delete error:', err);
      const msg = err.response?.data?.message || 'Failed to delete event. It may have active bookings.';
      toast.error(msg);
      setDeleting(false);
    }
  };

  const handleEventUpdate = (updatedEvent) => {
    setEvent(updatedEvent);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-secondary)' }}>Loading event...</p>
    </div>
  );

  if (error) return (
    <div className="container page-content">
      <div className="empty-state">
        <div style={{
          background: 'var(--bg-elevated)', width: 64, height: 64, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem', color: 'var(--accent-danger)',
          border: '1px solid var(--border-subtle)'
        }}>
          <AlertCircle size={28} />
        </div>
        <div className="empty-title">{error}</div>
        <p style={{ marginBottom: '1.5rem' }}>The event you're looking for doesn't exist or you don't have access.</p>
        <Link to="/events" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Events
        </Link>
      </div>
    </div>
  );

  const ev = event;
  const spent = (ev.budget || 0) - (ev.remainingBudget || 0);
  const pct = ev.budget > 0 ? Math.round((spent / ev.budget) * 100) : 0;
  const heroImg = EVENT_TYPE_IMAGES[ev.type] || EVENT_TYPE_IMAGES.CUSTOM;
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
  const totalBookingsCost = bookings.reduce((s, b) => s + (b.cost || 0), 0);

  return (
    <div className="container page-content fade-in">
      {/* Back button */}
      <Link to="/events" style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem',
        textDecoration: 'none', transition: 'color 0.15s'
      }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
      >
        <ArrowLeft size={16} /> Back to Events
      </Link>

      {/* Hero Banner */}
      <div style={{
        borderRadius: 'var(--radius-xl)', overflow: 'hidden',
        position: 'relative', marginBottom: '2rem',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          height: '240px',
          position: 'relative'
        }}>
          <img
            src={heroImg}
            alt={ev.title}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', display: 'block'
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)'
          }}></div>
          <div style={{
            position: 'absolute', bottom: '1.5rem', left: '2rem', right: '2rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255,255,255,0.15)', color: '#fff',
                  backdropFilter: 'blur(8px)'
                }}>
                  {ev.type === 'WEDDING' ? <Heart size={18} /> :
                   ev.type === 'BIRTHDAY_PARTY' ? <Cake size={18} /> :
                   ev.type === 'CORPORATE_EVENT' ? <Briefcase size={18} /> :
                   <PartyPopper size={18} />}
                </span>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                  {EVENT_TYPE_LABELS[ev.type] || ev.customType || ev.type}
                </span>
              </div>
              <h1 style={{ fontSize: '1.8rem', color: '#fff', margin: 0, fontWeight: 800 }}>
                {ev.title}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowEditModal(true)}
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
              >
                <Edit size={14} /> Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
                disabled={deleting}
                style={{ backdropFilter: 'blur(8px)' }}
              >
                <Trash2 size={14} /> {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info + Budget Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Event Info Card */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <FileText size={18} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>Event Details</h3>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                  background: 'rgba(124, 92, 252, 0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#7c5cfc', flexShrink: 0
                }}>
                  <CalendarDays size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Date</div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    {new Date(ev.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                  background: 'rgba(34, 211, 161, 0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#22d3a1', flexShrink: 0
                }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Location</div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{ev.location}</div>
                </div>
              </div>

              {ev.description && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.5rem' }}>Description</div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{ev.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Budget Card */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <DollarSign size={18} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>Budget Overview</h3>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {/* Big number */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                fontSize: '2.5rem', fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                ₹{ev.budget?.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Budget</div>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Budget Used</span>
                <span style={{ fontWeight: 700, color: pct > 80 ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
                  {pct}%
                </span>
              </div>
              <div className="progress-bar-wrap" style={{ height: '10px' }}>
                <div className="progress-bar-fill" style={{
                  width: `${pct}%`,
                  background: pct > 80 ? 'linear-gradient(135deg,#ef4444,#f59e0b)' : 'var(--gradient-primary)'
                }}></div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{
                background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
                padding: '1rem', textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-success)' }}>
                  ₹{ev.remainingBudget?.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Remaining</div>
              </div>
              <div style={{
                background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
                padding: '1rem', textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-warning)' }}>
                  ₹{spent.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Spent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <Users size={18} style={{ color: 'var(--accent-primary)' }} />
            Bookings ({bookings.length})
          </h3>
          <Link to={`/vendors?city=${encodeURIComponent(ev.location ? ev.location.split(',')[0].trim() : '')}`} className="btn btn-primary btn-sm">
            <Plus size={14} /> Book a Vendor
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem 2rem' }}>
            <div style={{
              background: 'var(--bg-elevated)', width: 48, height: 48, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem', color: 'var(--accent-primary)',
              border: '1px solid var(--border-subtle)'
            }}>
              <Users size={24} />
            </div>
            <div className="empty-title" style={{ fontSize: '1.1rem' }}>No bookings yet</div>
            <p style={{ fontSize: '0.9rem' }}>Browse vendors to start booking services for this event.</p>
            <Link to={`/vendors?city=${encodeURIComponent(ev.location ? ev.location.split(',')[0].trim() : '')}`} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
              Browse Vendors
            </Link>
          </div>
        ) : (
          <div>
            {/* Summary row */}
            <div style={{
              display: 'flex', gap: '2rem', padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-elevated)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-success)' }}>{confirmedBookings}</span> Confirmed
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-warning)' }}>₹{totalBookingsCost.toLocaleString('en-IN')}</span> Total Cost
              </div>
            </div>

            {bookings.map(b => (
              <div key={b.id} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                transition: 'background 0.15s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-glass)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                  background: 'var(--gradient-primary)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0
                }}>
                  <Users size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600, fontSize: '0.9rem',
                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'
                  }}>
                    {b.serviceName || b.vendorName || 'Service'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {b.vendorBusinessName || b.vendorName || ''}
                    {b.eventDate ? ` · ${b.eventDate}` : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', flexShrink: 0 }}>
                  <StatusBadge status={b.status} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-warning)', fontWeight: 700 }}>
                    ₹{b.cost?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditEventModal
          event={ev}
          onClose={() => setShowEditModal(false)}
          onSave={handleEventUpdate}
        />
      )}
    </div>
  );
}
