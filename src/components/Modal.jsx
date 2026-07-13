import { useState, useEffect, useRef, useCallback } from 'react'
import styles from '../styles/Modal.module.css'
import { supabase } from '../services/supabaseClient'
import { enviarMensaje } from '../services/contactService'

const INITIAL_FORM = {
  nombre:   '',
  telefono: '',
  servicio: '',
  fecha:    '',
  mensaje:  '',
}

const PHONE_RE = /^[\d\s\-()]{7,}$/

function validate(form) {
  const errors = {}
  if (!form.nombre.trim()) errors.nombre = 'Nombre es requerido'
  if (!form.telefono.trim()) errors.telefono = 'WhatsApp es requerido'
  else if (!PHONE_RE.test(form.telefono)) errors.telefono = 'Número inválido'
  if (!form.servicio) errors.servicio = 'Selecciona un servicio'
  return errors
}

export default function Modal({ isOpen, onClose, preselect, categories, contactInfo }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)
  const prefillDone = useRef(false)

  useEffect(() => {
    if (!isOpen) {
      prefillDone.current = false
      return
    }
    if (prefillDone.current) return
    prefillDone.current = true

    async function prefill() {
      if (!supabase) return
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!profile) return
      setForm((prev) => ({
        ...prev,
        nombre: profile.full_name || prev.nombre,
        telefono: profile.phone || prev.telefono,
      }))
    }

    prefill()
  }, [isOpen])

  const serviceTypes = categories ? categories.filter(c => c.key !== 'all') : []
  const whatsappNumber = contactInfo?.find(c => c.label === 'WhatsApp')?.value?.replace(/\s+/g, '') || '51952365703'

  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return []
    const selectors = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    return Array.from(modalRef.current.querySelectorAll(selectors))
  }, [])

  const trapFocus = useCallback((e) => {
    if (e.key === 'Escape' && !submitting) {
      onClose()
      return
    }
    const focusable = getFocusableElements()
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [getFocusableElements, onClose, submitting])

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      const timer = setTimeout(() => {
        const focusable = getFocusableElements()
        if (focusable.length > 0) focusable[0].focus()
      }, 100)
      document.addEventListener('keydown', trapFocus)
      return () => {
        clearTimeout(timer)
        document.removeEventListener('keydown', trapFocus)
        previousFocusRef.current?.focus()
      }
    }
  }, [isOpen, getFocusableElements, trapFocus])

  useEffect(() => {
    if (preselect) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((prev) => ({ ...prev, servicio: preselect }))
    }
  }, [preselect])

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrors({})
      setSubmitting(false)
      setSent(false)
      setSubmitError('')
      setForm(INITIAL_FORM)
    }
  }, [isOpen])

  const set = (key) => (e) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)

    try {
      await enviarMensaje(form)
      setSent(true)
      setTimeout(() => {
        setSent(false)
        onClose()
      }, 2800)
    } catch (err) {
      console.error('[Modal] Error al enviar mensaje:', err)
      setSubmitError('No se pudo enviar el mensaje. Inténtalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !submitting) onClose()
  }

  const fieldClass = (name) =>
    `${styles.formGroup}${errors[name] ? ` ${styles.fieldError}` : ''}`

  const renderError = (name) =>
    errors[name] ? <span className={styles.errorText}>{errors[name]}</span> : null

  return (
    <div
      className={`${styles.overlay}${isOpen ? ` ${styles.open}` : ''}`}
      onClick={handleOverlayClick}
      aria-hidden={!isOpen}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
      >
        <div className={styles.header}>
          <h2 className={styles.title} id="modal-title">
            Hablemos de<br /><em>tu historia</em>
          </h2>
          <button
            className={styles.close}
            onClick={onClose}
            disabled={submitting}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {sent ? (
            <div className={styles.successMessage}>
              <span className={styles.successIcon}>✓</span>
              <h3>¡Mensaje enviado!</h3>
              <p>Te responderé al WhatsApp lo antes posible.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.formRow}>
                <div className={fieldClass('nombre')}>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    id="nombre"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={form.nombre}
                    onChange={set('nombre')}
                    disabled={submitting}
                    aria-invalid={!!errors.nombre}
                  />
                  {renderError('nombre')}
                </div>

                <div className={fieldClass('telefono')}>
                  <label htmlFor="telefono">WhatsApp</label>
                  <input
                    id="telefono"
                    type="tel"
                    placeholder="+51 9XX XXX XXX"
                    value={form.telefono}
                    onChange={set('telefono')}
                    disabled={submitting}
                    aria-invalid={!!errors.telefono}
                  />
                  {renderError('telefono')}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={fieldClass('servicio')}>
                  <label htmlFor="servicio">Tipo de sesión</label>
                  <select
                    id="servicio"
                    value={form.servicio}
                    onChange={set('servicio')}
                    disabled={submitting}
                  >
                    <option value="">Selecciona un servicio</option>
                    {serviceTypes.map((s) => (
                      <option key={s.key} value={s.label}>
                        {s.label}
                      </option>
                    ))}
                    <option value="Otro">Otro</option>
                  </select>
                  {renderError('servicio')}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="fecha">Fecha estimada</label>
                  <input
                    id="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={set('fecha')}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mensaje">Detalles (opcional)</label>
                <textarea
                  id="mensaje"
                  placeholder="Cuéntame más sobre lo que necesitas..."
                  value={form.mensaje}
                  onChange={set('mensaje')}
                  disabled={submitting}
                  rows={3}
                />
              </div>

              {submitError && (
                <div className={styles.submitError}>{submitError}</div>
              )}

              <button
                type="submit"
                className={`${styles.submit}${submitting ? ` ${styles.submitting}` : ''}`}
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Enviar mensaje →'}
              </button>

              <p className={styles.whatsappHint}>
                ¿Prefieres escribir directo?{' '}
                <a
                  href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=Hola%2C+te+escribo+por...`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Escríbeme por WhatsApp →
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}