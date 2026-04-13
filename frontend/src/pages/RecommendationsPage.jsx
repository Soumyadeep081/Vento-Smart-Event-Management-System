import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventAPI, recommendationAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Search, Sparkles, MapPin, Star, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORY_IMAGES = {
  CATERING: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&auto=format&fit=crop',
  DECORATION: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&auto=format&fit=crop',
  PHOTOGRAPHY: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop',
  VIDEOGRAPHY: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=500&auto=format&fit=crop',
  MUSIC_DJ: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop',
  VENUE: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&auto=format&fit=crop',
  TRANSPORTATION: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=500&auto=format&fit=crop',
  LIGHTING: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop',
  FLORAL: 'https://images.unsplash.com/photo-1561181286-d3fee7d55ef6?w=500&auto=format&fit=crop',
  BAKERY: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&auto=format&fit=crop',
  ENTERTAINMENT: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop',
  OTHER: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop'
};

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [category, setCategory] = useState('CATERING');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'USER') {
      eventAPI.getMyEvents().then(r => {
        setEvents(r.data);
        if (r.data.length > 0) setSelectedEventId(r.data[0].id);
      }).catch(() => toast.error('Failed to load events'));
    }
  }, [user]);

  const handleGetRecommendations = async () => {
    if (!selectedEventId) return;
    setLoading(true);
    setRecommendations([]);
    setSearchMessage('');
    try {
      const selectedEvent = events.find(e => String(e.id) === String(selectedEventId));
      const budget = selectedEvent?.remainingBudget ?? selectedEvent?.budget;
      const city = selectedEvent?.location;
      const { data } = await recommendationAPI.recommend({
        budget: budget,
        category: category,
        city: city,
        topN: 5
      });
      setRecommendations(data);
      if (data.length === 0) {
        setSearchMessage('No suitable vendors found for this budget/category in the event location.');
      }
    } catch (err) {
      console.error('Recommendation error:', err);
      toast.error('Failed to fetch recommendations');
    } finally { setLoading(false); }
  };

  const handleCompare = () => {
    if (recommendations.length < 2) {
      toast.error('Need at least 2 vendors to compare'); return;
    }
    const vendorIds = recommendations.slice(0, 3).map(r => r.id);
    navigate(`/compare?event=${selectedEventId}&vendors=${vendorIds.join(',')}`);
  };

  if (user?.role === 'VENDOR') {
    return (
      <div className="container page-content empty-state">
        <Search size={48} color="var(--accent-primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
        <h2 className="empty-title">Vendor View</h2>
        <p>AI Recommendations are designed for Event Planners to find you based on their layout and budget.</p>
      </div>
    );
  }

  return (
    <div className="container page-content">
      {/* Engaging Hero Banner */}
      <div style={{ background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url("/recommendations_bg.png") center/cover no-repeat', borderRadius: 'var(--radius-lg)', padding: '5rem 2rem 6rem', textAlign: 'center', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)', marginBottom: '1rem', letterSpacing: '-0.5px' }}>Find Your Perfect Vendor Match</h1>
        <p style={{ color: '#e2e8f0', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          Our smart algorithm analyzes your remaining budget, location, and real user ratings to recommend the best professionals for your big event.
        </p>
      </div>

      <div className="card" style={{ maxWidth: '900px', margin: '-3rem auto 3rem', position: 'relative', zIndex: 10, padding: '2rem' }}>
        {events.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <div style={{ width: 64, height: 64, background: 'var(--bg-elevated)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--accent-primary)' }}>
               <Search size={32} />
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.2rem' }}>No events found</h4>
            <p style={{ color: 'var(--text-secondary)' }}>You need an active event to get tailored recommendations.</p>
            <Link to="/events/new" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex', padding: '0.8rem 2rem' }}>
              Create Event
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1.5rem', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Target Event</label>
              <select className="form-select" value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)}>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} (₹{ev.remainingBudget?.toLocaleString()} left)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Service Category</label>
              <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                {['CATERING', 'DECORATION', 'PHOTOGRAPHY', 'VIDEOGRAPHY', 'MUSIC_DJ', 'VENUE'].map(c => (
                  <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" onClick={handleGetRecommendations} disabled={loading || !selectedEventId} style={{ height: '42px', padding: '0 2rem' }}>
              {loading ? 'Analyzing...' : <><Search size={18} /> Find Matches</>}
            </button>
          </div>
        )}

        {searchMessage && !loading && (
          <div style={{ color: 'var(--accent-warning)', fontSize: '0.85rem', marginTop: '1.25rem', backgroundColor: 'var(--bg-elevated)', padding: '0.4rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1rem' }}>⚠️</span> {searchMessage}
          </div>
        )}
      </div>

      {recommendations.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem' }}>Top {recommendations.length} Matches</h2>
            {recommendations.length >= 2 && (
              <button className="btn btn-secondary" onClick={handleCompare}>
                Compare Top Results
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {recommendations.map((rec, i) => (
              <div key={rec.id} className="glass-card" style={{
                padding: 0, overflow: 'hidden', position: 'relative',
                border: i === 0 ? '2px solid var(--accent-primary)' : ''
              }}>
                {i === 0 && (
                  <div style={{
                    position: 'absolute', top: '1rem', left: '1rem', zIndex: 3,
                    background: 'var(--gradient-primary)', color: '#fff',
                    padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem'
                  }}>
                    <Sparkles size={12} /> Best Match
                  </div>
                )}

                {/* Image header with score overlay */}
                <div style={{
                  height: 180, position: 'relative',
                  backgroundImage: `url(${CATEGORY_IMAGES[category] || CATEGORY_IMAGES.OTHER})`,
                  backgroundSize: 'cover', backgroundPosition: 'center'
                }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%)' }}></div>
                  <div style={{
                    position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 2,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                    borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem',
                    display: 'flex', alignItems: 'baseline', gap: '0.3rem'
                  }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                      {Math.round((rec.score || 0) * 100)}%
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      match
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>{rec.businessName}</h3>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {rec.city || 'Local'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-warning)' }}><Star size={14} fill="currentColor" /> {(rec.averageRating || 0).toFixed(1)}/5.0</span>
                  </div>
                  {rec.experience > 0 && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      {rec.experience} {rec.experience === 1 ? 'year' : 'years'} experience
                    </div>
                  )}
                  <Link to={`/vendors/${rec.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    View Profile & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
