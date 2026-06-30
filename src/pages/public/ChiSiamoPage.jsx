import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Factory, Shield, Award, Globe2, Users, Wrench } from 'lucide-react';

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

const VALUES = [
  { icon: Factory, color: '#C4924A', title: 'Ciclo produttivo interno', desc: 'Dalla progettazione CAD alla realizzazione finale, ogni fase avviene nei nostri stabilimenti.' },
  { icon: Shield, color: '#4ade80', title: 'Acciaio certificato', desc: 'Utilizziamo esclusivamente acciaio certificato e tracciabile per garantire resistenza e durata.' },
  { icon: Wrench, color: '#f472b6', title: 'Test rigorosi', desc: 'Software di progettazione avanzati, test sui prototipi e validazione sul campo.' },
  { icon: Globe2, color: '#60a5fa', title: '30+ paesi serviti', desc: 'Le attrezzature OMEF lavorano in oltre 30 paesi nel mondo.' },
  { icon: Users, color: '#a78bfa', title: 'Assistenza diretta', desc: 'Garanzia e supporto tecnico direttamente dal produttore, senza intermediari.' },
  { icon: Award, color: '#fbbf24', title: 'Made in Italy', desc: 'Tradizione e innovazione del Nord Italia, in provincia di Alessandria dal 1991.' },
];

const TIMELINE = [
  { year: '1991', title: 'Fondazione', desc: 'Nasce OMEF in provincia di Alessandria, con la missione di costruire attrezzature forestali robuste e affidabili.' },
  { year: '2000s', title: 'Espansione internazionale', desc: 'Inizia la distribuzione in Europa e Oltreoceano. La gamma cresce con nuove linee per agricoltura e manutenzione del verde.' },
  { year: '2015', title: 'Leader del settore', desc: 'OMEF diventa riferimento mondiale per cesoie forestali, spaccalegna e trince idrauliche per escavatori.' },
  { year: 'Oggi', title: 'Oltre 30 paesi', desc: 'Le attrezzature OMEF lavorano in più di 30 paesi, con showroom, noleggio e servizi finanziari dedicati ai professionisti.' },
];

export default function ChiSiamoPage() {
  const heroRv = useReveal(0);
  const storyRv = useReveal(0);

  return (
    <>
      <section style={{ padding: '160px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '15%', right: '8%', width: 460, height: 460, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,146,74,.2), transparent 65%)',
          filter: 'blur(70px)', animation: 'floatA 20s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div ref={heroRv.ref} className={heroRv.className} style={{ ...heroRv.style, maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span className="section-label">Chi siamo</span>
          <h1 style={{ fontSize: 'clamp(38px, 5.5vw, 72px)', marginBottom: 24, maxWidth: 900 }}>
            Trent'anni di acciaio,<br />progettato in Italia.
          </h1>
          <p style={{ fontSize: 19, color: '#94a39a', maxWidth: 720, lineHeight: 1.7 }}>
            OMEF è leader mondiale nella progettazione e produzione di attrezzature per il settore forestale,
            agricolo e della manutenzione del verde. Dal 1991, dal Nord Italia per il mondo.
          </p>
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: 'rgba(15,35,22,.3)' }}>
        <div ref={storyRv.ref} className={storyRv.className} style={{ ...storyRv.style, maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60 }}>
          <div>
            <span className="section-label">La nostra storia</span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', marginBottom: 20 }}>
              Tradizione e innovazione,<br />insieme.
            </h2>
            <p style={{ fontSize: 15, color: '#94a39a', lineHeight: 1.85, marginBottom: 16 }}>
              OMEF affonda le proprie radici nel Nord Italia, in provincia di Alessandria, dove tradizione
              meccanica e innovazione tecnica si incontrano da oltre tre decenni.
            </p>
            <p style={{ fontSize: 15, color: '#94a39a', lineHeight: 1.85 }}>
              La nostra missione è la creazione di macchine robuste, efficienti e affidabili che garantiscano
              massime performance e resistenza in ogni condizione di lavoro per i professionisti forestali e agricoli.
            </p>
          </div>
          <div>
            <span className="section-label">Il nostro processo</span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', marginBottom: 20 }}>
              Tutto sotto controllo.
            </h2>
            <p style={{ fontSize: 15, color: '#94a39a', lineHeight: 1.85, marginBottom: 16 }}>
              L'intero ciclo produttivo si svolge internamente: dalla progettazione CAD alla realizzazione finale,
              con utilizzo esclusivo di acciaio certificato e tracciabile.
            </p>
            <p style={{ fontSize: 15, color: '#94a39a', lineHeight: 1.85 }}>
              Software avanzati di progettazione, test rigorosi sui prototipi e validazione sul campo
              assicurano la qualità che ci ha resi un riferimento internazionale.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 24px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(196,146,74,.05), rgba(196,146,74,.02))', borderTop: '1px solid rgba(196,146,74,.1)', borderBottom: '1px solid rgba(196,146,74,.1)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#d4a050', letterSpacing: '.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 16 }}>
            Il nostro impegno
          </p>
          <p style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 44px)',
            lineHeight: 1.2,
            background: 'linear-gradient(135deg, #C4924A, #d4a050, #f0c070)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            margin: 0,
          }}>
            "Assistenza e garanzia<br />direttamente dal produttore."
          </p>
        </div>
      </section>

      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-label">I nostri valori</span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', marginBottom: 16 }}>
              Cosa significa scegliere OMEF.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {VALUES.map((v, i) => (
              <ValueCard key={v.title} value={v} delay={(i % 3) * 100} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 24px', background: 'rgba(15,35,22,.3)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="section-label">La nostra evoluzione</span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
              Tre decenni di crescita.
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {TIMELINE.map((t, i) => (
              <TimelineItem key={t.year} item={t} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,146,74,.12), transparent 65%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', marginBottom: 18 }}>
            Lavoriamo insieme.
          </h2>
          <p style={{ fontSize: 17, color: '#94a39a', marginBottom: 32, lineHeight: 1.7 }}>
            Scopri la gamma completa o richiedi un preventivo personalizzato per il tuo escavatore.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <Link to="/catalogo" className="btn-primary">Esplora il catalogo →</Link>
            <Link to="/contatti" className="btn-ghost">Contattaci</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ValueCard({ value, delay }) {
  const rv = useReveal(delay);
  const Icon = value.icon;
  return (
    <div ref={rv.ref} className={rv.className} style={rv.style}>
      <div style={{
        background: 'rgba(15,35,22,.6)',
        border: '1px solid rgba(255,255,255,.06)',
        borderRadius: 16,
        padding: 28,
        height: '100%',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: `${value.color}18`, color: value.color,
          border: `1px solid ${value.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
        }}>
          <Icon size={22} />
        </div>
        <h3 style={{ fontSize: 18, marginBottom: 10 }}>{value.title}</h3>
        <p style={{ fontSize: 14, color: '#94a39a', lineHeight: 1.7, margin: 0 }}>{value.desc}</p>
      </div>
    </div>
  );
}

function TimelineItem({ item, delay }) {
  const rv = useReveal(delay);
  return (
    <div ref={rv.ref} className={rv.className} style={rv.style}>
      <div style={{
        background: 'rgba(15,35,22,.6)',
        border: '1px solid rgba(255,255,255,.06)',
        borderRadius: 16,
        padding: 28,
        display: 'grid',
        gridTemplateColumns: '140px 1fr',
        gap: 24,
        alignItems: 'center',
      }}>
        <div style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 32,
          background: 'linear-gradient(135deg, #C4924A, #d4a050)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
        }}>
          {item.year}
        </div>
        <div>
          <h3 style={{ fontSize: 19, marginBottom: 8 }}>{item.title}</h3>
          <p style={{ fontSize: 14, color: '#94a39a', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
        </div>
      </div>
    </div>
  );
}
