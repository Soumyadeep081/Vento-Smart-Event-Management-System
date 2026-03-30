export default function PrivacyPage() {
  return (
    <div className="container page-content">
      <div className="page-header" style={{ padding: '4rem 0 2rem' }}>
        <h1 className="page-title">Privacy Policy</h1>
        <p className="page-subtitle">Your privacy is important to us. Last updated: March 2026</p>
      </div>
      <div className="card card-elevated" style={{ padding: '3rem', fontSize: '1.05rem', lineHeight: '1.8' }}>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          At Vento, we take the handling of your personal information seriously.
        </p>
        <h3 style={{ marginBottom: '1rem' }}>1. Data Collection</h3>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          We collect your name, email, and event details to provide accurate vendor matches and secure bookings. We do not sell your personal data.
        </p>
        <h3 style={{ marginBottom: '1rem' }}>2. Cookie Usage</h3>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          We use simple cookies to maintain your signed-in session securely. No third-party tracking pixels are deployed without your consent.
        </p>
        <h3 style={{ marginBottom: '1rem' }}>3. Secure Payments</h3>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          We employ industry-standard encryption for managing budgets and external transactions. We do not store raw credit card details on our servers.
        </p>
      </div>
    </div>
  );
}
