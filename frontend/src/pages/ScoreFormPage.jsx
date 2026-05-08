import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import toast from 'react-hot-toast'
import { ChevronRight, ChevronLeft, Wallet, CreditCard, Receipt, ShoppingBag, Loader2, CheckCircle2, Sparkles, Brain, BarChart3, Shield } from 'lucide-react'

const steps = [
  { title: 'Income & Employment', subtitle: 'Tell us about your earnings', fields: ['monthlyIncome', 'employmentType'], icon: Wallet, color: 'from-blue-500 to-blue-600', label: 'Income' },
  { title: 'Digital Payments', subtitle: 'Your e-wallet activity', fields: ['ewalletUsage', 'duitnowTransactions'], icon: CreditCard, color: 'from-teal-500 to-teal-600', label: 'Payments' },
  { title: 'Bills & Rent', subtitle: 'Payment consistency matters', fields: ['billsPaid', 'billsTotal', 'rentOnTime'], icon: Receipt, color: 'from-purple-500 to-purple-600', label: 'Bills' },
  { title: 'Online Activity', subtitle: 'Your digital footprint', fields: ['ecommerceOrders', 'mobileRecharges'], icon: ShoppingBag, color: 'from-amber-500 to-amber-600', label: 'Activity' },
]

const employmentTypes = ['salaried', 'self-employed', 'daily-wage', 'freelance', 'gig']

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

const analysisSteps = [
  { icon: Brain, text: 'Collecting data...' },
  { icon: BarChart3, text: 'Running AI model...' },
  { icon: Sparkles, text: 'Calculating score...' },
  { icon: CheckCircle2, text: 'Done!' },
]

export default function ScoreFormPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [loading, setLoading] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
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
    }, 800)

    try {
      const { data } = await api.post('/score/calculate', {
        monthly_income: Number(form.monthlyIncome),
        employment_type: form.employmentType,
        ewallet_transactions: Number(form.ewalletUsage),
        duitnow_transactions: Number(form.duitnowTransactions),
        bills_paid: Number(form.billsPaid),
        bills_total: Number(form.billsTotal),
        rent_on_time_months: Number(form.rentOnTime),
        ecommerce_orders: Number(form.ecommerceOrders),
        mobile_recharges: Number(form.mobileRecharges),
      })
      clearInterval(stepInterval)
      toast.success('Score calculated!')
      navigate('/dashboard', { state: { result: data } })
    } catch (err) {
      clearInterval(stepInterval)
      toast.error(err.response?.data?.message || 'Failed to calculate score')
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
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-[#111]/90 backdrop-blur-sm border border-[#1f1f1f] rounded-3xl p-10 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
          <h3 className="text-xl font-bold mb-2">Analyzing Your Profile</h3>
          <p className="text-sm text-gray-400 mb-8">Our AI is crunching your data...</p>
          <div className="space-y-3 text-left">
            {analysisSteps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: i <= analysisStep ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex items-center gap-3"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${i <= analysisStep ? 'bg-blue-500/20' : 'bg-[#1a1a1a]'}`}>
                  <s.icon size={16} className={i <= analysisStep ? 'text-blue-400' : 'text-gray-600'} />
                </div>
                <span className={`text-sm ${i <= analysisStep ? 'text-gray-200' : 'text-gray-600'}`}>{s.text}</span>
                {i < analysisStep && <CheckCircle2 size={14} className="text-teal-400 ml-auto" />}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  const StepIcon = steps[step].icon

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-8">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-teal-600/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">ScoreKu</span>
        </div>

        {/* Step indicator with labels */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={{
                    scale: i === step ? 1.15 : 1,
                    backgroundColor: i <= step ? '#2563eb' : '#1a1a1a',
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors"
                  style={{ borderColor: i <= step ? '#2563eb' : '#2a2a2a' }}
                >
                  {i < step ? (
                    <CheckCircle2 size={18} className="text-white" />
                  ) : (
                    <s.icon size={16} className={i <= step ? 'text-white' : 'text-gray-600'} />
                  )}
                </motion.div>
                <span className={`text-[10px] font-medium ${i <= step ? 'text-blue-400' : 'text-gray-600'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-6 h-0.5 rounded-full transition-colors mb-5 ${i < step ? 'bg-blue-500' : 'bg-[#2a2a2a]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <motion.div
          layout
          className="bg-[#111]/90 backdrop-blur-sm border border-[#1f1f1f] rounded-3xl p-8 shadow-2xl"
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
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${steps[step].color} flex items-center justify-center mb-4 opacity-90`}>
                <StepIcon size={22} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-1">{steps[step].title}</h2>
              <p className="text-sm text-gray-400">{steps[step].subtitle}</p>
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
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {step === 0 && (
                <>
                  <InputField label="Monthly Income" prefix="RM" value={form.monthlyIncome} onChange={(v) => update('monthlyIncome', v)} type="number" placeholder="3500" helper={fieldHelpers.monthlyIncome} icon="💰" />
                  <div>
                    <label className="block text-sm text-gray-300 mb-2 font-medium">Employment Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {employmentTypes.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => update('employmentType', t)}
                          className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
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
                  <InputField label="E-wallet Transactions/Month" value={form.ewalletUsage} onChange={(v) => update('ewalletUsage', v)} type="number" placeholder="25" helper={fieldHelpers.ewalletUsage} icon="📱" />
                  <InputField label="DuitNow Transactions/Month" value={form.duitnowTransactions} onChange={(v) => update('duitnowTransactions', v)} type="number" placeholder="15" helper={fieldHelpers.duitnowTransactions} icon="🏦" />
                </>
              )}
              {step === 2 && (
                <>
                  <InputField label="Utility Bills Paid (last 12 months)" value={form.billsPaid} onChange={(v) => update('billsPaid', v)} type="number" placeholder="11" helper={fieldHelpers.billsPaid} icon="💡" />
                  <InputField label="Total Utility Bills (last 12 months)" value={form.billsTotal} onChange={(v) => update('billsTotal', v)} type="number" placeholder="12" helper={fieldHelpers.billsTotal} icon="📋" />
                  <InputField label="Rent Paid On Time (months)" value={form.rentOnTime} onChange={(v) => update('rentOnTime', v)} type="number" placeholder="10" helper={fieldHelpers.rentOnTime} icon="🏠" />
                </>
              )}
              {step === 3 && (
                <>
                  <InputField label="E-commerce Orders/Month" value={form.ecommerceOrders} onChange={(v) => update('ecommerceOrders', v)} type="number" placeholder="5" helper={fieldHelpers.ecommerceOrders} icon="🛒" />
                  <InputField label="Mobile Recharges/Month" value={form.mobileRecharges} onChange={(v) => update('mobileRecharges', v)} type="number" placeholder="2" helper={fieldHelpers.mobileRecharges} icon="📶" />
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-10">
            <button
              onClick={prev}
              disabled={step === 0}
              className="flex items-center gap-1.5 px-5 py-2.5 text-sm text-gray-400 hover:text-white disabled:opacity-0 disabled:pointer-events-none transition rounded-xl hover:bg-white/5"
            >
              <ChevronLeft size={16} /> Back
            </button>
            {step === steps.length - 1 ? (
              <button
                onClick={next}
                disabled={loading}
                className="relative flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 rounded-xl font-semibold transition disabled:opacity-50 shadow-lg shadow-blue-600/20 overflow-hidden"
              >
                {/* Shimmer effect */}
                <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <Sparkles size={16} /> Get Score
              </button>
            ) : (
              <button
                onClick={next}
                disabled={loading}
                className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-semibold transition disabled:opacity-50 shadow-lg shadow-blue-600/20"
              >
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

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
          className={`w-full ${prefix ? 'pl-[4.5rem]' : icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition text-white placeholder-gray-600`}
        />
      </div>
      {helper && <p className="text-xs text-gray-500 mt-1.5 ml-1">{helper}</p>}
    </div>
  )
}
