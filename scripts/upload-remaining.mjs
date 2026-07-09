import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const raw = readFileSync(path.join(ROOT, '.env'), 'utf-8')
const vars = {}
for (const line of raw.split('\n')) {
  const m = line.match(/^\s*(\w+)=(.+)$/)
  if (m) vars[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
}

const supabase = createClient(vars.VITE_SUPABASE_URL, vars.VITE_SUPABASE_ANON_KEY)
const BUCKET = 'images'
const DIR = path.join(ROOT, 'src', 'assets', 'images', 'cumpleaños')

const files = ['cumpleaños-01.avif', 'cumpleaños-02.avif', 'cumpleaños-03.avif']

for (const f of files) {
  const sanitized = f.replace(/ñ/g, 'n')
  const buffer = readFileSync(path.join(DIR, f))
  const { error } = await supabase.storage.from(BUCKET).upload('slides/' + sanitized, buffer, {
    contentType: 'image/avif',
    cacheControl: '31536000',
    upsert: true,
  })
  if (error) {
    console.log('✗ ' + sanitized + ': ' + error.message)
  } else {
    console.log('✓ slides/' + sanitized)
  }
}
