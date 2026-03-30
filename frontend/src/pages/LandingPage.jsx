import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Users, CalendarDays, Star, ShieldCheck, TrendingUp, ArrowRight, Wind, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: <CalendarDays size={24} />, title: 'Smart Event Planning', desc: 'Create and manage all your events in one place with intelligent scheduling.' },
  { icon: <Users size={24} />, title: 'Verified Vendor Network', desc: 'Browse hundreds of vetted vendors across all categories and cities.' },
  { icon: <Zap size={24} />, title: 'AI Recommendations', desc: 'Our scoring engine matches vendors to your budget and preferences.' },
  { icon: <TrendingUp size={24} />, title: 'Vendor Comparison', desc: 'Compare multiple vendors side-by-side with weighted scoring metrics.' },
  { icon: <ShieldCheck size={24} />, title: 'Secure Bookings', desc: 'Double-booking prevention and real-time budget tracking built in.' },
  { icon: <Heart size={24} />, title: 'Reviews & Ratings', desc: 'Transparent ratings with post-event reviews from real customers.' },
];

const EVENT_TYPES = [
  { label: 'Weddings', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&auto=format&fit=crop' },
  { label: 'Birthdays', img: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500&auto=format&fit=crop' },
  { label: 'Corporate', img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&auto=format&fit=crop' },
  { label: 'Social', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&auto=format&fit=crop' },
];

const SLIDESHOW_EVENTS = [
  {
    label: 'Weddings',
    tag: 'Eternal Moments',
    img: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Birthday Parties',
    tag: 'Celebrate Life',
    img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Corporate Events',
    tag: 'Impress Everyone',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Music Festivals',
    tag: 'Feel the Vibe',
    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Gala Dinners',
    tag: 'Elegance Defined',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&auto=format&fit=crop&q=80',
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [slideIndex, setSlideIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(prev => {
        setPrevIndex(prev);
        return (prev + 1) % SLIDESHOW_EVENTS.length;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      {/* === PREMIUM HERO === */}
      <section style={{ padding: '6rem 0 8rem', background: 'var(--gradient-hero)', overflow: 'hidden', position: 'relative' }}>
        {/* Soft Decorative Blobs */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '450px', height: '450px', background: 'var(--accent-secondary)', filter: 'blur(100px)', opacity: 0.2, borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '400px', height: '400px', background: 'var(--accent-primary)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%' }}></div>

        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ paddingRight: '1rem' }}>
            <h1 style={{ fontSize: 'clamp(3.5rem, 6vw, 5rem)', fontWeight: 900, lineHeight: '1.05', letterSpacing: '-1.5px', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
              Let's create <br />
              <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>beautiful</span> memories.
            </h1>

            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '95%', lineHeight: '1.7' }}>
              Vento brings the joy back into event planning. Discover top tier vendors, manage your budget flawlessly and bring your dream events to life without the stress.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '100px' }}>
                  Open Dashboard <ArrowRight size={20} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '100px' }}>
                    Start Planning Free <ArrowRight size={20} />
                  </Link>
                  <Link to="/vendors" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '100px', background: 'var(--bg-card)' }}>
                    Browse Vendors
                  </Link>
                </>
              )}
            </div>

            {/* Trust Metrics */}
            <div style={{ display: 'flex', gap: '3rem', marginTop: '4rem', paddingTop: '2rem', borderTop: '2px dashed rgba(0,0,0,0.05)' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>500+</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Happy Vendors</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>10K+</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Events Planned</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>4.9/5</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Average Rating</div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', height: '650px', display: 'flex', alignItems: 'center' }}>
            <img src="https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=1200&auto=format&fit=crop" alt="Blonde Woman Laughing at Party" style={{ position: 'absolute', top: '5%', right: 0, width: '75%', height: '60%', objectFit: 'cover', objectPosition: 'center top', borderRadius: '3rem', boxShadow: 'var(--shadow-lg)', zIndex: 2 }} />
            <img src="https://images.pexels.com/photos/12887817/pexels-photo-12887817.jpeg" alt="Outdoor Social Atmosphere" style={{ position: 'absolute', bottom: '10%', left: 0, width: '60%', height: '55%', objectFit: 'cover', borderRadius: '3rem', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', zIndex: 3, border: '12px solid #fff' }} />
          </div>
        </div>
      </section>

      {/* === VISUAL EVENT TYPES === */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--text-primary)' }}>We Do It All</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '1rem auto 0' }}>From intimate gatherings to massive corporate galas, find the perfect vendors and venues for any occasion.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {EVENT_TYPES.map(et => (
              <Link key={et.label} to={`/vendors?category=${et.label.toUpperCase()}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ position: 'relative', height: '350px', borderRadius: '2rem', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${et.img})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.5s ease' }}></div>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}></div>
                  <h3 style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: '#fff', fontSize: '1.8rem', fontWeight: 800 }}>{et.label}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === AI PICKS SECTION === */}
      <section style={{ padding: '8rem 0', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120%', height: '120%', background: 'var(--accent-primary)', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%', zIndex: 0 }}></div>
            <img
              src="https://media.istockphoto.com/id/975796400/photo/bride-and-groom-with-guests-at-wedding-reception-outside-in-the-backyard.jpg?s=612x612&w=0&k=20&c=dz_LNtVSjaPQH_DazmQOV3NBP8xdlbnKbBDEtM6LCB0="
              alt="AI Recommendations"
              style={{ width: '100%', borderRadius: '3rem', boxShadow: 'var(--shadow-lg)', position: 'relative', zIndex: 1, border: '1px solid var(--border-accent)' }}
            />
          </div>
          <div>

            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1.5rem' }}>Personalized <span style={{ color: 'var(--accent-primary)' }}>AI Picks</span></h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              Say goodbye to endless scrolling. Vento's intelligent scoring algorithm analyzes your budget, guest count and style preferences to hand-pick the top 3 vendors who actually fit your vision.
            </p>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {[
                { title: 'Weighted Matching', desc: 'Values are calculated based on real-time availability and historical performance.' },
                { title: 'Budget Alignment', desc: 'Only see vendors that fit within your specified financial guardrails.' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--accent-primary)', marginTop: '0.2rem' }}><ShieldCheck size={24} /></div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{item.title}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === VENDOR COMPARISON SECTION === */}
      <section style={{ padding: '8rem 0', background: 'var(--bg-primary)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <div style={{ order: window.innerWidth < 768 ? 0 : 2, position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120%', height: '120%', background: 'var(--accent-secondary)', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%', zIndex: 0 }}></div>
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop"
              alt="Vendor Comparison"
              style={{ width: '100%', borderRadius: '3rem', boxShadow: 'var(--shadow-lg)', position: 'relative', zIndex: 1, border: '1px solid var(--border-accent)' }}
            />
          </div>
          <div style={{ order: window.innerWidth < 768 ? 1 : 1 }}>

            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1.5rem' }}>Side-by-Side <span style={{ color: 'var(--accent-secondary)' }}>Analysis</span></h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              Remove the guesswork from your planning. Compare multiple vendors across 15+ key performance metrics including response time, package flexibility, and verified guest satisfaction scores.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['Pricing Transparency', 'Responsive Ratings', 'Policy Comparison', 'Service Quality'].map(tag => (
                <div key={tag} style={{ padding: '0.6rem 1.2rem', borderRadius: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* === PREMIUM FEATURES === */}
      <section style={{ padding: '8rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem' }}>

            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, maxWidth: '700px' }}>Everything you need to execute flawlessly</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)', transition: 'all 0.3s ease' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
                <div style={{ width: 64, height: 64, borderRadius: '1.5rem', background: 'var(--gradient-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>
                  {f.icon}
                </div>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{f.title}</h4>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS SECTION === */}
      <section style={{ padding: '8rem 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900 }}>What our <span style={{ color: 'var(--accent-primary)' }}>community</span> says</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '1rem auto 0' }}>Join over 10,000 satisfied planners who found their perfect match on Vento.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
            {[
              { name: 'Sarah Jenkins', role: 'Wedding Planner', quote: 'Vento completely changed how I source vendors. The AI recommendations are surprisingly accurate and save me hours of research time.', img: 'https://i.pravatar.cc/150?u=sarah' },
              { name: 'Michael Chen', role: 'Corporate Event Manager', quote: 'The vendor comparison tool is essential for my reports. Being able to show clients side-by-side data makes decision-making so much faster.', img: 'https://i.pravatar.cc/150?u=michael' },
              { name: 'Elena Rodriguez', role: 'Birthday Host', quote: 'I was overwhelmed planning my 30th until I found Vento. The platform is beautiful, easy to use, and led me to the best caterers in town.', img: 'https://i.pravatar.cc/150?u=elena' }
            ].map((t, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', padding: '3rem', borderRadius: '3rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ position: 'absolute', top: '1.5rem', right: '2rem', color: 'var(--accent-primary)', opacity: 0.1 }}><Star size={64} fill="currentColor" /></div>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={t.img} alt={t.name} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{t.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === BEAUTIFUL CTA === */}
      {!isAuthenticated && (
        <section style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden', minHeight: '600px', display: 'flex', alignItems: 'center' }}>

          {/* Slideshow background layers — true CSS cross-dissolve */}
          {SLIDESHOW_EVENTS.map((slide, i) => {
            const isActive = i === slideIndex;
            const isLeaving = i === prevIndex && prevIndex !== slideIndex;
            if (!isActive && !isLeaving) return null;
            return (
              <div
                key={slide.label}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url("${slide.img}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  zIndex: isActive ? 1 : 0,
                  animation: isActive
                    ? 'slide-fade-in 1.6s cubic-bezier(0.4,0,0.2,1) forwards'
                    : 'slide-fade-out 1.4s cubic-bezier(0.4,0,0.2,1) forwards',
                }}
              />
            );
          })}

          {/* Rich multi-layer gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(10,10,20,0.82) 0%, rgba(20,12,30,0.65) 50%, rgba(10,10,20,0.78) 100%)',
            zIndex: 1,
          }} />
          {/* Bottom vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center bottom, rgba(0,0,0,0.45) 0%, transparent 70%)',
            zIndex: 1,
          }} />


          {/* Main content */}
          <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '820px' }}>
            {/* Animated event type label — remounts on each slide for fresh CSS animation */}
            <p
              key={`label-${slideIndex}`}
              style={{
                fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.82)',
                marginBottom: '1.2rem',
                textShadow: '0 0 30px rgba(255,255,255,0.25)',
                userSelect: 'none',
                animation: 'text-fade-in 1.2s cubic-bezier(0.4,0,0.2,1) forwards',
                opacity: 0,
              }}
            >
              &nbsp;{SLIDESHOW_EVENTS[slideIndex].label}&nbsp;
            </p>

            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 900,
              marginBottom: '1.5rem',
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              textShadow: '0 2px 30px rgba(0,0,0,0.4)',
            }}>Ready to celebrate?</h2>

            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255,255,255,0.78)',
              marginBottom: '3rem',
              lineHeight: 1.7,
              maxWidth: '620px',
              margin: '0 auto 3rem',
            }}>
              Join thousands of event planners using Vento to create unforgettable experiences. Your perfect event is just a few clicks away.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary" style={{
                padding: '1.25rem 3rem', fontSize: '1.15rem', borderRadius: '100px',
                boxShadow: '0 8px 40px rgba(255,107,107,0.45)',
              }}>
                Start Planning — It's Free <ArrowRight size={20} />
              </Link>
              <Link to="/register?role=VENDOR" style={{
                padding: '1.25rem 3rem', fontSize: '1.15rem', borderRadius: '100px',
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                color: '#fff',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'background 0.2s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              >
                Join as Vendor
              </Link>
            </div>

            {/* Slide dot indicators */}
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginTop: '3.5rem' }}>
              {SLIDESHOW_EVENTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  style={{
                    width: i === slideIndex ? 28 : 8,
                    height: 8,
                    borderRadius: '100px',
                    background: i === slideIndex ? 'var(--accent-primary)' : 'rgba(255,255,255,0.35)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                    boxShadow: i === slideIndex ? '0 0 12px var(--accent-primary)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          <style>{`
            @keyframes slide-fade-in {
              0%   { opacity: 0; transform: scale(1.06); }
              100% { opacity: 1; transform: scale(1.03); }
            }
            @keyframes slide-fade-out {
              0%   { opacity: 1; transform: scale(1.03); }
              100% { opacity: 0; transform: scale(1.00); }
            }
            @keyframes text-fade-in {
              0%   { opacity: 0; transform: translateY(10px); letter-spacing: 0.55em; }
              60%  { opacity: 1; }
              100% { opacity: 0.82; transform: translateY(0); letter-spacing: 0.35em; }
            }
            @keyframes pulse-dot {
              0%, 100% { opacity: 1; transform: scale(1); }
              50%       { opacity: 0.5; transform: scale(0.75); }
            }
          `}</style>
        </section>
      )}

      {/* Footer */}
      <footer style={{ background: 'var(--bg-card)', paddingTop: '4rem', paddingBottom: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="logo" style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
              <Wind strokeWidth={3} size={28} /> vento
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '400px', marginBottom: '2rem' }}>
              The smartest, happiest way to plan extraordinary events and discover premium vendors.
            </p>
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', fontWeight: 600 }}>
              <Link to="/terms" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Terms of Service</Link>
              <Link to="/privacy" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link to="/contact" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Contact Us</Link>
            </div>
            <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)', marginBottom: '2rem' }}></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              © 2026 Vento Inc. All rights reserved. | Location: Alpha 2, Greater Noida | supportatvento@gmail.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
