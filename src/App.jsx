import { createContext, useContext, useEffect, useState } from 'react'
import Home from './pages/Home'
import Error from './pages/Error'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import Cursor from './components/Cursor'
import AccessibilityPanel from './components/AccessibilityPanel'
import ProtectedRoute from './components/ProtectedRoute'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import { fetchAllData, getStaticData } from './services/dataService'

const INITIAL_DATA = getStaticData()
const DataContext = createContext(INITIAL_DATA)

export function useDataContext() {
  return useContext(DataContext)
}

export default function App() {
  const [data, setData] = useState(INITIAL_DATA)

  useEffect(() => {
    let mounted = true

    fetchAllData()
      .then((result) => {
        if (!mounted) return
        setData({
          categories: result.categories,
          slides: result.slides,
          packs: result.packs,
          contactInfo: result.contactInfo,
          photoWall: result.photoWall,
        })
      })
      .catch((err) => {
        console.error('Error loading data:', err)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <BrowserRouter>
      <Cursor />
      <AccessibilityPanel />
      <Analytics />
      <SpeedInsights />
      <DataContext.Provider value={data}>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/admin/register" element={<Register />} />
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
    </BrowserRouter>
  )
}
