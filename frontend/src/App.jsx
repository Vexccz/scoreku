import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ScoreFormPage from './pages/ScoreFormPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0f0f0f] text-white">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/score" element={<ScoreFormPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
          <Toaster position="top-right" toastOptions={{ style: { background: '#1f1f1f', color: '#fff' } }} />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
