import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI, bookingAPI, vendorAPI } from '../api/client';
import { CalendarDays, Plus, TrendingUp, BookOpen, Users, DollarSign, Heart, Cake, Briefcase, PartyPopper, ClipboardList, Zap, BarChart2, Store, ChevronRight } from 'lucide-react';

function StatusBadge({ status }) {
  const map = {
    CONFIRMED: { bg: '#e6f4ea', color: '#137333', text: 'Confirmed' },
    PENDING: { bg: '#fef7e0', color: '#b06000', text: 'Pending' },
    CANCELLED: { bg: '#fce8e6', color: '#c5221f', text: 'Cancelled' },
    COMPLETED: { bg: '#e8f0fe', color: '#1a73e8', text: 'Completed' }
  };
  const style = map[status] || { bg: '#f1f3f4', color: '#5f6368', text: status };
  return (
    <span style={{
      backgroundColor: style.bg,
      color: style.color,
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      {style.text}
    </span>
  );
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
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ borderTopColor: '#ff3f6c', width: '32px', height: '32px' }}></div>
      <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>Loading your dashboard...</p>
    </div>
  );

  const totalBudget = events.reduce((s, e) => s + (e.budget || 0), 0);
  const totalSpent = events.reduce((s, e) => s + ((e.budget || 0) - (e.remainingBudget || 0)), 0);
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: 'calc(100vh - 68px)', padding: '2rem 0', fontFamily: '"Inter", sans-serif' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* Header Section */}
        <div style={{ 
          backgroundColor: 'var(--bg-card)', 
          padding: '1.5rem 2rem', 
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
              Hello, {user?.name || 'User'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              Manage your events, bookings, and recommendations.
            </p>
          </div>
          <Link to="/events/new" style={{
            backgroundColor: 'var(--accent-primary)',
            color: '#fff',
            textDecoration: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '4px',
            fontWeight: '600',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-accent)'
          }}>
            <Plus size={16} /> Create New Event
          </Link>
        </div>

        {/* Quick Links / Categories */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
          gap: '1rem', 
          marginBottom: '1rem' 
        }}>
          {[
            { to: '/vendors', icon: <Users size={24} color="var(--accent-primary)" />, label: 'Browse Vendors', desc: 'Find perfect matches' },
            { to: '/recommendations', icon: <Zap size={24} color="var(--accent-warning)" />, label: 'AI Matches', desc: 'Smart suggestions' },
            { to: '/compare', icon: <BarChart2 size={24} color="var(--accent-success)" />, label: 'Compare', desc: 'Side-by-side view' },
            ...(user?.role === 'VENDOR' ? [{ to: '/vendor-profile', icon: <Store size={24} color="var(--accent-pink)" />, label: 'My Shop', desc: 'Manage your profile' }] : [])
          ].map((link, i) => (
            <Link key={i} to={link.to} style={{
              backgroundColor: 'var(--bg-card)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-subtle)',
              transition: 'transform 0.15s, box-shadow 0.15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
            >
              <div style={{ marginBottom: '0.75rem', background: 'var(--bg-elevated)', padding: '1rem', borderRadius: '50%' }}>
                {link.icon}
              </div>
              <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{link.label}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{link.desc}</span>
            </Link>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem' }}>
          
          {/* Left Sidebar: Account Overview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}>
               <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0', fontWeight: '600', textTransform: 'uppercase' }}>
                 Overview
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 {[
                   { label: 'Total Events', value: events.length, icon: <CalendarDays size={20} color="var(--accent-primary)" /> },
                   { label: 'Active Bookings', value: confirmedBookings, icon: <BookOpen size={20} color="var(--accent-success)" /> },
                   { label: 'Budget Limit', value: `₹${(totalBudget/1000).toFixed(0)}K`, icon: <DollarSign size={20} color="var(--accent-warning)" /> },
                   { label: 'Total Spent', value: `₹${(totalSpent/1000).toFixed(0)}K`, icon: <TrendingUp size={20} color="var(--accent-pink)" /> }
                 ].map((stat, i) => (
                   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '0.5rem', borderRadius: '4px' }}>
                       {stat.icon}
                     </div>
                     <div>
                       <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{stat.value}</div>
                       <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{stat.label}</div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Your Events block */}
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '600', color: 'var(--text-primary)' }}>My Events</h3>
                <Link to="/events" style={{ textDecoration: 'none', color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: '500' }}>View All</Link>
              </div>
              
              {events.length === 0 ? (
                <div style={{ padding: '3rem 2rem', textAlign: 'center', background: 'var(--bg-card)' }}>
                  <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CalendarDays size={32} color="var(--text-secondary)" />
                  </div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>No events planning right now</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Start your first event and find the best vendors.</p>
                  <Link to="/events/new" style={{
                    display: 'inline-flex', padding: '0.6rem 1.5rem', border: '1px solid var(--border-subtle)',
                    borderRadius: '4px', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>Start Planning</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {events.slice(0, 4).map((ev, i) => (
                    <Link key={ev.id} to={`/events/${ev.id}`} style={{
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem',
                      borderBottom: i < events.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      textDecoration: 'none', backgroundColor: 'transparent', transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ 
                        width: '48px', height: '48px', borderRadius: '4px', 
                        backgroundColor: 'var(--bg-elevated)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                        color: 'var(--accent-primary)'
                      }}>
                        {ev.type === 'WEDDING' ? <Heart size={24} /> : ev.type === 'BIRTHDAY_PARTY' ? <Cake size={24} /> : ev.type === 'CORPORATE_EVENT' ? <Briefcase size={24} /> : <PartyPopper size={24} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '500', fontSize: '1rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{ev.date} · {ev.location}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          ₹{(ev.remainingBudget / 1000).toFixed(0)}K
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>remaining</div>
                      </div>
                      <ChevronRight size={18} color="var(--text-secondary)" style={{ marginLeft: '1rem' }} />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Bookings block */}
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '600', color: 'var(--text-primary)' }}>Recent Orders</h3>
                <Link to="/bookings" style={{ textDecoration: 'none', color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: '500' }}>View All</Link>
              </div>

              {bookings.length === 0 ? (
                <div style={{ padding: '3rem 2rem', textAlign: 'center', background: 'var(--bg-card)' }}>
                  <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ClipboardList size={32} color="var(--text-secondary)" />
                  </div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>No recent orders</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Looks like you haven't booked any vendors yet.</p>
                  <Link to="/vendors" style={{
                    display: 'inline-flex', padding: '0.6rem 1.5rem', backgroundColor: 'var(--accent-primary)',
                    borderRadius: '4px', color: '#fff', textDecoration: 'none', fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>Browse Vendors</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {bookings.slice(0, 4).map((b, i) => (
                    <div key={b.id} style={{
                      display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 1.5rem',
                      borderBottom: i < bookings.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      backgroundColor: 'transparent'
                    }}>
                      <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--bg-elevated)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        <Store size={24} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '500', fontSize: '1rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.serviceName}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Event: {b.eventTitle}</div>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 }}>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>₹{b.cost?.toLocaleString()}</div>
                        <StatusBadge status={b.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}
