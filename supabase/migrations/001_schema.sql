-- 001_schema.sql
-- Tablas para datos públicos del portafolio de Raymi Fotografía

-- -----------------------------------------------------------
-- CATEGORÍAS
-- -----------------------------------------------------------
create table if not exists public.categories (
  key         text primary key,
  label       text not null,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.categories enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'categories' and policyname = 'Cualquiera puede leer categorías') then
    create policy "Cualquiera puede leer categorías" on public.categories for select using (true);
  end if;
end $$;

-- -----------------------------------------------------------
-- SLIDES (galería de portafolio)
-- -----------------------------------------------------------
create table if not exists public.slides (
  id          text primary key,
  cat         text not null references public.categories(key),
  label       text not null default '',
  caption     text not null default '',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.slides enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'slides' and policyname = 'Cualquiera puede leer slides') then
    create policy "Cualquiera puede leer slides" on public.slides for select using (true);
  end if;
end $$;

-- -----------------------------------------------------------
-- PACKS (planes y precios)
-- -----------------------------------------------------------
create table if not exists public.packs (
  id          serial primary key,
  badge       text not null default '',
  name        text not null,
  price       text not null,
  featured    boolean not null default false,
  description text not null default '',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.packs enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'packs' and policyname = 'Cualquiera puede leer packs') then
    create policy "Cualquiera puede leer packs" on public.packs for select using (true);
  end if;
end $$;

-- -----------------------------------------------------------
-- PACK ITEMS (lista de items de cada pack)
-- -----------------------------------------------------------
create table if not exists public.pack_items (
  id          serial primary key,
  pack_id    int not null references public.packs(id) on delete cascade,
  item_text  text not null,
  sort_order int not null default 0
);

alter table public.pack_items enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'pack_items' and policyname = 'Cualquiera puede leer items de packs') then
    create policy "Cualquiera puede leer items de packs" on public.pack_items for select using (true);
  end if;
end $$;

-- -----------------------------------------------------------
-- CONTACT INFO (información de contacto)
-- -----------------------------------------------------------
create table if not exists public.contact_info (
  id          serial primary key,
  icon        text not null,
  label       text not null,
  value       text not null,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.contact_info enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'contact_info' and policyname = 'Cualquiera puede leer info de contacto') then
    create policy "Cualquiera puede leer info de contacto" on public.contact_info for select using (true);
  end if;
end $$;

-- -----------------------------------------------------------
-- PHOTO WALL (metadatos del mosaico)
-- -----------------------------------------------------------
create table if not exists public.photo_wall (
  id          text primary key,
  filename    text not null,
  alt         text not null,
  orientation text not null check (orientation in ('portrait', 'landscape', 'square')),
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.photo_wall enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'photo_wall' and policyname = 'Cualquiera puede leer photo wall') then
    create policy "Cualquiera puede leer photo wall" on public.photo_wall for select using (true);
  end if;
end $$;