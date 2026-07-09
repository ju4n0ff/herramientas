import styles from '../styles/Packs.module.css'

export default function Packs({ packs, onReserve }) {
  return (
    <section className={styles.packs} id="packs">
      <div className="section-header reveal" style={{ textAlign: 'center', padding: '0 48px', marginBottom: '64px' }}>
        <span className="section-tag" style={{ color: 'var(--terra-lt)' }}>
          Packs &amp; Precios
        </span>
        <h2 className="section-title" style={{ color: 'var(--cream)' }}>
          Encuentra el pack<br /><em>perfecto para ti</em>
        </h2>
        <p className="section-desc" style={{ color: 'rgba(245,240,232,.75)' }}>
          Todos los packs incluyen edición profesional y entrega en alta
          resolución. Precios en soles peruanos.
        </p>
      </div>

      <div className={styles.grid}>
        {packs.map((pack, i) => (
          <div
            key={pack.name}
            className={`${styles.card}${pack.featured ? ` ${styles.featured}` : ''} reveal`}
            style={{ transitionDelay: `${(i + 1) * 0.1}s` }}
          >
            <span className={styles.badge}>{pack.badge}</span>
            <div className={styles.name}>{pack.name}</div>
            <div className={styles.price}>
              Desde <strong>{pack.price}</strong>
            </div>
            <p className={styles.desc}>{pack.desc}</p>

            <div className={styles.items}>
              {pack.items.map((item) => (
                <div className={styles.item} key={item}>{item}</div>
              ))}
            </div>

            <button
              className={styles.btn}
              onClick={() => onReserve(pack.name)}
            >
              Reservar
            </button>
          </div>
        ))}
      </div>

      <p className={styles.note}>
        ¿Necesitas algo personalizado?{' '}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onReserve('') }}
        >
          Escríbeme →
        </a>
      </p>
    </section>
  )
}