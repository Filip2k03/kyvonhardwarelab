# KYVON Hardware Lab — Agent Engineering Contract

## Mission

Build KYVON Hardware Lab as a production-quality, frontend-only interactive
electronics and embedded-systems learning environment.

This is not a marketing landing page.

It is an engineering learning application for someone physically working with:

- Arduino-compatible boards
- breadboards
- LEDs
- resistors
- sensors
- displays
- servos
- stepper motors
- RFID
- infrared
- relays
- robotics
- ESP32-class devices

The application must teach:

Theory → Wiring → Code → Experiment → Debugging → Challenge → Project.

---

## Agent Operating Rules

Before modifying code:

1. Read this file.
2. Read relevant `/docs/*.md`.
3. Read the current phase under `/tasks`.
4. Inspect the existing implementation.
5. Understand existing types and abstractions.
6. Reuse existing patterns where appropriate.
7. Determine the smallest coherent implementation.
8. Implement it completely.
9. Test it.
10. Fix discovered regressions.

Never blindly replace working architecture.

Do not stop merely because one file has been generated.

---

# Technical Stack

Default stack:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Three Fiber
- Drei
- Three.js
- Lucide React
- Vitest
- React Testing Library

Frontend only for V1.

Do not introduce:

- database
- authentication
- server
- unnecessary state-management frameworks
- unnecessary UI frameworks

Use browser APIs where appropriate.

---

# TypeScript

Enable strict TypeScript.

Avoid `any`.

Prefer:

- discriminated unions
- readonly structures where useful
- explicit domain interfaces
- exhaustive switches
- typed configuration
- deterministic error handling

Never silence a TypeScript error merely to make the build pass.

---

# Architecture

Use feature-oriented architecture.

```
src/
  app/
  components/
  features/
  data/
  hooks/
  lib/
  types/
```

Features should own their domain-specific UI and logic.

Shared components must actually be reusable.

Avoid creating abstractions before multiple consumers exist.

---

# Data Architecture

Educational content must not be scattered through JSX.

Represent:

- hardware
- lessons
- circuits
- experiments
- projects
- quizzes

as structured typed data.

UI renders those domain models.

---

# UI Principles

The application should resemble professional engineering software.

Prioritize:

- information hierarchy
- legibility
- predictable interaction
- keyboard accessibility
- responsive behavior
- fast navigation
- low cognitive overhead

Avoid:

- excessive gradients
- excessive glassmorphism
- decorative animations
- giant hero typography
- meaningless dashboards
- fake metrics
- nonfunctional buttons

---

# 3D

3D must teach something.

Do not use Three.js merely as decoration.

3D interactions can include:

- rotate
- zoom
- inspect
- pin selection
- hotspot selection
- exploded views
- wiring visualization

Three.js must be lazy-loaded.

Never make the initial application dependent on WebGL.

Provide fallbacks.

---

# Performance

Treat performance as a feature.

Use:

- route splitting
- dynamic imports
- lazy loading
- compressed assets
- limited DPR
- memoization only where justified
- efficient event handling

Avoid unnecessary rerenders.

Do not permanently run a 60 FPS render loop if nothing is changing.

---

# Accessibility

Support:

- keyboard navigation
- semantic HTML
- visible focus
- reduced motion
- accessible forms
- screen-reader labels
- sufficient contrast

Electrical meaning must never depend solely on color.

---

# Hardware Safety

Never teach direct mains-voltage breadboard experimentation.

Focus curriculum on low-voltage electronics.

Clearly warn about:

- polarity
- excessive current
- short circuits
- incorrect supply voltage
- motor current
- relay isolation
- battery safety

---

# Testing

For every meaningful feature:

- test pure domain logic
- test calculators
- test persistence
- test important interactions

Before finishing:

```
npm run typecheck
npm run test
npm run build
```

Fix failures before marking work complete.

---

# Completion Rule

Do not report a phase as complete unless:

- implementation exists
- navigation works
- responsive states work
- tests pass
- TypeScript passes
- production build succeeds
- no known blocking defects remain

When something cannot be completed, document exactly:

1. what is blocked
2. why
3. what was attempted
4. what the next action should be
