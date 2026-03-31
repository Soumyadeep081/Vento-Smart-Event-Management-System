import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Mail, Shield, Calendar, Edit2, ArrowLeft, Save, X, Phone } from 'lucide-react';
import { userAPI } from '../api/client';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  const syncProfile = async () => {
    try {
      const { data } = await userAPI.getProfile();
      updateUser(data);
    } catch (err) {
      console.error('Failed to sync profile', err);
    }
  };

  useState(() => {
    syncProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.updateProfile(form);
      // Backend returns AuthResponse with updated user (without token)
      updateUser({ name: data.name, phone: data.phone });
      setIsEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-content" style={{ maxWidth: '800px' }}>
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem', textDecoration: 'none' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'var(--gradient-primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#fff',
            fontSize: '2rem', fontWeight: 900
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{user?.name}</h1>
            <span className="badge badge-secondary">{user?.role}</span>
          </div>
          {!isEditing ? (
            <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>
              <Edit2 size={14} /> Edit
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={loading}>
                <Save size={14} /> {loading ? 'Saving...' : 'Save'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsEditing(false)}>
                <X size={14} /> Cancel
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="form-group">
              <label className="form-label">Username / Name</label>
              {isEditing ? (
                <input 
                  className="form-input" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="Enter full name"
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <User size={18} style={{ color: 'var(--text-muted)' }} />
                  {user?.name}
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                <Mail size={18} />
                {user?.email}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Phone Number
                {user?.phone && !user?.phoneVerified && !isEditing && (
                  <button 
                    onClick={async () => {
                      try {
                        const {data} = await userAPI.verifyPhone();
                        updateUser(data);
                        toast.success('Phone verified!');
                      } catch (e) { toast.error('Verification failed'); }
                    }}
                    style={{ fontSize:'0.7rem', color:'var(--accent-primary)', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}
                  >
                    Verify Now
                  </button>
                )}
              </label>
              {isEditing ? (
                <input 
                  className="form-input" 
                  value={form.phone} 
                  onChange={e => setForm({...form, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <Phone size={18} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ flex:1 }}>{user?.phone || 'Not set'}</span>
                  {user?.phoneVerified && <CheckCircle size={14} color="var(--accent-success)" />}
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Account Status</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                <Shield size={18} style={{ color: 'var(--accent-success)' }} />
                Active
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Account ID: {user?.accountId}</p>
        </div>
      </div>
    </div>
  );
}
