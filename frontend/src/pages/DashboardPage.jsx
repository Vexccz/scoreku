import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Shield, TrendingUp, TrendingDown, Lightbulb, RefreshCw,
  ArrowUpRight, ArrowDownRight, CreditCard, Banknote, GraduationCap,
  PiggyBank, Wallet, Receipt, Smartphone, BarChart3, Zap, Target
} from 'lucide-react'

const riskCategories = [
  { min: 0, max: 30, label: 'High Risk', color: '#ef4444', glow: 'shadow-red-500/20' },
  { min: 31, max: 55, label: 'Moderate Risk', color: '#f59e0b', glow: 'shadow-amber-500/20' },
  { min: 56, max: 75, label: 'Fair', color: '#3b82f6', glow: 'shadow-blue-500/20' },
  { min: 76, max: 100, label: 'Excellent', color: '#10b981', glow: 'shadow-emerald-500/20' },
]

const defaultTips = [
  { text: 'Pay utility bills consistently every month', icon: Receipt },
  { text: 'Increase DuitNow/e-wallet transaction frequency', icon: Smartphone },
  { text: 'Maintain stable monthly income over 6+ months', icon: Wallet },
  { text: 'Reduce e-commerce return rate', icon: Target },
  { text: 'Keep the same phone number for longer periods', icon: Zap },
]

const eligibleProducts = {
  high: [
    { name: 'BSN Micro Loan', desc: 'Up to RM50,000 at competitive rates', icon: Banknote, color: 'from-emerald-500/20 to-emerald-600/5' },
    { name: 'TEKUN Financing', desc: 'Business financing for entrepreneurs', icon: CreditCard, color: 'from-blue-500/20 to-blue-600/5' },
    { name: 'Amanah Ikhtiar', desc: 'Microfinance for income generation', icon: Wallet, color: 'from-teal-500/20 to-teal-600/5' },
  ],
  mid: [
    { name: 'TEKUN Financing', desc: 'Business financing for entrepreneurs', icon: CreditCard, color: 'from-blue-500/20 to-blue-600/5' },
    { name: 'Amanah Ikhtiar', desc: 'Microfinance for income generation', icon: Wallet, color: 'from-teal-500/20 to-teal-600/5' },
  ],
  low: [
    { name: 'Financial Literacy Program', desc: 'Free courses to build credit knowledge', icon: GraduationCap, color: 'from-purple-500/20 to-purple-600/5' },
    { name: 'Savings Account', desc: 'Start building your financial history', icon: PiggyBank, color: 'from-amber-500/20 to-amber-600/5' },
  ],
}

function AnimatedScore({ target }) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    let start = 0
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

function ScoreGauge({ score, category }) {
  const circumference = 2 * Math.PI * 54
  const progress = (score / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center w-56 h-56">
      {/* Glow effect */}
      <div
        className="absolute inset-4 rounded-full blur-2xl opacity-30"
        style={{ background: `radial-gradient(circle, ${category.color}, transparent 70%)` }}
      />
      <svg className="w-56 h-56 -rotate-90" viewBox="0 0 120 120">
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
        <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
          <AnimatedScore target={score} />
        </span>
        <span className="text-xs text-gray-500 mt-1">out of 100</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state?.result

  const score = result?.score ?? 72
  const features = result?.feature_breakdown ?? [
    { name: 'Payment Consistency', value: 0.85 },
    { name: 'Rent History', value: 0.72 },
    { name: 'E-wallet Activity', value: 0.65 },
    { name: 'Income Stability', value: 0.58 },
    { name: 'Digital Footprint', value: 0.45 },
    { name: 'Phone Tenure', value: 0.38 },
  ]
  const tips = result?.tips ?? defaultTips.map(t => t.text)

  const category = riskCategories.find(c => score >= c.min && score <= c.max) || riskCategories[2]

  // Sort features for helping/hurting
  const sorted = [...features].sort((a, b) => b.value - a.value)
  const helping = sorted.slice(0, 3)
  const hurting = sorted.slice(-3).reverse()

  // Eligible products based on score
  const products = score >= 70 ? eligibleProducts.high : score >= 50 ? eligibleProducts.mid : eligibleProducts.low

  // Tips with icons
  const tipsWithIcons = tips.map((tip, i) => ({
    text: typeof tip === 'string' ? tip : tip.text,
    icon: defaultTips[i]?.icon || Lightbulb,
  }))

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-600/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-5xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">ScoreKu</span>
          </div>
          <button
            onClick={() => navigate('/score')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#111] border border-[#1f1f1f] rounded-xl text-sm text-gray-300 hover:border-blue-500/50 hover:text-white transition-all"
          >
            <RefreshCw size={14} /> Recalculate
          </button>
        </motion.div>

        {/* Score Card */}
        <motion.div
          variants={item}
          className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-10 text-center mb-6"
        >
          <p className="text-sm text-gray-400 mb-6 tracking-wide uppercase">Your Alternative Credit Score</p>
          <ScoreGauge score={score} category={category} />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6"
          >
            <span
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border animate-pulse"
              style={{
                color: category.color,
                borderColor: `${category.color}40`,
                backgroundColor: `${category.color}10`,
              }}
            >
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: category.color }} />
              {category.label}
            </span>
          </motion.div>
        </motion.div>

        {/* Score Factors */}
        <motion.div variants={item} className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Helping */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp size={16} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold text-emerald-300">Helping Your Score</h3>
            </div>
            <div className="space-y-4">
              {helping.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <ArrowUpRight size={16} className="text-emerald-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300">{f.name}</span>
                      <span className="text-xs text-emerald-400 font-medium">{Math.round(f.value * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
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
          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <TrendingDown size={16} className="text-red-400" />
              </div>
              <h3 className="font-semibold text-red-300">Hurting Your Score</h3>
            </div>
            <div className="space-y-4">
              {hurting.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <ArrowDownRight size={16} className="text-red-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300">{f.name}</span>
                      <span className="text-xs text-red-400 font-medium">{Math.round(f.value * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
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
        <motion.div variants={item} className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BarChart3 size={16} className="text-blue-400" />
            </div>
            <h3 className="font-semibold">Feature Breakdown</h3>
          </div>
          <div className="space-y-4">
            {features.map((f, i) => {
              const pct = Math.round(f.value * 100)
              const barColor = pct >= 70 ? 'from-emerald-500 to-emerald-400' : pct >= 50 ? 'from-blue-500 to-blue-400' : pct >= 35 ? 'from-amber-500 to-amber-400' : 'from-red-500 to-red-400'
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-gray-300">{f.name}</span>
                    <span className="text-sm font-medium text-gray-400">{pct}%</span>
                  </div>
                  <div className="h-2.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Improvement Tips */}
        <motion.div variants={item} className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Lightbulb size={16} className="text-amber-400" />
            </div>
            <h3 className="font-semibold">Improvement Tips</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tipsWithIcons.slice(0, 5).map((tip, i) => {
              const TipIcon = tip.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-4 hover:border-amber-500/30 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                    <TipIcon size={16} className="text-amber-400" />
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{tip.text}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Eligible Products */}
        <motion.div variants={item} className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <CreditCard size={16} className="text-teal-400" />
            </div>
            <h3 className="font-semibold">Eligible Products</h3>
            <span className="ml-auto text-xs text-gray-500">Based on your score</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product, i) => {
              const ProductIcon = product.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5 hover:border-teal-500/30 transition-all group cursor-pointer"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <ProductIcon size={20} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{product.name}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{product.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
