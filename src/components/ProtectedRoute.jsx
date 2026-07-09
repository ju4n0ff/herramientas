import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      if (!supabase) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(false)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)

      if (!session) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle()

      if (profileError) {
        setError(profileError.message)
        setIsAdmin(false)
      } else {
        setError('')
        setIsAdmin(profile?.role === 'admin')
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
    }

    checkSession()

    if (!supabase) return

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) setIsAdmin(false)
      else checkSession()
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

  if (!isAdmin) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p>Tu cuenta no tiene permisos de administrador.</p>
        {error && <p>Error: {error}</p>}
        <p>
          Pide a un admin que cambie tu rol desde el panel, o registra el primer usuario del
          sistema para crear el admin inicial.
        </p>
        <Link to="/">Volver al sitio</Link>
      </div>
    )
  }

  return children
}
