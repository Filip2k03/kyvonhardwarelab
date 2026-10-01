# CLAUDE.md

Guidance for Claude Code (`claude`) when working in this repository.

**Production:** https://lab.thuyakyaw.com  
**Contract:** `AGENTS.md` (full engineering rules). Read it plus relevant `docs/*.md` and `tasks/PHASE-*.md` before changing architecture.

---

## Resume this project in Claude Code

From the app directory (`kyvon-hardware-lab/`):

```bash
cd /Users/stephanfilip/cyberlab/kyvon_hardware_lab/kyvon-hardware-lab

# Most recent conversation in this directory
claude -c

# Interactive picker / search
claude --resume
# or
claude -r

# Exact session id (example — list under ~/.claude/projects/…/)
claude --resume 2ff5bbaa-f663-4de7-b970-3c38e37521cc
```

Notes:

- Sessions for this workspace live under  
  `~/.claude/projects/-Users-stephanfilip-cyberlab-kyvon-hardware-lab/`
- `--bare` skips CLAUDE.md auto-discovery — do **not** use `--bare` when you want this file loaded.
- `claude -p` / print mode needs auth (`/login` in an interactive session). Prefer interactive `-c` / `-r` for continuing lab work.
- Cursor Agent also works here and shares `AGENTS.md`. Check `git status` before editing — either tool may have changed files.

Sibling firmware repo (physical MAO): `~/Projects/mao-mark-i` — has its own `AGENTS.md` / `CLAUDE.md`. Do not invent matrix/LCD pinouts there either.

---

## Commands

```bash
npm run dev          # Vite
npm run lint         # eslint .
npm run typecheck    # tsc -b --pretty false
npm run test         # vitest run
npm run build        # tsc -b && vite build
npx vitest run src/features/maoLab/maoLab.test.ts
npx vitest run -t "name fragment"
```

Before calling a phase/feature done: **typecheck + test + build** must pass. Never silence TypeScript with `any`. Deploy: `vercel deploy --prod --yes` when asked (SPA rewrite in `vercel.json`).

---

## Architecture (current)

Stack: React 19, TypeScript, Vite, Tailwind v4, React Router 7, R3F/Drei/Three, Vitest + RTL. Alias `@/` → `src/`.

**Content is data; UI renders it.** Curriculum in `src/data/*`, types in `src/types/*`. Cross-refs by slug/id — `src/lib/releaseIntegrity.test.ts` must stay green.

**Layers:**

| Path | Role |
|------|------|
| `src/app/` | Router, nav, `App.tsx` providers |
| `src/features/<area>/` | Pages / feature UI |
| `src/features/maoLab/` | **MAO Mark I Hardware Lab v0.1** (domain, data, three, pages) |
| `src/lib/<area>/` | Pure logic (progress, scan, assist, audio, calculators) |
| `src/hooks/` | Progress / narration / inspector (split context + provider + hook) |
| `src/components/` | Shell, studio, audio, shared UI |
| `docs/mao-mark-i/` | MAO web lab docs |

**Three.js stays lazy.** Only load R3F on:

- `/lab/3d`
- `/projects/:slug/3d`
- `/projects/mao-mark-i/workbench`

Use `WebGlFallback` / `detectWebGL` when WebGL is missing. Do not import `three` into the initial bundle.

**MAO Mark I lab routes** (`/mao` redirects here):

- `/projects/mao-mark-i` — landing  
- `…/workbench` — 3D bench, connect validator, D8 LED sim  
- `…/components` · `…/wiring` · `…/build` · `…/face` · `…/firmware` · `…/telemetry` · `…/architecture`

Browser bridge status is always **SIMULATION MODE** until a real Mac serial bridge exists. Never show **CONNECTED** without a confirmed bridge.

**On-device only:** `/scan` (local frame heuristics), `/assist` (local Q&A). No TF.js / cloud vision. Camera frames never leave the device.

**Persistence:** `localStorage` only (progress + MAO build key `mao-lab-build-v1` + studio prefs).

---

## Hard safety / content rules

1. Frontend-only learning app — no inventing backends.
2. Kit-only MAO parts. **Raw 8×8 matrix is UNVERIFIED** — do **not** assume MAX7219; no authoritative pin map.
3. **Salvaged LCD** (label HD50LA7002-21B) is UNVERIFIED — never invent voltage/interface; never tell the user to power unknown LCD lines from the Uno.
4. Connection validator: block 5V↔GND shorts, GPIO→motor/servo power, unverified hardware ties.
5. Low-voltage teaching only; electrical meaning must not rely on color alone.
6. Prefer smallest coherent change; re-read files before edit; do not rewrite working architecture blindly.

Mark electrical facts: **[VERIFIED]** · **[PROVISIONAL]** · **[UNVERIFIED]**.

---

## Process

1. Read this file + `AGENTS.md` + current `tasks/PHASE-*.md`.
2. Inspect existing code; reuse patterns.
3. Implement completely for the scoped milestone.
4. Run lint / typecheck / test / build.
5. Update phase task notes when closing work.
6. Known limitations: `docs/16-KNOWN-LIMITATIONS.md` (large Three chunk warning is expected).

`.env*` and `.vercel` are gitignored — do not commit them.
