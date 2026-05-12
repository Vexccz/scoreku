import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import {
  Shield, TrendingUp, Smartphone, BarChart3, Zap, Users, ArrowRight, ArrowUpRight,
  CheckCircle2, X, Sparkles, Globe, Lock, ChevronDown, Menu, XIcon,
  Wallet, Brain, Clock, Target, Lightbulb, Eye, Car, GraduationCap,
  Store, MapPin, Plus, Minus, Languages, CircleDollarSign, LineChart,
  PieChart, ShieldCheck, Activity, TrendingDown, Star
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

// ─── Brand mark ──────────────────────────────────────────────────────────────

function BrandMark({ size = 28 }) {
  return (
    <div
      className="relative rounded-[10px] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(16,185,129,0.5)]"
      style={{ width: size, height: size }}
    >
      <Shield size={Math.round(size * 0.55)} className="text-black" strokeWidth={2.5} />
    </div>
  )
}

// ─── Data ────────────────────────────────────────────────────────────────────

const navLinks = [
  { label: 'Features', href: '/features', isRoute: true },
  { label: 'How it Works', href: '/how-it-works', isRoute: true },
  { label: 'Simulator', href: '/simulation', isRoute: true },
  { label: 'AI Model', href: '/ai', isRoute: true },
  { label: 'Learn', href: '/learn', isRoute: true },
]

const typingWordsEn = ['gig workers', 'fresh graduates', 'small traders', 'rural communities']
const typingWordsBm = ['pekerja gig', 'graduan baru', 'peniaga kecil', 'komuniti luar bandar']

const poweredBy = [
  { name: 'DuitNow' },
  { name: "Touch 'n Go" },
  { name: 'Shopee' },
  { name: 'GrabPay' },
  { name: 'BigPay' },
  { name: 'Boost' },
]

const stats = [
  { value: '3.5M', label: 'Unbanked Malaysians', sub: 'potential users' },
  { value: '89.1%', label: 'Model Accuracy', sub: 'AUC-ROC 91.4%' },
  { value: '< 5s', label: 'Score Generation', sub: 'real-time inference' },
  { value: '40+', label: 'Features Analyzed', sub: 'alternative signals' },
]

const features = [
  {
    icon: Wallet,
    title: 'Alternative Data',
    desc: 'E-wallet transactions, bill payments, and digital footprint replace traditional bank history.',
  },
  {
    icon: Brain,
    title: 'Explainable AI',
    desc: 'SHAP values reveal exactly which factors drive your score, so nothing is hidden.',
  },
  {
    icon: Activity,
    title: 'Real-Time Scoring',
    desc: 'Sub-five-second inference. No waiting days for legacy bank processing to complete.',
  },
  {
    icon: Target,
    title: 'Product Matching',
    desc: 'Surface loans, cards, and financing products you actually qualify for today.',
  },
  {
    icon: Lightbulb,
    title: 'Improvement Tips',
    desc: 'Personalized recommendations derived from your own spending and payment patterns.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy First',
    desc: 'Bank-grade encryption. We never sell your data. You control what gets shared.',
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'Connect your data',
    desc: 'Link e-wallets, bill payments, and employment info securely.',
    meta: 'DuitNow · TnG · Shopee · GrabPay',
  },
  {
    step: '02',
    title: 'AI analyzes',
    desc: 'XGBoost processes 40+ features while SHAP generates explanations.',
    meta: 'Processing in under 5 seconds',
  },
  {
    step: '03',
    title: 'Get your score',
    desc: 'Receive a CTOS-aligned score with full breakdown and improvement tips.',
    meta: 'Score · Drivers · Next steps',
  },
]

const comparisonData = {
  traditional: [
    'Requires bank account and credit history',
    'Excludes 3.5 million Malaysians',
    'Three to five business days processing',
    'Opaque, no explanation provided',
    'RM50-100 per report',
  ],
  scoreku: [
    'Uses digital footprint and e-wallet data',
    'Inclusive, anyone with a smartphone qualifies',
    'Instant results in under five seconds',
    'SHAP-powered explainability',
    'Free for individual users',
  ],
}

const useCases = [
  {
    icon: Car,
    title: 'Gig Workers',
    desc: 'Grab, Foodpanda, and Lalamove drivers with consistent digital earnings but no payslip.',
  },
  {
    icon: GraduationCap,
    title: 'Fresh Graduates',
    desc: 'Recently entered the workforce with no credit history but active digital lives.',
  },
  {
    icon: Store,
    title: 'Micro-Entrepreneurs',
    desc: 'Pasar malam sellers and online shop owners with rich Shopee and TnG activity.',
  },
  {
    icon: MapPin,
    title: 'Rural Communities',
    desc: 'Limited bank access but growing mobile payment adoption across states.',
  },
]

const faqData = [
  { q: 'What data does ScoreKu use?', a: 'ScoreKu analyzes e-wallet transactions (DuitNow, TnG, GrabPay), bill payment history, employment data, and digital activity patterns. We never access your bank account directly.' },
  { q: 'How accurate is the AI model?', a: 'The XGBoost model reaches 89.1% accuracy with an AUC-ROC of 91.4%, trained on 10,000 synthetic Malaysian profiles. The model is continuously improved while maintaining fairness across demographics.' },
  { q: 'Is my data safe?', a: 'Yes. We use bank-grade AES-256 encryption, never sell data to third parties, and allow complete data deletion on request. The platform is built to comply with PDPA Malaysia.' },
  { q: 'Who can use ScoreKu?', a: 'Anyone in Malaysia with a smartphone and at least one e-wallet or digital payment account. No bank account required, no minimum income, no credit history needed.' },
  { q: 'How is this different from CCRIS or CTOS?', a: 'CCRIS and CTOS only track formal banking relationships. If you have never held a bank loan or credit card, you remain invisible to them. ScoreKu uses alternative digital data to score the unscored.' },
  { q: 'Is it free?', a: 'Yes, completely free for individuals. The long-term plan is to monetize through partnerships with financial institutions that want to reach underserved segments.' },
  { q: 'How long does scoring take?', a: 'A score is generated in under five seconds once data is submitted. The model returns a result instantly along with SHAP explanations and actionable improvement tips.' },
  { q: 'Can gig workers use ScoreKu?', a: 'ScoreKu was designed with gig workers in mind. DuitNow earnings, e-wallet activity, and consistent digital payments all contribute to the score, even without a formal payslip.' },
  { q: 'How can I improve my score quickly?', a: 'The fastest gains come from paying all bills on time for three or more months, increasing DuitNow and e-wallet transaction frequency, and maintaining stable income flow. Users typically see 20 to 40 point improvements within three months.' },
  { q: 'Does ScoreKu work with Islamic banking products?', a: 'Yes. The score is compatible with both conventional and Shariah-compliant products. Partner institutions can apply ScoreKu results regardless of whether they offer conventional or Islamic financing such as Murabahah or Musharakah.' },
]

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

// ─── Utility Components ──────────────────────────────────────────────────────

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 origin-left z-50"
      style={{ scaleX }}
    />
  )
}

function TypeWriter({ language }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const words = language === 'bm' ? typingWordsBm : typingWordsEn

  useEffect(() => {
    setText('')
    setWordIndex(0)
    setIsDeleting(false)
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
          setWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, isDeleting ? 40 : 90)
    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex, words])

  return (
    <span className="inline-flex items-baseline text-emerald-400">
      {text}
      <motion.span
        className="ml-0.5 inline-block w-[3px] h-[0.85em] bg-emerald-400 translate-y-[2px]"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.9, repeat: Infinity }}
      />
    </span>
  )
}

// Animated score gauge — hero centerpiece
function ScoreGauge() {
  const [score, setScore] = useState(300)
  useEffect(() => {
    const target = 782
    const start = Date.now()
    const duration = 2200
    const frame = () => {
      const elapsed = Date.now() - start
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setScore(Math.round(300 + (target - 300) * eased))
      if (t < 1) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  const pct = (score - 300) / (850 - 300)
  const circumference = 2 * Math.PI * 90
  const dash = circumference * pct

  const band =
    score >= 770 ? { label: 'Excellent', color: '#10b981' } :
    score >= 700 ? { label: 'Very Good', color: '#14b8a6' } :
    score >= 650 ? { label: 'Good', color: '#eab308' } :
    score >= 600 ? { label: 'Fair', color: '#f97316' } :
    { label: 'Poor', color: '#ef4444' }

  return (
    <div className="relative w-[280px] h-[280px]">
      <svg viewBox="0 0 220 220" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <circle cx="110" cy="110" r="90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        <motion.circle
          cx="110" cy="110" r="90" fill="none"
          stroke="url(#gaugeGrad)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${dash} ${circumference}` }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: 'drop-shadow(0 0 12px rgba(16,185,129,0.4))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs tracking-[0.25em] uppercase text-white/40 font-medium">Credit Score</span>
        <div className="mt-2 text-6xl font-semibold text-white tabular-nums tracking-tight">{score}</div>
        <div className="mt-1 text-xs text-white/40 tabular-nums">/ 850</div>
        <div
          className="mt-3 px-3 py-1 rounded-full text-xs font-medium border"
          style={{ color: band.color, borderColor: `${band.color}40`, backgroundColor: `${band.color}10` }}
        >
          {band.label}
        </div>
      </div>
    </div>
  )
}

// Floating side cards beside the gauge
function FloatingMetricCard({ icon: Icon, label, value, trend, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute bg-[#0e0e0e]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl px-4 py-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Icon size={16} className="text-emerald-400" />
        </div>
        <div>
          <div className="text-[10px] tracking-widest uppercase text-white/40">{label}</div>
          <div className="text-sm font-semibold text-white tabular-nums">{value}</div>
        </div>
        {trend && (
          <div className="ml-2 flex items-center gap-1 text-emerald-400 text-xs font-medium">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Sections ────────────────────────────────────────────────────────────────

function Navbar({ language, setLanguage }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all ${scrolled ? 'bg-black/70 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white font-semibold tracking-tight">
          <BrandMark size={28} />
          <span>ScoreKu</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              className="px-3 py-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'bm' : 'en')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 rounded-full transition-colors"
          >
            <Languages size={13} />
            {language === 'en' ? 'EN' : 'BM'}
          </button>
          <Link
            to="/login"
            className="hidden sm:flex items-center px-4 py-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium bg-white text-black rounded-full hover:bg-white/90 transition-colors"
          >
            Get started
            <ArrowRight size={14} />
          </Link>
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden text-white p-1">
            {open ? <XIcon size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-black border-t border-white/[0.06]"
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5"
                >
                  {l.label}
                </Link>
              ))}
              <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-white/70">
                Sign in
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

function Hero({ language }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Noise + grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        {/* Glow orbs */}
        <motion.div
          className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[160px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
        {/* Left — copy */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.035em] text-white leading-[1.02]">
            Credit scoring,{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                reimagined
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <motion.path
                  d="M2 8 Q 150 0, 298 8"
                  stroke="url(#underline)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="underline" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <br />
            for <TypeWriter language={language} />
          </motion.h1>

          <motion.p variants={fadeInUp} className="mt-6 text-lg text-white/60 max-w-xl leading-relaxed">
            An alternative credit score built for the 3.5 million Malaysians excluded from traditional banking. Powered by explainable AI and your real digital footprint.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/score"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all"
            >
              Check your score
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 text-white/80 border border-white/15 hover:border-white/30 hover:text-white rounded-full font-medium transition-all"
            >
              How it works
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-10 flex items-center gap-4 text-xs text-white/40">
            <div className="flex -space-x-2">
              {['#10b981', '#f59e0b', '#6366f1', '#ec4899'].map((c, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-black"
                  style={{ background: `linear-gradient(135deg, ${c}, ${c}aa)` }}
                />
              ))}
            </div>
            <span>Trusted by researchers, analysts, and fintech partners</span>
          </motion.div>
        </motion.div>

        {/* Right — score gauge centerpiece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center"
        >
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl scale-110" />
            {/* Card backdrop */}
            <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.08] rounded-[32px] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
              <ScoreGauge />
            </div>

            {/* Floating metric cards */}
            <FloatingMetricCard
              icon={CircleDollarSign}
              label="Income"
              value="RM 3,400"
              trend="+12%"
              delay={1.2}
              className="-left-16 top-8 hidden sm:block"
            />
            <FloatingMetricCard
              icon={LineChart}
              label="Bill payments"
              value="On time"
              delay={1.5}
              className="-right-12 top-24 hidden sm:block"
            />
            <FloatingMetricCard
              icon={PieChart}
              label="E-wallet activity"
              value="Active"
              delay={1.8}
              className="-left-8 bottom-8 hidden sm:block"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function PoweredByBar() {
  return (
    <section className="relative py-12 border-y border-white/[0.06] bg-black/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center text-[11px] tracking-[0.3em] uppercase text-white/40 mb-6">
          Compatible with Malaysian digital payments
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {poweredBy.map((p) => (
            <div key={p.name} className="text-white/30 hover:text-white/60 transition-colors text-sm font-medium tracking-wide">
              {p.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeInUp}
              className="bg-[#0a0a0a] p-8 hover:bg-[#111] transition-colors"
            >
              <div className="text-4xl sm:text-5xl font-semibold text-white tracking-tight tabular-nums">{s.value}</div>
              <div className="mt-3 text-sm text-white/70 font-medium">{s.label}</div>
              <div className="mt-1 text-xs text-white/40">{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function SectionHeading({ eyebrow, title, desc }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={staggerContainer}
      className="max-w-2xl mb-14"
    >
      <motion.div variants={fadeInUp} className="text-[11px] tracking-[0.3em] uppercase text-emerald-400 font-medium mb-4">
        {eyebrow}
      </motion.div>
      <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-semibold tracking-[-0.03em] text-white leading-[1.05]">
        {title}
      </motion.h2>
      {desc && (
        <motion.p variants={fadeInUp} className="mt-5 text-lg text-white/60 leading-relaxed">
          {desc}
        </motion.p>
      )}
    </motion.div>
  )
}

function Features() {
  return (
    <section className="relative py-28">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="What's inside"
          title="Built for transparency and inclusion"
          desc="Every technical choice, from the model architecture to the explanations, is designed to give underserved users a fair shot at credit."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeInUp}
              className="group relative bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-7 hover:border-emerald-500/30 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-5 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/5 transition-colors">
                  <f.icon size={20} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function AnimatedScorePipeline() {
  const [active, setActive] = useState(-1)
  const [running, setRunning] = useState(false)
  const containerRef = useRef(null)
  const hasStartedRef = useRef(false)

  const phases = [
    {
      label: 'Connect data',
      icon: Wallet,
      sub: 'E-wallets, bills, employment',
      output: '40+ signals ingested',
      duration: 2200,
    },
    {
      label: 'Feature engineering',
      icon: LineChart,
      sub: 'Spending patterns, payment regularity, velocity',
      output: 'Feature vector ready',
      duration: 2400,
    },
    {
      label: 'XGBoost inference',
      icon: Brain,
      sub: 'Gradient boosted trees produce a probability',
      output: 'P(default) = 0.14',
      duration: 2200,
    },
    {
      label: 'SHAP explainer',
      icon: Eye,
      sub: 'Per-feature attribution, positive and negative drivers',
      output: '6 top drivers isolated',
      duration: 2400,
    },
    {
      label: 'Score + next steps',
      icon: Target,
      sub: 'Map to CTOS band, generate personalized tips',
      output: 'Score 742 · Grade B',
      duration: 2000,
    },
  ]

  const start = () => {
    if (running) return
    setRunning(true)
    setActive(0)
  }

  useEffect(() => {
    if (!running) return
    if (active >= phases.length) {
      const t = setTimeout(() => {
        setRunning(false)
        setActive(-1)
        hasStartedRef.current = false
      }, 3000)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setActive((a) => a + 1), phases[active].duration)
    return () => clearTimeout(t)
  }, [active, running])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true
          start()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {/* Input card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto mb-3"
      >
        <div className="relative bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
              <Smartphone size={16} className="text-white/70" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-medium mb-1">Applicant</div>
              <div className="text-sm text-white font-medium leading-snug">
                Aminah · Gig worker · No bank history
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] tracking-wider uppercase text-white/40">Monthly flow</div>
              <div className="text-sm font-mono text-emerald-400">RM 3,200</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center">
        <motion.div
          className="w-px bg-gradient-to-b from-emerald-500/70 to-transparent h-6"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: active >= 0 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ originY: 0 }}
        />
      </div>

      {/* Pipeline column */}
      <div className="relative max-w-2xl mx-auto space-y-3">
        <div className="absolute left-6 top-6 bottom-6 w-px bg-white/[0.08] hidden sm:block" />
        <motion.div
          className="absolute left-6 top-6 w-px bg-emerald-500 hidden sm:block"
          initial={{ height: 0 }}
          animate={{
            height:
              active < 0
                ? 0
                : active >= phases.length
                ? '100%'
                : `${((active + 1) / phases.length) * 100}%`,
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ originY: 0 }}
        />

        {phases.map((p, i) => {
          const isActive = i === active
          const isDone = i < active || active >= phases.length
          const isPending = i > active && active < phases.length
          const Icon = p.icon
          return (
            <div key={p.label} className="relative flex items-start gap-5">
              <div className="relative z-10 shrink-0">
                <motion.div
                  animate={{
                    scale: isActive ? [1, 1.12, 1] : 1,
                    boxShadow: isActive
                      ? [
                          '0 0 0 0 rgba(16,185,129,0.5)',
                          '0 0 0 14px rgba(16,185,129,0)',
                          '0 0 0 0 rgba(16,185,129,0.5)',
                        ]
                      : '0 0 0 0 rgba(16,185,129,0)',
                  }}
                  transition={{ duration: 1.6, repeat: isActive ? Infinity : 0 }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                    isActive
                      ? 'bg-emerald-500/15 border-emerald-500/60'
                      : isDone
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-[#0a0a0a] border-white/[0.08]'
                  }`}
                >
                  {isDone && !isActive ? (
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  ) : (
                    <Icon size={18} className={isActive || isDone ? 'text-emerald-400' : 'text-white/30'} />
                  )}
                </motion.div>
              </div>

              <motion.div
                animate={{ opacity: isPending ? 0.3 : 1 }}
                transition={{ duration: 0.4 }}
                className={`flex-1 bg-[#0a0a0a] border rounded-2xl p-5 transition-colors ${
                  isActive
                    ? 'border-emerald-500/40 shadow-[0_20px_60px_-30px_rgba(16,185,129,0.5)]'
                    : 'border-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-mono tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base font-semibold text-white tracking-tight">{p.label}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase text-emerald-400 font-medium"
                    >
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      Processing
                    </motion.div>
                  )}
                  {isDone && !isActive && (
                    <span className="text-[10px] tracking-wider uppercase text-emerald-400/70 font-medium">Done</span>
                  )}
                </div>
                <div className="text-sm text-white/55 leading-relaxed">
                  {isPending ? 'Waiting for upstream stage...' : p.sub}
                </div>
                <AnimatePresence>
                  {(isDone || isActive) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                      exit={{ opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/25">
                        <ArrowRight size={11} className="text-emerald-400" />
                        <span className="text-[11px] font-mono text-emerald-400">{p.output}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center">
        <motion.div
          className="w-px bg-gradient-to-b from-emerald-500/70 to-transparent h-6"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: active >= phases.length ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ originY: 0 }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: active >= phases.length ? 1 : 0,
          y: active >= phases.length ? 0 : 10,
        }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <div className="relative bg-gradient-to-br from-emerald-500/15 via-[#0a0a0a] to-[#0a0a0a] border border-emerald-500/40 rounded-2xl p-5 shadow-[0_0_60px_-20px_rgba(16,185,129,0.5)]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex flex-col items-center justify-center shrink-0">
              <div className="text-lg font-bold text-emerald-400 tabular-nums leading-none">742</div>
              <div className="text-[8px] tracking-wider uppercase text-emerald-400/70">Score</div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] tracking-[0.3em] uppercase text-emerald-400 font-medium mb-1">Approved band</div>
              <div className="text-sm text-white font-semibold leading-snug">
                Eligible for RM 8,000 personal financing
              </div>
              <div className="text-xs text-white/50 mt-1">At 7.2% APR · Top driver: payment regularity</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center mt-8">
        <button
          onClick={start}
          disabled={running}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white/50 border border-white/10 hover:border-emerald-500/40 hover:text-emerald-400 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Zap size={12} />
          {running ? 'Pipeline running...' : 'Replay pipeline'}
        </button>
      </div>
    </div>
  )
}

function HowItWorks() {
  return (
    <section className="relative py-28 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="How it works"
          title="Watch a score get built in real time"
          desc="A real applicant flows through the full pipeline below. Each stage passes its output forward until the final score and eligibility decision are ready."
        />
        <AnimatedScorePipeline />
      </div>
    </section>
  )
}

function Comparison() {
  return (
    <section className="relative py-28">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="Why ScoreKu"
          title="Legacy scoring vs. alternative scoring"
          desc="Traditional credit bureaus only see formal banking relationships. Alternative scoring sees what you actually do with money every day."
        />

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Traditional */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <X size={18} className="text-white/40" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/40 mb-0.5">Traditional</div>
                <div className="text-lg font-semibold text-white tracking-tight">Bank credit scoring</div>
              </div>
            </div>
            <ul className="space-y-3">
              {comparisonData.traditional.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/50">
                  <X size={16} className="text-white/30 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ScoreKu */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative bg-gradient-to-br from-emerald-500/10 via-[#0a0a0a] to-[#0a0a0a] border border-emerald-500/30 rounded-2xl p-8 shadow-[0_0_60px_-20px_rgba(16,185,129,0.3)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 size={18} className="text-emerald-400" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-0.5">ScoreKu</div>
                <div className="text-lg font-semibold text-white tracking-tight">Alternative scoring</div>
              </div>
            </div>
            <ul className="space-y-3">
              {comparisonData.scoreku.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                  <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function UseCases() {
  return (
    <section className="relative py-28">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="Who it's for"
          title="Designed for the unscored"
          desc="If you have been turned away by traditional lenders despite steady income, ScoreKu was built with you in mind."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {useCases.map((u) => (
            <motion.div
              key={u.title}
              variants={fadeInUp}
              className="group bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-5 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                <u.icon size={22} className="text-white/70 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2 tracking-tight">{u.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{u.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ModelPerformance() {
  const metrics = [
    { label: 'Accuracy', value: 89.1 },
    { label: 'AUC-ROC', value: 91.4 },
    { label: 'Precision', value: 68.0 },
    { label: 'Recall', value: 51.7 },
  ]
  return (
    <section className="relative py-28 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-[11px] tracking-[0.3em] uppercase text-emerald-400 font-medium mb-4">
              Model performance
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-semibold tracking-[-0.03em] text-white leading-[1.05]">
              Validated on 10,000 Malaysian profiles
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-5 text-lg text-white/60 leading-relaxed">
              The XGBoost model is tuned for the Malaysian context and benchmarked against traditional scoring baselines. SHAP analysis ensures every prediction stays interpretable.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 gap-4"
          >
            {metrics.map((m) => (
              <motion.div
                key={m.label}
                variants={fadeInUp}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3">{m.label}</div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-semibold text-white tabular-nums tracking-tight">{m.value}</span>
                  <span className="text-xl text-white/40">%</span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${m.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [openIdx, setOpenIdx] = useState(0)
  return (
    <section className="relative py-28">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeading
          eyebrow="FAQ"
          title="Answers before you ask"
          desc="Common questions about how the platform works, what data it needs, and how the model stays fair."
        />

        <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {faqData.map((f, i) => (
            <div key={f.q}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-6 py-5 text-left group"
              >
                <span className="text-base sm:text-lg font-medium text-white group-hover:text-emerald-400 transition-colors">
                  {f.q}
                </span>
                <motion.div
                  animate={{ rotate: openIdx === i ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/60 group-hover:border-emerald-500/40 group-hover:text-emerald-400 transition-colors"
                >
                  <Plus size={16} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pr-16 text-white/60 leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="relative py-28">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-emerald-500/15 via-[#0a0a0a] to-[#0a0a0a] border border-emerald-500/20 rounded-[32px] p-12 sm:p-16 overflow-hidden shadow-[0_40px_100px_-40px_rgba(16,185,129,0.4)]"
        >
          {/* Decorative glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium mb-6">
              <Sparkles size={12} />
              Free for individuals
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.035em] text-white leading-[1.02] max-w-3xl mx-auto">
              Your digital footprint deserves a score.
            </h2>
            <p className="mt-5 text-lg text-white/60 max-w-2xl mx-auto">
              Get a fair, transparent credit assessment in under five seconds. No bank account required.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/score"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all"
              >
                Check your score
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/learn"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-white/80 border border-white/15 hover:border-white/30 hover:text-white rounded-full font-medium transition-all"
              >
                Learn first
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  const sections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'How it Works', href: '/how-it-works' },
        { label: 'Simulator', href: '/simulation' },
        { label: 'AI Model', href: '/ai' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Learn', href: '/learn' },
        { label: 'Use Cases', href: '#use-cases' },
        { label: 'FAQ', href: '#faq' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Sign in', href: '/login' },
        { label: 'Register', href: '/register' },
      ],
    },
  ]

  return (
    <footer className="relative border-t border-white/[0.06] py-14 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 text-white font-semibold tracking-tight mb-4">
              <BrandMark size={28} />
              <span>ScoreKu</span>
            </Link>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed">
              Alternative credit scoring for Malaysians excluded from traditional banking. Built with explainable AI.
            </p>
          </div>
          {sections.map((s) => (
            <div key={s.title}>
              <div className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4">{s.title}</div>
              <ul className="space-y-2.5">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.href} className="text-sm text-white/70 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div>© {new Date().getFullYear()} ScoreKu. Built for financial inclusion.</div>
          <div>Made in Malaysia</div>
        </div>
      </div>
    </footer>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <ScrollProgress />
      <Navbar language={language} setLanguage={setLanguage} />

      <main>
        <Hero language={language} />
        <PoweredByBar />
        <Stats />
        <Features />
        <HowItWorks />
        <Comparison />
        <UseCases />
        <ModelPerformance />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  )
}
