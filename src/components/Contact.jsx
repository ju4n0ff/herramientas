import styles from '../styles/Contact.module.css'

export default function Contact({ onOpen }) {
  return (
    <section className={styles.contact} id="contacto">
      <div className={`${styles.wrap} reveal`}>
        <span className="section-tag">Contacto</span>
        <h2 className="section-title">
          ¿Listo para<br /><em>crear algo juntos?</em>
        </h2>
        <p className="section-desc">
          Cuéntame tu idea, tu fecha, tu historia. Respondo en menos de 24 horas.
        </p>
        <button className={styles.btn} onClick={onOpen}>
          Escribirme ahora <span className={styles.arrow}>→</span>
        </button>
      </div>
    </section>
  )
}
