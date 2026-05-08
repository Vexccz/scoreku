import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, CreditCard, HelpCircle, UserX, Briefcase, GraduationCap, Store, Tractor, ArrowRight, CheckCircle2, Sparkles, TrendingUp, Lock, Home, Clock, Users, Globe, Laptop, BookOpen, Search } from 'lucide-react'

const creditOptions = [
  { id: 'no', label: "No, I don't have credit history", desc: 'Never applied for loan or credit card', icon: UserX, color: 'from-blue-500 to-blue-600' },
  { id: 'yes', label: 'Yes, I have existing credit history', desc: 'Have CCRIS/CTOS records', icon: CreditCard, color: 'from-emerald-500 to-emerald-600' },
  { id: 'unsure', label: "I'm not sure", desc: "Don't know if I have records", icon: HelpCircle, color: 'from-amber-500 to-amber-600' },
]

const profileOptions = [
  { id: 'gig', label: 'Gig Worker', desc: 'Grab, Foodpanda, freelance', icon: Briefcase },
  { id: 'student', label: 'Fresh Graduate', desc: 'Just finished studies', icon: GraduationCap },
  { id: 'business', label: 'Micro-Entrepreneur', desc: 'Small business, online seller', icon: Store },
  { id: 'rural', label: 'Rural Community', desc: 'Limited bank access', icon: Tractor },
  { id: 'homemaker', label: 'Homemaker', desc: 'Stay-at-home parent', icon: Home },
  { id: 'parttime', label: 'Part-time Worker', desc: 'Part-time or contract work', icon: Clock },
  { id: 'foreign', label: 'Foreign Worker', desc: 'Working in Malaysia', icon: Globe },
  { id: 'creator', label: 'Content Creator', desc: 'Online seller, influencer', icon: Laptop },
  { id: 'studying', label: 'Student', desc: 'Currently studying', icon: BookOpen },
  { id: 'jobseeker', label: 'Job Seeking', desc: 'Unemployed, looking for work', icon: Search },
  { id: 'retiree', label: 'Retiree', desc: 'Senior citizen, retired', icon: Users },
  { id: 'informal', label: 'Informal Sector', desc: 'Construction, farming, etc', icon: Users },
]

// Floating particles + stars
const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 35 }, (_, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-full ${i % 3 === 0 ? 'w-1.5 h-1.5 bg-blue-400/30' : i % 3 === 1 ? 'w-1 h-1 bg-teal-400/25' : 'w-0.5 h-0.5 bg-purple-400/20'}`}
        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        animate={{ y: [0, -40, 0], x: [0, Math.random() * 30 - 15, 0], opacity: [0.1, 0.7, 0.1], scale: [1, 1.5, 1] }}
        transition={{ duration: Math.random() * 6 + 3, repeat: Infinity, delay: Math.random() * 4 }}
      />
    ))}
    {/* Animated grid */}
    <div className="absolute inset-0" style={{
      backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
      backgroundSize: '60px 60px',
    }} />
  </div>
)

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(-1) // -1 = welcome splash
  const [creditStatus, setCreditStatus] = useState(null)
  const [profile, setProfile] = useState(null)
  const [showTagline, setShowTagline] = useState(false)
  const [showFeatures, setShowFeatures] = useState(false)
  const [showCTA, setShowCTA] = useState(false)

  // Animate welcome splash sequence
  useEffect(() => {
    if (step !== -1) return
    const t1 = setTimeout(() => setShowTagline(true), 1200)
    const t2 = setTimeout(() => setShowFeatures(true), 2200)
    const t3 = setTimeout(() => setShowCTA(true), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [step])

  const handleCreditSelect = (id) => {
    setCreditStatus(id)
    setTimeout(() => setStep(1), 400)
  }

  const handleProfileSelect = (id) => {
    setProfile(id)
    setTimeout(() => setStep(2), 400)
  }

  const handleFinish = () => {
    localStorage.setItem('scoreku_onboarded', 'true')
    localStorage.setItem('scoreku_credit_status', creditStatus)
    localStorage.setItem('scoreku_profile', profile)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background - meriah */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]"
          animate={{ scale: [1, 1.3, 1], x: [0, 50, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[130px]"
          animate={{ scale: [1.1, 1, 1.1], x: [0, -40, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, delay: 4 }}
        />
        <motion.div
          className="absolute top-[60%] left-[20%] w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1], y: [0, -30, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-[20%] right-[30%] w-[250px] h-[250px] bg-amber-500/5 rounded-full blur-[90px]"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, delay: 3 }}
        />
      </div>
      <Particles />

      <div className="relative w-full max-w-lg">
        <AnimatePresence mode="wait">
          {/* ─── WELCOME SPLASH ─── */}
          {step === -1 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              {/* Logo entrance */}
              <motion.div
                className="flex items-center justify-center gap-3 mb-8"
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 200 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.3)]"
                  animate={{ boxShadow: ['0 0 40px rgba(37,99,235,0.3)', '0 0 60px rgba(20,184,166,0.4)', '0 0 40px rgba(37,99,235,0.3)'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Shield size={32} className="text-white" />
                </motion.div>
              </motion.div>

              {/* Welcome text */}
              <motion.h1
                className="text-4xl sm:text-5xl font-bold mb-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                  ScoreKu
                </span>
              </motion.h1>

              {/* Tagline */}
              <AnimatePresence>
                {showTagline && (
                  <motion.p
                    className="text-lg text-gray-400 mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    Your alternative credit score, powered by AI
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Feature highlights */}
              <AnimatePresence>
                {showFeatures && (
                  <motion.div
                    className="grid grid-cols-3 gap-3 mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {[
                      { icon: Sparkles, label: 'AI-Powered', color: 'text-blue-400' },
                      { icon: TrendingUp, label: 'Instant Score', color: 'text-teal-400' },
                      { icon: Lock, label: 'Secure & Private', color: 'text-purple-400' },
                    ].map((f, i) => (
                      <motion.div
                        key={f.label}
                        className="flex flex-col items-center gap-2 p-4 bg-[#111] border border-[#1f1f1f] rounded-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 }}
                      >
                        <f.icon size={24} className={f.color} />
                        <span className="text-xs text-gray-400 font-medium">{f.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA */}
              <AnimatePresence>
                {showCTA && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.button
                      onClick={() => setStep(0)}
                      className="relative w-full py-4 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl font-semibold text-lg overflow-hidden group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Shimmer */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                      />
                      <span className="relative flex items-center justify-center gap-2">
                        Let's Get Started <ArrowRight size={20} />
                      </span>
                    </motion.button>

                    <motion.p
                      className="text-center text-xs text-gray-500 mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Takes less than 2 minutes • No bank account needed
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ─── STEP 0: Credit History ─── */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-4"
            >
              {/* Progress */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === 0 ? 'w-8 bg-blue-500' : 'w-2 bg-[#2a2a2a]'}`} />
                ))}
              </div>

              <div className="text-center mb-6">
                <motion.h2
                  className="text-2xl font-bold mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Do you have credit history?
                </motion.h2>
                <p className="text-gray-400 text-sm">This helps us understand how ScoreKu can help you</p>
              </div>

              <div className="space-y-3">
                {creditOptions.map((opt, i) => {
                  const Icon = opt.icon
                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => handleCreditSelect(opt.id)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                        creditStatus === opt.id
                          ? 'bg-blue-500/10 border-blue-500/50'
                          : 'bg-[#111] border-[#1f1f1f] hover:border-[#333] hover:bg-[#151515]'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center shrink-0`}>
                        <Icon size={22} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{opt.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                      </div>
                      {creditStatus === opt.id && <CheckCircle2 size={20} className="text-blue-400 shrink-0" />}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ─── STEP 1: Profile ─── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i <= 1 ? (i === 1 ? 'w-8 bg-blue-500' : 'w-2 bg-teal-500') : 'w-2 bg-[#2a2a2a]'}`} />
                ))}
              </div>

              <div className="text-center mb-6">
                <motion.h2
                  className="text-2xl font-bold mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  What best describes you?
                </motion.h2>
                <p className="text-gray-400 text-sm">We'll tailor your experience based on your profile</p>
              </div>

              <div className="grid grid-cols-3 gap-2.5 max-h-[400px] overflow-y-auto pr-1 scrollbar-hide">
                {profileOptions.map((opt, i) => {
                  const Icon = opt.icon
                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => handleProfileSelect(opt.id)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 + i * 0.04 }}
                      className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border transition-all text-center ${
                        profile === opt.id
                          ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                          : 'bg-[#111] border-[#1f1f1f] hover:border-[#333] hover:bg-[#151515]'
                      }`}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <motion.div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          profile === opt.id ? 'bg-blue-500/20 border-blue-500/40' : 'bg-[#1a1a1a] border-[#2a2a2a]'
                        } border`}
                      >
                        <Icon size={18} className={profile === opt.id ? 'text-blue-400' : 'text-teal-400'} />
                      </motion.div>
                      <div>
                        <p className="font-medium text-white text-xs">{opt.label}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{opt.desc}</p>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ─── STEP 2: Summary ─── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i <= 2 ? (i === 2 ? 'w-8 bg-blue-500' : 'w-2 bg-teal-500') : 'w-2 bg-[#2a2a2a]'}`} />
                ))}
              </div>

              <div className="text-center mb-4">
                <motion.div
                  className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-[0_0_40px_rgba(20,184,166,0.3)]"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                  <CheckCircle2 size={40} className="text-white" />
                </motion.div>
                <motion.h2
                  className="text-2xl font-bold mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  You're a perfect fit!
                </motion.h2>
                <motion.p
                  className="text-gray-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  ScoreKu is designed exactly for people like you
                </motion.p>
              </div>

              <motion.div
                className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-5 space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Credit History</span>
                  <span className="text-sm font-medium text-white">
                    {creditStatus === 'no' ? 'None' : creditStatus === 'yes' ? 'Existing' : 'Unknown'}
                  </span>
                </div>
                <div className="border-t border-[#1f1f1f]" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Profile</span>
                  <span className="text-sm font-medium text-white">
                    {profileOptions.find(p => p.id === profile)?.label || '-'}
                  </span>
                </div>
                <div className="border-t border-[#1f1f1f]" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">ScoreKu can help?</span>
                  <span className="text-sm font-medium text-teal-400">Absolutely ✓</span>
                </div>
              </motion.div>

              {creditStatus === 'no' && (
                <motion.p
                  className="text-center text-sm text-gray-400 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  💡 <strong className="text-blue-400">3.8 million Malaysians</strong> are in the same situation. ScoreKu uses your digital footprint to build a credit identity without traditional bank history.
                </motion.p>
              )}

              <motion.button
                onClick={handleFinish}
                className="relative w-full py-4 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl font-semibold text-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  Continue to ScoreKu <ArrowRight size={20} />
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
