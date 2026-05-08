import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Shield, Mail, Lock, User, ArrowRight, Users } from 'lucide-react'

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

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-600/8 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[100px]"
        />
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">ScoreKu</span>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-1 text-center text-white">Create your account</h2>
          <p className="text-gray-400 text-sm mb-8 text-center">Start building your financial identity</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmad Zafran"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition text-white placeholder-gray-600"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition text-white placeholder-gray-600"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition text-white placeholder-gray-600"
                  minLength={6}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition text-white placeholder-gray-600"
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
                  Creating...
                </span>
              ) : (
                <>Get Started <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">Log in</Link>
            </p>
            <p className="text-center text-xs text-gray-500">
              By signing up, you agree to our{' '}
              <span className="text-gray-400 cursor-pointer hover:text-gray-300 transition">Terms</span>
              {' & '}
              <span className="text-gray-400 cursor-pointer hover:text-gray-300 transition">Privacy Policy</span>
            </p>
          </div>
        </div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm"
        >
          <Users size={14} />
          <span>Join 10,000+ Malaysians building their financial identity</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
