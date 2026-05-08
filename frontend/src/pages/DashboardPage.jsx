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
  Clock, ChevronRight, Award, Users, Calendar
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'
import NotificationBell from '../components/NotificationBell'
import ShareScoreModal from '../components/ShareScoreModal'

// ─── Constants ───────────────────────────────────────────────────────────────

const riskCategories = [
  { min: 0, max: 30, label: 'High Risk', color: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { min: 31, max: 55, label: 'Moderate Risk', color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { min: 56, max: 75, label: 'Fair', color: '#3b82f6', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { min: 76, max: 100, label: 'Excellent', color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
]

const demoData = {
  score: 72,
  riskCategory: 'Fair',
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
    { date: 'Jan 2026', score: 45, change: null, category: 'Moderate Risk' },
    { date: 'Feb 2026', score: 52, change: 7, category: 'Moderate Risk' },
    { date: 'Mar 2026', score: 58, change: 6, category: 'Fair' },
    { date: 'Apr 2026', score: 63, change: 5, category: 'Fair' },
    { date: 'May 2026', score: 68, change: 5, category: 'Fair' },
    { date: 'Jun 2026', score: 72, change: 4, category: 'Fair' },
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
  { name: 'TEKUN Financing', provider: 'TEKUN Nasional', maxAmount: 'RM100,000', icon: CreditCard, color: 'from-blue-500/20 to-blue-600/5' },
  { name: 'Amanah Ikhtiar', provider: 'AIM', maxAmount: 'RM20,000', icon: Wallet, color: 'from-teal-500/20 to-teal-600/5' },
]

const iconMap = { Receipt, Smartphone, Wallet, Target, Lightbulb, Zap }

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', active: true },
  { label: 'Score Form', icon: FileText, path: '/score', active: false },
  { label: 'Simulator', icon: Sparkles, path: '/simulation', active: false },
  { label: 'How AI Works', icon: Brain, path: '/ai', active: false },
  { label: 'Settings', icon: Settings, path: null, disabled: true },
]

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
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const duration = 1500
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target])
  return current
}

// ─── Score Gauge ─────────────────────────────────────────────────────────────

function ScoreGauge({ score, category }) {
  const circumference = 2 * Math.PI * 54
  const progress = (score / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center w-44 h-44">
      <div
        className="absolute inset-4 rounded-full blur-2xl opacity-30"
        style={{ background: `radial-gradient(circle, ${category.color}, transparent 70%)` }}
      />
      <svg className="w-44 h-44 -rotate-90" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="54" fill="none" stroke="#1f1f1f" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r="54" fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${progress} ${circumference}` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
          <AnimatedScore target={score} />
        </span>
        <span className="text-[10px] text-gray-500 mt-1">out of 100</span>
      </div>
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({ user, onRecalculate, mobileOpen, onClose }) {
  const { theme } = useTheme()
  const sidebarBg = theme === 'dark' ? 'bg-[#0f0f0f] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const navActive = theme === 'dark' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-200'
  const navInactive = theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
  const dividerColor = theme === 'dark' ? 'border-[#1f1f1f]' : 'border-gray-200'

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
      {/* Logo + Theme Toggle */}
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

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            if (item.disabled) {
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-not-allowed ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}
                >
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

      {/* Divider */}
      <div className={`mx-6 border-t ${dividerColor}`} />

      {/* User Info with Avatar */}
      <div className="px-6 py-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
              {user.name.charAt(0)}
            </div>
            {/* Online indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0f0f0f]" style={{ borderColor: theme === 'dark' ? '#0f0f0f' : '#fff' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
            <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{user.email}</p>
          </div>
        </div>
        <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>Member since {user.memberSince}</p>
        <button
          onClick={onRecalculate}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={14} />
          Recalculate Score
        </button>
      </div>
      </aside>
    </>
  )
}

// ─── Mobile Nav ──────────────────────────────────────────────────────────────

function MobileNav() {
  const { theme } = useTheme()
  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 border-t z-50 px-2 py-2 ${
      theme === 'dark' ? 'bg-[#0f0f0f] border-[#1f1f1f]' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-around">
        {navItems.filter(n => !n.disabled).map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                item.active ? 'text-blue-400' : (theme === 'dark' ? 'text-gray-500' : 'text-gray-400')
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

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

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [now, setNow] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const { theme } = useTheme()

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

  const helpingFactors = features.filter(f => f.helping).sort((a, b) => b.value - a.value).slice(0, 4)
  const hurtingFactors = features.filter(f => !f.helping).sort((a, b) => a.value - b.value).slice(0, 3)

  const trendData = history.map(h => ({ name: h.date.split(' ')[0], score: h.score }))
  const percentile = Math.max(5, Math.min(95, 100 - score + 10))

  const [sidebarOpen, setSidebarOpen] = useState(false)

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
      <Confetti trigger={score >= 76} />

      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px] ${theme === 'dark' ? 'bg-blue-600/5' : 'bg-blue-200/20'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] ${theme === 'dark' ? 'bg-teal-600/5' : 'bg-teal-200/20'}`} />
      </div>

      {/* Mobile hamburger */}
      <button
        className={`lg:hidden fixed top-4 left-4 z-[55] p-2.5 border rounded-xl ${
          theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
        }`}
        onClick={() => setSidebarOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <Sidebar user={user} onRecalculate={handleRecalculate} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Share Modal */}
      <ShareScoreModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        score={score}
        category={category}
      />

      {/* Main Content */}
      <main className="lg:ml-[260px] min-h-screen pb-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        >
          {/* Top Bar */}
          <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className={`text-2xl font-bold ${textPrimary}`}>Dashboard</h1>
              <p className={`text-sm mt-1 ${textSecondary}`}>Your financial identity overview</p>
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
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm transition-all ${
                  theme === 'dark'
                    ? 'bg-[#111] border-[#1f1f1f] text-gray-300 hover:border-blue-500/50 hover:text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-gray-900'
                }`}
              >
                <Share2 size={14} />
                Share Score
              </button>
            </div>
          </motion.div>

          {/* Score Overview Row */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Main Score Card */}
            <div className={`md:col-span-1 border rounded-2xl p-6 flex flex-col items-center justify-center ${cardBg}`}>
              <ScoreGauge score={score} category={category} />
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
                <span>Last updated: {getRelativeTime(lastUpdated)}</span>
              </motion.div>
            </div>

            {/* Score Trend Card */}
            <div className={`border rounded-2xl p-6 ${cardBg}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Score Trend</h3>
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <TrendingUp size={12} /> +27 pts
                </span>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis hide domain={[30, 100]} />
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
              <p className={`text-[11px] mt-2 ${textMuted}`}>6-month history</p>
            </div>

            {/* Percentile Card */}
            <div className={`border rounded-2xl p-6 flex flex-col justify-between ${cardBg}`}>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                    <Users size={16} className="text-teal-400" />
                  </div>
                  <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Percentile</h3>
                </div>
                <p className={`text-2xl font-bold mb-1 ${textPrimary}`}>Top {percentile}%</p>
                <p className={`text-xs ${textSecondary}`}>of ScoreKu users</p>
              </div>
              <div className="mt-4">
                <div className={`h-2.5 rounded-full overflow-hidden relative ${barBg}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - percentile}%` }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-blue-500"
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

          {/* Score Factors */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Helping */}
            <div className={`border rounded-2xl p-6 ${cardBg}`}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp size={16} className="text-emerald-400" />
                </div>
                <h3 className="font-semibold text-emerald-300 text-sm">Helping Your Score</h3>
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
                <h3 className="font-semibold text-red-300 text-sm">Hurting Your Score</h3>
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

          {/* Feature Breakdown */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BarChart3 size={16} className="text-blue-400" />
              </div>
              <h3 className="font-semibold text-sm">Feature Breakdown</h3>
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

          {/* Improvement Tips */}
          <motion.div variants={item} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Lightbulb size={16} className="text-amber-400" />
              </div>
              <h3 className="font-semibold text-sm">Improvement Tips</h3>
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
              <h3 className="font-semibold text-sm">Eligible Financial Products</h3>
              <span className={`ml-auto text-xs ${textSecondary}`}>Based on your score tier</span>
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
                    <span className="text-xs text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn More <ChevronRight size={12} />
                    </span>
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
              <h3 className="font-semibold text-sm">Score History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${tableBorder}`}>
                    <th className={`text-left py-3 px-4 text-xs font-medium uppercase tracking-wider ${textSecondary}`}>Date</th>
                    <th className={`text-left py-3 px-4 text-xs font-medium uppercase tracking-wider ${textSecondary}`}>Score</th>
                    <th className={`text-left py-3 px-4 text-xs font-medium uppercase tracking-wider ${textSecondary}`}>Change</th>
                    <th className={`text-left py-3 px-4 text-xs font-medium uppercase tracking-wider ${textSecondary}`}>Risk Category</th>
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
