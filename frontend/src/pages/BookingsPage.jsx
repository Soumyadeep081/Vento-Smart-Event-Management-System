import { useEffect, useState } from 'react';
import { bookingAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Check, X, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';

function StatusBadge({ status }) {
  const map = {
    CONFIRMED: 'badge-success', PENDING: 'badge-warning',
    CANCELLED: 'badge-danger', COMPLETED: 'badge-secondary'
  };
  return <span className={`badge ${map[status] || 'badge-secondary'}`}>{status}</span>;
}

export default function BookingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const { data } = await bookingAPI.getMyBookings();
      setBookings(data);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleStatusUpdate = async (id, status) => {
    if (!confirm(`Are you sure you want to mark this booking as ${status}?`)) return;
    try {
      await bookingAPI.updateStatus(id, status);
      toast.success(`Booking ${status.toLowerCase()}`);
      loadData();
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  const handleCancel = async (id) => {
    if (!confirm(`Are you sure you want to CANCEL this booking?`)) return;
    try {
      await bookingAPI.cancel(id);
      toast.success(`Booking cancelled`);
      loadData();
    } catch (err) { toast.error(err.response?.data?.message || 'Cancel failed'); }
  };

  const handleCardClick = (e, b) => {
    // Prevent navigation if clicking on buttons
    if (e.target.closest('button')) return;
    
    if (user?.role === 'USER') {
      navigate(`/events/${b.eventId}`);
    } else {
      // VENDOR
      navigate(`/vendor-profile`);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="container page-content">
      <div className="page-header" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden', marginBottom: '2rem', border: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="page-title" style={{ color: '#fff', marginBottom: '0.25rem' }}>Manage Bookings</h1>
          <p className="page-subtitle" style={{ color: 'rgba(255,255,255,0.8)' }}>Track and manage your service reservations</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <div className="empty-title">No bookings found</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map(b => (
            <div 
              key={b.id} 
              className="card booking-card" 
              onClick={(e) => handleCardClick(e, b)}
              style={{ 
                display: 'flex', flexWrap: 'wrap', gap: '1.5rem', 
                alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
            >
              <div style={{ flex: 1, minWidth: 250 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{b.serviceName}</h3>
                  <StatusBadge status={b.status} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <div><strong>Event:</strong> {b.eventTitle}</div>
                  <div>
                    <strong>{user?.role === 'VENDOR' ? 'Client' : 'Vendor'}:</strong> {user?.role === 'VENDOR' ? b.userName : b.vendorName}
                  </div>
                  <div><strong>Date:</strong> {new Date(b.createdAt).toLocaleDateString()}</div>
                  {b.specialRequests && <div><strong>Requests:</strong> {b.specialRequests}</div>}
                </div>
              </div>

              <div style={{ textAlign: 'right', minWidth: 150 }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  ₹{b.cost?.toLocaleString()}
                </div>

                {/* VENDOR ACTIONS */}
                {user?.role === 'VENDOR' && b.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-sm" style={{ background: 'var(--accent-success)', color: '#fff' }} onClick={() => handleStatusUpdate(b.id, 'CONFIRMED')}>
                      <Check size={14} /> Accept
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleStatusUpdate(b.id, 'CANCELLED')}>
                      <X size={14} /> Reject
                    </button>
                  </div>
                )}
                {user?.role === 'VENDOR' && b.status === 'CONFIRMED' && (
                  <button className="btn btn-sm btn-secondary" onClick={() => handleStatusUpdate(b.id, 'COMPLETED')}>
                    Mark Completed
                  </button>
                )}

                {/* USER ACTIONS */}
                {user?.role === 'USER' && (b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                  <button className="btn btn-sm btn-danger" onClick={() => handleCancel(b.id)}>
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
