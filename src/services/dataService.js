import { supabase, STORAGE_URL } from './supabaseClient'
import { CATS, CONTACT_INFO, PACKS, PHOTO_WALL, SLIDES } from '../data/index.js'

const normalizeFile = (name) => name.replace(/ñ/g, 'n').replace(/Ñ/g, 'N')

const storagePath = (path) => (STORAGE_URL ? `${STORAGE_URL}/${path}` : '')

/* ── Static fallback ── */

export function getStaticData() {
  return {
    categories: CATS,
    slides: SLIDES.map((slide) => ({
      ...slide,
      src: storagePath(`slides/${normalizeFile(slide.id)}.avif`),
    })),
    packs: PACKS,
    contactInfo: CONTACT_INFO,
    photoWall: PHOTO_WALL.map((photo) => ({
      ...photo,
      src: storagePath(`mosaico/${photo.id}.avif`),
    })),
  }
}

/* ── Fetch functions ── */

async function fetchCategories() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('categories')
    .select('key, label')
    .order('sort_order')

  if (error) {
    console.warn('[dataService] Error fetching categories:', error.message)
    return null
  }

  return [{ key: 'all', label: 'Todos' }, ...data]
}

async function fetchSlides() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('slides')
    .select('id, cat, label, caption')
    .order('sort_order')

  if (error) {
    console.warn('[dataService] Error fetching slides:', error.message)
    return null
  }

  return data.map((row) => ({
    id: row.id,
    cat: row.cat,
    src: storagePath(`slides/${normalizeFile(row.id)}.avif`),
    label: row.label,
    caption: row.caption,
  }))
}

async function fetchPacks() {
  if (!supabase) return null

  const { data: packs, error: packsError } = await supabase
    .from('packs')
    .select('id, badge, name, price, featured, description')
    .order('sort_order')

  if (packsError) {
    console.warn('[dataService] Error fetching packs:', packsError.message)
    return null
  }

  const packIds = packs.map((p) => p.id)

  const { data: items, error: itemsError } = await supabase
    .from('pack_items')
    .select('pack_id, item_text')
    .in('pack_id', packIds)
    .order('sort_order')

  if (itemsError) {
    console.warn('[dataService] Error fetching pack items:', itemsError.message)
    return null
  }

  const itemsByPack = {}
  for (const item of items) {
    if (!itemsByPack[item.pack_id]) itemsByPack[item.pack_id] = []
    itemsByPack[item.pack_id].push(item.item_text)
  }

  return packs.map((row) => ({
    badge: row.badge,
    name: row.name,
    price: row.price,
    featured: row.featured,
    desc: row.description,
    items: itemsByPack[row.id] || [],
  }))
}

async function fetchContactInfo() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('contact_info')
    .select('icon, label, value')
    .order('sort_order')

  if (error) {
    console.warn('[dataService] Error fetching contact_info:', error.message)
    return null
  }

  return data
}

async function fetchPhotoWall() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('photo_wall')
    .select('id, filename, alt, orientation')
    .order('sort_order')

  if (error) {
    console.warn('[dataService] Error fetching photo_wall:', error.message)
    return null
  }

  const withSrc = data.map((row) => ({
    id: row.id,
    src: storagePath(`mosaico/${row.filename}`),
    alt: row.alt,
    orientation: row.orientation,
  }))

  const WALL_TILTS = [-1.8, 1.6, -0.9, 1.1, -1.4, 1.7, -1.1, 1.3]
  const WALL_PATTERNS = [
    ['portrait', 'landscape', 'portrait', 'landscape'],
    ['landscape', 'landscape', 'portrait', 'landscape'],
    ['portrait', 'portrait', 'landscape', 'portrait'],
    ['landscape', 'portrait', 'landscape', 'portrait'],
  ]

  const distribute = (photos) => {
    const buckets = {
      portrait: photos.filter((p) => p.orientation === 'portrait'),
      landscape: photos.filter((p) => p.orientation === 'landscape'),
      square: photos.filter((p) => p.orientation === 'square'),
    }

    const takeNext = (bucket) => bucket.shift() ?? null

    const repeatsTooMuch = (ordered, orientation) => {
      if (ordered.length < 2) return false
      return ordered.at(-1)?.orientation === orientation &&
             ordered.at(-2)?.orientation === orientation
    }

    const pick = (buckets, preferred, ordered) => {
      const order = preferred === 'landscape'
        ? ['landscape', 'portrait', 'square']
        : ['portrait', 'square', 'landscape']
      let delayed = null
      for (const key of order) {
        const photo = buckets[key][0] ?? null
        if (!photo) continue
        if (repeatsTooMuch(ordered, photo.orientation)) {
          if (!delayed) delayed = { key, photo }
          continue
        }
        takeNext(buckets[key])
        return photo
      }
      if (delayed) { takeNext(buckets[delayed.key]); return delayed.photo }
      for (const key of ['portrait', 'landscape', 'square']) {
        const photo = takeNext(buckets[key])
        if (photo) return photo
      }
      return null
    }

    const result = []
    let idx = 0
    while (buckets.portrait.length || buckets.landscape.length || buckets.square.length) {
      for (const orientation of WALL_PATTERNS[idx % WALL_PATTERNS.length]) {
        const next = pick(buckets, orientation, result)
        if (next) result.push(next)
      }
      idx++
    }
    return result
  }

  const withTilt = withSrc.map((p, i) => ({ ...p, tilt: WALL_TILTS[i % WALL_TILTS.length] }))
  const distributed = distribute(withTilt)

  return distributed.map((p, i) => ({ ...p, tilt: WALL_TILTS[i % WALL_TILTS.length] }))
}

/* ── Public API ── */

export async function fetchAllData() {
  const [categories, slides, packs, contactInfo, photoWall] = await Promise.all([
    fetchCategories(),
    fetchSlides(),
    fetchPacks(),
    fetchContactInfo(),
    fetchPhotoWall(),
  ])

  if (categories && slides && packs && contactInfo && photoWall && STORAGE_URL) {
    return { categories, slides, packs, contactInfo, photoWall, source: 'supabase' }
  }

  const fallback = getStaticData()

  if (!STORAGE_URL) {
    console.warn('[dataService] Sin conexión a Supabase Storage. Las imágenes no cargarán.')
  } else {
    console.warn('[dataService] Usando datos estáticos como fallback.')
  }

  return {
    ...fallback,
    source: 'fallback',
  }
}
