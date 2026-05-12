import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Clock, Smartphone, Wallet, AlertCircle,
  Sparkles, ChevronRight, RefreshCw, Activity, DollarSign
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import AppSidebar from '../components/AppSidebar'
import ScoreGauge from '../components/ScoreGauge'

// ─── Heuristic score formula (frontend-only, not real XGBoost) ───────────────
// Weights chosen so combined delta fits roughly within +/- 150 of the
// starting score, matching a 300-850 range realistically.
const WEIGHTS = {
  paymentRegularity: 1.2,   // 0-100 %, dominant positive factor
  ewalletMonths: 4.0,        // 0-24 months, strong signal of activity
  incomeRM: 0.012,           // 0-10000, scaled: 10000 RM ≈ +120 pts max
  missedPayments: -9.0,      // each missed payment hurts heavily
  digitalFootprint: 0.6,     // 0-100, modest positive
}

const MIN_SCORE = 300
const MAX_SCORE = 850

function computeProjectedScore(base, inputs) {
  const delta =
    (inputs.paymentRegularity - 60) * WEIGHTS.paymentRegularity +
    (inputs.ewalletMonths - 6) * WEIGHTS.ewalletMonths +
    (inputs.incomeRM - 2500) * WEIGHTS.incomeRM +
    inputs.missedPayments * WEIGHTS.missedPayments +
    (inputs.digitalFootprint - 40) * WEIGHTS.digitalFootprint

  const raw = Math.round(base + delta)
  return Math.max(MIN_SCORE, Math.min(MAX_SCORE, raw))
}

function computeContributions(inputs) {
  return [
    {
      id: 'paymentRegularity',
      label: 'Payment regularity',
      icon: Activity,
      color: '#10b981',
      value: Math.round((inputs.paymentRegularity - 60) * WEIGHTS.paymentRegularity),
    },
    {
      id: 'ewalletMonths',
      label: 'E-wallet consistency',
      icon: Smartphone,
      color: '#14b8a6',
      value: Math.round((inputs.ewalletMonths - 6) * WEIGHTS.ewalletMonths),
    },
    {
      id: 'incomeRM',
      label: 'Monthly income',
      icon: DollarSign,
      color: '#22d3a5',
      value: Math.round((inputs.incomeRM - 2500) * WEIGHTS.incomeRM),
    },
    {
      id: 'missedPayments',
      label: 'Missed payments',
      icon: AlertCircle,
      color: '#ef4444',
      value: Math.round(inputs.missedPayments * WEIGHTS.missedPayments),
    },
    {
      id: 'digitalFootprint',
      label: 'Digital footprint',
      icon: Wallet,
      color: '#34d399',
      value: Math.round((inputs.digitalFootprint - 40) * WEIGHTS.digitalFootprint),
    },
  ].sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
}

// ─── Slider primitive (emerald themed) ───────────────────────────────────────
function ThemedSlider({ label, icon: Icon, value, min, max, step = 1, onChange, format, hint }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-5 hover:border-emerald-500/20 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Icon size={15} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">{label}</div>
            {hint && <div className="text-[11px] text-white/40 mt-0.5">{hint}</div>}
          </div>
        </div>
        <div className="text-sm font-semibold text-emerald-400 tabular-nums">
          {format ? format(value) : value}
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full
            [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black
            [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(16,185,129,0.2)]
            [&::-webkit-slider-thumb]:-mt-[5px]
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-emerald-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${pct}%, rgba(255,255,255,0.08) ${pct}%, rgba(255,255,255,0.08) 100%)`,
            height: '6px',
            borderRadius: '9999px',
          }}
        />
        <div className="flex justify-between mt-2 text-[10px] text-white/30 tabular-nums">
          <span>{format ? format(min) : min}</span>
          <span>{format ? format(max) : max}</span>
        </div>
      </div>
    </div>
  )
}

export default function SimulationPage() {
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Base score: localStorage or default 650
  const baseScore = useMemo(() => {
    try {
      const saved = localStorage.getItem('scoreku_last_score')
      const n = saved ? parseInt(saved, 10) : NaN
      return Number.isFinite(n) ? Math.max(MIN_SCORE, Math.min(MAX_SCORE, n)) : 650
    } catch {
      return 650
    }
  }, [])

  // Slider state — defaults represent a "baseline" user so delta starts ~0
  const [inputs, setInputs] = useState({
    paymentRegularity: 60,
    ewalletMonths: 6,
    incomeRM: 2500,
    missedPayments: 0,
    digitalFootprint: 40,
  })

  const projectedScore = computeProjectedScore(baseScore, inputs)
  const [displayScore, setDisplayScore] = useState(projectedScore)
  const contributions = computeContributions(inputs)
  const totalDelta = projectedScore - baseScore

  // Animate display score on change
  useEffect(() => {
    const startScore = displayScore
    const diff = projectedScore - startScore
    if (diff === 0) return
    const duration = 450
    const startTime = Date.now()
    let raf
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(Math.round(startScore + diff * eased))
      if (progress < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => raf && cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectedScore])

  const setField = (key) => (v) => setInputs((s) => ({ ...s, [key]: v }))

  const resetAll = () =>
    setInputs({
      paymentRegularity: 60,
      ewalletMonths: 6,
      incomeRM: 2500,
      missedPayments: 0,
      digitalFootprint: 40,
    })

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      {/* atmospheric background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-teal-500/[0.05] rounded-full blur-[140px]" />
      </div>

      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[55] p-2.5 bg-[#0a0a0a] border border-white/[0.08] rounded-xl"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <AppSidebar activePath="/simulation" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10 pt-12 lg:pt-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium mb-4">
              <Sparkles size={12} /> What-If Mode
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
              {t('scoreSimulator').split(' ')[0]}{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                {t('scoreSimulator').split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <p className="text-white/60 max-w-lg mx-auto text-sm">
              Adjust the sliders below to see how your financial behavior would shift your projected score.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Score panel — left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-2"
            >
              <div className="sticky top-8">
                <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-3xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">{t('currentScore')}</p>
                      <p className="text-2xl font-bold text-white/50 tabular-nums">{baseScore}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">{t('projected')}</p>
                      <p className="text-2xl font-bold text-emerald-400 tabular-nums">{projectedScore}</p>
                    </div>
                  </div>

                  <div className="flex justify-center mb-6">
                    <ScoreGauge score={displayScore} size={220} animate={false} />
                  </div>

                  <AnimatePresence mode="wait">
                    {totalDelta !== 0 && (
                      <motion.div
                        key={totalDelta > 0 ? 'gain' : 'loss'}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div
                          className={`rounded-2xl p-4 text-center border ${
                            totalDelta > 0
                              ? 'bg-emerald-500/10 border-emerald-500/20'
                              : 'bg-red-500/10 border-red-500/20'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2 mb-1">
                            {totalDelta > 0 ? (
                              <TrendingUp size={14} className="text-emerald-400" />
                            ) : (
                              <TrendingDown size={14} className="text-red-400" />
                            )}
                            <p
                              className={`text-sm font-semibold ${
                                totalDelta > 0 ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              {totalDelta > 0 ? '+' : ''}
                              {totalDelta} points vs current
                            </p>
                          </div>
                          <p className="text-[11px] text-white/40">{t('achievableIn')}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Top contributing factors */}
                  <div className="mt-6">
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-3">
                      Top contributing factors
                    </p>
                    <div className="space-y-2">
                      {contributions.slice(0, 3).map((c) => {
                        const CIcon = c.icon
                        const positive = c.value >= 0
                        return (
                          <div
                            key={c.id}
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                          >
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                              style={{
                                background: `${c.color}15`,
                                border: `1px solid ${c.color}30`,
                              }}
                            >
                              <CIcon size={13} style={{ color: c.color }} />
                            </div>
                            <span className="flex-1 text-xs text-white/70">{c.label}</span>
                            <span
                              className={`text-xs font-semibold tabular-nums ${
                                positive ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              {positive ? '+' : ''}
                              {c.value}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={resetAll}
                      className="flex items-center justify-center gap-2 px-4 py-3 border border-white/[0.08] hover:border-white/20 rounded-xl text-xs font-medium text-white/70 hover:text-white transition-colors"
                    >
                      <RefreshCw size={14} /> Reset
                    </button>
                    <Link
                      to="/score"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black rounded-xl text-sm font-semibold transition-colors shadow-[0_8px_24px_-8px_rgba(16,185,129,0.6)]"
                    >
                      {t('getYourRealScore')} <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sliders — right */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-white/40" />
                <p className="text-xs text-white/40">Adjust your behavior profile</p>
              </div>

              <ThemedSlider
                label="Payment regularity"
                hint="Share of bills paid on time"
                icon={Activity}
                value={inputs.paymentRegularity}
                min={0}
                max={100}
                onChange={setField('paymentRegularity')}
                format={(v) => `${v}%`}
              />

              <ThemedSlider
                label="E-wallet consistency"
                hint="Months of regular digital wallet use"
                icon={Smartphone}
                value={inputs.ewalletMonths}
                min={0}
                max={24}
                onChange={setField('ewalletMonths')}
                format={(v) => `${v} mo`}
              />

              <ThemedSlider
                label="Average monthly income"
                hint="Net income deposited per month"
                icon={DollarSign}
                value={inputs.incomeRM}
                min={0}
                max={10000}
                step={100}
                onChange={setField('incomeRM')}
                format={(v) => `RM ${v.toLocaleString()}`}
              />

              <ThemedSlider
                label="Missed payments"
                hint="Number of missed payments in last 12 months"
                icon={AlertCircle}
                value={inputs.missedPayments}
                min={0}
                max={12}
                onChange={setField('missedPayments')}
                format={(v) => `${v}`}
              />

              <ThemedSlider
                label="Digital footprint"
                hint="Activity across e-commerce & verified accounts"
                icon={Wallet}
                value={inputs.digitalFootprint}
                min={0}
                max={100}
                onChange={setField('digitalFootprint')}
                format={(v) => `${v}`}
              />

              {/* How it works note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 mt-4"
              >
                <h3 className="text-sm font-semibold text-white mb-3">{t('howSimWorks')}</h3>
                <ul className="space-y-2 text-xs text-white/50">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    {t('simNote1')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    {t('simNote2')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    {t('simNote3')}
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
