import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import styles from '../styles/Admin.module.css'

const STATUS_LABELS = {
  nuevo: 'Nuevo',
  leido: 'Leído',
  archivado: 'Archivado',
}

const formatDate = (value) => {
  if (!value) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

const whatsappHref = (phone) => {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return '#'
  return `https://wa.me/${digits.startsWith('51') ? digits : `51${digits}`}`
}

export default function Admin() {
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [savingRole, setSavingRole] = useState('')
  const [savingMessage, setSavingMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true

    async function loadAdminData() {
      if (!supabase) {
        setError('Supabase no está configurado.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      const { data: authData, error: userError } = await supabase.auth.getUser()

      if (userError) {
        if (!mounted) return
        setError(userError.message)
        setLoading(false)
        return
      }

      const [messagesResult, profilesResult] = await Promise.all([
        supabase
          .from('messages')
          .select('id, nombre, telefono, servicio, fecha, mensaje, status, created_at')
          .order('created_at', { ascending: false })
          .limit(100),
        supabase
          .from('profiles')
          .select('id, email, full_name, phone, role, created_at')
          .order('created_at', { ascending: true }),
      ])

      if (!mounted) return

      if (messagesResult.error || profilesResult.error) {
        setError(messagesResult.error?.message || profilesResult.error?.message)
      } else {
        setMessages(messagesResult.data || [])
        setProfiles(profilesResult.data || [])
      }

      setUser(authData.user)
      setLoading(false)
    }

    loadAdminData()

    return () => {
      mounted = false
    }
  }, [reloadKey])

  const handleLogout = async () => {
    await supabase?.auth.signOut()
    navigate('/admin/login')
  }

  const refresh = () => setReloadKey((key) => key + 1)

  const updateMessageStatus = async (id, status) => {
    setSavingMessage(String(id))
    setError('')

    const { error: updateError } = await supabase
      .from('messages')
      .update({ status })
      .eq('id', id)

    setSavingMessage('')

    if (updateError) {
      setError(updateError.message)
      return
    }

    refresh()
  }

  const updateRole = async (profile, role) => {
    if (profile.id === user?.id && role !== 'admin') {
      setError('No puedes quitarte el rol admin a ti mismo.')
      return
    }

    setSavingRole(profile.id)
    setError('')

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', profile.id)

    setSavingRole('')

    if (updateError) {
      setError(updateError.message)
      return
    }

    refresh()
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Panel de Administración</h1>
          <p className={styles.headerText}>Mensajes, usuarios y datos operativos del sitio.</p>
        </div>
        <div className={styles.userInfo}>
          <Link className={styles.linkBtn} to="/">
            Ver sitio
          </Link>
          <span>{user?.email}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {error && <div className={styles.error}>{error}</div>}

        <section className={`${styles.card} ${styles.cardWide}`}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Mensajes</h2>
              <p>Últimos mensajes enviados desde el formulario de contacto.</p>
            </div>
            <button className={styles.smallBtn} onClick={refresh} disabled={loading}>
              Actualizar
            </button>
          </div>

          {loading ? (
            <p className={styles.empty}>Cargando mensajes...</p>
          ) : messages.length === 0 ? (
            <p className={styles.empty}>Todavía no hay mensajes.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Servicio</th>
                    <th>Mensaje</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message.id}>
                      <td>{formatDate(message.created_at)}</td>
                      <td>
                        <strong>{message.nombre}</strong>
                        <a href={whatsappHref(message.telefono)} target="_blank" rel="noreferrer">
                          {message.telefono}
                        </a>
                      </td>
                      <td>
                        <span>{message.servicio}</span>
                        {message.fecha && <small>Fecha: {message.fecha}</small>}
                      </td>
                      <td>{message.mensaje || 'Sin detalles adicionales.'}</td>
                      <td>
                        <select
                          className={styles.select}
                          value={message.status}
                          onChange={(e) => updateMessageStatus(message.id, e.target.value)}
                          disabled={savingMessage === String(message.id)}
                        >
                          {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Usuarios</h2>
              <p>Administra quién puede entrar al panel.</p>
            </div>
          </div>

          {loading ? (
            <p className={styles.empty}>Cargando usuarios...</p>
          ) : profiles.length === 0 ? (
            <p className={styles.empty}>No hay usuarios registrados.</p>
          ) : (
            <div className={styles.userList}>
              {profiles.map((profile) => (
                <div className={styles.userRow} key={profile.id}>
                  <div>
                    <strong>{profile.full_name || profile.email}</strong>
                    <span>{profile.email}</span>
                    {profile.phone && <small>{profile.phone}</small>}
                  </div>
                  <select
                    className={styles.select}
                    value={profile.role || 'user'}
                    onChange={(e) => updateRole(profile, e.target.value)}
                    disabled={savingRole === profile.id}
                  >
                    <option value="user" disabled={profile.id === user?.id}>
                      Usuario
                    </option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.card}>
          <h2>Registro</h2>
          <p className={styles.empty}>
            Para crear otra cuenta, usa el formulario de registro. Luego vuelve aquí para promoverla
            a admin si corresponde.
          </p>
          <Link className={styles.primaryLink} to="/registro">
            Registrar usuario
          </Link>
        </section>

        <section className={styles.card}>
          <h2>Datos del sitio</h2>
          <p className={styles.empty}>
            Slides, packs, contacto y mosaico se siguen editando directamente en Supabase.
          </p>
        </section>
      </main>
    </div>
  )
}
