import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Copy, Share2, Users, Trophy, Award, Star } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import AppSidebar from '../components/AppSidebar'
import toast from 'react-hot-toast'

const referralCode = 'SCOREKU-ZAF72'

const stats = {
  invited: 3,
  signedUp: 2,
  pointsEarned: 50,
}

function getRewardTiers(t) {
  return [
    { referrals: 1, points: 10, badge: null, label: `1 ${t('referral')}` },
    { referrals: 5, points: 50, badge: t('referrer'), label: `5 ${t('referrals')}` },
    { referrals: 10, points: 100, badge: t('ambassador'), label: `10 ${t('referrals')}` },
  ]
}

const leaderboard = [
  { rank: 1, name: 'Ahmad K.', referrals: 12, badge: '🏆' },
  { rank: 2, name: 'Siti N.', referrals: 9, badge: '🥈' },
  { rank: 3, name: 'Zafran', referrals: 3, badge: '🥉' },
  { rank: 4, name: 'Hafiz M.', referrals: 2, badge: '' },
  { rank: 5, name: 'Aina R.', referrals: 1, badge: '' },
]

export default function ReferralPage() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const rewardTiers = getRewardTiers(t)

  const pageBg = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'
  const cardBg = theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode)
    toast.success('Referral code copied!')
  }

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=Join%20ScoreKu%20and%20build%20your%20credit%20score!%20Use%20my%20code:%20${referralCode}%20https://scoreku.my/register?ref=${referralCode}`, '_blank')
  }

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=https://scoreku.my/register?ref=${referralCode}&text=Join%20ScoreKu!%20Code:%20${referralCode}`, '_blank')
  }

  return (
    <div className={`min-h-screen ${pageBg} ${textPrimary}`}>
      <button
        className={`lg:hidden fixed top-4 left-4 z-[55] p-2.5 border rounded-xl ${theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-white border-gray-200'}`}
        onClick={() => setSidebarOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <AppSidebar activePath="/referral" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px] min-h-screen pb-8">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <motion.div variants={item} className="mb-6 pt-12 lg:pt-0">
            <h1 className={`text-2xl font-bold ${textPrimary}`}>{t('inviteFriends')}</h1>
            <p className={`text-sm mt-1 ${textSecondary}`}>{t('referralSubtitle')}</p>
          </motion.div>

          {/* Referral Code Card */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-6 ${cardBg} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5" />
            <div className="relative">
              <p className={`text-sm ${textSecondary} mb-2`}>{t('yourReferralCode')}</p>
              <div className="flex items-center gap-3 mb-5">
                <div className={`flex-1 px-5 py-3 rounded-xl border-2 border-dashed text-center ${theme === 'dark' ? 'border-blue-500/30 bg-blue-500/5' : 'border-blue-300 bg-blue-50'}`}>
                  <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                    {referralCode}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copyCode}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:opacity-90"
                >
                  <Copy size={14} /> {t('copyCode')}
                </button>
                <button
                  onClick={shareWhatsApp}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                >
                  <Share2 size={14} /> WhatsApp
                </button>
                <button
                  onClick={shareTelegram}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
                >
                  <Share2 size={14} /> Telegram
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={item} className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: t('friendsInvited'), value: stats.invited, icon: Users, color: 'text-blue-400' },
              { label: t('signedUp'), value: stats.signedUp, icon: Award, color: 'text-emerald-400' },
              { label: t('pointsEarned'), value: stats.pointsEarned, icon: Star, color: 'text-amber-400' },
            ].map((s, i) => (
              <div key={i} className={`border rounded-xl p-4 text-center ${cardBg}`}>
                <s.icon size={20} className={`mx-auto mb-2 ${s.color}`} />
                <p className={`text-2xl font-bold ${textPrimary}`}>{s.value}</p>
                <p className={`text-xs ${textSecondary}`}>{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Reward Tiers */}
          <motion.div variants={item} className={`border rounded-2xl p-6 mb-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Trophy size={16} className="text-amber-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('rewardTiers')}</h3>
            </div>
            <div className="space-y-3">
              {rewardTiers.map((tier, i) => {
                const achieved = stats.invited >= tier.referrals
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-4 rounded-xl border ${
                      achieved
                        ? (theme === 'dark' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-emerald-300 bg-emerald-50')
                        : (theme === 'dark' ? 'border-[#2a2a2a]' : 'border-gray-200')
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        achieved ? 'bg-emerald-500/20 text-emerald-400' : (theme === 'dark' ? 'bg-[#1a1a1a] text-gray-500' : 'bg-gray-100 text-gray-400')
                      }`}>
                        {tier.referrals}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${textPrimary}`}>{tier.label}</p>
                        <p className={`text-xs ${textSecondary}`}>
                          +{tier.points} points{tier.badge && ` + "${tier.badge}" badge`}
                        </p>
                      </div>
                    </div>
                    {achieved && <span className="text-xs text-emerald-400 font-medium">✓ {t('achieved')}</span>}
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div variants={item} className={`border rounded-2xl p-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Trophy size={16} className="text-purple-400" />
              </div>
              <h3 className="font-semibold text-sm">{t('topReferrers')}</h3>
            </div>
            <div className="space-y-3">
              {leaderboard.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className={`flex items-center gap-4 p-3 rounded-xl ${
                    entry.name === 'Zafran'
                      ? (theme === 'dark' ? 'bg-blue-500/5 border border-blue-500/20' : 'bg-blue-50 border border-blue-200')
                      : ''
                  }`}
                >
                  <span className="text-lg w-8 text-center">{entry.badge || `#${entry.rank}`}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${textPrimary}`}>{entry.name}</p>
                  </div>
                  <span className={`text-sm font-medium ${textSecondary}`}>{entry.referrals} {t('referrals')}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
