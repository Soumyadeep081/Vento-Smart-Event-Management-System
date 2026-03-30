import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventAPI, recommendationAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Zap, Sparkles, MapPin, Star, Plus } from 'lucide-react';
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
    try {
      const { data } = await recommendationAPI.recommend({
        eventId: selectedEventId,
        category: category,
        limit: 5
      });
      setRecommendations(data);
      if (data.length === 0) toast.error('No suitable vendors found for this budget/category');
    } catch (err) {
      toast.error('Failed to fetch recommendations');
    } finally { setLoading(false); }
  };

  const handleCompare = () => {
    if (recommendations.length < 2) {
      toast.error('Need at least 2 vendors to compare'); return;
    }
    const vendorIds = recommendations.slice(0, 3).map(r => r.vendorId);
    navigate(`/compare?event=${selectedEventId}&vendors=${vendorIds.join(',')}`);
  };

  if (user?.role === 'VENDOR') {
    return (
      <div className="container page-content empty-state">
        <Zap size={48} color="var(--accent-primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
        <h2 className="empty-title">Vendor View</h2>
        <p>AI Recommendations are designed for Event Planners to find you based on their layout and budget.</p>
      </div>
    );
  }

  return (
    <div className="container page-content">
      <div className="page-header" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 3rem' }}>
        <div className="hero-eyebrow" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
          <Sparkles size={16} /> Beta Algorithm
        </div>
        <h1 className="page-title">AI Vendor Matching</h1>
        <p className="page-subtitle">
          Select an event. Our algorithm will analyze your remaining budget, location, and vendor ratings to suggest the best matches.
        </p>
      </div>

      <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto 3rem' }}>
        {events.length === 0 ? (
          <div className="empty-state">
            <p>You need an active event to get recommendations.</p>
            <Link to="/events/new" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Create Event First
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Target Event</label>
              <select className="form-select" value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)}>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} (₹{ev.remainingBudget?.toLocaleString()} left)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Service Category</label>
              <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                {['CATERING', 'DECORATION', 'PHOTOGRAPHY', 'VIDEOGRAPHY', 'MUSIC_DJ', 'VENUE'].map(c => (
                  <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" onClick={handleGetRecommendations} disabled={loading || !selectedEventId} style={{ height: 46 }}>
              {loading ? 'Analyzing...' : <><Zap size={16} /> Find Matches</>}
            </button>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {recommendations.map((rec, i) => (
              <div key={rec.vendorId} className="vendor-card" style={{
                display: 'flex', border: i === 0 ? '2px solid var(--accent-primary)' : '',
                position: 'relative', overflow: 'visible'
              }}>
                {i === 0 && (
                  <div style={{
                    position: 'absolute', top: '-12px', left: '2rem',
                    background: 'var(--gradient-primary)', color: '#fff',
                    padding: '0.2rem 1rem', borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem'
                  }}>
                    <Sparkles size={12} /> Best Match
                  </div>
                )}
                <div style={{ width: '180px', backgroundImage: `url(${CATEGORY_IMAGES[category] || CATEGORY_IMAGES.OTHER})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}></div>
                  <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', color: '#fff', borderRight: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                      {Math.round(rec.matchScore)}%
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Match Score
                    </div>
                  </div>
                </div>
                <div className="vendor-card-body" style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{rec.vendorName}</h3>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> Local</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-warning)' }}><Star size={14} fill="currentColor" /> {rec.ratingScore.toFixed(1)}/100</span>
                    </div>
                    {rec.bestService && (
                      <div style={{ background: 'var(--bg-elevated)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Recommended Package:</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ color: 'var(--text-primary)' }}>{rec.bestService.name}</strong>
                          <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>₹{rec.bestService.price?.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <Link to={`/vendors/${rec.vendorId}`} className="btn btn-primary">
                      View Profile & Book
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
