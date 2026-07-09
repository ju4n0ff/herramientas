import { createContext, useContext } from 'react'
import { useData } from './hooks/useData'
import Home from './pages/Home'
import Error from './pages/Error'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Cursor from './components/Cursor'
import AccessibilityPanel from './components/AccessibilityPanel'
import ProtectedRoute from './components/ProtectedRoute'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import styles from './styles/Loading.module.css'

const DataContext = createContext(null)

export function useDataContext() {
  return useContext(DataContext)
}

function LoadingSpinner() {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
      <p className={styles.label}>Cargando...</p>
    </div>
  )
}

function AppContent() {
  const { data, loading, error } = useData()

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className={styles.overlay}>
        <p className={styles.label}>Error al cargar los datos.</p>
      </div>
    )
  }

  return (
    <DataContext.Provider value={data}>
      <Cursor />
      <AccessibilityPanel />
      <Analytics />
      <SpeedInsights />
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </DataContext.Provider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}