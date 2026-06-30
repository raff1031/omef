import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle, Package, Wrench, MapPin } from 'lucide-react';
import { PRODUCTS } from '../../data/products';

const CATEGORY_IMAGES = {
  cesoie: '/omef/images/categories/cesoie.svg',
  trince: '/omef/images/categories/trince.svg',
  legna: '/omef/images/categories/legna.svg',
  potatura: '/omef/images/categories/potatura.svg',
  terreno: '/omef/images/categories/terreno.svg',
  usato: '/omef/images/categories/usato.svg',
};

const APPLICATION_ICONS = [CheckCircle, Package, Wrench, MapPin];

function useReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, className: `rv${visible ? ' on' : ''}`, style: { transitionDelay: `${delay}ms` } };
}

export default function ProdottoPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.slug === slug);

  const heroLeft = useReveal(0);
  const heroRight = useReveal(120);
  const specsRv = useReveal(0);
  const appsRv = useReveal(0);
  const relatedRv = useReveal(0);

  if (!product) {
    return (
      <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🔍</div>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>Prodotto non trovato</h1>
        <p style={{ fontSize: 16, color: '#94a39a', marginBottom: 36 }}>
          Il modello che cerchi non esiste o è stato rimosso dal catalogo.
        </p>
        <Link to="/catalogo" className="btn-primary">
          <ArrowLeft size={16} /> Torna al catalogo
        </Link>
      </section>
    );
  }

  const related = PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);
  const statusClass = product.status === 'green' ? 'status-green' : product.status === 'amber' ? 'status-amber' : 'status-red';
  const availabilityText = product.status === 'red' ? 'Su ordinazione' : `${product.qty} ${product.qty === 1 ? 'unità disponibile' : 'unità disponibili'}`;

  const handleAskAI = () => {
    sessionStorage.setItem('omef_prefill', `Disponibilità ${product.name}`);
    navigate('/demo');
  };

  const image = CATEGORY_IMAGES[product.category] || CATEGORY_IMAGES.usato;

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ paddingTop: 100, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#5a6c5e' }}>
          <Link to="/" className="nav-link">Home</Link>
          <span>/</span>
          <Link to="/catalogo" className="nav-link">Catalogo</Link>
          <span>/</span>
          <span style={{ color: '#d4a050' }}>{product.name}</span>
        </div>
      </div>

      {/* HERO */}
      <section style={{ padding: '60px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '20%', right: '5%', width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,146,74,.15), transparent 65%)',
          filter: 'blur(70px)', animation: 'floatA 20s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start', position: 'relative', zIndex: 2 }}>
          {/* Image */}
          <div ref={heroLeft.ref} className={heroLeft.className} style={heroLeft.style}>
            <div style={{ borderRadius: 20, overflow: 'hidden', background: 'rgba(15,35,22,.65)', border: '1px solid rgba(255,255,255,.07)' }}>
              <img src={image} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
              <span className={`status-badge ${statusClass}`}>
                <span className="status-dot" />
                {product.statusLabel}
              </span>
              <span style={{ fontSize: 13, color: '#94a39a' }}>{availabilityText}</span>
            </div>
          </div>

          {/* Info */}
          <div ref={heroRight.ref} className={heroRight.className} style={heroRight.style}>
            <span className="section-label">{product.categoryLabel}</span>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: 16 }}>{product.name}</h1>
            <p style={{ fontSize: 17, color: '#d4a050', lineHeight: 1.5, marginBottom: 24 }}>{product.shortDesc}</p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(196,146,74,.08)', color: '#d4a050', padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, border: '1px solid rgba(196,146,74,.2)', marginBottom: 28 }}>
              ⚙ Escavatori {product.minWeight}–{product.maxWeight} ton
            </div>

            <p style={{ fontSize: 15, color: '#94a39a', lineHeight: 1.8, marginBottom: 36 }}>{product.fullDesc}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a
                href={`mailto:commercialeitalia@omefgroup.com?subject=${encodeURIComponent('Preventivo ' + product.name)}&body=${encodeURIComponent('Buongiorno,\n\nvorrei ricevere un preventivo per il modello ' + product.name + '.\n\nLa mia macchina portatrice è (specificare marca / modello / tonnellaggio):\n\nGrazie.')}`}
                className="btn-primary"
              >
                Richiedi preventivo →
              </a>
              <button onClick={handleAskAI} className="btn-ghost">
                Chiedi all'AI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section style={{ padding: '60px 24px', background: 'rgba(15,35,22,.3)' }}>
        <div ref={specsRv.ref} className={specsRv.className} style={{ ...specsRv.style, maxWidth: 1000, margin: '0 auto' }}>
          <span className="section-label">Specifiche tecniche</span>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', marginBottom: 28 }}>I numeri dell'attrezzo.</h2>
          <div style={{ background: 'rgba(15,35,22,.65)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, overflow: 'hidden' }}>
            {Object.entries(product.specs).map(([key, value], idx) => (
              <div key={key} style={{
                display: 'grid', gridTemplateColumns: '1fr 2fr',
                padding: '16px 24px',
                borderBottom: idx < Object.entries(product.specs).length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none',
                background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)',
              }}>
                <div style={{ fontSize: 13, color: '#94a39a', fontWeight: 500 }}>{key}</div>
                <div style={{ fontSize: 14, color: '#F1F5F9', fontWeight: 600 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATIONS */}
      <section style={{ padding: '60px 24px' }}>
        <div ref={appsRv.ref} className={appsRv.className} style={{ ...appsRv.style, maxWidth: 1200, margin: '0 auto' }}>
          <span className="section-label">Applicazioni</span>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', marginBottom: 28 }}>Dove brilla questo modello.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {product.applications.map((app, idx) => {
              const Icon = APPLICATION_ICONS[idx % APPLICATION_ICONS.length];
              return (
                <div key={app} style={{
                  background: 'rgba(15,35,22,.5)',
                  border: '1px solid rgba(255,255,255,.06)',
                  borderRadius: 14,
                  padding: 24,
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                }}>
                  <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: 'rgba(196,146,74,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color="#d4a050" />
                  </div>
                  <p style={{ fontSize: 14, color: '#F1F5F9', lineHeight: 1.5, fontWeight: 500, margin: 0 }}>{app}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section style={{ padding: '60px 24px', background: 'rgba(15,35,22,.3)' }}>
          <div ref={relatedRv.ref} className={relatedRv.className} style={{ ...relatedRv.style, maxWidth: 1200, margin: '0 auto' }}>
            <span className="section-label">Prodotti correlati</span>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', marginBottom: 28 }}>Altri modelli della stessa categoria.</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {related.map((rel) => {
                const relStatus = rel.status === 'green' ? 'status-green' : rel.status === 'amber' ? 'status-amber' : 'status-red';
                return (
                  <Link key={rel.slug} to={`/prodotti/${rel.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card">
                      <div style={{ overflow: 'hidden', height: 140 }}>
                        <img src={CATEGORY_IMAGES[rel.category]} alt={rel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: 22 }}>
                        <p style={{ fontSize: 10, color: '#d4a050', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 700, margin: 0, marginBottom: 8 }}>{rel.categoryLabel}</p>
                        <h3 style={{ fontSize: 17, marginBottom: 10 }}>{rel.name}</h3>
                        <p style={{ fontSize: 13, color: '#94a39a', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rel.shortDesc}</p>
                        <span className={`status-badge ${relStatus}`}>
                          <span className="status-dot" />
                          {rel.statusLabel}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Back */}
      <div style={{ padding: '40px 24px', borderTop: '1px solid rgba(255,255,255,.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Link to="/catalogo" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <ArrowLeft size={16} /> Torna al catalogo
          </Link>
        </div>
      </div>
    </>
  );
}
