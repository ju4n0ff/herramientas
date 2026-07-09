import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import styles from '../styles/Admin.module.css'

const formatDate = (value) => {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true

    async function load() {
      if (!supabase) {
        setError('Supabase no configurado.')
        setLoading(false)
        return
      }

      const { data: authData, error: userError } = await supabase.auth.getUser()

      if (userError || !authData.user) {
        navigate('/admin/login')
        return
      }

      const userId = authData.user.id

      const [profileResult, messagesResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, email, full_name, phone, role')
          .eq('id', userId)
          .maybeSingle(),
        supabase
          .from('messages')
          .select('id, nombre, telefono, servicio, fecha, mensaje, status, created_at')
          .eq('telefono', authData.user.user_metadata?.phone || '')
          .order('created_at', { ascending: false })
          .limit(50),
      ])

      if (!mounted) return

      if (profileResult.error) {
        setError(profileResult.error.message)
      } else {
        setProfile(profileResult.data)
      }

      setMessages(messagesResult.data || [])
      setUser(authData.user)
      setLoading(false)
    }

    load()

    return () => {
      mounted = false
    }
  }, [navigate])

  const handleLogout = async () => {
    await supabase?.auth.signOut()
    navigate('/')
  }

  if (loading) return <div className={styles.loading}>Cargando...</div>

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Mi panel</h1>
          <p className={styles.headerText}>
            {profile?.full_name || user?.email}
          </p>
        </div>
        <div className={styles.userInfo}>
          <Link className={styles.linkBtn} to="/">
            Ver sitio
          </Link>
          <Link className={styles.linkBtn} to="/perfil">
            Editar perfil
          </Link>
          {profile?.role === 'admin' && (
            <Link className={styles.linkBtn} to="/admin">
              Panel admin
            </Link>
          )}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {error && <div className={styles.error}>{error}</div>}

        <section className={styles.card}>
          <h2>Mi perfil</h2>
          <div className={styles.profileInfo}>
            <p>
              <strong>Nombre:</strong> {profile?.full_name || '—'}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>WhatsApp:</strong> {profile?.phone || '—'}
            </p>
            <p>
              <strong>Rol:</strong> {profile?.role === 'admin' ? 'Administrador' : 'Usuario'}
            </p>
          </div>
          <Link className={styles.smallBtn} to="/perfil" style={{ marginTop: 16, display: 'inline-flex' }}>
            Editar perfil
          </Link>
        </section>

        <section className={`${styles.card} ${styles.cardWide}`}>
          <h2>Mis mensajes</h2>
          <p className={styles.empty}>
            {messages.length === 0
              ? 'Todavía no has enviado mensajes desde el formulario de contacto.'
              : 'Últimos mensajes enviados.'}
          </p>
          {messages.length > 0 && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Servicio</th>
                    <th>Fecha del evento</th>
                    <th>Mensaje</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message.id}>
                      <td>{formatDate(message.created_at)}</td>
                      <td>{message.servicio}</td>
                      <td>{message.fecha || '—'}</td>
                      <td>{message.mensaje || 'Sin detalles'}</td>
                      <td>
                        <span className={styles.statusBadge}>
                          {message.status === 'nuevo' && 'Pendiente'}
                          {message.status === 'leido' && 'Leído'}
                          {message.status === 'archivado' && 'Archivado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}