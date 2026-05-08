import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield, LayoutDashboard, FileText, Building2, GitCompare, BarChart3,
  Sparkles, Brain, Settings, RefreshCw, Receipt, User, FileBarChart,
  BookOpen, Gift, Star, HelpCircle
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Score Form', icon: FileText, path: '/score' },
  { label: 'Connect Bank', icon: Building2, path: '/connect-bank' },
  { label: 'Compare', icon: GitCompare, path: '/comparison' },
  { label: 'Marketplace', icon: BarChart3, path: '/marketplace' },
  { label: 'Simulator', icon: Sparkles, path: '/simulation' },
  { label: 'How AI Works', icon: Brain, path: '/ai' },
  { label: 'Transactions', icon: Receipt, path: '/transactions' },
  { label: 'Report', icon: FileBarChart, path: '/report' },
  { label: 'Learn', icon: BookOpen, path: '/learn' },
  { label: 'Referral', icon: Gift, path: '/referral' },
  { label: 'Features', icon: Star, path: '/features' },
  { label: 'How It Works', icon: HelpCircle, path: '/how-it-works' },
  { label: 'Profile', icon: User, path: '/profile' },
]

const defaultUser = {
  name: 'Zafran',
  email: 'zafran@example.com',
  memberSince: 'March 2026',
}

export default function AppSidebar({ activePath, mobileOpen, onClose, user = defaultUser, onRecalculate }) {
  const { theme } = useTheme()
  const { language, toggleLanguage } = useLanguage()
  const sidebarBg = theme === 'dark' ? 'bg-[#0f0f0f] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const navActive = theme === 'dark' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-200'
  const navInactive = theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
  const dividerColor = theme === 'dark' ? 'border-[#1f1f1f]' : 'border-gray-200'

  const handleRecalculate = onRecalculate || (() => { window.location.href = '/score' })

  return (
    <>
      {mobileOpen && (
        <motion.div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      <aside className={`flex flex-col fixed left-0 top-0 bottom-0 w-[260px] border-r z-[70] transform transition-transform duration-300 ${sidebarBg} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo + Theme Toggle */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              ScoreKu
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all border ${
                theme === 'dark'
                  ? 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 hover:border-blue-500/50'
                  : 'bg-gray-100 border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
            >
              {language === 'en' ? 'BM' : 'EN'}
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 mt-2 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activePath === item.path
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    isActive ? navActive : navInactive
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Divider */}
        <div className={`mx-6 border-t ${dividerColor}`} />

        {/* User Info */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2" style={{ borderColor: theme === 'dark' ? '#0f0f0f' : '#fff' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
              <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{user.email}</p>
            </div>
          </div>
          <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>Member since {user.memberSince}</p>
          <button
            onClick={handleRecalculate}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={14} />
            Recalculate Score
          </button>
        </div>
      </aside>
    </>
  )
}

export { navItems }
