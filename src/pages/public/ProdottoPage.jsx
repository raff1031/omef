import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Package, Wrench, MapPin } from 'lucide-react';
import { PRODUCTS } from '../../data/products';

const applicationIcons = [CheckCircle, Package, Wrench, MapPin];

const statusColors = {
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
};

export default function ProdottoPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-omef-paper flex flex-col items-center justify-center px-4 text-center">
        <span className="text-6xl mb-6">🔍</span>
        <h1 className="text-3xl font-bold text-omef-forest mb-3">Prodotto non trovato</h1>
        <p className="text-omef-muted mb-8">
          Il prodotto che stai cercando non esiste o è stato rimosso.
        </p>
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 bg-omef-forest text-white px-6 py-3 rounded-lg font-medium hover:bg-omef-bark transition-colors"
        >
          <ArrowLeft size={18} />
          Torna al catalogo
        </Link>
      </div>
    );
  }

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  ).slice(0, 3);

  const availabilityText =
    product.status === 'red'
      ? 'Su ordinazione'
      : `${product.qty} ${product.qty === 1 ? 'unità disponibile' : 'unità disponibili'}`;

  const handleAskAI = () => {
    sessionStorage.setItem('omef_prefill', `Disponibilità ${product.name}`);
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-omef-paper">
      {/* BREADCRUMB */}
      <div className="bg-white border-b border-omef-light">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-omef-muted">
          <Link to="/" className="hover:text-omef-forest transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/catalogo" className="hover:text-omef-forest transition-colors">
            Catalogo
          </Link>
          <span>/</span>
          <span className="text-omef-forest font-medium">{product.name}</span>
        </div>
      </div>

      {/* PRODUCT HERO */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* LEFT COLUMN */}
            <div>
              <div className="h-72 w-full bg-omef-light rounded-2xl flex items-center justify-center text-8xl mb-4">
                {product.emoji}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[product.status]}`}
                >
                  {product.statusLabel}
                </span>
                <span className="text-sm text-omef-muted">{availabilityText}</span>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              <span className="inline-block bg-omef-sage/20 text-omef-sage text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                {product.categoryLabel}
              </span>

              <h1 className="text-3xl font-bold text-omef-forest mb-4">{product.name}</h1>

              <p className="text-lg text-omef-bark leading-relaxed mb-5">{product.shortDesc}</p>

              <div className="inline-flex items-center gap-2 bg-omef-light text-omef-forest text-sm font-medium px-4 py-2 rounded-lg mb-5">
                <span>🔩</span>
                <span>
                  Escavatori {product.minWeight}–{product.maxWeight} ton
                </span>
              </div>

              <p className="text-omef-muted leading-relaxed mb-8">{product.fullDesc}</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`mailto:info@omefgroup.com?subject=Preventivo ${encodeURIComponent(product.name)}`}
                  className="inline-flex items-center justify-center gap-2 bg-omef-forest text-white px-6 py-3 rounded-lg font-semibold hover:bg-omef-bark transition-colors"
                >
                  📞 Richiedi preventivo
                </a>
                <button
                  onClick={handleAskAI}
                  className="inline-flex items-center justify-center gap-2 border-2 border-omef-forest text-omef-forest px-6 py-3 rounded-lg font-semibold hover:bg-omef-forest hover:text-white transition-colors"
                >
                  💬 Chiedi all'AI →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPECS TABLE */}
      <section className="bg-omef-paper py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-omef-forest mb-6">Specifiche tecniche</h2>
          <div className="rounded-xl overflow-hidden border border-omef-light">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specs).map(([key, value], idx) => (
                  <tr key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-omef-light'}>
                    <td className="px-5 py-3 font-semibold text-omef-forest w-1/3">{key}</td>
                    <td className="px-5 py-3 text-omef-bark">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* APPLICATIONS */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-omef-forest mb-6">Applicazioni principali</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {product.applications.map((app, idx) => {
              const Icon = applicationIcons[idx % applicationIcons.length];
              return (
                <div
                  key={app}
                  className="bg-omef-light rounded-xl p-5 flex flex-col items-center text-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-omef-forest/10 flex items-center justify-center">
                    <Icon size={20} className="text-omef-forest" />
                  </div>
                  <p className="text-sm font-medium text-omef-bark leading-snug">{app}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <section className="bg-omef-paper py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-omef-forest mb-6">Prodotti correlati</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/prodotti/${rel.slug}`}
                  className="bg-white rounded-2xl p-6 border border-omef-light hover:border-omef-forest hover:shadow-md transition-all group"
                >
                  <div className="h-28 bg-omef-light rounded-xl flex items-center justify-center text-5xl mb-4 group-hover:scale-105 transition-transform">
                    {rel.emoji}
                  </div>
                  <span className="text-xs font-semibold text-omef-sage uppercase tracking-wider">
                    {rel.categoryLabel}
                  </span>
                  <h3 className="text-base font-bold text-omef-forest mt-1 mb-2">{rel.name}</h3>
                  <p className="text-sm text-omef-muted line-clamp-2">{rel.shortDesc}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[rel.status]}`}
                    >
                      {rel.statusLabel}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BACK LINK */}
      <div className="bg-white py-6 border-t border-omef-light">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 text-omef-forest font-medium hover:text-omef-bark transition-colors"
          >
            <ArrowLeft size={16} />
            Torna al catalogo
          </Link>
        </div>
      </div>
    </div>
  );
}
