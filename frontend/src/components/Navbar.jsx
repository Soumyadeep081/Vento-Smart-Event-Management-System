import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import {
  CalendarDays, Users, Star, Zap, Bell, LogOut,
  LayoutDashboard, ShoppingBag, BookOpen, Menu, X, Wind, Sun, Moon
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = isAuthenticated ? [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/events', label: 'Events', icon: <CalendarDays size={16} /> },
    { to: '/vendors', label: 'Vendors', icon: <Users size={16} /> },
    { to: '/recommendations', label: 'AI Picks', icon: <Zap size={16} /> },
    { to: '/compare', label: 'Compare', icon: <Star size={16} /> },
    { to: '/bookings', label: 'Bookings', icon: <BookOpen size={16} /> },
  ] : [
    { to: '/vendors', label: 'Browse Vendors', icon: <Users size={16} /> },
    { to: '/recommendations', label: 'AI Picks', icon: <Zap size={16} /> },
  ];

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo" style={{ fontFamily: 'var(--font-heading)', fontWeight: '900', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
          <Wind size={24} strokeWidth={2.5} /> vento
        </Link>

        {/* Desktop Nav */}
        <ul className="nav-links">
          {navItems.map(item => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`nav-link ${isActive(item.to) ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {item.icon} {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          <button className="btn btn-ghost btn-sm" onClick={toggleTheme} style={{ padding: '0.4rem', borderRadius: '50%', minWidth: '36px', height: '36px' }}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          {isAuthenticated ? (
            <>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{user?.name}</span>
                <span className="badge badge-secondary" style={{ marginLeft: '0.5rem' }}>
                  {user?.role}
                </span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
