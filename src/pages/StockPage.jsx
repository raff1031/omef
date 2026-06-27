import { useState } from 'react'
import { Package, Filter, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { STOCK } from '../data/stock'
import StatusBadge from '../components/StatusBadge'

const CATEGORIES = ['Tutti', 'cesoie', 'trince', 'legna', 'pinze', 'potatura', 'terreno', 'usato']

export default function StockPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tutti')
  const navigate = useNavigate()

  const filteredStock =
    selectedCategory === 'Tutti'
      ? STOCK
      : STOCK.filter((s) => s.category === selectedCategory)

  const countByStatus = (status) => STOCK.filter((s) => s.status === status).length

  function handleAskAvailability(product) {
    sessionStorage.setItem('omef_prefill', 'Disponibilita ' + product.name)
    navigate('/demo')
  }

  return (
    <div className="min-h-screen bg-omef-paper px-4 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Package className="text-omef-forest w-6 h-6" />
          <h1 className="text-2xl font-bold text-omef-forest">Magazzino OMEF GROUP</h1>
        </div>
        <p className="text-sm text-omef-muted">
          Disponibilita&apos; in tempo reale &mdash; aggiornato oggi
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <Filter className="text-omef-muted w-4 h-4 flex-shrink-0" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={[
              'px-3 py-1 rounded-full text-sm font-medium border transition-colors capitalize',
              selectedCategory === cat
                ? 'bg-omef-forest text-white border-omef-forest'
                : 'bg-white text-omef-muted border-gray-200 hover:border-omef-sage',
            ].join(' ')}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredStock.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
          >
            {/* Top row: SKU + status */}
            <div className="flex items-center justify-between">
              <span className="text-xs bg-omef-light text-omef-muted px-2 py-0.5 rounded font-mono">
                {product.id}
              </span>
              <StatusBadge status={product.status} label={product.label} size="sm" />
            </div>

            {/* Name */}
            <p className="text-lg font-semibold text-omef-forest mt-2 leading-snug">
              {product.name}
            </p>

            {/* Quantity */}
            <p className="text-sm mt-1">
              {product.qty > 0 ? (
                <span className="text-omef-muted">{product.qty} pz. a magazzino</span>
              ) : (
                <span className="text-red-600 font-medium">Su richiesta</span>
              )}
            </p>

            {/* Weight range */}
            <div className="flex items-center gap-1 text-sm text-omef-muted mt-1">
              <Zap className="w-3.5 h-3.5 flex-shrink-0 text-omef-bark" />
              <span>
                Escavatore: {product.minWeight}&ndash;{product.maxWeight} ton
              </span>
            </div>

            {/* CTA button */}
            <button
              onClick={() => handleAskAvailability(product)}
              className="mt-auto pt-4 w-full bg-omef-light hover:bg-omef-sage/20 text-omef-forest text-sm py-2 rounded-lg font-medium transition-colors"
            >
              Chiedi disponibilita&apos;
            </button>
          </div>
        ))}
      </div>

      {/* Stats bar */}
      <div className="bg-omef-forest text-white rounded-2xl p-4 flex justify-around text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
          <span>Disponibili: {countByStatus('green')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          <span>Ultimi pezzi: {countByStatus('amber')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
          <span>Su ordinazione: {countByStatus('red')}</span>
        </div>
      </div>
    </div>
  )
}
