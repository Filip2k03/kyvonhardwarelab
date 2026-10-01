# Cursor Review Prompt

Act as a release auditor for KYVON Hardware Lab.

Read `AGENTS.md`, `docs/15-DEFINITION-OF-DONE.md`, and `tasks/PHASE-09-QA.md`.

Do not add new product scope.

Audit the CURRENT repository for:

- TypeScript / lint failures
- broken routes
- dead or nonfunctional controls
- missing loading / empty / error states
- duplicated logic
- accessibility gaps
- mobile overflow
- layout shift risks
- unnecessary dependencies
- oversized bundles (especially accidental Three.js on non-3D routes)
- console warnings
- broken persistence / import validation
- broken print / handout layout
- placeholder or TODO educational content

Run:

```
npm run lint
npm run typecheck
npm run test
npm run build
```

Fix blocking defects discovered during the audit.

Document remaining known limitations honestly.

Report:

1. defects found and fixed
2. validation command results
3. remaining limitations
4. release readiness verdict
