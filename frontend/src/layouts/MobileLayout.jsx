import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, TrendingUp, Clock, User, Bell } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const tabs = [
  { label: 'Home', icon: LayoutDashboard, href: '/' },
  { label: 'Score', icon: TrendingUp, href: '/dashboard' },
  { label: 'History', icon: Clock, href: '/history' },
  { label: 'Profile', icon: User, href: '/profile' },
]

export default function MobileLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme } = useTheme()

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  const handleTabClick = (href) => {
    navigate(href)
  }

  const bgColor = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'
  const surfaceColor = theme === 'dark' ? 'bg-[#111]' : 'bg-gray-50'
  const borderColor = theme === 'dark' ? 'border-[#1f1f1f]' : 'border-gray-200'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  return (
    <div className={`min-h-screen ${bgColor} flex flex-col`}>
      {/* Top header - minimal */}
      <header className={`h-14 border-b ${borderColor} ${surfaceColor}/30 backdrop-blur-sm flex items-center justify-between px-4 flex-shrink-0 sticky top-0 z-30`}>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">SK</span>
          </div>
          <span className={`text-base font-bold ${textPrimary}`}>ScoreKu</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            className={`w-9 h-9 flex items-center justify-center rounded-lg ${textMuted} hover:${textPrimary} hover:${surfaceColor}/60 transition-colors relative`}
            title="Notifications"
          >
            <Bell size={18} />
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom tab navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 h-16 ${surfaceColor}/95 backdrop-blur-md border-t ${borderColor} z-40 flex items-center justify-around px-1`}>
        {tabs.map((tab) => {
          const active = isActive(tab.href)
          const Icon = tab.icon

          return (
            <button
              key={tab.href}
              onClick={() => handleTabClick(tab.href)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-2 rounded-lg transition-all duration-150 relative ${
                active
                  ? 'text-blue-500'
                  : `${textMuted} hover:${textPrimary}`
              }`}
            >
              {active && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full bg-blue-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[10px] font-medium ${active ? 'text-blue-500' : ''}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
