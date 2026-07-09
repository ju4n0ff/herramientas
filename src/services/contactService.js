import emailjs from '@emailjs/browser'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export const enviarMensaje = async (formData) => {
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
  return response
}
