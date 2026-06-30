import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PRODUCTS } from '../../data/products';

const CATEGORY_IMAGES = {
  cesoie: '/omef/images/categories/cesoie.svg',
  trince: '/omef/images/categories/trince.svg',
  legna: '/omef/images/categories/legna.svg',
  potatura: '/omef/images/categories/potatura.svg',
  terreno: '/omef/images/categories/terreno.svg',
  usato: '/omef/images/categories/usato.svg',
};

const CATEGORIES = [
  { value: 'tutti', label: 'Tutti' },
  { value: 'cesoie', label: 'Cesoie & Taglio' },
  { value: 'trince', label: 'Trince' },
  { value: 'legna', label: 'Lavorazione Legna' },
  { value: 'potatura', label: 'Potatura' },
  { value: 'terreno', label: 'Lavorazione Terreno' },
  { value: 'usato', label: 'Usato Garantito' },
];

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

function ProductCard({ product, delay }) {
  const rv = useReveal(delay);
  const statusClass = product.status === 'green' ? 'status-green' : product.status === 'amber' ? 'status-amber' : 'status-red';

  return (
    <div ref={rv.ref} className={rv.className} style={rv.style}>
      <Link to={`/prodotti/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ position: 'relative', overflow: 'hidden', height: 180 }}>
            <img
              src={CATEGORY_IMAGES[product.category] || CATEGORY_IMAGES.usato}
              alt={product.categoryLabel}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,26,14,0) 0%, rgba(10,26,14,.5) 100%)' }} />
            <div style={{ position: 'absolute', top: 12, right: 12 }}>
              <span className={`status-badge ${statusClass}`}>
                <span className="status-dot" />
                {product.statusLabel}
              </span>
            </div>
          </div>

          <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            <p style={{ fontSize: 10, color: '#d4a050', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 700, margin: 0 }}>
              {product.categoryLabel}
            </p>
            <h3 style={{ fontSize: 18, lineHeight: 1.2, margin: 0 }}>{product.name}</h3>
            <p style={{ fontSize: 13, color: '#94a39a', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {product.shortDesc}
            </p>
            <div style={{ fontSize: 12, color: '#C4924A', fontWeight: 600, marginTop: 'auto' }}>
              ⚙ Compatibilità: Mini {product.minWeight}–{product.maxWeight} ton
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.06)' }}>
              <span style={{ fontSize: 12, color: '#94a39a' }}>Scopri il modello</span>
              <span style={{ fontSize: 14, color: '#d4a050', fontWeight: 600 }}>→</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function CatalogoPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat') || 'tutti';
  const [activeCategory, setActiveCategory] = useState(catParam);
  const [searchText, setSearchText] = useState('');

  function handleCategoryChange(value) {
    setActiveCategory(value);
    const params = new URLSearchParams(searchParams);
    if (value === 'tutti') params.delete('cat');
    else params.set('cat', value);
    setSearchParams(params, { replace: true });
  }

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;
    if (activeCategory !== 'tutti') {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, searchText]);

  const heroRv = useReveal(0);

  return (
    <>
      {/* HERO */}
      <section style={{ padding: '160px 24px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '20%', right: '5%', width: 380, height: 380, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,146,74,.18), transparent 65%)',
          filter: 'blur(60px)', animation: 'floatA 22s ease-in-out infinite',
        }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div ref={heroRv.ref} className={heroRv.className} style={heroRv.style}>
            <span className="section-label">Catalogo prodotti</span>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', marginBottom: 16, maxWidth: 800 }}>
              Ogni attrezzo, costruito per durare.
            </h1>
            <p style={{ fontSize: 17, color: '#94a39a', maxWidth: 620, lineHeight: 1.7 }}>
              Esplora la gamma completa OMEF — cesoie, trince, spaccalegna, pinze, barre falcianti, fresaceppi.
              Filtra per categoria, cerca per modello o tonnellaggio del tuo escavatore.
            </p>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <section style={{ padding: '0 24px', marginBottom: 40, position: 'sticky', top: 78, zIndex: 50, background: 'rgba(10, 26, 14, 0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`filter-chip${activeCategory === cat.value ? ' active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div style={{ position: 'relative', minWidth: 240 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Cerca modello…"
                className="input"
                style={{ paddingLeft: 38, paddingTop: 10, paddingBottom: 10, fontSize: 14 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section style={{ padding: '20px 24px 120px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {filteredProducts.length === 0 ? (
            <div style={{ padding: 80, textAlign: 'center', color: '#94a39a' }}>
              <p style={{ fontSize: 17, marginBottom: 8 }}>Nessun prodotto trovato.</p>
              <p style={{ fontSize: 14 }}>Prova a cambiare filtro o termine di ricerca.</p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 13, color: '#5a6c5e', marginBottom: 24 }}>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'prodotto' : 'prodotti'} trovati
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                {filteredProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} delay={(i % 6) * 80} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
