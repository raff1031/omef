import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageCircle, Check } from 'lucide-react';

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

const CONTACT_CARDS = [
  {
    icon: MapPin,
    color: '#C4924A',
    title: 'Sede e showroom',
    lines: ['Località Stazione 46', '15060 Castelletto d\'Orba (AL)', 'Italia'],
  },
  {
    icon: Phone,
    color: '#4ade80',
    title: 'Telefono',
    lines: ['+39 0143 1979459', 'Commerciale +39 349 855 6830', 'Commerciale 2 +39 375 133 6485'],
    href: 'tel:+390143197459',
  },
  {
    icon: Mail,
    color: '#f472b6',
    title: 'Email',
    lines: ['commercialeitalia@omefgroup.com', 'info@omefgroup.com'],
    href: 'mailto:commercialeitalia@omefgroup.com',
  },
  {
    icon: Clock,
    color: '#60a5fa',
    title: 'Orari',
    lines: ['Showroom: Lun–Ven 8:00–17:30', 'Noleggio: Lun–Ven 8:30–17:00'],
  },
];

const INITIAL_FORM = {
  nome: '', cognome: '', email: '', telefono: '', azienda: '', tipo: 'preventivo', messaggio: '',
};

const TYPE_OPTIONS = [
  { value: 'preventivo', label: 'Preventivo' },
  { value: 'info-tecnica', label: 'Info tecnica' },
  { value: 'assistenza', label: 'Assistenza' },
  { value: 'usato', label: 'Usato' },
  { value: 'altro', label: 'Altro' },
];

export default function ContattiPage() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    ...INITIAL_FORM,
    tipo: searchParams.get('tipo') || 'preventivo',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const heroRv = useReveal(0);
  const formRv = useReveal(0);

  function handleChange(field, value) {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  }

  function handleSubmit() {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'Inserisci il tuo nome';
    if (!formData.email.trim()) newErrors.email = 'Inserisci la tua email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email non valida';
    if (!formData.messaggio.trim()) newErrors.messaggio = 'Scrivi un messaggio';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  }

  return (
    <>
      <section style={{ padding: '160px 24px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '15%', right: '8%', width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,146,74,.18), transparent 65%)',
          filter: 'blur(60px)', animation: 'floatA 20s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div ref={heroRv.ref} className={heroRv.className} style={{ ...heroRv.style, maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span className="section-label">Contattaci</span>
          <h1 style={{ fontSize: 'clamp(38px, 5.5vw, 64px)', marginBottom: 20, maxWidth: 800 }}>
            Parliamo del tuo prossimo cantiere.
          </h1>
          <p style={{ fontSize: 17, color: '#94a39a', maxWidth: 640, lineHeight: 1.7 }}>
            Compila il modulo o contattaci direttamente: il team commerciale OMEF risponde entro <strong style={{ color: '#d4a050' }}>24 ore lavorative</strong>.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {CONTACT_CARDS.map((c, i) => (
            <ContactCard key={c.title} card={c} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: '60px 24px 100px', background: 'rgba(15,35,22,.3)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,146,74,.08), transparent 65%)',
          filter: 'blur(70px)', pointerEvents: 'none',
        }} />
        <div ref={formRv.ref} className={formRv.className} style={{ ...formRv.style, maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {submitted ? (
            <div style={{
              padding: 60, borderRadius: 20, textAlign: 'center',
              background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.25)',
              animation: 'fadeUp .6s ease-out',
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(74,222,128,.15)', color: '#4ade80',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <Check size={36} strokeWidth={2.5} />
              </div>
              <h2 style={{ fontSize: 28, color: '#4ade80', marginBottom: 14 }}>Richiesta inviata!</h2>
              <p style={{ fontSize: 16, color: '#94a39a', lineHeight: 1.7, marginBottom: 8 }}>
                Grazie {formData.nome || ''}, abbiamo ricevuto la tua richiesta.
              </p>
              <p style={{ fontSize: 14, color: '#5a6c5e' }}>
                Ti risponderemo all'indirizzo <strong style={{ color: '#d4a050' }}>{formData.email}</strong> entro 24 ore lavorative.
              </p>
            </div>
          ) : (
            <>
              <span className="section-label">Modulo contatto</span>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', marginBottom: 32 }}>
                Raccontaci il tuo progetto.
              </h2>

              {/* Type selector */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#94a39a', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>
                  Tipo di richiesta
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleChange('tipo', opt.value)}
                      className={`filter-chip${formData.tipo === opt.value ? ' active' : ''}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 16 }}>
                <Field label="Nome*" error={errors.nome}>
                  <input className="input" value={formData.nome} onChange={(e) => handleChange('nome', e.target.value)} placeholder="Mario" />
                </Field>
                <Field label="Cognome" error={errors.cognome}>
                  <input className="input" value={formData.cognome} onChange={(e) => handleChange('cognome', e.target.value)} placeholder="Rossi" />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 16 }}>
                <Field label="Email*" error={errors.email}>
                  <input className="input" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="mario.rossi@email.it" />
                </Field>
                <Field label="Telefono" error={errors.telefono}>
                  <input className="input" type="tel" value={formData.telefono} onChange={(e) => handleChange('telefono', e.target.value)} placeholder="+39 ..." />
                </Field>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Field label="Azienda / Ragione sociale" error={errors.azienda}>
                  <input className="input" value={formData.azienda} onChange={(e) => handleChange('azienda', e.target.value)} placeholder="Es. Rossi Forestali S.r.l." />
                </Field>
              </div>

              <div style={{ marginBottom: 24 }}>
                <Field label="Messaggio*" error={errors.messaggio}>
                  <textarea
                    className="input"
                    rows={5}
                    style={{ resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
                    value={formData.messaggio}
                    onChange={(e) => handleChange('messaggio', e.target.value)}
                    placeholder="Descrivi la tua macchina portatrice (marca, modello, tonnellaggio) e il tipo di lavoro che devi svolgere..."
                  />
                </Field>
              </div>

              <button onClick={handleSubmit} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '16px 28px' }}>
                Invia richiesta →
              </button>

              <p style={{ fontSize: 12, color: '#5a6c5e', marginTop: 16, textAlign: 'center' }}>
                Inviando il modulo accetti il trattamento dei dati secondo la nostra privacy policy.
              </p>
            </>
          )}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section style={{ padding: '60px 24px 100px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '20px 28px', borderRadius: 16, background: 'rgba(37, 211, 102, .08)', border: '1px solid rgba(37, 211, 102, .25)' }}>
            <MessageCircle size={24} color="#25D366" />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 13, color: '#94a39a', margin: 0 }}>Preferisci scrivere su WhatsApp?</p>
              <a href="https://wa.me/393498556830" target="_blank" rel="noopener noreferrer" style={{ fontSize: 16, fontWeight: 600, color: '#25D366', textDecoration: 'none' }}>
                +39 349 855 6830 →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactCard({ card, delay }) {
  const rv = useReveal(delay);
  const Icon = card.icon;
  const Content = (
    <div style={{
      background: 'rgba(15,35,22,.6)',
      border: '1px solid rgba(255,255,255,.06)',
      borderRadius: 16,
      padding: 24,
      height: '100%',
      transition: 'border-color .3s, transform .3s',
      cursor: card.href ? 'pointer' : 'default',
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: `${card.color}18`, color: card.color, border: `1px solid ${card.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      }}>
        <Icon size={20} />
      </div>
      <h3 style={{ fontSize: 15, color: '#d4a050', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700, marginBottom: 12, fontFamily: 'Inter, sans-serif' }}>
        {card.title}
      </h3>
      {card.lines.map((line, i) => (
        <p key={i} style={{ fontSize: 14, color: '#94a39a', lineHeight: 1.6, margin: '0 0 4px' }}>{line}</p>
      ))}
    </div>
  );
  return (
    <div ref={rv.ref} className={rv.className} style={rv.style}>
      {card.href ? <a href={card.href} style={{ textDecoration: 'none' }}>{Content}</a> : Content}
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, color: '#94a39a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>
        {label}
      </label>
      {children}
      {error && <p style={{ fontSize: 12, color: '#f87171', marginTop: 6 }}>{error}</p>}
    </div>
  );
}
