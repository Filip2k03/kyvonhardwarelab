# Cursor Debug Prompt

Act as a debugging engineer.

Read `AGENTS.md` first.

Do not redesign the application.
Do not add features.
Do not perform unrelated refactoring.

Reproduce the reported failure.

Trace:

```
symptom
→ execution path
→ state/data
→ boundary
→ root cause
```

Use logs, tests, type information, browser behavior and existing code as evidence.

Fix the root cause rather than masking the symptom.

Add a regression test when practical.

Then run:

```
lint
typecheck
tests
build
```

Report:

- root cause
- changed files
- why the fix works
- regression coverage
- remaining risks
