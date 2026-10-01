# Known Limitations (V1)

Honest post–Phase 09 release notes. These are accepted constraints, not accidental bugs.

## Product

- Frontend only. No accounts, backend, database, or cloud sync.
- Progress and lab preferences live in `localStorage` on this device.
- Circuit diagrams are educational SVG drawings, not SPICE simulation.
- Project 3D models are procedural teaching stands-ins, not scanned kit photography.

## Audio

- Spoken guides use the browser’s free speech synthesis API.
- Female voice profiles (01–10) prefer female system voices when available; exact timbre depends on the OS and browser.
- There is no server-side neural TTS or uploaded audio library in V1.

## Language

- UI copy is authored in English.
- Google Translate rewrites the live page for Myanmar, Japanese, and Russian. Quality varies by engine and is not curated.

## 3D

- Three.js loads only on `/lab/3d` and `/projects/:slug/3d`.
- Devices without WebGL get a text fallback with the same teaching content.
- The ContactShadows / Three vendor chunk is large by design and stays out of the main route bundle.

## Print

- Handouts use browser Print / Save as PDF. There is no server PDF generator.
- Exact page breaks differ slightly between browsers and printers.

## Bundle / performance

- Production builds may warn about the lazy Three.js chunk exceeding 500 kB. That chunk is code-split and not loaded on non-3D routes.
