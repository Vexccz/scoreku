import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, CreditCard, HelpCircle, UserX, Briefcase, GraduationCap, Store, Tractor, ArrowRight, CheckCircle2 } from 'lucide-react'

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
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [creditStatus, setCreditStatus] = useState(null)
  const [profile, setProfile] = useState(null)

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
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">ScoreKu</span>
        </motion.div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-500' : i < step ? 'w-2 bg-teal-500' : 'w-2 bg-[#2a2a2a]'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Credit History */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Do you have credit history?</h2>
                <p className="text-gray-400 text-sm">This helps us understand how ScoreKu can help you</p>
              </div>

              <div className="space-y-3">
                {creditOptions.map((opt) => {
                  const Icon = opt.icon
                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => handleCreditSelect(opt.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                        creditStatus === opt.id
                          ? 'bg-blue-500/10 border-blue-500/50'
                          : 'bg-[#111] border-[#1f1f1f] hover:border-[#333]'
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

          {/* Step 1: Profile */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">What best describes you?</h2>
                <p className="text-gray-400 text-sm">We'll tailor your experience based on your profile</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {profileOptions.map((opt) => {
                  const Icon = opt.icon
                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => handleProfileSelect(opt.id)}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all text-center ${
                        profile === opt.id
                          ? 'bg-blue-500/10 border-blue-500/50'
                          : 'bg-[#111] border-[#1f1f1f] hover:border-[#333]'
                      }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                        <Icon size={22} className="text-teal-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{opt.label}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{opt.desc}</p>
                      </div>
                      {profile === opt.id && <CheckCircle2 size={16} className="text-blue-400" />}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Summary + CTA */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-4">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                >
                  <CheckCircle2 size={32} className="text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">You're a perfect fit!</h2>
                <p className="text-gray-400 text-sm">ScoreKu is designed exactly for people like you</p>
              </div>

              <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-5 space-y-3">
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
                  <span className="text-sm font-medium text-teal-400">Yes ✓</span>
                </div>
              </div>

              {creditStatus === 'no' && (
                <motion.p
                  className="text-center text-sm text-gray-400 bg-blue-500/5 border border-blue-500/20 rounded-xl p-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  💡 <strong className="text-blue-400">3.8 million Malaysians</strong> are in the same situation. ScoreKu uses your digital footprint to build a credit identity without traditional bank history.
                </motion.p>
              )}

              <motion.button
                onClick={handleFinish}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl font-semibold text-lg hover:opacity-90 transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started <ArrowRight size={20} />
              </motion.button>

              <p className="text-center text-xs text-gray-500">
                Takes less than 2 minutes to get your score
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
