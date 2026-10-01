# Phase 13 — Performance / a11y / regression notes

Date: 2026-10-01  
Production: https://lab.thuyakyaw.com

## Performance

- Route-level code splitting retained for Lab3d / Project3d / ContactShadows (~930 kB lazy).
- Lab3d Canvas uses `frameloop="demand"`; hotspot pulse only invalidates while selected and motion is allowed.
- Main app chunk remains ~526 kB / ~152 kB gzip after workstation chrome + explorer/workbench/learn flow.
- Three.js stays off the initial `/` route.

## Accessibility

- Skip link, primary/mobile nav labels, inspector `aria-label`, mobile inspector `role="dialog"` + Escape close.
- `:focus-visible` ring via `--shadow-focus`; `prefers-reduced-motion` disables page-enter and shortens transitions.
- Component tabs, workbench modes, and lesson flow expose tablist/step semantics.
- Circuit SVG keeps text labels for pins/wires; 3D WebGL fallback lists hotspots in HTML.
- Quiz feedback includes text explanations, not color alone.

## Regression checklist

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test` (router, learn flow, lab, hardware, 3d helpers)
- [x] `npm run build`
- [x] Core routes render under AppShell: `/`, `/learn`, `/components`, `/lab`, `/lab/3d`, `/projects`
- [x] Progress localStorage schema still accepted by existing validators
- [x] No backend / mock API introduced

## Follow-ups (out of Phase 13)

- Optional Lighthouse CI against production
- Optional focus trap inside the mobile inspector dialog
- Project route remain reachable from Home / left nav (dropped from bottom bar for space)
