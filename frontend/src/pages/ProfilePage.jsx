import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Bell, Shield, Download, Trash2, Bug, MessageCircle, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import AppSidebar from '../components/AppSidebar'
import toast from 'react-hot-toast'

const defaultProfile = {
  name: 'Zafran',
  email: 'zafran@example.com',
  phone: '+60115704xxxx',
  state: 'Pahang',
}

const defaultPrefs = { scoreUpdates: true, tips: true, productAlerts: false, emailAlerts: false }

export default function ProfilePage() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('scoreku_profile')
    return saved ? JSON.parse(saved) : defaultProfile
  })
  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem('scoreku_prefs')
    return saved ? JSON.parse(saved) : defaultPrefs
  })
  const [deleteModal, setDeleteModal] = useState(false)

  const saveProfile = () => {
    localStorage.setItem('scoreku_profile', JSON.stringify(profile))
    toast.success('Profile saved!')
  }

  const togglePref = (key) => {
    const updated = { ...prefs, [key]: !prefs[key] }
    setPrefs(updated)
    localStorage.setItem('scoreku_prefs', JSON.stringify(updated))
    if (key === 'emailAlerts') {
      toast.success(updated[key] ? `Email alerts enabled for ${profile.email}` : 'Email alerts disabled')
    } else {
      toast.success('Preference updated')
    }
  }

  const handleDeleteAccount = () => {
    localStorage.clear()
    toast.success('Account data cleared')
    setDeleteModal(false)
  }

  const pageBg = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const inputBg = theme === 'dark' ? 'bg-[#1a1a1a] border-[#2a2a2a] text-white' : 'bg-white border-gray-200 text-gray-900'

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  const bankConnected = !!localStorage.getItem('scoreku_bank_connected')

  return (
    <div className={`min-h-screen ${pageBg} ${textPrimary}`}>
      <button
        className={`lg:hidden fixed top-4 left-4 z-[55] p-2.5 border rounded-xl ${theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'}`}
        onClick={() => setSidebarOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <AppSidebar activePath="/profile" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} user={{ name: profile?.name || 'Zafran', email: profile?.email || '', memberSince: 'March 2026' }} />

      <main className="lg:ml-[260px] min-h-screen pb-8">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div variants={item} className="mb-6 pt-12 lg:pt-0">
            <h1 className={`text-2xl font-bold ${textPrimary}`}>{t('profileSettings')}</h1>
            <p className={`text-sm mt-1 ${textSecondary}`}>{t('profileSubtitle')}</p>
          </motion.div>

          {/* Personal Info */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-4 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <User size={16} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('personalInfo')}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Name', key: 'name', icon: User },
                { label: 'Email', key: 'email', icon: Mail },
                { label: 'Phone', key: 'phone', icon: Phone },
                { label: 'State', key: 'state', icon: MapPin },
              ].map(field => (
                <div key={field.key}>
                  <label className={`text-xs font-medium ${textSecondary} mb-1 block`}>{field.label}</label>
                  <input
                    type="text"
                    value={profile[field.key]}
                    onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm ${inputBg} focus:outline-none focus:border-emerald-500`}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={saveProfile}
              className="mt-5 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              {t('saveChanges')}
            </button>
          </motion.div>

          {/* Connected Accounts */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-4 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                <Shield size={16} className="text-teal-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('connectedAccounts')}</h3>
            </div>
            <div className={`flex items-center justify-between p-4 rounded-xl border ${theme === 'dark' ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${bankConnected ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                <div>
                  <p className={`text-sm font-medium ${textPrimary}`}>{t('bankAccount')}</p>
                  <p className={`text-xs ${textSecondary}`}>{bankConnected ? t('connectedViaOpenBanking') : t('notConnected')}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (bankConnected) {
                    localStorage.removeItem('scoreku_bank_connected')
                    toast.success('Bank disconnected')
                    window.location.reload()
                  } else {
                    window.location.href = '/connect-bank'
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  bankConnected
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {bankConnected ? t('disconnect') : t('connect')}
              </button>
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-4 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Bell size={16} className="text-amber-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('notificationPreferences')}</h3>
            </div>
            <div className="space-y-4">
              {[
                { key: 'scoreUpdates', label: 'Score Updates', desc: 'Get notified when your score changes' },
                { key: 'tips', label: 'Improvement Tips', desc: 'Weekly tips to improve your score' },
                { key: 'productAlerts', label: 'Product Alerts', desc: 'New financial products you qualify for' },
                { key: 'emailAlerts', label: 'Score Update Alerts (Email)', desc: 'Receive email when your score changes significantly', isEmail: true },
              ].map(pref => (
                <div key={pref.key} className={`flex items-center justify-between ${pref.isEmail ? `p-3 rounded-xl border ${theme === 'dark' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-500/5'}` : ''}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${textPrimary}`}>{pref.label}</p>
                      {pref.isEmail && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">📧 Email</span>}
                    </div>
                    <p className={`text-xs ${textSecondary}`}>{pref.desc}</p>
                  </div>
                  <button
                    onClick={() => togglePref(pref.key)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${prefs[pref.key] ? 'bg-emerald-500' : (theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-gray-300')}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${prefs[pref.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Data & Privacy */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-4 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Shield size={16} className="text-red-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('dataPrivacy')}</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => toast.success('Data export started. Check your email.')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border ${theme === 'dark' ? 'border-[#2a2a2a] text-gray-300 hover:border-emerald-500/30' : 'border-gray-200 text-gray-700 hover:border-emerald-300'}`}
              >
                <Download size={14} />
                {t('downloadMyData')}
              </button>
              <button
                onClick={() => setDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={14} />
                {t('deleteAccount')}
              </button>
            </div>
          </motion.div>

          {/* App Info */}
          <motion.div variants={item} className={`border rounded-2xl p-6 ${cardBg}`}>
            <h3 className={`font-semibold text-sm mb-4 ${textPrimary}`}>App Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`text-sm ${textSecondary}`}>Version</span>
                <span className={`text-sm ${textPrimary}`}>1.0.0</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => toast('Bug report form coming soon!')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${theme === 'dark' ? 'bg-[#1a1a1a] text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                >
                  <Bug size={12} /> Report Bug
                </button>
                <button
                  onClick={() => toast('Support: support@scoreku.my')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${theme === 'dark' ? 'bg-[#1a1a1a] text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                >
                  <MessageCircle size={12} /> Contact Support
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
          onClick={() => setDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-sm rounded-2xl p-6 border ${cardBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold text-red-400`}>{t('deleteAccountConfirm')}</h3>
              <button onClick={() => setDeleteModal(false)} className={textSecondary}><X size={18} /></button>
            </div>
            <p className={`text-sm mb-5 ${textSecondary}`}>{t('deleteAccountDesc')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(false)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${theme === 'dark' ? 'border-[#2a2a2a] text-gray-300' : 'border-gray-200 text-gray-700'}`}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600"
              >
                {t('delete')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
