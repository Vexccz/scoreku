import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import api from '../services/api'
import { PageShell, BrandMark, Card, Pill, btn, input } from '../components/ui'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      login(data.user, data.token)
      toast.success('Logged in')

      const pendingResult = localStorage.getItem('scoreku_pending_result')
      if (pendingResult) {
        localStorage.removeItem('scoreku_pending_result')
        navigate('/dashboard', { state: { result: JSON.parse(pendingResult) } })
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <div className="relative flex items-center justify-center min-h-screen px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center justify-center gap-2 mb-10 text-white font-semibold tracking-tight">
            <BrandMark size={32} />
            <span className="text-xl">ScoreKu</span>
          </Link>

          <div className="text-center mb-8">
            <Pill className="mb-5">Welcome back</Pill>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-white mb-3">
              {t('welcomeBack') || 'Sign in to ScoreKu'}
            </h1>
            <p className="text-white/55 text-sm">
              {t('signInSubtitle') || 'Continue where you left off.'}
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={input.label}>{t('emailLabel') || 'Email'}</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className={`${input.base} pl-11`}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={input.label}>{t('passwordLabel') || 'Password'}</label>
                  <span className="text-xs text-white/40 cursor-not-allowed">
                    {t('forgotPassword') || 'Forgot?'}
                  </span>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${input.base} pl-11`}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`${btn.emerald} w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    {t('signingIn') || 'Signing in...'}
                  </>
                ) : (
                  <>
                    {t('signIn') || 'Sign in'} <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 space-y-3 text-center">
              <p className="text-sm text-white/50">
                {t('noAccount') || "Don't have an account?"}{' '}
                <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  {t('signUp') || 'Sign up'}
                </Link>
              </p>
              <Link
                to="/dashboard?demo=true"
                className="inline-block text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                {t('tryDemo') || 'Try demo mode'}
              </Link>
            </div>
          </Card>

          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-white/40">
            <Users size={13} />
            <span>{t('socialProof') || 'Trusted by researchers and fintech partners'}</span>
          </div>
        </motion.div>
      </div>
    </PageShell>
  )
}
