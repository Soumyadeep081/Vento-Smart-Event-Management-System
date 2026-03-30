import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, GOOGLE_CLIENT_ID } from '../context/AuthContext';
import { Eye, EyeOff, CalendarDays, Store, Wind } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = [
  {
    value: 'USER',
    icon: <CalendarDays size={20} />,
    label: 'Event Planner',
    desc: 'Plan and manage your events',
    color: '#ff6b6b',
  },
  {
    value: 'VENDOR',
    icon: <Store size={20} />,
    label: 'Vendor',
    desc: 'Offer services to planners',
    color: '#ffb169',
  },
];

export default function RegisterPage() {
  const [sp] = useSearchParams();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    role: sp.get('role') || 'USER',
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [socialLoading, setSocialLoading] = useState('');
  const { register, socialLogin, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      await register(form);
      toast.success('Welcome to Vento!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  // ── Google Sign-Up ─────────────────────────────────────────────────────
  const handleGoogleSignUp = () => {
    if (!window.google) {
      toast.error('Google SDK not loaded yet. Please try again.');
      return;
    }
    setSocialLoading('google');
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          await socialLogin(response.credential, 'GOOGLE', form.role);
          toast.success('Welcome to Vento!');
          navigate('/dashboard');
        } catch (err) {
          setError(err.response?.data?.message || 'Google sign-up failed');
          toast.error('Google sign-up failed');
        } finally {
          setSocialLoading('');
        }
      },
    });
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setSocialLoading('');
      }
    });
  };

  // ── Facebook Sign-Up ────────────────────────────────────────────────────
  const handleFacebookSignUp = () => {
    if (!window.FB) {
      toast.error('Facebook SDK not loaded yet. Please try again.');
      return;
    }
    setSocialLoading('facebook');
    window.FB.login(
      async (fbResponse) => {
        if (fbResponse.status === 'connected') {
          try {
            await socialLogin(fbResponse.authResponse.accessToken, 'FACEBOOK', form.role);
            toast.success('Welcome to Vento!');
            navigate('/dashboard');
          } catch (err) {
            setError(err.response?.data?.message || 'Facebook sign-up failed');
            toast.error('Facebook sign-up failed');
          } finally {
            setSocialLoading('');
          }
        } else {
          setSocialLoading('');
          toast('Facebook sign-up was cancelled.');
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  const selectedRole = ROLES.find(r => r.value === form.role);

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
        position: 'absolute', top: '-15%', left: '-10%',
        width: '50vw', height: '50vw', maxWidth: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,177,105,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '45vw', height: '45vw', maxWidth: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,107,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Main container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}>
        <div style={{ width: '100%', maxWidth: 500 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link to="/" style={{
              fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 900,
              color: 'var(--accent-primary)', letterSpacing: '-1px', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              marginBottom: '1rem',
            }}>
              <Wind size={24} strokeWidth={2.5} />
              vento
            </Link>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800,
              color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: '0.4rem',
            }}>
              Create your account
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Join thousands of event planners and vendors
            </p>
          </div>

          {/* Social Sign Up Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <button
              type="button"
              id="google-signup-btn"
              onClick={handleGoogleSignUp}
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
              id="facebook-signup-btn"
              onClick={handleFacebookSignUp}
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
            display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem',
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
              or sign up with email
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>

          {/* Form Card */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)', padding: '2rem',
            boxShadow: 'var(--shadow-md)',
          }}>
            {error && <div className="alert alert-error">{error}</div>}

            {/* Role Selector */}
            <div className="form-group">
              <label className="form-label">I am a…</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {ROLES.map(r => {
                  const isSelected = form.role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: r.value })}
                      style={{
                        padding: '1rem 1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        background: isSelected
                          ? `linear-gradient(135deg, ${r.color}18 0%, ${r.color}0a 100%)`
                          : 'var(--bg-elevated)',
                        border: `2px solid ${isSelected ? r.color : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? `0 0 0 4px ${r.color}18` : 'none',
                      }}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                        background: isSelected ? `${r.color}22` : 'var(--bg-glass)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isSelected ? r.color : 'var(--text-muted)',
                        marginBottom: '0.6rem',
                        transition: 'all 0.2s',
                      }}>
                        {r.icon}
                      </div>
                      <div style={{
                        fontWeight: 700, fontSize: '0.93rem',
                        color: isSelected ? r.color : 'var(--text-primary)',
                        marginBottom: '0.2rem',
                      }}>{r.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        {r.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Name + Phone row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text" className="form-input" placeholder="Alex Johnson"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone <span style={{ color: 'var(--text-muted)', textTransform: 'none' }}>(optional)</span></label>
                  <input
                    type="tel" className="form-input" placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email" className="form-input" placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.25rem' }}>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                    style={{ paddingRight: '3rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                    }}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Password strength hint */}
                {form.password.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 99,
                        background: i < Math.min(Math.floor(form.password.length / 2), 4)
                          ? (form.password.length < 4 ? '#ef4444' : form.password.length < 8 ? '#f59e0b' : '#10b981')
                          : 'var(--border-subtle)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem', fontSize: '1rem' }}
                disabled={loading}
              >
                {loading ? 'Creating account…' : `Create ${selectedRole?.label || ''} Account`}
              </button>
            </form>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem', lineHeight: 1.6 }}>
            By creating an account, you agree to our{' '}
            <Link to="/terms" style={{ color: 'var(--accent-primary)' }}>Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" style={{ color: 'var(--accent-primary)' }}>Privacy Policy</Link>
          </p>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.93rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Sign in</Link>
          </p>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
