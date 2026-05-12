import { useLocation, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import {
  Shield, TrendingUp, TrendingDown, Lightbulb, RefreshCw,
  ArrowUpRight, ArrowDownRight, CreditCard, Banknote, GraduationCap,
  PiggyBank, Wallet, Receipt, Smartphone, BarChart3, Zap, Target,
  LayoutDashboard, FileText, Sparkles, Brain, Settings, Share2,
  Clock, ChevronRight, Award, Users, Calendar, Building2, GitCompare,
  Trophy, Star, Flame, Gem, Lock, Bell, AlertCircle, X as XIcon
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useOffline } from '../context/OfflineContext'
import ThemeToggle from '../components/ThemeToggle'
import NotificationBell from '../components/NotificationBell'
import ShareScoreModal from '../components/ShareScoreModal'
import AppSidebar from '../components/AppSidebar'
import ScoreGauge from '../components/ScoreGauge'

// ─── Constants ───────────────────────────────────────────────────────────────

const riskCategories = [
  { min: 300, max: 529, label: 'High Risk', color: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { min: 530, max: 649, label: 'Moderate Risk', color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { min: 650, max: 719, label: 'Good', color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { min: 720, max: 850, label: 'Excellent', color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
]

const demoData = {
  score: 697,
  riskCategory: 'Good',
  features: [
    { name: 'Payment Consistency', value: 0.85, helping: true },
    { name: 'Income Stability', value: 0.78, helping: true },
    { name: 'E-wallet Activity', value: 0.72, helping: true },
    { name: 'Account Maturity', value: 0.65, helping: true },
    { name: 'E-commerce Returns', value: 0.35, helping: false },
    { name: 'Digital Footprint', value: 0.42, helping: false },
    { name: 'Rent History', value: 0.55, helping: false },
  ],
  tips: [
    { title: 'Pay Bills On Time', description: 'Consistent utility bill payments build a strong payment history signal.', points: 12, icon: 'Receipt' },
    { title: 'Increase E-wallet Usage', description: 'Regular DuitNow and e-wallet transactions show financial activity.', points: 8, icon: 'Smartphone' },
    { title: 'Maintain Income Flow', description: 'Keep stable monthly income for 6+ months to boost stability score.', points: 10, icon: 'Wallet' },
    { title: 'Reduce Returns', description: 'Lower your e-commerce return rate to improve trustworthiness signals.', points: 5, icon: 'Target' },
  ],
  history: [
    { date: 'Jan 2026', score: 520, change: null, category: 'Moderate Risk' },
    { date: 'Feb 2026', score: 565, change: 45, category: 'Moderate Risk' },
    { date: 'Mar 2026', score: 610, change: 45, category: 'Moderate Risk' },
    { date: 'Apr 2026', score: 645, change: 35, category: 'Moderate Risk' },
    { date: 'May 2026', score: 675, change: 30, category: 'Good' },
    { date: 'Jun 2026', score: 697, change: 22, category: 'Good' },
  ],
  user: {
    name: 'Zafran',
    email: 'zafran@example.com',
    memberSince: 'March 2026',
  },
  lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
}

const eligibleProducts = [
  { name: 'BSN Micro Loan', provider: 'BSN', maxAmount: 'RM50,000', icon: Banknote, color: 'from-emerald-500/20 to-emerald-600/5' },
  { name: 'TEKUN Financing', provider: 'TEKUN Nasional', maxAmount: 'RM100,000', icon: CreditCard, color: 'from-emerald-500/20 to-emerald-600/5' },
  { name: 'Amanah Ikhtiar', provider: 'AIM', maxAmount: 'RM20,000', icon: Wallet, color: 'from-teal-500/20 to-teal-600/5' },
]

const iconMap = { Receipt, Smartphone, Wallet, Target, Lightbulb, Zap }



// ─── Demo Alerts ─────────────────────────────────────────────────────────────

const demoAlerts = [
  { type: 'green', message: '+25 points: Consistent bill payments detected', time: '2 days ago', points: '+25', emoji: '🟢' },
  { type: 'green', message: '+15 points: DuitNow usage increased', time: '5 days ago', points: '+15', emoji: '🟢' },
  { type: 'red', message: '-10 points: Missed utility bill payment', time: '1 week ago', points: '-10', emoji: '🔴' },
  { type: 'yellow', message: 'Reminder: TNB bill due in 3 days', time: 'today', points: null, emoji: '🟡' },
  { type: 'green', message: '+20 points: Salary deposit detected', time: '1 week ago', points: '+20', emoji: '🟢' },
]

// ─── Achievement Badges ──────────────────────────────────────────────────────

function getAchievementBadges(t) {
  return [
    { id: 'first-score', label: t('firstScore'), emoji: '🏆', earned: true, requirement: null },
    { id: 'score-650', label: t('score650'), emoji: '📈', earned: true, requirement: null },
    { id: 'bank-connected', label: t('bankConnected'), emoji: '🏦', earned: () => !!localStorage.getItem('scoreku_bank_connected'), requirement: t('connectABank') },
    { id: '3-months', label: t('threeMonthsConsistent'), emoji: '📅', earned: true, requirement: null },
    { id: 'goal-setter', label: t('goalSetter'), emoji: '🎯', earned: () => !!localStorage.getItem('scoreku_goal'), requirement: t('setAGoal') },
    { id: 'score-720', label: t('score720'), emoji: '🌟', earned: false, requirement: t('reachToUnlock') },
    { id: '7-day-streak', label: t('sevenDayStreak'), emoji: '🔥', earned: true, requirement: null },
    { id: 'premium', label: t('premiumMember'), emoji: '💎', earned: false, requirement: t('upgradeToPremium') },
  ]
}

// ─── Goal Presets ────────────────────────────────────────────────────────────

function getGoalPresets(t) {
  return [
    { score: 530, label: t('basicFinancing') },
    { score: 650, label: t('tekunEligible') },
    { score: 720, label: t('bsnMicroLoan') },
    { score: 750, label: t('premiumProducts') },
  ]
}

// ─── Relative Time ───────────────────────────────────────────────────────────

function getRelativeTime(date) {
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 0) return 'Updated today'
  if (diffDays === 1) return 'Updated yesterday'
  return `${diffDays} days ago`
}

// ─── Confetti ────────────────────────────────────────────────────────────────

const confettiColors = ['#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b', '#ec4899']

function Confetti({ trigger }) {
  const [particles, setParticles] = useState([])
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (trigger && !hasTriggered.current) {
      hasTriggered.current = true
      const newParticles = Array.from({ length: 35 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        rotation: Math.random() * 360,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: Math.random() * 8 + 4,
        isCircle: Math.random() > 0.5,
      }))
      setParticles(newParticles)
      setTimeout(() => setParticles([]), 3000)
    }
  }, [trigger])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: p.rotation + 720 }}
          transition={{ duration: 2.5, delay: p.delay, ease: 'easeIn' }}
          className="absolute top-0"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function LoadingSkeleton() {
  const { theme } = useTheme()
  const bg = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'
  const cardBg = theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-gray-200'
  const cardBg2 = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-100'
  const cardBorder = theme === 'dark' ? 'border-[#1f1f1f]' : 'border-gray-200'
  const cardSurface = theme === 'dark' ? 'bg-[#111]' : 'bg-white'

  return (
    <div className={`min-h-screen ${bg} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      <div className="lg:ml-[260px] min-h-screen pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className={`h-7 w-32 ${cardBg} rounded-lg animate-pulse`} />
              <div className={`h-4 w-48 ${cardBg2} rounded mt-2 animate-pulse`} />
            </div>
            <div className={`h-9 w-28 ${cardBg} rounded-xl animate-pulse`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`${cardSurface} border ${cardBorder} rounded-2xl p-6 h-56 flex items-center justify-center`}>
              <div className={`w-36 h-36 rounded-full ${cardBg2} animate-pulse`} />
            </div>
            <div className={`${cardSurface} border ${cardBorder} rounded-2xl p-6`}>
              <div className={`h-4 w-24 ${cardBg2} rounded animate-pulse mb-4`} />
              <div className={`h-32 ${cardBg2} rounded-xl animate-pulse`} />
            </div>
            <div className={`${cardSurface} border ${cardBorder} rounded-2xl p-6`}>
              <div className={`h-4 w-20 ${cardBg2} rounded animate-pulse mb-4`} />
              <div className={`h-8 w-24 ${cardBg2} rounded animate-pulse mb-2`} />
              <div className={`h-3 w-32 ${cardBg2} rounded animate-pulse`} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className={`${cardSurface} border ${cardBorder} rounded-2xl p-6 h-48 animate-pulse`} />
            <div className={`${cardSurface} border ${cardBorder} rounded-2xl p-6 h-48 animate-pulse`} />
          </div>
          <div className={`${cardSurface} border ${cardBorder} rounded-2xl p-6 h-72 animate-pulse`} />
        </div>
      </div>
    </div>
  )
}

// ─── Animated Score ──────────────────────────────────────────────────────────

function AnimatedScore({ target }) {
  const [current, setCurrent] = useState(300)
  useEffect(() => {
    const duration = 1500
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(300 + eased * (target - 300)))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target])
  return current
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────



// ─── Mobile Nav ──────────────────────────────────────────────────────────────



// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-bold text-white">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

// ─── SHAP Waterfall — "What Drives Your Score" ──────────────────────────────
// Converts the feature breakdown (0-1 values, helping flag) into signed
// SHAP-style contributions summing to a total impact on the predicted score.
function buildShapContributions(features) {
  return features
    .map((f) => {
      const centered = f.value - 0.5 // deviation from baseline
      const sign = f.helping ? 1 : -1
      // Map to a reasonable score-points magnitude (each feature up to ~45 pts)
      const value = Math.round(sign * Math.abs(centered) * 90)
      return { feature: f.name, value, helping: f.helping }
    })
    .filter((c) => c.value !== 0)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
}

function ShapWaterfallTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const p = payload[0].payload
    const positive = p.value >= 0
    return (
      <div className="bg-[#0f0f0f] border border-white/[0.08] rounded-lg px-3 py-2 shadow-xl">
        <p className="text-[11px] text-white/50">{p.feature}</p>
        <p
          className="text-sm font-bold tabular-nums"
          style={{ color: positive ? '#10b981' : '#ef4444' }}
        >
          {positive ? '+' : ''}
          {p.value} pts
        </p>
      </div>
    )
  }
  return null
}

function ShapWaterfall({ features, score, variants, cardBg, textPrimary, textSecondary, theme }) {
  const contributions = buildShapContributions(features)
  const total = contributions.reduce((s, c) => s + c.value, 0)
  const maxAbs = Math.max(1, ...contributions.map((c) => Math.abs(c.value)))

  return (
    <motion.div variants={variants} className={`border rounded-2xl p-6 mb-6 ${cardBg}`}>
      <div className="flex items-start justify-between mb-5 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Sparkles size={16} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">What drives your score</h3>
            <p className={`text-[11px] mt-0.5 ${textSecondary}`}>
              SHAP-style contribution per feature
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-[10px] uppercase tracking-[0.2em] ${textSecondary}`}>Net impact</p>
          <p
            className="text-lg font-bold tabular-nums"
            style={{ color: total >= 0 ? '#10b981' : '#ef4444' }}
          >
            {total >= 0 ? '+' : ''}
            {total} pts
          </p>
        </div>
      </div>

      <div style={{ height: Math.max(220, contributions.length * 36 + 40) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={contributions}
            layout="vertical"
            margin={{ left: 10, right: 40, top: 4, bottom: 4 }}
          >
            <XAxis
              type="number"
              domain={[-maxAbs, maxAbs]}
              tick={{ fontSize: 10, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => (v > 0 ? `+${v}` : `${v}`)}
            />
            <YAxis
              type="category"
              dataKey="feature"
              tick={{ fontSize: 11, fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }}
              axisLine={false}
              tickLine={false}
              width={140}
            />
            <Tooltip content={<ShapWaterfallTooltip />} cursor={{ fill: 'rgba(16,185,129,0.04)' }} />
            <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={18}>
              {contributions.map((c, i) => (
                <Cell key={i} fill={c.value >= 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className={textSecondary}>Helps score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
            <span className={textSecondary}>Hurts score</span>
          </div>
        </div>
        <p className={`text-[11px] ${textSecondary}`}>
          Base score <span className={textPrimary}>{score - total}</span>
          {' → '}
          <span style={{ color: '#10b981' }}>{score}</span>
        </p>
      </div>
    </motion.div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [now, setNow] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const { theme } = useTheme()
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const isDemo = searchParams.get('demo') === 'true'
  const result = location.state?.result

  const score = result?.score ?? demoData.score
  const rawFeatures = result?.feature_breakdown ?? demoData.features
  const features = rawFeatures.map(f => ({
    ...f,
    helping: f.helping !== undefined ? f.helping : f.value >= 0.6,
  }))
  const tips = result?.tips ?? demoData.tips
  const history = demoData.history
  const user = demoData.user
  const lastUpdated = demoData.lastUpdated

  const category = riskCategories.find(c => score >= c.min && score <= c.max) || riskCategories[2]
  const achievementBadges = getAchievementBadges(t)
  const goalPresets = getGoalPresets(t)

  const helpingFactors = features.filter(f => f.helping).sort((a, b) => b.value - a.value).slice(0, 4)
  const hurtingFactors = features.filter(f => !f.helping).sort((a, b) => a.value - b.value).slice(0, 3)

  const trendData = history.map(h => ({ name: h.date.split(' ')[0], score: h.score }))
  const percentile = Math.max(5, Math.min(95, Math.round(100 - ((score - 300) / 550) * 80)))

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [currentGoal, setCurrentGoal] = useState(() => {
    const saved = localStorage.getItem('scoreku_goal')
    return saved ? JSON.parse(saved) : { score: 720, label: 'BSN Micro Loan' }
  })

  const handleSetGoal = (goal) => {
    setCurrentGoal(goal)
    localStorage.setItem('scoreku_goal', JSON.stringify(goal))
    setGoalModalOpen(false)
  }

  const handleRecalculate = () => {
    window.location.href = '/score'
  }

  // Theme-aware classes
  const pageBg = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
  const textMuted = theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
  const barBg = theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-gray-100'
  const tableBorder = theme === 'dark' ? 'border-[#1f1f1f]' : 'border-gray-200'
  const tableRowBorder = theme === 'dark' ? 'border-[#1a1a1a]' : 'border-gray-100'

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className={`min-h-screen ${pageBg} ${textPrimary}`}>
      <Confetti trigger={score >= 720} />

      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px] ${theme === 'dark' ? 'bg-emerald-600/5' : 'bg-emerald-200/20'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] ${theme === 'dark' ? 'bg-teal-600/5' : 'bg-teal-200/20'}`} />
      </div>

      {/* Mobile hamburger */}
      <button
        className={`lg:hidden fixed top-4 left-4 z-[55] p-2.5 border rounded-xl ${
          theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
        }`}
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <AppSidebar activePath="/dashboard" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} onRecalculate={handleRecalculate} />

      {/* Share Modal */}
      <ShareScoreModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        score={score}
        category={category}
      />

      {/* Main Content */}
      <main className="lg:ml-[260px] min-h-screen pb-24 lg:pb-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        >
          {/* Top Bar */}
          <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pt-12 lg:pt-0">
            <div className="flex items-center gap-3">
              <img 
                src="/ai-assistant-icon.png" 
                alt="AI Assistant" 
                className="w-12 h-12 drop-shadow-lg"
              />
              <div>
                <h1 className={`text-2xl font-bold ${textPrimary}`}>{t('dashboard')}</h1>
                <p className={`text-sm mt-1 ${textSecondary}`}>{t('dashboardSubtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 text-xs ${textSecondary}`}>
                <Clock size={14} />
                <span>{now.toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span>{now.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <NotificationBell />
              <button
                onClick={() => setShareModalOpen(true)}
                className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl text-sm transition-all w-full sm:w-auto ${
                  theme === 'dark'
                    ? 'bg-[#111] border-[#1f1f1f] text-gray-300 hover:border-emerald-500/50 hover:text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-gray-900'
                }`}
              >
                <Share2 size={16} />
                {t('shareScore')}
              </button>
            </div>
          </motion.div>

          {/* Score Overview Row */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Main Score Card */}
            <div className={`md:col-span-1 border rounded-2xl p-6 flex flex-col items-center justify-center ${cardBg}`}>
              <ScoreGauge score={score} size={180} animate={true} />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-4"
              >
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border"
                  style={{
                    color: category.color,
                    borderColor: `${category.color}40`,
                    backgroundColor: `${category.color}10`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                  {category.label}
                </span>
              </motion.div>
              {/* Score Updated Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className={`flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-[11px] ${
                  theme === 'dark' ? 'bg-[#1a1a1a] text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}
              >
                <Clock size={11} />
                <span>{t('lastUpdated')}: {getRelativeTime(lastUpdated)}</span>
              </motion.div>
            </div>

            {/* Score Trend Card */}
            <div className={`border rounded-2xl p-6 ${cardBg}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('scoreTrend')}</h3>
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <TrendingUp size={12} /> +177 pts
                </span>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis hide domain={[400, 850]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={{ fill: '#2563eb', r: 3 }}
                      activeDot={{ r: 5, fill: '#14b8a6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className={`text-[11px] mt-2 ${textMuted}`}>{t('monthHistory')}</p>
            </div>

            {/* Percentile Card */}
            <div className={`border rounded-2xl p-6 flex flex-col justify-between ${cardBg}`}>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                    <Users size={16} className="text-teal-400" />
                  </div>
                  <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('percentile')}</h3>
                </div>
                <p className={`text-2xl font-bold mb-1 ${textPrimary}`}>Top {percentile}%</p>
                <p className={`text-xs ${textSecondary}`}>{t('ofScoreKuUsers')}</p>
              </div>
              <div className="mt-4">
                <div className={`h-2.5 rounded-full overflow-hidden relative ${barBg}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - percentile}%` }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-teal-500 shadow-lg"
                    style={{ left: `${100 - percentile}%`, transform: 'translate(-50%, -50%)' }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className={`text-[10px] ${textMuted}`}>0%</span>
                  <span className={`text-[10px] ${textMuted}`}>100%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bank Connection CTA */}
          {!localStorage.getItem('scoreku_bank_connected') && (
            <motion.div variants={item} className={`border rounded-2xl p-6 mb-6 ${cardBg} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5" />
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <Building2 size={24} className="text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm mb-1 ${textPrimary}`}>{t('connectBank')}</h3>
                  <p className={`text-xs ${textSecondary}`}>{t('connectBankDesc')}</p>
                </div>
                <Link
                  to="/connect-bank"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 transition-all flex-shrink-0"
                >
                  {t('connectNow')}
                  <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Score Factors */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Helping */}
            <div className={`border rounded-2xl p-6 ${cardBg}`}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp size={16} className="text-emerald-400" />
                </div>
                <h3 className="font-semibold text-emerald-300 text-sm">{t('helpingYourScore')}</h3>
              </div>
              <div className="space-y-4">
                {helpingFactors.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <ArrowUpRight size={14} className="text-emerald-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{f.name}</span>
                        <span className="text-xs text-emerald-400 font-medium">{Math.round(f.value * 100)}%</span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${barBg}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${f.value * 100}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Hurting */}
            <div className={`border rounded-2xl p-6 ${cardBg}`}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <TrendingDown size={16} className="text-red-400" />
                </div>
                <h3 className="font-semibold text-red-300 text-sm">{t('hurtingYourScore')}</h3>
              </div>
              <div className="space-y-4">
                {hurtingFactors.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <ArrowDownRight size={14} className="text-red-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{f.name}</span>
                        <span className="text-xs text-red-400 font-medium">{Math.round(f.value * 100)}%</span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${barBg}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${f.value * 100}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                          className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Spending Insights */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <PiggyBank size={16} className="text-violet-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('spendingInsights')}</h3>
            </div>
            <div className="space-y-4">
              {[
                { category: t('foodDining'), pct: 35, amount: 'RM1,225', insight: `${t('aboveAverage')} (${t('avg')}: 28%)`, color: '#f97316', barColor: 'from-orange-500 to-orange-400' },
                { category: t('transport'), pct: 20, amount: 'RM700', insight: t('normalRange'), color: '#10b981', barColor: 'from-emerald-500 to-teal-400' },
                { category: t('billsUtilities'), pct: 25, amount: 'RM875', insight: t('consistent'), color: '#10b981', barColor: 'from-emerald-500 to-emerald-400' },
                { category: t('shopping'), pct: 12, amount: 'RM420', insight: t('belowAverage'), color: '#ec4899', barColor: 'from-pink-500 to-pink-400' },
                { category: t('others'), pct: 8, amount: 'RM280', insight: '', color: '#6b7280', barColor: 'from-gray-500 to-gray-400' },
              ].map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{entry.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs ${textSecondary}`}>{entry.amount}</span>
                      <span className={`text-xs font-bold ${textPrimary}`}>{entry.pct}%</span>
                    </div>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${barBg}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${entry.pct}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                      className={`h-full rounded-full bg-gradient-to-r ${entry.barColor}`}
                    />
                  </div>
                  {entry.insight && (
                    <p className={`text-[11px] mt-1 ${textMuted}`}>{entry.insight}</p>
                  )}
                </motion.div>
              ))}
            </div>
            <div className={`mt-5 p-3 rounded-xl border ${theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
              <p className={`text-xs ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                💡 {t('spendingHealthy')}
              </p>
            </div>
          </motion.div>

          {/* Upcoming Bills */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Bell size={16} className="text-amber-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('upcomingBills')}</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: t('tnbElectricity'), amount: 'RM85', daysUntil: 3, icon: Zap, urgency: 'red' },
                { name: t('unifiInternet'), amount: 'RM149', daysUntil: 7, icon: Smartphone, urgency: 'amber' },
                { name: t('waterSyabas'), amount: 'RM35', daysUntil: 12, icon: Receipt, urgency: 'green' },
                { name: t('phoneCelcom'), amount: 'RM68', daysUntil: 15, icon: Smartphone, urgency: 'green' },
              ].map((bill, i) => {
                const BillIcon = bill.icon
                const urgencyColors = {
                  red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
                  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
                  green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
                }
                const uc = urgencyColors[bill.urgency]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${theme === 'dark' ? 'border-[#1f1f1f]' : 'border-gray-100'}`}
                  >
                    <div className={`w-9 h-9 rounded-lg ${uc.bg} flex items-center justify-center flex-shrink-0`}>
                      <BillIcon size={16} className={uc.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{bill.name}</p>
                      <p className={`text-xs ${textSecondary}`}>{bill.amount}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${uc.bg} ${uc.text} ${uc.border}`}>
                        {t('dueIn')} {bill.daysUntil} {t('days')} {bill.urgency === 'red' ? '⚠️' : ''}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            <div className={`mt-4 p-3 rounded-xl border ${theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
              <p className={`text-xs ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                🔔 {t('payOnTimeTip')}
              </p>
            </div>
          </motion.div>

          {/* Score Forecast */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <TrendingUp size={16} className="text-indigo-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('scoreForecast')}</h3>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { name: 'Now', score: 697, predicted: 697 },
                  { name: '1mo', score: null, predicted: 710 },
                  { name: '3mo', score: null, predicted: 735 },
                  { name: '6mo', score: null, predicted: 760 },
                ]} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[650, 800]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ fill: '#2563eb', r: 4 }}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={{ fill: '#8b5cf6', r: 3, strokeDasharray: '0' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-emerald-500 rounded" />
                <span className={`text-[11px] ${textSecondary}`}>{t('current')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-violet-500 rounded" style={{ borderTop: '2px dashed #8b5cf6', height: 0 }} />
                <span className={`text-[11px] ${textSecondary}`}>{t('predicted')}</span>
              </div>
            </div>
            <div className={`mt-4 p-3 rounded-xl border ${theme === 'dark' ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'}`}>
              <p className={`text-xs ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
                📈 {t('basedOnBehavior')}
              </p>
            </div>
          </motion.div>

          {/* Feature Breakdown */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <BarChart3 size={16} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('featureBreakdown')}</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={features.map(f => ({ name: f.name, value: Math.round(f.value * 100) }))} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={140} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                    {features.map((f, index) => {
                      const pct = Math.round(f.value * 100)
                      const color = pct >= 70 ? '#14b8a6' : pct >= 50 ? '#2563eb' : '#ef4444'
                      return <Cell key={index} fill={color} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* SHAP Waterfall - What Drives Your Score */}
          <ShapWaterfall
            features={features}
            score={score}
            variants={item}
            cardBg={cardBg}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            theme={theme}
          />

          {/* Improvement Tips */}
          <motion.div variants={item} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Lightbulb size={16} className="text-amber-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('improvementTips')}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Array.isArray(tips) ? tips : demoData.tips).map((tip, i) => {
                const tipObj = typeof tip === 'string' ? { title: tip, description: '', points: 5, icon: 'Lightbulb' } : tip
                const TipIcon = iconMap[tipObj.icon] || Lightbulb
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className={`border rounded-2xl p-5 transition-colors ${cardBg} hover:border-amber-500/30`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <TipIcon size={16} className="text-amber-400" />
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                        +{tipObj.points} pts
                      </span>
                    </div>
                    <h4 className={`text-sm font-medium mb-1 ${textPrimary}`}>{tipObj.title}</h4>
                    {tipObj.description && (
                      <p className={`text-xs leading-relaxed ${textSecondary}`}>{tipObj.description}</p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Eligible Financial Products */}
          <motion.div variants={item} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                <CreditCard size={16} className="text-teal-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('eligibleProducts')}</h3>
              <span className={`ml-auto text-xs ${textSecondary}`}>{t('basedOnScoreTier')}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {eligibleProducts.map((product, i) => {
                const ProductIcon = product.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className={`border rounded-2xl p-5 transition-all group cursor-pointer ${cardBg} hover:border-teal-500/30`}
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <ProductIcon size={20} className="text-white" />
                    </div>
                    <h4 className={`font-semibold text-sm mb-0.5 ${textPrimary}`}>{product.name}</h4>
                    <p className={`text-xs mb-2 ${textSecondary}`}>{product.provider}</p>
                    <p className="text-xs text-teal-400 font-medium mb-3">Up to {product.maxAmount}</p>
                    <span className="text-xs text-emerald-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn More <ChevronRight size={12} />
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Financial Goals */}
          <motion.div variants={item} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Target size={16} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('financialGoals')}</h3>
            </div>
            <div className={`border rounded-2xl p-6 ${cardBg}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className={`text-sm font-medium ${textPrimary}`}>{t('target')}: {currentGoal.score} ({currentGoal.label} {t('eligibleLabel')})</p>
                  <p className={`text-xs mt-1 ${textSecondary}`}>{t('estimatedTime')}: {currentGoal.score <= score ? t('alreadyAchieved') : `${Math.ceil((currentGoal.score - score) / 2)} ${t('monthsBasedOnTrend')}`}</p>
                </div>
                <button
                  onClick={() => setGoalModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                >
                  {t('setNewGoal')}
                </button>
              </div>
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className={`text-xs ${textSecondary}`}>{t('current')}: {score}</span>
                  <span className={`text-xs ${textSecondary}`}>{t('target')}: {currentGoal.score}</span>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${barBg}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (score / currentGoal.score) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"
                  />
                </div>
                <p className={`text-xs mt-1 text-right ${textMuted}`}>{Math.round((score / currentGoal.score) * 100)}% {t('there')}</p>
              </div>
            </div>

            {/* Goal Modal */}
            {goalModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
                onClick={() => setGoalModalOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`w-full max-w-sm rounded-2xl p-6 border ${cardBg}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className={`font-semibold ${textPrimary}`}>{t('setScoreGoal')}</h3>
                    <button onClick={() => setGoalModalOpen(false)} className={textSecondary}>
                      <XIcon size={18} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {goalPresets.map((goal) => (
                      <button
                        key={goal.score}
                        onClick={() => handleSetGoal(goal)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                          currentGoal.score === goal.score
                            ? 'border-emerald-500/50 bg-emerald-500/10'
                            : `${theme === 'dark' ? 'border-[#1f1f1f] hover:border-emerald-500/30' : 'border-gray-200 hover:border-emerald-300'}`
                        }`}
                      >
                        <div className="text-left">
                          <p className={`text-sm font-medium ${textPrimary}`}>{goal.label}</p>
                          <p className={`text-xs ${textSecondary}`}>Score: {goal.score}</p>
                        </div>
                        {score >= goal.score && (
                          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">{t('achieved')}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Recent Alerts */}
          <motion.div variants={item} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Bell size={16} className="text-amber-400" />
                </div>
                <h3 className="font-semibold text-sm">{t('recentAlerts')}</h3>
              </div>
              <button className={`text-xs ${textSecondary} hover:text-emerald-400 transition-colors`}>{t('viewAll')}</button>
            </div>
            <div className="space-y-3">
              {demoAlerts.map((alert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className={`border rounded-xl p-4 flex items-center gap-3 ${cardBg}`}
                >
                  <span className="text-lg">{alert.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{alert.message}</p>
                    <p className={`text-xs mt-0.5 ${textMuted}`}>{alert.time}</p>
                  </div>
                  {alert.points && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                      alert.points.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {alert.points}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievement Badges */}
          <motion.div variants={item} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Award size={16} className="text-purple-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('achievements')}</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {achievementBadges.map((badge, i) => {
                const isEarned = typeof badge.earned === 'function' ? badge.earned() : badge.earned
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    className={`border rounded-xl p-4 text-center transition-all ${
                      isEarned
                        ? `${cardBg} ${theme === 'dark' ? 'shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'shadow-md'}`
                        : `${theme === 'dark' ? 'bg-[#0d0d0d] border-[#1a1a1a]' : 'bg-gray-50 border-gray-200'} opacity-60`
                    }`}
                  >
                    <div className={`text-2xl mb-2 ${isEarned ? '' : 'grayscale'}`}>
                      {isEarned ? badge.emoji : '🔒'}
                    </div>
                    <p className={`text-xs font-medium ${isEarned ? textPrimary : textMuted}`}>{badge.label}</p>
                    {!isEarned && badge.requirement && (
                      <p className={`text-[10px] mt-1 ${textMuted}`}>{badge.requirement}</p>
                    )}
                    {isEarned && (
                      <p className="text-[10px] mt-1 text-emerald-400">{t('earned')} ✓</p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Score History Table */}
          <motion.div variants={item} className={`border rounded-2xl p-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Calendar size={16} className="text-purple-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('scoreHistory')}</h3>
            </div>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className={`border-b ${tableBorder}`}>
                    <th className={`text-left py-3 px-4 text-xs font-medium uppercase tracking-wider ${textSecondary}`}>{t('date')}</th>
                    <th className={`text-left py-3 px-4 text-xs font-medium uppercase tracking-wider ${textSecondary}`}>{t('score')}</th>
                    <th className={`text-left py-3 px-4 text-xs font-medium uppercase tracking-wider ${textSecondary}`}>{t('change')}</th>
                    <th className={`text-left py-3 px-4 text-xs font-medium uppercase tracking-wider ${textSecondary}`}>{t('riskCategory')}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(-5).reverse().map((entry, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className={`border-b last:border-0 ${tableRowBorder}`}
                    >
                      <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{entry.date}</td>
                      <td className={`py-3 px-4 font-medium ${textPrimary}`}>{entry.score}</td>
                      <td className="py-3 px-4">
                        {entry.change !== null ? (
                          <span className={`flex items-center gap-1 text-xs font-medium ${entry.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {entry.change > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {entry.change > 0 ? '+' : ''}{entry.change}
                          </span>
                        ) : (
                          <span className={`text-xs ${textMuted}`}>—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{entry.category}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
