import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI, bookingAPI, vendorAPI } from '../api/client';
import { CalendarDays, Plus, TrendingUp, BookOpen, Users, DollarSign, Clock, CheckCircle, XCircle, Heart, Cake, Briefcase, PartyPopper, Calendar, ClipboardList, Zap, BarChart2, Store } from 'lucide-react';

function StatusBadge({ status }) {
  const map = {
    CONFIRMED: 'badge-success', PENDING: 'badge-warning',
    CANCELLED: 'badge-danger', COMPLETED: 'badge-secondary'
  };
  return <span className={`badge ${map[status] || 'badge-secondary'}`}>{status}</span>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [evRes, bkRes] = await Promise.all([
          eventAPI.getMyEvents(),
          bookingAPI.getMyBookings(),
        ]);
        setEvents(evRes.data);
        setBookings(bkRes.data);
        if (user?.role === 'VENDOR') {
          try { const vRes = await vendorAPI.getMyProfile(); setVendorProfile(vRes.data); } catch {}
        }
      } finally { setLoading(false); }
    };
    load();
  }, [user]);

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
    </div>
  );

  const totalBudget = events.reduce((s, e) => s + (e.budget || 0), 0);
  const totalSpent = events.reduce((s, e) => s + ((e.budget || 0) - (e.remainingBudget || 0)), 0);
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;

  return (
    <div className="container page-content">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', background: 'var(--bg-elevated)', padding: '2rem', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', backgroundImage: 'url("https://images.unsplash.com/photo-1505362846-9538a7c18ed5?w=800&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', WebkitMaskImage: 'linear-gradient(to right, transparent, black)', maskImage: 'linear-gradient(to right, transparent, black)', opacity: 0.8 }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', fontWeight: 700 }}>
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Here's your event planning overview</p>
        </div>
        <Link to="/events/new" className="btn btn-primary" style={{ position: 'relative', zIndex: 1 }}>
          <Plus size={16} /> New Event
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[
          { icon: <CalendarDays size={20} />, val: events.length, label: 'Total Events', color: '#7c5cfc' },
          { icon: <BookOpen size={20} />, val: confirmedBookings, label: 'Active Bookings', color: '#22d3a1' },
          { icon: <DollarSign size={20} />, val: `₹${(totalBudget/1000).toFixed(0)}K`, label: 'Total Budget', color: '#5b8af0' },
          { icon: <TrendingUp size={20} />, val: `₹${(totalSpent/1000).toFixed(0)}K`, label: 'Total Spent', color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="dashboard-stat">
            <div className="dashboard-stat-icon" style={{ background: `${s.color}20` }}>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div>
              <div className="dashboard-stat-value">{s.val}</div>
              <div className="dashboard-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Upcoming Events */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} style={{ color: 'var(--accent-primary)' }} /> Your Events
            </h3>
            <Link to="/events" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          {events.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div style={{ background: 'var(--bg-elevated)', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--accent-primary)', border: '1px solid var(--border-subtle)' }}>
                <CalendarDays size={24} />
              </div>
              <div className="empty-title">No events yet</div>
              <p style={{ fontSize: '0.85rem' }}>Create your first event to get started</p>
              <Link to="/events/new" className="btn btn-primary btn-sm" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                <Plus size={14} /> Create Event
              </Link>
            </div>
          ) : (
            <div>
              {events.slice(0, 5).map(ev => (
                <Link key={ev.id} to={`/events/${ev.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)',
                    textDecoration: 'none', transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-glass)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-md)',
                    background: 'var(--gradient-primary)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0
                  }}>
                    {ev.type === 'WEDDING' ? <Heart size={20} /> : ev.type === 'BIRTHDAY_PARTY' ? <Cake size={20} /> : ev.type === 'CORPORATE_EVENT' ? <Briefcase size={20} /> : <PartyPopper size={20} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', truncate: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{ev.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ev.date} · {ev.location}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-success)' }}>
                      ₹{(ev.remainingBudget / 1000).toFixed(0)}K left
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      of ₹{(ev.budget / 1000).toFixed(0)}K
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardList size={18} style={{ color: 'var(--accent-primary)' }} /> Recent Bookings
            </h3>
            <Link to="/bookings" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          {bookings.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div style={{ background: 'var(--bg-elevated)', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--accent-primary)', border: '1px solid var(--border-subtle)' }}>
                <ClipboardList size={24} />
              </div>
              <div className="empty-title">No bookings yet</div>
              <p style={{ fontSize: '0.85rem' }}>Browse vendors to book services</p>
              <Link to="/vendors" className="btn btn-primary btn-sm" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                <Users size={14} /> Browse Vendors
              </Link>
            </div>
          ) : (
            <div>
              {bookings.slice(0, 5).map(b => (
                <div key={b.id} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {b.serviceName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.eventTitle}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', flexShrink: 0 }}>
                    <StatusBadge status={b.status} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-warning)', fontWeight: 600 }}>
                      ₹{b.cost?.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/vendors" className="btn btn-secondary"><Users size={16} /> Browse Vendors</Link>
        <Link to="/recommendations" className="btn btn-secondary"><Zap size={16} /> AI Recommendations</Link>
        <Link to="/compare" className="btn btn-secondary"><BarChart2 size={16} /> Compare Vendors</Link>
        {user?.role === 'VENDOR' && (
          <Link to="/vendor-profile" className="btn btn-primary"><Store size={16} /> Manage My Profile</Link>
        )}
      </div>
    </div>
  );
}
