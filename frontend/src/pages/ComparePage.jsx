import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { recommendationAPI, vendorAPI, eventAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Star, Check, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ComparePage() {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const [eventData, setEventData] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add Vendor State
  const [searchKw, setSearchKw] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const evId = params.get('event');
    const vIds = params.get('vendors');

    const loadData = async () => {
      setLoading(true);
      try {
        if (evId) {
          const { data } = await eventAPI.getById(evId);
          setEventData(data);
        }
        if (vIds && evId) {
          const idsList = vIds.split(',').map(Number);
          const [vRes, cRes] = await Promise.all([
            Promise.all(idsList.map(id => vendorAPI.getById(id).then(r => r.data))),
            recommendationAPI.compare({ eventId: Number(evId), vendorIds: idsList })
          ]);
          setVendors(vRes);
          setComparison(cRes.data);
        }
      } catch (err) { } finally { setLoading(false); }
    };
    loadData();
  }, [params]);

  const handleSearchVendor = async (e) => {
    e.preventDefault();
    if (!searchKw) return;
    try {
      const { data } = await vendorAPI.search({ keyword: searchKw, size: 5 });
      setSearchResults(data);
    } catch {}
  };

  const addVendor = (id) => {
    const current = params.get('vendors') ? params.get('vendors').split(',') : [];
    if (current.includes(id.toString())) return;
    if (current.length >= 4) { toast.error('Can only compare max 4 vendors'); return; }
    current.push(id.toString());
    params.set('vendors', current.join(','));
    if (!params.get('event') && eventData) params.set('event', eventData.id.toString());
    setParams(params);
    setSearchKw('');
    setSearchResults([]);
  };

  const removeVendor = (id) => {
    const current = params.get('vendors').split(',').filter(x => x !== id.toString());
    params.set('vendors', current.join(','));
    setParams(params);
  };

  return (
    <div className="container page-content">
      <div className="page-header">
        <h1 className="page-title">Compare Vendors</h1>
        <p className="page-subtitle">Side-by-side analysis tailored to your event budget</p>
      </div>

      {(loading && !comparison) ? (
        <div className="loading-container"><div className="spinner"></div></div>
      ) : (
        <>
          {/* Controls */}
          <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', width: '100%' }}>
              {user?.role === 'USER' && (
              <div style={{ flex: 1, minWidth: 250 }}>
                <label className="form-label">Active Event Context</label>
                <div style={{ padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                  {eventData ? (
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{eventData.title}</strong>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Budget: ₹{eventData.budget?.toLocaleString()}</div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-warning)' }}>No event selected. Metrics will use defaults.</div>
                  )}
                </div>
              </div>
            )}
            <div style={{ flex: 2, minWidth: 300 }}>
              <label className="form-label">Add Vendor to Compare (Max 4)</label>
              <form onSubmit={handleSearchVendor} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input className="form-input" placeholder="Search by name..." value={searchKw} onChange={e => setSearchKw(e.target.value)} />
                <button type="submit" className="btn btn-secondary">Search</button>
              </form>
              {searchResults.length > 0 && (
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {searchResults.map(v => (
                    <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem' }}>{v.businessName} <Star style={{ display:'inline',color:'orange' }} size={12}/>{v.averageRating?.toFixed(1)}</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => addVendor(v.id)}><Plus size={14} /> Add</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>
          </div>

          {vendors.length > 0 && comparison ? (
            <div className="table-wrapper">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th style={{ width: '20%', textAlign: 'left', background: 'var(--bg-card)' }}>Metric</th>
                    {vendors.map(v => {
                      const analysis = comparison[v.id];
                      const isBestMatch = Math.max(...Object.values(comparison).map(x => x.totalScore)) === analysis.totalScore;
                      return (
                        <th key={v.id} className={isBestMatch ? 'best' : ''} style={{ position: 'relative' }}>
                          {isBestMatch && <div className="badge badge-best-match" style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: 'var(--radius-full)' }}><Star size={14} fill="currentColor" /> BEST MATCH</div>}
                          <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{v.businessName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal', marginBottom: '0.5rem' }}>{v.category}</div>
                          <button className="btn btn-ghost btn-sm" onClick={() => removeVendor(v.id)}><Minus size={14} /> Remove</button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)' }}>Total AI Score</td>
                    {vendors.map(v => (
                      <td key={v.id}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                          {Math.round(comparison[v.id].totalScore)}%
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', fontWeight: 600 }}>Rating</td>
                    {vendors.map(v => (
                      <td key={v.id}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                          <Star size={16} fill="var(--accent-warning)" color="var(--accent-warning)" />
                          <span style={{ fontWeight: 600 }}>{v.averageRating?.toFixed(1)}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({v.reviewCount})</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', fontWeight: 600 }}>Experience</td>
                    {vendors.map(v => <td key={v.id}>{v.experience} Years</td>)}
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', fontWeight: 600 }}>Available Services</td>
                    {vendors.map(v => (
                      <td key={v.id}>
                        {comparison[v.id].bestServiceId ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span style={{ color: 'var(--accent-success)', fontWeight: 600, fontSize:'1.1rem' }}>
                              ₹{comparison[v.id].bestServicePrice?.toLocaleString()}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Best Fit Package</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>No suitable packages</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left' }}>Action</td>
                    {vendors.map(v => (
                      <td key={v.id}>
                        <Link to={`/vendors/${v.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>View Profile</Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '6rem 2rem' }}>
              <Plus size={32} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <div className="empty-title">Select vendors to compare</div>
              <p>Search and add up to 4 vendors to see a side-by-side breakdown.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
