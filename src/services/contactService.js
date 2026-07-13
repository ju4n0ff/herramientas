import emailjs from '@emailjs/browser'
import { supabase } from './supabaseClient'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const emailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY)

export const guardarMensaje = async (formData) => {
  if (!supabase) {
    throw new Error('Supabase no está configurado.')
  }

  const { error } = await supabase
    .from('messages')
    .insert({
      nombre: formData.nombre.trim(),
      telefono: formData.telefono.trim(),
      servicio: formData.servicio,
      fecha: formData.fecha || null,
      mensaje: formData.mensaje.trim() || null,
    })

  if (error) throw error
  return true
}

export const enviarMensaje = async (formData) => {
  const saved = await guardarMensaje(formData)

  if (!emailConfigured) {
    return { saved, email: null }
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        nombre:    formData.nombre,
        telefono:  formData.telefono,
        servicio:  formData.servicio,
        fecha:     formData.fecha || 'No especificada',
        mensaje:   formData.mensaje || '—',
      },
      PUBLIC_KEY,
    )

    if (response.status !== 200) throw new Error('Error al enviar')
    return { saved, email: response }
  } catch (error) {
    console.warn('[contactService] Mensaje guardado, pero EmailJS falló:', error)
    return { saved, email: null, emailError: error }
  }
}
