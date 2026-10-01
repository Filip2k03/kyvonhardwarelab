# Phase 11 — Enrich Circuit Library

Read `docs/05-CIRCUIT-ENGINE.md` and `docs/14-ROADMAP.md` (Post-V1 Phase 11).

Goal: expand the educational SVG circuit catalog beyond the seven V1 starters.

Add diagrams:

- active buzzer on GPIO
- 5V relay module (low-voltage load only)
- IR receiver
- LDR voltage divider
- stepper + ULN2003

Wire matching projects via `circuitId`, keep related lesson/hardware slugs resolvable, and update catalog tests.

Do not add SPICE simulation or mains-switching demos.

Validate with unit + UI tests, then lint / typecheck / test / build.
