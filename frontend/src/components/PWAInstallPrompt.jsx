import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, X } from 'lucide-react'

const STORAGE_KEY = 'scoreku_pwa_prompt_dismissed'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Already dismissed this session
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return
    } catch {
      return
    }

    // Already running as installed PWA
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return
    if (window.navigator.standalone) return

    const onBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Small delay so it doesn't interrupt initial render
      setTimeout(() => setVisible(true), 2500)
    }

    const onInstalled = () => {
      setVisible(false)
      setDeferredPrompt(null)
      try {
        localStorage.setItem(STORAGE_KEY, '1')
      } catch {}
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {}
  }

  const install = async () => {
    if (!deferredPrompt) return
    try {
      deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      if (choice && choice.outcome) {
        try {
          localStorage.setItem(STORAGE_KEY, '1')
        } catch {}
      }
    } catch {
      // ignore
    } finally {
      setVisible(false)
      setDeferredPrompt(null)
    }
  }

  return (
    <AnimatePresence>
      {visible && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          className="fixed z-[70] left-4 right-4 bottom-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm"
          role="dialog"
          aria-label="Install ScoreKu"
        >
          <div className="relative bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-emerald-500/30 rounded-2xl p-4 shadow-[0_24px_80px_-24px_rgba(16,185,129,0.5)] backdrop-blur">
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>

            <div className="flex items-start gap-3 pr-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.6)]">
                <Download size={18} className="text-black" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white">
                  Install ScoreKu on your device
                </h3>
                <p className="text-[11px] text-white/60 mt-0.5 leading-relaxed">
                  Get offline access and home-screen shortcut. No app store needed.
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={dismiss}
                className="flex-1 px-3 py-2 text-xs font-medium text-white/70 hover:text-white border border-white/[0.08] hover:border-white/20 rounded-lg transition-colors"
              >
                Not now
              </button>
              <button
                onClick={install}
                className="flex-1 px-3 py-2 text-xs font-semibold text-black bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 rounded-lg transition-colors shadow-[0_6px_16px_-6px_rgba(16,185,129,0.6)]"
              >
                Install
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
