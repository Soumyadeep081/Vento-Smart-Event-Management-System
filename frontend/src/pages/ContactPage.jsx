import { MapPin, Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container page-content">
      <div className="page-header" style={{ padding: '4rem 0 2rem', textAlign: 'center' }}>
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">We would love to hear from you</p>
      </div>
      
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="card card-elevated" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ background: 'var(--bg-elevated)', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent-primary)', border: '1px solid var(--border-subtle)' }}>
            <MapPin size={32} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Our Office</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Alpha 2, Greater Noida<br />
            Uttar Pradesh, India
          </p>
        </div>

        <div className="card card-elevated" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ background: 'var(--bg-elevated)', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent-primary)', border: '1px solid var(--border-subtle)' }}>
            <Mail size={32} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Email Support</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Reach out to our team at:<br />
            <a href="mailto:supportatvento@gmail.com" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>supportatvento@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
