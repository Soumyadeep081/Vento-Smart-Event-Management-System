import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext(null);

// ── Google Client ID ─────────────────────────────────────────────────────
// Replace with your real Google OAuth2 Client ID
export const GOOGLE_CLIENT_ID = '125964361949-qem2u52v72av953jgks2t2t729hvpu88.apps.googleusercontent.com';

// ── Facebook App ID ───────────────────────────────────────────────────────
// Replace with your real Facebook App ID
export const FACEBOOK_APP_ID = '2057538768522113';

/**
 * Decode a JWT and check whether it has expired.
 * Returns true if the token is missing, malformed, or past its `exp` time.
 */
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // `exp` is in seconds; Date.now() is in milliseconds
    return !payload.exp || payload.exp * 1000 < Date.now();
  } catch {
    return true; // malformed token → treat as expired
  }
}

/** Clear auth data from localStorage */
function clearAuthStorage() {
  localStorage.removeItem('vento_token');
  localStorage.removeItem('vento_user');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('vento_token');
      if (isTokenExpired(token)) {
        clearAuthStorage();
        return null;
      }
      const stored = localStorage.getItem('vento_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      clearAuthStorage();
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // ── Periodic token-expiry check (every 60 s) ────────────────────────────
  const handleExpiry = useCallback(() => {
    const token = localStorage.getItem('vento_token');
    if (user && isTokenExpired(token)) {
      clearAuthStorage();
      setUser(null);
    }
  }, [user]);

  useEffect(() => {
    // Check immediately on mount as well
    handleExpiry();
    const interval = setInterval(handleExpiry, 60_000); // every 60 seconds
    return () => clearInterval(interval);
  }, [handleExpiry]);

  const _persist = (data) => {
    localStorage.setItem('vento_token', data.token);
    localStorage.setItem('vento_user', JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      if (data.requireVerification) {
        return data;
      }
      _persist(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await authAPI.register(payload);
      if (data.requireVerification) {
        return data;
      }
      _persist(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const { data } = await authAPI.verifyOtp({ email, otp });
      _persist(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email) => {
    setLoading(true);
    try {
      await authAPI.resendOtp({ email });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Social login / sign-up via Google or Facebook.
   * @param {string} token  – ID token (Google) or access token (Facebook)
   * @param {string} provider – "GOOGLE" | "FACEBOOK"
   * @param {string} role – "USER" | "VENDOR" (optional, for new accounts)
   */
  const socialLogin = async (token, provider, role = 'USER') => {
    setLoading(true);
    try {
      const { data } = await authAPI.socialLogin(token, provider, role);
      _persist(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('vento_token');
    localStorage.removeItem('vento_user');
    setUser(null);
  };

  const updateUser = (data) => {
    const existing = JSON.parse(localStorage.getItem('vento_user') || '{}');
    const updated = { ...existing, ...data };
    localStorage.setItem('vento_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, socialLogin, logout, updateUser, verifyOtp, resendOtp, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
