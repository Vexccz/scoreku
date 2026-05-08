import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, ArrowLeft, Brain, Database, Cpu, BarChart3, Eye,
  ChevronDown, ChevronRight, Sparkles, Shield, Target,
  CheckCircle2, LayoutDashboard, FileText, Settings
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', active: false },
  { label: 'Score Form', icon: FileText, path: '/score', active: false },
  { label: 'Simulator', icon: Zap, path: '/simulation', active: false },
  { label: 'AI Model', icon: Brain, path: '/ai', active: true },
  { label: 'Settings', icon: Settings, path: null, disabled: true },
]

function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {mobileOpen && (
        <motion.div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      <aside className={`flex flex-col fixed left-0 top-0 bottom-0 w-[260px] bg-[#0f0f0f] border-r border-[#1f1f1f] z-[70] transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            ScoreKu
          </span>
        </div>
        <nav className="flex-1 px-3 mt-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              if (item.disabled) {
                return (
                  <div key={item.label} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 cursor-not-allowed">
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                    <span className="ml-auto text-[10px] bg-[#1f1f1f] text-gray-500 px-2 py-0.5 rounded-full">Soon</span>
                  </div>
                )
              }
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    item.active
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </aside>
    </>
  )
}

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
      'Score range: 0-100 (normalized)',
      'Category: Excellent / Good / Fair / Building',
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

function PipelineStep({ step, isOpen, onToggle, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <button
        onClick={onToggle}
        className={`w-full text-left bg-[#111] border rounded-2xl p-6 transition-all duration-300 ${
          isOpen ? 'border-opacity-50 shadow-lg' : 'border-[#1f1f1f] hover:border-[#2a2a2a]'
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
              <h3 className="text-base font-semibold">{step.title}</h3>
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
              <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-5 ml-13">
                <ul className="space-y-2.5">
                  {step.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2 text-sm text-gray-400"
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[55] p-2.5 bg-[#111] border border-[#1f1f1f] rounded-xl"
        onClick={() => setSidebarOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      {/* Sidebar */}
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="lg:ml-[260px] min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium mb-6"
          >
            <Sparkles size={12} /> Transparent & Explainable AI
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            How Our <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">AI</span> Works
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            No black boxes. Every prediction is explainable, fair, and transparent.
            Here's exactly how we turn your digital footprint into a credit score.
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
            <BarChart3 size={18} className="text-blue-400" />
            <h2 className="text-xl font-bold">ML Pipeline</h2>
          </motion.div>

          {/* Visual pipeline flow */}
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

          {/* Expandable steps */}
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
            <h2 className="text-2xl font-bold mb-2">Model Performance</h2>
            <p className="text-sm text-gray-500">Trained on real alternative credit data from 10,000+ profiles</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {modelMetrics.map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 text-center hover:border-teal-500/20 transition-all duration-300"
              >
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-1">
                  {metric.value}
                </p>
                <p className="text-sm font-medium text-gray-300">{metric.label}</p>
                <p className="text-xs text-gray-600 mt-1">{metric.description}</p>
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
            <h2 className="text-2xl font-bold mb-2">Feature Importance</h2>
            <p className="text-sm text-gray-500">Top 10 features ranked by their impact on predictions</p>
          </motion.div>

          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 md:p-8">
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
                  <span className="text-sm text-gray-400 w-44 shrink-0 truncate">{feature.name}</span>
                  <div className="flex-1 h-6 bg-[#1a1a1a] rounded-full overflow-hidden relative">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: feature.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${feature.value * 100 / 0.23}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-sm font-mono text-gray-400 w-12 text-right shrink-0">
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
            <h2 className="text-2xl font-bold mb-2">SHAP Explanation</h2>
            <p className="text-sm text-gray-500">"Why did this user get a score of 72?" — Every prediction is explainable</p>
          </motion.div>

          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Eye size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Example: User Score 72</p>
                <p className="text-xs text-gray-500">Base score: 60 → Final: 72 (net +12)</p>
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
                  <span className="text-sm text-gray-400 w-44 shrink-0 truncate">{item.feature}</span>
                  <div className="flex-1 flex items-center justify-center relative h-8">
                    <div className="absolute inset-y-0 left-1/2 w-px bg-[#2a2a2a]" />
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

            <div className="mt-6 pt-4 border-t border-[#1f1f1f] flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-green-500/30 border border-green-500/40" />
                  Helping score
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-red-500/30 border border-red-500/40" />
                  Hurting score
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Badges */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-xl font-bold mb-6">Built With</h2>
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
          <div className="bg-[#111] border border-[#1f1f1f] rounded-3xl p-10">
            <Shield size={32} className="text-teal-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Responsible AI, Built for Malaysia</h2>
            <p className="text-sm text-gray-400 max-w-lg mx-auto mb-6">
              Our model is regularly audited for fairness across demographics.
              Every prediction comes with a full explanation. No black boxes.
            </p>
            <Link
              to="/score"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 rounded-xl text-base font-medium transition-all duration-300 shadow-lg shadow-blue-600/20"
            >
              Try It Yourself <ChevronRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
      </main>
    </div>
  )
}
