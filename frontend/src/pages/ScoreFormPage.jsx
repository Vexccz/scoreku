import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  ChevronRight, ChevronLeft, Wallet, CreditCard, Receipt, ShoppingBag,
  Loader2, CheckCircle2, Sparkles, BarChart3, Shield, Lock,
  Menu, Info, Zap,
  HelpCircle, Eye, Database, Cpu, Award
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import AppSidebar from '../components/AppSidebar'

// ─── Navigation Items (same as Dashboard) ────────────────────────────────────



// ─── Steps Config ────────────────────────────────────────────────────────────

const steps = [
  { titleKey: 'stepIncomeTitle', subtitleKey: 'stepIncomeSubtitle', fields: ['monthlyIncome', 'employmentType'], icon: Wallet, color: 'from-blue-500 to-blue-600', labelKey: 'stepIncomeLabel' },
  { titleKey: 'stepPaymentsTitle', subtitleKey: 'stepPaymentsSubtitle', fields: ['ewalletUsage', 'duitnowTransactions'], icon: CreditCard, color: 'from-teal-500 to-teal-600', labelKey: 'stepPaymentsLabel' },
  { titleKey: 'stepBillsTitle', subtitleKey: 'stepBillsSubtitle', fields: ['billsPaid', 'billsTotal', 'rentOnTime'], icon: Receipt, color: 'from-purple-500 to-purple-600', labelKey: 'stepBillsLabel' },
  { titleKey: 'stepActivityTitle', subtitleKey: 'stepActivitySubtitle', fields: ['ecommerceOrders', 'mobileRecharges'], icon: ShoppingBag, color: 'from-amber-500 to-amber-600', labelKey: 'stepActivityLabel' },
]

const employmentTypes = ['salaried', 'self-employed', 'daily-wage', 'freelance', 'gig']

// eslint-disable-next-line no-unused-vars
const fieldHelpers = {
  monthlyIncome: 'Average Malaysian earns RM3,500/month',
  ewalletUsage: 'Include Touch n Go, GrabPay, Boost, etc.',
  duitnowTransactions: 'Bank transfers via DuitNow QR or ID',
  billsPaid: 'Electricity, water, internet, phone bills',
  billsTotal: 'Total bills you were supposed to pay',
  rentOnTime: 'How many months you paid rent on time',
  ecommerceOrders: 'Shopee, Lazada, etc. orders per month',
  mobileRecharges: 'Prepaid top-ups or postpaid payments',
}

// ─── Step-specific info panel content ────────────────────────────────────────

const stepInfoContent = [
  {
    why: 'Income stability is the #1 factor in credit scoring. We look at consistency, not just amount.',
    icon: Wallet,
  },
  {
    why: 'E-wallet activity shows financial engagement. More transactions = more data points for accurate scoring.',
    icon: CreditCard,
  },
  {
    why: 'Payment consistency is crucial. Paying bills on time shows reliability to lenders.',
    icon: Receipt,
  },
  {
    why: 'Digital footprint helps paint a complete picture of your financial behavior.',
    icon: ShoppingBag,
  },
]

// ─── Analysis Steps ──────────────────────────────────────────────────────────

const analysisSteps = [
  { icon: Database, text: 'Collecting your data...' },
  { icon: Cpu, text: 'Running AI model (XGBoost)...' },
  { icon: BarChart3, text: 'Calculating SHAP values...' },
  { icon: Award, text: 'Generating your score...' },
]

// ─── Sidebar Component ───────────────────────────────────────────────────────



// ─── Main Component ──────────────────────────────────────────────────────────

export default function ScoreFormPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [loading, setLoading] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [form, setForm] = useState({
    monthlyIncome: '',
    employmentType: 'salaried',
    ewalletUsage: '',
    duitnowTransactions: '',
    billsPaid: '',
    billsTotal: '',
    rentOnTime: '',
    ecommerceOrders: '',
    mobileRecharges: '',
  })

  const update = (key, val) => setForm({ ...form, [key]: val })

  const handleSubmit = async () => {
    setLoading(true)
    setAnalysisStep(0)

    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => {
        if (prev >= analysisSteps.length - 1) {
          clearInterval(stepInterval)
          return prev
        }
        return prev + 1
      })
    }, 900)

    const payload = {
      monthly_income: Number(form.monthlyIncome),
      employment_type: form.employmentType,
      ewallet_transactions: Number(form.ewalletUsage),
      duitnow_transactions: Number(form.duitnowTransactions),
      bills_paid: Number(form.billsPaid),
      bills_total: Number(form.billsTotal),
      rent_on_time_months: Number(form.rentOnTime),
      ecommerce_orders: Number(form.ecommerceOrders),
      mobile_recharges: Number(form.mobileRecharges),
    }

    try {
      const { data } = await api.post('/score', payload)
      clearInterval(stepInterval)
      toast.success('Score calculated!')
      // Store result in localStorage for history tracking
      const historyEntry = {
        date: new Date().toLocaleDateString('en-MY', { month: 'short', year: 'numeric' }),
        score: data.score,
        change: null,
        category: data.riskCategory || 'Good',
        timestamp: Date.now(),
      }
      const existing = JSON.parse(localStorage.getItem('scoreku_history') || '[]')
      // Update change relative to last entry
      if (existing.length > 0) {
        historyEntry.change = data.score - existing[existing.length - 1].score
      }
      existing.push(historyEntry)
      localStorage.setItem('scoreku_history', JSON.stringify(existing))
      localStorage.setItem('scoreku_pending_result', JSON.stringify(data))
      navigate('/dashboard', { state: { result: data } })
    } catch (err) {
      clearInterval(stepInterval)
      // Backend down — show informative error and offer demo mode
      const msg = err.response?.data?.message || err.message || 'Failed to connect to backend'
      if (!err.response || err.code === 'ERR_NETWORK') {
        toast.error('Backend offline. Redirecting to demo dashboard...')
        setTimeout(() => navigate('/dashboard?demo=true'), 1500)
      } else {
        toast.error(msg)
      }
      setLoading(false)
    }
  }

  const next = () => {
    setDirection(1)
    if (step < steps.length - 1) setStep(step + 1)
    else handleSubmit()
  }
  const prev = () => {
    setDirection(-1)
    if (step > 0) setStep(step - 1)
  }

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  }

  // ─── Loading/Analysis Overlay ────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-600/5 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-[#111]/95 backdrop-blur-md border border-[#1f1f1f] rounded-3xl p-12 text-center max-w-md w-full shadow-2xl"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">ScoreKu</span>
          </div>

          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-white">{t('analyzingProfile')}</h3>
          <p className="text-sm text-gray-400 mb-10">{t('analyzingDesc')}</p>

          <div className="space-y-4 text-left">
            {analysisSteps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: i <= analysisStep ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.3, duration: 0.4 }}
                className="flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  i < analysisStep ? 'bg-teal-500/20' : i === analysisStep ? 'bg-blue-500/20' : 'bg-[#1a1a1a]'
                }`}>
                  {i < analysisStep ? (
                    <CheckCircle2 size={18} className="text-teal-400" />
                  ) : (
                    <s.icon size={18} className={i === analysisStep ? 'text-blue-400 animate-pulse' : 'text-gray-600'} />
                  )}
                </div>
                <div className="flex-1">
                  <span className={`text-sm font-medium ${i <= analysisStep ? 'text-gray-200' : 'text-gray-600'}`}>{s.text}</span>
                </div>
                {i < analysisStep && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <CheckCircle2 size={16} className="text-teal-400" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-10 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((analysisStep + 1) / analysisSteps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── Main Form Layout ────────────────────────────────────────────────────

  const StepIcon = steps[step].icon
  const currentInfo = stepInfoContent[step]
  const InfoIcon = currentInfo.icon

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <AppSidebar activePath="/score" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1f1f1f] z-50 flex items-center px-4">
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-[#1a1a1a] transition">
          <Menu size={20} className="text-gray-400" />
        </button>
        <div className="flex items-center gap-2 ml-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
            <Shield size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">ScoreKu</span>
        </div>
        <div className="ml-auto text-xs text-gray-500">Step {step + 1}/{steps.length}</div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-[260px] min-h-screen pt-14 lg:pt-0">
        {/* Background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none lg:ml-[260px]">
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-teal-600/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('scoreFormTitle')}</h1>
            <p className="text-sm sm:text-base text-gray-400">{t('scoreFormSubtitle')}</p>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between max-w-lg">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{
                        scale: i === step ? 1.1 : 1,
                        backgroundColor: i < step ? '#14b8a6' : i === step ? '#2563eb' : '#1a1a1a',
                      }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 transition-colors"
                      style={{ borderColor: i < step ? '#14b8a6' : i === step ? '#2563eb' : '#2a2a2a' }}
                    >
                      {i < step ? (
                        <CheckCircle2 size={18} className="text-white" />
                      ) : (
                        <s.icon size={16} className={i === step ? 'text-white' : 'text-gray-600'} />
                      )}
                    </motion.div>
                    <span className={`text-[10px] sm:text-xs font-medium mt-2 ${
                      i < step ? 'text-teal-400' : i === step ? 'text-blue-400' : 'text-gray-600'
                    }`}>
                      {t(s.labelKey)}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-8 sm:w-14 lg:w-20 h-0.5 rounded-full mx-1 sm:mx-2 mb-5 transition-colors duration-500 ${
                      i < step ? 'bg-teal-500' : 'bg-[#2a2a2a]'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Left Column - Form (3/5) */}
            <div className="lg:col-span-3">
              <motion.div
                layout
                className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 shadow-xl"
              >
                {/* Step header */}
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="mb-8"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${steps[step].color} flex items-center justify-center opacity-90`}>
                        <StepIcon size={22} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold">{t(steps[step].titleKey)}</h2>
                        <p className="text-sm text-gray-400">{t(steps[step].subtitleKey)}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Form fields */}
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    {step === 0 && (
                      <>
                        <InputField label={t('monthlyIncomeLabel')} prefix="RM" value={form.monthlyIncome} onChange={(v) => update('monthlyIncome', v)} type="number" placeholder="3500" helper={t('helperIncome')} icon="💰" />
                        <div>
                          <label className="block text-sm text-gray-300 mb-3 font-medium">{t('employmentTypeLabel')}</label>
                          <div className="grid grid-cols-2 gap-3">
                            {employmentTypes.map(t => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => update('employmentType', t)}
                                className={`px-4 py-3.5 rounded-xl text-sm font-medium transition-all min-h-[48px] ${
                                  form.employmentType === t
                                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 border'
                                    : 'bg-[#0a0a0a] border border-[#2a2a2a] text-gray-400 hover:border-gray-600'
                                }`}
                              >
                                {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {step === 1 && (
                      <>
                        <InputField label={t('ewalletTransLabel')} value={form.ewalletUsage} onChange={(v) => update('ewalletUsage', v)} type="number" placeholder="25" helper={t('helperEwallet')} icon="📱" />
                        <InputField label={t('duitnowTransLabel')} value={form.duitnowTransactions} onChange={(v) => update('duitnowTransactions', v)} type="number" placeholder="15" helper={t('helperDuitnow')} icon="🏦" />
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <InputField label={t('billsPaidLabel')} value={form.billsPaid} onChange={(v) => update('billsPaid', v)} type="number" placeholder="11" helper={t('helperBillsPaid')} icon="💡" />
                        <InputField label={t('billsTotalLabel')} value={form.billsTotal} onChange={(v) => update('billsTotal', v)} type="number" placeholder="12" helper={t('helperBillsTotal')} icon="📋" />
                        <InputField label={t('rentOnTimeLabel')} value={form.rentOnTime} onChange={(v) => update('rentOnTime', v)} type="number" placeholder="10" helper={t('helperRent')} icon="🏠" />
                      </>
                    )}
                    {step === 3 && (
                      <>
                        <InputField label={t('ecommerceOrdersLabel')} value={form.ecommerceOrders} onChange={(v) => update('ecommerceOrders', v)} type="number" placeholder="5" helper={t('helperEcommerce')} icon="🛒" />
                        <InputField label={t('mobileRechargesLabel')} value={form.mobileRecharges} onChange={(v) => update('mobileRecharges', v)} type="number" placeholder="2" helper={t('helperMobile')} icon="📶" />
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between mt-10 pt-6 border-t border-[#1f1f1f]">
                  <button
                    onClick={prev}
                    disabled={step === 0}
                    className="flex items-center gap-1.5 px-6 py-3.5 text-sm text-gray-400 hover:text-white disabled:opacity-0 disabled:pointer-events-none transition rounded-xl hover:bg-white/5 min-h-[48px]"
                  >
                    <ChevronLeft size={16} /> {t('back')}
                  </button>
                  {step === steps.length - 1 ? (
                    <button
                      onClick={next}
                      disabled={loading}
                      className="relative flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 rounded-xl font-semibold transition disabled:opacity-50 shadow-lg shadow-blue-600/20 overflow-hidden min-h-[48px]"
                    >
                      <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <Sparkles size={16} /> {t('getMyScore')}
                    </button>
                  ) : (
                    <button
                      onClick={next}
                      disabled={loading}
                      className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-semibold transition disabled:opacity-50 shadow-lg shadow-blue-600/20 min-h-[48px]"
                    >
                      {t('next')} <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Info Panels (2/5) */}
            <div className="lg:col-span-2 space-y-5">
              {/* Why we need this */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Info size={16} className="text-blue-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-200">{t('whyWeNeedThis')}</h3>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{currentInfo.why}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
                    <InfoIcon size={14} />
                    <span>Step {step + 1} of {steps.length}</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Data Security */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center">
                    <Lock size={16} className="text-teal-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-200">{t('dataSecurity')}</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{t('dataSecurityDesc')}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">🔒 Encrypted</span>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">🛡️ PDPA</span>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">🚫 No Sharing</span>
                </div>
              </motion.div>

              {/* What happens next */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Zap size={16} className="text-purple-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-200">{t('whatHappensNext')}</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] text-blue-400 font-bold">1</span>
                    </div>
                    <p className="text-xs text-gray-400">Your data feeds into our XGBoost AI model</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] text-blue-400 font-bold">2</span>
                    </div>
                    <p className="text-xs text-gray-400">SHAP values explain which factors matter most</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] text-teal-400 font-bold">3</span>
                    </div>
                    <p className="text-xs text-gray-400">Get your score + personalized improvement tips</p>
                  </div>
                </div>
              </motion.div>

              {/* Need help */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-gradient-to-br from-blue-500/5 to-teal-500/5 border border-[#1f1f1f] rounded-2xl p-5 text-center"
              >
                <HelpCircle size={20} className="text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Need help? Check our <Link to="/ai" className="text-blue-400 hover:underline">How AI Works</Link> page</p>
              </motion.div>
            </div>
          </div>

          {/* Bottom Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Lock size={12} className="text-teal-500" />
              <span>256-bit {t('encrypted')}</span>
            </div>
            <div className="w-px h-3 bg-[#2a2a2a] hidden sm:block" />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield size={12} className="text-blue-500" />
              <span>{t('pdpa')}</span>
            </div>
            <div className="w-px h-3 bg-[#2a2a2a] hidden sm:block" />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Eye size={12} className="text-purple-500" />
              <span>{t('noSharing')}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ─── Input Field Component ───────────────────────────────────────────────────

function InputField({ label, value, onChange, type = 'text', placeholder, helper, icon, prefix }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2 font-medium">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">{icon}</span>
        )}
        {prefix && (
          <span className="absolute left-11 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${prefix ? 'pl-[4.5rem]' : icon ? 'pl-11' : 'pl-4'} pr-4 py-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition text-white placeholder-gray-600 text-base min-h-[52px]`}
        />
      </div>
      {helper && <p className="text-xs text-gray-500 mt-1.5 ml-1">{helper}</p>}
    </div>
  )
}
