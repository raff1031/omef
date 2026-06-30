import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Loader2, Navigation, Globe2 } from 'lucide-react';
import { DEALERS } from '../../data/dealers';
import { getLocation, getNearestDealers, haversine } from '../../lib/geo';

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

const INTL_DISTRIBUTORS = [
  { country: '🇺🇸 USA', name: 'National Attachments Inc.', city: 'Gorham, ME' },
  { country: '🇺🇸 USA', name: 'Solaris Attachments', city: 'distribuzione nazionale' },
  { country: '🇦🇺 Australia', name: 'Randalls Equipment', city: 'distribuzione nazionale' },
  { country: '🇬🇧 UK', name: 'Forestry Plant', city: 'distribuzione nazionale' },
];

export default function ConcessionariPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [allDealersWithDist, setAllDealersWithDist] = useState(DEALERS);
  const [filter, setFilter] = useState('');

  const heroRv = useReveal(0);
  const intlRv = useReveal(0);

  async function handleLocate() {
    setIsLocating(true);
    setLocationError('');
    try {
      const loc = await getLocation();
      setUserLocation(loc);
      const augmented = DEALERS.map((d) => ({
        ...d,
        km: Math.round(haversine(loc.lat, loc.lon, d.lat, d.lon)),
      })).sort((a, b) => a.km - b.km);
      setAllDealersWithDist(augmented);
    } catch (err) {
      setLocationError(err.message || 'Impossibile rilevare la posizione.');
    } finally {
      setIsLocating(false);
    }
  }

  const filtered = filter.trim()
    ? allDealersWithDist.filter((d) =>
        d.name.toLowerCase().includes(filter.toLowerCase()) ||
        d.city.toLowerCase().includes(filter.toLowerCase()) ||
        d.province.toLowerCase().includes(filter.toLowerCase())
      )
    : allDealersWithDist;

  return (
    <>
      {/* HERO */}
      <section style={{ padding: '160px 24px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '15%', right: '8%', width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,146,74,.18), transparent 65%)',
          filter: 'blur(60px)', animation: 'floatA 20s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div ref={heroRv.ref} className={heroRv.className} style={{ ...heroRv.style, maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span className="section-label">Rete commerciale</span>
          <h1 style={{ fontSize: 'clamp(38px, 5.5vw, 64px)', marginBottom: 20, maxWidth: 800 }}>
            Trova il concessionario<br />OMEF più vicino.
          </h1>
          <p style={{ fontSize: 17, color: '#94a39a', maxWidth: 640, lineHeight: 1.7, marginBottom: 32 }}>
            Una rete capillare di concessionari autorizzati su tutto il territorio nazionale,
            più distributori internazionali in oltre 30 paesi.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <button onClick={handleLocate} disabled={isLocating} className="btn-primary">
              {isLocating ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
              {isLocating ? 'Localizzo…' : userLocation ? 'Aggiorna posizione' : 'Trova vicino a me'}
            </button>
            {userLocation && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 20px', background: 'rgba(74,222,128,.1)', color: '#4ade80', borderRadius: 10, fontSize: 13, fontWeight: 600, border: '1px solid rgba(74,222,128,.25)' }}>
                📍 Posizione rilevata
              </span>
            )}
          </div>
          {locationError && (
            <p style={{ fontSize: 13, color: '#f87171', marginTop: 16 }}>⚠ {locationError}</p>
          )}
        </div>
      </section>

      {/* FILTER */}
      <section style={{ padding: '0 24px 32px', position: 'sticky', top: 78, zIndex: 50, background: 'rgba(10, 26, 14, 0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Cerca per città, provincia o nome…"
            className="input"
          />
        </div>
      </section>

      {/* DEALERS GRID */}
      <section style={{ padding: '20px 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 13, color: '#5a6c5e', marginBottom: 24 }}>
            {filtered.length} concessionari{userLocation ? ' (ordinati per distanza)' : ''}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filtered.map((d, i) => (
              <DealerCard key={d.id} dealer={d} delay={(i % 6) * 60} />
            ))}
          </div>
        </div>
      </section>

      {/* INTERNATIONAL */}
      <section style={{ padding: '80px 24px', background: 'rgba(15,35,22,.3)', borderTop: '1px solid rgba(255,255,255,.05)' }}>
        <div ref={intlRv.ref} className={intlRv.className} style={{ ...intlRv.style, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section-label">Internazionale</span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', marginBottom: 16 }}>
              Presenti in oltre 30 paesi.
            </h2>
            <p style={{ fontSize: 15, color: '#94a39a', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              I distributori internazionali noti pubblicamente. Per il tuo paese contattaci direttamente.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, maxWidth: 1000, margin: '0 auto' }}>
            {INTL_DISTRIBUTORS.map((d) => (
              <div key={d.name} style={{
                background: 'rgba(15,35,22,.6)',
                border: '1px solid rgba(255,255,255,.06)',
                borderRadius: 14,
                padding: 22,
              }}>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{d.country}</div>
                <p style={{ fontSize: 15, color: '#F1F5F9', fontWeight: 600, margin: '8px 0 4px' }}>{d.name}</p>
                <p style={{ fontSize: 13, color: '#94a39a', margin: 0 }}>{d.city}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/contatti" className="btn-ghost">
              <Globe2 size={16} /> Contattaci per il tuo paese
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function DealerCard({ dealer, delay }) {
  const rv = useReveal(delay);
  return (
    <div ref={rv.ref} className={rv.className} style={rv.style}>
      <div className="card" style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ fontSize: 10, color: '#d4a050', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 700, margin: 0, marginBottom: 6 }}>
              {dealer.province}
            </p>
            <h3 style={{ fontSize: 17, marginBottom: 2 }}>{dealer.name}</h3>
            <p style={{ fontSize: 13, color: '#94a39a', display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
              <MapPin size={12} /> {dealer.city}
            </p>
          </div>
          {dealer.km !== undefined && (
            <span style={{
              padding: '5px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
              background: dealer.km < 50 ? 'rgba(74,222,128,.12)' : dealer.km < 200 ? 'rgba(196,146,74,.12)' : 'rgba(255,255,255,.05)',
              color: dealer.km < 50 ? '#4ade80' : dealer.km < 200 ? '#d4a050' : '#94a39a',
              border: `1px solid ${dealer.km < 50 ? 'rgba(74,222,128,.25)' : dealer.km < 200 ? 'rgba(196,146,74,.25)' : 'rgba(255,255,255,.08)'}`,
            }}>
              {dealer.km} km
            </span>
          )}
        </div>
        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a href={`tel:${dealer.tel.replace(/\s/g, '')}`} className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <Phone size={13} style={{ color: '#C4924A' }} /> {dealer.tel}
          </a>
          <a href={`mailto:${dealer.email}`} className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <Mail size={13} style={{ color: '#C4924A' }} /> {dealer.email}
          </a>
        </div>
      </div>
    </div>
  );
}
