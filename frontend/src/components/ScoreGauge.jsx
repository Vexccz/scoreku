import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function ScoreGauge({ score, size = 200, animate = true }) {
  const { theme } = useTheme()
  
  // Calculate percentage (300-850 range)
  const minScore = 300
  const maxScore = 850
  const percentage = ((score - minScore) / (maxScore - minScore)) * 100
  
  // Determine color based on score
  const getColor = () => {
    if (score >= 720) return { from: '#10b981', to: '#059669', label: 'Excellent' }
    if (score >= 650) return { from: '#3b82f6', to: '#2563eb', label: 'Good' }
    if (score >= 530) return { from: '#f59e0b', to: '#d97706', label: 'Moderate' }
    return { from: '#ef4444', to: '#dc2626', label: 'High Risk' }
  }
  
  const color = getColor()
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme === 'dark' ? '#1a1a1a' : '#e5e7eb'}
          strokeWidth="12"
          fill="none"
        />
        
        {/* Animated progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#gradient-${score})`}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={animate ? { strokeDashoffset } : {}}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id={`gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color.from} />
            <stop offset="100%" stopColor={color.to} />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
            className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            {animate ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                {score}
              </motion.span>
            ) : (
              score
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.2 }}
            className="text-xs font-medium mt-1"
            style={{ color: color.from }}
          >
            {color.label}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Glow effect */}
      {animate && (
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl opacity-20"
          style={{ background: `radial-gradient(circle, ${color.from}, transparent)` }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
      )}
    </div>
  )
}
