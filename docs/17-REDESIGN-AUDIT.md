# Redesign Audit — Light Engineering Workstation

Date: 2026-10-01  
Baseline: lint / typecheck / 109 tests / production build — **PASS**

## Current architecture (keep)

- Feature-oriented `src/{app,components,features,data,hooks,lib,types}`
- React Router routes under `AppShell` (all product routes present)
- Typed catalogs: hardware, lessons, projects, circuits
- Progress in `localStorage` (`PROGRESS_STORAGE_KEY`)
- Lab preferences in `localStorage` (language / voice / dimmer / text scale)
- Three.js only via lazy routes: `/lab/3d`, `/projects/:slug/3d`
- SVG circuit engine + educational warnings (not SPICE)
- Handout print CSS already light/high-contrast

## Current UI gaps vs target

| Area | Today | Target |
|------|--------|--------|
| Theme | Dark bench (`#0f1419`) | Light workstation (`#F7F8FA` / white) |
| Shell | Left nav + sticky header | Top command bar + left nav + main + inspector |
| Nav labels | Dashboard / Lab / 3D Explorer | Learn / Components / Workbench / 3D Lab / … |
| Components | Single scroll detail | Tabbed engineering catalog sections |
| Lab | Circuit list + separate 3D | Dedicated Workbench combining circuit/code/steps |
| 3D Lab | Hotspots + info panel | Pin selection tied to hardware catalog, isolate/explode, demand frameloop |
| Learning | Lesson sections | Explicit Learn→…→Challenge flow chrome |
| Mobile | Hamburger drawer | Bottom nav + inspector sheet |

## Bundle notes (baseline build)

- Main chunk ~507 kB / ~147 kB gzip (includes app + data)
- R3F/drei chunk ~930 kB lazy (expected)
- Lab3d / Project3d already code-split

## Safe migration rules

1. Keep all existing pathnames (`/lab`, `/lab/3d`, `/components/:slug`, …)
2. Add aliases (`/workbench` → `/lab`) rather than breaking bookmarks
3. Token swap first so every screen becomes light without layout risk
4. Shell refactor next, preserving `Outlet` + providers
5. Do not rewrite content modules while chrome changes

## Docs connector

Google Docs / pages MCP tools are **not available** in this agent session. Redesign notes stay in `/docs` and `/tasks`.
