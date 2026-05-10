import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Shield, TrendingUp, Smartphone, Zap, ArrowRight,
  CheckCircle2, X, Lock, Menu, XIcon,
  Wallet, Brain, Clock, Target, Lightbulb, Eye, Car, GraduationCap,
  Store, MapPin, Languages, ChevronRight
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

// ─── Data ────────────────────────────────────────────────────────────────────

const typingWordsEn = ['Gig Workers', 'Fresh Graduates', 'Small Traders', 'Rural Communities']
const typingWordsBm = ['Pekerja Gig', 'Graduan Baru', 'Peniaga Kecil', 'Komuniti Luar Bandar']

const poweredBy = [
  { name: 'DuitNow', color: '#1a3c6e' },
  { name: "Touch 'n Go", color: '#005baa' },
  { name: 'Shopee', color: '#ee4d2d' },
  { name: 'GrabPay', color: '#00b14f' },
]

const stats = [
  { display: '3.5M', label: 'Unbanked Malaysians', labelKey: 'landingStatsUnbanked', target: 3500000 },
  { display: '89%', label: 'AI Model Accuracy', labelKey: 'landingStatsAccuracy', target: 89 },
  { display: '10K+', label: 'Profiles Analyzed', labelKey: 'landingStatsProfiles', target: 10000 },
]

const features = [
  { icon: Wallet, title: 'Alternative Data Scoring', desc: 'Uses e-wallet transactions, bill payments & digital footprint instead of traditional bank history', accent: '#3b82f6' },
  { icon: Brain, title: 'Explainable AI (SHAP)', desc: 'Transparent scoring with SHAP values — see exactly what affects your score and why', accent: '#14b8a6' },
  { icon: Clock, title: 'Real-time Scoring', desc: 'Get your credit score in under 5 seconds. No waiting days for bank processing', accent: '#8b5cf6' },
  { icon: Target, title: 'Financial Product Matching', desc: 'AI matches you with loans, cards & financing products you actually qualify for', accent: '#f59e0b' },
  { icon: Lightbulb, title: 'Improvement Tips', desc: 'Personalized recommendations to boost your score based on your spending patterns', accent: '#ec4899' },
  { icon: Lock, title: 'Privacy First', desc: 'Bank-grade encryption. Your data is never sold. You control what gets shared', accent: '#10b981' },
]

const howItWorks = [
  { step: 1, title: 'Connect Your Data', desc: 'Link your e-wallet, bill payments, and employment info securely', icon: Smartphone, detail: 'DuitNow, TnG, Shopee, GrabPay' },
  { step: 2, title: 'AI Analyzes', desc: 'Our ML model processes 40+ features using XGBoost & SHAP', icon: Brain, detail: 'Processing takes < 5 seconds' },
  { step: 3, title: 'Get Your Score', desc: 'Receive your score with full breakdown and improvement tips', icon: TrendingUp, detail: 'Score + Explanation + Tips' },
]

const useCases = [
  { icon: Car, title: 'Gig Workers', desc: 'Grab, Foodpanda, Lalamove drivers with consistent digital earnings but no payslip', accent: '#3b82f6' },
  { icon: GraduationCap, title: 'Fresh Graduates', desc: 'Just entered workforce — no credit history yet but active digital life', accent: '#14b8a6' },
  { icon: Store, title: 'Micro-Entrepreneurs', desc: 'Pasar malam sellers, online shop owners with Shopee/TnG transaction history', accent: '#f59e0b' },
  { icon: MapPin, title: 'Rural Communities', desc: 'Limited bank access but growing mobile payment adoption', accent: '#8b5cf6' },
]

const techStack = [
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'TailwindCSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'XGBoost', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
]

// eslint-disable-next-line no-unused-vars
const DEMO_USER = { name: 'Ahmad', income: 'RM3,500', employment: 'Gig Worker', ewallet: '32 txn/month', bills: '11/12 paid', ecommerce: '8 orders/month' }
const PIPELINE_STEPS_EN = [
  { id: 'collect', label: 'Collecting Data', icon: '📥' },
  { id: 'validate', label: 'Validating', icon: '✅' },
  { id: 'features', label: 'Feature Engineering', icon: '⚙️' },
  { id: 'model', label: 'XGBoost Model', icon: '🧠' },
  { id: 'shap', label: 'SHAP Analysis', icon: '📊' },
  { id: 'score', label: 'Score Generated', icon: '🎯' },
]
const PIPELINE_STEPS_BM = [
  { id: 'collect', label: 'Mengumpul Data', icon: '📥' },
  { id: 'validate', label: 'Mengesahkan', icon: '✅' },
  { id: 'features', label: 'Kejuruteraan Ciri', icon: '⚙️' },
  { id: 'model', label: 'Model XGBoost', icon: '🧠' },
  { id: 'shap', label: 'Analisis SHAP', icon: '📊' },
  { id: 'score', label: 'Skor Dijana', icon: '🎯' },
]

// ─── Animation ───────────────────────────────────────────────────────────────

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

// ─── Components ──────────────────────────────────────────────────────────────

function TypeWriter({ language }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const words = language === 'bm' ? typingWordsBm : typingWordsEn

  useEffect(() => {
    const reset = () => {
      setText('')
      setWordIndex(0)
      setIsDeleting(false)
    }
    reset()
  }, [language])

  useEffect(() => {
    const word = words[wordIndex]
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
          setWordIndex((wordIndex + 1) % words.length)
        }
      }
    }, isDeleting ? 40 : 80)
    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex, words])

  return (
    <span className="text-blue-400">
      {text}<span className="animate-pulse text-blue-400/60">|</span>
    </span>
  )
}

function AnimatedCounter({ target, suffix = '' }) {
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

  const format = (n) => {
    if (target >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (target >= 1000) return (n / 1000).toFixed(0) + 'K'
    return n.toString()
  }

  return <span ref={ref}>{target >= 100 ? format(count) : count}{suffix}</span>
}

function ScoreRing({ language }) {
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

  const circumference = 2 * Math.PI * 54
  const strokeDasharray = `${((score - 300) / 550) * circumference} ${circumference}`
  const color = score >= 720 ? '#10b981' : score >= 650 ? '#3b82f6' : score >= 530 ? '#f59e0b' : '#ef4444'
  const scoreLabel = score >= 720
    ? (language === 'bm' ? 'Cemerlang' : 'Excellent')
    : score >= 650
      ? (language === 'bm' ? 'Baik' : 'Good')
      : score >= 530
        ? (language === 'bm' ? 'Sederhana' : 'Fair')
        : (language === 'bm' ? 'Membina' : 'Building')

  return (
    <div ref={ref} className="relative w-40 h-40 mx-auto">
      <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#1a1a1a" strokeWidth="6" />
        <circle
          cx="60" cy="60" r="54" fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.1s ease', filter: `drop-shadow(0 0 8px ${color}30)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tabular-nums tracking-tight" style={{ color }}>{score}</span>
        <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-widest">{language === 'bm' ? 'daripada 850' : 'out of 850'}</span>
        <span className="text-[10px] text-gray-600 mt-0.5">{scoreLabel}</span>
      </div>
    </div>
  )
}

function TechMarquee() {
  const doubled = [...techStack, ...techStack]
  return (
    <div className="overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#060606] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#060606] to-transparent z-10" />
      <motion.div
        className="flex gap-14 items-center"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((tech, i) => (
          <div key={i} className="flex items-center gap-2.5 shrink-0 opacity-40 hover:opacity-70 transition-opacity">
            <img src={tech.icon} alt={tech.name} className="w-6 h-6" loading="lazy" />
            <span className="text-xs text-gray-500 whitespace-nowrap font-medium">{tech.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function PipelineDemo({ t, language }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const PIPELINE_STEPS = language === 'bm' ? PIPELINE_STEPS_BM : PIPELINE_STEPS_EN

  useEffect(() => {
    const durations = [3000, 2500, 3500, 3500, 3000, 3500]
    const timeouts = []

    if (stepIndex < 5) {
      timeouts.push(setTimeout(() => {
        setShowResult(false)
        setStepIndex(s => s + 1)
      }, durations[stepIndex]))
    } else {
      timeouts.push(setTimeout(() => setShowResult(true), 0))
      timeouts.push(setTimeout(() => {
        setShowResult(false)
        setStepIndex(0)
      }, 4000))
    }
    return () => timeouts.forEach(clearTimeout)
  }, [stepIndex])

  return (
    <div className="bg-[#0c0c0c] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06]">
        <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <span className="ml-3 text-[11px] text-gray-600 font-mono">{language === 'bm' ? 'saluran-pemarkahan-kredit' : 'credit-scoring-pipeline'}</span>
        <motion.div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5 mb-5">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-all duration-300 ${
                  i < stepIndex ? 'text-emerald-400/80' :
                  i === stepIndex ? 'text-white bg-white/[0.06]' :
                  'text-gray-600'
                }`}
              >
                <span>{step.icon}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <div className={`w-4 h-px mx-0.5 transition-colors duration-300 ${i < stepIndex ? 'bg-emerald-500/40' : 'bg-white/[0.04]'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={`step-${stepIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-20 flex items-center justify-center"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-4 h-4 border-2 border-blue-500/60 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                <span className="text-sm text-gray-400">{PIPELINE_STEPS[stepIndex].label}...</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="h-20 flex flex-col items-center justify-center"
            >
              <span className="text-3xl font-bold text-white tabular-nums">712</span>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 rounded">{t('landingPipelineGoodRisk')}</span>
                <span className="px-2 py-0.5 text-[10px] font-medium text-blue-400 bg-blue-500/10 rounded">{t('landingPipelineTips')}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Section Wrapper ─────────────────────────────────────────────────────────

function Section({ children, className = '', id }) {
  return (
    <section id={id} className={`relative z-10 max-w-6xl mx-auto px-6 ${className}`}>
      {children}
    </section>
  )
}

function SectionLabel({ children }) {
  return (
    <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400/80 mb-4">
      {children}
    </span>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()

  const localizedNavLinks = [
    { label: t('landingNavFeatures'), href: '/features', isRoute: true },
    { label: t('landingNavHowItWorks'), href: '/how-it-works', isRoute: true },
    { label: t('landingNavSimulator'), href: '/simulation', isRoute: true },
    { label: t('landingNavAI'), href: '/ai', isRoute: true },
  ]

  return (
    <div className="min-h-screen bg-[#060606] text-white">

      {/* ─── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="relative z-40 backdrop-blur-md bg-[#060606]/90 sticky top-0 border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight">Score<span className="text-blue-400">Ku</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-[13px] text-gray-500">
            {localizedNavLinks.map((link) => (
              link.isRoute ? (
                <Link key={link.href} to={link.href} className="hover:text-white transition-colors">{link.label}</Link>
              ) : (
                <a key={link.href} href={link.href} className="hover:text-white transition-colors">{link.label}</a>
              )
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={toggleLanguage}
              className="h-8 px-2.5 rounded-md text-[11px] font-medium text-gray-500 hover:text-white border border-white/[0.06] hover:border-white/[0.12] transition-all flex items-center gap-1.5"
            >
              <Languages size={12} />
              <span className={language === 'en' ? 'text-white' : ''}>{language === 'en' ? 'EN' : 'BM'}</span>
            </button>
            <Link to="/login" className="h-8 px-3.5 rounded-md text-[13px] text-gray-400 hover:text-white border border-white/[0.06] hover:border-white/[0.12] transition-all inline-flex items-center">
              {t('landingLogin')}
            </Link>
            <Link to="/register" className="h-8 px-4 rounded-md text-[13px] font-medium bg-blue-600 hover:bg-blue-500 transition-colors inline-flex items-center">
              {t('landingSignUp')}
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-gray-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <XIcon size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/[0.04] bg-[#060606]/95 backdrop-blur-xl"
            >
              <div className="px-6 py-4 space-y-1">
                {localizedNavLinks.map((link) => (
                  link.isRoute ? (
                    <Link key={link.href} to={link.href} className="block text-gray-400 hover:text-white py-2.5 text-sm" onClick={() => setMobileMenuOpen(false)}>{link.label}</Link>
                  ) : (
                    <a key={link.href} href={link.href} className="block text-gray-400 hover:text-white py-2.5 text-sm" onClick={() => setMobileMenuOpen(false)}>{link.label}</a>
                  )
                ))}
                <div className="flex items-center gap-2.5 pt-4 border-t border-white/[0.04]">
                  <button onClick={toggleLanguage} className="h-9 px-3 rounded-md text-xs font-medium border border-white/[0.06] flex items-center gap-1.5">
                    <Languages size={12} className="text-gray-400" />
                    <span className={language === 'en' ? 'text-white' : 'text-gray-500'}>EN</span>
                    <span className="text-gray-700">/</span>
                    <span className={language === 'bm' ? 'text-white' : 'text-gray-500'}>BM</span>
                  </button>
                  <Link to="/login" className="flex-1 text-center h-9 rounded-md text-sm border border-white/[0.06] inline-flex items-center justify-center">{t('landingLogin')}</Link>
                  <Link to="/register" className="flex-1 text-center h-9 rounded-md text-sm bg-blue-600 font-medium inline-flex items-center justify-center">{t('landingSignUp')}</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 sm:pt-32 pb-32 sm:pb-40">
        {/* Subtle background glow — single, controlled */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/[0.04] rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

        <div className="relative grid lg:grid-cols-5 gap-16 items-center">
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm text-gray-500 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {t('landingHeroBadge')}
            </p>

            <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.08] tracking-tight mb-6">
              {language === 'en' ? (
                <>
                  Your Financial<br />
                  Identity, <span className="text-blue-400">Reimagined</span>
                </>
              ) : (
                <>
                  Identiti Kewangan<br />
                  Anda, <span className="text-blue-400">Dicipta Semula</span>
                </>
              )}
            </h1>

            <p className="text-lg text-gray-400 mb-2 leading-relaxed">
              {t('landingHeroScoring')} <TypeWriter language={language} />
            </p>
            <p className="text-[15px] text-gray-600 max-w-lg mb-10 leading-relaxed">
              {t('landingHeroSubtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <Link
                to="/register"
                className="group h-12 px-7 bg-blue-600 hover:bg-blue-500 rounded-lg text-[15px] font-medium transition-colors inline-flex items-center gap-2"
              >
                {t('landingGetStarted')}
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="h-12 px-7 border border-white/[0.08] hover:border-white/[0.16] rounded-lg text-[15px] text-gray-400 hover:text-white transition-all inline-flex items-center"
              >
                {t('landingLearnMore')}
              </a>
            </div>

            <Link to="/dashboard?demo=true" className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-blue-400 transition-colors group">
              <Eye size={13} /> {t('landingTryDemo')} <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <div className="flex items-center gap-3 mt-10 pt-8 border-t border-white/[0.04]">
              <span className="text-[11px] text-gray-600 uppercase tracking-wider">{t('landingPoweredBy')}</span>
              <div className="flex gap-2">
                {poweredBy.map((item) => (
                  <span key={item.name} className="text-[11px] text-gray-500 px-2.5 py-1 bg-white/[0.03] border border-white/[0.04] rounded-md">
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-2 hidden lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="bg-[#0c0c0c] border border-white/[0.06] rounded-2xl p-8">
              <p className="text-[11px] text-gray-600 uppercase tracking-wider text-center mb-6">{t('landingYourAltScore')}</p>
              <ScoreRing language={language} />

              <div className="mt-8 space-y-4">
                {[
                  { label: t('landingPaymentConsistency'), value: 85, color: '#14b8a6' },
                  { label: t('landingDigitalActivity'), value: 72, color: '#3b82f6' },
                  { label: t('landingIncomeStability'), value: 68, color: '#8b5cf6' },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-[12px] mb-1.5">
                      <span className="text-gray-500">{bar.label}</span>
                      <span className="text-gray-400 tabular-nums font-medium">{bar.value}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.value}%` }}
                        transition={{ delay: 2, duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: bar.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Problem + Stats ────────────────────────────────────────────────── */}
      <div className="bg-[#0a0a0a] border-y border-white/[0.03]">
        <Section className="py-24 sm:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={reveal}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <SectionLabel>{t('landingProblemBadge')}</SectionLabel>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <AnimatedCounter target={3500000} /> {t('landingProblemHeadMid')}{' '}
              <span className="text-red-400">{t('landingProblemHeadEnd')}</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-[15px] leading-relaxed">
              {t('landingProblemDesc')}
            </p>
          </motion.div>

          {/* Stats inline */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto mb-20"
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={reveal} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white tabular-nums mb-1">
                  {stat.display === '3.5M' && <AnimatedCounter target={3500000} />}
                  {stat.display === '89%' && <><AnimatedCounter target={89} suffix="%" /></>}
                  {stat.display === '10K+' && <><AnimatedCounter target={10000} suffix="+" /></>}
                </div>
                <div className="text-[12px] sm:text-[13px] text-gray-600">{t(stat.labelKey)}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Comparison cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto"
          >
            <motion.div variants={reveal} className="p-6 sm:p-8 rounded-xl border border-white/[0.04] bg-[#0c0c0c]">
              <div className="flex items-center gap-2.5 mb-5">
                <X size={16} className="text-red-400/80" />
                <h3 className="text-[15px] font-semibold text-red-400/90">{t('landingCompTraditional')}</h3>
              </div>
              <ul className="space-y-3">
                {[t('landingCompTrad1'), t('landingCompTrad2'), t('landingCompTrad3'), t('landingCompTrad4'), t('landingCompTrad5')].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-gray-500">
                    <X size={13} className="text-red-400/40 mt-0.5 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={reveal} className="p-6 sm:p-8 rounded-xl border border-blue-500/10 bg-[#0c0c0c] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.03] to-transparent pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2.5 mb-5">
                  <CheckCircle2 size={16} className="text-blue-400" />
                  <h3 className="text-[15px] font-semibold text-blue-400">ScoreKu</h3>
                </div>
                <ul className="space-y-3">
                  {[t('landingCompSk1'), t('landingCompSk2'), t('landingCompSk3'), t('landingCompSk4'), t('landingCompSk5')].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-gray-400">
                      <CheckCircle2 size={13} className="text-blue-400/70 mt-0.5 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </Section>
      </div>

      {/* ─── Pipeline Demo ──────────────────────────────────────────────────── */}
      <Section className="py-24 sm:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={reveal}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <SectionLabel>{language === 'bm' ? 'Demo Langsung' : 'Live Demo'}</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">{t('landingPipelineTitle')}</h2>
            <p className="text-[14px] text-gray-500">{t('landingPipelineSubtitle')}</p>
          </div>
          <PipelineDemo t={t} language={language} />
        </motion.div>
      </Section>

      {/* ─── Features ───────────────────────────────────────────────────────── */}
      <Section id="features" className="pb-24 sm:pb-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={reveal}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <SectionLabel>{language === 'bm' ? 'Ciri-ciri' : 'Features'}</SectionLabel>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{t('landingFeaturesTitle')}</h2>
              <p className="text-[14px] text-gray-500 max-w-md">{t('landingFeaturesSubtitle')}</p>
            </div>
            <Link to="/features" className="inline-flex items-center gap-1 text-[13px] text-blue-400 hover:text-blue-300 transition-colors shrink-0">
              {t('landingFeaturesSeeAll')} <ArrowRight size={13} />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.04]"
        >
          {features.map((f, i) => {
            const titleKey = `landingFeature${i + 1}Title`
            const descKey = `landingFeature${i + 1}Desc`
            return (
              <motion.div
                key={i}
                variants={reveal}
                className="bg-[#060606] p-6 sm:p-7 hover:bg-[#0a0a0a] transition-colors group"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${f.accent}12`, border: `1px solid ${f.accent}20` }}
                >
                  <f.icon className="w-[18px] h-[18px]" style={{ color: f.accent }} />
                </div>
                <h3 className="text-[15px] font-semibold mb-1.5 tracking-tight">{t(titleKey)}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{t(descKey)}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </Section>

      {/* ─── How It Works ───────────────────────────────────────────────────── */}
      <div className="bg-[#0a0a0a] border-y border-white/[0.03]">
        <Section id="how-it-works" className="py-24 sm:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={reveal}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <SectionLabel>{language === 'bm' ? 'Cara Ia Berfungsi' : 'How It Works'}</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">{t('landingHowItWorksTitle')}</h2>
            <p className="text-[14px] text-gray-500">{t('landingHowItWorksSubtitle')}</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-3xl mx-auto space-y-6"
          >
            {howItWorks.map((item, i) => {
              const stepTitleKey = `landingStep${i + 1}Title`
              const stepDescKey = `landingStep${i + 1}Desc`
              const stepDetailKey = `landingStep${i + 1}Detail`
              return (
                <motion.div
                  key={i}
                  variants={reveal}
                  className="flex items-start gap-5 sm:gap-6"
                >
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                    {i < howItWorks.length - 1 && (
                      <div className="w-px h-12 bg-white/[0.06] mt-2" />
                    )}
                  </div>
                  <div className="pt-1.5 pb-4">
                    <div className="flex items-center gap-2.5 mb-1">
                      <item.icon size={16} className="text-blue-400/70" />
                      <h3 className="text-[15px] font-semibold">{t(stepTitleKey)}</h3>
                    </div>
                    <p className="text-[13px] text-gray-500 leading-relaxed mb-2">{t(stepDescKey)}</p>
                    <span className="text-[11px] text-gray-600 bg-white/[0.03] border border-white/[0.04] px-2.5 py-1 rounded-md">{t(stepDetailKey)}</span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          <div className="text-center mt-10">
            <Link to="/how-it-works" className="inline-flex items-center gap-1 text-[13px] text-blue-400 hover:text-blue-300 transition-colors">
              {t('landingHowSeeAll')} <ArrowRight size={13} />
            </Link>
          </div>
        </Section>
      </div>

      {/* ─── Use Cases ──────────────────────────────────────────────────────── */}
      <Section className="py-24 sm:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={reveal}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <SectionLabel>{language === 'bm' ? 'Kes Penggunaan' : 'Use Cases'}</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">{t('landingUseCasesTitle')}</h2>
          <p className="text-[14px] text-gray-500">{t('landingUseCasesSubtitle')}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {useCases.map((uc, i) => (
            <motion.div
              key={i}
              variants={reveal}
              className="p-5 rounded-xl border border-white/[0.04] bg-[#0c0c0c] hover:border-white/[0.08] transition-all group"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${uc.accent}10`, border: `1px solid ${uc.accent}18` }}
              >
                <uc.icon className="w-[18px] h-[18px]" style={{ color: uc.accent }} />
              </div>
              <h3 className="text-[14px] font-semibold mb-1 tracking-tight">{t(`landingUc${i + 1}Title`)}</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed">{t(`landingUc${i + 1}Desc`)}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ─── Tech Marquee ───────────────────────────────────────────────────── */}
      <Section className="pb-24 sm:pb-32">
        <div className="text-center mb-8">
          <p className="text-[11px] text-gray-600 uppercase tracking-widest">{t('landingTechSubtitle')}</p>
        </div>
        <TechMarquee />
      </Section>

      {/* ─── BNM Alignment ──────────────────────────────────────────────────── */}
      <div className="bg-[#0a0a0a] border-y border-white/[0.03]">
        <Section className="py-24 sm:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={reveal}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2.5 mb-5">
                <Shield size={16} className="text-blue-400/70" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400/80">{t('landingBnmBadge')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                {t('landingBnmTitle')}
              </h2>
              <p className="text-[14px] text-gray-500 max-w-2xl mb-10 leading-relaxed">
                {t('landingBnmDesc')}
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {[1, 2, 3, 4].map((n) => (
                  <motion.div
                    key={n}
                    className="p-4 rounded-xl bg-[#0c0c0c] border border-white/[0.04]"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (n - 1) * 0.08 }}
                  >
                    <h4 className="text-[13px] font-semibold mb-1">{t(`landingBnm${n}Title`)}</h4>
                    <p className="text-[12px] text-gray-600 leading-relaxed">{t(`landingBnm${n}Desc`)}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'landingBnmBadge1', color: 'blue' },
                  { key: 'landingBnmBadge2', color: 'blue' },
                  { key: 'landingBnmBadge3', color: 'blue' },
                  { key: 'landingBnmBadge4', color: 'blue' },
                ].map((badge) => (
                  <span key={badge.key} className="px-2.5 py-1 text-[11px] text-gray-500 bg-white/[0.03] border border-white/[0.04] rounded-md font-medium">
                    {t(badge.key)}
                  </span>
                ))}
              </div>

              <p className="text-[10px] text-gray-700 mt-6">{t('landingBnmSources')}</p>
            </div>
          </motion.div>
        </Section>
      </div>

      {/* ─── Learn Section ──────────────────────────────────────────────────── */}
      <Section id="learn" className="py-24 sm:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={reveal}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <SectionLabel>{t('learnHeroLabel')}</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            {t('learnHeroTitle1')} <span className="text-blue-400">{t('learnHeroTitle2')}</span>
          </h2>
          <p className="text-[14px] text-gray-500 max-w-md mx-auto">{t('learnHeroDesc')}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-3 gap-3 mb-10 max-w-lg mx-auto"
        >
          {[
            { value: '8', label: t('learnStat1Label'), suffix: '' },
            { value: '5', label: t('learnStat2Label'), suffix: '' },
            { value: '100', label: t('learnStat3Label'), suffix: '%' },
          ].map((stat, i) => (
            <motion.div key={i} variants={reveal} className="text-center p-3 rounded-lg border border-white/[0.04] bg-white/[0.02]">
              <div className="text-xl font-bold text-white">{stat.value}{stat.suffix}</div>
              <div className="text-[10px] text-gray-600 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.a
          href="/learn"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={reveal}
          className="group flex flex-col sm:flex-row gap-4 p-5 rounded-xl border border-blue-500/10 bg-blue-500/[0.03] hover:border-blue-500/20 transition-all mb-5 block"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-2xl">
            📊
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-medium">{t('learnFeaturedTag')}</span>
              <span className="text-[10px] text-gray-600">5 min</span>
            </div>
            <h3 className="text-[14px] font-semibold group-hover:text-blue-400 transition-colors">{t('learnA1Title')}</h3>
            <p className="text-[12px] text-gray-500 mt-0.5">{t('learnA1Sub')}</p>
          </div>
          <div className="flex items-center text-blue-400 text-[12px] font-medium gap-0.5 sm:self-center shrink-0">
            Read <ChevronRight size={12} />
          </div>
        </motion.a>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10"
        >
          {[
            { emoji: '🏗️', title: t('learnA2Title'), desc: t('learnA2Sub'), tag: t('beginner'), time: '8 min' },
            { emoji: '💳', title: t('learnA3Title'), desc: t('learnA3Sub'), tag: 'Tips', time: '4 min' },
            { emoji: '🚗', title: t('learnA4Title'), desc: t('learnA4Sub'), tag: 'Tips', time: '7 min' },
            { emoji: '⚠️', title: t('learnA5Title'), desc: t('learnA5Sub'), tag: language === 'bm' ? 'Kewangan' : 'Finance', time: '7 min' },
            { emoji: '🕌', title: t('learnA6Title'), desc: t('learnA6Sub'), tag: language === 'bm' ? 'Kewangan' : 'Finance', time: '6 min' },
            { emoji: '🏛️', title: t('learnA7Title'), desc: t('learnA7Sub'), tag: language === 'bm' ? 'Kewangan' : 'Finance', time: '8 min' },
          ].map((article, i) => (
            <motion.a
              key={i}
              href="/learn"
              variants={reveal}
              className="group p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer block"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-base flex-shrink-0">
                  {article.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400/80 font-medium">{article.tag}</span>
                    <span className="text-[9px] text-gray-700">{article.time}</span>
                  </div>
                  <h3 className="text-[13px] font-semibold mb-0.5 group-hover:text-blue-400 transition-colors leading-snug">{article.title}</h3>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{article.desc}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <div className="text-center">
          <a href="/learn" className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-[13px] font-medium inline-flex items-center gap-1.5 transition-colors">
            {t('learnViewAll')} <ArrowRight size={13} />
          </a>
          <p className="text-[11px] text-gray-700 mt-3">{t('learnFree')}</p>
        </div>
      </Section>

      {/* ─── CTA ────────────────────────────────────────────────────────────── */}
      <Section className="pb-24 sm:pb-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={reveal}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center py-16 sm:py-20 px-8 rounded-2xl border border-white/[0.04] bg-[#0a0a0a] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/[0.04] to-transparent pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              {t('landingCtaTitle')}
            </h2>
            <p className="text-[14px] text-gray-500 max-w-md mx-auto mb-8">
              {t('landingCtaSubtitle')}
            </p>
            <Link
              to="/register"
              className="group h-12 px-8 bg-blue-600 hover:bg-blue-500 rounded-lg text-[15px] font-medium transition-colors inline-flex items-center gap-2"
            >
              {t('landingCtaButton')}
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </Section>

      {/* ─── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
                  <Zap size={12} className="text-white" />
                </div>
                <span className="text-sm font-semibold">Score<span className="text-blue-400">Ku</span></span>
              </div>
              <p className="text-[12px] text-gray-600 leading-relaxed">
                {t('landingFooterDesc')}
              </p>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold text-gray-400 mb-3 uppercase tracking-wider">{t('landingFooterProduct')}</h4>
              <ul className="space-y-2 text-[13px] text-gray-600">
                <li><a href="#features" className="hover:text-white transition-colors">{t('landingFooterFeatures')}</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">{t('landingFooterHowItWorks')}</a></li>
                <li><Link to="/simulation" className="hover:text-white transition-colors">{t('landingFooterSimulator')}</Link></li>
                <li><Link to="/ai" className="hover:text-white transition-colors">{t('landingFooterAI')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold text-gray-400 mb-3 uppercase tracking-wider">{t('landingFooterCompany')}</h4>
              <ul className="space-y-2 text-[13px] text-gray-600">
                <li><a href="#" className="hover:text-white transition-colors">{t('landingFooterAbout')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('landingFooterBlog')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('landingFooterContact')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold text-gray-400 mb-3 uppercase tracking-wider">{t('landingFooterLegal')}</h4>
              <ul className="space-y-2 text-[13px] text-gray-600">
                <li><a href="#" className="hover:text-white transition-colors">{t('landingFooterPrivacy')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('landingFooterTerms')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('landingFooterPdpa')}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.04] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-gray-700">{t('landingFooterCopyright')}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-700">
              <Lock size={10} /> {t('landingFooterEncryption')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
