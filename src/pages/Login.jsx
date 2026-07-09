import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import styles from '../styles/Login.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [recoverySent, setRecoverySent] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!supabase) {
      setError('Supabase no está configurado.')
      return
    }

    setLoading(true)

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle()

    if (profile?.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

  const handleRecovery = async () => {
    if (!email.trim()) {
      setError('Ingresa tu email primero.')
      return
    }

    setError('')
    setLoading(true)

    const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${window.location.origin}/dashboard` },
    )

    setLoading(false)

    if (recoveryError) {
      setError(recoveryError.message)
      return
    }

    setRecoverySent(true)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Iniciar sesión</h1>
        <p className={styles.subtitle}>
          Accede a tu panel de usuario o administración
        </p>

        {recoverySent ? (
          <div className={styles.recoverySent}>
            <p>Revisa tu correo. Te enviamos un enlace para restablecer la contraseña.</p>
            <button
              className={styles.btn}
              onClick={() => setRecoverySent(false)}
              style={{ marginTop: 16 }}
            >
              Volver
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="button"
              className={styles.recoveryBtn}
              onClick={handleRecovery}
              disabled={loading}
            >
              ¿Olvidaste tu contraseña?
            </button>

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        )}

        <p className={styles.links}>
          ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>
      </div>
    </div>
  )
}