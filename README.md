# KYVON Hardware Lab

A production-quality, frontend-only interactive electronics and embedded-systems
learning environment. The site accompanies physical hardware — it does not
replace it.

## Primary Loop

**Learn → Understand → Wire → Predict → Program → Build → Measure → Debug → Improve**

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Lucide React
- Vitest + React Testing Library
- React Three Fiber / Drei / Three.js (Phase 06, lazy-loaded)

Frontend only for V1. Progress persists in `localStorage` with JSON import/export.

## Repository Map

| Path | Purpose |
|------|---------|
| `AGENTS.md` | Engineering contract for Cursor / agents |
| `docs/` | Product, architecture, and domain specifications |
| `tasks/` | Ordered implementation phases |
| `prompts/` | Cursor CLI prompts (build / continue / debug / review) |
| `src/` | Application source |

## Getting Started

```bash
npm install
npm run dev
```

Validation:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Agent Workflow

1. Read `AGENTS.md`
2. Read relevant files under `docs/` and `tasks/`
3. Inspect the current repository state
4. Implement the next incomplete phase completely
5. Validate before continuing

Use `prompts/CURSOR-BUILD.md` for the initial build.
Use `prompts/CURSOR-CONTINUE.md` for subsequent work.
Use `prompts/CURSOR-DEBUG.md` when something breaks.
Use `prompts/CURSOR-REVIEW.md` for a release audit.

## Safety

Curriculum focuses on low-voltage electronics. Never teach direct mains-voltage
breadboard experimentation.
