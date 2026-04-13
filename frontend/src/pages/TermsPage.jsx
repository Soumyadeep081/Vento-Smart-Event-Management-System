import { Scale } from 'lucide-react';

export default function TermsPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '6rem' }}>
      
      <section style={{ padding: '6rem 0 4rem', position: 'relative', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>
            <Scale size={28} />
            <span style={{ fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Legal Documentation</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '1rem', color: 'var(--text-primary)' }}>Terms of Service</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Effective Date: April 2026
          </p>
        </div>
      </section>

      <section style={{ paddingTop: '5rem' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            
            <p style={{ marginBottom: '3rem', fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: '1.6' }}>
              Welcome to Vento. Please read these Terms of Service carefully before utilizing our platform to plan your events or list your services.
            </p>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.2rem', marginTop: '3rem' }}>1. Acceptance of Terms</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              By accessing, browsing, or using the Vento service, you acknowledge that you have read, understood, and agree to be legally bound by these Terms. If you do not agree with any provision of these terms, you must immediately cease using the platform.
            </p>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.2rem', marginTop: '3rem' }}>2. Vendor Agreements</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Service providers operating on Vento are independent contractors. Vento acts solely as an intermediary technology platform connecting event planners with vendors. Vento is not responsible for the direct execution, quality, or liability of event services unless explicitly stated in a supplementary agreement.
            </p>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.2rem', marginTop: '3rem' }}>3. User Conduct</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Integrity is the foundation of our community. You agree not to use the platform to solicit fraudulent bookings, manipulate the rating system, post malicious reviews, or communicate abusively with vendors, planners, or Vento staff. Any violation will result in immediate account termination.
            </p>

            <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border-subtle)', fontStyle: 'italic', fontSize: '0.95rem' }}>
              Vento reserves the right to modify these terms at any time. Continued use of the platform constitutes acceptance of any revisions.
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
