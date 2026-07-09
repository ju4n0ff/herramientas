import { useState, useEffect, useRef } from 'react'
import { fetchAllData } from '../services/dataService'

const CACHE_KEY = 'raymi-data-cache'

export function useData() {
  const [state, setState] = useState(() => {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        return { ...JSON.parse(cached), loading: false }
      } catch {
        /* ignore */
      }
    }
    return { data: null, loading: true, error: null }
  })

  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    let mounted = true

    fetchAllData()
      .then((result) => {
        if (!mounted) return
        const { categories, slides, packs, contactInfo, photoWall, source } = result
        const data = { categories, slides, packs, contactInfo, photoWall }
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(data))
        } catch {
          /* storage full or unavailable */
        }
        if (source === 'fallback') {
          console.info('[useData] Usando datos estáticos (fallback)')
        } else {
          console.info('[useData] Datos cargados desde Supabase')
        }
        setState({ data, loading: false, error: null })
      })
      .catch((err) => {
        if (!mounted) return
        console.error('[useData] Error al cargar datos:', err)
        setState({ data: null, loading: false, error: err })
      })

    return () => {
      mounted = false
    }
  }, [])

  return state
}