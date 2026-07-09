import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const raw = readFileSync(path.join(ROOT, '.env'), 'utf-8')
const vars = {}
for (const line of raw.split('\n')) {
  const m = line.match(/^\s*(\w+)=(.+)$/)
  if (m) vars[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
}

const supabase = createClient(vars.VITE_SUPABASE_URL, vars.VITE_SUPABASE_ANON_KEY)

async function check() {
  console.log('=== VERIFICACION DE SUPABASE ===\n')

  // 1. Tablas
  const tables = ['categories', 'slides', 'packs', 'pack_items', 'contact_info', 'photo_wall']
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*', { count: 'exact', head: true })
    if (error) {
      console.log(`X ${t}: ${error.message}`)
    } else {
      console.log(`V ${t}: OK`)
    }
  }

  // 2. Storage
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucket = buckets?.find((b) => b.name === 'images')
  if (bucket) {
    console.log(`\nV Bucket images: publico = ${bucket.public}`)
    const { data: slides } = await supabase.storage.from('images').list('slides')
    if (slides) {
      const avifs = slides.filter((f) => f.name.endsWith('.avif'))
      console.log(`  slides/: ${avifs.length} archivos`)
      console.log('  Ej: ' + avifs.slice(0, 3).map((f) => f.name).join(', ') + (avifs.length > 3 ? '...' : ''))
    }
    const { data: mosaic } = await supabase.storage.from('images').list('mosaico')
    if (mosaic) {
      const avifs = mosaic.filter((f) => f.name.endsWith('.avif'))
      console.log(`  mosaico/: ${avifs.length} archivos`)
    }
    const { data: root } = await supabase.storage.from('images').list()
    const specials = root?.filter((f) => ['hero.avif', 'logo.avif'].includes(f.name))
    if (specials) console.log(`  raiz/: ${specials.map((f) => f.name).join(', ')}`)
  } else {
    console.log('\nX Bucket images no encontrado')
  }

  console.log('\nPrueba de URL directa:')
  console.log(`  ${vars.VITE_SUPABASE_URL}/storage/v1/object/public/images/hero.avif`)
  console.log('\n=== FIN ===')
}

check().catch(console.error)
