export default function TermsPage() {
  return (
    <div className="container page-content">
      <div className="page-header" style={{ padding: '4rem 0 2rem' }}>
        <h1 className="page-title">Terms of Service</h1>
        <p className="page-subtitle">Last updated: March 2026</p>
      </div>
      <div className="card card-elevated" style={{ padding: '3rem', fontSize: '1.05rem', lineHeight: '1.8' }}>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          Welcome to Vento. Please read these Terms of Service carefully before using our platform.
        </p>
        <h3 style={{ marginBottom: '1rem' }}>1. Acceptance of Terms</h3>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          By accessing or using the Vento service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
        </p>
        <h3 style={{ marginBottom: '1rem' }}>2. Vendor Agreements</h3>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          Providers operating on Vento are independent contractors. Vento is an intermediary platform and is not responsible for the direct execution of event services unless explicitly stated.
        </p>
        <h3 style={{ marginBottom: '1rem' }}>3. User Conduct</h3>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          You agree not to use the platform to solicit fraudulent bookings, post malicious reviews, or communicate abusively with vendors or users.
        </p>
      </div>
    </div>
  );
}
