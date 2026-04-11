import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import {
  CalendarDays, Users, Star, Zap, LogOut,
  LayoutDashboard, BookOpen, Wind, Sun, Moon, Menu, X, Palette
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = isAuthenticated ? [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/events', label: 'Events', icon: <CalendarDays size={18} /> },
    { to: '/vendors', label: 'Vendors', icon: <Users size={18} /> },
    { to: '/recommendations', label: 'AI Picks', icon: <Zap size={18} /> },
    { to: '/compare', label: 'Compare', icon: <Star size={18} /> },
    { to: '/bookings', label: 'Bookings', icon: <BookOpen size={18} /> },
  ] : [
    { to: '/vendors', label: 'Browse Vendors', icon: <Users size={18} /> },
    { to: '/recommendations', label: 'AI Picks', icon: <Zap size={18} /> },
  ];

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Left side: Logo */}
        <Link to="/" className="logo" style={{ fontFamily: 'var(--font-heading)', fontWeight: '900', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
          <Wind size={24} strokeWidth={2.5} /> vento
        </Link>

        {/* Right side: Profile + Menu */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', transition: 'opacity var(--transition-fast)' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.85rem', fontWeight: 800 }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{user?.name?.split(' ')[0]}</span>
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ border: 'none', background: 'none', padding: '0.25rem' }} title="Logout">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}

          {/* Hamburger Menu */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {menuOpen && (
              <div className="hamburger-menu" style={{ right: 0, left: 'auto' }}>
                <div className="hamburger-menu-section">
                  {navItems.map(item => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`hamburger-menu-item ${isActive(item.to) ? 'active' : ''}`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="hamburger-menu-divider"></div>
                <button className="hamburger-menu-item" onClick={toggleTheme}>
                  <Palette size={18} />
                  <span style={{ flex: 1 }}>Appearance</span>
                  <span className="theme-pill">
                    {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
                    {theme === 'light' ? 'Light' : 'Dark'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
