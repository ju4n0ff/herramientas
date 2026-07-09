import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import styles from '../styles/Login.module.css'

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default function Register() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!supabase) {
      setError('Supabase no está configurado. Revisa las variables de entorno.')
      return
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          full_name: form.fullName.trim(),
          phone: form.phone.trim(),
        },
      },
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    setForm(INITIAL_FORM)
    setSuccess(
      'Cuenta creada. Si es el primer usuario del sistema, será admin automáticamente.',
    )

    if (data.session && data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle()

      if (profile?.role === 'admin') {
        setSuccess('Cuenta admin creada. Entrando al panel...')
        setTimeout(() => navigate('/admin'), 900)
      }
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.subtitle}>
          El primer usuario registrado será admin. Los demás podrán ser promovidos desde el panel.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="fullName">Nombre</label>
            <input
              id="fullName"
              type="text"
              value={form.fullName}
              onChange={set('fullName')}
              required
              autoComplete="name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="phone">WhatsApp</label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              autoComplete="tel"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={set('email')}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={set('password')}
              required
              autoComplete="new-password"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              required
              autoComplete="new-password"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className={styles.links}>
          ¿Ya tienes cuenta? <Link to="/admin/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
