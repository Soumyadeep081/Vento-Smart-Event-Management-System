import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { vendorAPI } from '../api/client';
import { Search, SlidersHorizontal, Star, MapPin, Briefcase, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';

const CATEGORIES = [
  'All', 'CATERING', 'DECORATION', 'PHOTOGRAPHY', 'VIDEOGRAPHY',
  'MUSIC_DJ', 'VENUE', 'TRANSPORTATION', 'LIGHTING', 'FLORAL', 'BAKERY', 'ENTERTAINMENT', 'OTHER'
];



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

function StarDisplay({ rating }) {
  return (
    <div className="star-rating">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star ${i <= Math.round(rating) ? 'filled' : ''}`}>★</span>
      ))}
      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>
        ({rating?.toFixed(1)})
      </span>
    </div>
  );
}

export default function VendorsPage() {
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || '';

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '', category: '', city: initialCity, minRating: '', minExperience: ''
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

  const loadVendors = async () => {
    setLoading(true);
    try {
      const params = { page, size: 12 };
      const hasFilters = Object.values(filters).some(v => v);
      if (hasFilters) {
        const p = {};
        if (filters.keyword) p.keyword = filters.keyword;
        if (filters.category && filters.category !== 'All') p.category = filters.category;
        if (filters.city) p.city = filters.city;
        if (filters.minRating) p.minRating = filters.minRating;
        if (filters.minExperience) p.minExperience = filters.minExperience;
        const { data } = await vendorAPI.search(p);
        setVendors(data);
        setTotalPages(1);
      } else {
        const { data } = await vendorAPI.getAll({ page, size: 12, sortBy: 'averageRating', direction: 'desc' });
        setVendors(data.content || []);
        setTotalPages(data.totalPages || 1);
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { loadVendors(); }, [page]);

  const handleSearch = (e) => { e?.preventDefault(); setPage(0); loadVendors(); };

  return (
    <div className="container page-content">
      <div className="page-header">
        <h1 className="page-title">Browse Vendors</h1>
        <p className="page-subtitle">Discover and connect with top-rated event service providers</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: 250 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search vendors..."
              value={filters.keyword} onChange={e => setFilters({ ...filters, keyword: e.target.value })}
              style={{ paddingLeft: '2.5rem' }} />
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      <div style={{ display: showFilters ? 'grid' : 'block', gridTemplateColumns: '240px 1fr', gap: '1.5rem' }}>
        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel">
            <div className="filter-title"><SlidersHorizontal size={16} /> Filters</div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={filters.category}
                onChange={e => setFilters({ ...filters, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c === 'All' ? '' : c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-input" placeholder="e.g. Mumbai" value={filters.city}
                onChange={e => setFilters({ ...filters, city: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Min Rating</label>
              <select className="form-select" value={filters.minRating}
                onChange={e => setFilters({ ...filters, minRating: e.target.value })}>
                <option value="">Any</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Min Experience</label>
              <select className="form-select" value={filters.minExperience}
                onChange={e => setFilters({ ...filters, minExperience: e.target.value })}>
                <option value="">Any</option>
                <option value="2">2+ years</option>
                <option value="5">5+ years</option>
                <option value="10">10+ years</option>
              </select>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSearch}>
              Apply Filters
            </button>
            <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: '0.5rem' }}
              onClick={() => { setFilters({ keyword: '', category: '', city: '', minRating: '', minExperience: '' }); setPage(0); loadVendors(); }}>
              Clear All
            </button>
          </div>
        )}

        {/* Vendor Grid */}
        <div>
          {loading ? (
            <div className="loading-container"><div className="spinner"></div></div>
          ) : vendors.length === 0 ? (
            <div className="empty-state">
              <div style={{ background: 'var(--bg-elevated)', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--accent-primary)', border: '1px solid var(--border-subtle)' }}>
                <Search size={24} />
              </div>
              <div className="empty-title">No vendors found</div>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid-3">
              {vendors.map(v => (
                <Link key={v.id} to={`/vendors/${v.id}`} style={{ textDecoration: 'none' }}>
                  <div className="vendor-card">
                    <div className="vendor-card-header" style={{ height: '140px', backgroundImage: `url(${CATEGORY_IMAGES[v.category] || CATEGORY_IMAGES.OTHER})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    <div className="vendor-card-body">
                      <div className="vendor-name" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {v.businessName}
                        {v.verified && <BadgeCheck size={18} fill="#10B981" color="#ffffff" title="Verified" />}
                      </div>
                      <StarDisplay rating={v.averageRating} />
                      <div className="vendor-meta">
                        <span className="badge badge-primary">
                          {v.category?.replace(/_/g, ' ')}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <MapPin size={12} /> {v.city}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <Briefcase size={12} /> {v.experience}yr exp
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', marginBottom: '1rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {v.description}
                      </p>
                      <div className="btn btn-secondary btn-sm" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                        View Profile →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', alignItems: 'center' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                <ChevronLeft size={16} />
              </button>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Page {page + 1} of {totalPages}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
