import { useEffect, useMemo, useState } from 'react'
import styles from '../styles/PhotoWall.module.css'

const ORIENTATION_WEIGHT = {
  portrait: 3,
  landscape: 1,
  square: 2,
}

const distributeColumns = (photos, columnCount) => {
  const columns = Array.from({ length: columnCount }, () => [])
  const heights = new Array(columnCount).fill(0)

  for (const photo of photos) {
    const weight = ORIENTATION_WEIGHT[photo.orientation] ?? 2
    const shortest = heights.indexOf(Math.min(...heights))
    columns[shortest].push(photo)
    heights[shortest] += weight
  }

  return columns
}

export default function PhotoWall({ photos }) {
  const [columnCount, setColumnCount] = useState(4)

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 640px)')
    const mqTablet = window.matchMedia('(max-width: 1024px)')

    const update = () => {
      if (mqMobile.matches) setColumnCount(2)
      else if (mqTablet.matches) setColumnCount(3)
      else setColumnCount(4)
    }

    update()
    mqMobile.addEventListener('change', update)
    mqTablet.addEventListener('change', update)
    return () => {
      mqMobile.removeEventListener('change', update)
      mqTablet.removeEventListener('change', update)
    }
  }, [])

  const columns = useMemo(() => distributeColumns(photos, columnCount), [photos, columnCount])

  if (!photos.length) {
    return null
  }

  return (
    <section className={styles.section} id="mosaico" aria-label="Mosaico fotográfico">
      <div className={`${styles.header} reveal`}>
        <h2 className="section-title">Muro de momentos</h2>
      </div>

      <div className={styles.wall} style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
        {columns.map((column, columnIndex) => (
          <div key={`column-${columnIndex}`} className={styles.column}>
            {column.map((photo, index) => (
              <figure
                key={photo.id}
                className={`${styles.tile} reveal`}
                style={{
                  '--tilt': `${photo.tilt}deg`,
                  transitionDelay: `${(columnIndex + index) * 0.06}s`,
                }}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}