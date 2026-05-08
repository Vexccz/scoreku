import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, ArrowLeft, TrendingUp, Clock, Smartphone, ShoppingBag,
  Phone, CreditCard, Sparkles, ChevronRight, Shield,
  LayoutDashboard, FileText, Brain, Settings, BarChart3, Building2
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', active: false },
  { label: 'Score Form', icon: FileText, path: '/score', active: false },
  { label: 'Connect Bank', icon: Building2, path: '/connect-bank', active: false },
  { label: 'Simulator', icon: Zap, path: '/simulation', active: true },
  { label: 'AI Model', icon: Brain, path: '/ai', active: false },
  { label: 'Settings', icon: Settings, path: null, disabled: true },
]

function Sidebar({ mobileOpen, onClose }) {
  const { theme } = useTheme()
  const sidebarBg = theme === 'dark' ? 'bg-[#0f0f0f] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const navActive = theme === 'dark' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-200'
  const navInactive = theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'

  return (
    <>
      {mobileOpen && (
        <motion.div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      <aside className={`flex flex-col fixed left-0 top-0 bottom-0 w-[260px] border-r z-[70] transform transition-transform duration-300 ${sidebarBg} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              ScoreKu
            </span>
          </div>
          <ThemeToggle />
        </div>
        <nav className="flex-1 px-3 mt-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              if (item.disabled) {
                return (
                  <div key={item.label} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-not-allowed ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-[#1f1f1f] text-gray-500' : 'bg-gray-100 text-gray-400'}`}>Soon</span>
                  </div>
                )
              }
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    item.active ? navActive : navInactive
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </aside>
    </>
  )
}

const actions = [
  {
    id: 'bills',
    label: 'Pay all bills on time for 3 months',
    points: 12,
    icon: CreditCard,
    color: '#3b82f6',
    description: 'Consistent bill payments show financial responsibility',
  },
  {
    id: 'duitnow',
    label: 'Start using DuitNow weekly',
    points: 8,
    icon: Smartphone,
    color: '#14b8a6',
    description: 'Regular digital transactions build your financial footprint',
  },
  {
    id: 'income',
    label: 'Maintain stable income for 6 months',
    points: 15,
    icon: TrendingUp,
    color: '#8b5cf6',
    description: 'Income stability is the strongest score factor',
  },
  {
    id: 'returns',
    label: 'Reduce e-commerce returns',
    points: 5,
    icon: ShoppingBag,
    color: '#f59e0b',
    description: 'Fewer returns signal responsible purchasing behavior',
  },
  {
    id: 'phone',
    label: 'Keep same phone number 2+ years',
    points: 3,
    icon: Phone,
    color: '#ec4899',
    description: 'Number stability indicates settled lifestyle patterns',
  },
]

function ScoreGauge({ score, maxScore = 100, size = 220 }) {
  const radius = (size - 30) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / maxScore) * circumference
  const color = score >= 76 ? '#10b981' : score >= 56 ? '#3b82f6' : score >= 31 ? '#f59e0b' : '#ef4444'
  const label = score >= 76 ? 'Excellent' : score >= 56 ? 'Good' : score >= 31 ? 'Fair' : 'Building'

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#1f1f1f" strokeWidth="12"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 16px ${color}50)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={score}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-bold"
          style={{ color }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider">out of 100</span>
        <span className="text-xs mt-0.5" style={{ color }}>{label}</span>
      </div>
    </div>
  )
}

export default function SimulationPage() {
  const baseScore = 65
  const [activeActions, setActiveActions] = useState({})
  const [animatingScore, setAnimatingScore] = useState(baseScore)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const projectedScore = baseScore + Object.entries(activeActions)
    .filter(([, v]) => v)
    .reduce((sum, [id]) => {
      const action = actions.find(a => a.id === id)
      return sum + (action?.points || 0)
    }, 0)

  useEffect(() => {
    const duration = 600
    const startScore = animatingScore
    const diff = projectedScore - startScore
    if (diff === 0) return

    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatingScore(Math.round(startScore + diff * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [projectedScore])

  const toggleAction = (id) => {
    setActiveActions(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const totalGain = projectedScore - baseScore
  const activeCount = Object.values(activeActions).filter(Boolean).length

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[55] p-2.5 bg-[#111] border border-[#1f1f1f] rounded-xl"
        onClick={() => setSidebarOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      {/* Sidebar */}
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="lg:ml-[260px] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Score <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">Simulator</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            See how small behavior changes can boost your credit score over time
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Score Display - Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-28">
              <div className="bg-[#111] border border-[#1f1f1f] rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Current Score</p>
                    <p className="text-2xl font-bold text-gray-400">{baseScore}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Projected</p>
                    <p className="text-2xl font-bold text-teal-400">{projectedScore}</p>
                  </div>
                </div>

                <div className="flex justify-center mb-6">
                  <ScoreGauge score={animatingScore} />
                </div>

                <AnimatePresence>
                  {totalGain > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-4 text-center">
                        <p className="text-sm text-teal-400 font-medium">
                          +{totalGain} points from {activeCount} action{activeCount !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Achievable within 3-6 months
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-6">
                  <Link
                    to="/score"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-600/20"
                  >
                    Get Your Real Score <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions - Right */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-gray-500" />
              <p className="text-sm text-gray-500">Toggle actions to see projected score changes</p>
            </div>

            {actions.map((action, i) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <button
                  onClick={() => toggleAction(action.id)}
                  className={`w-full text-left bg-[#111] border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 ${
                    activeActions[action.id]
                      ? 'border-opacity-50 shadow-lg'
                      : 'border-[#1f1f1f] hover:border-[#2a2a2a]'
                  }`}
                  style={{
                    borderColor: activeActions[action.id] ? `${action.color}50` : undefined,
                    boxShadow: activeActions[action.id] ? `0 8px 32px ${action.color}15` : undefined,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300"
                      style={{
                        background: `${action.color}15`,
                        border: `1px solid ${action.color}30`,
                        transform: activeActions[action.id] ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      <action.icon size={22} style={{ color: action.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base font-medium">{action.label}</h3>
                        <motion.span
                          className="shrink-0 px-3 py-1 rounded-full text-xs font-bold"
                          style={{
                            background: activeActions[action.id] ? `${action.color}20` : '#1a1a1a',
                            color: activeActions[action.id] ? action.color : '#6b7280',
                            border: `1px solid ${activeActions[action.id] ? `${action.color}40` : '#2a2a2a'}`,
                          }}
                          animate={{ scale: activeActions[action.id] ? [1, 1.15, 1] : 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          +{action.points} pts
                        </motion.span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{action.description}</p>

                      {/* Progress bar */}
                      <div className="mt-3 w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: action.color }}
                          initial={{ width: '0%' }}
                          animate={{ width: activeActions[action.id] ? '100%' : '0%' }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    {/* Toggle indicator */}
                    <div
                      className="w-12 h-7 rounded-full flex items-center shrink-0 transition-all duration-300 p-1"
                      style={{
                        background: activeActions[action.id] ? `${action.color}30` : '#1a1a1a',
                        border: `1px solid ${activeActions[action.id] ? `${action.color}50` : '#2a2a2a'}`,
                      }}
                    >
                      <motion.div
                        className="w-5 h-5 rounded-full"
                        style={{ background: activeActions[action.id] ? action.color : '#4b5563' }}
                        animate={{ x: activeActions[action.id] ? 20 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}

            {/* Summary card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 mt-6"
            >
              <h3 className="text-sm font-semibold text-gray-300 mb-3">How simulation works</h3>
              <ul className="space-y-2 text-xs text-gray-500">
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 mt-0.5">•</span>
                  Projections based on historical data from 10,000+ Malaysian profiles
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 mt-0.5">•</span>
                  Actual results may vary based on individual circumstances
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 mt-0.5">•</span>
                  Score improvements typically take 3-6 months of consistent behavior
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
      </main>
    </div>
  )
}
