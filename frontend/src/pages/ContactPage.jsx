import { MapPin, Mail, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      
      {/* Premium Header */}
      <section style={{ padding: '6rem 0 4rem', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '10%', width: '300px', height: '300px', background: 'var(--accent-primary)', filter: 'blur(100px)', opacity: 0.1, borderRadius: '50%' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '1rem', color: 'var(--text-primary)' }}>Get in Touch</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Whether you have a question about our platform, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
            
            <div style={{ background: 'transparent', padding: '1rem' }}>
              <div style={{ padding: '1rem 0' }}>
                <MapPin size={24} color="var(--accent-primary)" style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Visit Us</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  Alpha 2, Greater Noida<br />
                  Uttar Pradesh, India<br />
                  201310
                </p>
              </div>
            </div>

            <div style={{ background: 'transparent', padding: '1rem' }}>
              <div style={{ padding: '1rem 0' }}>
                <Mail size={24} color="var(--accent-secondary)" style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Email Us</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  Our friendly team is here to help. Drop us a line anytime.
                </p>
                <a href="mailto:supportatvento@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>
                  supportatvento@gmail.com
                </a>
              </div>
            </div>

            <div style={{ background: 'transparent', padding: '1rem' }}>
              <div style={{ padding: '1rem 0' }}>
                <Phone size={24} color="var(--accent-success)" style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Call Us</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  Mon-Fri from 9am to 6pm IST. We're happy to chat.
                </p>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>+91 6207699168</span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

    </div>
  );
}
