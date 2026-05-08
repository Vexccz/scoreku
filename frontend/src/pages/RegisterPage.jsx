import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Shield, Mail, Lock, User, ArrowRight, Users, UserPlus, Check } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

function FloatingParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
    })), []
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-teal-400/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Animated User → Checkmark illustration for Register
function RegisterIllustration() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500/20 to-blue-500/20"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="relative z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* User icon */}
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              {/* Head */}
              <motion.circle
                cx="40" cy="28" r="14"
                fill="url(#regGrad)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              />
              {/* Body */}
              <motion.path
                d="M16 68C16 54.7 26.7 44 40 44C53.3 44 64 54.7 64 68"
                stroke="url(#regGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              />
              {/* Plus sign */}
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
              >
                <circle cx="60" cy="28" r="10" fill="#14b8a6" />
                <line x1="55" y1="28" x2="65" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="60" y1="23" x2="60" y2="33" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </motion.g>
              <defs>
                <linearGradient id="regGrad" x1="16" y1="14" x2="64" y2="68">
                  <stop stopColor="#14b8a6" />
                  <stop offset="1" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </motion.div>

        {/* Checkmark appearing */}
        <motion.div
          className="absolute -bottom-2 -right-2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.8, type: 'spring', stiffness: 200 }}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Check size={22} className="text-white" strokeWidth={3} />
          </div>
        </motion.div>

        {/* Sparkle particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-teal-400"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5 + 1,
            }}
          />
        ))}
      </div>
      <motion.p
        className="text-sm text-gray-400 mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Start building your financial identity
      </motion.p>
    </div>
  )
}

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { t } = useLanguage()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      login(data.user, data.token)
      toast.success('Account created!')
      navigate('/score')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const pageBg = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const inputBg = theme === 'dark' ? 'bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  return (
    <div className={`min-h-screen ${pageBg} flex items-center justify-center px-4 relative overflow-hidden`}>
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] ${theme === 'dark' ? 'bg-teal-600/8' : 'bg-teal-200/30'}`}
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] ${theme === 'dark' ? 'bg-blue-600/8' : 'bg-blue-200/30'}`}
        />
      </div>

      <FloatingParticles />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-4xl flex items-center gap-12"
      >
        {/* Left: Illustration (desktop only) */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <RegisterIllustration />
        </div>

        {/* Right: Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Mobile illustration */}
          <div className="lg:hidden flex justify-center mb-6 h-32">
            <RegisterIllustration />
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">ScoreKu</span>
          </div>

          {/* Card */}
          <div className={`border rounded-2xl p-8 shadow-2xl ${cardBg}`}>
            <h2 className={`text-2xl font-bold mb-1 text-center ${textPrimary}`}>{t('createAccount')}</h2>
            <p className={`text-sm mb-8 text-center ${textSecondary}`}>{t('registerSubtitle')}</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={`block text-sm mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('fullName')}</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ahmad Zafran"
                    className={`w-full pl-11 pr-4 py-3.5 border rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition ${inputBg}`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('emailLabel')}</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className={`w-full pl-11 pr-4 py-3.5 border rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition ${inputBg}`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('passwordLabel')}</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className={`w-full pl-11 pr-4 py-3.5 border rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition ${inputBg}`}
                    minLength={6}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('confirmPassword')}</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-4 py-3.5 border rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition ${inputBg}`}
                    minLength={6}
                    required
                  />
                </div>
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-semibold transition disabled:opacity-50 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 text-white"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('creating')}
                  </span>
                ) : (
                  <>{t('getStarted')} <ArrowRight size={16} /></>
                )}
              </motion.button>
            </form>

            <div className="mt-6 space-y-3">
              <p className={`text-center text-sm ${textSecondary}`}>
                {t('alreadyHaveAccount')}{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">{t('logIn')}</Link>
              </p>
              <p className={`text-center text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {t('termsAgree')}{' '}
                <span className={`cursor-pointer transition ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>{t('terms')}</span>
                {' & '}
                <span className={`cursor-pointer transition ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>{t('privacyPolicy')}</span>
              </p>
            </div>
          </div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`flex items-center justify-center gap-2 mt-6 text-sm ${textSecondary}`}
          >
            <Users size={14} />
            <span>{t('socialProof')}</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
