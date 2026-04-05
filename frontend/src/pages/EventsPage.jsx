import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventAPI } from '../api/client';
import { Plus, Edit, Trash2, CalendarDays, MapPin, DollarSign, Heart, Cake, Briefcase, PartyPopper, Calendar } from 'lucide-react';
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

function EventFormModal({ event, onClose, onSave }) {
  const [form, setForm] = useState(event || {
    title: '', type: 'WEDDING', date: '', location: '', budget: '', description: '', customType: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (event?.id) {
        const { data } = await eventAPI.update(event.id, form);
        onSave(data, 'update');
        toast.success('Event updated!');
      } else {
        const { data } = await eventAPI.create(form);
        onSave(data, 'create');
        toast.success('Event created!');
      }
      onClose();
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      let errorMsg = 'Failed to save event';
      if (status === 401 || status === 403) {
        errorMsg = 'Session expired. Please log in again.';
      } else if (data?.message) {
        errorMsg = data.message;
      } else if (data?.errors) {
        errorMsg = Object.values(data.errors).join(', ');
      } else if (status) {
        errorMsg = `Server error (${status}). Please try again.`;
      }
      console.error('Event save error:', { status, data, err });
      toast.error(errorMsg);
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{event?.id ? 'Edit Event' : 'New Event'}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input className="form-input" required value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} placeholder="My Dream Wedding" />
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
              onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Grand Ballroom, Mumbai" />
          </div>
          <div className="form-group">
            <label className="form-label">Budget (₹)</label>
            <input type="number" className="form-input" required value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="500000" min="1" />
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
              {saving ? 'Saving...' : event?.id ? 'Update' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'new' | {event}
  const [deleting, setDeleting] = useState(null); // event id being deleted

  useEffect(() => {
    eventAPI.getMyEvents().then(r => setEvents(r.data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event? All associated bookings may be affected.')) return;
    setDeleting(id);
    try {
      await eventAPI.delete(id);
      setEvents(ev => ev.filter(e => e.id !== id));
      toast.success('Event deleted');
    } catch (err) {
      console.error('Delete error:', err);
      const msg = err.response?.data?.message || 'Failed to delete event. It may have active bookings.';
      toast.error(msg);
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = (data, action) => {
    if (action === 'create') setEvents(ev => [data, ...ev]);
    else setEvents(ev => ev.map(e => e.id === data.id ? data : e));
  };

  const budgetPercent = (ev) => {
    const spent = ev.budget - ev.remainingBudget;
    return Math.round((spent / ev.budget) * 100);
  };

  return (
    <div className="container page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>My Events</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{events.length} event{events.length !== 1 ? 's' : ''} planned</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('new')}>
          <Plus size={16} /> New Event
        </button>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner"></div></div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <div style={{ background: 'var(--bg-elevated)', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--accent-primary)', border: '1px solid var(--border-subtle)' }}>
            <CalendarDays size={24} />
          </div>
          <div className="empty-title">No events yet</div>
          <p>Create your first event to start planning</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setModal('new')}>
            <Plus size={16} /> Create Event
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {events.map(ev => {
            const pct = budgetPercent(ev);
            const imgSrc = EVENT_TYPE_IMAGES[ev.type] || EVENT_TYPE_IMAGES.CUSTOM;
            return (
              <div key={ev.id} className="vendor-card">
                <div style={{ height: '140px', overflow: 'hidden' }}>
                  <img
                    src={imgSrc}
                    alt={EVENT_TYPE_LABELS[ev.type] || 'Event'}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover', display: 'block'
                    }}
                  />
                </div>
                <div className="vendor-card-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--bg-elevated)', color: 'var(--accent-primary)' }}>
                      {ev.type === 'WEDDING' ? <Heart size={16} /> : ev.type === 'BIRTHDAY_PARTY' ? <Cake size={16} /> : ev.type === 'CORPORATE_EVENT' ? <Briefcase size={16} /> : <PartyPopper size={16} />}
                    </span>
                    <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                      {EVENT_TYPE_LABELS[ev.type] || ev.type}
                    </span>
                  </div>
                  <div className="vendor-name">{ev.title}</div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: '0.75rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <CalendarDays size={14} /> {ev.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={14} /> {ev.location}
                    </div>
                  </div>

                  {/* Budget bar */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Budget Used</span>
                      <span style={{ fontWeight: 600, color: pct > 80 ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
                        {pct}%
                      </span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill" style={{
                        width: `${pct}%`,
                        background: pct > 80 ? 'linear-gradient(135deg,#ef4444,#f59e0b)' : 'var(--gradient-primary)'
                      }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>₹{ev.remainingBudget?.toLocaleString()} left</span>
                      <span style={{ color: 'var(--text-muted)' }}>of ₹{ev.budget?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/events/${ev.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>View</Link>
                    <button className="btn btn-ghost btn-sm" onClick={() => setModal(ev)}>
                      <Edit size={14} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      disabled={deleting === ev.id}
                      onClick={() => handleDelete(ev.id)}
                    >
                      {deleting === ev.id ? '...' : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <EventFormModal
          event={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
