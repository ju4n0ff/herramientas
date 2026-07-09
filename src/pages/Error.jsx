import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Error.css'

export default function Error() {
  useEffect(() => {
    document.title = 'Página no encontrada - Raymi Fotografía'
  }, [])

  return (
    <div className="error-page">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  )
}
