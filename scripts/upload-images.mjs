import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

/* ── Leer .env ── */
function loadEnv() {
  const raw = readFileSync(path.join(ROOT, '.env'), 'utf-8')
  const vars = {}
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*(\w+)=(.+)$/)
    if (m) vars[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
  }
  return vars
}

const env = loadEnv()
const SUPABASE_URL = env.VITE_SUPABASE_URL
const ANON_KEY = env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, ANON_KEY)
const BUCKET = 'images'
const ASSETS_DIR = path.resolve(ROOT, 'src', 'assets', 'images')
const PUBLIC_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`

/* ── Helpers ── */

async function uploadFile(localPath, storagePath) {
  const fileBuffer = readFileSync(localPath)
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
    contentType: 'image/avif',
    cacheControl: '31536000',
    upsert: true,
  })
  if (error) throw error
}

/* ── Main ── */

async function main() {
  console.log('─'.repeat(48))
  console.log('  Upload imágenes → Supabase Storage')
  console.log('─'.repeat(48))

  // Verificar que el bucket existe
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucket = buckets?.find((b) => b.name === BUCKET)
  if (!bucket) {
    console.error(`
  ✗ El bucket "${BUCKET}" no existe.

  Antes de ejecutar este script, pega esto en el SQL Editor de Supabase:

  -- 003_storage.sql (crea el bucket + permisos)
  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('images', 'images', true, 10485760,
    array['image/avif','image/webp','image/jpeg','image/png'])
  on conflict (id) do nothing;

  create policy "Lectura pública del bucket images"
    on storage.objects for select using (bucket_id = 'images');

  create policy "Inserción pública al bucket images"
    on storage.objects for insert with check (bucket_id = 'images');

  create policy "Actualización pública al bucket images"
    on storage.objects for update
    using (bucket_id = 'images')
    with check (bucket_id = 'images');
    `)
    process.exit(1)
  }
  console.log(`✓ Bucket "${BUCKET}" encontrado\n`)

  let total = 0
  let ok = 0
  let fail = 0

  const upload = async (label, localPath, storagePath) => {
    total++
    try {
      await uploadFile(localPath, storagePath)
      console.log(`  ✓ ${label}`)
      ok++
    } catch (err) {
      console.error(`  ✗ ${label}: ${err.message}`)
      fail++
    }
  }

  // 1. Slides por categoría
  const categories = [
    'bautizo', 'paisajes', 'pedida-de-mano', 'urbanos',
    'fotos-dentales', 'maternales', 'motos', 'cumpleaños',
  ]

  for (const cat of categories) {
    const dir = path.join(ASSETS_DIR, cat)
    let files
    try { files = readdirSync(dir).filter((f) => f.endsWith('.avif')).sort() } catch { files = [] }
    if (files.length === 0) continue
    console.log(`[${cat}] ${files.length} archivo(s)`)
    for (const f of files) {
      await upload(`slides/${f}`, path.join(dir, f), `slides/${f}`)
    }
  }

  // 2. Mosaico
  const mosaicDir = path.join(ASSETS_DIR, 'mosaico')
  let mosaicFiles
  try { mosaicFiles = readdirSync(mosaicDir).filter((f) => f.endsWith('.avif')).sort() } catch { mosaicFiles = [] }
  if (mosaicFiles.length > 0) {
    console.log(`\n[mosaico] ${mosaicFiles.length} archivo(s)`)
    for (const f of mosaicFiles) {
      await upload(`mosaico/${f}`, path.join(mosaicDir, f), `mosaico/${f}`)
    }
  }

  // 3. Hero, logo (en raíz)
  const specials = ['hero.avif', 'logo.avif']
  console.log('\n[especiales]')
  for (const name of specials) {
    const localPath = path.join(ASSETS_DIR, name)
    try { readFileSync(localPath) } catch { console.log(`  - ${name} no encontrado, se omite`); continue }
    await upload(name, localPath, name)
  }

  console.log('\n' + '─'.repeat(48))
  console.log(`  ${ok}/${total} archivos subidos correctamente`)
  if (fail > 0) console.log(`  ${fail} archivos fallaron`)
  console.log(`  URL base: ${PUBLIC_URL}/`)
  console.log('─'.repeat(48))
}

main().catch((err) => { console.error(err); process.exit(1) })
