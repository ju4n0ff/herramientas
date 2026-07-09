-- 003_storage.sql
-- Crear bucket público "images" vía storage schema + RLS

-- Crear bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'images',
  'images',
  true,
  10485760,
  array['image/avif', 'image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do nothing;

-- RLS
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'objects' and policyname = 'Lectura pública del bucket images' and schemaname = 'storage') then
    create policy "Lectura pública del bucket images" on storage.objects for select using (bucket_id = 'images');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'objects' and policyname = 'Inserción pública al bucket images' and schemaname = 'storage') then
    create policy "Inserción pública al bucket images" on storage.objects for insert with check (bucket_id = 'images');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'objects' and policyname = 'Actualización pública al bucket images' and schemaname = 'storage') then
    create policy "Actualización pública al bucket images" on storage.objects for update using (bucket_id = 'images') with check (bucket_id = 'images');
  end if;
end $$;