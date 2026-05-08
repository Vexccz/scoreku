import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Receipt, TrendingUp, TrendingDown, Minus, DollarSign, ShoppingBag, Smartphone, Utensils, ArrowLeftRight, Briefcase, Zap } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import AppSidebar from '../components/AppSidebar'

const categories = ['All', 'Bills', 'Salary', 'E-wallet', 'Shopping', 'Transfer', 'Food']

const categoryColors = {
  Bills: '#f59e0b',
  Salary: '#10b981',
  'E-wallet': '#8b5cf6',
  Shopping: '#ec4899',
  Transfer: '#3b82f6',
  Food: '#f97316',
}

const categoryIcons = {
  Bills: Zap,
  Salary: Briefcase,
  'E-wallet': Smartphone,
  Shopping: ShoppingBag,
  Transfer: ArrowLeftRight,
  Food: Utensils,
}

const transactions = [
  { date: '2026-05-08', desc: 'TNB Electricity Bill', amount: -185.40, category: 'Bills', impact: -0.0 },
  { date: '2026-05-07', desc: 'Salary - May 2026', amount: 4500.00, category: 'Salary', impact: 2.0 },
  { date: '2026-05-07', desc: 'Touch n Go Reload', amount: -100.00, category: 'E-wallet', impact: 0.1 },
  { date: '2026-05-06', desc: 'Shopee - Electronics', amount: -299.90, category: 'Shopping', impact: -0.1 },
  { date: '2026-05-06', desc: 'DuitNow Transfer to Ali', amount: -50.00, category: 'Transfer', impact: 0.0 },
  { date: '2026-05-05', desc: 'McDonalds Delivery', amount: -32.50, category: 'Food', impact: 0.0 },
  { date: '2026-05-05', desc: 'Unifi Internet Bill', amount: -149.00, category: 'Bills', impact: 0.2 },
  { date: '2026-05-04', desc: 'GrabPay Top Up', amount: -50.00, category: 'E-wallet', impact: 0.1 },
  { date: '2026-05-04', desc: 'Lazada - Clothing', amount: -89.90, category: 'Shopping', impact: 0.0 },
  { date: '2026-05-03', desc: 'Water Bill - SPAN', amount: -28.50, category: 'Bills', impact: 0.2 },
  { date: '2026-05-03', desc: 'Freelance Payment', amount: 800.00, category: 'Salary', impact: 0.5 },
  { date: '2026-05-02', desc: 'Boost Cashback', amount: 5.20, category: 'E-wallet', impact: 0.0 },
  { date: '2026-05-02', desc: 'Mamak Dinner', amount: -15.00, category: 'Food', impact: 0.0 },
  { date: '2026-05-01', desc: 'DuitNow from Ahmad', amount: 200.00, category: 'Transfer', impact: 0.0 },
  { date: '2026-05-01', desc: 'Astro Subscription', amount: -79.90, category: 'Bills', impact: 0.2 },
  { date: '2026-04-30', desc: 'Shopee - Groceries', amount: -67.80, category: 'Shopping', impact: 0.0 },
  { date: '2026-04-30', desc: 'KFC Lunch', amount: -22.90, category: 'Food', impact: 0.0 },
  { date: '2026-04-29', desc: 'Touch n Go Highway', amount: -12.40, category: 'E-wallet', impact: 0.0 },
  { date: '2026-04-29', desc: 'Transfer to Savings', amount: -500.00, category: 'Transfer', impact: 0.3 },
  { date: '2026-04-28', desc: 'Celcom Postpaid', amount: -68.00, category: 'Bills', impact: 0.2 },
  { date: '2026-04-28', desc: 'Grab Food', amount: -28.50, category: 'Food', impact: 0.0 },
  { date: '2026-04-27', desc: 'Salary Bonus', amount: 1200.00, category: 'Salary', impact: 1.0 },
  { date: '2026-04-27', desc: 'Shopee - Books', amount: -45.00, category: 'Shopping', impact: 0.0 },
  { date: '2026-04-26', desc: 'GrabPay Payment', amount: -35.00, category: 'E-wallet', impact: 0.1 },
  { date: '2026-04-25', desc: 'Rent Payment', amount: -800.00, category: 'Bills', impact: 0.3 },
]

const monthlySummary = {
  income: 6705.20,
  expenses: 2859.70,
  net: 3845.50,
  billsPaid: 7,
}

export default function TransactionsPage() {
  const { theme } = useTheme()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filtered = transactions.filter(t => {
    const matchCat = filter === 'All' || t.category === filter
    const matchSearch = t.desc.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const pageBg = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const inputBg = theme === 'dark' ? 'bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  return (
    <div className={`min-h-screen ${pageBg} ${textPrimary}`}>
      {/* Mobile hamburger */}
      <button
        className={`lg:hidden fixed top-4 left-4 z-[55] p-2.5 border rounded-xl ${theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'}`}
        onClick={() => setSidebarOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <AppSidebar activePath="/transactions" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px] min-h-screen pb-8">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <motion.div variants={item} className="mb-6">
            <h1 className={`text-2xl font-bold ${textPrimary}`}>Transaction History</h1>
            <p className={`text-sm mt-1 ${textSecondary}`}>Track your financial activity and score impact</p>
          </motion.div>

          {/* Monthly Summary */}
          <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Income', value: `RM ${monthlySummary.income.toLocaleString()}`, color: 'text-emerald-400' },
              { label: 'Total Expenses', value: `RM ${monthlySummary.expenses.toLocaleString()}`, color: 'text-red-400' },
              { label: 'Net', value: `RM ${monthlySummary.net.toLocaleString()}`, color: 'text-blue-400' },
              { label: 'Bills Paid', value: `${monthlySummary.billsPaid} on time`, color: 'text-amber-400' },
            ].map((s, i) => (
              <div key={i} className={`border rounded-xl p-4 ${cardBg}`}>
                <p className={`text-xs ${textSecondary}`}>{s.label}</p>
                <p className={`text-lg font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Search + Filters */}
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm ${inputBg} focus:outline-none focus:border-blue-500`}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filter === cat
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : `${theme === 'dark' ? 'bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a]' : 'bg-gray-100 text-gray-500 border border-gray-200'} hover:border-blue-500/30`
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Transaction List */}
          <motion.div variants={item} className={`border rounded-2xl overflow-hidden ${cardBg}`}>
            <div className="divide-y divide-[#1f1f1f]">
              {filtered.map((t, i) => {
                const CatIcon = categoryIcons[t.category] || Receipt
                const borderColor = categoryColors[t.category] || '#6b7280'
                const isIncome = t.amount > 0
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={`flex items-center gap-4 px-5 py-4 border-l-4`}
                    style={{ borderLeftColor: borderColor }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${borderColor}15` }}>
                      <CatIcon size={16} style={{ color: borderColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{t.desc}</p>
                      <p className={`text-xs ${textSecondary}`}>{t.date} · {t.category}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isIncome ? '+' : ''}{t.amount.toFixed(2)}
                      </p>
                      <p className={`text-xs ${
                        t.impact > 0 ? 'text-emerald-400' : t.impact < 0 ? 'text-red-400' : (theme === 'dark' ? 'text-gray-600' : 'text-gray-400')
                      }`}>
                        {t.impact > 0 ? `+${t.impact}` : t.impact < 0 ? `${t.impact}` : 'neutral'}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <p className={textSecondary}>No transactions found</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
