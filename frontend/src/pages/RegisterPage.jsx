import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import api from '../services/api'
import { PageShell, BrandMark, Card, Pill, btn, input } from '../components/ui'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { t } = useLanguage()
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
      toast.success('Account created')

      const pendingResult = localStorage.getItem('scoreku_pending_result')
      if (pendingResult) {
        localStorage.removeItem('scoreku_pending_result')
        navigate('/dashboard', { state: { result: JSON.parse(pendingResult) } })
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const perks = [
    'Free credit score, forever',
    'Personalized improvement tips',
    'Financial literacy library',
  ]

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
            <Pill className="mb-5">Get started free</Pill>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-white mb-3">
              {t('createAccount') || 'Create your account'}
            </h1>
            <p className="text-white/55 text-sm">
              {t('registerSubtitle') || 'It takes less than a minute.'}
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={input.label}>{t('nameLabel') || 'Full name'}</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ahmad bin Ali"
                    className={`${input.base} pl-11`}
                    required
                  />
                </div>
              </div>

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
                <label className={input.label}>{t('passwordLabel') || 'Password'}</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className={`${input.base} pl-11`}
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div>
                <label className={input.label}>{t('confirmPasswordLabel') || 'Confirm password'}</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${input.base} pl-11`}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`${btn.emerald} w-full py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    {t('createAccount') || 'Create account'} <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-white/50">
                {t('haveAccount') || 'Already have an account?'}{' '}
                <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  {t('signIn') || 'Sign in'}
                </Link>
              </p>
            </div>
          </Card>

          <div className="mt-6 space-y-2">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-2 text-xs text-white/50">
                <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Check size={10} className="text-emerald-400" />
                </div>
                {p}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageShell>
  )
}
