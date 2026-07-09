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
  const tables = [
    'categories',
    'slides',
    'packs',
    'pack_items',
    'contact_info',
    'photo_wall',
    'profiles',
    'messages',
  ]
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*', { count: 'exact', head: true })
    if (error) {
      console.log(`X ${t}: ${error.message}`)
    } else {
      console.log(`V ${t}: OK`)
    }
  }

  // 2. Storage
  console.log('\nStorage images:')
  const { data: slides, error: slidesError } = await supabase.storage.from('images').list('slides', { limit: 200 })
  if (slidesError) {
    console.log(`  X slides/: ${slidesError.message}`)
  } else {
    const avifs = slides.filter((f) => f.name.endsWith('.avif'))
    console.log(`  slides/: ${avifs.length} archivos`)
    console.log('  Ej: ' + avifs.slice(0, 5).map((f) => f.name).join(', ') + (avifs.length > 5 ? '...' : ''))
  }

  const { data: mosaic, error: mosaicError } = await supabase.storage.from('images').list('mosaico', { limit: 200 })
  if (mosaicError) {
    console.log(`  X mosaico/: ${mosaicError.message}`)
  } else {
    const avifs = mosaic.filter((f) => f.name.endsWith('.avif'))
    console.log(`  mosaico/: ${avifs.length} archivos`)
    console.log('  Archivos: ' + avifs.map((f) => f.name).join(', '))
  }

  const { data: root, error: rootError } = await supabase.storage.from('images').list('', { limit: 200 })
  if (rootError) {
    console.log(`  X raiz/: ${rootError.message}`)
  } else {
    console.log(`  raiz/: ${root.map((f) => f.name).join(', ')}`)
  }

  console.log('\nPrueba de URL directa:')
  console.log(`  ${vars.VITE_SUPABASE_URL}/storage/v1/object/public/images/hero.avif`)
  console.log('\n=== FIN ===')
}

check().catch(console.error)
