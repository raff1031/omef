import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BRAND = 'OMEF';
const PIVA = '01234567890';
const CITY = 'Basaluzzo (AL)';
const ROLE = 'Attrezzature Forestali per Escavatori';

const WORDS = ['taglia.', 'trincia.', 'produce.'];

const SERVICES = [
  {
    icon: '✂',
    color: '#C4924A',
    image: '/omef/images/categories/cesoie.svg',
    title: 'Cesoie & Trince Forestali',
    desc: 'Linea completa di cesoie idrauliche e trince a mazze/coltelli per escavatori mini da 1 a 20 tonnellate. Acciaio Hardox, geometria ottimizzata, manutenzione semplificata.',
    tags: ['Hardox', '1–20 ton', 'Rotazione 360°', 'Made in Italy'],
    href: '/catalogo?cat=cesoie',
  },
  {
    icon: '⌬',
    color: '#4ade80',
    image: '/omef/images/categories/legna.svg',
    title: 'Lavorazione Legna',
    desc: 'Spaccalegna idraulici e pinze rotanti per processazione e movimentazione del legname. Forza di spacco fino a 18 ton, presa sicura su materiale bagnato o ghiacciato.',
    tags: ['Spaccalegna', 'Pinze HD', '360° freno', 'Hardox'],
    href: '/catalogo?cat=legna',
  },
  {
    icon: '◈',
    color: '#f472b6',
    image: '/omef/images/categories/terreno.svg',
    title: 'Lavorazione Terreno',
    desc: 'Fresaceppi, barre falcianti e attrezzi per la preparazione del suolo. Eliminazione ceppi senza scavo, denti in carburo di tungsteno, profondità fino a 30 cm.',
    tags: ['Fresaceppi', 'Barra falciante', 'Tungsteno', 'Ø 90 cm'],
    href: '/catalogo?cat=terreno',
  },
];

const STATS = [
  { value: 45, suffix: '+', label: 'Anni di esperienza dal 1980' },
  { value: 15, suffix: '', label: 'Concessionari nazionali' },
  { value: 10, suffix: '+', label: 'Modelli attivi in catalogo' },
];

const TECHS = [
  'Made in Italy',
  'Acciaio Hardox',
  'Mini 1–20 ton',
  'Rotazione 360°',
  'Assistenza diretta',
  'Ricambi originali',
  'Custom on demand',
  'Test in cantiere',
  'CE certified',
];

const STEPS = [
  { num: '01', title: 'Consulenza', desc: 'Definiamo insieme l\'attrezzatura giusta per il tuo escavatore e il tuo cantiere.' },
  { num: '02', title: 'Configurazione', desc: 'Personalizziamo attacco rapido, impianto idraulico e accessori sulla tua macchina portatrice.' },
  { num: '03', title: 'Consegna', desc: 'Spedizione tracciata in tutta Italia con supporto all\'installazione presso il dealer.' },
  { num: '04', title: 'Assistenza', desc: 'Ricambi originali e supporto tecnico continuo per ogni anno di vita della tua attrezzatura.' },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HOOKS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function useReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, className: `rv${visible ? ' on' : ''}`, style: { transitionDelay: `${delay}ms` } };
}

function useCounter(target, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const step = Math.max(1, Math.ceil(target / 80));
    const id = setInterval(() => {
      setVal((v) => {
        if (v + step >= target) {
          clearInterval(id);
          return target;
        }
        return v + step;
      });
    }, 16);
    return () => clearInterval(id);
  }, [target, active]);
  return val;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CSS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

.omef-landing * { box-sizing: border-box; margin: 0; padding: 0; }
.omef-landing { font-family: 'Inter', system-ui, sans-serif; background: #0a1a0e; color: #F1F5F9; min-height: 100vh; line-height: 1.6; -webkit-font-smoothing: antialiased; }
.omef-landing h1, .omef-landing h2, .omef-landing h3 { font-family: 'Syne', sans-serif; font-weight: 800; letter-spacing: -0.02em; line-height: 1.05; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(48px); } to { opacity: 1; transform: translateY(0); } }
@keyframes floatA { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(40px, -30px) rotate(8deg); } }
@keyframes floatB { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-30px, 40px); } }
@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
@keyframes wordAnim { 0% { opacity: 0; transform: translateY(20px); } 15%, 85% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-20px); } }
@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.9; } }

.rv { opacity: 0; transform: translateY(28px); transition: opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
.rv.on { opacity: 1; transform: none; }

.omef-landing .nav-link { color: #b8c4ba; text-decoration: none; font-size: 14px; font-weight: 500; transition: color .2s; }
.omef-landing .nav-link:hover { color: #C4924A; }

.omef-landing .btn-primary { background: linear-gradient(135deg, #C4924A, #d4a050); color: #0a1a0e; border: none; padding: 14px 28px; border-radius: 10px; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 15px; cursor: pointer; transition: transform .25s, box-shadow .25s; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; }
.omef-landing .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(196, 146, 74, 0.35); }

.omef-landing .btn-ghost { background: transparent; color: #F1F5F9; border: 1px solid rgba(255,255,255,.18); padding: 14px 28px; border-radius: 10px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 15px; cursor: pointer; transition: all .25s; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; }
.omef-landing .btn-ghost:hover { border-color: #C4924A; background: rgba(196,146,74,.08); }

.omef-landing .service-card { background: rgba(15, 35, 22, 0.65); border: 1px solid rgba(255,255,255,.07); border-radius: 18px; overflow: hidden; transition: transform .35s cubic-bezier(.4,0,.2,1), border-color .35s, box-shadow .35s; }
.omef-landing .service-card:hover { transform: translateY(-6px); border-color: rgba(196,146,74,.4); box-shadow: 0 24px 60px rgba(0,0,0,.4), 0 0 0 1px rgba(196,146,74,.2); }
.omef-landing .service-card .service-image { width: 100%; height: 180px; object-fit: cover; display: block; transition: transform .5s; }
.omef-landing .service-card:hover .service-image { transform: scale(1.05); }

.omef-landing .step-card { background: rgba(15, 35, 22, 0.5); border: 1px solid rgba(255,255,255,.06); border-radius: 16px; padding: 28px; transition: border-color .3s, transform .3s; }
.omef-landing .step-card:hover { border-color: rgba(196,146,74,.35); transform: translateY(-4px); }

.omef-landing .tag-pill { display: inline-block; background: rgba(196,146,74,.08); color: #d4a050; padding: 5px 12px; border-radius: 999px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; margin: 4px 6px 0 0; border: 1px solid rgba(196,146,74,.15); }

.omef-landing .input { width: 100%; background: rgba(15, 35, 22, 0.6); border: 1px solid rgba(255,255,255,.08); color: #F1F5F9; padding: 14px 18px; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 15px; transition: border-color .2s, background .2s; outline: none; }
.omef-landing .input:focus { border-color: #C4924A; background: rgba(15, 35, 22, 0.85); }
.omef-landing .input::placeholder { color: #64748B; }

.omef-landing .ticker-track { display: flex; gap: 60px; white-space: nowrap; animation: ticker 40s linear infinite; will-change: transform; }
.omef-landing .ticker-item { font-size: 14px; color: #5a6c5e; font-weight: 500; letter-spacing: 0.05em; display: inline-flex; align-items: center; gap: 60px; }
.omef-landing .ticker-item::after { content: '◆'; color: rgba(196,146,74,.3); font-size: 8px; }

@media (prefers-reduced-motion: reduce) {
  .omef-landing * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}

@media (max-width: 768px) {
  .omef-nav-links { display: none !important; }
  .omef-hero-stats { grid-template-columns: 1fr !important; }
  .omef-stats-strip { grid-template-columns: 1fr !important; gap: 32px !important; }
}
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function HomePage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [formData, setFormData] = useState({ azienda: '', email: '', progetto: '' });
  const [submitted, setSubmitted] = useState(false);
  const [statsActive, setStatsActive] = useState(false);
  const statsRef = useRef(null);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cyclic word
  useEffect(() => {
    const id = setInterval(() => setWordIdx((i) => (i + 1) % WORDS.length), 2800);
    return () => clearInterval(id);
  }, []);

  // Stats observer
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const s1 = useReveal(0);
  const s2 = useReveal(120);
  const s3 = useReveal(240);
  const p1 = useReveal(0);
  const p2 = useReveal(100);
  const p3 = useReveal(200);
  const p4 = useReveal(300);
  const heroBadge = useReveal(0);
  const heroTitle = useReveal(150);
  const heroSub = useReveal(280);
  const heroCta = useReveal(400);

  function handleSubmit() {
    if (!formData.email.trim() || !formData.progetto.trim()) return;
    setSubmitted(true);
  }

  return (
    <div className="omef-landing">
      <style>{CSS}</style>

      {/* ━━━━━━━━━━ NAV STICKY ━━━━━━━━━━ */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? 'rgba(10, 26, 14, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,.06)' : '1px solid transparent',
          transition: 'background .3s, backdrop-filter .3s, border-color .3s',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#F1F5F9' }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: '-0.01em' }}>{BRAND}</span>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#C4924A', boxShadow: '0 0 12px #C4924A' }} />
          </Link>
          <div className="omef-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            <a href="#servizi" className="nav-link">Servizi</a>
            <a href="#processo" className="nav-link">Processo</a>
            <Link to="/catalogo" className="nav-link">Catalogo</Link>
            <Link to="/chi-siamo" className="nav-link">Chi Siamo</Link>
            <a href="#contatti" className="nav-link">Contatti</a>
            <button onClick={() => navigate('/demo')} className="btn-primary" style={{ padding: '10px 20px', fontSize: 13 }}>
              Inizia Ora →
            </button>
          </div>
        </div>
      </nav>

      {/* ━━━━━━━━━━ HERO ━━━━━━━━━━ */}
      <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '120px 24px 80px' }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(196,146,74,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,74,.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }} />
        {/* Orbs */}
        <div style={{
          position: 'absolute', top: '15%', right: '8%', width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,146,74,.25), transparent 65%)',
          filter: 'blur(50px)', animation: 'floatA 18s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '5%', width: 380, height: 380, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,222,128,.15), transparent 65%)',
          filter: 'blur(60px)', animation: 'floatB 22s ease-in-out infinite',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
          <div ref={heroBadge.ref} className={heroBadge.className} style={heroBadge.style}>
            <span style={{
              display: 'inline-block', padding: '8px 18px', borderRadius: 999,
              background: 'rgba(196,146,74,.1)', border: '1px solid rgba(196,146,74,.25)',
              color: '#d4a050', fontSize: 11, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 36,
            }}>
              📍 {CITY} · {ROLE} · P.IVA {PIVA}
            </span>
          </div>

          <h1 ref={heroTitle.ref} className={heroTitle.className} style={{
            ...heroTitle.style,
            fontSize: 'clamp(42px, 6.5vw, 82px)',
            marginBottom: 28,
            maxWidth: 900,
          }}>
            Il bosco con OMEF{' '}
            <span style={{ display: 'inline-block', position: 'relative', verticalAlign: 'baseline' }}>
              <span
                key={wordIdx}
                style={{
                  display: 'inline-block',
                  animation: 'wordAnim 2.8s ease-in-out infinite',
                  color: '#f0c070',
                  textShadow: '0 0 40px rgba(196, 146, 74, 0.5)',
                }}
              >
                {WORDS[wordIdx]}
              </span>
            </span>
          </h1>

          <p ref={heroSub.ref} className={heroSub.className} style={{
            ...heroSub.style,
            fontSize: 'clamp(16px, 1.5vw, 19px)',
            color: '#94a39a', maxWidth: 620, marginBottom: 44, lineHeight: 1.7,
          }}>
            Cesoie, trince, spaccalegna e attrezzature forestali Made in Italy dal 1980.
            Progettate per escavatori mini 1–20 ton, costruite per durare nel tempo.
          </p>

          <div ref={heroCta.ref} className={heroCta.className} style={{ ...heroCta.style, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <a href="#contatti" className="btn-primary">Parliamo del progetto →</a>
            <a href="#servizi" className="btn-ghost">Scopri i servizi</a>
          </div>

          {/* Hero stats */}
          <div className="omef-hero-stats" style={{
            marginTop: 80, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 760,
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: '20px 24px', borderRadius: 14,
                background: 'rgba(15,35,22,.55)', border: '1px solid rgba(255,255,255,.05)',
              }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 32, color: '#C4924A', lineHeight: 1 }}>
                  {s.value}{s.suffix}
                </div>
                <div style={{ fontSize: 13, color: '#94a39a', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          color: '#5a6c5e', fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          animation: 'bounce 2.4s ease-in-out infinite',
        }}>
          <span>Scorri</span>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
            <path d="M7 2v14M2 11l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      {/* ━━━━━━━━━━ TECH TICKER ━━━━━━━━━━ */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,.05)',
        borderBottom: '1px solid rgba(255,255,255,.05)',
        background: '#070f08', padding: '22px 0', overflow: 'hidden',
      }}>
        <div className="ticker-track">
          {[...TECHS, ...TECHS].map((t, i) => (
            <span key={i} className="ticker-item">{t}</span>
          ))}
        </div>
      </div>

      {/* ━━━━━━━━━━ SERVIZI ━━━━━━━━━━ */}
      <section id="servizi" style={{ padding: '120px 24px', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <span style={{
              display: 'inline-block', padding: '6px 14px', borderRadius: 999,
              background: 'rgba(196,146,74,.08)', color: '#d4a050',
              fontSize: 11, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 18,
            }}>
              Cosa facciamo
            </span>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 50px)', marginBottom: 18 }}>
              Tre linee di prodotto.<br />Una sola promessa.
            </h2>
            <p style={{ fontSize: 17, color: '#94a39a', maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
              Attrezzature professionali progettate, costruite e testate in Italia. Per ogni esigenza del bosco e del verde.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[s1, s2, s3].map((rv, i) => {
              const svc = SERVICES[i];
              return (
                <div key={i} ref={rv.ref} className={rv.className} style={rv.style}>
                  <Link to={svc.href} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div className="service-card">
                      <img src={svc.image} alt={svc.title} className="service-image" />
                      <div style={{ padding: 28 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 12,
                          background: `${svc.color}18`, color: svc.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 22, marginBottom: 18,
                          border: `1px solid ${svc.color}30`,
                        }}>
                          {svc.icon}
                        </div>
                        <h3 style={{ fontSize: 21, marginBottom: 12, color: '#F1F5F9' }}>{svc.title}</h3>
                        <p style={{ fontSize: 14.5, color: '#94a39a', lineHeight: 1.7, marginBottom: 18 }}>{svc.desc}</p>
                        <div>
                          {svc.tags.map((t, j) => (
                            <span key={j} className="tag-pill">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ STATS STRIP ━━━━━━━━━━ */}
      <section ref={statsRef} style={{
        padding: '80px 24px', background: 'linear-gradient(180deg, rgba(196,146,74,.05), rgba(196,146,74,.02))',
        borderTop: '1px solid rgba(196,146,74,.1)', borderBottom: '1px solid rgba(196,146,74,.1)',
      }}>
        <div className="omef-stats-strip" style={{
          maxWidth: 960, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, textAlign: 'center',
        }}>
          {STATS.map((s, i) => (
            <StatCounter key={i} target={s.value} suffix={s.suffix} label={s.label} active={statsActive} />
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━ PROCESSO ━━━━━━━━━━ */}
      <section id="processo" style={{ padding: '120px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <span style={{
              display: 'inline-block', padding: '6px 14px', borderRadius: 999,
              background: 'rgba(196,146,74,.08)', color: '#d4a050',
              fontSize: 11, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 18,
            }}>
              Come lavoriamo
            </span>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 50px)', marginBottom: 18 }}>
              Dal primo contatto<br />alla manutenzione decennale.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[p1, p2, p3, p4].map((rv, i) => {
              const step = STEPS[i];
              return (
                <div key={i} ref={rv.ref} className={rv.className} style={rv.style}>
                  <div className="step-card">
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: '#C4924A', lineHeight: 1 }}>
                      {step.num}
                    </div>
                    <div style={{ width: 32, height: 2, background: 'linear-gradient(90deg, #C4924A, transparent)', margin: '14px 0 18px' }} />
                    <h3 style={{ fontSize: 19, marginBottom: 10, color: '#F1F5F9' }}>{step.title}</h3>
                    <p style={{ fontSize: 14, color: '#94a39a', lineHeight: 1.7 }}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ CONTATTI ━━━━━━━━━━ */}
      <section id="contatti" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,146,74,.12), transparent 65%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span style={{
            display: 'inline-block', padding: '6px 14px', borderRadius: 999,
            background: 'rgba(196,146,74,.08)', color: '#d4a050',
            fontSize: 11, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 18,
          }}>
            Parliamo
          </span>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 50px)', marginBottom: 18 }}>
            Richiedi un preventivo
          </h2>
          <p style={{ fontSize: 17, color: '#94a39a', marginBottom: 48, lineHeight: 1.7 }}>
            Raccontaci la tua macchina portatrice e il tuo cantiere.<br />
            <strong style={{ color: '#d4a050' }}>Rispondiamo entro 24 ore lavorative.</strong>
          </p>

          {submitted ? (
            <div style={{
              padding: 40, borderRadius: 16,
              background: 'rgba(74,222,128,.1)', border: '1px solid rgba(74,222,128,.3)',
              animation: 'fadeUp .6s ease-out',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
              <h3 style={{ fontSize: 22, color: '#4ade80', marginBottom: 10 }}>Richiesta inviata</h3>
              <p style={{ fontSize: 15, color: '#94a39a' }}>
                Grazie {formData.azienda || 'per il tuo interesse'}! Ti risponderemo entro 24 ore.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
              <input
                className="input"
                type="text"
                placeholder="Ragione sociale / Nome"
                value={formData.azienda}
                onChange={(e) => setFormData({ ...formData, azienda: e.target.value })}
              />
              <input
                className="input"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <textarea
                className="input"
                placeholder="Raccontaci la tua macchina portatrice e l'attrezzatura che ti serve…"
                value={formData.progetto}
                onChange={(e) => setFormData({ ...formData, progetto: e.target.value })}
                rows={5}
                style={{ resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
              />
              <button onClick={handleSubmit} className="btn-primary" style={{ justifyContent: 'center', marginTop: 4 }}>
                Invia richiesta →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ━━━━━━━━━━ FOOTER ━━━━━━━━━━ */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,.05)', padding: '40px 24px', background: '#070f08' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20,
        }}>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: '#94a39a' }}>
              {BRAND} <span style={{ color: '#C4924A' }}>•</span>
            </div>
            <div style={{ fontSize: 12, color: '#4a5a4d', marginTop: 4 }}>
              {CITY} · P.IVA {PIVA} · Dal 1980
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
            <Link to="/catalogo" className="nav-link">Catalogo</Link>
            <Link to="/chi-siamo" className="nav-link">Chi Siamo</Link>
            <Link to="/concessionari" className="nav-link">Dealer</Link>
            <Link to="/contatti" className="nav-link">Contatti</Link>
          </div>
          <div style={{ fontSize: 12, color: '#4a5a4d' }}>
            © {new Date().getFullYear()} OMEF Group — Made in Italy
          </div>
        </div>
      </footer>
    </div>
  );
}

// Counter component (must be after main export per the prompt structure)
function StatCounter({ target, suffix, label, active }) {
  const val = useCounter(target, active);
  return (
    <div>
      <div style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 800,
        fontSize: 'clamp(52px, 5vw, 76px)', lineHeight: 1,
        background: 'linear-gradient(135deg, #C4924A, #d4a050, #f0c070)',
        WebkitBackgroundClip: 'text', backgroundClip: 'text',
        color: 'transparent',
      }}>
        {val}{suffix}
      </div>
      <div style={{ fontSize: 14, color: '#94a39a', marginTop: 12, fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}
