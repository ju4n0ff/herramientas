import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import styles from '../styles/Login.module.css'

export default function EditarPerfil() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true

    async function load() {
      if (!supabase) {
        setError('Supabase no configurado.')
        setLoading(false)
        return
      }

      const { data: authData } = await supabase.auth.getUser()

      if (!authData.user) {
        navigate('/admin/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', authData.user.id)
        .maybeSingle()

      if (!mounted) return

      if (profile) {
        setFullName(profile.full_name || '')
        setPhone(profile.phone || '')
      }

      setLoading(false)
    }

    load()
    return () => {
      mounted = false
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!supabase) return

    setSaving(true)

    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) {
      setError('Sesión expirada.')
      setSaving(false)
      return
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        phone: phone.trim(),
      })
      .eq('id', authData.user.id)

    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setSuccess('Perfil actualizado.')
  }

  if (loading) return null

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Editar perfil</h1>
        <p className={styles.subtitle}>Actualiza tu nombre y WhatsApp</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="fullName">Nombre</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="phone">WhatsApp</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <button className={styles.btn} type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>

        <p className={styles.links}>
          <button
            className={styles.recoveryBtn}
            onClick={() => navigate('/dashboard')}
          >
            Volver al panel
          </button>
        </p>
      </div>
    </div>
  )
}