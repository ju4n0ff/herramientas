import { useEffect, useRef } from 'react'

export function useCustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || prefersReduced) return

    const cursor = cursorRef.current
    if (!cursor) return

    const move = (e) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top  = e.clientY + 'px'
    }

    const grow   = () => cursor.classList.add('grow')
    const ungrow = () => cursor.classList.remove('grow')

    const attachToTargets = () => {
      document
        .querySelectorAll('a, button, .pack-card, .carousel-slide')
        .forEach((el) => {
          el.addEventListener('mouseenter', grow)
          el.addEventListener('mouseleave', ungrow)
        })
    }

    document.addEventListener('mousemove', move)
    attachToTargets()

    const mo = new MutationObserver(attachToTargets)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', move)
      mo.disconnect()
    }
  }, [])

  return cursorRef
}
