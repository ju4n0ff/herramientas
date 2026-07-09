import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

export function RequireAuth({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function check() {
      if (!supabase) {
        setLoading(false)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)
    }

    check()
  }, [])

  if (loading) return null

  if (!supabase) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p>Supabase no está configurado.</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default function RequireAdmin({ children }) {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function check() {
      if (!supabase) {
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

      setLoading(false)
    }

    check()
  }, [])

  if (loading) return null

  if (!supabase) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p>Supabase no está configurado.</p>
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
          Pide a un admin que cambie tu rol desde el panel, o si eres el primer usuario del
          sistema, puede que la migración deba ejecutarse aún.
        </p>
        <Link to="/">Volver al sitio</Link>
      </div>
    )
  }

  return children
}