import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileBarChart, TrendingUp, Calendar, Download, ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import AppSidebar from '../components/AppSidebar'
import toast from 'react-hot-toast'

function getTimeline(t) {
  return [
    { date: 'May 2', event: t('salaryDetected'), impact: '+12', type: 'positive', emoji: '💰' },
    { date: 'May 5', event: t('unifiBillPaid'), impact: '+8', type: 'positive', emoji: '✅' },
    { date: 'May 8', event: t('allBillsPaidOnTime'), impact: '+15', type: 'positive', emoji: '🎯' },
    { date: 'May 12', event: t('duitnowUsageIncreased'), impact: '+7', type: 'positive', emoji: '📱' },
    { date: 'May 15', event: t('ewalletActivityBoost'), impact: '+8', type: 'positive', emoji: '💳' },
    { date: 'May 20', event: t('ecommerceReturnProcessed'), impact: '-10', type: 'negative', emoji: '📦' },
    { date: 'May 25', event: t('savingsTransferDetected'), impact: '+12', type: 'positive', emoji: '🏦' },
  ]
}

function getCategoryBreakdown(t) {
  return [
    { name: t('paymentConsistencyLabel'), prev: 78, current: 85, change: 7 },
    { name: t('incomeStabilityLabel'), prev: 75, current: 78, change: 3 },
    { name: t('ewalletActivityLabel'), prev: 68, current: 72, change: 4 },
    { name: t('digitalFootprint'), prev: 40, current: 42, change: 2 },
    { name: t('ecommerceReturnsLabel'), prev: 38, current: 35, change: -3 },
    { name: t('accountMaturity'), prev: 62, current: 65, change: 3 },
  ]
}

const comparisonData = [
  { week: 'W1', thisMonth: 660, lastMonth: 630 },
  { week: 'W2', thisMonth: 672, lastMonth: 640 },
  { week: 'W3', thisMonth: 685, lastMonth: 648 },
  { week: 'W4', thisMonth: 697, lastMonth: 645 },
]

export default function MonthlyReportPage() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const timeline = getTimeline(t)
  const categoryBreakdown = getCategoryBreakdown(t)

  const pageBg = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const barBg = theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-gray-100'

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  return (
    <div className={`min-h-screen ${pageBg} ${textPrimary}`}>
      <button
        className={`lg:hidden fixed top-4 left-4 z-[55] p-2.5 border rounded-xl ${theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'}`}
        onClick={() => setSidebarOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <AppSidebar activePath="/report" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px] min-h-screen pb-8">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 pt-12 lg:pt-0">
            <div>
              <h1 className={`text-2xl font-bold ${textPrimary}`}>{t('monthlyScoreReport')}</h1>
              <p className={`text-sm mt-1 ${textSecondary}`}>May 2026</p>
            </div>
            <button
              onClick={() => toast('PDF download coming soon!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              <Download size={14} />
              {t('downloadPdf')}
            </button>
          </motion.div>

          {/* Score Change Card */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-6 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textSecondary}`}>{t('scoreChangeThisMonth')}</p>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className={`text-3xl font-bold ${textPrimary}`}>645</span>
                  <span className={textSecondary}>→</span>
                  <span className="text-3xl font-bold text-blue-400">697</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp size={18} className="text-emerald-400" />
                <span className="text-lg font-bold text-emerald-400">+52</span>
              </div>
            </div>
          </motion.div>

          {/* Key Events Timeline */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Calendar size={16} className="text-purple-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('keyEvents')}</h3>
            </div>
            <div className="space-y-4">
              {timeline.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div className={`w-16 text-xs font-medium ${textSecondary}`}>{event.date}</div>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${event.type === 'positive' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-lg">{event.emoji}</span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{event.event}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    event.type === 'positive' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {event.impact}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileBarChart size={16} className="text-blue-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('categoryBreakdown')}</h3>
            </div>
            <div className="space-y-4">
              {categoryBreakdown.map((cat, i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-28 sm:w-40 text-xs font-medium truncate flex-shrink-0 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{cat.name}</div>
                  <div className={`flex-1 h-2 rounded-full overflow-hidden ${barBg}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.current}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.8 }}
                      className={`h-full rounded-full ${cat.change >= 0 ? 'bg-gradient-to-r from-blue-500 to-teal-500' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
                    />
                  </div>
                  <div className="flex items-center gap-1 w-16 justify-end">
                    {cat.change > 0 ? <ArrowUp size={12} className="text-emerald-400" /> : cat.change < 0 ? <ArrowDown size={12} className="text-red-400" /> : <Minus size={12} className="text-gray-500" />}
                    <span className={`text-xs font-medium ${cat.change > 0 ? 'text-emerald-400' : cat.change < 0 ? 'text-red-400' : textSecondary}`}>
                      {cat.change > 0 ? '+' : ''}{cat.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Comparison Chart */}
          <motion.div variants={item} className={`border rounded-2xl p-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <TrendingUp size={16} className="text-amber-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('vsLastMonth')}</h3>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData}>
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[600, 720]} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                    labelStyle={{ color: '#9ca3af', fontSize: 12 }}
                    itemStyle={{ fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="thisMonth" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} name="May 2026" />
                  <Line type="monotone" dataKey="lastMonth" stroke="#6b7280" strokeWidth={1.5} strokeDasharray="5 5" dot={{ r: 3 }} name="Apr 2026" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 mt-3 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-blue-500 rounded" />
                <span className={`text-xs ${textSecondary}`}>May 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-gray-500 rounded border-dashed" />
                <span className={`text-xs ${textSecondary}`}>Apr 2026</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
