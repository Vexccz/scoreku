import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Building2, CheckCircle2, Lock, Eye, ArrowLeft, Loader2,
  ChevronRight, Menu, Sparkles
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import AppSidebar from '../components/AppSidebar'
import BrandLogo from '../components/BrandLogo'

// ─── Navigation Items ────────────────────────────────────────────────────────



// ─── Bank Data ───────────────────────────────────────────────────────────────

const banks = [
  { id: 'maybank', name: 'Maybank', color: '#FDB813', textColor: '#000', shortName: 'MBB', logo: 'https://img.logo.dev/maybank.com?token=pk_free' },
  { id: 'cimb', name: 'CIMB', color: '#EC1C24', textColor: '#fff', shortName: 'CIMB', logo: 'https://img.logo.dev/cimb.com?token=pk_free' },
  { id: 'bankislam', name: 'Bank Islam', color: '#00A651', textColor: '#fff', shortName: 'BI', logo: 'https://img.logo.dev/bankislam.com?token=pk_free' },
  { id: 'rhb', name: 'RHB', color: '#003DA5', textColor: '#fff', shortName: 'RHB', logo: 'https://img.logo.dev/rhbgroup.com?token=pk_free' },
  { id: 'publicbank', name: 'Public Bank', color: '#0033A0', textColor: '#fff', shortName: 'PBB', logo: 'https://img.logo.dev/publicbank.com.my?token=pk_free' },
  { id: 'hongleong', name: 'Hong Leong', color: '#CC0000', textColor: '#fff', shortName: 'HLB', logo: 'https://img.logo.dev/hlb.com.my?token=pk_free' },
  { id: 'ambank', name: 'AmBank', color: '#00843D', textColor: '#fff', shortName: 'AMB', logo: 'https://img.logo.dev/ambank.com.my?token=pk_free' },
  { id: 'bankrakyat', name: 'Bank Rakyat', color: '#6B2D8B', textColor: '#fff', shortName: 'BR', logo: 'https://img.logo.dev/bankrakyat.com.my?token=pk_free' },
]

function getPermissions(t) {
  return [
    t('transactionHistoryBank'),
    t('accountBalance'),
    t('billPaymentRecords'),
    t('salaryDeposits'),
  ]
}

const importSteps = [
  { text: 'Connecting to {bank}...', detail: null },
  { text: 'Fetching transaction history...', detail: '847 transactions' },
  { text: 'Analyzing bill payments...', detail: '11/12 paid on time' },
  { text: 'Detecting salary deposits...', detail: 'RM3,500 avg/month' },
  { text: 'Categorizing spending...', detail: 'Food 35%, Transport 20%, Bills 25%, Others 20%' },
]

const summaryCards = [
  { label: 'Total Transactions', value: '847', color: '#3b82f6' },
  { label: 'Bills Paid On Time', value: '11/12 (92%)', color: '#10b981' },
  { label: 'Avg Monthly Income', value: 'RM3,500', color: '#8b5cf6' },
  { label: 'Account Age', value: '3 years 4 months', color: '#f59e0b' },
]

const spendingData = [
  { label: 'Food', pct: 35, color: '#3b82f6' },
  { label: 'Transport', pct: 20, color: '#14b8a6' },
  { label: 'Bills', pct: 25, color: '#8b5cf6' },
  { label: 'Others', pct: 20, color: '#6b7280' },
]

// ─── Confetti ────────────────────────────────────────────────────────────────

const confettiColors = ['#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981']

function Confetti({ trigger }) {
  const [particles, setParticles] = useState([])
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (trigger && !hasTriggered.current) {
      hasTriggered.current = true
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        rotation: Math.random() * 360,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: Math.random() * 8 + 4,
        isCircle: Math.random() > 0.5,
      }))
      setParticles(newParticles)
      setTimeout(() => setParticles([]), 3500)
    }
  }, [trigger])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: p.rotation + 720 }}
          transition={{ duration: 2.5, delay: p.delay, ease: 'easeIn' }}
          className="absolute top-0"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}



// ─── Step 1: Select Bank ─────────────────────────────────────────────────────

function SelectBankStep({ onSelect, theme }) {
  const { t } = useLanguage()
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-4"
        >
          <Building2 size={28} className="text-blue-400" />
        </motion.div>
        <h2 className={`text-2xl font-bold mb-2 ${textPrimary}`}>{t('connectYourBank')}</h2>
        <p className={`text-sm ${textSecondary}`}>{t('connectBankSubtitle')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {banks.map((bank, i) => (
          <motion.button
            key={bank.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.06, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(bank)}
            className={`group relative border-2 rounded-2xl p-5 flex flex-col items-center gap-3 transition-all cursor-pointer ${cardBg} hover:shadow-lg`}
            style={{ borderColor: `${bank.color}30` }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = bank.color }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${bank.color}30` }}
          >
            {/* Bank Logo */}
            <BrandLogo
              name={bank.shortName}
              url={bank.logo}
              fallbackColor={bank.color}
              size="w-14 h-14"
              className="transition-transform group-hover:scale-110"
            />
            <span className={`text-sm font-medium text-center ${textPrimary}`}>{bank.name}</span>
            <span
              className="text-[11px] font-medium px-3 py-1 rounded-full transition-all opacity-70 group-hover:opacity-100"
              style={{ backgroundColor: `${bank.color}15`, color: bank.color }}
            >
              Connect
            </span>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className={`flex items-center justify-center gap-2 mt-8 text-xs ${textSecondary}`}
      >
        <Lock size={12} />
        <span>{t('bankGradeEncryption')}</span>
      </motion.div>
    </motion.div>
  )
}

// ─── Step 2: Authorization ───────────────────────────────────────────────────

function AuthorizationStep({ bank, onAuthorize, onCancel, theme }) {
  const { t } = useLanguage()
  const permissions = getPermissions(t)
  const [connecting, setConnecting] = useState(false)
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const surfaceBg = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'

  const handleAuthorize = () => {
    setConnecting(true)
    setTimeout(() => onAuthorize(), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto"
    >
      <div className={`border rounded-2xl overflow-hidden ${cardBg}`}>
        {/* Bank Header */}
        <div
          className="px-6 py-5 flex items-center gap-4"
          style={{ backgroundColor: `${bank.color}15` }}
        >
          <BrandLogo
            name={bank.shortName}
            url={bank.logo}
            fallbackColor={bank.color}
            size="w-12 h-12"
          />
          <div>
            <h3 className={`font-bold text-lg ${textPrimary}`}>{bank.name}</h3>
            <p className={`text-xs ${textSecondary}`}>{t('secureAuthorization')}</p>
          </div>
        </div>

        <div className="p-6">
          {/* Auth Title */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <h4 className={`font-semibold text-sm ${textPrimary}`}>{t('authorizeScoreKu')}</h4>
              <p className={`text-xs ${textSecondary}`}>{t('readOnlyAccess')}</p>
            </div>
          </div>

          {/* Permissions */}
          <div className={`rounded-xl p-4 mb-5 ${surfaceBg}`}>
            <p className={`text-xs font-medium mb-3 ${textSecondary}`}>{t('wantsToAccess')}</p>
            <div className="space-y-2.5">
              {permissions.map((perm, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-2.5"
                >
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                  <span className={`text-sm ${textPrimary}`}>{perm}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className={`flex items-start gap-2 mb-6 text-xs ${textSecondary}`}>
            <Eye size={14} className="flex-shrink-0 mt-0.5" />
            <span>{t('authorizeDisclaimer')}</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={connecting}
              className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                theme === 'dark'
                  ? 'border-[#2a2a2a] text-gray-400 hover:bg-[#1a1a1a]'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              } ${connecting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleAuthorize}
              disabled={connecting}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              {connecting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t('connectingSecurely')}
                </>
              ) : (
                <>
                  <Lock size={14} />
                  {t('authorize')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Step 3: Importing Data ──────────────────────────────────────────────────

function ImportingStep({ bank, onComplete, theme }) {
  const { t } = useLanguage()
  const [completedSteps, setCompletedSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'

  useEffect(() => {
    const timers = importSteps.map((_, i) =>
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, i])
        setCurrentStep(i + 1)
      }, 1500 * (i + 1))
    )

    const doneTimer = setTimeout(() => {
      onComplete()
    }, 1500 * importSteps.length + 800)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  const progress = (completedSteps.length / importSteps.length) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${bank.color}15` }}
        >
          <Loader2 size={28} style={{ color: bank.color }} />
        </motion.div>
        <h2 className={`text-xl font-bold mb-2 ${textPrimary}`}>{t('importingData')}</h2>
        <p className={`text-sm ${textSecondary}`}>{t('importingFrom')} {bank.name}</p>
      </div>

      {/* Progress Bar */}
      <div className={`h-2 rounded-full overflow-hidden mb-8 ${theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-gray-100'}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500"
        />
      </div>

      {/* Steps */}
      <div className={`border rounded-2xl p-6 ${cardBg}`}>
        <div className="space-y-4">
          {importSteps.map((step, i) => {
            const isCompleted = completedSteps.includes(i)
            const isCurrent = currentStep === i && !isCompleted
            const text = step.text.replace('{bank}', bank.name)

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <CheckCircle2 size={20} className="text-emerald-400" />
                  </motion.div>
                ) : isCurrent ? (
                  <Loader2 size={20} className="text-blue-400 animate-spin" />
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 ${theme === 'dark' ? 'border-[#2a2a2a]' : 'border-gray-200'}`} />
                )}
                <div className="flex-1">
                  <span className={`text-sm ${isCompleted ? textPrimary : isCurrent ? 'text-blue-400' : textSecondary}`}>
                    {text}
                  </span>
                  {isCompleted && step.detail && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ml-2 text-xs text-emerald-400 font-medium"
                    >
                      ({step.detail})
                    </motion.span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Step 4: Results Summary ─────────────────────────────────────────────────

function ResultsStep({ bank, theme }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'

  // Save connection to localStorage
  useEffect(() => {
    localStorage.setItem('scoreku_bank_connected', 'true')
    localStorage.setItem('scoreku_bank_name', bank.name)
  }, [bank])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <Confetti trigger={true} />

      {/* Success Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle2 size={40} className="text-emerald-400" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`text-2xl font-bold mb-2 ${textPrimary}`}
        >
          {t('bankConnectedSuccess')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-sm ${textSecondary}`}
        >
          {bank.name} {t('bankLinked')}
        </motion.p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 200 }}
            className={`border rounded-2xl p-4 text-center ${cardBg}`}
          >
            <p className={`text-xs mb-2 ${textSecondary}`}>{card.label}</p>
            <p className="text-lg font-bold" style={{ color: card.color }}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Spending Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className={`border rounded-2xl p-6 mb-6 ${cardBg}`}
      >
        <h3 className={`text-sm font-semibold mb-4 ${textPrimary}`}>{t('spendingCategories')}</h3>
        <div className="space-y-3">
          {spendingData.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className={`text-xs w-16 ${textSecondary}`}>{item.label}</span>
              <div className={`flex-1 h-3 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-gray-100'}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ delay: 1 + i * 0.15, duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
              <span className={`text-xs font-medium w-10 text-right ${textPrimary}`}>{item.pct}%</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Score Updated Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="flex items-center justify-center gap-2 mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
      >
        <Sparkles size={16} className="text-emerald-400" />
        <span className="text-sm font-medium text-emerald-400">{t('scoreUpdated')}</span>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <button
          onClick={() => navigate('/dashboard?demo=true')}
          className="flex-1 px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          {t('viewDashboard')}
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('scoreku_bank_connected')
            localStorage.removeItem('scoreku_bank_name')
            window.location.reload()
          }}
          className={`flex-1 px-6 py-3 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
            theme === 'dark'
              ? 'border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a]'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Building2 size={16} />
          {t('connectAnotherBank')}
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function BankConnectionPage() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [step, setStep] = useState(1) // 1=select, 2=auth, 3=import, 4=results
  const [selectedBank, setSelectedBank] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pageBg = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'

  const handleSelectBank = (bank) => {
    setSelectedBank(bank)
    setStep(2)
  }

  const handleAuthorize = () => {
    setStep(3)
  }

  const handleImportComplete = () => {
    setStep(4)
  }

  const handleCancel = () => {
    setSelectedBank(null)
    setStep(1)
  }

  return (
    <div className={`min-h-screen ${pageBg} ${textPrimary}`}>
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px] ${theme === 'dark' ? 'bg-blue-600/5' : 'bg-blue-200/20'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] ${theme === 'dark' ? 'bg-teal-600/5' : 'bg-teal-200/20'}`} />
      </div>

      {/* Mobile hamburger */}
      <button
        className={`lg:hidden fixed top-4 left-4 z-[55] p-2.5 border rounded-xl ${
          theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
        }`}
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={20} />
      </button>

      <AppSidebar activePath="/connect-bank" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="lg:ml-[260px] min-h-screen pb-8">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
          {/* Step Indicator */}
          {step < 4 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 mb-8"
            >
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      s === step
                        ? 'bg-blue-500 text-white'
                        : s < step
                        ? 'bg-emerald-500 text-white'
                        : theme === 'dark'
                        ? 'bg-[#1f1f1f] text-gray-500'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {s < step ? <CheckCircle2 size={16} /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-12 h-0.5 ${s < step ? 'bg-emerald-500' : theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* Back Button */}
          {step === 2 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleCancel}
              className={`flex items-center gap-2 mb-6 text-sm transition-all ${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <ArrowLeft size={16} />
              {t('backToBankSelection')}
            </motion.button>
          )}

          {/* Steps */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <SelectBankStep key="select" onSelect={handleSelectBank} theme={theme} />
            )}
            {step === 2 && selectedBank && (
              <AuthorizationStep
                key="auth"
                bank={selectedBank}
                onAuthorize={handleAuthorize}
                onCancel={handleCancel}
                theme={theme}
              />
            )}
            {step === 3 && selectedBank && (
              <ImportingStep
                key="import"
                bank={selectedBank}
                onComplete={handleImportComplete}
                theme={theme}
              />
            )}
            {step === 4 && selectedBank && (
              <ResultsStep key="results" bank={selectedBank} theme={theme} />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
