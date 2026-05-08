import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useAnimation } from 'framer-motion'
import { Shield, TrendingUp, Smartphone, BarChart3, Zap, Users, ArrowRight, CheckCircle2, X, Sparkles, Globe, Lock } from 'lucide-react'

const features = [
  { icon: Shield, title: 'Alternative Data', desc: 'Uses e-wallet, bill payments & digital footprint instead of traditional credit history', color: 'from-blue-500/20 to-blue-600/5' },
  { icon: TrendingUp, title: 'AI-Powered Scoring', desc: 'XGBoost ML model trained on 10,000+ Malaysian profiles for accurate predictions', color: 'from-teal-500/20 to-teal-600/5' },
  { icon: Smartphone, title: 'Digital-First', desc: 'Leverages DuitNow, e-commerce & mobile data you already generate daily', color: 'from-purple-500/20 to-purple-600/5' },
  { icon: BarChart3, title: 'Explainable AI', desc: 'SHAP-powered insights show exactly what affects your score and how to improve', color: 'from-amber-500/20 to-amber-600/5' },
]

const stats = [
  { value: '3.8M', label: 'Unbanked Malaysians', icon: Users },
  { value: '89%', label: 'AI Accuracy', icon: Zap },
  { value: '10K+', label: 'Profiles Trained', icon: Globe },
]

const howItWorks = [
  { step: '01', title: 'Input Your Data', desc: 'Share your digital payment habits, bill history, and income details', icon: Smartphone },
  { step: '02', title: 'AI Analysis', desc: 'Our XGBoost model analyzes 15+ features to predict creditworthiness', icon: Sparkles },
  { step: '03', title: 'Get Your Score', desc: 'Receive an explainable credit score with actionable improvement tips', icon: TrendingUp },
]

const comparison = [
  { feature: 'Data Required', traditional: 'Bank statements, CCRIS', scoreku: 'E-wallet & digital activity' },
  { feature: 'Processing Time', traditional: '3-5 business days', scoreku: 'Instant (< 5 seconds)' },
  { feature: 'Accessibility', traditional: 'Bank account required', scoreku: 'Anyone with a smartphone' },
  { feature: 'Transparency', traditional: 'Black box scoring', scoreku: 'SHAP explainability' },
  { feature: 'Cost', traditional: 'RM50-100 per report', scoreku: 'Free' },
]

const typingWords = ['Gig Workers', 'Fresh Grads', 'Small Traders', 'Freelancers', 'Hawkers']

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
          setTimeout(() => setIsDeleting(true), 1500)
        }
      } else {
        setText(word.slice(0, text.length - 1))
        if (text === '') {
          setIsDeleting(false)
          setWordIndex((wordIndex + 1) % typingWords.length)
        }
      }
    }, isDeleting ? 50 : 100)
    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex])

  return (
    <span className="gradient-text">
      {text}<span className="animate-pulse text-blue-400">|</span>
    </span>
  )
}

function AnimatedGauge() {
  const [score, setScore] = useState(0)
  const targetScore = 78

  useEffect(() => {
    const duration = 2000
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setScore(Math.round(eased * targetScore))
      if (progress < 1) requestAnimationFrame(animate)
    }
    const timer = setTimeout(animate, 800)
    return () => clearTimeout(timer)
  }, [])

  const circumference = 2 * Math.PI * 60
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`
  const color = score >= 76 ? '#10b981' : score >= 56 ? '#3b82f6' : score >= 31 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-48 h-48 -rotate-90" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="60" fill="none" stroke="#1f1f1f" strokeWidth="12" />
        <circle
          cx="70" cy="70" r="60" fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.1s ease', filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-gray-400 mt-1">out of 100</span>
      </div>
    </div>
  )
}

function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-blue-500/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `particle-float ${8 + Math.random() * 12}s linear infinite`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        />
      ))}
    </div>
  )
}

function GradientOrbs() {
  return (
    <>
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] animate-pulse-glow pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-600/10 blur-[120px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '1.5s' }} />
      <div className="fixed top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-purple-600/5 blur-[100px] animate-float-slow pointer-events-none" />
    </>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Particles />
      <GradientOrbs />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold">ScoreKu</h1>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
          <a href="#comparison" className="hover:text-white transition">Compare</a>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="px-4 py-2 rounded-xl text-sm text-gray-300 hover:text-white border border-transparent hover:border-gray-700 transition">Log In</Link>
          <Link to="/register" className="px-4 py-2 rounded-xl text-sm bg-blue-600 hover:bg-blue-700 transition font-medium">Sign Up</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
              <Sparkles size={12} /> Powered by Machine Learning
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Credit Scoring<br />
              Built for <TypeWriter />
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mb-8 leading-relaxed">
              No bank history? No problem. ScoreKu uses your digital footprint — e-wallet transactions, bill payments, and online activity — to generate a fair credit score in seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-2xl text-lg font-semibold transition shadow-lg shadow-blue-600/20">
                Get Your Score <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center gap-2 px-7 py-4 border border-gray-700 hover:border-gray-500 rounded-2xl text-lg transition text-gray-300">
                Learn More
              </a>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Lock size={14} className="text-teal-400" /> Bank-grade security</span>
              <span className="flex items-center gap-1.5"><Zap size={14} className="text-teal-400" /> Results in 5 seconds</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-3xl blur-xl" />
              <div className="relative bg-[#111]/80 backdrop-blur-sm border border-[#2a2a2a] rounded-3xl p-8">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-400 mb-2">Your Alternative Credit Score</p>
                  <AnimatedGauge />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Payment Consistency</span>
                    <span className="text-teal-400">85%</span>
                  </div>
                  <div className="w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ delay: 1.5, duration: 1 }} className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full" />
                  </div>
                  <div className="flex justify-between text-sm mt-3">
                    <span className="text-gray-400">Digital Activity</span>
                    <span className="text-blue-400">72%</span>
                  </div>
                  <div className="w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ delay: 1.8, duration: 1 }} className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#111]/60 backdrop-blur-sm border border-[#2a2a2a] rounded-2xl p-6 text-center card-hover"
            >
              <stat.icon className="w-8 h-8 text-teal-400 mx-auto mb-3" />
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Why ScoreKu?</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">Built specifically for Malaysians who are invisible to traditional credit bureaus</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-[#111]/60 backdrop-blur-sm border border-[#2a2a2a] rounded-2xl p-6 card-hover relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h3>
          <p className="text-gray-400">Three simple steps to your alternative credit score</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {howItWorks.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              <div className="bg-[#111]/60 backdrop-blur-sm border border-[#2a2a2a] rounded-2xl p-8 card-hover h-full">
                <div className="text-5xl font-bold text-blue-500/20 mb-4">{item.step}</div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 text-gray-600">
                  <ArrowRight size={20} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section id="comparison" className="relative z-10 max-w-5xl mx-auto px-6 pb-32">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Traditional vs ScoreKu</h3>
          <p className="text-gray-400">See why alternative credit scoring is the future</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#111]/60 backdrop-blur-sm border border-[#2a2a2a] rounded-2xl overflow-hidden"
        >
          <div className="grid grid-cols-3 gap-0 text-sm">
            <div className="p-4 font-semibold text-gray-400 border-b border-[#2a2a2a]">Feature</div>
            <div className="p-4 font-semibold text-red-400 border-b border-[#2a2a2a] text-center">Traditional</div>
            <div className="p-4 font-semibold text-teal-400 border-b border-[#2a2a2a] text-center">ScoreKu</div>
            {comparison.map((row, i) => (
              <motion.div key={i} className="contents" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <div className="p-4 text-gray-300 border-b border-[#2a2a2a]/50">{row.feature}</div>
                <div className="p-4 text-gray-500 border-b border-[#2a2a2a]/50 text-center flex items-center justify-center gap-2">
                  <X size={14} className="text-red-400/60" /> {row.traditional}
                </div>
                <div className="p-4 text-gray-200 border-b border-[#2a2a2a]/50 text-center flex items-center justify-center gap-2">
                  <CheckCircle2 size={14} className="text-teal-400" /> {row.scoreku}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-teal-600/20" />
          <div className="absolute inset-0 bg-[#111]/80 backdrop-blur-sm" />
          <div className="relative z-10 text-center py-16 px-8">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Discover Your Score?</h3>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Join thousands of Malaysians who have unlocked their credit potential through alternative data scoring.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 rounded-2xl text-lg font-semibold transition shadow-lg shadow-blue-600/20">
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#2a2a2a] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-semibold">ScoreKu</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
              <a href="#comparison" className="hover:text-white transition">Compare</a>
            </div>
            <p className="text-sm text-gray-500">© 2026 ScoreKu. Built for financial inclusion.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
