# Definition of Done

A feature is not complete merely because UI exists.

It is complete when:

- implementation works
- data is typed
- loading state exists where required
- empty state exists where required
- error state exists where applicable
- keyboard interaction works
- mobile layout works
- desktop layout works
- tests cover important behavior
- no console errors exist
- TypeScript succeeds
- production build succeeds

## Release Gate

Run:

```
npm run lint
npm run typecheck
npm run test
npm run build
```

Resolve all blocking errors.

Then manually inspect:

- 320px
- 375px
- 768px
- 1024px
- 1440px

Check:

- navigation
- component explorer
- lesson progression
- circuits
- calculators
- quiz
- persistence
- printing
- 3D fallback
