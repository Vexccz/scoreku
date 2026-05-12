import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, ArrowLeft, TrendingUp, Clock, Smartphone, ShoppingBag,
  Phone, CreditCard, Sparkles, ChevronRight, Shield,
  LayoutDashboard, FileText, Brain, Settings, BarChart3, Building2
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import ThemeToggle from '../components/ThemeToggle'
import AppSidebar from '../components/AppSidebar'



function getActions(t) {
  return [
    {
      id: 'bills',
      label: t('actionBills'),
      points: 55,
      icon: CreditCard,
      color: '#3b82f6',
      description: t('actionBillsDesc'),
    },
    {
      id: 'duitnow',
      label: t('actionDuitnow'),
      points: 40,
      icon: Smartphone,
      color: '#14b8a6',
      description: t('actionDuitnowDesc'),
    },
    {
      id: 'income',
      label: t('actionIncome'),
      points: 70,
      icon: TrendingUp,
      color: '#8b5cf6',
      description: t('actionIncomeDesc'),
    },
    {
      id: 'returns',
      label: t('actionReturns'),
      points: 25,
      icon: ShoppingBag,
      color: '#f59e0b',
      description: t('actionReturnsDesc'),
    },
    {
      id: 'phone',
      label: t('actionPhone'),
      points: 15,
      icon: Phone,
      color: '#ec4899',
      description: t('actionPhoneDesc'),
    },
  ]
}

function ScoreGauge({ score, maxScore = 850, size = 220 }) {
  const { t } = useLanguage()
  const radius = (size - 30) / 2
  const circumference = 2 * Math.PI * radius
  const progress = ((score - 300) / (maxScore - 300)) * circumference
  const color = score >= 720 ? '#10b981' : score >= 650 ? '#3b82f6' : score >= 530 ? '#f59e0b' : '#ef4444'
  const label = score >= 720 ? 'Excellent' : score >= 650 ? 'Good' : score >= 530 ? 'Fair' : 'Building'

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
        <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{t('outOf850')}</span>
        <span className="text-xs mt-0.5" style={{ color }}>{label}</span>
      </div>
    </div>
  )
}

export default function SimulationPage() {
  const { t } = useLanguage()
  const actions = getActions(t)
  const baseScore = 640
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
      <AppSidebar activePath="/simulation" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="lg:ml-[260px] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 pt-12 lg:pt-0"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t('scoreSimulator').split(' ')[0]} <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">{t('scoreSimulator').split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            {t('simulatorSubtitle')}
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
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t('currentScore')}</p>
                    <p className="text-2xl font-bold text-gray-400">{baseScore}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t('projected')}</p>
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
                          {t('achievableIn')}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-6">
                  <Link
                    to="/score"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg shadow-emerald-600/20"
                  >
                    {t('getYourRealScore')} <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions - Right */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-gray-500" />
              <p className="text-sm text-gray-500">{t('toggleActions')}</p>
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
              <h3 className="text-sm font-semibold text-gray-300 mb-3">{t('howSimWorks')}</h3>
              <ul className="space-y-2 text-xs text-gray-500">
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 mt-0.5">•</span>
                  {t('simNote1')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 mt-0.5">•</span>
                  {t('simNote2')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 mt-0.5">•</span>
                  {t('simNote3')}
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
