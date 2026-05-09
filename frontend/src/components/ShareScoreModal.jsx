import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Shield, Check } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ShareScoreModal({ isOpen, onClose, score, category }) {
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()

  const shareText = `My ScoreKu credit score is ${score}/850! 🎯 Check yours at scoreku.my — the AI-powered alternative credit score for Malaysians.`
  const shareUrl = `${window.location.origin}/dashboard?demo=true`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleTwitterShare = () => {
    const twitterText = encodeURIComponent(`My ScoreKu credit score is ${score}/850! 🎯 Check yours at scoreku.my #ScoreKu #CreditScore #Malaysia`)
    window.open(`https://twitter.com/intent/tweet?text=${twitterText}`, '_blank', 'noopener,noreferrer')
  }

  const handleWhatsAppShare = () => {
    const waText = encodeURIComponent(`${shareText}\n${shareUrl}`)
    window.open(`https://wa.me/?text=${waText}`, '_blank', 'noopener,noreferrer')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`relative w-full max-w-md rounded-3xl border p-6 shadow-2xl ${
              theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
            }`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-xl transition ${
                theme === 'dark' ? 'hover:bg-[#1a1a1a] text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X size={18} />
            </button>

            <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Share Your Score 🎯
            </h3>

            {/* Score Card Preview */}
            <div className="relative rounded-2xl overflow-hidden mb-6">
              <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] p-8 text-center">
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" />
                <div className="absolute bottom-4 right-4 w-16 h-16 bg-teal-500/10 rounded-full blur-2xl" />

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                    <Shield size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                    ScoreKu
                  </span>
                </div>

                {/* Score */}
                <div className="relative inline-flex items-center justify-center w-28 h-28 mb-4">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#1f1f1f" strokeWidth="6" />
                    <circle
                      cx="60" cy="60" r="50" fill="none"
                      stroke="url(#shareGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(score / 100) * 314} 314`}
                    />
                    <defs>
                      <linearGradient id="shareGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#14b8a6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute text-3xl font-bold text-white">{score}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">out of 850</p>

                {/* Category */}
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
                  style={{
                    color: category.color,
                    backgroundColor: `${category.color}15`,
                    border: `1px solid ${category.color}30`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                  {category.label}
                </div>

                {/* Footer */}
                <p className="text-[11px] text-gray-500 mt-2">
                  Generated by ScoreKu - AI Alternative Credit Scoring
                </p>
                <p className="text-[10px] text-gray-600 mt-1">scoreku.my</p>
              </div>
            </div>

            {/* Share text preview */}
            <div className={`rounded-xl p-3 mb-4 text-xs ${theme === 'dark' ? 'bg-[#1a1a1a] text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
              "{shareText}"
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Twitter / X */}
              <button
                onClick={handleTwitterShare}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 text-[#1DA1F2] hover:bg-[#1DA1F2]/20"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Share on X
              </button>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </button>
            </div>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:border-blue-500/30'
                  : 'bg-gray-100 border border-gray-200 text-gray-800 hover:border-blue-300'
              }`}
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>

            <p className={`text-center text-[11px] mt-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
              Tip: Screenshot the card above to share on Instagram or TikTok!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
