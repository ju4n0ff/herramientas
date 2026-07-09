const slidesModules = import.meta.glob(
  '../../src/assets/images/{bautizo,paisajes,pedida-de-mano,urbanos,fotos-dentales,maternales,motos,cumpleaños}/*.avif',
  { eager: true, query: '?url', import: 'default' },
)

const slideUrlByFilename = {}
for (const [filePath, url] of Object.entries(slidesModules)) {
  const filename = filePath.replace(/\\/g, '/').split('/').pop()
  if (filename) slideUrlByFilename[filename] = url
}

const RAW_SLIDES = [
  { id: 'bautizo-01', cat: 'bautizo', src: 'src/assets/images/bautizo/bautizo-01.avif', label: '', caption: 'Bautizo · Iglesia' },
  { id: 'bautizo-02', cat: 'bautizo', src: 'src/assets/images/bautizo/bautizo-02.avif', label: '', caption: 'Bautizo · Familia' },
  { id: 'bautizo-03', cat: 'bautizo', src: 'src/assets/images/bautizo/bautizo-03.avif', label: '', caption: 'Bautizo · Hermanos' },
  { id: 'bautizo-04', cat: 'bautizo', src: 'src/assets/images/bautizo/bautizo-04.avif', label: '', caption: 'Bautizo · Amigas' },

  { id: 'paisajes-01', cat: 'paisajes', src: 'src/assets/images/paisajes/paisajes-01.avif', label: '', caption: 'Paisaje · Pareja' },
  { id: 'paisajes-02', cat: 'paisajes', src: 'src/assets/images/paisajes/paisajes-02.avif', label: '', caption: 'Paisaje · Sendero' },
  { id: 'paisajes-03', cat: 'paisajes', src: 'src/assets/images/paisajes/paisajes-03.avif', label: '', caption: 'Paisaje · Euforia' },
  { id: 'paisajes-04', cat: 'paisajes', src: 'src/assets/images/paisajes/paisajes-04.avif', label: '', caption: 'Paisaje · Macchu Picchu' },
  { id: 'paisajes-05', cat: 'paisajes', src: 'src/assets/images/paisajes/paisajes-05.avif', label: '', caption: 'Paisaje · Teatro' },
  { id: 'paisajes-06', cat: 'paisajes', src: 'src/assets/images/paisajes/paisajes-06.avif', label: '', caption: 'Paisaje · Montaña 7 Colores' },
  { id: 'paisajes-07', cat: 'paisajes', src: 'src/assets/images/paisajes/paisajes-07.avif', label: '', caption: 'Paisaje · Caminante' },
  { id: 'paisajes-08', cat: 'paisajes', src: 'src/assets/images/paisajes/paisajes-08.avif', label: '', caption: 'Paisaje · Vista al panorama' },

  { id: 'pedida-de-mano-01', cat: 'pedida-de-mano', src: 'src/assets/images/pedida-de-mano/pedida-de-mano-01.avif', label: '', caption: 'Pedida de mano · Pareja Comprometida' },
  { id: 'pedida-de-mano-02', cat: 'pedida-de-mano', src: 'src/assets/images/pedida-de-mano/pedida-de-mano-02.avif', label: '', caption: 'Pedida de mano · Momento post a la pedida' },
  { id: 'pedida-de-mano-03', cat: 'pedida-de-mano', src: 'src/assets/images/pedida-de-mano/pedida-de-mano-03.avif', label: '', caption: 'Pedida de mano · Lugar de Evento' },
  { id: 'pedida-de-mano-04', cat: 'pedida-de-mano', src: 'src/assets/images/pedida-de-mano/pedida-de-mano-04.avif', label: '', caption: 'Pedida de mano · Romance' },

  { id: 'urbanos-01', cat: 'urbanos', src: 'src/assets/images/urbanos/urbanos-01.avif', label: '', caption: 'Urbano · Retrato Under' },
  { id: 'urbanos-02', cat: 'urbanos', src: 'src/assets/images/urbanos/urbanos-02.avif', label: '', caption: 'Urbano · Sendero' },
  { id: 'urbanos-03', cat: 'urbanos', src: 'src/assets/images/urbanos/urbanos-03.avif', label: '', caption: 'Urbano · Padre Hija' },
  { id: 'urbanos-04', cat: 'urbanos', src: 'src/assets/images/urbanos/urbanos-04.avif', label: '', caption: 'Urbano · Retrato' },
  { id: 'urbanos-05', cat: 'urbanos', src: 'src/assets/images/urbanos/urbanos-05.avif', label: '', caption: 'Urbano · Momento en Río' },
  { id: 'urbanos-06', cat: 'urbanos', src: 'src/assets/images/urbanos/urbanos-06.avif', label: '', caption: 'Urbano · Composición' },
  { id: 'urbanos-07', cat: 'urbanos', src: 'src/assets/images/urbanos/urbanos-07.avif', label: '', caption: 'Urbano · Modelo' },
  { id: 'urbanos-08', cat: 'urbanos', src: 'src/assets/images/urbanos/urbanos-08.avif', label: '', caption: 'Urbano · Vista a Calle' },
  { id: 'urbanos-09', cat: 'urbanos', src: 'src/assets/images/urbanos/urbanos-09.avif', label: '', caption: 'Urbano · Iluminación en Calle' },
  { id: 'urbanos-10', cat: 'urbanos', src: 'src/assets/images/urbanos/urbanos-10.avif', label: '', caption: 'Urbano · Amistad' },
  { id: 'urbanos-11', cat: 'urbanos', src: 'src/assets/images/urbanos/urbanos-11.avif', label: '', caption: 'Urbano · Infante' },
  { id: 'urbanos-12', cat: 'urbanos', src: 'src/assets/images/urbanos/urbanos-12.avif', label: '', caption: 'Urbano · Nostalgia' },

  { id: 'fotos-dentales-01', cat: 'fotos-dentales', src: 'src/assets/images/fotos-dentales/fotos-dentales-01.avif', label: '', caption: 'Dental · Doctora' },
  { id: 'fotos-dentales-02', cat: 'fotos-dentales', src: 'src/assets/images/fotos-dentales/fotos-dentales-02.avif', label: '', caption: 'Dental · Pre-consulta' },
  { id: 'fotos-dentales-03', cat: 'fotos-dentales', src: 'src/assets/images/fotos-dentales/fotos-dentales-03.avif', label: '', caption: 'Dental · Preparación' },
  { id: 'fotos-dentales-04', cat: 'fotos-dentales', src: 'src/assets/images/fotos-dentales/fotos-dentales-04.avif', label: '', caption: 'Dental · Tratamiento' },

  { id: 'maternales-01', cat: 'maternales', src: 'src/assets/images/maternales/maternales-01.avif', label: '', caption: 'Maternal · Iluminación' },
  { id: 'maternales-02', cat: 'maternales', src: 'src/assets/images/maternales/maternales-02.avif', label: '', caption: 'Maternal ' },
  { id: 'maternales-03', cat: 'maternales', src: 'src/assets/images/maternales/maternales-03.avif', label: '', caption: 'Maternal ' },
  { id: 'maternales-04', cat: 'maternales', src: 'src/assets/images/maternales/maternales-04.avif', label: '', caption: 'Maternal ' },
  { id: 'maternales-05', cat: 'maternales', src: 'src/assets/images/maternales/maternales-05.avif', label: '', caption: 'Maternal ' },
  { id: 'maternales-06', cat: 'maternales', src: 'src/assets/images/maternales/maternales-06.avif', label: '', caption: 'Maternal ' },
  { id: 'maternales-07', cat: 'maternales', src: 'src/assets/images/maternales/maternales-07.avif', label: '', caption: 'Maternal ' },
  { id: 'maternales-08', cat: 'maternales', src: 'src/assets/images/maternales/maternales-08.avif', label: '', caption: 'Maternal ' },
  { id: 'maternales-09', cat: 'maternales', src: 'src/assets/images/maternales/maternales-09.avif', label: '', caption: 'Maternal · contraluz' },

  { id: 'motos-01', cat: 'motos', src: 'src/assets/images/motos/motos-01.avif', label: '', caption: 'Motos · Ruta' },
  { id: 'motos-02', cat: 'motos', src: 'src/assets/images/motos/motos-02.avif', label: '', caption: 'Motos · Frente' },
  { id: 'motos-03', cat: 'motos', src: 'src/assets/images/motos/motos-03.avif', label: '', caption: 'Motos · Estacionado' },
  { id: 'motos-04', cat: 'motos', src: 'src/assets/images/motos/motos-04.avif', label: '', caption: 'Motos · Lateral' },
  { id: 'motos-05', cat: 'motos', src: 'src/assets/images/motos/motos-05.avif', label: '', caption: 'Motos · Curva' },
  { id: 'motos-06', cat: 'motos', src: 'src/assets/images/motos/motos-06.avif', label: '', caption: 'Motos · Rodada' },
  { id: 'motos-07', cat: 'motos', src: 'src/assets/images/motos/motos-07.avif', label: '', caption: 'Motos · Wheelie' },
  { id: 'motos-08', cat: 'motos', src: 'src/assets/images/motos/motos-08.avif', label: '', caption: 'Motos · Acción' },
  { id: 'motos-09', cat: 'motos', src: 'src/assets/images/motos/motos-09.avif', label: '', caption: 'Motos · Frontwheel' },
  { id: 'motos-10', cat: 'motos', src: 'src/assets/images/motos/motos-10.avif', label: '', caption: 'Motos · Movimiento' },

  { id: 'cumpleaños-01', cat: 'cumpleaños', src: 'src/assets/images/cumpleaños/cumpleaños-01.avif', label: '', caption: 'Cumpleaños · Sorpresa' },
  { id: 'cumpleaños-02', cat: 'cumpleaños', src: 'src/assets/images/cumpleaños/cumpleaños-02.avif', label: '', caption: 'Cumpleaños · Velas' },
  { id: 'cumpleaños-03', cat: 'cumpleaños', src: 'src/assets/images/cumpleaños/cumpleaños-03.avif', label: '', caption: 'Cumpleaños · Familia' },
]

export const SLIDES = RAW_SLIDES.map((s) => ({
  ...s,
  src: slideUrlByFilename[s.src.split('/').pop()] || s.src,
}))

export const CATS = [
  { key: 'all',            label: 'Todos' },
  { key: 'bautizo',        label: 'Bautizo' },
  { key: 'paisajes',       label: 'Paisajes' },
  { key: 'pedida-de-mano', label: 'Pedida de mano' },
  { key: 'urbanos',        label: 'Urbanos' },
  { key: 'fotos-dentales', label: 'Dentales' },
  { key: 'maternales',     label: 'Maternales' },
  { key: 'motos',          label: 'Motos' },
    { key: 'cumpleaños',     label: 'Cumpleaños' },
]


export const PACKS = [
  {
    badge: '🔥 Mas popular',
    name: 'Pack Urbano Pro',
    price: 'S/ 240',
    featured: true,
    desc: 'Ideal para marca personal, parejas y contenido editorial en exteriores.',
    items: [
      'Sesion de 2 horas en 1 o 2 locaciones urbanas',
      '40 fotografias finales editadas en alta resolucion',
      'Direccion de poses y asesoria de vestuario previa',
      'Entrega en galeria privada online (5 dias habiles)',
      'Opcion de reels behind the scenes (+S/ 80)',
    ],
  },
  {
    badge: '🎉 Cobertura social',
    name: 'Eventos y Celebraciones',
    price: 'S/ 550',
    featured: false,
    desc: 'Cobertura profesional para cumpleanos, bautizos y celebraciones privadas.',
    items: [
      'Cobertura fotografica de 3 horas continuas',
      '80 fotografias editadas + seleccion de momentos clave',
      'Entrega digital optimizada para redes y para impresion',
      'Preview de 10 fotos en 24 horas',
      'Hora extra: S/ 90',
    ],
  },
  {
    badge: '💍 Wedding Story',
    name: 'Bodas Esencial',
    price: 'S/ 1400',
    featured: false,
    desc: 'Narrativa completa de boda civil o religiosa con enfoque documental.',
    items: [
      'Cobertura de 6 horas (preparativos, ceremonia y retratos)',
      '250+ fotografias editadas en alta resolucion',
      'Sesion de pareja post ceremonia (30 min)',
      'Galeria privada para compartir con invitados',
      'Entrega final en 10 a 15 dias habiles',
    ],
  },
  {
    badge: '🏢 Comercial',
    name: 'Marca y Negocio',
    price: 'S/ 650',
    featured: false,
    desc: 'Contenido fotografico para empresas, emprendedores y redes sociales.',
    items: [
      'Sesion de 3 horas en local u oficina',
      '60 fotos editadas de ambiente, equipo y servicio',
      'Enfoque en identidad visual y confianza de marca',
      'Licencia de uso comercial para redes y web',
      'Plan mensual disponible para contenido continuo',
    ],
  },
]

export const CONTACT_INFO = [
  { icon: '📍', label: 'Ubicación',  value: 'Lima, Perú' },
  { icon: '📸', label: 'Instagram',  value: '@raymi_fotografia' },
  { icon: '📘', label: 'Facebook',   value: 'Raymi Fotografía' },
  { icon: '🎵', label: 'TikTok',     value: '@raymifotografia' },
  { icon: '✉️',  label: 'Email',     value: 'raymifotografia24@gmail.com' },
  { icon: '📱', label: 'WhatsApp',   value: '952 365 703' },
]

const photoWallModules = import.meta.glob('../../src/assets/images/mosaico/*.{avif,webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const WALL_TILTS = [-1.8, 1.6, -0.9, 1.1, -1.4, 1.7, -1.1, 1.3]

const parsePhotoIndex = (name) => {
  const match = name.match(/(\d+)/)
  return match ? Number.parseInt(match[1], 10) : Number.POSITIVE_INFINITY
}

const getPhotoOrientation = (name) => {
  if (/^v\d+/i.test(name)) {
    return 'portrait'
  }

  if (/^h\d+/i.test(name)) {
    return 'landscape'
  }

  if (/^s\d+/i.test(name)) {
    return 'square'
  }

  return 'square'
}

const WALL_PATTERNS = [
  ['portrait', 'landscape', 'portrait', 'landscape'],
  ['landscape', 'landscape', 'portrait', 'landscape'],
  ['portrait', 'portrait', 'landscape', 'portrait'],
  ['landscape', 'portrait', 'landscape', 'portrait'],
]

const takeNext = (bucket) => bucket.shift() ?? null

const repeatsTooMuch = (ordered, candidateOrientation) => {
  if (ordered.length < 2) {
    return false
  }

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
    if (!photo) {
      continue
    }

    if (repeatsTooMuch(ordered, photo.orientation)) {
      if (!delayedCandidate) {
        delayedCandidate = { key, photo }
      }
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
    if (photo) {
      return photo
    }
  }

  return null
}

const distributeWallPhotos = (photos) => {
  const buckets = {
    portrait: photos.filter((photo) => photo.orientation === 'portrait'),
    landscape: photos.filter((photo) => photo.orientation === 'landscape'),
    square: photos.filter((photo) => photo.orientation === 'square'),
  }

  const ordered = []
  let patternIndex = 0

  while (buckets.portrait.length || buckets.landscape.length || buckets.square.length) {
    const pattern = WALL_PATTERNS[patternIndex % WALL_PATTERNS.length]

    for (const orientation of pattern) {
      const nextPhoto = pickByPreference(buckets, orientation, ordered)
      if (nextPhoto) {
        ordered.push(nextPhoto)
      }
    }

    patternIndex += 1
  }

  return ordered
}

const wallPhotos = Object.entries(photoWallModules)
  .map(([filePath, src]) => {
    const fileName = filePath.split('/').pop()?.split('.')[0] ?? ''
    return { filePath, src, fileName }
  })
  .sort((a, b) => {
    const orientationOrder = { v: 0, h: 1, s: 2 }
    const aPrefix = a.fileName.charAt(0).toLowerCase()
    const bPrefix = b.fileName.charAt(0).toLowerCase()
    const aRank = orientationOrder[aPrefix] ?? 3
    const bRank = orientationOrder[bPrefix] ?? 3

    if (aRank !== bRank) {
      return aRank - bRank
    }

    const indexDiff = parsePhotoIndex(a.fileName) - parsePhotoIndex(b.fileName)
    if (indexDiff !== 0) {
      return indexDiff
    }

    return a.fileName.localeCompare(b.fileName)
  })
  .map(({ fileName, src }, index) => {
    const safeName = fileName || `foto-${index + 1}`
    const label = safeName.replace(/[-_]+/g, ' ')

    return {
      id: safeName,
      src,
      alt: `Mosaico ${label}`,
      orientation: getPhotoOrientation(safeName),
      tilt: WALL_TILTS[index % WALL_TILTS.length],
    }
  })

export const PHOTO_WALL = distributeWallPhotos(wallPhotos).map((photo, index) => ({
  ...photo,
  tilt: WALL_TILTS[index % WALL_TILTS.length],
}))
