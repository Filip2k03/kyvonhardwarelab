# Phase 01 — Foundation

## Objective

Create the production application foundation.

## Tasks

- initialize Vite React TypeScript application
- enable strict TypeScript
- configure Tailwind
- configure ESLint
- configure Vitest
- establish source architecture
- implement routing
- implement application shell
- implement responsive navigation
- implement design tokens
- implement error boundary
- implement 404 route
- implement loading primitives
- establish domain type directory

## Routes

```
/
/learn
/components
/components/:slug
/projects
/projects/:slug
/lab
/tools
/handouts
/progress
```

## Required Result

The application shell must be responsive and functional.

Do not implement fake dashboards merely to fill space.

## Verification

```
npm run lint
npm run typecheck
npm run test
npm run build
```
