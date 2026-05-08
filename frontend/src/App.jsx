import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
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
import ComparisonPage from './pages/ComparisonPage'
import MarketplacePage from './pages/MarketplacePage'
import TransactionsPage from './pages/TransactionsPage'
import ProfilePage from './pages/ProfilePage'
import MonthlyReportPage from './pages/MonthlyReportPage'
import ReferralPage from './pages/ReferralPage'
import LearningPage from './pages/LearningPage'
import FeaturesPage from './pages/FeaturesPage'
import HowItWorksPage from './pages/HowItWorksPage'
import AIChatWidget from './components/AIChatWidget'

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
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/report" element={<MonthlyReportPage />} />
          <Route path="/referral" element={<ReferralPage />} />
          <Route path="/learn" element={<LearningPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
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
      <AIChatWidget />
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
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ThemedApp />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App
