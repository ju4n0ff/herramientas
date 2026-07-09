import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavScroll } from '../hooks/useNavScroll'
import { STORAGE_URL } from '../services/supabaseClient'
import styles from '../styles/Navbar.module.css'

const NAV_LINKS = [
  { href: '#galeria',  label: 'Galería' },
  { href: '#about',    label: 'Sobre mí' },
  { href: '#packs',    label: 'Packs' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Navbar({ onContact }) {
  const scrolled = useNavScroll()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const handleNav = (href) => (e) => {
    e.preventDefault()
    closeMenu()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen, closeMenu])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <nav
      className={`${styles.nav}${scrolled ? ` ${styles.scrolled}` : ''}${menuOpen ? ` ${styles.menuOpen}` : ''}`}
      ref={menuRef}
    >
      <a href="#" className={styles.logo}>
        <img src={`${STORAGE_URL}/logo.avif`} alt="Raymi Fotografía" className={styles.logoMark} />
      </a>

      <button
        className={`${styles.hamburger}${menuOpen ? ` ${styles.hamburgerOpen}` : ''}`}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={styles.links}>
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <a href={href} onClick={handleNav(href)}>{label}</a>
          </li>
        ))}
        <li className={styles.mobileCtaItem}>
          <button className={styles.cta} onClick={() => { closeMenu(); onContact() }}>
            Reservar sesión
          </button>
        </li>
      </ul>

      <button className={styles.desktopCta} onClick={onContact}>
        Reservar sesión
      </button>
    </nav>
  )
}
