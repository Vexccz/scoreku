import { useState, useRef, useEffect } from 'react'
import { Bell, TrendingUp, Package, UserCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const notifications = [
  {
    id: 1,
    icon: TrendingUp,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
    title: 'Your score increased by +4 points!',
    time: '2h ago',
  },
  {
    id: 2,
    icon: Package,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    title: 'New financial product available for you',
    time: '1d ago',
  },
  {
    id: 3,
    icon: UserCheck,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
    title: 'Complete your profile to improve accuracy',
    time: '3d ago',
  },
]

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { theme } = useTheme()

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`relative p-2.5 rounded-xl transition-all ${
          theme === 'dark'
            ? 'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-blue-500/30'
            : 'bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-blue-300'
        }`}
      >
        <Bell size={16} />
        <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white leading-none min-w-[18px] min-h-[18px]">
          3
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 top-12 w-80 rounded-2xl border shadow-2xl z-[100] overflow-hidden ${
              theme === 'dark'
                ? 'bg-[#111] border-[#1f1f1f]'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-[#1f1f1f]' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full font-medium">3 new</span>
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = n.icon
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3.5 transition-colors cursor-pointer ${
                      theme === 'dark'
                        ? 'hover:bg-[#1a1a1a] border-b border-[#1a1a1a]'
                        : 'hover:bg-gray-50 border-b border-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${n.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon size={14} className={n.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{n.title}</p>
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>{n.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className={`px-4 py-2.5 border-t ${theme === 'dark' ? 'border-[#1f1f1f]' : 'border-gray-100'}`}>
              <button className="w-full text-center text-xs text-blue-400 hover:text-blue-300 font-medium transition">
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
