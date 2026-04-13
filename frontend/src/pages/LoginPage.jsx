import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, GOOGLE_CLIENT_ID } from '../context/AuthContext';
import { Eye, EyeOff, Wind, Sparkles, SlidersHorizontal, CalendarCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [socialLoading, setSocialLoading] = useState('');
  const { login, socialLogin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  // ── Google Login ────────────────────────────────────────────────────────
  const handleGoogleLogin = () => {
    if (!window.google) {
      toast.error('Google SDK not loaded yet. Please try again.');
      return;
    }
    setSocialLoading('google');
    
    // Safety check: if callback never fires (e.g. popup closed or blocked)
    const timer = setTimeout(() => {
      setSocialLoading('');
    }, 15000);

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'email profile openid',
      callback: async (response) => {
        clearTimeout(timer);
        if (response.access_token) {
          try {
            await socialLogin(response.access_token, 'GOOGLE');
            toast.success('Welcome back!');
            navigate(from, { replace: true });
          } catch (err) {
            setError(err.response?.data?.message || 'Google sign-in failed');
            toast.error('Google sign-in failed');
          } finally {
            setSocialLoading('');
          }
        }
      },
      error_callback: () => {
        clearTimeout(timer);
        setSocialLoading('');
        toast('Google sign-in was cancelled.');
      }
    });
    client.requestAccessToken();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  // ── Facebook Login ──────────────────────────────────────────────────────
  const handleFacebookLogin = () => {
    if (!window.FB) {
      toast.error('Facebook SDK not loaded yet. Please try again.');
      return;
    }
    setSocialLoading('facebook');
    
    // Safety check: if callback never fires (e.g. popup closed or blocked)
    const timer = setTimeout(() => {
      setSocialLoading('');
    }, 15000);

    window.FB.login(
      async (fbResponse) => {
        clearTimeout(timer);
        if (fbResponse.status === 'connected') {
          try {
            await socialLogin(fbResponse.authResponse.accessToken, 'FACEBOOK');
            toast.success('Welcome back!');
            navigate(from, { replace: true });
          } catch (err) {
            setError(err.response?.data?.message || 'Facebook sign-in failed');
            toast.error('Facebook sign-in failed');
          } finally {
            setSocialLoading('');
          }
        } else {
          setSocialLoading('');
          toast('Facebook sign-in was cancelled.');
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--gradient-hero)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-15%', right: '-10%',
        width: '50vw', height: '50vw', maxWidth: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,107,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%',
        width: '45vw', height: '45vw', maxWidth: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,177,105,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Left branding panel (hidden on small screens) */}
      <div className="login-brand-panel" style={{
        flex: '0 0 42%',
        background: 'linear-gradient(150deg, #ff6b6b 0%, #ffb169 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '4rem 3.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles inside panel */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: 250, height: 250, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />

        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{
            fontFamily: 'var(--font-heading)', fontSize: '2rem',
            fontWeight: 900, color: '#fff', letterSpacing: '-1px',
            marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <Wind size={28} strokeWidth={2.5} />
            vento
          </div>
        </Link>

        <h2 style={{
          fontFamily: 'var(--font-heading)', color: '#fff',
          fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800,
          lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.5px',
        }}>
          Plan events<br />you'll never forget
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.7,
          maxWidth: 320, marginBottom: '2.5rem',
        }}>
          Discover top-rated vendors, compare services side‑by‑side, and get AI‑powered picks — all in one place.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { icon: <Sparkles size={16} strokeWidth={2.5} />, text: 'Smart AI vendor recommendations' },
            { icon: <SlidersHorizontal size={16} strokeWidth={2.5} />, text: 'Side-by-side vendor comparisons' },
            { icon: <CalendarCheck size={16} strokeWidth={2.5} />, text: 'Seamless booking management' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', flexShrink: 0,
              }}>{item.icon}</div>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', fontWeight: 500 }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo (only shows when panel is hidden) */}
          <div className="login-mobile-logo" style={{ textAlign: 'center', marginBottom: '2rem', display: 'none' }}>
            <Link to="/" style={{
              fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 900,
              color: 'var(--accent-primary)', letterSpacing: '-1px', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            }}>
              <Wind size={24} strokeWidth={2.5} />
              vento
            </Link>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 800,
              color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: '0.4rem',
            }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Sign in to continue to your account
            </p>
          </div>

          {/* Social Login Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button
              type="button"
              id="google-login-btn"
              onClick={handleGoogleLogin}
              disabled={!!socialLoading || loading}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.6rem', padding: '0.7rem 1rem',
                background: 'var(--bg-card)', border: '1.5px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)', cursor: socialLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9rem',
                color: 'var(--text-primary)', transition: 'all 0.2s',
                opacity: socialLoading === 'google' ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!socialLoading) { e.currentTarget.style.borderColor = 'rgba(66,133,244,0.5)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(66,133,244,0.12)'; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {socialLoading === 'google' ? (
                <span style={{ width: 18, height: 18, border: '2px solid #4285F4', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              )}
              Google
            </button>

            <button
              type="button"
              id="facebook-login-btn"
              onClick={handleFacebookLogin}
              disabled={!!socialLoading || loading}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.6rem', padding: '0.7rem 1rem',
                background: 'var(--bg-card)', border: '1.5px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)', cursor: socialLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9rem',
                color: 'var(--text-primary)', transition: 'all 0.2s',
                opacity: socialLoading === 'facebook' ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!socialLoading) { e.currentTarget.style.borderColor = 'rgba(24,119,242,0.5)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(24,119,242,0.12)'; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {socialLoading === 'facebook' ? (
                <span style={{ width: 18, height: 18, border: '2px solid #1877F2', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )}
              Facebook
            </button>
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem',
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
              or continue with email
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>

          {/* Email/Password Form */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)', padding: '2rem',
            boxShadow: 'var(--shadow-md)',
          }}>
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email" className="form-input" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Password</label>
                  <a href="#" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}
                    onClick={e => { e.preventDefault(); toast('Password reset coming soon!'); }}
                  >
                    Forgot password?
                  </a>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'} className="form-input"
                    placeholder="Enter your password"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    required style={{ paddingRight: '3rem' }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                      display: 'flex', alignItems: 'center',
                    }}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem', fontSize: '1rem' }}
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', color: 'var(--text-secondary)', fontSize: '0.93rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-brand-panel { display: none !important; }
          .login-mobile-logo { display: block !important; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
