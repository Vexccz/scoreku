import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Shield, Mail, Lock, User, ArrowRight, Users, Sparkles } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
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
      {/* Animated gradient background */}
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
        <div className="bg-[#111]/90 backdrop-blur-sm border border-[#1f1f1f] rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-center">Create account</h2>
            <Sparkles size={18} className="text-teal-400" />
          </div>
          <p className="text-gray-400 text-sm mb-8 text-center">Get your alternative credit score in minutes</p>

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
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition text-white placeholder-gray-600"
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
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition text-white placeholder-gray-600"
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
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition text-white placeholder-gray-600"
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
              className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 rounded-xl font-semibold transition disabled:opacity-50 shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">Log in</Link>
          </p>
        </div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm"
        >
          <Users size={14} />
          <span>Join 10,000+ Malaysians building credit</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
