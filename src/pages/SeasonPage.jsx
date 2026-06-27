import { SEASONALITY, MONTHS_FULL, MONTHS_SHORT } from '../data/seasonality'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

const chartData = MONTHS_SHORT.map((month, i) => ({
  month,
  cesoie: SEASONALITY[0].data[i],
  trince: SEASONALITY[1].data[i],
  legna: SEASONALITY[2].data[i],
  noleggio: SEASONALITY[3].data[i],
}))

const currentMonth = new Date().getMonth()
const currentMonthShort = MONTHS_SHORT[currentMonth]

const QUARTER_RANGES = [
  { label: 'Q1', months: [0, 1, 2] },
  { label: 'Q2', months: [3, 4, 5] },
  { label: 'Q3', months: [6, 7, 8] },
  { label: 'Q4', months: [9, 10, 11] },
]

function cellColor(val) {
  if (val >= 7) return 'text-red-600 font-semibold'
  if (val >= 5) return 'text-amber-600'
  return 'text-omef-muted'
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  const monthIdx = MONTHS_SHORT.indexOf(label)
  const fullName = monthIdx >= 0 ? MONTHS_FULL[monthIdx] : label
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-omef-forest mb-2">{fullName}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-0.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-omef-muted">{entry.name}:</span>
          <span className="font-medium text-omef-forest">{entry.value}/10</span>
        </div>
      ))}
    </div>
  )
}

export default function SeasonPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-omef-forest mb-1">
          Stagionalita&#39; &amp; Piano Produzione
        </h1>
        <p className="text-omef-muted text-sm">
          Anticipa la produzione di 8-12 settimane rispetto ai picchi di domanda
        </p>
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-base font-semibold text-omef-forest mb-4">
          Indice di domanda mensile (scala 1-10)
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8EDE4" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#5A6A5C' }}
              tickLine={false}
              axisLine={{ stroke: '#E8EDE4' }}
            />
            <YAxis
              domain={[0, 10]}
              tickCount={6}
              tick={{ fontSize: 12, fill: '#5A6A5C' }}
              tickLine={false}
              axisLine={false}
              label={{
                value: 'Domanda',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
                style: { fontSize: 11, fill: '#5A6A5C' },
              }}
            />
            <ReferenceLine
              x={currentMonthShort}
              stroke="#3D6B2A"
              strokeDasharray="4 4"
              label={{ value: 'Oggi', position: 'top', fill: '#3D6B2A', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            />
            {SEASONALITY.map((cat) => (
              <Line
                key={cat.id}
                type="monotone"
                dataKey={cat.id}
                name={cat.label}
                stroke={cat.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Cosa produrre adesso */}
      <div className="mb-6">
        <div className="mb-3">
          <h2 className="text-base font-semibold text-omef-forest">
            Cosa avviare in produzione questo mese
          </h2>
          <p className="text-sm text-omef-muted">
            Mese corrente: {MONTHS_FULL[currentMonth]}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SEASONALITY.map((cat) => {
            const targetMonth = (currentMonth + Math.round(cat.productionLead / 4)) % 12
            const demandAtTarget = cat.data[targetMonth]
            const shouldProduce = demandAtTarget >= 7

            if (shouldProduce) {
              return (
                <div
                  key={cat.id}
                  className="bg-omef-forest text-white rounded-xl p-4 border-0 flex flex-col gap-1.5"
                  style={{ background: '#152E20' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-omef-sage opacity-75" style={{ background: '#7A9E50' }} />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#7A9E50' }} />
                    </span>
                    <span className="font-semibold text-sm">{cat.label}</span>
                  </div>
                  <p className="text-xs" style={{ color: '#B8D4A0' }}>
                    Domanda prevista: {demandAtTarget}/10
                  </p>
                  <p className="text-xs" style={{ color: '#EEF2E8' }}>
                    Avvia produzione ora per coprire il picco di {MONTHS_FULL[targetMonth]}
                  </p>
                </div>
              )
            }

            return (
              <div
                key={cat.id}
                className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-1.5"
              >
                <span className="font-medium text-sm text-omef-forest">{cat.label}</span>
                <p className="text-xs text-omef-muted">
                  Domanda: {demandAtTarget}/10 &mdash; pianificazione non urgente
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quarterly Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-omef-forest mb-4">
          Piano trimestrale &mdash; medie domanda
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-4 font-semibold text-omef-forest w-20">
                  Trimestre
                </th>
                {SEASONALITY.map((cat) => (
                  <th
                    key={cat.id}
                    className="text-center py-2 px-3 font-semibold text-omef-forest"
                  >
                    {cat.id === 'legna' ? 'Spaccalegna' : cat.label.split(' /')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {QUARTER_RANGES.map((q) => {
                return (
                  <tr key={q.label} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5 pr-4 font-medium text-omef-forest">{q.label}</td>
                    {SEASONALITY.map((cat) => {
                      const avg =
                        Math.round(
                          (q.months.reduce((sum, mi) => sum + cat.data[mi], 0) / 3) * 10
                        ) / 10
                      return (
                        <td
                          key={cat.id}
                          className={`text-center py-2.5 px-3 ${cellColor(avg)}`}
                        >
                          {avg.toFixed(1)}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-omef-muted mt-3">
          <span className="text-red-600 font-semibold">7.0+</span> alta domanda &nbsp;&bull;&nbsp;
          <span className="text-amber-600">5.0-6.9</span> media &nbsp;&bull;&nbsp;
          <span className="text-omef-muted">sotto 5.0</span> bassa
        </p>
      </div>
    </div>
  )
}
