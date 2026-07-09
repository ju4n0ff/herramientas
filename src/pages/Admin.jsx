import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import styles from '../styles/Admin.module.css'

export default function Admin() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  const handleLogout = async () => {
    await supabase?.auth.signOut()
    navigate('/admin/login')
  }

  if (loading) return null

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Panel de Administración</h1>
        <div className={styles.userInfo}>
          <span>{user?.email}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.card}>
          <h2>Mensajes</h2>
          <p className={styles.empty}>Próximamente: bandeja de mensajes del formulario de contacto.</p>
        </section>

        <section className={styles.card}>
          <h2>Reservas</h2>
          <p className={styles.empty}>Próximamente: gestión de reservas y paquetes.</p>
        </section>

        <section className={styles.card}>
          <h2>Datos del sitio</h2>
          <p className={styles.empty}>
            Los datos (slides, packs, contacto) se editan directamente en Supabase.
          </p>
        </section>
      </main>
    </div>
  )
}