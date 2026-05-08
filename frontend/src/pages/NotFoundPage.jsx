import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, LayoutDashboard, LinkIcon } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Animated broken link icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8 inline-flex"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 border border-[#1f1f1f] flex items-center justify-center"
          >
            <LinkIcon size={40} className="text-gray-500" />
          </motion.div>
        </motion.div>

        {/* 404 text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-8xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-4"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-400 mb-2"
        >
          Page not found
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-600 mb-10"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-600/20"
          >
            <Home size={16} />
            Go Home
          </Link>
          <Link
            to="/dashboard?demo=true"
            className="flex items-center gap-2 px-6 py-3.5 bg-[#111] border border-[#1f1f1f] hover:border-blue-500/50 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-all"
          >
            <LayoutDashboard size={16} />
            Try Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
