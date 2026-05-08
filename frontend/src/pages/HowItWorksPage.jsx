import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  Smartphone, Shield, Brain, TrendingUp, Lightbulb, CheckCircle2,
  ArrowRight, ArrowDown, Database, Cpu, BarChart3, Target,
  Lock, Zap, Menu, Building2, Clock
} from 'lucide-react'
import {
  ResponsiveContainer, LineChart, Line
} from 'recharts'
import AppSidebar from '../components/AppSidebar'
import { useTheme } from '../context/ThemeContext'

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

// ─── Step 1: Data Collection Demo ────────────────────────────────────────────

function DataCollectionDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [filledFields, setFilledFields] = useState(0)

  const fields = [
    { label: 'Monthly Income', value: 'RM 3,500', icon: '💰' },
    { label: 'Employment Type', value: 'Gig Worker', icon: '💼' },
    { label: 'E-wallet Usage', value: '45 txn/month', icon: '📱' },
    { label: 'Bill Payments', value: '6 active bills', icon: '📄' },
    { label: 'E-commerce Activity', value: '12 orders/month', icon: '🛒' },
    { label: 'DuitNow Frequency', value: '28 transfers/month', icon: '🔄' },
  ]

  useEffect(() => {
    if (!isInView) return
    const interval = setInterval(() => {
      setFilledFields(prev => {
        if (prev >= fields.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 500)
    return () => clearInterval(interval)
  }, [isInView])

  return (
    <div ref={ref} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">Data Input</span>
        <span className="text-xs text-blue-400 font-mono">{filledFields * 7} data points collected</span>
      </div>
      <div className="space-y-2">
        {fields.map((field, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3 }}
            animate={i < filledFields ? { opacity: 1 } : { opacity: 0.3 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#111] border border-[#1f1f1f]"
          >
            <span className="text-sm">{field.icon}</span>
            <span className="text-xs text-gray-400 flex-1">{field.label}</span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={i < filledFields ? { opacity: 1 } : { opacity: 0 }}
              className="text-xs text-emerald-400 font-mono"
            >
              {field.value}
            </motion.span>
            {i < filledFields && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-400">
                <CheckCircle2 size={14} />
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={filledFields >= fields.length ? { opacity: 1 } : {}}
        className="mt-4 text-center"
      >
        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          ✓ 42 data points collected
        </span>
      </motion.div>
    </div>
  )
}

// ─── Step 2: Data Validation Demo ────────────────────────────────────────────

function DataValidationDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [checkedItems, setCheckedItems] = useState(0)

  const validations = [
    { label: 'Income range valid (RM 1K - 50K)', status: 'pass' },
    { label: 'Transaction count verified (>10/month)', status: 'pass' },
    { label: 'No anomalies detected', status: 'pass' },
    { label: '12 months history available', status: 'pass' },
    { label: 'Data consistency check', status: 'pass' },
    { label: 'Duplicate detection', status: 'pass' },
  ]

  useEffect(() => {
    if (!isInView) return
    const interval = setInterval(() => {
      setCheckedItems(prev => {
        if (prev >= validations.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 600)
    return () => clearInterval(interval)
  }, [isInView])

  return (
    <div ref={ref} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">Validation Pipeline</span>
        <span className="text-xs text-blue-400 font-mono">{checkedItems}/{validations.length} checks</span>
      </div>
      <div className="space-y-2">
        {validations.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3 }}
            animate={i < checkedItems ? { opacity: 1 } : { opacity: 0.3 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#111] border border-[#1f1f1f]"
          >
            {i < checkedItems ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </motion.div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-[#2a2a2a]" />
            )}
            <span className={`text-xs flex-1 ${i < checkedItems ? 'text-gray-200' : 'text-gray-600'}`}>
              {item.label}
            </span>
            {i < checkedItems && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                PASS
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={checkedItems >= validations.length ? { opacity: 1 } : {}}
        className="text-xs text-gray-500 mt-4 text-center"
      >
        We ensure data quality before processing
      </motion.p>
    </div>
  )
}

// ─── Step 3: Feature Engineering Demo ────────────────────────────────────────

function FeatureEngineeringDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [showFeatures, setShowFeatures] = useState(false)

  const transformations = [
    { raw: '6 monthly incomes', feature: 'income_stability', value: '0.82' },
    { raw: 'Income trend data', feature: 'income_trend', value: '+5%' },
    { raw: 'Bill payment dates', feature: 'payment_consistency', value: '0.92' },
    { raw: 'E-wallet transactions', feature: 'digital_activity_score', value: '0.71' },
    { raw: 'Shopping frequency', feature: 'ecommerce_engagement', value: '0.65' },
    { raw: 'Transfer patterns', feature: 'financial_network', value: '0.78' },
  ]

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowFeatures(true), 800)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  return (
    <div ref={ref} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">Feature Engineering</span>
        <span className="text-xs text-purple-400 font-mono">Raw → 56 features</span>
      </div>
      <div className="space-y-2">
        {transformations.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: i * 0.2 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-[#111] border border-[#1f1f1f]"
          >
            <span className="text-[10px] text-gray-500 w-28 truncate">{item.raw}</span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={showFeatures ? { scaleX: 1 } : {}}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="text-purple-400"
            >
              <ArrowRight size={14} />
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={showFeatures ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="text-[10px] text-blue-400 font-mono flex-1"
            >
              {item.feature}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={showFeatures ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.15 }}
              className="text-[10px] text-emerald-400 font-mono"
            >
              {item.value}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Step 4: AI Model Demo ───────────────────────────────────────────────────

function AIModelDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [progress, setProgress] = useState(0)

  const stages = [
    { label: 'Loading features', pct: 20 },
    { label: 'Tree ensemble processing', pct: 55 },
    { label: 'Aggregating predictions', pct: 80 },
    { label: 'Probability output', pct: 100 },
  ]

  useEffect(() => {
    if (!isInView) return
    let current = 0
    const interval = setInterval(() => {
      current += 2
      setProgress(Math.min(current, 100))
      if (current >= 100) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [isInView])

  const currentStage = stages.findIndex(s => progress <= s.pct) 

  return (
    <div ref={ref} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">XGBoost Model</span>
        <span className="text-xs text-amber-400 font-mono">{progress}%</span>
      </div>

      {/* Model specs */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Trees', value: '150' },
          { label: 'Depth', value: '4' },
          { label: 'Profiles', value: '10K' },
        ].map((spec, i) => (
          <div key={i} className="text-center p-2 rounded-lg bg-[#111] border border-[#1a1a1a]">
            <p className="text-lg font-bold text-blue-400">{spec.value}</p>
            <p className="text-[10px] text-gray-500">{spec.label}</p>
          </div>
        ))}
      </div>

      {/* Processing stages */}
      <div className="space-y-2 mb-4">
        {stages.map((stage, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${progress >= stage.pct ? 'bg-emerald-500/20 text-emerald-400' : currentStage === i ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-[#1a1a1a] text-gray-600'}`}>
              {progress >= stage.pct ? '✓' : i + 1}
            </div>
            <span className={`text-xs ${progress >= stage.pct ? 'text-gray-200' : 'text-gray-600'}`}>{stage.label}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {progress >= 100 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
          <span className="text-xs text-emerald-400">Output: P(good_credit) = 0.72</span>
        </motion.div>
      )}
    </div>
  )
}

// ─── Step 5: SHAP Explainability Demo ────────────────────────────────────────

function SHAPStepDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [visibleBars, setVisibleBars] = useState(0)

  const shapValues = [
    { feature: 'payment_consistency', value: +85, cumulative: 635 },
    { feature: 'ewallet_activity', value: +42, cumulative: 677 },
    { feature: 'income_stability', value: +35, cumulative: 712 },
    { feature: 'ecommerce_returns', value: -15, cumulative: 697 },
  ]

  useEffect(() => {
    if (!isInView) return
    const interval = setInterval(() => {
      setVisibleBars(prev => {
        if (prev >= shapValues.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 700)
    return () => clearInterval(interval)
  }, [isInView])

  return (
    <div ref={ref} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">SHAP Waterfall</span>
        <span className="text-xs text-teal-400 font-mono">Base: 550</span>
      </div>

      {/* Base score */}
      <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-[#111] border border-[#1a1a1a]">
        <span className="text-xs text-gray-500">Base Score</span>
        <span className="ml-auto text-sm font-bold text-gray-300">550</span>
      </div>

      {/* SHAP bars */}
      <div className="space-y-2">
        {shapValues.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={i < visibleBars ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 p-2 rounded-lg bg-[#111] border border-[#1a1a1a]"
          >
            <span className={`text-xs w-4 ${item.value > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {item.value > 0 ? '+' : '−'}
            </span>
            <span className="text-[10px] text-gray-400 font-mono flex-1">{item.feature}</span>
            <motion.div
              initial={{ width: 0 }}
              animate={i < visibleBars ? { width: `${Math.abs(item.value) * 0.8}px` } : {}}
              transition={{ duration: 0.6 }}
              className={`h-4 rounded ${item.value > 0 ? 'bg-emerald-500/30' : 'bg-red-500/30'}`}
            />
            <span className={`text-xs font-mono font-bold w-8 text-right ${item.value > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {item.value > 0 ? '+' : ''}{item.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Final score */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={visibleBars >= shapValues.length ? { opacity: 1 } : {}}
        className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center"
      >
        <span className="text-xs text-gray-400">Final Score: </span>
        <span className="text-lg font-bold text-blue-400">697</span>
      </motion.div>
    </div>
  )
}

// ─── Step 6: Score Generation Demo ───────────────────────────────────────────

function ScoreGenerationDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [score, setScore] = useState(300)
  const [showBadge, setShowBadge] = useState(false)

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const start = Date.now()
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setScore(Math.round(300 + eased * 397))
      if (progress < 1) requestAnimationFrame(animate)
      else setTimeout(() => setShowBadge(true), 500)
    }
    setTimeout(animate, 400)
  }, [isInView])

  const circumference = 2 * Math.PI * 45
  const strokeDasharray = `${((score - 300) / 550) * circumference} ${circumference}`

  return (
    <div ref={ref} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 text-center">
      <div className="relative w-36 h-36 mx-auto mb-4">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1f1f1f" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="8"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-blue-400">{score}</span>
          <span className="text-[10px] text-gray-500">/ 850</span>
        </div>
      </div>

      {showBadge && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block">
          <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium">
            Risk Category: Good
          </span>
        </motion.div>
      )}

      <p className="text-xs text-gray-500 mt-4">Score mapped to 300-850 range (CTOS format)</p>
    </div>
  )
}

// ─── Step 7: Recommendations Demo ────────────────────────────────────────────

function RecommendationsDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const tips = [
    { tip: 'Pay bills on time for 3 months', gain: '+55 pts', icon: '📅' },
    { tip: 'Increase DuitNow usage to 30+/month', gain: '+25 pts', icon: '📱' },
    { tip: 'Reduce e-commerce returns', gain: '+15 pts', icon: '📦' },
  ]

  const products = [
    { name: 'BSN Micro Loan', eligible: true },
    { name: 'TEKUN Financing', eligible: true },
    { name: 'Maybank Credit Card', eligible: false },
  ]

  return (
    <div ref={ref} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6">
      {/* Tips */}
      <div className="mb-6">
        <span className="text-xs text-gray-400 uppercase tracking-wider">Improvement Tips</span>
        <div className="space-y-2 mt-3">
          {tips.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.3 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#111] border border-[#1f1f1f]"
            >
              <span>{item.icon}</span>
              <span className="text-xs text-gray-300 flex-1">{item.tip}</span>
              <span className="text-xs text-emerald-400 font-bold">{item.gain}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div>
        <span className="text-xs text-gray-400 uppercase tracking-wider">Eligible Products</span>
        <div className="space-y-2 mt-3">
          {products.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 + i * 0.2 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#111] border border-[#1f1f1f]"
            >
              <Building2 size={14} className="text-blue-400" />
              <span className="text-xs text-gray-300 flex-1">{item.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.eligible ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {item.eligible ? 'Eligible ✓' : 'Not Yet'}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Step Component ──────────────────────────────────────────────────────────

function StepSection({ step, title, description, demo, icon: Icon, isLast }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} className="relative">
      {/* Step indicator */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
        className="flex items-start gap-6 mb-8"
      >
        {/* Step number + line */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.4, type: 'spring' }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shrink-0"
          >
            {step}
          </motion.div>
          {!isLast && (
            <motion.div
              initial={{ height: 0 }}
              animate={isInView ? { height: '100%' } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="w-0.5 bg-gradient-to-b from-blue-500/50 to-transparent mt-2 min-h-[40px]"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pb-12">
          <div className="flex items-center gap-3 mb-2">
            <Icon size={20} className="text-blue-400" />
            <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
          </div>
          <p className="text-gray-400 mb-6 leading-relaxed">{description}</p>
          {demo}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function HowItWorksPage() {
  const { theme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  // Simulated timer
  const timerRef = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!startedRef.current && window.scrollY > 200) {
        startedRef.current = true
        timerRef.current = setInterval(() => {
          setElapsed(prev => {
            if (prev >= 1.8) {
              clearInterval(timerRef.current)
              return 1.8
            }
            return Math.round((prev + 0.1) * 10) / 10
          })
        }, 200)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const steps = [
    {
      step: 1,
      icon: Smartphone,
      title: 'Data Collection',
      description: 'User provides monthly income, employment type, e-wallet usage, bill payments, and e-commerce activity — or connects a bank account for automatic collection.',
      demo: <DataCollectionDemo />,
    },
    {
      step: 2,
      icon: Shield,
      title: 'Data Validation & Cleaning',
      description: 'System validates income ranges, verifies transaction counts, runs anomaly detection, and ensures data quality before any processing begins.',
      demo: <DataValidationDemo />,
    },
    {
      step: 3,
      icon: Database,
      title: 'Feature Engineering',
      description: 'Raw data is transformed into 56 engineered features — stability scores, trends, consistency metrics, and behavioral patterns that the AI model can understand.',
      demo: <FeatureEngineeringDemo />,
    },
    {
      step: 4,
      icon: Cpu,
      title: 'AI Model (XGBoost)',
      description: '56 features are fed into a trained XGBoost ensemble model — 150 decision trees processing in parallel to produce a credit probability output.',
      demo: <AIModelDemo />,
    },
    {
      step: 5,
      icon: BarChart3,
      title: 'SHAP Explainability',
      description: 'SHAP values are calculated for each feature, building a waterfall from the base score to show exactly how each factor contributes to the final result.',
      demo: <SHAPStepDemo />,
    },
    {
      step: 6,
      icon: Target,
      title: 'Score Generation',
      description: 'The model probability is mapped to a 300-850 score range (CTOS format), and a risk category is assigned based on established thresholds.',
      demo: <ScoreGenerationDemo />,
    },
    {
      step: 7,
      icon: Lightbulb,
      title: 'Personalized Recommendations',
      description: 'AI generates improvement tips based on your weakest factors, and matches you with financial products you qualify for based on your score.',
      demo: <RecommendationsDemo />,
    },
  ]

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0f0f0f] text-white' : 'bg-white text-gray-900'}`}>
      <AppSidebar activePath="/how-it-works" mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="lg:ml-[260px]">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#1f1f1f]">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-[#1a1a1a]">
            <Menu size={20} />
          </button>
          <span className="text-sm font-medium">How It Works</span>
          <div className="w-9" />
        </div>

        {/* Hero */}
        <section className="relative px-6 pt-16 pb-12 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              How ScoreKu Works
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From data collection to credit score in under 2 minutes
            </p>
          </motion.div>

          {/* Timer badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111] border border-[#1f1f1f]"
          >
            <Clock size={14} className="text-blue-400" />
            <span className="text-sm text-gray-300">Time elapsed: </span>
            <span className="text-sm font-mono font-bold text-blue-400">{elapsed.toFixed(1)}s</span>
          </motion.div>
        </section>

        {/* Steps */}
        <div className="max-w-4xl mx-auto px-6 pb-12">
          {steps.map((stepData, i) => (
            <StepSection key={i} {...stepData} isLast={i === steps.length - 1} />
          ))}
        </div>

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-12"
          >
            <h2 className="text-3xl font-bold mb-4">Try it yourself</h2>
            <p className="text-gray-400 mb-8">See your score in under 2 minutes. No bank account required.</p>
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
