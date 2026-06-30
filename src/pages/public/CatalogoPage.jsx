import { useState, useMemo } from 'react';
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
  { value: 'cesoie', label: 'Cesoie' },
  { value: 'trince', label: 'Trince' },
  { value: 'legna', label: 'Legna' },
  { value: 'potatura', label: 'Potatura' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'usato', label: 'Usato' },
];

const STATUS_CONFIG = {
  green: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  red: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
};

function StatusBadge({ status, statusLabel }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.green;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {statusLabel}
    </span>
  );
}

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl border border-omef-light shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden">
      {/* Top image area */}
      <div className="relative overflow-hidden h-36">
        <img
          src={CATEGORY_IMAGES[product.category] || CATEGORY_IMAGES.usato}
          alt={product.categoryLabel}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-omef-forest/20" />
        <div className="absolute top-3 right-3">
          <StatusBadge status={product.status} statusLabel={product.statusLabel} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <p className="text-xs font-medium text-omef-sage uppercase tracking-wide mb-1">
            {product.categoryLabel}
          </p>
          <h3 className="font-bold text-omef-forest text-base leading-snug">{product.name}</h3>
          <p className="text-sm text-omef-muted mt-1 line-clamp-2">{product.shortDesc}</p>
        </div>

        {/* Compatibility */}
        <div className="text-sm text-omef-bark font-medium">
          🔩 Mini {product.minWeight}–{product.maxWeight} ton
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-3 pt-2 border-t border-omef-light">
          <Link
            to="/contatti?tipo=preventivo"
            className="flex-1 text-center bg-omef-forest text-white text-sm font-semibold py-2 px-3 rounded-lg hover:bg-omef-bark transition-colors duration-150"
          >
            Richiedi preventivo
          </Link>
          <Link
            to={`/prodotti/${product.slug}`}
            className="text-sm font-medium text-omef-forest hover:text-omef-bark transition-colors duration-150 whitespace-nowrap"
          >
            Dettaglio →
          </Link>
        </div>
      </div>
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
    if (value === 'tutti') {
      params.delete('cat');
    } else {
      params.set('cat', value);
    }
    setSearchParams(params, { replace: true });
  }

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = activeCategory === 'tutti' || p.category === activeCategory;
      const query = searchText.trim().toLowerCase();
      const matchSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.shortDesc.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchText]);

  return (
    <div className="min-h-screen bg-omef-paper">
      {/* PAGE HEADER */}
      <section className="bg-omef-forest text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-omef-sage mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-omef-sage/60">/</li>
              <li className="text-white font-medium">Catalogo</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold tracking-tight mb-3">Catalogo Prodotti</h1>
          <p className="text-omef-sage text-lg max-w-2xl">
            Scopri la gamma completa di attrezzature forestali OMEF: cesoie, trince, spaccalegna,
            pinze e fresaceppi progettati per ogni esigenza operativa.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="sticky top-16 z-20 bg-white border-b border-omef-light shadow-sm py-3 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors duration-150 ${
                    isActive
                      ? 'bg-omef-forest text-white border-omef-forest'
                      : 'border-omef-bark/30 text-omef-forest hover:bg-omef-light'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search input */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-omef-muted"
              size={16}
            />
            <input
              type="text"
              placeholder="Cerca prodotto..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-omef-bark/30 rounded-full text-sm text-omef-forest placeholder-omef-muted focus:outline-none focus:ring-2 focus:ring-omef-forest/30"
            />
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <section className="bg-omef-paper py-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Count */}
          <p className="text-sm text-omef-muted mb-6">
            <span className="font-semibold text-omef-forest">{filteredProducts.length}</span>{' '}
            {filteredProducts.length === 1 ? 'prodotto trovato' : 'prodotti trovati'}
          </p>

          {/* Grid or empty state */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-6xl mb-4">🔍</span>
              <h2 className="text-xl font-semibold text-omef-forest mb-2">
                Nessun prodotto trovato
              </h2>
              <p className="text-omef-muted max-w-sm">
                Prova a modificare i filtri o il testo di ricerca per vedere altri risultati.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('tutti');
                  setSearchText('');
                  setSearchParams({}, { replace: true });
                }}
                className="mt-6 px-5 py-2 bg-omef-forest text-white rounded-full text-sm font-medium hover:bg-omef-bark transition-colors duration-150"
              >
                Reimposta filtri
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
