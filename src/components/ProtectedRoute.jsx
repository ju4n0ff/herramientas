import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      if (!supabase) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(false)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSession(session)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
    }

    checkSession()

    if (!supabase) return

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (loading) return null

  if (!supabase) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p>Supabase no está configurado.</p>
        <p>Crea un archivo <code>.env</code> basado en <code>.env.example</code>.</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}