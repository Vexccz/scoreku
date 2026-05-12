import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { PageShell, BrandMark, btn } from '../components/ui'

export default function NotFoundPage() {
  return (
    <PageShell>
      <div className="relative flex items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg"
        >
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-12 text-white font-semibold tracking-tight">
            <BrandMark size={28} />
            <span>ScoreKu</span>
          </Link>

          <div className="relative mb-8">
            <div className="text-[160px] sm:text-[200px] font-semibold tracking-[-0.05em] leading-none bg-gradient-to-b from-white/90 to-white/10 bg-clip-text text-transparent tabular-nums">
              404
            </div>
            <div className="absolute inset-0 text-[160px] sm:text-[200px] font-semibold tracking-[-0.05em] leading-none text-emerald-500/5 blur-2xl tabular-nums">
              404
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-white mb-4">
            Page not found
          </h1>
          <p className="text-white/55 text-base mb-10 max-w-md mx-auto leading-relaxed">
            The page you are looking for does not exist or has been moved. Let's get you back on track.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/" className={btn.primary}>
              <Home size={16} />
              Back to home
            </Link>
            <button onClick={() => window.history.back()} className={btn.secondary}>
              <ArrowLeft size={16} />
              Go back
            </button>
          </div>
        </motion.div>
      </div>
    </PageShell>
  )
}
