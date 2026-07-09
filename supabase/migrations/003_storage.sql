-- 003_storage.sql
-- Crear bucket público "images" vía storage schema + RLS
-- Ejecutar en SQL Editor de Supabase

-- Crear bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'images',
  'images',
  true,
  10485760, -- 10MB
  array['image/avif', 'image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do nothing;

-- RLS: cualquiera puede leer objetos del bucket
create policy "Lectura pública del bucket images"
  on storage.objects for select
  using (bucket_id = 'images');

-- RLS: cualquiera puede subir al bucket (para el script de seed)
create policy "Inserción pública al bucket images"
  on storage.objects for insert
  with check (bucket_id = 'images');

-- RLS: cualquiera puede modificar (upsert)
create policy "Actualización pública al bucket images"
  on storage.objects for update
  using (bucket_id = 'images')
  with check (bucket_id = 'images');
