import { useState, useEffect, useCallback } from 'react'

export function useModal() {
  const [isOpen, setIsOpen]       = useState(false)
  const [preselect, setPreselect] = useState('')

  const open = useCallback((pack = '') => {
    setPreselect(pack)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }, [isOpen])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [close])

  return { isOpen, preselect, open, close }
}
