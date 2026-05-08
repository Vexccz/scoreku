import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  Shield, LayoutDashboard, FileText, Sparkles, Brain, Settings,
  Building2, BarChart3, GitCompare, Search, SlidersHorizontal,
  ChevronRight, ChevronDown, Check, X, Banknote, GraduationCap,
  Briefcase, CreditCard, Wallet
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'
import AppSidebar from '../components/AppSidebar'

// ─── Demo Data ───────────────────────────────────────────────────────────────

const userScore = 72

const products = [
  { id: 1, name: 'BSN Micro Loan', provider: 'Bank Simpanan Nasional', maxAmount: 50000, rate: '4% p.a.', minScore: 75, type: 'Micro-loan', tenure: '5 years', description: 'Micro financing for small businesses and entrepreneurs. Quick approval with minimal documentation.', icon: Banknote },
  { id: 2, name: 'TEKUN Nasional', provider: 'TEKUN Nasional', maxAmount: 100000, rate: '4% p.a.', minScore: 65, type: 'Business', tenure: '7 years', description: 'Business financing for Bumiputera entrepreneurs. Flexible repayment terms with mentoring support.', icon: Briefcase },
  { id: 3, name: 'Amanah Ikhtiar', provider: 'Amanah Ikhtiar Malaysia', maxAmount: 20000, rate: '0% (Islamic)', minScore: 50, type: 'Micro-loan', tenure: '3 years', description: 'Interest-free Islamic microfinancing for low-income entrepreneurs. Group lending model.', icon: Wallet },
  { id: 4, name: 'MARA Business Financing', provider: 'MARA', maxAmount: 200000, rate: '3.5% p.a.', minScore: 70, type: 'Business', tenure: '10 years', description: 'Business development financing for Bumiputera SMEs. Includes business advisory services.', icon: Briefcase },
  { id: 5, name: 'Bank Rakyat Personal', provider: 'Bank Rakyat', maxAmount: 150000, rate: '5.5% p.a.', minScore: 80, type: 'Personal', tenure: '10 years', description: 'Personal financing with competitive rates. Available for salaried and self-employed individuals.', icon: CreditCard },
  { id: 6, name: 'PTPTN Education', provider: 'PTPTN', maxAmount: 60000, rate: '1% p.a.', minScore: 40, type: 'Education', tenure: '15 years', description: 'Education loan for Malaysian students pursuing higher education at recognized institutions.', icon: GraduationCap },
  { id: 7, name: 'TEKUN Usaha Niaga', provider: 'Tabung Ekonomi Kumpulan Usaha Niaga', maxAmount: 50000, rate: '4% p.a.', minScore: 60, type: 'Business', tenure: '5 years', description: 'Working capital financing for small traders and hawkers. Fast disbursement process.', icon: Banknote },
  { id: 8, name: 'SME Bank Financing', provider: 'SME Bank', maxAmount: 500000, rate: '5% p.a.', minScore: 75, type: 'Business', tenure: '10 years', description: 'Comprehensive business financing for established SMEs. Includes trade financing and working capital.', icon: Building2 },
]

const types = ['All', 'Micro-loan', 'Business', 'Personal', 'Education']



// ─── Product Card ────────────────────────────────────────────────────────────

function ProductCard({ product, theme }) {
  const [expanded, setExpanded] = useState(false)
  const eligible = userScore >= product.minScore
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
  const Icon = product.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-2xl p-5 transition-all cursor-pointer ${cardBg} ${eligible ? 'hover:border-teal-500/30' : 'hover:border-gray-500/30'}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${eligible ? 'bg-gradient-to-br from-blue-500/20 to-teal-500/20' : 'bg-gray-500/10'}`}>
          <Icon size={20} className={eligible ? 'text-blue-400' : 'text-gray-500'} />
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${eligible ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {eligible ? <span className="flex items-center gap-1"><Check size={10} /> Eligible</span> : <span className="flex items-center gap-1"><X size={10} /> Not Eligible</span>}
        </span>
      </div>
      <h4 className={`font-semibold text-sm mb-1 ${textPrimary}`}>{product.name}</h4>
      <p className={`text-xs mb-3 ${textSecondary}`}>{product.provider}</p>
      <div className="flex items-center gap-4 mb-2">
        <div>
          <p className={`text-[10px] ${textSecondary}`}>Max Amount</p>
          <p className={`text-sm font-bold ${textPrimary}`}>RM{product.maxAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className={`text-[10px] ${textSecondary}`}>Rate</p>
          <p className={`text-sm font-bold ${textPrimary}`}>{product.rate}</p>
        </div>
        <div>
          <p className={`text-[10px] ${textSecondary}`}>Min Score</p>
          <p className={`text-sm font-bold ${eligible ? 'text-emerald-400' : 'text-red-400'}`}>{product.minScore}</p>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-[#1f1f1f]' : 'border-gray-200'}`}>
              <p className={`text-xs leading-relaxed mb-3 ${textSecondary}`}>{product.description}</p>
              <div className="flex items-center gap-3">
                <span className={`text-xs ${textSecondary}`}>Tenure: {product.tenure}</span>
                <span className={`text-xs ${textSecondary}`}>Type: {product.type}</span>
              </div>
              <button
                className={`mt-4 w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                  eligible
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:opacity-90'
                    : 'bg-gray-500/10 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!eligible}
                onClick={(e) => e.stopPropagation()}
              >
                {eligible ? 'Apply Now' : `Need ${product.minScore - userScore} more points`}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center mt-2">
        <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''} ${textSecondary}`} />
      </div>
    </motion.div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const { theme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('All')
  const [maxAmount, setMaxAmount] = useState(500000)

  const pageBg = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-500' : 'text-gray-500'

  const filteredProducts = products.filter(p => {
    if (selectedType !== 'All' && p.type !== selectedType) return false
    if (p.maxAmount > maxAmount) return false
    return true
  })

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className={`min-h-screen ${pageBg} ${textPrimary}`}>
      {/* Mobile hamburger */}
      <button
        className={`lg:hidden fixed top-4 left-4 z-[55] p-2.5 border rounded-xl ${theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'}`}
        onClick={() => setSidebarOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <AppSidebar activePath="/marketplace" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px] min-h-screen pb-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        >
          {/* Hero */}
          <motion.div variants={item} className="mb-6">
            <h1 className={`text-2xl font-bold ${textPrimary}`}>Financial Products</h1>
            <p className={`text-sm mt-1 ${textSecondary}`}>Discover financing options matched to your ScoreKu rating</p>
          </motion.div>

          {/* Filter Bar */}
          <motion.div variants={item} className={`border rounded-2xl p-5 mb-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal size={16} className={textSecondary} />
              <span className={`text-sm font-medium ${textPrimary}`}>Filters</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Type filter */}
              <div className="flex flex-wrap gap-2">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedType === type
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : `${theme === 'dark' ? 'bg-[#1a1a1a] text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-900'}`
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {/* Amount slider */}
              <div className="flex items-center gap-3 sm:ml-auto">
                <span className={`text-xs ${textSecondary}`}>Max: RM{maxAmount.toLocaleString()}</span>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="10000"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(Number(e.target.value))}
                  className="w-32 accent-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Results count */}
          <motion.div variants={item} className="flex items-center justify-between mb-4">
            <p className={`text-xs ${textSecondary}`}>{filteredProducts.length} products found</p>
            <p className={`text-xs ${textSecondary}`}>Your score: <span className="text-blue-400 font-bold">{userScore}</span></p>
          </motion.div>

          {/* Product Grid */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} theme={theme} />
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div variants={item} className={`border rounded-2xl p-12 text-center ${cardBg}`}>
              <Search size={32} className={`mx-auto mb-3 ${textSecondary}`} />
              <p className={`text-sm ${textSecondary}`}>No products match your filters</p>
              <button
                onClick={() => { setSelectedType('All'); setMaxAmount(500000) }}
                className="mt-3 text-xs text-blue-400 hover:underline"
              >
                Reset filters
              </button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
