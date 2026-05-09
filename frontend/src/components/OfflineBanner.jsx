import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, X } from 'lucide-react'
import { useOffline } from '../context/OfflineContext'
import { useTheme } from '../context/ThemeContext'

export default function OfflineBanner() {
  const { isOnline } = useOffline()
  const { theme } = useTheme()
  
  const bgColor = theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'
  const borderColor = theme === 'dark' ? 'border-amber-500/30' : 'border-amber-200'
  const textColor = theme === 'dark' ? 'text-amber-400' : 'text-amber-700'

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-0 left-0 right-0 z-[100] ${bgColor} border-b ${borderColor} backdrop-blur-md`}
        >
          <div className="flex items-center justify-center gap-2 px-4 py-3">
            <WifiOff size={16} className={textColor} />
            <span className={`text-sm font-medium ${textColor}`}>
              You're offline. Some features may be limited.
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
