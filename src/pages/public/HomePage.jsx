import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BRAND = 'OMEF';
const PIVA = '02591080060';
const CITY = 'Castelletto d\'Orba (AL)';
const ROLE = 'Attrezzature Forestali per Escavatori';
const FOUNDED = 1991;
const YEARS = new Date().getFullYear() - FOUNDED;

const SERVICES = [
  {
    icon: '✂',
    color: '#C4924A',
    image: '/omef/images/categories/cesoie.svg',
    title: 'Taglio Alberi & Cesoie',
    desc: 'Cesoia forestale BIG INCH, abbattitrici, pinze motosega e potatrici. Taglio fino a Ø 800 mm per escavatori, trattori e minipale.',
    tags: ['BIG INCH', 'Ø 800mm', 'Rotazione 360°', 'Hardox'],
    href: '/catalogo?cat=cesoie',
  },
  {
    icon: '⌬',
    color: '#4ade80',
    image: '/omef/images/categories/legna.svg',
    title: 'Lavorazione Legna',
    desc: 'Spaccalegna SPV, processore TS400 radiocomandato, pinze HD e PFIMX. Per tronchi fino Ø 2 m, apertura fino 2400 mm.',
    tags: ['Spaccalegna', 'Processore', 'Pinze HD', '360° freno'],
    href: '/catalogo?cat=legna',
  },
  {
    icon: '◈',
    color: '#f472b6',
    image: '/omef/images/categories/terreno.svg',
    title: 'Lavorazione Terreno',
    desc: 'Fresaceppi FRS a dischi idraulici, estirpa ceppi ST, trivelle TRV anche per terreni rocciosi, piantapali OM e compattatori CPT.',
    tags: ['Fresaceppi', 'Estirpa ceppi', 'Trivella', 'Compattatore'],
    href: '/catalogo?cat=terreno',
  },
];

const STATS = [
  { value: YEARS, suffix: '+', label: `Anni di esperienza dal ${FOUNDED}` },
  { value: 30, suffix: '+', label: 'Paesi in cui siamo presenti' },
  { value: 60, suffix: '+', label: 'Modelli attivi in catalogo' },
];

const TECHS = [
  'Made in Italy',
  'Acciaio certificato',
  'Mini 1–20 ton',
  'Rotazione 360°',
  'Assistenza diretta dal produttore',
  'Ricambi originali',
  'Custom on demand',
  'Test in cantiere',
  'CE certified',
];

const STEPS = [
  { num: '01', title: 'Consulenza', desc: 'Definiamo insieme l\'attrezzatura giusta per il tuo escavatore e il tuo cantiere.' },
  { num: '02', title: 'Configurazione', desc: 'Personalizziamo attacco rapido, impianto idraulico e accessori sulla tua macchina portatrice.' },
  { num: '03', title: 'Consegna', desc: 'Spedizione tracciata in tutta Italia e in oltre 30 paesi nel mondo.' },
  { num: '04', title: 'Assistenza', desc: 'Ricambi originali, garanzia e supporto tecnico diretto dal produttore.' },
];

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

export default function HomePage() {
  const navigate = useNavigate();
  const [statsActive, setStatsActive] = useState(false);
  const statsRef = useRef(null);

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

  return (
    <>
      {/* ━━━━━━━━━━ HERO ━━━━━━━━━━ */}
      <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '120px 24px 80px' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(196,146,74,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,74,.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }} />
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
            Il professionista del bosco:{' '}
            <span style={{
              color: '#f0c070',
              textShadow: '0 0 40px rgba(196, 146, 74, 0.5)',
            }}>
              OMEF.
            </span>
          </h1>

          <p ref={heroSub.ref} className={heroSub.className} style={{
            ...heroSub.style,
            fontSize: 'clamp(16px, 1.5vw, 19px)',
            color: '#94a39a', maxWidth: 620, marginBottom: 44, lineHeight: 1.7,
          }}>
            Cesoie forestali, trince, spaccalegna e pinze Made in Italy.
            Progettate per escavatori, trattori e minipale — assistenza e garanzia direttamente dal produttore.
          </p>

          <div ref={heroCta.ref} className={heroCta.className} style={{ ...heroCta.style, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <Link to="/contatti" className="btn-primary">Richiedi preventivo →</Link>
            <a href="#servizi" className="btn-ghost">Scopri il catalogo</a>
          </div>

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
            <span className="section-label">Cosa facciamo</span>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 50px)', marginBottom: 18 }}>
              Sei linee di prodotto.<br />Una sola promessa.
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
                    <div className="card">
                      <div style={{ overflow: 'hidden', height: 180 }}>
                        <img src={svc.image} alt={svc.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }} />
                      </div>
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
                        <h3 style={{ fontSize: 21, marginBottom: 12 }}>{svc.title}</h3>
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

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/catalogo" className="btn-ghost">Vedi tutte le linee di prodotto →</Link>
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
            <span className="section-label">Come lavoriamo</span>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 50px)', marginBottom: 18 }}>
              Dal primo contatto<br />all'assistenza decennale.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[p1, p2, p3, p4].map((rv, i) => {
              const step = STEPS[i];
              return (
                <div key={i} ref={rv.ref} className={rv.className} style={rv.style}>
                  <div style={{
                    background: 'rgba(15, 35, 22, 0.5)',
                    border: '1px solid rgba(255,255,255,.06)',
                    borderRadius: 16,
                    padding: 28,
                    height: '100%',
                  }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: '#C4924A', lineHeight: 1 }}>
                      {step.num}
                    </div>
                    <div style={{ width: 32, height: 2, background: 'linear-gradient(90deg, #C4924A, transparent)', margin: '14px 0 18px' }} />
                    <h3 style={{ fontSize: 19, marginBottom: 10 }}>{step.title}</h3>
                    <p style={{ fontSize: 14, color: '#94a39a', lineHeight: 1.7 }}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ CTA FINALE ━━━━━━━━━━ */}
      <section style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,146,74,.12), transparent 65%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span className="section-label">Parliamo</span>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 50px)', marginBottom: 18 }}>
            Richiedi il tuo preventivo
          </h2>
          <p style={{ fontSize: 17, color: '#94a39a', marginBottom: 36, lineHeight: 1.7 }}>
            Raccontaci la tua macchina portatrice e il tuo cantiere.<br />
            <strong style={{ color: '#d4a050' }}>Rispondiamo entro 24 ore lavorative.</strong>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <Link to="/contatti" className="btn-primary">Vai al modulo contatti →</Link>
            <button onClick={() => navigate('/demo')} className="btn-ghost">Prova l'AI commerciale</button>
          </div>
        </div>
      </section>
    </>
  );
}

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
