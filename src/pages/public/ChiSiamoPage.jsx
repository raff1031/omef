import { Link } from 'react-router-dom';
import { Award, Wrench, Users, Factory, Zap, HeartHandshake, ArrowRight, MapPin, Calendar } from 'lucide-react';

const stats = [
  { value: '45', label: 'anni di esperienza', suffix: '' },
  { value: '10+', label: 'modelli a catalogo', suffix: '' },
  { value: '15', label: 'concessionari autorizzati', suffix: '' },
  { value: '100%', label: 'produzione italiana', suffix: '' },
];

const timeline = [
  {
    year: '1980',
    title: 'Fondazione a Basaluzzo, AL',
    description:
      'OMEF nasce a Basaluzzo, in provincia di Alessandria. Le prime cesoie forestali escono dalla nostra officina: robuste, precise, pensate per i boschi italiani.',
  },
  {
    year: '1990',
    title: 'Espansione della linea prodotti',
    description:
      'Il catalogo si amplia con trince e spaccalegna per escavatori. La capacità produttiva cresce insieme alla fiducia dei professionisti del settore.',
  },
  {
    year: '2005',
    title: 'Rete concessionari nazionale',
    description:
      "Raggiungiamo i 15 concessionari autorizzati su tutto il territorio italiano. L'assistenza tecnica diventa capillare, vicina a ogni cantiere.",
  },
  {
    year: '2018',
    title: 'Nuova sede produttiva',
    description:
      "L'ampliamento dello stabilimento di Basaluzzo porta nuovi reparti, macchinari di precisione e maggiore capacità per soddisfare la domanda crescente.",
  },
  {
    year: '2026',
    title: 'Assistente AI per la consulenza',
    description:
      "Lanciamo il nostro assistente digitale basato su intelligenza artificiale: i professionisti trovano il modello giusto, ricevono supporto tecnico e calcolano l'abbinamento ottimale con l'escavatore.",
  },
];

const values = [
  {
    icon: Factory,
    title: 'Qualità italiana',
    description:
      "Ogni componente OMEF nasce e viene lavorato in Italia. Controlliamo l'intera filiera produttiva — dai materiali grezzi al collaudo finale — per garantire standard che resistono alle condizioni più dure.",
  },
  {
    icon: Zap,
    title: 'Innovazione continua',
    description:
      "Quarantacinque anni non ci hanno fermato: investiamo costantemente in ricerca, nuovi materiali e tecnologie di lavorazione per offrire attrezzature sempre più efficienti e longeve.",
  },
  {
    icon: HeartHandshake,
    title: 'Servizio al cliente',
    description:
      "Non vendiamo solo macchine: affianchiamo ogni cliente dalla scelta del modello fino all'assistenza post-vendita, attraverso la nostra rete di concessionari specializzati.",
  },
];

export default function ChiSiamoPage() {
  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="bg-omef-forest text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <span className="inline-block text-omef-sage text-sm font-semibold uppercase tracking-widest mb-4">
            La nostra storia
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Dal 1980, precisione nel bosco
          </h1>
          <p className="text-lg md:text-xl text-omef-light/80 max-w-2xl leading-relaxed">
            Progettiamo e produciamo attrezzature forestali per escavatori nella nostra sede di
            Basaluzzo, in provincia di Alessandria.
          </p>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: text */}
            <div>
              <h2 className="text-3xl font-bold text-omef-forest mb-6">La nostra missione</h2>
              <p className="text-omef-muted leading-relaxed mb-4">
                OMEF nasce con un obiettivo preciso: portare sul mercato attrezzature forestali che
                uniscano la solidità della manifattura italiana alla praticità quotidiana del
                professionista. Ogni cesoie, trinciatrice o spaccalegna che esce dal nostro
                stabilimento deve durare, performare e ridurre i tempi di fermo macchina.
              </p>
              <p className="text-omef-muted leading-relaxed mb-4">
                Con oltre 45 anni di esperienza nel settore, abbiamo affinato processi e materiali
                per rispondere alle esigenze reali di chi lavora nei boschi, nelle aziende
                agricole e nei cantieri di manutenzione del verde. Conosciamo ogni modello di
                escavatore, ogni tipologia di terreno, ogni esigenza operativa.
              </p>
              <p className="text-omef-muted leading-relaxed">
                Il nostro impegno non si esaurisce con la vendita: offriamo supporto tecnico
                completo lungo tutto il ciclo di vita del prodotto, dalla consulenza iniziale alla
                fornitura di ricambi, attraverso una rete di 15 concessionari autorizzati
                distribuiti su tutto il territorio nazionale.
              </p>
            </div>

            {/* Right: stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-omef-paper rounded-xl p-6 border border-omef-light/60 flex flex-col justify-between"
                >
                  <span className="text-3xl font-bold text-omef-forest">
                    {stat.value}
                    {stat.suffix}
                  </span>
                  <span className="text-sm text-omef-muted mt-2 leading-snug">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="bg-omef-paper py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={18} className="text-omef-sage" />
            <span className="text-omef-sage text-sm font-semibold uppercase tracking-widest">
              Tappe principali
            </span>
          </div>
          <h2 className="text-3xl font-bold text-omef-forest mb-12">La nostra storia</h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[22px] top-0 bottom-0 w-px bg-omef-sage/30" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div key={item.year} className="flex gap-6 relative">
                  {/* Dot */}
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-omef-forest flex items-center justify-center z-10 shadow">
                    <span className="text-white text-xs font-bold leading-none text-center">
                      {item.year.slice(2)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="pt-1 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-omef-bark font-bold text-sm">{item.year}</span>
                    </div>
                    <h3 className="text-omef-forest font-semibold text-base mb-1">{item.title}</h3>
                    <p className="text-omef-muted text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-omef-sage text-sm font-semibold uppercase tracking-widest">
              Cosa ci guida
            </span>
            <h2 className="text-3xl font-bold text-omef-forest mt-2">I nostri valori</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="rounded-xl border border-omef-light bg-omef-paper p-8 flex flex-col gap-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-omef-forest/10 flex items-center justify-center">
                    <Icon size={24} className="text-omef-forest" />
                  </div>
                  <h3 className="text-omef-forest font-bold text-lg">{v.title}</h3>
                  <p className="text-omef-muted text-sm leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-omef-forest text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <MapPin size={32} className="text-omef-sage mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Vuoi saperne di più?</h2>
          <p className="text-omef-light/80 mb-8 text-lg leading-relaxed">
            Contattaci per richiedere informazioni sui nostri prodotti, trovare il concessionario
            più vicino o ricevere supporto tecnico personalizzato.
          </p>
          <Link
            to="/contatti"
            className="inline-flex items-center gap-2 bg-omef-bark text-white font-semibold px-8 py-4 rounded-lg hover:bg-omef-bark/90 transition-colors"
          >
            Contattaci ora
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
