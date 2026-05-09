import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, FileText, Clock, User } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { label: 'Home', icon: Home, path: '/dashboard' },
  { label: 'Score', icon: FileText, path: '/score' },
  { label: 'History', icon: Clock, path: '/history' },
  { label: 'Profile', icon: User, path: '/profile' },
]

export default function BottomNav() {
  const location = useLocation()
  const { theme } = useTheme()
  
  const bgColor = theme === 'dark' ? 'bg-[#0f0f0f]/95' : 'bg-white/95'
  const borderColor = theme === 'dark' ? 'border-[#1f1f1f]' : 'border-gray-200'
  const activeColor = theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
  const inactiveColor = theme === 'dark' ? 'text-gray-500' : 'text-gray-400'

  return (
    <nav className={`fixed bottom-0 left-0 right-0 h-16 ${bgColor} backdrop-blur-md border-t ${borderColor} z-50 lg:hidden`}>
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center flex-1 h-full"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon 
                size={20} 
                className={`mb-1 transition-colors ${isActive ? activeColor : inactiveColor}`}
              />
              <span className={`text-[10px] font-medium transition-colors ${isActive ? activeColor : inactiveColor}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
