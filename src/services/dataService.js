import { supabase } from './supabaseClient'

const slidesModules = import.meta.glob(
  '../assets/images/{bautizo,paisajes,pedida-de-mano,urbanos,fotos-dentales,maternales,motos,cumpleaños}/*.avif',
  { eager: true, query: '?url', import: 'default' },
)

const slideUrlByFilename = {}
for (const [filePath, url] of Object.entries(slidesModules)) {
  const filename = filePath.replace(/\\/g, '/').split('/').pop()
  if (filename) slideUrlByFilename[filename] = url
}

const photoWallModules = import.meta.glob(
  '../../src/assets/images/mosaico/*.{avif,webp,jpg,jpeg,png}',
  { eager: true, query: '?url', import: 'default' },
)

const wallPhotosMap = {}
for (const [filePath, url] of Object.entries(photoWallModules)) {
  const filename = filePath.replace(/\\/g, '/').split('/').pop()
  if (filename) wallPhotosMap[filename] = url
}

const WALL_TILTS = [-1.8, 1.6, -0.9, 1.1, -1.4, 1.7, -1.1, 1.3]
const WALL_PATTERNS = [
  ['portrait', 'landscape', 'portrait', 'landscape'],
  ['landscape', 'landscape', 'portrait', 'landscape'],
  ['portrait', 'portrait', 'landscape', 'portrait'],
  ['landscape', 'portrait', 'landscape', 'portrait'],
]

const distributeWallPhotos = (photos) => {
  const buckets = {
    portrait: photos.filter((p) => p.orientation === 'portrait'),
    landscape: photos.filter((p) => p.orientation === 'landscape'),
    square: photos.filter((p) => p.orientation === 'square'),
  }

  const ordered = []
  let patternIndex = 0

  const takeNext = (bucket) => bucket.shift() ?? null

  const repeatsTooMuch = (ordered, candidateOrientation) => {
    if (ordered.length < 2) return false
    const last = ordered[ordered.length - 1]?.orientation
    const prev = ordered[ordered.length - 2]?.orientation
    return last === candidateOrientation && prev === candidateOrientation
  }

  const pickByPreference = (buckets, preferred, ordered) => {
    const fallbackOrder =
      preferred === 'landscape'
        ? ['landscape', 'portrait', 'square']
        : ['portrait', 'square', 'landscape']

    let delayedCandidate = null

    for (const key of fallbackOrder) {
      const photo = buckets[key][0] ?? null
      if (!photo) continue
      if (repeatsTooMuch(ordered, photo.orientation)) {
        if (!delayedCandidate) delayedCandidate = { key, photo }
        continue
      }
      takeNext(buckets[key])
      return photo
    }

    if (delayedCandidate) {
      takeNext(buckets[delayedCandidate.key])
      return delayedCandidate.photo
    }

    for (const key of ['portrait', 'landscape', 'square']) {
      const photo = takeNext(buckets[key])
      if (photo) return photo
    }

    return null
  }

  while (
    buckets.portrait.length ||
    buckets.landscape.length ||
    buckets.square.length
  ) {
    const pattern = WALL_PATTERNS[patternIndex % WALL_PATTERNS.length]
    for (const orientation of pattern) {
      const nextPhoto = pickByPreference(buckets, orientation, ordered)
      if (nextPhoto) ordered.push(nextPhoto)
    }
    patternIndex += 1
  }

  return ordered
}

/* ── Static fallbacks ── */

async function loadStaticFallback() {
  const data = await import('../data/index.js')
  return data
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

  return data.map((row) => {
    const filename = `${row.cat}/${row.id}.avif`
    const src = slideUrlByFilename[`${row.id}.avif`] || `src/assets/images/${filename}`
    return { id: row.id, cat: row.cat, src, label: row.label, caption: row.caption }
  })
}

async function fetchPacks() {
  if (!supabase) return null

  const { data: packs, error: packsError } = await supabase
    .from('packs')
    .select('id, badge, name, price, featured, desc')
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
    desc: row.desc,
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

  const sorted = data
    .map((row) => ({
      ...row,
      src: wallPhotosMap[row.filename] || `src/assets/images/mosaico/${row.filename}`,
    }))
    .sort((a, b) => {
      const orientationOrder = { v: 0, h: 1, s: 2 }
      const aPrefix = a.filename.charAt(0).toLowerCase()
      const bPrefix = b.filename.charAt(0).toLowerCase()
      const aRank = orientationOrder[aPrefix] ?? 3
      const bRank = orientationOrder[bPrefix] ?? 3
      if (aRank !== bRank) return aRank - bRank
      const aIdx = Number.parseInt(a.filename.match(/(\d+)/)?.[1], 10) || 0
      const bIdx = Number.parseInt(b.filename.match(/(\d+)/)?.[1], 10) || 0
      return aIdx - bIdx
    })

  const withTilt = sorted.map((photo, index) => ({
    ...photo,
    tilt: WALL_TILTS[index % WALL_TILTS.length],
  }))

  return distributeWallPhotos(withTilt).map((photo, index) => ({
    ...photo,
    tilt: WALL_TILTS[index % WALL_TILTS.length],
  }))
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

  if (categories && slides && packs && contactInfo && photoWall) {
    return { categories, slides, packs, contactInfo, photoWall, source: 'supabase' }
  }

  const fallback = await loadStaticFallback()
  console.warn('[dataService Usando datos estáticos como fallback.')
  return {
    categories: fallback.CATS,
    slides: fallback.SLIDES,
    packs: fallback.PACKS,
    contactInfo: fallback.CONTACT_INFO,
    photoWall: fallback.PHOTO_WALL,
    source: 'fallback',
  }
}