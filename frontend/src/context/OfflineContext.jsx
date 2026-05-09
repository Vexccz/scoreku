import { createContext, useContext, useState, useEffect } from 'react'

const OfflineContext = createContext(null)

export function OfflineProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [offlineData, setOfflineData] = useState(() => {
    const saved = localStorage.getItem('scoreku_offline_data')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const saveOfflineData = (data) => {
    localStorage.setItem('scoreku_offline_data', JSON.stringify(data))
    setOfflineData(data)
  }

  const clearOfflineData = () => {
    localStorage.removeItem('scoreku_offline_data')
    setOfflineData(null)
  }

  return (
    <OfflineContext.Provider value={{ isOnline, offlineData, saveOfflineData, clearOfflineData }}>
      {children}
    </OfflineContext.Provider>
  )
}

export function useOffline() {
  const context = useContext(OfflineContext)
  if (!context) throw new Error('useOffline must be used within OfflineProvider')
  return context
}
