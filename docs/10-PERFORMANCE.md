# Performance Contract

Performance is a release requirement.

Targets:

- Lighthouse Performance >= 90
- Accessibility >= 95
- Best Practices >= 95

## Rules

Route-level code splitting.

Lazy-load:

- Three.js
- 3D models
- code editor
- large diagrams

Do not load all hardware imagery initially.

Use responsive images.

Prevent CLS.

Minimize JavaScript shipped on the initial route.

Avoid unnecessary dependencies.

Avoid unnecessary React context.

Avoid unnecessary memoization.

Profile before optimizing complex paths.

Three.js must not continuously consume GPU resources when the user is not
interacting if demand-based rendering can be used.
