import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { recommendationAPI, vendorAPI, eventAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Star, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ComparePage() {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(params.get('event') || '');
  const [vendors, setVendors] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add Vendor State
  const [searchKw, setSearchKw] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchErrorMsg, setSearchErrorMsg] = useState('');

  // Load user events for budget context
  useEffect(() => {
    if (user?.role === 'USER') {
      eventAPI.getMyEvents().then(r => {
        setEvents(r.data);
        const evId = params.get('event');
        if (evId) setSelectedEventId(evId);
        else if (r.data.length > 0) setSelectedEventId(r.data[0].id.toString());
      }).catch(() => {});
    }
  }, [user]);

  // Load vendors from URL params
  useEffect(() => {
    const vIds = params.get('vendors');
    if (!vIds) {
      setVendors([]);
      setComparison(null);
      return;
    }

    const idsList = vIds.split(',').map(Number).filter(n => !isNaN(n) && n > 0);
    if (idsList.length === 0) {
      setVendors([]);
      setComparison(null);
      return;
    }

    const loadVendors = async () => {
      setLoading(true);
      try {
        const vendorResponses = await Promise.all(
          idsList.map(id => vendorAPI.getById(id).then(r => r.data).catch(() => null))
        );
        const validVendors = vendorResponses.filter(v => v !== null);
        setVendors(validVendors);

        // Only call compare if we have at least 2 vendors
        if (validVendors.length >= 2) {
          const selectedEvent = events.find(e => String(e.id) === selectedEventId);
          const comparePayload = {
            vendorIds: validVendors.map(v => v.id),
            budget: selectedEvent?.remainingBudget ?? selectedEvent?.budget ?? null,
            eventCity: selectedEvent?.location ?? null
          };
          const { data } = await recommendationAPI.compare(comparePayload);
          setComparison(data);
        } else {
          setComparison(null);
        }
      } catch (err) {
        console.error('Compare error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadVendors();
  }, [params, events, selectedEventId]);

  const handleSearchVendor = async (e) => {
    e.preventDefault();
    if (!searchKw.trim()) return;
    try {
      const searchParams = { keyword: searchKw.trim() };
      
      if (selectedEventId) {
        const selectedEvent = events.find(ev => ev.id.toString() === selectedEventId);
        if (selectedEvent && selectedEvent.location) {
          searchParams.city = selectedEvent.location.split(',')[0].trim();
        }
      }
      
      const { data } = await vendorAPI.search(searchParams);
      setSearchResults(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length === 0) {
        setSearchErrorMsg(searchParams.city ? `No vendors found matching '${searchKw.trim()}' in ${searchParams.city}` : 'No vendors found matching your search');
      } else {
        setSearchErrorMsg('');
      }
    } catch {
      toast.error('Search failed');
    }
  };

  const addVendor = (id) => {
    const current = params.get('vendors') ? params.get('vendors').split(',').filter(Boolean) : [];
    if (current.includes(id.toString())) {
      toast.error('Vendor already added');
      return;
    }
    if (current.length >= 4) {
      toast.error('Can only compare max 4 vendors');
      return;
    }
    current.push(id.toString());
    const newParams = new URLSearchParams(params);
    newParams.set('vendors', current.join(','));
    setParams(newParams);
    setSearchKw('');
    setSearchResults([]);
    toast.success('Vendor added');
  };

  const removeVendor = (id) => {
    const current = (params.get('vendors') || '').split(',').filter(x => x !== id.toString() && x !== '');
    const newParams = new URLSearchParams(params);
    if (current.length > 0) {
      newParams.set('vendors', current.join(','));
    } else {
      newParams.delete('vendors');
    }
    setParams(newParams);
  };

  const selectedEvent = events.find(e => String(e.id) === selectedEventId);

  return (
    <div className="container page-content">
      <div style={{ background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url("/compare_bg.png") center/cover no-repeat', borderRadius: '16px', padding: '4.5rem 2rem', textAlign: 'center', marginBottom: '2rem', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>Compare Vendors</h1>
        <p style={{ color: '#e2e8f0', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          Side-by-side analysis tailored to your event budget and location.
        </p>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: '2rem', position: 'relative', zIndex: 10, padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', width: '100%' }}>
          {user?.role === 'USER' && (
            <div style={{ flex: 1, minWidth: 250 }}>
              <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Event Context</label>
              {events.length > 0 ? (
                <select
                  className="form-select"
                  value={selectedEventId}
                  onChange={e => setSelectedEventId(e.target.value)}
                >
                  <option value="">No event selected</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} (₹{(ev.remainingBudget ?? ev.budget)?.toLocaleString()})
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  No active events. <Link to="/events" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', padding: '0px 8px' }}>Create an event first</Link>
                </div>
              )}
            </div>
          )}
          <div style={{ flex: 2, minWidth: 300 }}>
            <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Add Vendor (Max 4)</label>
            <form onSubmit={handleSearchVendor} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input className="form-input" style={{ flex: 1 }} placeholder="Search vendor by name..." value={searchKw} onChange={e => { setSearchKw(e.target.value); setSearchErrorMsg(''); }} />
              <button type="submit" className="btn btn-secondary">Search</button>
            </form>
            {searchErrorMsg && (
              <div style={{ color: 'var(--accent-warning)', fontSize: '0.85rem', marginBottom: '0.5rem', marginTop: '-0.25rem', backgroundColor: 'var(--bg-elevated)', padding: '0.4rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1rem' }}>⚠️</span> {searchErrorMsg}
              </div>
            )}
            {searchResults.length > 0 && (
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', boxShadow: 'var(--shadow-md)', maxHeight: '200px', overflowY: 'auto' }}>
                {searchResults.map(v => {
                  const alreadyAdded = (params.get('vendors') || '').split(',').includes(v.id.toString());
                  return (
                    <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '4px', background: alreadyAdded ? 'rgba(16, 185, 129, 0.1)' : 'transparent', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                        {v.businessName}
                        <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem', fontSize: '0.8rem' }}>{v.category}</span>
                        <span style={{ marginLeft: '0.5rem', color: '#f59e0b', fontSize: '0.85rem' }}>★ {v.averageRating?.toFixed(1)}</span>
                      </span>
                      {alreadyAdded ? (
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-success)', fontWeight: '700' }}>Added ✓</span>
                      ) : (
                        <button className="btn btn-ghost btn-sm" onClick={() => addVendor(v.id)}><Plus size={14} /> Add</button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Selected vendors chips */}
        {vendors.length > 0 && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Comparing:</span>
            {vendors.map(v => (
              <div key={v.id} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)',
                background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)',
                fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)'
              }}>
                {v.businessName}
                <button onClick={() => removeVendor(v.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', padding: 0
                }} title="Remove">
                  <Minus size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="loading-container"><div className="spinner"></div></div>
      )}

      {!loading && vendors.length >= 2 && comparison && Array.isArray(comparison) ? (
        <div className="table-wrapper">
          <table className="compare-table">
            <thead>
              <tr>
                <th style={{ width: '20%', textAlign: 'left', background: 'var(--bg-card)' }}>Metric</th>
                {comparison.map((c, i) => {
                  const isBest = c.score === Math.max(...comparison.map(x => x.score));
                  return (
                    <th key={c.id} className={isBest ? 'best' : ''}>
                      <div style={{ minHeight: '32px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                        {isBest && (
                          <div className="badge badge-best-match" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}>
                            <Star size={14} fill="currentColor" /> BEST MATCH
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{c.businessName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>{c.category}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)' }}>AI Score</td>
                {comparison.map(c => (
                  <td key={c.id}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                      {Math.round((c.score || 0) * 100)}%
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ textAlign: 'left', fontWeight: 600 }}>Rating</td>
                {comparison.map(c => (
                  <td key={c.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                      <Star size={16} fill="var(--accent-warning)" color="var(--accent-warning)" />
                      <span style={{ fontWeight: 600 }}>{c.averageRating?.toFixed(1)}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({c.reviewCount})</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ textAlign: 'left', fontWeight: 600 }}>Experience</td>
                {comparison.map(c => <td key={c.id}>{c.experience} Years</td>)}
              </tr>
              <tr>
                <td style={{ textAlign: 'left', fontWeight: 600 }}>City</td>
                {comparison.map(c => <td key={c.id}>{c.city}</td>)}
              </tr>
              <tr>
                <td style={{ textAlign: 'left', fontWeight: 600 }}>Verified</td>
                {comparison.map(c => (
                  <td key={c.id}>
                    <span style={{ color: c.verified ? 'var(--accent-success)' : 'var(--text-muted)' }}>
                      {c.verified ? '✓ Verified' : '—'}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>Action</td>
                {comparison.map(c => (
                  <td key={c.id}>
                    <Link to={`/vendors/${c.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>View Profile</Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : !loading && vendors.length < 2 ? (
        <div className="empty-state" style={{ padding: '6rem 2rem' }}>
          <Plus size={32} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <div className="empty-title">
            {vendors.length === 0 ? 'Select vendors to compare' : 'Add one more vendor'}
          </div>
          <p>Search and add {vendors.length === 0 ? 'at least 2' : '1 more'} vendor{vendors.length === 0 ? 's' : ''} to see a side-by-side breakdown.</p>
        </div>
      ) : null}
    </div>
  );
}
