import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ScoreFormPage from './pages/ScoreFormPage'
import DashboardPage from './pages/DashboardPage'
import SimulationPage from './pages/SimulationPage'
import AIExplainerPage from './pages/AIExplainerPage'
import OnboardingPage from './pages/OnboardingPage'
import NotFoundPage from './pages/NotFoundPage'
import BankConnectionPage from './pages/BankConnectionPage'

function OnboardingGuard({ children }) {
  const onboarded = localStorage.getItem('scoreku_onboarded')
  if (!onboarded) return <Navigate to="/welcome" replace />
  return children
}

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route path="/welcome" element={<OnboardingPage />} />
          <Route path="/" element={<OnboardingGuard><LandingPage /></OnboardingGuard>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/score" element={<ScoreFormPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/ai" element={<AIExplainerPage />} />
          <Route path="/connect-bank" element={<BankConnectionPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function ThemedApp() {
  const { theme } = useTheme()
  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0f0f0f] text-white' : 'bg-white text-gray-900'}`}>
      <AnimatedRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: theme === 'dark'
            ? { background: '#1f1f1f', color: '#fff' }
            : { background: '#fff', color: '#111', border: '1px solid #e5e7eb' }
        }}
      />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ThemedApp />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
