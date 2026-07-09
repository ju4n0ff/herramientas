# AGENTS

## Project Snapshot

- Single-package React 18 + Vite 5 app (no TypeScript, no tests). Entrypoints: `src/main.jsx` → `src/App.jsx`.
- `react-router-dom` v7 with `BrowserRouter`. `MainLayout` wraps the home route via `<Outlet>` and owns shared state (`Navbar`, `Footer`, `Modal`, `WhatsAppButton`). `<Cursor />` and `<AccessibilityPanel />` sit outside `<Routes>` in `App.jsx`.
- Data loads from Supabase on first visit. Falls back to static `src/data/index.js` if Supabase is unreachable or unconfigured. Images always served from Supabase Storage (bucket `images`). `App.jsx` fetches data once via `useData()` and provides it through `DataContext`. `MainLayout` passes `{ open, data }` via `<Outlet context>`. `Home` distributes `data.slides`, `data.categories`, `data.packs`, `data.photoWall` as props to children.
- Fonts: Cormorant Garamond, Jost, Rajdhani loaded from Google Fonts (`index.html`). Only `Rajdhani` used in CSS; others loaded but unused.

## Supabase Schema

Migration: `supabase/migrations/001_schema.sql`. Tables: `categories`, `slides`, `packs`, `pack_items`, `contact_info`, `photo_wall`. All have public SELECT policies. Insert/update restricted to authenticated users (future admin). The `categories` table includes a synthetic `all` row that the data service prepends client-side.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build (main verification step) |
| `npm run preview` | Vite preview of built site |
| `npm run lint` | ESLint on `src/`, **zero warnings** (`--max-warnings 0`) |
| `npm run format` | Prettier writes in-place to `src/` |

**Note**: Ensure `eslint` (v8.x) and `prettier` are installed. Run `npm i -D eslint@8 prettier eslint-plugin-react eslint-plugin-react-hooks`.

## Code Conventions

- **Prettier** (`.prettierrc`): no semicolons, single quotes, trailing commas (`es5`), printWidth 100, tabWidth 2.
- **ESLint** (`.eslintrc.json`): `react/prop-types` off, `no-unused-vars` as `warn` with `argsIgnorePattern: "^_"`.
- **Styling**: CSS Modules in `src/styles/*.module.css` (flat, not co-located) + `src/styles/global.css`. Shared helpers: `.section-tag`, `.section-title`, `.section-desc`, `.reveal` (scroll-triggered animation classes).
- **Images**: All hosted on Supabase Storage (bucket `images`). Run `node scripts/upload-images.mjs` to upload from local `src/assets/images/` after running `003_storage.sql` in Supabase SQL Editor. Image conversion script: `node scripts/convertir.mjs` (reads from `raw/<category>/`, outputs AVIF to local dir for upload).
- **Image URLs**: Constructed at runtime from Supabase Storage: `${STORAGE_URL}/slides/{id}.avif`, `${STORAGE_URL}/mosaico/{filename}`, `${STORAGE_URL}/hero.avif`, `${STORAGE_URL}/logo.avif`. No `import.meta.glob` — images are not bundled by Vite.

## Data Flow

```
App (useData → DataContext)
 └── BrowserRouter
      └── AppContent (reads useData; shows LoadingSpinner while loading)
           └── DataContext.Provider
                └── Routes
                     └── MainLayout (reads DataContext; passes data to Footer, Modal, WhatsApp)
                          ├── Outlet context={{ open, data }}
                          │    └── Home
                          │         ├── Gallery     ← props: slides, categories
                          │         ├── PhotoWall   ← props: photos
                          │         └── Packs       ← props: packs
                          └── Footer                ← props: contactInfo
                          └── Modal                 ← props: categories, contactInfo
                          └── WhatsAppButton        ← props: contactInfo
```

- `src/services/supabaseClient.js` — initializes Supabase client (null if env vars missing).
- `src/services/dataService.js` — `fetchAllData()` queries 5 tables in parallel; resolves image URLs via Supabase Storage; falls back to `src/data/index.js` if any query fails.
- `src/hooks/useData.js` — calls `fetchAllData()` once, caches result in `sessionStorage`. Shows global spinner until loaded.
- `src/data/index.js` — static data used as fallback when Supabase is unavailable.

## Data & Environment

- `.env` (copy from `.env.example`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`.
- EmailJS contact form in `src/services/contactService.js`. Template variables: `nombre`, `telefono`, `servicio`, `fecha`, `mensaje`.
- `.gitignore` excludes `.env`, `raw/`, `dist/`, `.vite/`, `node_modules/`.

## Gotchas

- `src/App.jsx` has a dead import: `import Packs from './components/Packs'` — not referenced in JSX. Real usage is from `src/pages/Home.jsx`.
- `src/components/Services.jsx` is orphaned (imported by no module) and broken — imports `SERVICES` from `../data` but `src/data/index.js` does not export it.
- Admin routes: `/admin/login` (login form) and `/admin` (dashboard, protected by `ProtectedRoute`). Uses `supabase.auth.signInWithPassword()`. Create users manually in Supabase Auth dashboard.
- Seed data: `supabase/seed.sql` — run this in Supabase SQL Editor after `001_schema.sql` to populate tables with current portfolio data. Images hosted on Supabase Storage bucket `images` (upload via `scripts/upload-images.mjs`).
- Both `package-lock.json` and `pnpm-lock.yaml` exist; `npm install` is the verified install command.
- `useScrollReveal` (`src/hooks/useScrollReveal.js`) uses a `MutationObserver` to observe new `.reveal` elements. It runs once on mount (`[]` deps) and auto-observes new elements — do NOT remove the MutationObserver.
- The mobile hamburger menu makes the `<nav>` itself fullscreen (`height: 100vh; inset: 0`) when `menuOpen` is true. Do NOT use `position: fixed` on the `<ul>` child — that creates stacking context conflicts with the nav's `backdrop-filter`.