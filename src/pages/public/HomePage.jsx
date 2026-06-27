import { useNavigate, Link } from 'react-router-dom';
import { Factory, Headphones, Shield, MapPin, ChevronRight, Bot } from 'lucide-react';
import { PRODUCTS } from '../../data/products';

const CATEGORIES = [
  {
    key: 'cesoie',
    emoji: '🌲',
    name: 'Cesoie',
    desc: 'Cesoie forestali per taglio preciso su ogni tonnellaggio',
  },
  {
    key: 'trince',
    emoji: '🌿',
    name: 'Trince',
    desc: 'Trince a mazze e a coltelli per trinciatura di vegetazione',
  },
  {
    key: 'legna',
    emoji: '🪵',
    name: 'Legna',
    desc: 'Spaccalegna e pinze per lavorazione e movimentazione del legname',
  },
  {
    key: 'potatura',
    emoji: '✂️',
    name: 'Potatura',
    desc: 'Barre falcianti e attrezzi per potatura professionale',
  },
  {
    key: 'terreno',
    emoji: '⛏️',
    name: 'Terreno',
    desc: 'Fresaceppi e attrezzature per lavorazione del suolo',
  },
];

const WHY_FEATURES = [
  {
    icon: Factory,
    title: 'Produzione italiana',
    desc: 'Ogni attrezzatura OMEF è progettata e costruita in Italia dal 1980, con materiali selezionati e lavorazioni di precisione.',
  },
  {
    icon: Headphones,
    title: 'Assistenza dedicata',
    desc: 'Supporto tecnico diretto dal team OMEF per configurazione, installazione e risoluzione di qualsiasi problema operativo.',
  },
  {
    icon: Shield,
    title: 'Ricambi garantiti',
    desc: 'Disponibilità garantita di ricambi originali per tutti i modelli in produzione, con tempi di consegna rapidi.',
  },
  {
    icon: MapPin,
    title: 'Rete 15 dealer',
    desc: 'Una rete capillare di 15 concessionari autorizzati su tutto il territorio nazionale per assistenza locale e pronta consegna.',
  },
];

const STATUS_STYLES = {
  green: 'bg-green-100 text-green-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800',
};

const STATUS_LABELS = {
  green: 'Disponibile',
  amber: 'Ultimi pezzi',
  red: 'Su ordinazione',
};

export default function HomePage() {
  const navigate = useNavigate();
  const featuredProducts = PRODUCTS.filter((p) => p.featured).slice(0, 4);

  return (
    <main className="min-h-screen">
      {/* ── HERO ── */}
      <section className="bg-omef-forest text-white min-h-[70vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="space-y-8">
              <span className="inline-block bg-omef-bark/20 border border-omef-bark/40 text-omef-bark text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full">
                Dal 1980 — Eccellenza Italiana
              </span>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Attrezzature Forestali per Escavatori
              </h1>
              <p className="text-omef-light/80 text-lg leading-relaxed max-w-lg">
                Cesoie, trince, spaccalegna e pinze OMEF — progettate per professionisti del bosco e del verde.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => navigate('/catalogo')}
                  className="bg-omef-bark hover:bg-omef-bark/90 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors flex items-center gap-2"
                >
                  Scopri il Catalogo <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/demo')}
                  className="border border-white/40 hover:bg-white/10 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors flex items-center gap-2"
                >
                  Parla con l'AI <Bot size={18} />
                </button>
              </div>
            </div>

            {/* Right — stat cards */}
            <div className="flex flex-col gap-4 lg:items-end">
              {[
                { value: '10+', label: 'Modelli di attrezzatura', sub: 'Cesoie, trince, pinze e altro' },
                { value: '15', label: 'Concessionari autorizzati', sub: 'Rete nazionale di assistenza' },
                { value: '45', label: 'Anni di esperienza', sub: 'Dal 1980, Made in Italy' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="w-full lg:w-80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-5 flex items-center gap-5"
                >
                  <span className="text-4xl font-bold text-omef-bark leading-none">{stat.value}</span>
                  <div>
                    <p className="font-semibold text-white text-sm">{stat.label}</p>
                    <p className="text-omef-light/60 text-xs mt-0.5">{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ── */}
      <section className="bg-omef-paper py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-omef-forest mb-10 text-center">
            Le nostre linee di prodotto
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                to={`/catalogo?cat=${cat.key}`}
                className="group bg-white rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-omef-forest/10 hover:border-omef-bark hover:shadow-lg transition-all duration-200"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                  {cat.emoji}
                </span>
                <span className="font-bold text-omef-forest text-base">{cat.name}</span>
                <span className="text-omef-muted text-xs leading-snug">{cat.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl font-bold text-omef-forest">Prodotti in evidenza</h2>
            <Link
              to="/catalogo"
              className="text-omef-bark hover:text-omef-bark/80 font-semibold text-sm flex items-center gap-1"
            >
              Vedi tutti <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group border border-omef-forest/10 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md hover:border-omef-bark/40 transition-all duration-200 bg-omef-paper/40"
              >
                <span className="text-5xl">{product.emoji}</span>
                <div className="flex-1 space-y-2">
                  <span
                    className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[product.status]}`}
                  >
                    {STATUS_LABELS[product.status]}
                  </span>
                  <h3 className="font-bold text-omef-forest text-base leading-snug">{product.name}</h3>
                  <p className="text-omef-muted text-sm leading-snug line-clamp-2">{product.shortDesc}</p>
                </div>
                <Link
                  to={`/prodotti/${product.slug}`}
                  className="inline-flex items-center gap-1 text-omef-bark font-semibold text-sm hover:gap-2 transition-all"
                >
                  Scopri <ChevronRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY OMEF ── */}
      <section className="bg-omef-light py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-omef-forest mb-10 text-center">Perché scegliere OMEF</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-white rounded-2xl p-7 flex flex-col gap-4 border border-omef-forest/10 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-omef-forest/10 flex items-center justify-center">
                    <Icon size={24} className="text-omef-forest" />
                  </div>
                  <div>
                    <h3 className="font-bold text-omef-forest text-base mb-1">{feat.title}</h3>
                    <p className="text-omef-muted text-sm leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AI DEMO CTA ── */}
      <section className="bg-omef-forest py-16 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-omef-bark/20 border border-omef-bark/30 flex items-center justify-center mx-auto">
              <Bot size={28} className="text-omef-bark" />
            </div>
            <h2 className="text-3xl font-bold">Hai dubbi sul modello giusto?</h2>
            <p className="text-omef-light/80 text-lg leading-relaxed">
              Il nostro assistente AI risponde in tempo reale su stock, compatibilità e preventivi.
            </p>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 bg-omef-bark hover:bg-omef-bark/90 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base"
            >
              Prova l'assistente AI <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
