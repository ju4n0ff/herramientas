import { useEffect } from 'react'
import heroSrc from '../assets/images/hero.avif'
import styles from '../styles/Hero.module.css'

function useParallax() {
  useEffect(() => {
    const img = document.querySelector(`.${styles.right} img`)
    const handler = () => {
      if (img && window.scrollY < window.innerHeight) {
        img.style.transform = `translateY(${window.scrollY * 0.12}px)`
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}

export default function Hero({ onGallery, onPacks }) {
  useParallax()

  return (
    <section className={styles.hero} id="hero">
      
       <div className={styles.left}>
        <p className={styles.tag}>Fotografía profesional · Lima, Perú</p>

        <h1 className={styles.title}>
          Cada momento<br />
          <em>merece ser</em><br />
          eterno
        </h1>

        <p className={styles.desc}>
          Retratos, bodas, bautizos y más. Capturo la esencia de tus
          momentos más valiosos con luz natural y una mirada auténtica.
        </p>

        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={onGallery}>
            Ver galería
          </button>
          <button className={styles.btnGhost} onClick={onPacks}>
            Ver packs <span className={styles.arr}>→</span>
          </button>
        </div>

        <div className={styles.tagline}>
          Disponible para toda Lima y alrededores
        </div>
      </div>

       <div className={styles.right}>
 
        <img
          src={heroSrc}
          alt="Fotografía de retrato"
        />
      </div>

       <div className={styles.scrollInd}>
        <div className={styles.scrollLine} />
        <span>Scroll</span>
      </div>
    </section>
  )
}
