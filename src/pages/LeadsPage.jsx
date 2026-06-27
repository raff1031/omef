import { getLeads, clearLeads, getLeadStats } from '../lib/leadTracker'
import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Trash2, Users, TrendingUp, Target, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const CATEGORY_COLORS = {
  cesoie:  '#3D6B2A',
  trince:  '#7A9E50',
  legna:   '#C4924A',
}
const DEFAULT_COLOR = '#152E20'

function getCategoryColor(cat) {
  return CATEGORY_COLORS[cat] || DEFAULT_COLOR
}

function ScoreBadge({ score }) {
  let cls = 'rounded-full px-2 py-0.5 text-xs font-bold '
  if (score <= 3)      cls += 'bg-red-100 text-red-800'
  else if (score <= 6) cls += 'bg-amber-100 text-amber-800'
  else                 cls += 'bg-green-100 text-green-800'
  return <span className={cls}>{score}</span>
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={16} className="text-omef-olive" />
        <span className="text-sm text-omef-muted">{label}</span>
      </div>
      <div className="text-3xl font-bold text-omef-forest">{value}</div>
    </div>
  )
}

export default function LeadsPage() {
  const [leads, setLeads] = useState(() => getLeads())

  useEffect(() => {
    const id = setInterval(() => {
      setLeads(getLeads())
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const stats = getLeadStats(leads)

  // --- stats row values ---
  const topCategory = Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'
  const lastTime = leads.at(-1)?.time || '-'

  // --- bar chart data ---
  const barData = Object.entries(stats.byCategory).map(([name, value]) => ({ name, value }))

  // --- line chart: last 7 days ---
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const fullDate = d.toLocaleDateString('it-IT')
    const shortDate = d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })
    return { date: shortDate, count: stats.byDate[fullDate] || 0 }
  })

  function handleClear() {
    if (confirm('Cancellare tutti i lead della sessione?')) {
      clearLeads()
      setLeads([])
    }
  }

  return (
    <div className="min-h-screen bg-omef-paper p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-omef-forest">
          Lead Tracker &mdash; Sessione corrente
        </h1>
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white text-omef-muted hover:text-red-600 hover:bg-red-50 shadow-sm transition-colors text-sm"
        >
          <Trash2 size={16} />
          Cancella
        </button>
      </div>

      {/* Empty state */}
      {leads.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Users size={48} className="text-omef-muted" />
          <h2 className="text-xl font-semibold text-omef-forest">Nessun lead ancora</h2>
          <p className="text-omef-muted text-sm">Inizia una conversazione nella Chat AI</p>
          <Link
            to="/demo"
            className="mt-2 px-5 py-2 rounded-xl bg-omef-olive text-white text-sm font-medium hover:bg-omef-forest transition-colors"
          >
            Vai alla chat &rarr;
          </Link>
        </div>
      )}

      {leads.length > 0 && (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Users}      label="Totale lead"      value={stats.total} />
            <StatCard icon={Target}     label="Score medio"      value={`${stats.avgScore}/10`} />
            <StatCard icon={TrendingUp} label="Categoria top"    value={topCategory} />
            <StatCard icon={Clock}      label="Ultima richiesta" value={lastTime} />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Bar chart */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-omef-forest mb-3">Lead per categoria</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF2E8" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5A6A5C' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#5A6A5C' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {barData.map((entry) => (
                      <Cell key={entry.name} fill={getCategoryColor(entry.name)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line chart */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-omef-forest mb-3">Ultimi 7 giorni</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={last7} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF2E8" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#5A6A5C' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#5A6A5C' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#7A9E50"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#7A9E50' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lead table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-omef-light">
              <h2 className="text-sm font-semibold text-omef-forest">Storico richieste</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-omef-forest text-white">
                    <th className="px-3 py-3 text-left font-medium w-8">#</th>
                    <th className="px-3 py-3 text-left font-medium">Prodotto</th>
                    <th className="px-3 py-3 text-left font-medium">Domanda</th>
                    <th className="px-3 py-3 text-left font-medium">Categoria</th>
                    <th className="px-3 py-3 text-left font-medium">Posizione</th>
                    <th className="px-3 py-3 text-left font-medium">Score</th>
                    <th className="px-3 py-3 text-left font-medium whitespace-nowrap">Data/Ora</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice().reverse().map((lead, idx) => {
                    const q = lead.question || ''
                    const truncated = q.length > 40 ? q.slice(0, 40) + '...' : q
                    return (
                      <tr
                        key={lead.id}
                        className="border-b border-omef-light last:border-0 hover:bg-omef-paper transition-colors"
                      >
                        <td className="px-3 py-3 text-omef-muted">{leads.length - idx}</td>
                        <td className="px-3 py-3 font-medium text-omef-forest whitespace-nowrap">
                          {lead.product}
                        </td>
                        <td className="px-3 py-3 text-omef-muted max-w-[220px]" title={q}>
                          {truncated}
                        </td>
                        <td className="px-3 py-3">
                          <span className="bg-omef-light text-omef-muted text-xs rounded px-2 py-0.5">
                            {lead.category}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-omef-muted whitespace-nowrap">
                          {lead.location}
                        </td>
                        <td className="px-3 py-3">
                          <ScoreBadge score={lead.score} />
                        </td>
                        <td className="px-3 py-3 text-omef-muted whitespace-nowrap">
                          {lead.date} {lead.time}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
