# Testing

## Philosophy

Test what can break learning outcomes and engineering correctness.

Prefer pure domain tests over brittle UI snapshots.

## Required Coverage Areas

For every meaningful feature:

- pure domain logic
- calculators
- persistence
- important interactions

## Unit Tests

Must cover:

- hardware search / filter helpers
- progress read / write / import validation
- circuit warning validators
- Ohm's Law, LED resistor, voltage divider, ADC, PWM, base converters, resistor color code
- quiz scoring

Boundary cases:

- zero
- negative values
- invalid input
- empty collections
- corrupt storage payloads

## Component / Interaction Tests

Use React Testing Library for:

- navigation to key routes
- catalog search and filters
- lesson previous/next where wired
- calculator inputs and outputs
- progress import rejection of invalid JSON

Avoid testing implementation details.

## Manual Checks

Before release, inspect:

- 320px / 375px / 768px / 1024px / 1440px
- print/handout layout
- 3D loading and WebGL fallback
- keyboard focus paths

## Commands

```
npm run lint
npm run typecheck
npm run test
npm run build
```

All must pass before a phase is marked complete.
