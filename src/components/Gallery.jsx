import { useState, useRef, useCallback, useEffect } from 'react'
import styles from '../styles/Gallery.module.css'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Gallery({ slides, categories }) {
  const [activeCat, setActiveCat] = useState('all')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [lightboxIdx, setLightboxIdx] = useState(null)
  const trackRef    = useRef(null)
  const isDragging  = useRef(false)
  const startX      = useRef(0)
  const scrollLeft  = useRef(0)
  const touchStart  = useRef(0)
  const lightboxRef = useRef(null)
  const previousFocusRef = useRef(null)

  const visible = slides.filter(
    (s) => activeCat === 'all' || s.cat === activeCat
  )

  const scrollToIdx = useCallback(
    (idx) => {
      if (!trackRef.current) return
      const items = trackRef.current.querySelectorAll(`.${styles.slide}`)
      items[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
      setCurrentIdx(idx)
    },
    []
  )

  const slideBy = (dir) => {
    const next = Math.max(0, Math.min(visible.length - 1, currentIdx + dir))
    scrollToIdx(next)
  }

  const lbSlideBy = useCallback((dir) => {
    setLightboxIdx((prev) => {
      const next = prev + dir
      if (next < 0) return visible.length - 1
      if (next >= visible.length) return 0
      return next
    })
  }, [visible.length])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIdx(0)
    trackRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
  }, [activeCat])

  useEffect(() => {
    if (lightboxIdx === null) return
    previousFocusRef.current = document.activeElement
    const timer = setTimeout(() => {
      const focusable = lightboxRef.current?.querySelectorAll(FOCUSABLE)
      if (focusable?.length > 0) focusable[0].focus()
    }, 100)
    document.body.style.overflow = 'hidden'
    const handler = (e) => {
      if (e.key === 'Escape') setLightboxIdx(null)
      if (e.key === 'ArrowLeft') lbSlideBy(-1)
      if (e.key === 'ArrowRight') lbSlideBy(1)
      if (e.key === 'Tab') {
        const focusable = lightboxRef.current?.querySelectorAll(FOCUSABLE)
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
    }
  }, [lightboxIdx, lbSlideBy])

  const onMouseDown = (e) => {
    isDragging.current  = true
    startX.current      = e.pageX - trackRef.current.offsetLeft
    scrollLeft.current  = trackRef.current.scrollLeft
    trackRef.current.classList.add(styles.grabbing)
  }
  const onMouseLeave = () => {
    isDragging.current = false
    trackRef.current?.classList.remove(styles.grabbing)
  }
  const onMouseUp = () => {
    isDragging.current = false
    trackRef.current?.classList.remove(styles.grabbing)
  }
  const onMouseMove = (e) => {
    if (!isDragging.current) return
    e.preventDefault()
    const x = e.pageX - trackRef.current.offsetLeft
    trackRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.2
  }

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) slideBy(diff > 0 ? 1 : -1)
  }

  const onScroll = () => {
    if (!trackRef.current) return
    const items = [...trackRef.current.querySelectorAll(`.${styles.slide}`)]
    let minDist = Infinity
    let idx = 0
    items.forEach((s, i) => {
      const dist = Math.abs(
        s.getBoundingClientRect().left - trackRef.current.getBoundingClientRect().left
      )
      if (dist < minDist) { minDist = dist; idx = i }
    })
    setCurrentIdx(idx)
  }

  return (
    <section className={styles.gallery} id="galeria">
      <div className={`${styles.header} reveal`}>
        <span className="section-tag">Portafolio</span>
        <h2 className="section-title">
          Historias que <em>cuento</em> con luz
        </h2>
        <p className="section-desc">
          Cada sesión es única. Aquí encontrarás una muestra de mi trabajo
          en diferentes estilos y contextos.
        </p>
      </div>

      <div className={`${styles.catTabs} reveal`}>
        {categories.map((c) => (
          <button
            key={c.key}
            className={`${styles.tab}${activeCat === c.key ? ` ${styles.active}` : ''}`}
            onClick={() => setActiveCat(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className={styles.carouselWrap}>
        <button className={`${styles.btn} ${styles.prev}`} onClick={() => slideBy(-1)} aria-label="Anterior">
            ←
          </button>

        <div
          className={styles.track}
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onScroll={onScroll}
        >
          {visible.map((s, i) => (
            <div
              className={styles.slide}
              key={s.id}
              data-cat={s.cat}
              onClick={() => setLightboxIdx(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setLightboxIdx(i) }}
            >
              <div className={styles.slideImg}>
                <img src={s.src} alt={s.caption || s.label} draggable={false} />
                <div className={styles.overlay}>
                  <span className={styles.slideLabel}>{s.label}</span>
                </div>
              </div>
              <p className={styles.caption}>{s.caption}</p>
            </div>
          ))}
        </div>

        <button className={`${styles.btn} ${styles.next}`} onClick={() => slideBy(1)} aria-label="Siguiente">
            →
          </button>
      </div>

      <div className={styles.dots}>
        {visible.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot}${i === currentIdx ? ` ${styles.active}` : ''}`}
            onClick={() => scrollToIdx(i)}
            aria-label={`Ir a imagen ${i + 1}`}
          />
        ))}
      </div>

      {lightboxIdx !== null && (
        <div
          className={styles.lightbox}
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxIdx(null) }}
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label="Vista previa de imagen"
        >
          <button
            className={styles.lbClose}
            onClick={() => setLightboxIdx(null)}
            aria-label="Cerrar"
          >
            ✕
          </button>

          <button
            className={`${styles.lbArrow} ${styles.lbPrev}`}
            onClick={() => lbSlideBy(-1)}
            aria-label="Anterior"
          >
            ←
          </button>

          <div className={styles.lbImage}>
            <img src={visible[lightboxIdx].src} alt={visible[lightboxIdx].caption || visible[lightboxIdx].label} />
            <div className={styles.lbInfo}>
              <span>{visible[lightboxIdx].label}</span>
              <span>{visible[lightboxIdx].caption}</span>
            </div>
          </div>

          <button
            className={`${styles.lbArrow} ${styles.lbNext}`}
            onClick={() => lbSlideBy(1)}
            aria-label="Siguiente"
          >
            →
          </button>

          <div className={styles.lbCounter}>
            {lightboxIdx + 1} / {visible.length}
          </div>
        </div>
      )}
    </section>
  )
}