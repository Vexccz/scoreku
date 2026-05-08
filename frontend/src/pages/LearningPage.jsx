import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Clock, Award, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import AppSidebar from '../components/AppSidebar'

const articles = [
  {
    id: 1,
    title: 'Understanding Credit Scores',
    readTime: '5 min read',
    difficulty: 'Beginner',
    icon: '📊',
    content: `Credit scores are numerical representations of your creditworthiness. In Malaysia, traditional credit scoring relies heavily on bank loan history, which excludes millions of unbanked individuals.\n\nScoreKu uses alternative data — e-wallet transactions, bill payments, and digital footprint — to create a more inclusive credit score. This means even if you've never had a bank loan, you can still build a credit profile.\n\nYour score ranges from 0-100, with higher scores indicating better financial health and reliability.`
  },
  {
    id: 2,
    title: 'How to Build Credit from Zero',
    readTime: '8 min read',
    difficulty: 'Beginner',
    icon: '🏗️',
    content: `Building credit from zero might seem daunting, but with ScoreKu's alternative scoring, you can start today. Here are proven strategies:\n\n1. **Pay bills consistently** — Set up auto-pay for utilities. Even small bills like phone top-ups count.\n2. **Use e-wallets regularly** — Touch n Go, GrabPay, and Boost transactions all contribute to your digital footprint.\n3. **Maintain stable income** — Whether salary or freelance, consistent deposits show reliability.\n\nMost users see meaningful score improvement within 3-6 months of consistent behavior.`
  },
  {
    id: 3,
    title: 'DuitNow & E-wallet Best Practices',
    readTime: '4 min read',
    difficulty: 'Beginner',
    icon: '💳',
    content: `DuitNow and e-wallets are powerful tools for building your ScoreKu credit profile. Here's how to maximize their impact:\n\n- **Use DuitNow for transfers** instead of cash — each transaction creates a verifiable record.\n- **Pay merchants via QR** — this shows active financial participation.\n- **Reload regularly** — consistent top-ups signal financial planning.\n\nPro tip: Using multiple e-wallet platforms (Touch n Go, GrabPay, Boost) shows broader financial engagement.`
  },
  {
    id: 4,
    title: 'Managing Bills Effectively',
    readTime: '6 min read',
    difficulty: 'Intermediate',
    icon: '📋',
    content: `Bill payment consistency is the single biggest factor in your ScoreKu score. Here's a framework for never missing a payment:\n\n1. **List all recurring bills** — TNB, water, internet, phone, subscriptions.\n2. **Set payment dates** — Align them with your salary date if possible.\n3. **Use auto-debit** — Most providers offer this. Set it up once, forget forever.\n4. **Keep a buffer** — Always maintain at least one month's bills in your account.\n\nMissing even one bill can drop your score by 2-5 points, while 6 months of perfect payments can boost it by 10-15 points.`
  },
  {
    id: 5,
    title: 'Avoiding Debt Traps',
    readTime: '7 min read',
    difficulty: 'Intermediate',
    icon: '⚠️',
    content: `Debt traps are situations where borrowing leads to more borrowing. Common traps in Malaysia include:\n\n- **Buy Now Pay Later (BNPL)** — Easy to overcommit. Keep BNPL under 10% of monthly income.\n- **Credit card minimum payments** — Always pay more than minimum. Interest compounds fast.\n- **Ah Long (loan sharks)** — Never. The interest rates are predatory and illegal.\n\nRule of thumb: If your total monthly debt payments exceed 40% of income, you're in the danger zone. ScoreKu tracks this ratio and will alert you.`
  },
  {
    id: 6,
    title: 'Islamic Finance Basics',
    readTime: '5 min read',
    difficulty: 'Beginner',
    icon: '🕌',
    content: `Islamic finance operates on principles of fairness and shared risk. Key concepts:\n\n- **Murabahah** — Cost-plus financing. The bank buys an asset and sells it to you at a markup.\n- **Musharakah** — Partnership financing. Both parties share profits and losses.\n- **Takaful** — Islamic insurance based on mutual cooperation.\n\nMany Malaysian banks offer Shariah-compliant products. ScoreKu works with both conventional and Islamic financial institutions, so your score applies regardless of your preference.`
  },
  {
    id: 7,
    title: 'Starting a Micro-Business',
    readTime: '10 min read',
    difficulty: 'Intermediate',
    icon: '🚀',
    content: `A good ScoreKu score can unlock micro-financing for your business idea. Here's how to start:\n\n1. **Validate your idea** — Start small. Sell on Shopee or at pasar malam before investing big.\n2. **Separate finances** — Open a dedicated business account. This helps ScoreKu track business income.\n3. **Build credit first** — Aim for score 70+ before applying for business financing.\n4. **Explore options** — TEKUN, AIM, and BSN all offer micro-loans for scores above 65.\n\nMany successful Malaysian entrepreneurs started with less than RM5,000 in capital.`
  },
  {
    id: 8,
    title: 'Government Aid Programs (B40)',
    readTime: '6 min read',
    difficulty: 'Beginner',
    icon: '🏛️',
    content: `Malaysia offers several aid programs for B40 households. Your ScoreKu score can help you access these:\n\n- **STR (Sumbangan Tunai Rahmah)** — Cash aid for eligible households.\n- **TEKUN Financing** — Micro-loans up to RM100,000 for small businesses.\n- **MyKasih** — Food aid program at participating retailers.\n- **1Malaysia People's Aid** — Various subsidies and assistance.\n\nA higher ScoreKu score demonstrates financial responsibility, which can strengthen your applications for these programs. Some programs now accept alternative credit scores as supporting documents.`
  },
]

export default function LearningPage() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('scoreku_learning_completed')
    return saved ? JSON.parse(saved) : []
  })

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id)
  }

  const markComplete = (id) => {
    const updated = completed.includes(id) ? completed.filter(c => c !== id) : [...completed, id]
    setCompleted(updated)
    localStorage.setItem('scoreku_learning_completed', JSON.stringify(updated))
  }

  const pageBg = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const barBg = theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-gray-100'

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  const progress = completed.length

  return (
    <div className={`min-h-screen ${pageBg} ${textPrimary}`}>
      <button
        className={`lg:hidden fixed top-4 left-4 z-[55] p-2.5 border rounded-xl ${theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'}`}
        onClick={() => setSidebarOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <AppSidebar activePath="/learn" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px] min-h-screen pb-8">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <motion.div variants={item} className="mb-6 pt-12 lg:pt-0">
            <h1 className={`text-2xl font-bold ${textPrimary}`}>{t('financialLiteracyHub')}</h1>
            <p className={`text-sm mt-1 ${textSecondary}`}>{t('learningSubtitle')}</p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div variants={item} className={`border rounded-2xl p-5 mb-6 ${cardBg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${textPrimary}`}>{t('progress')}</span>
              <span className={`text-sm font-medium ${textSecondary}`}>{progress}/{articles.length} {t('completed')}</span>
            </div>
            <div className={`h-3 rounded-full overflow-hidden ${barBg}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(progress / articles.length) * 100}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500"
              />
            </div>
          </motion.div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((article) => {
              const isExpanded = expanded === article.id
              const isCompleted = completed.includes(article.id)
              return (
                <motion.div
                  key={article.id}
                  variants={item}
                  layout
                  className={`border rounded-2xl overflow-hidden transition-all ${cardBg} ${
                    isCompleted ? (theme === 'dark' ? 'border-emerald-500/20' : 'border-emerald-300') : ''
                  } ${isExpanded ? 'md:col-span-2' : ''}`}
                >
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => toggleExpand(article.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{article.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-sm font-semibold ${textPrimary}`}>{article.title}</h3>
                          {isCompleted && <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`flex items-center gap-1 text-xs ${textSecondary}`}>
                            <Clock size={11} /> {article.readTime}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            article.difficulty === 'Beginner'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {article.difficulty}
                          </span>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp size={16} className={textSecondary} /> : <ChevronDown size={16} className={textSecondary} />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className={`px-5 pb-5 border-t ${theme === 'dark' ? 'border-[#1f1f1f]' : 'border-gray-200'}`}>
                          <div className={`mt-4 text-sm leading-relaxed whitespace-pre-line ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {article.content}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); markComplete(article.id) }}
                            className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                              isCompleted
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20'
                            }`}
                          >
                            <CheckCircle2 size={14} />
                            {isCompleted ? t('completedCheck') : t('markAsComplete')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
