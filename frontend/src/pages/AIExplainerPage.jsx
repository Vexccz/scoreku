import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, ArrowLeft, Brain, Database, Cpu, BarChart3, Eye,
  ChevronDown, ChevronRight, Sparkles, Shield, Target,
  CheckCircle2, LayoutDashboard, FileText, Settings,
  SlidersHorizontal, Building2
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import ThemeToggle from '../components/ThemeToggle'
import AppSidebar from '../components/AppSidebar'



const pipelineSteps = [
  {
    id: 'input',
    title: 'Data Input',
    icon: Database,
    color: '#3b82f6',
    summary: 'Collect alternative financial data',
    details: [
      'E-wallet transaction history (DuitNow, TnG, GrabPay)',
      'Bill payment records (utilities, telco, subscriptions)',
      'Employment & income data',
      'Digital activity patterns (e-commerce, app usage)',
      '40+ raw features extracted per profile',
    ],
  },
  {
    id: 'features',
    title: 'Feature Engineering',
    icon: Cpu,
    color: '#8b5cf6',
    summary: 'Transform raw data into ML-ready features',
    details: [
      'Payment consistency ratio (on-time vs late)',
      'Transaction velocity & frequency patterns',
      'Income stability coefficient over 6 months',
      'Digital engagement score',
      'Behavioral clustering (spending categories)',
      'Temporal features (day-of-week, time patterns)',
    ],
  },
  {
    id: 'model',
    title: 'XGBoost Model',
    icon: Brain,
    color: '#14b8a6',
    summary: 'Gradient-boosted decision trees for prediction',
    details: [
      'Ensemble of 500 decision trees',
      'Learning rate: 0.05 with early stopping',
      'Max depth: 6 to prevent overfitting',
      'Trained on 10,000+ Malaysian profiles',
      'Cross-validated with 5-fold stratified splits',
      'Handles missing data natively',
    ],
  },
  {
    id: 'shap',
    title: 'SHAP Explainability',
    icon: Eye,
    color: '#f59e0b',
    summary: 'Make predictions transparent & trustworthy',
    details: [
      'SHapley Additive exPlanations for each prediction',
      'Per-feature contribution to final score',
      'Global feature importance ranking',
      'Identifies which factors help vs hurt score',
      'Ensures fairness across demographics',
      'Compliant with responsible AI guidelines',
    ],
  },
  {
    id: 'score',
    title: 'Credit Score',
    icon: Target,
    color: '#10b981',
    summary: 'Final score with full breakdown',
    details: [
      'Score range: 300-850 (CTOS format)',
      'Category: Excellent / Good / Fair / High Risk',
      'Top 5 contributing factors shown',
      'Personalized improvement recommendations',
      'Financial product eligibility matching',
      'Score generated in < 5 seconds',
    ],
  },
]

const modelMetrics = [
  { label: 'Accuracy', value: '89%', description: 'Correct predictions' },
  { label: 'AUC-ROC', value: '91%', description: 'Discrimination ability' },
  { label: 'Training Samples', value: '10K+', description: 'Malaysian profiles' },
  { label: 'Features Used', value: '40+', description: 'Alternative data points' },
]

const featureImportance = [
  { name: 'Payment Consistency', value: 0.23, color: '#3b82f6' },
  { name: 'Income Stability', value: 0.18, color: '#14b8a6' },
  { name: 'Transaction Frequency', value: 0.14, color: '#8b5cf6' },
  { name: 'Account Age', value: 0.11, color: '#f59e0b' },
  { name: 'Bill Payment History', value: 0.09, color: '#ec4899' },
  { name: 'Digital Engagement', value: 0.07, color: '#6366f1' },
  { name: 'E-commerce Activity', value: 0.06, color: '#14b8a6' },
  { name: 'Phone Number Stability', value: 0.05, color: '#f97316' },
  { name: 'Spending Diversity', value: 0.04, color: '#84cc16' },
  { name: 'Location Stability', value: 0.03, color: '#06b6d4' },
]

const shapExample = [
  { feature: 'Payment Consistency', value: '+8.2', positive: true },
  { feature: 'Income Stability', value: '+6.1', positive: true },
  { feature: 'Transaction Frequency', value: '+4.3', positive: true },
  { feature: 'Account Age', value: '+2.1', positive: true },
  { feature: 'E-commerce Returns', value: '-3.5', positive: false },
  { feature: 'Late Payments (2x)', value: '-5.8', positive: false },
]

const techBadges = [
  { name: 'XGBoost', color: '#14b8a6' },
  { name: 'SHAP', color: '#f59e0b' },
  { name: 'scikit-learn', color: '#3b82f6' },
  { name: 'Python', color: '#8b5cf6' },
  { name: 'Pandas', color: '#ec4899' },
  { name: 'NumPy', color: '#6366f1' },
]

// ─── Interactive SHAP Demo Config ────────────────────────────────────────────

const interactiveFeatures = [
  { key: 'income', label: 'Monthly Income (RM)', min: 1000, max: 15000, step: 500, default: 4000, weight: 0.0025 },
  { key: 'bills', label: 'Bill Payments On-Time (%)', min: 0, max: 100, step: 5, default: 70, weight: 0.15 },
  { key: 'ewallet', label: 'E-wallet Transactions/mo', min: 0, max: 100, step: 5, default: 30, weight: 0.08 },
  { key: 'accountAge', label: 'Account Age (months)', min: 1, max: 60, step: 1, default: 12, weight: 0.2 },
  { key: 'ecommerce', label: 'E-commerce Orders/mo', min: 0, max: 50, step: 1, default: 10, weight: 0.12 },
]

function computeShapValues(values) {
  const baseScore = 550
  const contributions = []

  // Income: normalized 0-1 from range, contribution -8 to +12
  const incomeNorm = (values.income - 1000) / (15000 - 1000)
  contributions.push({ label: 'Income', value: (incomeNorm - 0.3) * 16, raw: values.income })

  // Bills: direct percentage, contribution -12 to +10
  const billsNorm = values.bills / 100
  contributions.push({ label: 'Bill Payments', value: (billsNorm - 0.5) * 20, raw: values.bills })

  // E-wallet: normalized, contribution -5 to +8
  const ewalletNorm = values.ewallet / 100
  contributions.push({ label: 'E-wallet Usage', value: (ewalletNorm - 0.3) * 12, raw: values.ewallet })

  // Account age: normalized, contribution -6 to +8
  const ageNorm = values.accountAge / 60
  contributions.push({ label: 'Account Age', value: (ageNorm - 0.3) * 11, raw: values.accountAge })

  // E-commerce: sweet spot around 15-25, too much or too little hurts
  const ecomNorm = values.ecommerce / 50
  const ecomOptimal = 1 - Math.abs(ecomNorm - 0.4) * 2
  contributions.push({ label: 'E-commerce', value: (ecomOptimal - 0.2) * 10, raw: values.ecommerce })

  // Scale contributions for 300-850 range
  const scaledContributions = contributions.map(c => ({ ...c, value: c.value * 5.5 }))
  const totalContribution = scaledContributions.reduce((sum, c) => sum + c.value, 0)
  const finalScore = Math.max(300, Math.min(850, Math.round(baseScore + totalContribution)))

  return { baseScore, contributions: scaledContributions, finalScore }
}

function InteractiveSHAPDemo() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [values, setValues] = useState(() => {
    const initial = {}
    interactiveFeatures.forEach(f => { initial[f.key] = f.default })
    return initial
  })

  const { baseScore, contributions, finalScore } = computeShapValues(values)
  const maxBar = Math.max(...contributions.map(c => Math.abs(c.value)), 1)

  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const sliderTrack = theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-gray-200'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  return (
    <section className="mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <SlidersHorizontal size={20} className="text-teal-400" />
          <h2 className={`text-2xl font-bold ${textPrimary}`}>{t('tryItYourself')}</h2>
        </div>
        <p className={`text-sm ${textSecondary}`}>{t('tryItYourselfDesc')}</p>
      </motion.div>

      <div className={`border rounded-2xl p-6 md:p-8 ${cardBg}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sliders */}
          <div className="space-y-6">
            <h3 className={`text-sm font-semibold mb-4 ${textPrimary}`}>{t('inputFeatures')}</h3>
            {interactiveFeatures.map((feat) => (
              <div key={feat.key}>
                <div className="flex items-center justify-between mb-2">
                  <label className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{feat.label}</label>
                  <span className="text-sm font-mono font-medium text-emerald-400">
                    {feat.key === 'income' ? `RM${values[feat.key].toLocaleString()}` : values[feat.key]}
                    {feat.key === 'bills' ? '%' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min={feat.min}
                  max={feat.max}
                  step={feat.step}
                  value={values[feat.key]}
                  onChange={(e) => setValues(prev => ({ ...prev, [feat.key]: Number(e.target.value) }))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-emerald-500"
                  style={{
                    background: `linear-gradient(to right, #2563eb 0%, #14b8a6 ${((values[feat.key] - feat.min) / (feat.max - feat.min)) * 100}%, ${theme === 'dark' ? '#1f1f1f' : '#e5e7eb'} ${((values[feat.key] - feat.min) / (feat.max - feat.min)) * 100}%, ${theme === 'dark' ? '#1f1f1f' : '#e5e7eb'} 100%)`,
                  }}
                />
                <div className="flex justify-between mt-1">
                  <span className={`text-[10px] ${textSecondary}`}>{feat.key === 'income' ? `RM${feat.min.toLocaleString()}` : feat.min}</span>
                  <span className={`text-[10px] ${textSecondary}`}>{feat.key === 'income' ? `RM${feat.max.toLocaleString()}` : feat.max}</span>
                </div>
              </div>
            ))}
          </div>

          {/* SHAP Waterfall */}
          <div>
            <h3 className={`text-sm font-semibold mb-4 ${textPrimary}`}>{t('shapWaterfall')}</h3>

            {/* Base score */}
            <div className={`flex items-center gap-3 mb-3 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
              <span className={`text-xs ${textSecondary}`}>{t('baseScore')}</span>
              <span className={`ml-auto text-sm font-mono font-medium ${textPrimary}`}>{baseScore}</span>
            </div>

            {/* Contribution bars */}
            <div className="space-y-2.5 mb-4">
              {contributions.map((c, i) => {
                const isPositive = c.value >= 0
                const barWidth = Math.min(Math.abs(c.value) / maxBar * 100, 100)
                return (
                  <motion.div
                    key={c.label}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <span className={`text-xs w-28 shrink-0 truncate ${textSecondary}`}>{c.label}</span>
                    <div className="flex-1 flex items-center h-7 relative">
                      <div className={`absolute inset-y-0 left-1/2 w-px ${theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-gray-300'}`} />
                      {isPositive ? (
                        <motion.div
                          className="absolute left-1/2 h-5 rounded-r-full"
                          style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)', border: '1px solid rgba(16, 185, 129, 0.5)' }}
                          animate={{ width: `${barWidth / 2}%` }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      ) : (
                        <motion.div
                          className="absolute h-5 rounded-l-full"
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.3)',
                            border: '1px solid rgba(239, 68, 68, 0.5)',
                            right: '50%',
                          }}
                          animate={{ width: `${barWidth / 2}%` }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </div>
                    <motion.span
                      className="text-xs font-mono w-12 text-right shrink-0 font-medium"
                      style={{ color: isPositive ? '#10b981' : '#ef4444' }}
                      key={c.value.toFixed(1)}
                    >
                      {isPositive ? '+' : ''}{c.value.toFixed(1)}
                    </motion.span>
                  </motion.div>
                )
              })}
            </div>

            {/* Final score */}
            <div className={`flex items-center gap-3 px-3 py-3 rounded-xl border ${
              theme === 'dark' ? 'bg-[#0d0d0d] border-[#1f1f1f]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-sm font-semibold ${textPrimary}`}>{t('predictedScore')}</span>
              <motion.span
                className="ml-auto text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent"
                key={finalScore}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {finalScore}
              </motion.span>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-xs">
              <span className={`flex items-center gap-1.5 ${textSecondary}`}>
                <span className="w-3 h-3 rounded-sm bg-green-500/30 border border-green-500/40" />
                {t('positive')}
              </span>
              <span className={`flex items-center gap-1.5 ${textSecondary}`}>
                <span className="w-3 h-3 rounded-sm bg-red-500/30 border border-red-500/40" />
                {t('negative')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PipelineStep({ step, isOpen, onToggle, index }) {
  const { theme } = useTheme()
  const cardBg = theme === 'dark' ? 'bg-[#111]' : 'bg-white'
  const borderDefault = theme === 'dark' ? 'border-[#1f1f1f] hover:border-[#2a2a2a]' : 'border-gray-200 hover:border-gray-300'
  const detailBg = theme === 'dark' ? 'bg-[#0d0d0d] border-[#1a1a1a]' : 'bg-gray-50 border-gray-200'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <button
        onClick={onToggle}
        className={`w-full text-left ${cardBg} border rounded-2xl p-6 transition-all duration-300 ${
          isOpen ? 'border-opacity-50 shadow-lg' : borderDefault
        }`}
        style={{
          borderColor: isOpen ? `${step.color}40` : undefined,
          boxShadow: isOpen ? `0 4px 24px ${step.color}10` : undefined,
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}
            >
              <step.icon size={20} style={{ color: step.color }} />
            </div>
            <div>
              <h3 className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
              <p className="text-sm text-gray-500">{step.summary}</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={18} className="text-gray-500" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-2 pt-3">
              <div className={`border rounded-xl p-5 ml-13 ${detailBg}`}>
                <ul className="space-y-2.5">
                  {step.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-start gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: step.color }} />
                      {detail}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AIExplainerPage() {
  const [openStep, setOpenStep] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme } = useTheme()
  const { t } = useLanguage()

  const pageBg = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'

  return (
    <div className={`min-h-screen ${pageBg} ${textPrimary}`}>
      {/* Mobile hamburger */}
      <button
        className={`lg:hidden fixed top-4 left-4 z-[55] p-2.5 border rounded-xl ${
          theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
        }`}
        onClick={() => setSidebarOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <AppSidebar activePath="/ai" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 pt-12 lg:pt-0"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="mb-6"
          >
            <img 
              src="/ai-assistant-icon.png" 
              alt="AI Assistant" 
              className="w-24 h-24 mx-auto mb-4 drop-shadow-2xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium mb-6"
          >
            <Sparkles size={12} /> {t('transparentExplainableAI')}
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t('howOurAIWorks').split('AI')[0]}<span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">AI</span>{t('howOurAIWorks').split('AI')[1]}
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${textSecondary}`}>
            {t('aiHeroDesc')}
          </p>
        </motion.div>

        {/* Pipeline Visualization */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-6"
          >
            <BarChart3 size={18} className="text-emerald-400" />
            <h2 className="text-xl font-bold">{t('mlPipeline')}</h2>
          </motion.div>

          <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2">
            {pipelineSteps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border shrink-0"
                  style={{ background: `${step.color}10`, borderColor: `${step.color}30` }}
                >
                  <step.icon size={14} style={{ color: step.color }} />
                  <span className="text-xs font-medium whitespace-nowrap" style={{ color: step.color }}>{step.title}</span>
                </motion.div>
                {i < pipelineSteps.length - 1 && (
                  <ChevronRight size={14} className="text-gray-600 shrink-0" />
                )}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {pipelineSteps.map((step, i) => (
              <PipelineStep
                key={step.id}
                step={step}
                index={i}
                isOpen={openStep === step.id}
                onToggle={() => setOpenStep(openStep === step.id ? null : step.id)}
              />
            ))}
          </div>
        </section>

        {/* Model Metrics */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-2">{t('modelPerformance')}</h2>
            <p className={`text-sm ${textSecondary}`}>{t('modelPerformanceDesc')}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {modelMetrics.map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`border rounded-2xl p-6 text-center hover:border-teal-500/20 transition-all duration-300 ${cardBg}`}
              >
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-1">
                  {metric.value}
                </p>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{metric.label}</p>
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>{metric.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Feature Importance */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-2">{t('featureImportance')}</h2>
            <p className={`text-sm ${textSecondary}`}>{t('featureImportanceDesc')}</p>
          </motion.div>

          <div className={`border rounded-2xl p-6 md:p-8 ${cardBg}`}>
            <div className="space-y-4">
              {featureImportance.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <span className={`text-sm w-44 shrink-0 truncate ${textSecondary}`}>{feature.name}</span>
                  <div className={`flex-1 h-6 rounded-full overflow-hidden relative ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-100'}`}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: feature.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${feature.value * 100 / 0.23}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                    />
                  </div>
                  <span className={`text-sm font-mono w-12 text-right shrink-0 ${textSecondary}`}>
                    {(feature.value * 100).toFixed(0)}%
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SHAP Explanation Example */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-2">{t('shapExplanation')}</h2>
            <p className={`text-sm ${textSecondary}`}>{t('shapExplanationDesc')}</p>
          </motion.div>

          <div className={`border rounded-2xl p-6 md:p-8 ${cardBg}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Eye size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className={`text-sm font-medium ${textPrimary}`}>Example: User Score 72</p>
                <p className={`text-xs ${textSecondary}`}>Base score: 60 → Final: 72 (net +12)</p>
              </div>
            </div>

            <div className="space-y-3">
              {shapExample.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: item.positive ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4"
                >
                  <span className={`text-sm w-44 shrink-0 truncate ${textSecondary}`}>{item.feature}</span>
                  <div className="flex-1 flex items-center justify-center relative h-8">
                    <div className={`absolute inset-y-0 left-1/2 w-px ${theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-gray-300'}`} />
                    {item.positive ? (
                      <motion.div
                        className="absolute left-1/2 h-6 rounded-r-full bg-green-500/30 border border-green-500/40"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${parseFloat(item.value) * 6}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                      />
                    ) : (
                      <motion.div
                        className="absolute right-1/2 h-6 rounded-l-full bg-red-500/30 border border-red-500/40"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.abs(parseFloat(item.value)) * 6}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                      />
                    )}
                  </div>
                  <span
                    className="text-sm font-mono w-14 text-right shrink-0 font-medium"
                    style={{ color: item.positive ? '#10b981' : '#ef4444' }}
                  >
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className={`mt-6 pt-4 border-t flex items-center justify-between ${theme === 'dark' ? 'border-[#1f1f1f]' : 'border-gray-200'}`}>
              <div className={`flex items-center gap-4 text-xs ${textSecondary}`}>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-green-500/30 border border-green-500/40" />
                  {t('helpingScore')}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-red-500/30 border border-red-500/40" />
                  {t('hurtingScore')}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive SHAP Demo */}
        <InteractiveSHAPDemo />

        {/* Tech Badges */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-xl font-bold mb-6">{t('builtWith')}</h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {techBadges.map((badge, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-2 rounded-xl text-sm font-medium border"
                  style={{
                    background: `${badge.color}10`,
                    borderColor: `${badge.color}30`,
                    color: badge.color,
                  }}
                >
                  {badge.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className={`border rounded-3xl p-10 ${cardBg}`}>
            <Shield size={32} className="text-teal-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">{t('responsibleAI')}</h2>
            <p className={`text-sm max-w-lg mx-auto mb-6 ${textSecondary}`}>
              {t('responsibleAIDesc')}
            </p>
            <Link
              to="/score"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-base font-medium text-white transition-all duration-300 shadow-lg shadow-emerald-600/20"
            >
              {t('tryItYourself')} <ChevronRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
      </main>
    </div>
  )
}
