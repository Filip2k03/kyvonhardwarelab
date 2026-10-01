# Architecture

## Principle

Feature-oriented frontend architecture.

Educational content lives in typed data modules.
UI components render domain models — they do not own curriculum content.

## Source Layout

```
src/
  app/           # shell, routing, providers, error boundaries
  components/    # shared reusable UI only
  features/      # domain features (learn, hardware, circuits, lab, tools, …)
  data/          # typed educational content (hardware, lessons, projects, circuits)
  hooks/         # shared hooks
  lib/           # pure utilities (calculators, persistence, validation)
  types/         # shared domain types
```

## Features

Each feature owns:

- its route entry (lazy where appropriate)
- feature-local components
- feature-local hooks
- feature-local types when not shared

Do not promote code to `components/` or `lib/` until a second consumer exists.

## Routing

React Router with route-level code splitting.

Required routes:

| Route | Feature |
|-------|---------|
| `/` | Dashboard shell |
| `/learn` | Curriculum index |
| `/learn/:lessonSlug` | Lesson renderer |
| `/components` | Hardware catalog |
| `/components/:slug` | Component detail |
| `/projects` | Project library |
| `/projects/:slug` | Project detail |
| `/lab` | Experiments / simulations |
| `/lab/3d` | 3D explorer (lazy) |
| `/tools` | Engineering calculators |
| `/handouts` | Handout index / print |
| `/progress` | Local progress |

## Data Flow

```
typed data (src/data)
        ↓
domain helpers (src/lib)
        ↓
feature hooks
        ↓
feature UI
```

No global state framework in V1.

Local UI state: React state / URL params.
Cross-session state: `localStorage` via a typed persistence layer.

## Lazy Loading

Must be dynamically imported:

- Three.js / R3F / Drei
- 3D models
- code editor (if introduced)
- large circuit diagram packs

Initial route must not depend on WebGL.

## Error Handling

- App-level error boundary
- Route-level fallbacks for lazy chunks
- Feature-level empty / loading / error states per Definition of Done

## Non-Goals (V1)

- Backend API
- Auth
- Database
- Real-time sync
- SPICE electrical simulation
