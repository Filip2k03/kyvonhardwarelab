# Cursor Build Prompt

You are the principal engineer responsible for implementing KYVON Hardware Lab.

This repository contains the product specification and engineering contract.

## FIRST

Read:

`AGENTS.md`

Then recursively inspect:

- `docs/`
- `tasks/`

Do not begin implementation until you understand:

- product goals
- architecture
- hardware catalog
- learning model
- circuit system
- 3D requirements
- performance requirements
- accessibility requirements
- definition of done

## NEXT

Inspect the entire existing repository.

Determine:

- current implementation state
- package manager
- existing dependencies
- existing architecture
- working functionality
- incomplete functionality
- build/test status

Do not destroy correct existing work.

## IMPLEMENTATION

Work through tasks in numerical phase order.

For each phase:

1. Read its task specification.
2. Inspect affected code.
3. Plan the smallest coherent implementation.
4. Implement production-quality code.
5. Add/update tests.
6. Run relevant validation.
7. Fix regressions.
8. Only then continue.

Do not create placeholder implementations.

Do not create fake functionality.

Do not mark TODOs as implementation.

Do not use `any` to escape TypeScript problems.

Do not suppress errors merely to pass builds.

Do not rewrite working modules without a concrete reason.

Keep educational data separate from presentation components.

Use reusable domain models.

## PERFORMANCE

Continuously protect initial bundle size.

Three.js and other heavy features must be dynamically imported.

Do not load 3D dependencies on routes that do not need them.

## QUALITY

Periodically run:

```
npm run lint
npm run typecheck
npm run test
npm run build
```

If scripts use another package manager, use the repository's package manager.

Fix failures before proceeding.

## FINAL PASS

After implementation, perform a repository-wide review.

Test:

- 320px mobile
- 375px mobile
- 768px tablet
- 1024px desktop
- 1440px desktop

Verify:

- navigation
- hardware search
- filters
- component pages
- lessons
- progress persistence
- quizzes
- circuits
- calculators
- handouts
- print mode
- 3D loading/fallback
- accessibility
- responsive layouts

Remove:

- dead code
- unused imports
- debug logging
- temporary assets
- placeholder copy

Do not declare completion until the production build succeeds.

When complete, report:

1. implemented phases
2. architecture created
3. tests executed
4. build status
5. performance considerations
6. known limitations
7. recommended next engineering milestone

Begin by reading `AGENTS.md` and the documentation.
