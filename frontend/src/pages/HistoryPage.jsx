import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, Area, AreaChart
} from 'recharts'
import {
  TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight,
  BarChart3, Clock, Target, RefreshCw
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import AppSidebar from '../components/AppSidebar'

const demoHistory = [
  { date: 'Jan 2026', score: 520, change: null, category: 'Moderate Risk' },
  { date: 'Feb 2026', score: 565, change: 45, category: 'Moderate Risk' },
  { date: 'Mar 2026', score: 610, change: 45, category: 'Moderate Risk' },
  { date: 'Apr 2026', score: 645, change: 35, category: 'Moderate Risk' },
  { date: 'May 2026', score: 675, change: 30, category: 'Good' },
  { date: 'Jun 2026', score: 697, change: 22, category: 'Good' },
]

const riskColor = {
  'High Risk': '#ef4444',
  'Moderate Risk': '#f59e0b',
  'Good': '#3b82f6',
  'Excellent': '#10b981',
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const entry = payload[0].payload
    const color = riskColor[entry.category] || '#3b82f6'
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-xl font-bold text-white">{payload[0].value}</p>
        <p className="text-xs font-medium mt-1" style={{ color }}>{entry.category}</p>
        {entry.change !== null && entry.change !== undefined && (
          <p className={`text-xs mt-1 font-medium ${entry.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {entry.change >= 0 ? '+' : ''}{entry.change} pts
          </p>
        )}
      </div>
    )
  }
  return null
}

export default function HistoryPage() {
  const { theme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    // Try localStorage first, fall back to demoData
    const stored = localStorage.getItem('scoreku_history')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.length > 0) {
          setHistory(parsed)
          return
        }
      } catch (_) {}
    }
    setHistory(demoHistory)
  }, [])

  const pageBg = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const tableRowBorder = theme === 'dark' ? 'border-[#1a1a1a]' : 'border-gray-100'
  const tableBorder = theme === 'dark' ? 'border-[#1f1f1f]' : 'border-gray-200'

  const latest = history[history.length - 1]
  const first = history[0]
  const totalGain = latest && first ? latest.score - first.score : 0
  const chartData = history.map(h => ({ ...h, name: h.date.split(' ')[0] }))

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  return (
    <div className={`min-h-screen ${pageBg} ${textPrimary}`}>
      <button
        className={`lg:hidden fixed top-4 left-4 z-[55] p-2.5 border rounded-xl ${theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'}`}
        onClick={() => setSidebarOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <AppSidebar activePath="/history" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px] min-h-screen pb-24 lg:pb-8">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Header */}
          <motion.div variants={item} className="mb-8 pt-12 lg:pt-0">
            <div className="flex items-start justify-between">
              <div>
                <h1 className={`text-2xl font-bold ${textPrimary}`}>Score History</h1>
                <p className={`text-sm mt-1 ${textSecondary}`}>Track your credit score progress over time</p>
              </div>
              <Link
                to="/score"
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                <RefreshCw size={14} />
                Recalculate
              </Link>
            </div>
          </motion.div>

          {/* Summary Stats */}
          <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: 'Current Score',
                value: latest?.score ?? '—',
                sub: latest?.category,
                icon: BarChart3,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
              },
              {
                label: 'Total Gain',
                value: totalGain > 0 ? `+${totalGain}` : totalGain,
                sub: `since ${first?.date || 'start'}`,
                icon: TrendingUp,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
              },
              {
                label: 'Data Points',
                value: history.length,
                sub: 'months tracked',
                icon: Calendar,
                color: 'text-purple-400',
                bg: 'bg-purple-500/10',
              },
              {
                label: 'Last Updated',
                value: latest?.date ?? '—',
                sub: 'latest entry',
                icon: Clock,
                color: 'text-amber-400',
                bg: 'bg-amber-500/10',
              },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={i}
                  variants={item}
                  className={`border rounded-2xl p-4 ${cardBg}`}
                >
                  <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                    <Icon size={16} className={stat.color} />
                  </div>
                  <p className={`text-xl font-bold ${textPrimary}`}>{stat.value}</p>
                  <p className={`text-xs mt-0.5 ${textSecondary}`}>{stat.label}</p>
                  {stat.sub && <p className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>{stat.sub}</p>}
                </motion.div>
              )
            })}
          </motion.div>

          {/* Main Chart */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-6 ${cardBg}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp size={16} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className={`font-semibold text-sm ${textPrimary}`}>Score Trend</h3>
                  <p className={`text-xs ${textSecondary}`}>Your credit score over time</p>
                </div>
              </div>
              {totalGain !== 0 && (
                <span className={`flex items-center gap-1 text-sm font-bold ${totalGain > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {totalGain > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {totalGain > 0 ? '+' : ''}{totalGain} pts total
                </span>
              )}
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1f1f1f' : '#f0f0f0'} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[
                      (dataMin) => Math.max(300, dataMin - 50),
                      (dataMax) => Math.min(850, dataMax + 50)
                    ]}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {/* Reference lines for score tiers */}
                  <ReferenceLine y={530} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.4} />
                  <ReferenceLine y={650} stroke="#3b82f6" strokeDasharray="4 4" strokeOpacity={0.4} />
                  <ReferenceLine y={720} stroke="#10b981" strokeDasharray="4 4" strokeOpacity={0.4} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fill="url(#scoreGradient)"
                    dot={{ fill: '#2563eb', r: 4, strokeWidth: 2, stroke: '#111' }}
                    activeDot={{ r: 6, fill: '#14b8a6', stroke: '#111', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Score tier legend */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[#1f1f1f]">
              {[
                { label: 'Moderate Risk', color: '#f59e0b', threshold: '530' },
                { label: 'Good', color: '#3b82f6', threshold: '650' },
                { label: 'Excellent', color: '#10b981', threshold: '720' },
              ].map((tier) => (
                <div key={tier.label} className="flex items-center gap-2">
                  <div className="w-6 h-px" style={{ borderTop: `2px dashed ${tier.color}` }} />
                  <span className={`text-[11px] ${textSecondary}`}>{tier.threshold}+ {tier.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Month-by-month breakdown */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Calendar size={16} className="text-purple-400" />
              </div>
              <h3 className={`font-semibold text-sm ${textPrimary}`}>Month-by-Month Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr className={`border-b ${tableBorder}`}>
                    <th className={`text-left py-3 px-3 text-xs font-medium uppercase tracking-wider ${textSecondary}`}>Date</th>
                    <th className={`text-left py-3 px-3 text-xs font-medium uppercase tracking-wider ${textSecondary}`}>Score</th>
                    <th className={`text-left py-3 px-3 text-xs font-medium uppercase tracking-wider ${textSecondary}`}>Change</th>
                    <th className={`text-left py-3 px-3 text-xs font-medium uppercase tracking-wider ${textSecondary}`}>Category</th>
                    <th className={`text-left py-3 px-3 text-xs font-medium uppercase tracking-wider ${textSecondary}`}>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {[...history].reverse().map((entry, i) => {
                    const color = riskColor[entry.category] || '#3b82f6'
                    const pct = Math.round(((entry.score - 300) / 550) * 100)
                    return (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className={`border-b last:border-0 ${tableRowBorder}`}
                      >
                        <td className={`py-3 px-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{entry.date}</td>
                        <td className={`py-3 px-3 font-bold ${textPrimary}`}>{entry.score}</td>
                        <td className="py-3 px-3">
                          {entry.change !== null && entry.change !== undefined ? (
                            <span className={`flex items-center gap-1 text-xs font-medium ${entry.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {entry.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                              {entry.change >= 0 ? '+' : ''}{entry.change}
                            </span>
                          ) : (
                            <span className={`text-xs ${textSecondary}`}>—</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color, backgroundColor: `${color}15` }}>
                            {entry.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 w-32">
                          <div className={`h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-gray-100'}`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.5 + i * 0.05, duration: 0.6 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          </div>
                          <span className={`text-[10px] ${textSecondary}`}>{pct}%</span>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={item} className={`border rounded-2xl p-6 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 ${theme === 'dark' ? 'border-emerald-500/20' : 'border-emerald-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Target size={18} className="text-emerald-400" />
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${textPrimary}`}>Want to improve faster?</h3>
                <p className={`text-xs ${textSecondary}`}>Get personalized tips based on your score factors</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                View Dashboard
              </Link>
              <Link
                to="/learn"
                className={`px-4 py-2 rounded-xl text-sm font-medium border ${theme === 'dark' ? 'border-[#2a2a2a] text-gray-300 hover:border-emerald-500/30' : 'border-gray-200 text-gray-700 hover:border-emerald-300'} transition-colors`}
              >
                Learn More
              </Link>
            </div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  )
}
