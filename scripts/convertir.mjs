import { readdirSync, mkdirSync, existsSync, renameSync } from 'fs'
import { readFile, writeFile, access } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

const RAW_DIR = path.resolve('raw')
const OUT_DIR = path.resolve('src/assets/images')
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png'])

const CATEGORIES = [
  'retratos',
  'bautizo',
  'paisajes',
  'pedida-de-mano',
  'urbanos',
  'fotos-dentales',
  'maternales',
  'motos',
  'cumpleaños'
]

const SPECIAL = [
  { name: 'hero',  dir: 'raw' },
  { name: 'about', dir: 'raw' },
  { name: 'logo',  dir: 'raw' },
]

async function imageFiles(dir) {
  if (!existsSync(dir)) return []
  const entries = readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    if (e.isFile() && EXTENSIONS.has(path.extname(e.name).toLowerCase())) {
      files.push(path.join(dir, e.name))
    }
  }
  files.sort()
  return files
}

async function convert(srcPath, destPath, maxWidth = 1200) {
  const img = sharp(srcPath)
  const meta = await img.metadata()
  const w = meta.width
  if (w > maxWidth) {
    img.resize({ width: maxWidth, withoutEnlargement: true })
  }
  mkdirSync(path.dirname(destPath), { recursive: true })
  await img.avif({ quality: 80 }).toFile(destPath)
  console.log(`  ✓ ${path.basename(destPath)}`)
}

async function main() {
  console.log('─'.repeat(48))
  console.log('  Convertidor de imágenes → AVIF')
  console.log('─'.repeat(48))

  // Categories
  for (const cat of CATEGORIES) {
    const srcDir = path.join(RAW_DIR, cat)
    const files = await imageFiles(srcDir)
    if (files.length === 0) {
      console.log(`\n[${cat}] — sin imágenes, se omite`)
      continue
    }
    console.log(`\n[${cat}] ${files.length} imagen(es)`)

    const outDir = path.join(OUT_DIR, cat)
    for (let i = 0; i < files.length; i++) {
      const ext = path.extname(files[i]).toLowerCase()
      const destName = `${cat}-${String(i + 1).padStart(2, '0')}.avif`
      const destPath = path.join(outDir, destName)
      await convert(files[i], destPath, 1200)
    }
  }

  // Special files (hero, about, logo)
  console.log('\n[especiales]')
  for (const sp of SPECIAL) {
    const srcDir = path.resolve(RAW_DIR)
    const files = await imageFiles(srcDir)
    const match = files.find(f => {
      const base = path.basename(f, path.extname(f)).toLowerCase()
      return base === sp.name
    })
    if (!match) {
      console.log(`  ✗ ${sp.name} — no encontrado`)
      continue
    }
    const maxW = sp.name === 'hero' ? 1600 : 800
    const destPath = path.join(OUT_DIR, `${sp.name}.avif`)
    await convert(match, destPath, maxW)
  }

  // este script es para convertir y renombrar las imágenes, pero también para generar el resumen que va en src/data/index.js asi no es pesada la web esta todo en avif
  console.log('\n')
  console.log('─'.repeat(48))
  console.log('  Resumen de imágenes convertidas')
  console.log('─'.repeat(48))
  console.log('\n  Copia esto a src/data/index.js:\n')
  console.log('  export const SLIDES = [')
  for (const cat of CATEGORIES) {
    const outDir = path.join(OUT_DIR, cat)
    if (!existsSync(outDir)) continue
    const avifs = readdirSync(outDir).filter(f => f.endsWith('.avif')).sort()
    for (const f of avifs) {
      const id = `${cat}-${f.replace('.avif','').split('-').pop()}`
      console.log(`    { id: '${id}', cat: '${cat}', src: 'src/assets/images/${cat}/${f}', label: '${cat}', caption: '' },`)
    }
  }
  console.log('  ]')
  console.log('\n  Listo! Luego edita label y caption en cada slide.')
}

main().catch(err => { console.error(err); process.exit(1) })
