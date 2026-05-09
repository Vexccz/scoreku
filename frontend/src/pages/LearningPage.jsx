import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BookOpen, Clock, ChevronDown, ChevronUp, CheckCircle2,
  ArrowLeft, Search, TrendingUp, Star
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import ThemeToggle from '../components/ThemeToggle'

const categories = ['All', 'Beginner', 'Intermediate', 'Finance', 'Tips']

const articles = [
  {
    id: 1,
    title: 'Understanding Credit Scores in Malaysia',
    subtitle: 'A complete guide to how credit scoring works and why it matters',
    readTime: '5 min read',
    difficulty: 'Beginner',
    category: 'Beginner',
    icon: '📊',
    color: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/20',
    tag: '#credit-basics',
    content: [
      {
        heading: 'What is a Credit Score?',
        body: 'A credit score is a numerical representation of your financial trustworthiness — typically ranging from 300 to 850. Lenders use it to decide whether to give you a loan, and at what interest rate.'
      },
      {
        heading: 'Traditional vs. Alternative Scoring',
        body: 'Traditional Malaysian credit scoring (CCRIS, CTOS) relies on formal banking history — loans, credit cards, and repayment records. This excludes an estimated 3.5 million Malaysians who have never borrowed from a bank.\n\nScoreKu uses alternative data: e-wallet transactions, DuitNow transfers, bill payment history, and employment patterns. If you have a smartphone and pay bills digitally, you already have a credit profile.'
      },
      {
        heading: 'Score Ranges & What They Mean',
        body: '• 720–850: Excellent — Qualifies for best loan rates, premium products\n• 650–719: Good — Most financing products accessible\n• 530–649: Moderate Risk — Limited options, higher interest\n• 300–529: High Risk — Financing difficult, focus on improvement first'
      },
      {
        heading: 'Key Takeaway',
        body: 'Your score is not permanent. It updates based on your behavior. Consistent positive actions compound over time — most users see meaningful improvement within 3–6 months.'
      }
    ]
  },
  {
    id: 2,
    title: 'Building Credit from Zero: A Step-by-Step Guide',
    subtitle: 'Proven strategies for fresh graduates and first-time borrowers',
    readTime: '8 min read',
    difficulty: 'Beginner',
    category: 'Beginner',
    icon: '🏗️',
    color: 'from-teal-500/20 to-teal-600/5',
    border: 'border-teal-500/20',
    tag: '#credit-building',
    content: [
      {
        heading: 'Step 1: Start with What You Have',
        body: 'You don\'t need a bank loan to start. Every DuitNow transfer, every Grab ride paid via e-wallet, every TNB bill settled online — these create a verifiable financial footprint that ScoreKu reads.'
      },
      {
        heading: 'Step 2: Establish Payment Consistency',
        body: 'Set up auto-payment for at least 3 recurring bills:\n• Phone postpaid plan\n• Internet (Unifi/Maxis)\n• Utility (TNB/Air)\n\nConsistency over 6 months is worth more than one large payment.'
      },
      {
        heading: 'Step 3: Use E-wallets Strategically',
        body: 'Don\'t just reload when empty — reload regularly. Weekly transactions signal active financial participation. Aim for at least 8–10 e-wallet transactions per month across different categories (food, transport, bills).'
      },
      {
        heading: 'Step 4: Keep Income Stable',
        body: 'Stable income is the single highest-weighted factor in ScoreKu. Whether you\'re salaried or freelance, consistent monthly deposits into the same account show financial reliability.\n\nFreelancers: Invoice on a fixed schedule and consolidate payments to one account where possible.'
      },
      {
        heading: 'Realistic Timeline',
        body: '• Month 1–2: Establish baseline habits\n• Month 3–4: First score improvement visible\n• Month 6+: Meaningful score jump (+30 to +60 points typical)\n• Month 12+: Score stabilizes at new baseline'
      }
    ]
  },
  {
    id: 3,
    title: 'DuitNow & E-wallet Best Practices',
    subtitle: 'Maximize your digital payment footprint for a better score',
    readTime: '4 min read',
    difficulty: 'Beginner',
    category: 'Tips',
    icon: '💳',
    color: 'from-purple-500/20 to-purple-600/5',
    border: 'border-purple-500/20',
    tag: '#digital-payments',
    content: [
      {
        heading: 'Why Digital Payments Matter',
        body: 'Every digital payment creates a timestamp, a merchant record, and a transaction amount — three data points ScoreKu uses to build your profile. Cash payments leave no trace. Going digital means every ringgit you spend builds your score.'
      },
      {
        heading: 'DuitNow Best Practices',
        body: '• Use DuitNow transfer instead of cash for rent, goods, and services\n• Pay merchants via DuitNow QR rather than cash\n• Transfer money to family via DuitNow — it all counts\n• Use DuitNow AutoDebit for bill payments when available'
      },
      {
        heading: 'E-wallet Strategy',
        body: 'Using multiple platforms signals broader financial engagement:\n• Touch \'n Go eWallet — public transport, toll, Grab\n• GrabPay — food, rides, online shopping\n• Boost — cashback merchants, bills\n\nMaintain at least 2 active e-wallets with regular transactions.'
      },
      {
        heading: 'What to Avoid',
        body: '• Don\'t make one huge transaction and go dormant — consistency beats size\n• Don\'t top-up and immediately spend all — a small rolling balance is healthier\n• Avoid returning items excessively — high return rates are a negative signal'
      }
    ]
  },
  {
    id: 4,
    title: 'The Gig Worker\'s Guide to Credit',
    subtitle: 'How Grab, Foodpanda, and Lalamove riders can build financial credibility',
    readTime: '7 min read',
    difficulty: 'Intermediate',
    category: 'Tips',
    icon: '🚗',
    color: 'from-amber-500/20 to-amber-600/5',
    border: 'border-amber-500/20',
    tag: '#gig-economy',
    content: [
      {
        heading: 'The Gig Worker Credit Problem',
        body: 'Traditional credit systems require payslips and employer letters. Gig workers — who represent over 1.7 million Malaysians — often can\'t provide these, making them "invisible" to conventional lenders despite having stable incomes.'
      },
      {
        heading: 'How ScoreKu Solves This',
        body: 'ScoreKu reads income deposits directly from your financial activity patterns. Regular weekly deposits from Grab or Foodpanda payouts, consistent amounts, stable frequency — these all signal reliable income without needing a payslip.'
      },
      {
        heading: 'Specific Strategies for Gig Workers',
        body: '• Consolidate earnings to one primary account — don\'t scatter across 5 different accounts\n• Maintain a minimum balance buffer (at least RM500)\n• Pay your own bills from your income account — creates income-to-expense pattern\n• Keep a consistent work schedule — consistent payout patterns score better than erratic ones'
      },
      {
        heading: 'Financing Options Available',
        body: 'With a ScoreKu score above 650, gig workers can access:\n• BSN Micro Financing — up to RM50,000 for vehicle upgrades or business expansion\n• TEKUN Nasional — business micro-loans for riders running delivery as a business\n• Grab Financial Services — in-app financing for Grab partners specifically'
      }
    ]
  },
  {
    id: 5,
    title: 'Avoiding Debt Traps in Malaysia',
    subtitle: 'Recognize the warning signs before they become financial emergencies',
    readTime: '7 min read',
    difficulty: 'Intermediate',
    category: 'Finance',
    icon: '⚠️',
    color: 'from-red-500/20 to-red-600/5',
    border: 'border-red-500/20',
    tag: '#debt-management',
    content: [
      {
        heading: 'The Debt-to-Income Danger Zone',
        body: 'Financial advisors recommend keeping total monthly debt payments below 40% of gross income. Above 40% is the danger zone — you\'re one emergency away from default.\n\nExample: If you earn RM3,000/month, total loan and credit card payments should not exceed RM1,200.'
      },
      {
        heading: 'Common Debt Traps to Avoid',
        body: '1. Buy Now Pay Later (BNPL) stacking — Each BNPL plan seems small, but 4–5 running simultaneously adds up. Keep BNPL under RM200/month total.\n\n2. Credit card minimum payments — Paying only the minimum means you\'ll still be paying in years. Always pay at least 50% of the outstanding balance.\n\n3. Loan stacking — Taking a new loan to pay off another. Address root cause instead.\n\n4. Ah Long (loan sharks) — Illegal, predatory, dangerous. Never. BSN and Amanah Ikhtiar offer legal alternatives.'
      },
      {
        heading: 'The Emergency Fund Rule',
        body: 'Before aggressively building credit, ensure you have 3 months of expenses saved. Without this buffer, any emergency forces you into debt — undoing months of score-building progress.'
      },
      {
        heading: 'When to Seek Help',
        body: 'AKPK (Agensi Kaunseling dan Pengurusan Kredit) offers free debt counseling for Malaysians. If debt payments exceed 60% of income, contact AKPK before the situation becomes unmanageable. Their debt management program is free and widely trusted.'
      }
    ]
  },
  {
    id: 6,
    title: 'Islamic Finance: A Practical Guide',
    subtitle: 'Understanding Shariah-compliant financial products in Malaysia',
    readTime: '6 min read',
    difficulty: 'Beginner',
    category: 'Finance',
    icon: '🕌',
    color: 'from-green-500/20 to-green-600/5',
    border: 'border-green-500/20',
    tag: '#islamic-finance',
    content: [
      {
        heading: 'The Principles of Islamic Finance',
        body: 'Islamic finance operates on three core prohibitions: no riba (interest), no gharar (excessive uncertainty), and no maysir (gambling). In practice, this means profit is generated through asset ownership and trade — not lending money at interest.'
      },
      {
        heading: 'Key Products You\'ll Encounter',
        body: '• Murabahah (Cost-Plus Financing) — Most common for car and home loans. Bank buys asset, sells to you at disclosed markup. You pay in installments. No "interest" — but the profit margin is functionally similar.\n\n• Musharakah Mutanaqisah — Diminishing partnership. Used for home financing. Bank and customer co-own property; customer gradually buys bank\'s share.\n\n• Takaful — Islamic insurance. Participants contribute to a pooled fund. Claims paid from pool. Surplus returned to participants (unlike conventional insurance profit).'
      },
      {
        heading: 'ScoreKu & Islamic Finance',
        body: 'Your ScoreKu score works with both conventional and Islamic financial institutions. Many Islamic banks in Malaysia — Maybank Islamic, CIMB Islamic, Bank Islam — now use alternative credit data in their assessment process.\n\nA score above 700 opens doors to both tawarruq personal financing and conventional personal loans.'
      }
    ]
  },
  {
    id: 7,
    title: 'B40 Government Financing Programs',
    subtitle: 'Complete guide to BSN, TEKUN, AIM, and other aid programs',
    readTime: '8 min read',
    difficulty: 'Beginner',
    category: 'Finance',
    icon: '🏛️',
    color: 'from-indigo-500/20 to-indigo-600/5',
    border: 'border-indigo-500/20',
    tag: '#government-aid',
    content: [
      {
        heading: 'Who Qualifies as B40?',
        body: 'B40 refers to the bottom 40% of Malaysian household income earners — households earning below approximately RM4,850/month (2023 figures). Several government programs specifically target this group with subsidized financing and aid.'
      },
      {
        heading: 'BSN Micro-i Financing',
        body: 'Bank Simpanan Nasional offers Shariah-compliant micro-financing:\n• Amount: RM1,000 – RM50,000\n• Purpose: Business capital, vehicle, education\n• Rate: As low as 4% per annum\n• Eligibility: Malaysian citizen, 18–60 years, verifiable income\n\nScoreKu score of 620+ significantly improves your BSN application.'
      },
      {
        heading: 'TEKUN Nasional',
        body: 'Malaysia\'s largest micro-enterprise financing program:\n• Amount: Up to RM100,000 for established businesses\n• Starter: RM1,000 – RM5,000 for new businesses\n• Focus: Bumiputera entrepreneurs, though non-Bumi programs exist\n• Requirements: Business registration, 6 months operating history'
      },
      {
        heading: 'Amanah Ikhtiar Malaysia (AIM)',
        body: 'Group-based micro-financing inspired by Grameen Bank:\n• Amount: RM1,000 – RM20,000\n• Target: Poor households, especially rural women\n• Model: Borrowers join groups of 5; group accountability replaces collateral\n• Interest: Minimal administrative fee only'
      },
      {
        heading: 'How ScoreKu Helps',
        body: 'Some programs now accept alternative credit score reports as supplementary documentation. A ScoreKu report demonstrating consistent bill payments and stable income patterns can strengthen weak applications — particularly for BSN and TEKUN.'
      }
    ]
  },
  {
    id: 8,
    title: 'Starting a Micro-Business with Credit',
    subtitle: 'From idea to financing: a realistic Malaysian entrepreneur roadmap',
    readTime: '10 min read',
    difficulty: 'Intermediate',
    category: 'Intermediate',
    icon: '🚀',
    color: 'from-pink-500/20 to-pink-600/5',
    border: 'border-pink-500/20',
    tag: '#entrepreneurship',
    content: [
      {
        heading: 'The Right Sequence',
        body: 'Most aspiring entrepreneurs make the mistake of seeking financing before proving their concept. The correct order:\n\n1. Validate (sell first, invest later)\n2. Build credit score (ScoreKu 650+)\n3. Separate business finances\n4. Apply for financing with track record'
      },
      {
        heading: 'Phase 1: Validate Without Capital',
        body: 'Sell on Shopee/Lazada before renting a warehouse. Sell at pasar malam before opening a shop. Offer services via freelance platforms before hiring staff.\n\nThis gives you: Revenue data, Customer proof, Operating experience — all of which strengthen your financing application.'
      },
      {
        heading: 'Phase 2: Separate Your Finances',
        body: 'Open a dedicated business account (RHB or CIMB SME accounts have no minimum balance). Run all business income and expenses through this account. This creates a clear business cash flow statement — crucial for loan applications.'
      },
      {
        heading: 'Phase 3: Build Your Score First',
        body: 'Target ScoreKu 650 before applying for any business financing. Lenders see your personal credit health as a proxy for business financial discipline. A 6-month track record of:\n• On-time bill payments\n• Stable income deposits\n• Low return/dispute rate\n\n...tells a lender you can manage money responsibly.'
      },
      {
        heading: 'Phase 4: Choose the Right Financing',
        body: '• Under RM5,000 need: TEKUN starter, family loan\n• RM5,000–50,000: BSN Micro-i, TEKUN standard\n• RM50,000–500,000: SME Corp Malaysia, bank SME loans\n• Above RM500,000: Equity investors, venture capital, government grants'
      }
    ]
  }
]

const difficultyColors = {
  Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Finance: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Tips: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

export default function LearningPage() {
  const { theme } = useTheme()
  const { t, language } = useLanguage()
  const [expanded, setExpanded] = useState(null)
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('scoreku_learning_completed')
    return saved ? JSON.parse(saved) : []
  })
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { key: 'all', label: t('learnCatAll') || 'All' },
    { key: 'Beginner', label: t('beginner') },
    { key: 'Intermediate', label: t('intermediate') },
    { key: 'Finance', label: language === 'bm' ? 'Kewangan' : 'Finance' },
    { key: 'Tips', label: 'Tips' },
  ]

  const localizedArticles = articles.map((a, i) => {
    // Determine how many content sections this article has by checking translations
    // Default fallback to English array length
    const contentLength = a.content.length;
    const localizedContent = [];
    
    for (let j = 0; j < contentLength; j++) {
      localizedContent.push({
        heading: t(`learnA${i + 1}C${j + 1}H`) || a.content[j].heading,
        body: t(`learnA${i + 1}C${j + 1}B`) || a.content[j].body
      });
    }

    return {
      ...a,
      title: t(`learnA${i + 1}Title`) || a.title,
      subtitle: t(`learnA${i + 1}Sub`) || a.subtitle,
      content: localizedContent
    };
  })

  const toggleExpand = (id) => setExpanded(expanded === id ? null : id)

  const markComplete = (id) => {
    const updated = completed.includes(id) ? completed.filter(c => c !== id) : [...completed, id]
    setCompleted(updated)
    localStorage.setItem('scoreku_learning_completed', JSON.stringify(updated))
  }
  const filtered = localizedArticles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'all' || a.category === activeCategory
    return matchSearch && matchCat
  })

  const pageBg = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const textMuted = theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
  const inputBg = theme === 'dark' ? 'bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-gray-600' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
  const barBg = theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-gray-100'
  const divider = theme === 'dark' ? 'border-[#1f1f1f]' : 'border-gray-200'

  const progress = completed.length

  return (
    <div className={`min-h-screen ${pageBg} ${textPrimary}`}>
      {/* Top Navbar */}
      <header className={`sticky top-0 z-30 border-b ${divider} ${theme === 'dark' ? 'bg-[#0a0a0a]/90' : 'bg-gray-50/90'} backdrop-blur-sm`}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className={`flex items-center gap-1.5 text-sm ${textSecondary} hover:${textPrimary} transition-colors`}>
              <ArrowLeft size={16} />
              <span>{t('learnBackBtn')}</span>
            </Link>
            <div className={`w-px h-4 ${theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-gray-300'}`} />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">SK</span>
              </div>
              <span className={`text-sm font-semibold ${textPrimary}`}>{t('learnNavBrand')}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs ${textMuted}`}>{progress}/{articles.length} {t('learnCompletedCount') || 'completed'}</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={18} className="text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">{t('learnHeroLabel')}</span>
          </div>
          <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${textPrimary}`}>
            {t('learnHeroTitle1')}<br />
            <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              {t('learnHeroTitle2')}
            </span>
          </h1>
          <p className={`text-base ${textSecondary} max-w-xl`}>
            {t('learnHeroDesc')}
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`border rounded-2xl p-5 mb-8 ${cardBg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-amber-400" />
              <span className={`text-sm font-semibold ${textPrimary}`}>{t('learnYourProgress')}</span>
            </div>
            <span className={`text-sm ${textSecondary}`}>{progress} {t('learnProgressOf')} {articles.length} {t('learnProgressArticles')}</span>
          </div>
          <div className={`h-2.5 rounded-full overflow-hidden ${barBg}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(progress / articles.length) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500"
            />
          </div>
          <p className={`text-xs mt-2 ${textMuted}`}>
            {progress === 0 ? t('learnProgressStart') :
              progress === articles.length ? t('learnProgressDone') :
                `${articles.length - progress} ${t('learnProgressLeft')}`}
          </p>
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 space-y-4"
        >
          <div className="relative">
            <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${textMuted}`} />
            <input
              type="text"
              placeholder={t('learnSearchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm ${inputBg} outline-none focus:ring-2 focus:ring-blue-500/30`}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeCategory === cat.key
                    ? 'bg-blue-500 text-white border-blue-500'
                    : `${theme === 'dark' ? 'border-[#2a2a2a] text-gray-400 hover:border-blue-500/50' : 'border-gray-200 text-gray-500 hover:border-blue-300'}`
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Articles */}
        <div className="space-y-4">
          {filtered.map((article, i) => {
            const isExpanded = expanded === article.id
            const isCompleted = completed.includes(article.id)

            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`border rounded-2xl overflow-hidden transition-all ${cardBg} ${
                  isCompleted ? (theme === 'dark' ? 'border-emerald-500/30' : 'border-emerald-300') : ''
                }`}
              >
                {/* Card Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => toggleExpand(article.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${article.color} flex items-center justify-center text-xl flex-shrink-0 border ${article.border}`}>
                      {article.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-[11px] px-2 py-0.5 rounded-full border ${difficultyColors[article.category] || difficultyColors.Beginner}`}>
                              {article.category}
                            </span>
                            <span className={`text-[11px] ${textMuted}`}>{article.tag}</span>
                          </div>
                          <h3 className={`text-base font-semibold mb-1 ${textPrimary}`}>{article.title}</h3>
                          <p className={`text-sm ${textSecondary}`}>{article.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isCompleted && <CheckCircle2 size={16} className="text-emerald-400" />}
                          {isExpanded ? <ChevronUp size={18} className={textMuted} /> : <ChevronDown size={18} className={textMuted} />}
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 mt-2 text-xs ${textMuted}`}>
                        <Clock size={12} />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className={`px-6 pb-6 border-t ${divider}`}>
                        <div className="space-y-6 mt-6">
                          {article.content.map((section, j) => (
                            <div key={j}>
                              <h4 className={`text-sm font-semibold mb-2 ${textPrimary}`}>{section.heading}</h4>
                              <p className={`text-sm leading-relaxed whitespace-pre-line ${textSecondary}`}>{section.body}</p>
                            </div>
                          ))}
                        </div>
                        <div className={`mt-6 pt-5 border-t ${divider} flex items-center justify-between`}>
                          <button
                            onClick={(e) => { e.stopPropagation(); markComplete(article.id) }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                              isCompleted
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20'
                            }`}
                          >
                            <CheckCircle2 size={14} />
                            {isCompleted ? t('completedCheck') : t('markAsComplete')}
                          </button>
                          <Link
                            to="/score"
                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                            onClick={e => e.stopPropagation()}
                          >
                            {t('learnCheckScore')} →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-12 p-8 rounded-2xl border text-center bg-gradient-to-br from-blue-500/10 to-teal-500/5 ${theme === 'dark' ? 'border-blue-500/20' : 'border-blue-200'}`}
        >
          <TrendingUp size={32} className="text-blue-400 mx-auto mb-3" />
          <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>{t('learnCtaTitle')}</h3>
          <p className={`text-sm mb-5 ${textSecondary}`}>{t('learnCtaDesc')}</p>
          <Link
            to="/score"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            {t('learnCtaBtn')} →
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
