# AGENTS

## Project

Single-package React 18 + Vite 5 app (no TypeScript, no tests). `src/main.jsx` → `src/App.jsx`. React Router v7 with `BrowserRouter`.

## Routes

| Path | Component | Guard |
|---|---|---|
| `/` | `MainLayout` → `Home` (via `<Outlet>`) | — |
| `/admin/login` | `Login` | — |
| `/registro`, `/admin/register` | `Register` | — |
| `/dashboard` | `Dashboard` | `RequireAuth` |
| `/perfil` | `EditarPerfil` | `RequireAuth` |
| `/admin` | `Admin` | `RequireAdmin` |
| `*` | `Error` (404) | — |

`ProtectedRoute.jsx` exports `RequireAuth` (any logged-in user) and `RequireAdmin` (default export, checks `profiles.role = 'admin'`).

## Auth

- Supabase Auth with email/password. Users created via `/registro` or manually in Supabase Auth dashboard.
- First registered user gets `role = 'admin'` (auto via migration 004 trigger). Subsequent users get `role = 'user'`. Admins can promote/demote from the `/admin` panel.
- Login redirects to `/admin` if admin, `/dashboard` if user.
- Password recovery via Supabase: login form has "Forgot password" link.

## Data flow

```
App (inline fetchAllData + getStaticData → useState)
 └── DataContext.Provider
      └── Routes
           ├── MainLayout (useDataContext → Outlet context={{ open, data }})
           │    └── Home (useOutletContext → props to Gallery, PhotoWall, Packs, Contact)
           ├── Login / Register / Dashboard / EditarPerfil / Admin
           └── Error
```

`App.jsx` initializes with `getStaticData()` (static JS fallback), then `fetchAllData()` replaces it when Supabase responds. Data flows via `DataContext` (exported from `App.jsx` as `useDataContext`). The old `useData` hook (`src/hooks/useData.js`) still exists but is **not used** — `App.jsx` fetches inline.

## Database (Supabase)

Migrations apply in order: `001_schema.sql` → `002_admin.sql` → `003_storage.sql` → `004_messages_users.sql`.

Public tables (SELECT for everyone): `categories`, `slides`, `packs`, `pack_items`, `contact_info`, `photo_wall`.

Auth tables (RLS per 002 + 004): `profiles` (id, email, full_name, phone, role), `messages` (insert by anyone, read/update by admins only).

Migration 004 adds `role` + `phone` columns to `profiles`, creates `messages` table, and supersedes the `handle_new_user` trigger from 002.

Seed data: `supabase/seed.sql` — run in Supabase SQL Editor after migration 001.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build (main verification step) |
| `npm run preview` | Vite preview of built site |
| `npm run lint` | ESLint on `src/`, **zero warnings** (`--max-warnings 0`) |
| `npm run format` | Prettier writes in-place to `src/` |
| `docker build -t raymi . && docker run -p 80:80 raymi` | Build & run production container (requires Docker) |

Run `npm i -D eslint@8 prettier eslint-plugin-react eslint-plugin-react-hooks` if linter is missing.

## Code conventions

- **Prettier** (`.prettierrc`): no semicolons, single quotes, trailing commas `es5`, printWidth 100, tabWidth 2.
- **ESLint** (`.eslintrc.json`): `react/prop-types` off, `no-unused-vars` as `warn` with `argsIgnorePattern: "^_"`.
- **Styling**: CSS Modules in `src/styles/*.module.css` (flat, not co-located) + `src/styles/global.css`. Shared helpers: `.section-tag`, `.section-title`, `.section-desc`, `.reveal` (scroll animation).
- **Images**: All hosted on Supabase Storage bucket `images`. URLs: `${STORAGE_URL}/slides/{id}.avif`, `${STORAGE_URL}/mosaico/{filename}`, `${STORAGE_URL}/hero.avif`, `${STORAGE_URL}/logo.avif`. No Vite bundling.
- **Env** (copy `.env.example`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`.

## Contact form

`Modal.jsx` submits to `contactService.enviarMensaje()`, which:
1. Saves to Supabase `messages` table (required).
2. Sends EmailJS notification (non-blocking — warns on failure but does not throw).

Template variables: `nombre`, `telefono`, `servicio`, `fecha`, `mensaje`.

When the user is logged in, `Modal.jsx` auto-fills `nombre` and `telefono` from the user's Supabase `profiles` record on open.

## Scripts

| Script | Purpose |
|---|---|
| `scripts/upload-images.mjs` | Uploads `src/assets/images/{category}/*.avif` and `mosaico/*.avif`, plus `hero.avif` / `logo.avif`, to Supabase Storage bucket `images`. Reads `.env`. |
| `scripts/upload-remaining.mjs` | Uploads specific `cumpleaños-*.avif` files with ñ→n sanitization. |
| `scripts/check-supabase.mjs` | Verifies all 8 tables exist + storage folders populated + prints test URL. |
| `scripts/verify-local.mjs` | Queries Supabase for row counts of the 5 public tables. |
| `scripts/convertir.mjs` | Converts `raw/<category>/` images to AVIF. |

## Gotchas

- `src/components/Services.jsx` is orphaned (imported by no module) and broken — imports `SERVICES` from `../data` but `src/data/index.js` does not export it.
- `src/hooks/useData.js` is unused — `App.jsx` fetches data inline. Do not reintroduce it without checking current flow.
- Migration 002's `handle_new_user` trigger is superseded by migration 004's version (which adds role/phone). Run 004 after 002.
- `useScrollReveal` uses `MutationObserver` to observe new `.reveal` elements — do NOT remove it.
- Mobile hamburger: `<nav>` goes fullscreen (`height: 100vh; inset: 0`). Do NOT use `position: fixed` on the `<ul>` child — breaks stacking context with `backdrop-filter`.
- `pnpm-lock.yaml` exists locally but is gitignored; `npm install` is the verified install command.
- `@vercel/analytics` and `@vercel/speed-insights` render in `App.jsx` outside `<Routes>`.
- No `opencode.json` config file found in repo root.
