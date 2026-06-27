import { useState } from 'react'
import { MapPin, Phone, Mail, MessageCircle, Loader2, Navigation } from 'lucide-react'
import { DEALERS } from '../data/dealers'
import { getLocation, getNearestDealers, haversine } from '../lib/geo'

export default function DealerPage() {
  const [userLocation, setUserLocation] = useState(null)
  const [nearestDealers, setNearestDealers] = useState([])
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [allDealersWithDist, setAllDealersWithDist] = useState(DEALERS)

  async function handleLocate() {
    setIsLocating(true)
    setLocationError('')
    try {
      const loc = await getLocation()
      setUserLocation(loc)
      const nearest = getNearestDealers(loc, DEALERS, 3)
      setNearestDealers(nearest)
      const augmented = DEALERS.map((d) => ({
        ...d,
        km: Math.round(haversine(loc.lat, loc.lon, d.lat, d.lon)),
      }))
      setAllDealersWithDist(augmented)
    } catch (err) {
      setLocationError(err.message || 'Impossibile rilevare la posizione.')
    } finally {
      setIsLocating(false)
    }
  }

  function distanceBadge(km) {
    if (km < 50) {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          {km} km
        </span>
      )
    }
    if (km < 150) {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
          {km} km
        </span>
      )
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
        {km} km
      </span>
    )
  }

  function waLink(tel) {
    const digits = tel.replace(/\D/g, '')
    return `https://wa.me/${digits}`
  }

  return (
    <div className="min-h-screen bg-omef-paper py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-omef-forest mb-1">
            Rete Concessionari OMEF
          </h1>
          <p className="text-omef-muted text-sm">
            15 dealer autorizzati in tutta Italia
          </p>
        </div>

        {/* Finder section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Navigation className="w-5 h-5 text-omef-olive" />
            <h2 className="text-lg font-semibold text-omef-forest">
              Trova il dealer piu vicino
            </h2>
          </div>

          {!userLocation && !isLocating && (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleLocate}
                className="w-full max-w-xs flex items-center justify-center gap-2 bg-omef-forest text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
              >
                <MapPin className="w-4 h-4" />
                Usa la mia posizione
              </button>

              <div className="flex items-center gap-3 w-full max-w-xs">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-omef-muted text-xs">oppure</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="w-full max-w-xs relative">
                <input
                  type="text"
                  disabled
                  placeholder="Scrivi comune o provincia..."
                  className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-omef-muted bg-omef-light px-2 py-0.5 rounded-full">
                  Prossimamente
                </span>
              </div>
            </div>
          )}

          {isLocating && (
            <div className="flex items-center justify-center gap-3 py-6 text-omef-muted">
              <Loader2 className="w-5 h-5 animate-spin text-omef-olive" />
              <span className="text-sm font-medium">Rilevamento posizione...</span>
            </div>
          )}

          {locationError && (
            <p className="text-red-600 text-sm mt-2 text-center">{locationError}</p>
          )}

          {userLocation && nearestDealers.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-omef-forest mb-4">
                3 dealer piu vicini a te:
              </p>
              <div className="flex flex-col gap-3">
                {nearestDealers.map((dealer, index) => (
                  <div
                    key={dealer.id ?? index}
                    className="bg-omef-light rounded-xl p-4 border border-omef-sage/20 flex gap-4"
                  >
                    {/* Position badge */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-omef-forest text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-semibold text-omef-forest text-sm leading-tight">
                            {dealer.name}
                          </p>
                          <p className="text-omef-muted text-xs mt-0.5">
                            {dealer.city}
                            {dealer.province ? ` (${dealer.province})` : ''}
                          </p>
                        </div>
                        {dealer.km !== undefined && distanceBadge(dealer.km)}
                      </div>

                      {/* Action row */}
                      <div className="flex flex-wrap gap-3">
                        {dealer.tel && (
                          <a
                            href={`tel:${dealer.tel}`}
                            className="flex items-center gap-1.5 text-omef-forest font-medium text-sm hover:text-omef-olive transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            Chiama ora
                          </a>
                        )}
                        {dealer.email && (
                          <a
                            href={`mailto:${dealer.email}`}
                            className="flex items-center gap-1.5 text-omef-muted font-medium text-sm hover:text-omef-forest transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            Email
                          </a>
                        )}
                        {dealer.tel && (
                          <a
                            href={waLink(dealer.tel)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-omef-muted font-medium text-sm hover:text-omef-forest transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Full directory */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-omef-forest mb-5">
            Tutti i 15 concessionari OMEF in Italia
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-semibold text-omef-forest">
                    Dealer
                  </th>
                  <th className="text-left py-2 pr-4 font-semibold text-omef-forest">
                    Citta
                  </th>
                  <th className="text-left py-2 pr-4 font-semibold text-omef-forest">
                    Prov
                  </th>
                  <th className="text-left py-2 pr-4 font-semibold text-omef-forest">
                    Telefono
                  </th>
                  <th className="text-left py-2 font-semibold text-omef-forest">
                    Distanza
                  </th>
                </tr>
              </thead>
              <tbody>
                {allDealersWithDist.map((dealer, index) => (
                  <tr
                    key={dealer.id ?? index}
                    className={index % 2 === 0 ? 'bg-omef-light/50' : ''}
                  >
                    <td className="py-2.5 pr-4 font-medium text-omef-forest whitespace-nowrap">
                      {dealer.name}
                    </td>
                    <td className="py-2.5 pr-4 text-omef-muted whitespace-nowrap">
                      {dealer.city}
                    </td>
                    <td className="py-2.5 pr-4 text-omef-muted">
                      {dealer.province ?? '-'}
                    </td>
                    <td className="py-2.5 pr-4">
                      {dealer.tel ? (
                        <a
                          href={`tel:${dealer.tel}`}
                          className="text-omef-olive hover:text-omef-forest transition-colors"
                        >
                          {dealer.tel}
                        </a>
                      ) : (
                        <span className="text-omef-muted">-</span>
                      )}
                    </td>
                    <td className="py-2.5">
                      {dealer.km !== undefined ? (
                        distanceBadge(dealer.km)
                      ) : (
                        <span className="text-omef-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
