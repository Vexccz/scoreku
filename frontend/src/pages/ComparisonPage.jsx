import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Shield, LayoutDashboard, FileText, Sparkles, Brain, Settings,
  Building2, Users, BarChart3, TrendingUp, ChevronRight, GitCompare
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'
import AppSidebar from '../components/AppSidebar'

// ─── Demo Data ───────────────────────────────────────────────────────────────

const userScore = 697

const comparisons = [
  { label: 'National Average', value: 580, icon: Users },
  { label: 'Same Age Group (26-30)', value: 620, icon: Users },
  { label: 'Same Employment (Gig Worker)', value: 545, icon: BarChart3 },
  { label: 'Same State (Selangor)', value: 635, icon: Building2 },
]

const dimensions = [
  { label: 'Payment', user: 750, avg: 590 },
  { label: 'Income', user: 710, avg: 570 },
  { label: 'Digital', user: 680, avg: 540 },
  { label: 'Account Age', user: 640, avg: 660 },
  { label: 'Spending', user: 610, avg: 520 },
]



// ─── Radar Chart (SVG) ──────────────────────────────────────────────────────

function RadarChart({ dimensions }) {
  const cx = 150, cy = 150, r = 100
  const n = dimensions.length
  const angleStep = (2 * Math.PI) / n

  const getPoint = (value, index) => {
    const angle = angleStep * index - Math.PI / 2
    const dist = ((value - 300) / 550) * r
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) }
  }

  const userPoints = dimensions.map((d, i) => getPoint(d.user, i))
  const avgPoints = dimensions.map((d, i) => getPoint(d.avg, i))

  const toPath = (points) => points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  // Grid lines
  const gridLevels = [410, 520, 630, 740, 850]

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[300px] mx-auto">
      {/* Grid */}
      {gridLevels.map((level) => {
        const points = Array.from({ length: n }, (_, i) => getPoint(level, i))
        return (
          <polygon
            key={level}
            points={points.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#1f1f1f"
            strokeWidth="0.5"
          />
        )
      })}
      {/* Axis lines */}
      {dimensions.map((_, i) => {
        const p = getPoint(100, i)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#1f1f1f" strokeWidth="0.5" />
      })}
      {/* Average polygon */}
      <motion.path
        d={toPath(avgPoints)}
        fill="rgba(156, 163, 175, 0.15)"
        stroke="#6b7280"
        strokeWidth="1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      />
      {/* User polygon */}
      <motion.path
        d={toPath(userPoints)}
        fill="rgba(37, 99, 235, 0.2)"
        stroke="#2563eb"
        strokeWidth="2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {/* User dots */}
      {userPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#2563eb" />
      ))}
      {/* Labels */}
      {dimensions.map((d, i) => {
        const labelPoint = getPoint(120, i)
        return (
          <text
            key={i}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-400 text-[10px]"
          >
            {d.label}
          </text>
        )
      })}
    </svg>
  )
}



// ─── Main Component ──────────────────────────────────────────────────────────

export default function ComparisonPage() {
  const { theme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pageBg = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
  const barBg = theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-gray-100'

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className={`min-h-screen ${pageBg} ${textPrimary}`}>
      {/* Mobile hamburger */}
      <button
        className={`lg:hidden fixed top-4 left-4 z-[55] p-2.5 border rounded-xl ${theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'}`}
        onClick={() => setSidebarOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <AppSidebar activePath="/comparison" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px] min-h-screen pb-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        >
          {/* Hero */}
          <motion.div variants={item} className="mb-8">
            <h1 className={`text-2xl font-bold ${textPrimary}`}>How You Compare</h1>
            <p className={`text-sm mt-1 ${textSecondary}`}>See how your score stacks up against others</p>
          </motion.div>

          {/* Percentile Banner */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-6 ${cardBg} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-teal-500/5" />
            <div className="relative flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center">
                <TrendingUp size={28} className="text-blue-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className={`text-lg font-bold ${textPrimary}`}>You're in the top 35% of all ScoreKu users</p>
                <p className={`text-sm ${textSecondary}`}>Top 20% among gig workers</p>
              </div>
              <div className="sm:ml-auto">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                  {userScore}
                </div>
                <p className={`text-xs text-center ${textSecondary}`}>Your Score</p>
              </div>
            </div>
          </motion.div>

          {/* Comparison Bars */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BarChart3 size={16} className="text-blue-400" />
              </div>
              <h3 className="font-semibold text-sm">Score Comparison</h3>
            </div>
            <div className="space-y-6">
              {comparisons.map((comp, i) => {
                const Icon = comp.icon
                const userPct = ((userScore - 300) / 550) * 100
                const avgPct = ((comp.value - 300) / 550) * 100
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className={textSecondary} />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{comp.label}</span>
                      </div>
                      <span className={`text-xs ${textSecondary}`}>{comp.value}/850</span>
                    </div>
                    {/* User bar */}
                    <div className={`h-3 rounded-full overflow-hidden mb-1 ${barBg}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${userPct}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                      />
                    </div>
                    {/* Average bar */}
                    <div className={`h-3 rounded-full overflow-hidden ${barBg}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${avgPct}%` }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                        className="h-full rounded-full bg-gray-500/50"
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] text-blue-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> You: {userScore}
                      </span>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-gray-500 inline-block" /> Avg: {comp.value}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Radar Chart */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                <GitCompare size={16} className="text-teal-400" />
              </div>
              <h3 className="font-semibold text-sm">Dimension Comparison</h3>
            </div>
            <RadarChart dimensions={dimensions} />
            <div className="flex items-center justify-center gap-6 mt-4">
              <span className="text-xs text-blue-400 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Your Score
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-500 inline-block" /> Average
              </span>
            </div>
          </motion.div>

          {/* Percentile by Category */}
          <motion.div variants={item} className={`border rounded-2xl p-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Users size={16} className="text-purple-400" />
              </div>
              <h3 className="font-semibold text-sm">Percentile Breakdown</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'All Users', percentile: 35 },
                { label: 'Gig Workers', percentile: 20 },
                { label: 'Age 26-30', percentile: 30 },
                { label: 'Selangor', percentile: 28 },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className={`border rounded-xl p-4 ${cardBg}`}
                >
                  <p className={`text-xs mb-2 ${textSecondary}`}>{p.label}</p>
                  <p className={`text-xl font-bold ${textPrimary}`}>Top {p.percentile}%</p>
                  <div className={`h-2 rounded-full overflow-hidden mt-2 ${barBg}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - p.percentile}%` }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
