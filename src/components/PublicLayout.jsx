import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { DARK_CSS } from '../styles/dark-theme';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/catalogo', label: 'Catalogo' },
  { to: '/chi-siamo', label: 'Chi Siamo' },
  { to: '/concessionari', label: 'Concessionari' },
  { to: '/contatti', label: 'Contatti' },
];

export default function PublicLayout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="omef-dark">
      <style>{DARK_CSS}</style>

      {/* ━━━━━━━━━━ NAV ━━━━━━━━━━ */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled || mobileOpen ? 'rgba(10, 26, 14, 0.92)' : 'rgba(10, 26, 14, 0.55)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,.06)' : '1px solid transparent',
          transition: 'background .3s, border-color .3s',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#F1F5F9' }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: '-0.01em' }}>OMEF</span>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#C4924A', boxShadow: '0 0 12px #C4924A' }} />
          </Link>

          <div className="omef-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
            <button onClick={() => navigate('/demo')} className="btn-primary" style={{ padding: '10px 20px', fontSize: 13 }}>
              Prova l'AI →
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="omef-mobile-only"
            onClick={() => setMobileOpen((v) => !v)}
            style={{ background: 'transparent', border: 'none', color: '#F1F5F9', cursor: 'pointer', padding: 8, alignItems: 'center', justifyContent: 'center' }}
            aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            borderTop: '1px solid rgba(255,255,255,.06)',
            padding: '16px 24px 24px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 1200, margin: '0 auto' }}>
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  style={{ padding: '10px 0', fontSize: 16 }}
                >
                  {link.label}
                </NavLink>
              ))}
              <button
                onClick={() => navigate('/demo')}
                className="btn-primary"
                style={{ marginTop: 12, justifyContent: 'center' }}
              >
                Prova l'AI →
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ━━━━━━━━━━ MAIN ━━━━━━━━━━ */}
      <main>{children}</main>

      {/* ━━━━━━━━━━ FOOTER ━━━━━━━━━━ */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,.05)', background: '#070f08', padding: '60px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 40 }}>
            {/* Brand */}
            <div>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#F1F5F9', marginBottom: 16 }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22 }}>OMEF</span>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#C4924A' }} />
              </Link>
              <p style={{ fontSize: 13, color: '#94a39a', lineHeight: 1.7 }}>
                Attrezzature forestali per escavatori<br />
                Made in Italy dal 1980
              </p>
              <p style={{ fontSize: 12, color: '#5a6c5e', marginTop: 14, lineHeight: 1.6 }}>
                Località Stazione 46<br />
                15060 Castelletto d'Orba (AL) — Italia
              </p>
            </div>

            {/* Nav */}
            <div>
              <h4 style={{ fontSize: 11, color: '#d4a050', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 18, fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                Navigazione
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li><Link to="/catalogo" className="nav-link">Catalogo prodotti</Link></li>
                <li><Link to="/chi-siamo" className="nav-link">Chi siamo</Link></li>
                <li><Link to="/concessionari" className="nav-link">Concessionari</Link></li>
                <li><Link to="/contatti" className="nav-link">Contatti</Link></li>
                <li><Link to="/demo" className="nav-link">Demo AI →</Link></li>
              </ul>
            </div>

            {/* Contatti */}
            <div>
              <h4 style={{ fontSize: 11, color: '#d4a050', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 18, fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                Contatti
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li>
                  <a href="tel:+390143197459" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Phone size={14} style={{ color: '#C4924A' }} /> 0143 19 79 459
                  </a>
                </li>
                <li>
                  <a href="mailto:info@omefgroup.com" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Mail size={14} style={{ color: '#C4924A' }} /> info@omefgroup.com
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/393498556830" target="_blank" rel="noopener noreferrer" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#C4924A" width="14" height="14">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    +39 349 855 6830
                  </a>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div>
              <h4 style={{ fontSize: 11, color: '#d4a050', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 18, fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                Lavoriamo insieme
              </h4>
              <p style={{ fontSize: 13, color: '#94a39a', lineHeight: 1.7, marginBottom: 16 }}>
                Richiedi un preventivo personalizzato per il tuo escavatore.
              </p>
              <Link to="/contatti" className="btn-primary" style={{ padding: '10px 18px', fontSize: 13 }}>
                Parla con noi →
              </Link>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,.05)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, fontSize: 11, color: '#5a6c5e' }}>
            <span>© {new Date().getFullYear()} OMEF-GROUP S.R.L. Unipersonale — P.IVA 02591080060</span>
            <span>Made in Italy · Tutti i diritti riservati</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
