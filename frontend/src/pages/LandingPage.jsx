import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import {
  Shield, TrendingUp, Smartphone, BarChart3, Zap, Users, ArrowRight,
  CheckCircle2, X, Sparkles, Globe, Lock, ChevronDown, Menu, XIcon,
  Wallet, Brain, Clock, Target, Lightbulb, Eye, Car, GraduationCap,
  Store, MapPin, Plus, Minus
} from 'lucide-react'
import BrandLogo from '../components/BrandLogo'

// ─── Data ────────────────────────────────────────────────────────────────────

const navLinks = [
  { label: 'Features', href: '/features', isRoute: true },
  { label: 'How it Works', href: '/how-it-works', isRoute: true },
  { label: 'Simulator', href: '/simulation', isRoute: true },
  { label: 'AI Model', href: '/ai', isRoute: true },
  { label: 'FAQ', href: '#faq' },
]

const typingWords = ['Gig Workers', 'Fresh Graduates', 'Small Traders', 'Rural Communities']

const poweredBy = [
  { name: 'DuitNow', logo: 'https://img.logo.dev/paynet.my?token=pk_free', color: '#1a3c6e' },
  { name: "Touch 'n Go", logo: 'https://img.logo.dev/touchngo.com.my?token=pk_free', color: '#005baa' },
  { name: 'Shopee', logo: 'https://img.logo.dev/shopee.com.my?token=pk_free', color: '#ee4d2d' },
  { name: 'GrabPay', logo: 'https://img.logo.dev/grab.com?token=pk_free', color: '#00b14f' },
]

const stats = [
  { value: 3500000, display: '3.5M', label: 'Unbanked Malaysians', icon: Users },
  { value: 89, display: '89%', label: 'AI Model Accuracy', icon: Zap },
  { value: 10000, display: '10K+', label: 'Profiles Analyzed', icon: Globe },
]

const features = [
  { icon: Wallet, title: 'Alternative Data Scoring', desc: 'Uses e-wallet transactions, bill payments & digital footprint instead of traditional bank history', color: 'from-blue-500 to-blue-600' },
  { icon: Brain, title: 'Explainable AI (SHAP)', desc: 'Transparent scoring with SHAP values — see exactly what affects your score and why', color: 'from-teal-500 to-teal-600' },
  { icon: Clock, title: 'Real-time Scoring', desc: 'Get your credit score in under 5 seconds. No waiting days for bank processing', color: 'from-purple-500 to-purple-600' },
  { icon: Target, title: 'Financial Product Matching', desc: 'AI matches you with loans, cards & financing products you actually qualify for', color: 'from-amber-500 to-amber-600' },
  { icon: Lightbulb, title: 'Improvement Tips', desc: 'Personalized recommendations to boost your score based on your spending patterns', color: 'from-pink-500 to-pink-600' },
  { icon: Lock, title: 'Privacy First', desc: 'Bank-grade encryption. Your data is never sold. You control what gets shared', color: 'from-green-500 to-green-600' },
]

const howItWorks = [
  { step: 1, title: 'Connect Your Data', desc: 'Link your e-wallet, bill payments, and employment info securely', icon: Smartphone, details: 'DuitNow, TnG, Shopee, GrabPay' },
  { step: 2, title: 'AI Analyzes', desc: 'Our ML model processes 40+ features using XGBoost & SHAP', icon: Brain, details: 'Processing takes < 5 seconds' },
  { step: 3, title: 'Get Your Score', desc: 'Receive your score with full breakdown and improvement tips', icon: TrendingUp, details: 'Score + Explanation + Tips' },
]

const comparisonData = {
  traditional: [
    'Requires bank account & credit history',
    'Excludes 3.5M Malaysians',
    '3-5 business days processing',
    'Black box — no explanation',
    'RM50-100 per report',
  ],
  scoreku: [
    'Uses digital footprint & e-wallet data',
    'Inclusive — anyone with a smartphone',
    'Instant results in < 5 seconds',
    'SHAP-powered explainability',
    'Completely free',
  ],
}

const useCases = [
  { icon: Car, title: 'Gig Workers', desc: 'Grab, Foodpanda, Lalamove drivers with consistent digital earnings but no payslip', color: '#3b82f6' },
  { icon: GraduationCap, title: 'Fresh Graduates', desc: 'Just entered workforce — no credit history yet but active digital life', color: '#14b8a6' },
  { icon: Store, title: 'Micro-Entrepreneurs', desc: 'Pasar malam sellers, online shop owners with Shopee/TnG transaction history', color: '#f59e0b' },
  { icon: MapPin, title: 'Rural Communities', desc: 'Limited bank access but growing mobile payment adoption', color: '#8b5cf6' },
]

const techStack = [
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'TailwindCSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Vite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg' },
  { name: 'XGBoost', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'SHAP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' },
]

const testimonials = [
  { name: 'Dr. Ahmad Razif', role: 'FYP Supervisor', quote: 'The technical implementation is impressive — combining XGBoost with SHAP explainability shows strong understanding of responsible AI practices.', avatar: '👨‍🏫' },
  { name: 'Aisha Tan', role: 'Beta Tester', quote: 'Finally something that sees my Grab earnings as real income. The score breakdown actually makes sense and the tips are actionable.', avatar: '👩‍💻' },
  { name: 'En. Hafiz', role: 'Industry Mentor', quote: 'This addresses a real gap in Malaysian fintech. The 3.8M unbanked population needs exactly this kind of inclusive solution.', avatar: '👨‍💼' },
]

const faqData = [
  { q: 'What data does ScoreKu use?', a: 'ScoreKu analyzes your e-wallet transactions (DuitNow, TnG, GrabPay), bill payment history, employment data, and digital activity patterns. We never access your bank account directly.' },
  { q: 'How accurate is the AI model?', a: 'Our XGBoost model achieves 89% accuracy, trained on 10,000+ Malaysian profiles. We continuously improve the model with new data patterns while maintaining fairness across demographics.' },
  { q: 'Is my data safe?', a: 'Absolutely. We use bank-grade AES-256 encryption, never sell your data to third parties, and you can request complete data deletion at any time. We comply with PDPA Malaysia.' },
  { q: 'Who can use ScoreKu?', a: 'Anyone in Malaysia with a smartphone and at least one e-wallet or digital payment account. No bank account required, no minimum income, no credit history needed.' },
  { q: 'How is this different from CCRIS/CTOS?', a: 'CCRIS and CTOS only track formal banking relationships. If you have never had a bank loan or credit card, you are invisible to them. ScoreKu uses alternative digital data to score the unscored.' },
  { q: 'Is it free?', a: 'Yes, completely free for individuals. We plan to monetize through partnerships with financial institutions who want to reach underserved segments — not by charging users.' },
]

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}

// ─── Components ──────────────────────────────────────────────────────────────

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-teal-500 origin-left z-50"
      style={{ scaleX }}
    />
  )
}

function TypeWriter() {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = typingWords[wordIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(word.slice(0, text.length + 1))
        if (text === word) {
          setTimeout(() => setIsDeleting(true), 1800)
        }
      } else {
        setText(word.slice(0, text.length - 1))
        if (text === '') {
          setIsDeleting(false)
          setWordIndex((wordIndex + 1) % typingWords.length)
        }
      }
    }, isDeleting ? 40 : 80)
    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex])

  return (
    <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
      {text}<span className="animate-pulse text-teal-400">|</span>
    </span>
  )
}

function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, target])

  const formatCount = (n) => {
    if (target >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (target >= 1000) return (n / 1000).toFixed(n >= target ? 0 : 0) + 'K'
    return n.toString()
  }

  return (
    <span ref={ref}>
      {prefix}{target >= 100 ? formatCount(count) : count}{suffix}
    </span>
  )
}

function AnimatedGauge() {
  const [score, setScore] = useState(300)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const targetScore = 712

  useEffect(() => {
    if (!isInView) return
    const duration = 2500
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setScore(Math.round(300 + eased * (targetScore - 300)))
      if (progress < 1) requestAnimationFrame(animate)
    }
    const timer = setTimeout(animate, 500)
    return () => clearTimeout(timer)
  }, [isInView])

  const circumference = 2 * Math.PI * 60
  const strokeDasharray = `${((score - 300) / 550) * circumference} ${circumference}`
  const color = score >= 720 ? '#10b981' : score >= 650 ? '#3b82f6' : score >= 530 ? '#f59e0b' : '#ef4444'

  return (
    <div ref={ref} className="relative w-52 h-52 mx-auto">
      <svg className="w-52 h-52 -rotate-90" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="60" fill="none" stroke="#1f1f1f" strokeWidth="10" />
        <circle
          cx="70" cy="70" r="60" fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.1s ease', filter: `drop-shadow(0 0 12px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold tracking-tight" style={{ color }}>{score}</span>
        <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider">out of 850</span>
        <span className="text-[10px] text-gray-600 mt-0.5">
          {score >= 720 ? 'Excellent' : score >= 650 ? 'Good' : score >= 530 ? 'Fair' : 'Building'}
        </span>
      </div>
    </div>
  )
}

function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#14b8a6' : '#8b5cf6',
            opacity: 0.2 + Math.random() * 0.3,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function GradientOrbs() {
  return (
    <div aria-hidden="true">
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-600/8 blur-[150px] pointer-events-none" />
      <div className="fixed top-[40%] left-[60%] w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />
    </div>
  )
}

function FAQItem({ item, isOpen, onClick }) {
  return (
    <motion.div
      className="border border-[#1f1f1f] rounded-2xl overflow-hidden"
      initial={false}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-[#111]/50 transition-colors"
      >
        <span className="text-base font-medium pr-4">{item.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <Plus size={18} className="text-teal-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 text-sm text-gray-400 leading-relaxed">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function TechMarquee() {
  const doubled = [...techStack, ...techStack]
  return (
    <div className="overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />
      <motion.div
        className="flex gap-12 items-center"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((tech, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            <img src={tech.icon} alt={tech.name} className="w-8 h-8 opacity-60" loading="lazy" />
            <span className="text-sm text-gray-400 whitespace-nowrap">{tech.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

const DEMO_USER = { name: 'Ahmad', income: 'RM3,500', employment: 'Gig Worker', ewallet: '32 txn/month', bills: '11/12 paid', ecommerce: '8 orders/month' }
const PIPELINE_STEPS = [
  { id: 'collect', label: 'Collecting Data', icon: '📥' },
  { id: 'validate', label: 'Validating', icon: '✅' },
  { id: 'features', label: 'Feature Engineering', icon: '⚙️' },
  { id: 'model', label: 'XGBoost Model', icon: '🧠' },
  { id: 'shap', label: 'SHAP Analysis', icon: '📊' },
  { id: 'score', label: 'Score Generated', icon: '🎯' },
]

function PipelineDemo() {
  const [phase, setPhase] = useState('collect')
  const [stepIndex, setStepIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const resultHandled = useRef(false)

  useEffect(() => {
    const durations = [4500, 4000, 5000, 5500, 4500, 5000]
    let timeout

    if (stepIndex < 5) {
      setPhase(PIPELINE_STEPS[stepIndex].id)
      setShowResult(false)
      timeout = setTimeout(() => setStepIndex(s => s + 1), durations[stepIndex])
    } else {
      setPhase('score')
      setShowResult(true)
      timeout = setTimeout(() => {
        setStepIndex(0)
        setShowResult(false)
      }, 5000)
    }
    return () => clearTimeout(timeout)
  }, [stepIndex])

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1f1f1f]">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-3 text-xs text-gray-500">ScoreKu — Credit Scoring Pipeline</span>
        <motion.div className="ml-auto w-2 h-2 rounded-full bg-green-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        <span className="text-[10px] text-gray-500">Live</span>
      </div>

      <div className="p-5">
        {/* Pipeline progress */}
        <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap ${
                  i < stepIndex ? 'bg-emerald-500/10 text-emerald-400' :
                  i === stepIndex ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30' :
                  'bg-[#1a1a1a] text-gray-500'
                }`}
                animate={i === stepIndex ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span>{step.icon}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </motion.div>
              {i < PIPELINE_STEPS.length - 1 && (
                <div className={`w-3 h-0.5 mx-0.5 rounded-full ${i < stepIndex ? 'bg-emerald-500' : 'bg-[#2a2a2a]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* User profile being processed */}
        <div className="bg-[#0a0a0a] rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-xs font-bold">A</div>
            <div>
              <p className="text-sm font-medium text-white">{DEMO_USER.name}</p>
              <p className="text-[10px] text-gray-500">{DEMO_USER.employment} • Selangor</p>
            </div>
          </div>

          {/* Step-specific content */}
          <AnimatePresence mode="wait">
            {phase === 'collect' && (
              <motion.div key="collect" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                <div className="flex items-center gap-2">
                  <motion.div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }} />
                  <span className="text-xs text-blue-400">Collecting user data...</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[{ l: 'Income', v: DEMO_USER.income }, { l: 'E-wallet', v: DEMO_USER.ewallet }, { l: 'Bills', v: DEMO_USER.bills }].map((d, i) => (
                    <motion.div key={d.l} className="bg-[#111] rounded-lg p-2 text-center border border-[#1f1f1f]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.4 }}>
                      <div className="text-[9px] text-gray-500">{d.l}</div>
                      <div className="text-[11px] font-medium text-white mt-0.5">{d.v}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {phase === 'validate' && (
              <motion.div key="validate" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                <span className="text-xs text-blue-400">✅ Validating data integrity...</span>
                {['Income range: valid (RM1K-50K)', 'E-wallet data: 32 transactions found', 'Bill history: 12 months available', 'No anomalies detected'].map((check, i) => (
                  <motion.div key={i} className="flex items-center gap-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.4 }}>
                    <motion.span className="text-emerald-400 text-xs" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.4 }}>✓</motion.span>
                    <span className="text-[11px] text-gray-400">{check}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {phase === 'features' && (
              <motion.div key="features" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                <span className="text-xs text-blue-400">⚙️ Engineering 40+ features...</span>
                <div className="space-y-1.5">
                  {[
                    { name: 'income_stability', val: '0.82', desc: 'std/mean of 6 months' },
                    { name: 'payment_consistency', val: '0.92', desc: 'bills_paid / total' },
                    { name: 'digital_activity', val: '0.71', desc: 'normalized txn count' },
                    { name: 'account_maturity', val: '0.65', desc: 'years with same number' },
                  ].map((f, i) => (
                    <motion.div key={f.name} className="flex items-center gap-2 bg-[#111] rounded-lg px-3 py-1.5 border border-[#1f1f1f]" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.5 }}>
                      <span className="text-[10px] font-mono text-purple-400 flex-1">{f.name}</span>
                      <span className="text-[10px] font-bold text-white">{f.val}</span>
                      <span className="text-[9px] text-gray-600 hidden sm:inline">({f.desc})</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {phase === 'model' && (
              <motion.div key="model" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                <div className="flex items-center gap-2">
                  <motion.div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }} />
                  <span className="text-xs text-purple-400">🧠 Running XGBoost classifier...</span>
                </div>
                <motion.div className="text-[10px] text-gray-500 font-mono bg-[#111] rounded px-2 py-1 border border-[#1f1f1f]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  Model: xgb_credit_v2 | Trees: 150 | Depth: 6 | Features: 42
                </motion.div>
                <div className="space-y-1.5">
                  {['Loading model weights', 'Processing feature vector', 'Running 150 decision trees', 'Aggregating predictions'].map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 flex-1">{step}</span>
                      <div className="w-20 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <motion.div className="h-full bg-purple-500 rounded-full" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 0.8, delay: 0.5 + i * 0.7 }} />
                      </div>
                      <motion.span className="text-[9px] text-emerald-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 + i * 0.7 }}>✓</motion.span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {phase === 'shap' && (
              <motion.div key="shap" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                <span className="text-xs text-blue-400">📊 Computing SHAP explanations...</span>
                <div className="space-y-1.5">
                  {[
                    { name: 'Payment Consistency', val: +0.18, color: '#22c55e' },
                    { name: 'Income Stability', val: +0.12, color: '#22c55e' },
                    { name: 'Digital Activity', val: +0.08, color: '#22c55e' },
                    { name: 'E-commerce Returns', val: -0.05, color: '#ef4444' },
                    { name: 'Account Age', val: -0.03, color: '#ef4444' },
                  ].map((f, i) => (
                    <motion.div key={f.name} className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.4 }}>
                      <span className="text-[10px] text-gray-400 w-28 truncate">{f.name}</span>
                      <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden relative">
                        <motion.div
                          className="absolute top-0 h-full rounded-full"
                          style={{ backgroundColor: f.color, left: f.val > 0 ? '50%' : undefined, right: f.val < 0 ? '50%' : undefined }}
                          initial={{ width: '0%' }}
                          animate={{ width: `${Math.abs(f.val) * 200}%` }}
                          transition={{ duration: 0.6, delay: 0.5 + i * 0.3 }}
                        />
                        <div className="absolute top-0 left-1/2 w-px h-full bg-gray-600" />
                      </div>
                      <span className={`text-[10px] font-bold ${f.val > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{f.val > 0 ? '+' : ''}{f.val.toFixed(2)}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {phase === 'score' && showResult && (
              <motion.div key="score" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-2">
                <motion.div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>712</motion.div>
                <p className="text-sm text-gray-400 mt-1">Credit Score Generated</p>
                <div className="flex gap-2 justify-center mt-3">
                  <motion.span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400 font-medium" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>Good Risk</motion.span>
                  <motion.span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-400 font-medium" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>5 Tips Available</motion.span>
                  <motion.span className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-xs text-teal-400 font-medium" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>3 Products Eligible</motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      <ScrollProgress />
      <Particles />
      <GradientOrbs />

      {/* ─── 1. Navbar ─────────────────────────────────────────────────────── */}
      <nav className="relative z-40 border-b border-[#1f1f1f]/50 backdrop-blur-xl bg-[#0a0a0a]/80 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold">Score<span className="text-teal-400">Ku</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link key={link.label} to={link.href} className="hover:text-white transition-colors duration-200">{link.label}</Link>
              ) : (
                <a key={link.label} href={link.href} className="hover:text-white transition-colors duration-200">{link.label}</a>
              )
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="px-4 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white border border-[#2a2a2a] hover:border-gray-600 transition-all duration-200">
              Log In
            </Link>
            <Link to="/register" className="px-5 py-2.5 rounded-xl text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg shadow-blue-600/20">
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-xl"
            >
              <div className="px-6 py-4 space-y-3">
                {navLinks.map((link) => (
                  link.isRoute ? (
                    <Link key={link.label} to={link.href} className="block text-gray-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>{link.label}</Link>
                  ) : (
                    <a key={link.label} href={link.href} className="block text-gray-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>{link.label}</a>
                  )
                ))}
                <div className="flex gap-3 pt-3 border-t border-[#1f1f1f]">
                  <Link to="/login" className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm border border-[#2a2a2a]">Log In</Link>
                  <Link to="/register" className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm bg-blue-600 font-medium">Get Started</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── 2. Hero ───────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8"
            >
              <Sparkles size={12} /> Powered by Machine Learning
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              Your Financial Identity,{' '}
              <span className="bg-gradient-to-r from-blue-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">Reimagined</span>
            </h1>

            <p className="text-xl text-gray-300 mb-2">
              Alternative credit scoring for <TypeWriter />
            </p>

            <p className="text-base text-gray-500 max-w-lg mb-8 leading-relaxed">
              No bank history? No problem. ScoreKu uses your digital footprint — e-wallet transactions, bill payments, and online activity — to generate a fair credit score in seconds.
            </p>

            <div className="flex flex-wrap gap-4 mb-4">
              <Link to="/register" className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-xl shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5">
                Get Your Score <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center gap-2 px-8 py-4 border border-[#2a2a2a] hover:border-gray-600 rounded-2xl text-lg transition-all duration-300 text-gray-300 hover:text-white hover:-translate-y-0.5">
                Learn More
              </a>
            </div>
            <div className="mb-8">
              <Link to="/dashboard?demo=true" className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors group">
                <Eye size={14} /> Try Demo (No Login) <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>Powered by</span>
              <div className="flex gap-3 items-center">
                {poweredBy.map((item) => (
                  <span key={item.name} className="px-2.5 py-1.5 bg-[#111] border border-[#1f1f1f] rounded-lg text-gray-400 flex items-center gap-2">
                    <BrandLogo name={item.name} url={item.logo} fallbackColor={item.color} size="h-5 w-5" />
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-3xl blur-2xl" />
              <div className="relative bg-[#111]/90 backdrop-blur-sm border border-[#1f1f1f] rounded-3xl p-10">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-400 mb-4">Your Alternative Credit Score</p>
                  <AnimatedGauge />
                </div>
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-400">Payment Consistency</span>
                      <span className="text-teal-400 font-medium">85%</span>
                    </div>
                    <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ delay: 2, duration: 1.2, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-400">Digital Activity</span>
                      <span className="text-blue-400 font-medium">72%</span>
                    </div>
                    <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ delay: 2.3, duration: 1.2, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-400">Income Stability</span>
                      <span className="text-purple-400 font-medium">68%</span>
                    </div>
                    <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ delay: 2.6, duration: 1.2, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 3. Problem Statement ──────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium mb-6">The Problem</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <AnimatedCounter target={3500000} prefix="" suffix="" /> Malaysians are{' '}
            <span className="text-red-400">financially invisible</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            No credit history means no loans, no financing, no opportunities. Traditional scoring systems were never built for the digital economy.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="bg-[#111] border border-red-500/10 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
              <X size={18} /> Traditional Data
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2"><X size={14} className="text-red-400/60 mt-0.5 shrink-0" /> Bank statements & loan history</li>
              <li className="flex items-start gap-2"><X size={14} className="text-red-400/60 mt-0.5 shrink-0" /> Credit card usage records</li>
              <li className="flex items-start gap-2"><X size={14} className="text-red-400/60 mt-0.5 shrink-0" /> CCRIS/CTOS formal reports</li>
              <li className="flex items-start gap-2"><X size={14} className="text-red-400/60 mt-0.5 shrink-0" /> Requires years of banking relationship</li>
            </ul>
          </motion.div>
          <motion.div variants={fadeInUp} className="bg-[#111] border border-teal-500/10 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-teal-400 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} /> Alternative Data
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-teal-400 mt-0.5 shrink-0" /> E-wallet transaction patterns</li>
              <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-teal-400 mt-0.5 shrink-0" /> Bill payment consistency</li>
              <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-teal-400 mt-0.5 shrink-0" /> Digital commerce activity</li>
              <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-teal-400 mt-0.5 shrink-0" /> Available to anyone with a smartphone</li>
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── 4. Stats Section ──────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              className="bg-[#111]/80 backdrop-blur-sm border border-[#1f1f1f] rounded-2xl p-8 text-center group hover:border-teal-500/30 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-teal-500/10 border border-[#2a2a2a] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className="w-7 h-7 text-teal-400" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-2">
                {stat.display === '3.5M' && <AnimatedCounter target={3500000} />}
                {stat.display === '89%' && <><AnimatedCounter target={89} />%</>}
                {stat.display === '10K+' && <><AnimatedCounter target={10000} />+</>}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── 5. Live Demo / Pipeline ──────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See It In Action</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Watch how ScoreKu transforms your digital data into a credit score in real-time</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <PipelineDemo />
        </motion.div>
      </section>

      {/* ─── 6. Features Grid ──────────────────────────────────────────────── */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Financial Inclusion</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to build, understand, and improve your credit identity</p>
          <Link to="/features" className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 mt-3 transition-colors">See all features <ArrowRight size={14} /></Link>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="group bg-[#111]/80 backdrop-blur-sm border border-[#1f1f1f] rounded-2xl p-7 hover:border-[#2a2a2a] transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} bg-opacity-10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`} style={{ background: `linear-gradient(135deg, ${f.color.includes('blue') ? '#3b82f620' : f.color.includes('teal') ? '#14b8a620' : f.color.includes('purple') ? '#8b5cf620' : f.color.includes('amber') ? '#f59e0b20' : f.color.includes('pink') ? '#ec489920' : '#10b98120'}, transparent)` }}>
                <f.icon className="w-6 h-6 text-white/80" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── 7. How It Works ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400">Three simple steps to your alternative credit score</p>
          <Link to="/how-it-works" className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 mt-3 transition-colors">See all steps <ArrowRight size={14} /></Link>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 relative"
        >
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-px bg-gradient-to-r from-blue-500/30 via-teal-500/30 to-blue-500/30" />

          {howItWorks.map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="relative">
              <div className="bg-[#111]/80 backdrop-blur-sm border border-[#1f1f1f] rounded-2xl p-8 text-center hover:border-blue-500/20 transition-all duration-300 relative z-10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center mx-auto mb-5 text-sm font-bold shadow-lg shadow-blue-500/20">
                  {item.step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-3">{item.desc}</p>
                <span className="inline-block px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs text-gray-500">{item.details}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── 8. Comparison Section ─────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Traditional Credit Scoring vs ScoreKu</h2>
          <p className="text-gray-400">See why alternative scoring is the future of financial inclusion</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="bg-[#111] border border-red-500/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <X size={20} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-red-400">Traditional Scoring</h3>
            </div>
            <ul className="space-y-4">
              {comparisonData.traditional.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 text-sm text-gray-400"
                >
                  <X size={16} className="text-red-400/60 mt-0.5 shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="bg-[#111] border border-teal-500/20 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold text-teal-400">ScoreKu</h3>
              </div>
              <ul className="space-y-4">
                {comparisonData.scoreku.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    className="flex items-start gap-3 text-sm text-gray-300"
                  >
                    <CheckCircle2 size={16} className="text-teal-400 mt-0.5 shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── 9. Use Cases ──────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Benefits?</h2>
          <p className="text-gray-400">Built for Malaysians left behind by traditional finance</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {useCases.map((uc, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-[#111]/80 border border-[#1f1f1f] rounded-2xl p-6 hover:border-opacity-50 transition-all duration-300 hover:-translate-y-1 group"
              style={{ '--accent': uc.color }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ background: `${uc.color}15`, border: `1px solid ${uc.color}30` }}
              >
                <uc.icon className="w-6 h-6" style={{ color: uc.color }} />
              </div>
              <h3 className="text-base font-semibold mb-2">{uc.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{uc.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── 10. Tech Stack Marquee ────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold mb-2">Built With</h2>
          <p className="text-sm text-gray-500">Modern, production-ready technology stack</p>
        </motion.div>
        <TechMarquee />
      </section>



      {/* ─── BNM Alignment ───────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
        >
          <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#1f1f1f] rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-teal-600/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">Regulatory Alignment</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Aligned with BNM Financial Inclusion Framework 2023-2026
              </h2>
              <p className="text-gray-400 max-w-2xl mb-8">
                ScoreKu is built in accordance with Bank Negara Malaysia's strategic roadmap for financial inclusion, which explicitly calls for alternative credit assessment methods to serve underbanked Malaysians.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  { title: 'Alternative Credit Assessment', desc: 'BNM encourages use of non-traditional data (e-wallet, bills, digital footprint) for credit evaluation' },
                  { title: 'Digital Financial Services', desc: 'Leveraging DuitNow, e-wallets, and digital channels as financial inclusion tools' },
                  { title: 'Underserved Populations', desc: 'Targeting gig workers, micro-entrepreneurs, rural communities, and B40 households' },
                  { title: 'Open Banking Initiative', desc: 'Supporting data sharing (with consent) to enable better financial products for all' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-4"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  >
                    <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400 font-medium">BNM Framework 2023-2026</span>
                <span className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-lg text-xs text-teal-400 font-medium">PDPA Compliant</span>
                <span className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-400 font-medium">Open Banking Ready</span>
                <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400 font-medium">UN SDG Aligned</span>
              </div>

              <p className="text-[10px] text-gray-600 mt-6">Sources: Bank Negara Malaysia Financial Inclusion Framework 2023-2026 | PwC Malaysia Digital Banking Report 2024 | World Bank Global Findex 2021</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── 12. FAQ ───────────────────────────────────────────────────────── */}
      <section id="faq" className="relative z-10 max-w-3xl mx-auto px-6 pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400">Everything you need to know about ScoreKu</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-3"
        >
          {faqData.map((item, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <FAQItem
                item={item}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── 13. CTA Section ───────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-teal-600/10 to-purple-600/20" />
          <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm" />
          <div className="relative z-10 text-center py-20 px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Start building your financial identity today
            </motion.h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              No bank account needed. No credit history required.
            </p>
            <Link
              to="/register"
              className="group relative inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-2xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:-translate-y-1 overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="relative">Get Your Score</span>
              <ArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── 14. Footer ────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                  <Zap size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold">Score<span className="text-teal-400">Ku</span></span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Alternative credit scoring for financially invisible Malaysians. Built with AI, designed for inclusion.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4 text-gray-300">Product</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><Link to="/simulation" className="hover:text-white transition-colors">Score Simulator</Link></li>
                <li><Link to="/ai" className="hover:text-white transition-colors">How AI Works</Link></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4 text-gray-300">Company</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4 text-gray-300">Legal</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">PDPA Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1f1f1f] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">© 2026 ScoreKu. Built for financial inclusion.</p>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Lock size={12} /> Bank-grade encryption · PDPA compliant
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
