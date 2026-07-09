import { SERVICES } from '../data'
import styles from '../styles/Services.module.css'

export default function Services() {
  return (
    <div className={styles.strip}>
      {SERVICES.map((s, i) => (
        <div
          key={s.name}
          className={`${styles.item} reveal`}
          style={{ transitionDelay: `${i * 0.1}s` }}
        >
          <div className={styles.icon}>{s.icon}</div>
          <div className={styles.name}>{s.name}</div>
          <p className={styles.desc}>{s.desc}</p>
        </div>
      ))}
    </div>
  )
}
