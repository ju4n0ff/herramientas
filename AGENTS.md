# AGENTS

## Project Snapshot

- Single-package React 18 + Vite 5 app (no TypeScript, no tests). Entrypoints: `src/main.jsx` → `src/App.jsx`.
- `react-router-dom` v7 with `BrowserRouter`. `MainLayout` wraps the home route via `<Outlet>` and owns shared state (`Navbar`, `Footer`, `Modal`, `WhatsAppButton`). `<Cursor />` sits outside `<Routes>` in `App.jsx`.
- `MainLayout` uses `useModal` from `src/hooks/useModal.js` and passes `{ open }` via `<Outlet context={{open}}/>`. `Home` retrieves it with `useOutletContext()` and forwards to `Packs`/`Contact`.
- Fonts loaded from Google Fonts: Cormorant Garamond, Jost, Rajdhani (`index.html`). Only `Rajdhani` is used in CSS; the other two are loaded but unused.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build (main verification step) |
| `npm run preview` | Vite preview of built site |
| `npm run lint` | ESLint on `src/`, **zero warnings** (`--max-warnings 0`) |
| `npm run format` | Prettier writes in-place to `src/` |

**Note**: `eslint` and `prettier` are NOT listed in `package.json` devDependencies. If these commands fail, install them manually (`npm i -D eslint prettier` + plugins).

## Code Conventions

- **Prettier** (`.prettierrc`): no semicolons, single quotes, trailing commas (`es5`), printWidth 100, tabWidth 2.
- **ESLint** (`.eslintrc.json`): `react/prop-types` off, `no-unused-vars` as `warn` with `argsIgnorePattern: "^_"`.
- **Styling**: CSS Modules in `src/styles/*.module.css` (flat, not co-located) + `src/styles/global.css`. Exception: `Error.css` is a plain CSS file (not a module). Shared helpers: `.section-tag`, `.section-title`, `.section-desc`, `.reveal` (scroll-triggered animation classes).
- **Images**: All photos in AVIF format. Source originals go in `raw/<category>/`; run `node scripts/convertir.mjs` to convert + resize (max 1200 px, quality 80) into `src/assets/images/<category>/`. Special files: `raw/hero.*` → `src/assets/images/hero.avif` (1600px), `raw/about.*` → `src/assets/images/about.avif` (800px), `raw/logo.*` → `src/assets/images/logo.avif` (800px).
- **Photo wall** (`PHOTO_WALL` in data): images from `src/assets/images/mosaico/` loaded via Vite glob (`import.meta.glob`). File naming: `v<N>` = portrait, `h<N>` = landscape, `s<N>` = square.
- **Image references in code**: Hero and logo use direct ES imports (`import heroSrc from '../assets/images/hero.avif'`). Gallery slides use `import.meta.glob` in `src/data/index.js` to resolve image paths at build time. Avoid hardcoded string paths to `src/assets/images/` — they work in dev but not in production builds.

## Data & Environment

- `src/data/index.js` — single source of truth for all static content: `SLIDES`, `CATS`, `PACKS`, `CONTACT_INFO`, `PHOTO_WALL`. Edit data here, never in components.
- EmailJS contact form in `src/services/contactService.js`. Requires `.env` with `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`. Template variables: `nombre`, `telefono`, `servicio`, `fecha`, `mensaje`.
- `.gitignore` excludes `.env`, `raw/`, `dist/`, `.vite/`, `node_modules/`.
- `DOCUMENTACION_AVANCE.md` at repo root contains detailed project documentation (tech decisions, branch strategy, commit history).

## Gotchas

- `src/App.jsx` has a dead import: `import Packs from './components/Packs'` — not referenced in its JSX. Real usage is from `src/pages/Home.jsx`.
- `src/components/Services.jsx` is orphaned (imported by no other module) **and broken** — imports `SERVICES` from `../data` but `src/data/index.js` does not export it.
- `AccessibilityPanel` (535 lines) renders alongside `Cursor` outside `<Routes>`. Persists settings to `localStorage` under key `raymi-a11y`. Uses `data-*` attributes on `<html>` to toggle font-size, contrast, dyslexia mode, reading mask, big cursor, etc.
- App.jsx imports `@vercel/analytics` and `@vercel/speed-insights` — they render inside `BrowserRouter` but outside `<Routes>`.
- `README.md` mentions Supabase as backend — this is stale; no Supabase code exists in the project.
- Both `package-lock.json` and `pnpm-lock.yaml` exist; `npm install` is the verified install command.
- `useScrollReveal` (`src/hooks/useScrollReveal.js`) uses a `MutationObserver` to observe new `.reveal` elements added to the DOM. It runs once on mount (`[]` deps) and auto-observes new elements. If a component re-renders and creates new `.reveal` children, they will be picked up automatically — do NOT remove the MutationObserver.
- The mobile hamburger menu works by making the `<nav>` itself fullscreen (`height: 100vh; inset: 0`) when `menuOpen` is true. Do NOT use `position: fixed` on the `<ul>` child — that creates stacking context conflicts with the nav's `backdrop-filter`.
