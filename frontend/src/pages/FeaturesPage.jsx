import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  Wallet, Brain, Clock, Target, Lightbulb, Lock, ArrowRight,
  CreditCard, Receipt, ShoppingCart, Smartphone, TrendingUp,
  Shield, CheckCircle2, Zap, Building2, Menu
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell
} from 'recharts'
import AppSidebar from '../components/AppSidebar'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
}

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

// ─── Feature 1: Alternative Credit Scoring Demo ──────────────────────────────

function AlternativeScoringDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [showAlternative, setShowAlternative] = useState(false)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowAlternative(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  const traditionalData = [
    { icon: CreditCard, label: 'Credit Cards', available: false },
    { icon: Building2, label: 'Bank Loans', available: false },
    { icon: Receipt, label: 'Mortgage History', available: false },
  ]

  const alternativeData = [
    { icon: Smartphone, label: 'DuitNow Transactions', available: true },
    { icon: Receipt, label: 'Bill Payments', available: true },
    { icon: ShoppingCart, label: 'E-commerce Activity', available: true },
    { icon: Wallet, label: 'E-wallet Balance', available: true },
    { icon: TrendingUp, label: 'Income Patterns', available: true },
  ]

  return (
    <div ref={ref} className="relative">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Traditional */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-[#0a0a0a] border border-red-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm font-medium text-red-400">Traditional Data → CTOS</span>
          </div>
          <div className="space-y-3">
            {traditionalData.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.2 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#111] border border-[#1f1f1f]"
              >
                <item.icon size={18} className="text-red-400/60" />
                <span className="text-sm text-gray-400">{item.label}</span>
                <span className="ml-auto text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">No Data</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-xs text-red-400/60">Result: No Score Available ✗</span>
          </div>
        </motion.div>

        {/* Alternative */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView && showAlternative ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.6 }}
          className="bg-[#0a0a0a] border border-emerald-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-emerald-400">Alternative Data → ScoreKu</span>
          </div>
          <div className="space-y-3">
            {alternativeData.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={isInView && showAlternative ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#111] border border-[#1f1f1f]"
              >
                <item.icon size={18} className="text-emerald-400" />
                <span className="text-sm text-gray-300">{item.label}</span>
                <span className="ml-auto text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">✓ Active</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-xs text-emerald-400">Result: Score 697 ✓</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Feature 2: SHAP Waterfall Demo ─────────────────────────────────────────

function SHAPWaterfallDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [visibleBars, setVisibleBars] = useState(0)

  const shapData = [
    { feature: 'Payment Consistency', value: 85, positive: true },
    { feature: 'E-wallet Activity', value: 42, positive: true },
    { feature: 'Income Stability', value: 35, positive: true },
    { feature: 'Account Age', value: 22, positive: true },
    { feature: 'E-commerce Returns', value: -15, positive: false },
    { feature: 'Late Payments', value: -22, positive: false },
  ]

  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setVisibleBars(prev => {
          if (prev >= shapData.length) {
            clearInterval(interval)
            return prev
          }
          return prev + 1
        })
      }, 400)
      return () => clearInterval(interval)
    }
  }, [isInView])

  return (
    <div ref={ref} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-400">Base Score: 550</span>
        <span className="text-sm font-bold text-blue-400">Final: 697</span>
      </div>
      <div className="space-y-3">
        {shapData.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={i < visibleBars ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center gap-3"
            style={{ originX: item.positive ? 0 : 1 }}
          >
            <span className="text-xs text-gray-400 w-36 truncate">{item.feature}</span>
            <div className="flex-1 h-8 relative flex items-center">
              <motion.div
                initial={{ width: 0 }}
                animate={i < visibleBars ? { width: `${Math.abs(item.value) * 1.5}%` } : { width: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`h-6 rounded-lg ${item.positive ? 'bg-emerald-500/30 border border-emerald-500/50' : 'bg-red-500/30 border border-red-500/50'}`}
              />
            </div>
            <span className={`text-sm font-mono font-bold w-12 text-right ${item.positive ? 'text-emerald-400' : 'text-red-400'}`}>
              {item.positive ? '+' : ''}{item.value}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-[#1f1f1f] text-center">
        <p className="text-xs text-gray-500">Unlike black-box models, ScoreKu shows exactly what affects your score</p>
      </div>
    </div>
  )
}

// ─── Feature 3: Real-time Scoring Demo ───────────────────────────────────────

function RealtimeScoringDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [events, setEvents] = useState([])
  const [score, setScore] = useState(680)

  const timelineEvents = [
    { label: 'Bill paid on time', change: +15, icon: '✓' },
    { label: 'DuitNow transfer', change: +8, icon: '↗' },
    { label: 'Missed payment', change: -20, icon: '✗' },
    { label: 'E-wallet top-up', change: +5, icon: '↗' },
    { label: 'Consistent income', change: +12, icon: '✓' },
  ]

  useEffect(() => {
    if (!isInView) return
    let currentScore = 680
    timelineEvents.forEach((event, i) => {
      setTimeout(() => {
        currentScore += event.change
        setScore(currentScore)
        setEvents(prev => [...prev, { ...event, score: currentScore }])
      }, (i + 1) * 1000)
    })
  }, [isInView])

  const chartData = [{ score: 680 }, ...events.map(e => ({ score: e.score }))]

  return (
    <div ref={ref} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6">
      {/* Score display */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">Live Score</span>
        <motion.span
          key={score}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="text-2xl font-bold text-blue-400"
        >
          {score}
        </motion.span>
      </div>

      {/* Mini chart */}
      <div className="h-24 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Events timeline */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-2 rounded-lg bg-[#111] border border-[#1a1a1a]"
          >
            <span className={`text-sm ${event.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{event.icon}</span>
            <span className="text-xs text-gray-300 flex-1">{event.label}</span>
            <span className={`text-xs font-mono font-bold ${event.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {event.change > 0 ? '+' : ''}{event.change}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Feature 4: Product Matching Demo ────────────────────────────────────────

function ProductMatchingDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [showProducts, setShowProducts] = useState(false)

  const products = [
    { name: 'BSN Micro Loan', rate: '3.5%', amount: 'RM 5,000', badge: 'Best Match' },
    { name: 'TEKUN Financing', rate: '4.0%', amount: 'RM 10,000', badge: 'Eligible' },
    { name: 'Agrobank Personal', rate: '4.5%', amount: 'RM 8,000', badge: 'Eligible' },
  ]

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowProducts(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  return (
    <div ref={ref} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6">
      {/* Score gauge */}
      <div className="text-center mb-6">
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#1f1f1f" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="8"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 251' }}
              animate={isInView ? { strokeDasharray: '181 251' } : {}}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-blue-400">697</span>
            <span className="text-[10px] text-gray-500">Good</span>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="space-y-3">
        {products.map((product, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={showProducts ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.3 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#111] border border-[#1f1f1f]"
          >
            <Building2 size={16} className="text-blue-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-200">{product.name}</p>
              <p className="text-xs text-gray-500">{product.rate} · Up to {product.amount}</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${i === 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
              {product.badge} ✓
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Feature 5: Improvement Tips Demo ────────────────────────────────────────

function ImprovementTipsDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const tips = [
    { tip: 'Pay bills on time for 3 months', gain: 55, from: 697, to: 752 },
    { tip: 'Increase e-wallet usage frequency', gain: 25, from: 697, to: 722 },
    { tip: 'Maintain consistent monthly income', gain: 18, from: 697, to: 715 },
  ]

  return (
    <div ref={ref} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6">
      <div className="space-y-4">
        {tips.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.3 }}
            className="p-4 rounded-xl bg-[#111] border border-[#1f1f1f]"
          >
            <div className="flex items-start gap-3 mb-3">
              <Lightbulb size={16} className="text-amber-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-200">{item.tip}</p>
                <p className="text-xs text-emerald-400 mt-1">+{item.gain} points potential</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{item.from}</span>
              <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={isInView ? { width: `${(item.gain / 150) * 100}%` } : {}}
                  transition={{ duration: 1, delay: 0.5 + i * 0.3 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                />
              </div>
              <span className="text-xs text-emerald-400 font-bold">{item.to}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Feature 6: Bank Connection Demo ─────────────────────────────────────────

function BankConnectionDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [step, setStep] = useState(0)

  const steps = [
    { label: 'Select Bank', icon: Building2 },
    { label: 'Authorize', icon: Shield },
    { label: 'Import Data', icon: TrendingUp },
    { label: 'Score Updated', icon: CheckCircle2 },
  ]

  useEffect(() => {
    if (!isInView) return
    const interval = setInterval(() => {
      setStep(prev => {
        if (prev >= 3) {
          clearInterval(interval)
          return 3
        }
        return prev + 1
      })
    }, 1200)
    return () => clearInterval(interval)
  }, [isInView])

  return (
    <div ref={ref} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6">
      {/* Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <motion.div
              animate={i <= step ? { scale: [1, 1.2, 1], backgroundColor: '#3b82f620' } : {}}
              transition={{ duration: 0.4 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border ${i <= step ? 'border-blue-500/50 bg-blue-500/10' : 'border-[#2a2a2a] bg-[#111]'}`}
            >
              <s.icon size={16} className={i <= step ? 'text-blue-400' : 'text-gray-600'} />
            </motion.div>
            <span className={`text-[10px] ${i <= step ? 'text-blue-400' : 'text-gray-600'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Connecting lines */}
      <div className="flex items-center gap-1 mb-6 px-5">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={i < step ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="flex-1 h-0.5 bg-blue-500/40 origin-left"
          />
        ))}
      </div>

      {/* Security badges */}
      <div className="flex flex-wrap gap-2 justify-center">
        {['256-bit Encryption', 'PDPA Compliant', 'Read-only Access'].map((badge, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 + i * 0.2 }}
            className="text-[10px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          >
            <Lock size={10} className="inline mr-1" />{badge}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

// ─── Feature Section Component ───────────────────────────────────────────────

function FeatureSection({ index, icon: Icon, title, description, demo, color }) {
  const isEven = index % 2 === 0

  return (
    <section className="py-20 border-b border-[#1f1f1f] last:border-b-0">
      <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
        {/* Text */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={isEven ? fadeInLeft : fadeInRight}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6`} style={{ opacity: 0.15 }}>
            <Icon size={28} className="text-white" style={{ opacity: 1 }} />
          </div>
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 -mt-14`}>
            <Icon size={28} className="text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">{title}</h3>
          <p className="text-gray-400 leading-relaxed text-lg">{description}</p>
        </motion.div>

        {/* Demo */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={isEven ? fadeInRight : fadeInLeft}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full"
        >
          {demo}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function FeaturesPage() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)

  const features = [
    {
      icon: Wallet,
      title: 'Alternative Credit Scoring',
      description: 'Traditional credit scoring excludes millions who lack bank history. ScoreKu uses e-wallet transactions, bill payments, and digital footprint to build a comprehensive credit profile for the unbanked.',
      demo: <AlternativeScoringDemo />,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Brain,
      title: 'Explainable AI (SHAP)',
      description: 'Every score comes with a complete breakdown of WHY. Our SHAP-powered explainability engine shows exactly which factors help and hurt your score — no black boxes.',
      demo: <SHAPWaterfallDemo />,
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: Clock,
      title: 'Real-time Scoring',
      description: 'Your score updates as new data comes in. Pay a bill? Score goes up instantly. Miss a payment? You see the impact immediately. No waiting days for batch processing.',
      demo: <RealtimeScoringDemo />,
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Target,
      title: 'Financial Product Matching',
      description: 'Based on your score, we match you with financial products you actually qualify for. No more applying blindly and getting rejected — see your eligible options upfront.',
      demo: <ProductMatchingDemo />,
      color: 'from-amber-500 to-amber-600',
    },
    {
      icon: Lightbulb,
      title: 'Personalized Improvement Tips',
      description: 'AI-generated recommendations tailored to your weakest factors. See exactly how many points you can gain by taking specific actions, with estimated timelines.',
      demo: <ImprovementTipsDemo />,
      color: 'from-pink-500 to-pink-600',
    },
    {
      icon: Lock,
      title: 'Bank Connection (Open Banking)',
      description: 'Securely connect your bank account for automatic data collection. We use read-only access with bank-grade encryption — your data never leaves our secure environment.',
      demo: <BankConnectionDemo />,
      color: 'from-green-500 to-green-600',
    },
  ]

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0f0f0f] text-white' : 'bg-white text-gray-900'}`}>
      <AppSidebar activePath="/features" mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="lg:ml-[260px]">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#1f1f1f]">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-[#1a1a1a]">
            <Menu size={20} />
          </button>
          <span className="text-sm font-medium">Features</span>
          <div className="w-9" />
        </div>

        {/* Hero */}
        <section className="relative px-6 pt-16 pb-12 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              {t('featuresPageTitle')}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('featuresPageSubtitle')}
            </p>
          </motion.div>
        </section>

        {/* Feature Sections */}
        <div className="max-w-6xl mx-auto px-6">
          {features.map((feature, i) => (
            <FeatureSection key={i} index={i} {...feature} />
          ))}
        </div>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">{t('featuresCtaTitle')}</h2>
            <p className="text-gray-400 mb-8">{t('featuresCtaSubtitle')}</p>
            <Link
              to="/score"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
            >
              Get Your Score <ArrowRight size={18} />
            </Link>
          </motion.div>
        </section>
      </main>
    </div>
  )
}
