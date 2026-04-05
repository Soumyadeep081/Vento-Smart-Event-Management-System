import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, GOOGLE_CLIENT_ID } from '../context/AuthContext';
import { Eye, EyeOff, Wind, Users, Sparkles, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [sp] = useSearchParams();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    role: sp.get('role') || 'USER',
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [socialLoading, setSocialLoading] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [verifyEmail, setVerifyEmail] = useState('');
  const [otp, setOtp] = useState('');
  const { register, socialLogin, verifyOtp, resendOtp, loading } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignUp = () => {
    if (!window.google) {
      toast.error('Google SDK not loaded yet. Please try again.');
      return;
    }
    setSocialLoading('google');
    const timer = setTimeout(() => { setSocialLoading(''); }, 15000);
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'email profile openid',
      callback: async (response) => {
        clearTimeout(timer);
        if (response.access_token) {
          try {
            await socialLogin(response.access_token, 'GOOGLE', form.role);
            toast.success('Welcome to Vento!');
            navigate('/dashboard');
          } catch (err) {
            setError(err.response?.data?.message || 'Google sign-up failed');
            toast.error('Google sign-up failed');
          } finally { setSocialLoading(''); }
        }
      },
      error_callback: () => {
        clearTimeout(timer);
        setSocialLoading('');
        toast('Google sign-up was cancelled.');
      }
    });
    client.requestAccessToken();
  };

  const handleFacebookSignUp = () => {
    if (!window.FB) {
      toast.error('Facebook SDK not loaded yet. Please try again.');
      return;
    }
    setSocialLoading('facebook');
    const timer = setTimeout(() => { setSocialLoading(''); }, 15000);
    window.FB.login(
      async (fbResponse) => {
        clearTimeout(timer);
        if (fbResponse.status === 'connected') {
          try {
            await socialLogin(fbResponse.authResponse.accessToken, 'FACEBOOK', form.role);
            toast.success('Welcome to Vento!');
            navigate('/dashboard');
          } catch (err) {
            setError(err.response?.data?.message || 'Facebook sign-up failed');
            toast.error('Facebook sign-up failed');
          } finally { setSocialLoading(''); }
        } else {
          setSocialLoading('');
          toast('Facebook sign-up was cancelled.');
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      const res = await register(form);
      if (res && res.requireVerification) {
        setVerifyEmail(res.email);
        setStep('otp');
        toast.success(`Verification code sent to ${res.email}`);
      } else {
        toast.success('Welcome to Vento!');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    try {
      await verifyOtp(verifyEmail, otp);
      toast.success('Email verified! Welcome to Vento!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp(verifyEmail);
      toast.success('New OTP sent to your email');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const roleLabel = form.role === 'USER' ? 'Planner' : 'Vendor';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--gradient-hero)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Left branding panel */}
      <div className="register-brand-panel" style={{
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
          Your events,<br />elevated.
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.7,
          maxWidth: 320, marginBottom: '2.5rem',
        }}>
          Whether you're planning your dream event or growing your vendor business — Vento makes it effortless.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { icon: <Users size={16} strokeWidth={2.5} />, text: '2,000+ verified vendors' },
            { icon: <Sparkles size={16} strokeWidth={2.5} />, text: 'AI-matched recommendations' },
            { icon: <Shield size={16} strokeWidth={2.5} />, text: 'Secure booking & payments' },
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
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Mobile logo */}
          <div className="register-mobile-logo" style={{ textAlign: 'center', marginBottom: '2rem', display: 'none' }}>
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
              Get started
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Create your free account in seconds
            </p>
          </div>

          {/* Social buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button
              type="button" id="google-signup-btn" onClick={handleGoogleSignUp}
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
              type="button" id="facebook-signup-btn" onClick={handleFacebookSignUp}
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
              or sign up with email
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>

          {step === 'otp' ? (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)', padding: '2rem',
              boxShadow: 'var(--shadow-md)',
            }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Verify your email</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                We've sent a 6-digit code to <strong>{verifyEmail}</strong>. Please enter it below.
              </p>
              
              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleVerifyOtp}>
                <div className="form-group">
                  <label className="form-label">Verification Code</label>
                  <input
                    type="text" className="form-input" placeholder="000000"
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                    style={{ fontSize: '1.5rem', letterSpacing: '8px', textAlign: 'center' }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1rem', padding: '0.85rem', fontSize: '1rem' }}
                  disabled={loading}
                >
                  {loading ? 'Verifying…' : 'Verify Email'}
                </button>
              </form>
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button 
                  type="button" 
                  onClick={handleResendOtp}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: '600', cursor: 'pointer' }}
                  disabled={loading}
                >
                  Resend code
                </button>
                <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                  <button type="button" onClick={() => setStep('form')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
                    Use a different email
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)', padding: '2rem',
            boxShadow: 'var(--shadow-md)',
          }}>
            {error && <div className="alert alert-error">{error}</div>}

            {/* Role toggle — clean segmented control */}
            <div className="form-group">
              <label className="form-label">Account type</label>
              <div style={{
                display: 'flex',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                padding: '3px',
                border: '1px solid var(--border-subtle)',
              }}>
                {[
                  { value: 'USER', label: 'Event Planner' },
                  { value: 'VENDOR', label: 'Vendor' },
                ].map(r => {
                  const active = form.role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: r.value })}
                      style={{
                        flex: 1,
                        padding: '0.55rem 1rem',
                        borderRadius: 'calc(var(--radius-md) - 2px)',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontWeight: active ? 700 : 500,
                        fontSize: '0.88rem',
                        color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                        background: active ? 'var(--bg-card)' : 'transparent',
                        boxShadow: active ? '0 1px 3px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full name</label>
                  <input
                    type="text" className="form-input" placeholder="Alex Johnson"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone <span style={{ color: 'var(--text-muted)', textTransform: 'none', fontWeight: 400 }}>(optional)</span></label>
                  <input
                    type="tel" className="form-input" placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
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
                    placeholder="Min. 6 characters"
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
                {loading ? 'Creating account…' : `Create ${roleLabel} Account`}
              </button>
            </form>
          </div>
          )}

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem', lineHeight: 1.6 }}>
            By signing up you agree to our{' '}
            <Link to="/terms" style={{ color: 'var(--accent-primary)' }}>Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" style={{ color: 'var(--accent-primary)' }}>Privacy Policy</Link>.
          </p>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.93rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .register-brand-panel { display: none !important; }
          .register-mobile-logo { display: block !important; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
