import { ShieldAlert } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '6rem' }}>
      
      <section style={{ padding: '6rem 0 4rem', position: 'relative', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--accent-warning)' }}>
            <ShieldAlert size={28} />
            <span style={{ fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Legal Documentation</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '1rem', color: 'var(--text-primary)' }}>Privacy Policy</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Effective Date: April 2026
          </p>
        </div>
      </section>

      <section style={{ paddingTop: '5rem' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            
            <p style={{ marginBottom: '3rem', fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: '1.6' }}>
              At Vento, we believe your data is exactly that—yours. We take the handling and protection of your personal information with absolute seriousness.
            </p>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.2rem', marginTop: '3rem' }}>1. Data Collection</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              We collect your name, email, and event details strictly to provide accurate vendor matches and secure bookings. We operate under a strict code of ethics and <strong>do not sell your personal data</strong> to external marketing agencies.
            </p>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.2rem', marginTop: '3rem' }}>2. Cookie Usage</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              We use lightweight, essential cookies to maintain your signed-in session securely and to ensure our platform operates effectively. No third-party tracking pixels or invasive retargeting tools are deployed without your explicit, opt-in consent.
            </p>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.2rem', marginTop: '3rem' }}>3. Secure Payments</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Financial integrity is our priority. We employ industry-standard, AES-256 encryption for managing budgets and processing external transactions. We do not process or store raw credit card details on our local servers; all transactions are vaulted securely by certified payment gateways.
            </p>

            <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border-subtle)', fontStyle: 'italic', fontSize: '0.95rem' }}>
              If you have any questions regarding how we process your personal data, please contact our Data Protection Officer via our Contact page.
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
