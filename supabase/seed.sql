-- seed.sql
-- Poblar tablas con los datos actuales del portafolio
-- Ejecutar en SQL Editor de Supabase después de la migración 001_schema.sql

-- CATEGORÍAS
insert into public.categories (key, label, sort_order) values
  ('bautizo',        'Bautizo',        1),
  ('paisajes',       'Paisajes',       2),
  ('pedida-de-mano', 'Pedida de mano', 3),
  ('urbanos',        'Urbanos',        4),
  ('fotos-dentales', 'Dentales',       5),
  ('maternales',     'Maternales',     6),
  ('motos',          'Motos',          7),
  ('cumpleaños',     'Cumpleaños',     8)
on conflict (key) do nothing;

-- SLIDES (galería)
insert into public.slides (id, cat, label, caption, sort_order) values
  ('bautizo-01', 'bautizo', '', 'Bautizo · Iglesia', 1),
  ('bautizo-02', 'bautizo', '', 'Bautizo · Familia', 2),
  ('bautizo-03', 'bautizo', '', 'Bautizo · Hermanos', 3),
  ('bautizo-04', 'bautizo', '', 'Bautizo · Amigas', 4),

  ('paisajes-01', 'paisajes', '', 'Paisaje · Pareja', 5),
  ('paisajes-02', 'paisajes', '', 'Paisaje · Sendero', 6),
  ('paisajes-03', 'paisajes', '', 'Paisaje · Euforia', 7),
  ('paisajes-04', 'paisajes', '', 'Paisaje · Macchu Picchu', 8),
  ('paisajes-05', 'paisajes', '', 'Paisaje · Teatro', 9),
  ('paisajes-06', 'paisajes', '', 'Paisaje · Montaña 7 Colores', 10),
  ('paisajes-07', 'paisajes', '', 'Paisaje · Caminante', 11),
  ('paisajes-08', 'paisajes', '', 'Paisaje · Vista al panorama', 12),

  ('pedida-de-mano-01', 'pedida-de-mano', '', 'Pedida de mano · Pareja Comprometida', 13),
  ('pedida-de-mano-02', 'pedida-de-mano', '', 'Pedida de mano · Momento post a la pedida', 14),
  ('pedida-de-mano-03', 'pedida-de-mano', '', 'Pedida de mano · Lugar de Evento', 15),
  ('pedida-de-mano-04', 'pedida-de-mano', '', 'Pedida de mano · Romance', 16),

  ('urbanos-01', 'urbanos', '', 'Urbano · Retrato Under', 17),
  ('urbanos-02', 'urbanos', '', 'Urbano · Sendero', 18),
  ('urbanos-03', 'urbanos', '', 'Urbano · Padre Hija', 19),
  ('urbanos-04', 'urbanos', '', 'Urbano · Retrato', 20),
  ('urbanos-05', 'urbanos', '', 'Urbano · Momento en Río', 21),
  ('urbanos-06', 'urbanos', '', 'Urbano · Composición', 22),
  ('urbanos-07', 'urbanos', '', 'Urbano · Modelo', 23),
  ('urbanos-08', 'urbanos', '', 'Urbano · Vista a Calle', 24),
  ('urbanos-09', 'urbanos', '', 'Urbano · Iluminación en Calle', 25),
  ('urbanos-10', 'urbanos', '', 'Urbano · Amistad', 26),
  ('urbanos-11', 'urbanos', '', 'Urbano · Infante', 27),
  ('urbanos-12', 'urbanos', '', 'Urbano · Nostalgia', 28),

  ('fotos-dentales-01', 'fotos-dentales', '', 'Dental · Doctora', 29),
  ('fotos-dentales-02', 'fotos-dentales', '', 'Dental · Pre-consulta', 30),
  ('fotos-dentales-03', 'fotos-dentales', '', 'Dental · Preparación', 31),
  ('fotos-dentales-04', 'fotos-dentales', '', 'Dental · Tratamiento', 32),

  ('maternales-01', 'maternales', '', 'Maternal · Iluminación', 33),
  ('maternales-02', 'maternales', '', 'Maternal', 34),
  ('maternales-03', 'maternales', '', 'Maternal', 35),
  ('maternales-04', 'maternales', '', 'Maternal', 36),
  ('maternales-05', 'maternales', '', 'Maternal', 37),
  ('maternales-06', 'maternales', '', 'Maternal', 38),
  ('maternales-07', 'maternales', '', 'Maternal', 39),
  ('maternales-08', 'maternales', '', 'Maternal', 40),
  ('maternales-09', 'maternales', '', 'Maternal · contraluz', 41),

  ('motos-01', 'motos', '', 'Motos · Ruta', 42),
  ('motos-02', 'motos', '', 'Motos · Frente', 43),
  ('motos-03', 'motos', '', 'Motos · Estacionado', 44),
  ('motos-04', 'motos', '', 'Motos · Lateral', 45),
  ('motos-05', 'motos', '', 'Motos · Curva', 46),
  ('motos-06', 'motos', '', 'Motos · Rodada', 47),
  ('motos-07', 'motos', '', 'Motos · Wheelie', 48),
  ('motos-08', 'motos', '', 'Motos · Acción', 49),
  ('motos-09', 'motos', '', 'Motos · Frontwheel', 50),
  ('motos-10', 'motos', '', 'Motos · Movimiento', 51),

  ('cumpleaños-01', 'cumpleaños', '', 'Cumpleaños · Sorpresa', 52),
  ('cumpleaños-02', 'cumpleaños', '', 'Cumpleaños · Velas', 53),
  ('cumpleaños-03', 'cumpleaños', '', 'Cumpleaños · Familia', 54)
on conflict (id) do nothing;

-- PACKS
insert into public.packs (id, badge, name, price, featured, desc, sort_order) values
  (1, '🔥 Mas popular',     'Pack Urbano Pro',     'S/ 240',  true,  'Ideal para marca personal, parejas y contenido editorial en exteriores.', 1),
  (2, '🎉 Cobertura social', 'Eventos y Celebraciones', 'S/ 550',  false, 'Cobertura profesional para cumpleaños, bautizos y celebraciones privadas.', 2),
  (3, '💍 Wedding Story',   'Bodas Esencial',      'S/ 1400', false, 'Narrativa completa de boda civil o religiosa con enfoque documental.', 3),
  (4, '🏢 Comercial',       'Marca y Negocio',     'S/ 650',  false, 'Contenido fotográfico para empresas, emprendedores y redes sociales.', 4)
on conflict (id) do nothing;

-- PACK ITEMS
insert into public.pack_items (pack_id, item_text, sort_order) values
  (1, 'Sesion de 2 horas en 1 o 2 locaciones urbanas', 1),
  (1, '40 fotografias finales editadas en alta resolucion', 2),
  (1, 'Direccion de poses y asesoria de vestuario previa', 3),
  (1, 'Entrega en galeria privada online (5 dias habiles)', 4),
  (1, 'Opcion de reels behind the scenes (+S/ 80)', 5),

  (2, 'Cobertura fotografica de 3 horas continuas', 1),
  (2, '80 fotografias editadas + seleccion de momentos clave', 2),
  (2, 'Entrega digital optimizada para redes y para impresion', 3),
  (2, 'Preview de 10 fotos en 24 horas', 4),
  (2, 'Hora extra: S/ 90', 5),

  (3, 'Cobertura de 6 horas (preparativos, ceremonia y retratos)', 1),
  (3, '250+ fotografias editadas en alta resolucion', 2),
  (3, 'Sesion de pareja post ceremonia (30 min)', 3),
  (3, 'Galeria privada para compartir con invitados', 4),
  (3, 'Entrega final en 10 a 15 dias habiles', 5),

  (4, 'Sesion de 3 horas en local u oficina', 1),
  (4, '60 fotos editadas de ambiente, equipo y servicio', 2),
  (4, 'Enfoque en identidad visual y confianza de marca', 3),
  (4, 'Licencia de uso comercial para redes y web', 4),
  (4, 'Plan mensual disponible para contenido continuo', 5);

-- CONTACT INFO
insert into public.contact_info (icon, label, value, sort_order) values
  ('📍', 'Ubicación',  'Lima, Perú',                    1),
  ('📸', 'Instagram',  '@raymi_fotografia',             2),
  ('📘', 'Facebook',   'Raymi Fotografía',               3),
  ('🎵', 'TikTok',     '@raymifotografia',              4),
  ('✉️',  'Email',     'raymifotografia24@gmail.com',   5),
  ('📱', 'WhatsApp',   '952 365 703',                    6);

-- PHOTO WALL (solo metadatos, las imágenes se resuelven por filename vía import.meta.glob)
insert into public.photo_wall (id, filename, alt, orientation, sort_order) values
  ('v01', 'v01.avif', 'Mosaico v01', 'portrait',  1),
  ('v02', 'v02.avif', 'Mosaico v02', 'portrait',  2),
  ('v03', 'v03.avif', 'Mosaico v03', 'portrait',  3),
  ('v04', 'v04.avif', 'Mosaico v04', 'portrait',  4),
  ('v05', 'v05.avif', 'Mosaico v05', 'portrait',  5),
  ('v06', 'v06.avif', 'Mosaico v06', 'portrait',  6),
  ('v07', 'v07.avif', 'Mosaico v07', 'portrait',  7),
  ('v08', 'v08.avif', 'Mosaico v08', 'portrait',  8),
  ('v09', 'v09.avif', 'Mosaico v09', 'portrait',  9),
  ('v10', 'v10.avif', 'Mosaico v10', 'portrait', 10),
  ('v11', 'v11.avif', 'Mosaico v11', 'portrait', 11),
  ('h01', 'h01.avif', 'Mosaico h01', 'landscape', 12),
  ('h02', 'h02.avif', 'Mosaico h02', 'landscape', 13),
  ('h03', 'h03.avif', 'Mosaico h03', 'landscape', 14),
  ('h04', 'h04.avif', 'Mosaico h04', 'landscape', 15),
  ('h05', 'h05.avif', 'Mosaico h05', 'landscape', 16),
  ('h06', 'h06.avif', 'Mosaico h06', 'landscape', 17),
  ('h07', 'h07.avif', 'Mosaico h07', 'landscape', 18),
  ('h08', 'h08.avif', 'Mosaico h08', 'landscape', 19),
  ('h09', 'h09.avif', 'Mosaico h09', 'landscape', 20),
  ('h10', 'h10.avif', 'Mosaico h10', 'landscape', 21),
  ('h11', 'h11.avif', 'Mosaico h11', 'landscape', 22)
on conflict (id) do nothing;
