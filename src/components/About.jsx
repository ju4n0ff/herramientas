import styles from '../styles/About.module.css'

const STATS = [
  { num: '2',   label: 'Años en proyectos fotográficos' },
  { num: '70+', label: 'Coberturas y sesiones entregadas' },
  { num: '15+', label: 'Marcas y emprendimientos atendidos' },
]

export default function About() {
  return (
    <section className={styles.about} id="about">
      {/* Image */}
      <div className={`${styles.imgWrap} reveal from-left`}>
        <img
          src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=700&q=80"
          alt="El fotógrafo"
        />
      </div>

      {/* Content */}
      <div className={`${styles.content} reveal from-right`}>
        <span className="section-tag">Sobre mí</span>
        <h2 className="section-title">
          Una mirada<br /><em>que escucha</em>
        </h2>

        <p className={styles.bio}>
          Soy fotógrafo con base en Lima y aproximadamente dos años de
          experiencia en producción visual para retratos, eventos y contenido
          de marca. Mi enfoque combina dirección de imagen, manejo de luz y
          narrativa para crear fotografías limpias, coherentes y con intención.
        </p>
        <p className={styles.bio}>
          En cada proyecto trabajo desde la preproducción hasta la entrega:
          definimos objetivo, estilo visual y tiempos claros para que el
          resultado funcione tanto a nivel emocional como comercial. La
          prioridad es que cada imagen comunique y represente bien a la persona
          o negocio detrás de la sesión.
        </p>

        <div className={styles.stats}>
          {STATS.map(({ num, label }) => (
            <div key={label}>
              <div className={styles.statNum}>{num}</div>
              <div className={styles.statLabel}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
