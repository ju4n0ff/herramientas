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
  const { data: cats, error: e1 } = await supabase.from('categories').select('key, label').order('sort_order')
  console.log('categories:', e1 ? 'X ' + e1.message : 'OK ' + cats.length + ' rows')

  const { data: slides, error: e2 } = await supabase.from('slides').select('id, cat, label, caption').order('sort_order')
  console.log('slides:', e2 ? 'X ' + e2.message : 'OK ' + slides.length + ' rows')

  const { data: packs, error: e3 } = await supabase.from('packs').select('id, badge, name, price, featured, description').order('sort_order')
  console.log('packs:', e3 ? 'X ' + e3.message : 'OK ' + packs.length + ' rows')

  const { data: ci, error: e4 } = await supabase.from('contact_info').select('icon, label, value').order('sort_order')
  console.log('contact_info:', e4 ? 'X ' + e4.message : 'OK ' + ci.length + ' rows')

  const { data: pw, error: e5 } = await supabase.from('photo_wall').select('id, filename, alt, orientation').order('sort_order')
  console.log('photo_wall:', e5 ? 'X ' + e5.message : 'OK ' + pw.length + ' rows')

  const storageUrl = vars.VITE_SUPABASE_URL + '/storage/v1/object/public/images/'
  console.log('\nSTORAGE_URL: ' + storageUrl)
}

check()