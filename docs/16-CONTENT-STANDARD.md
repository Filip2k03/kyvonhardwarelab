# Content Standard

## Source of Truth

Educational content lives in typed data under `src/data`.

UI components render that data. Do not scatter lesson or hardware copy across JSX.

## Voice

Write like a lab instructor:

- precise
- calm
- technically accurate
- free of marketing fluff

Prefer "measure the voltage at pin A0" over "explore the magic of sensing."

## Required Lesson Sections

Every lesson must include the model in `docs/04-LEARNING-SYSTEM.md`.

Do not ship lessons that only say "wire this and paste this sketch."

Students must:

1. understand theory
2. see the wiring
3. predict behavior
4. then run the experiment

## Hardware Entries

Every hardware item must satisfy `HardwareComponent` in `docs/03-HARDWARE-CATALOG.md`.

Rules:

- Do not invent revision-specific electrical specs
- Mark uncertain values as revision-dependent
- Always include safety notes relevant to the part
- Link related lessons and projects by id/slug

## Projects

Every project must include the fields in `docs/07-PROJECT-LIBRARY.md`.

BOM must map to catalog components where possible.

## Circuits

Circuit definitions must include accessible descriptions and educational warnings.

Never claim SPICE-level accuracy.

## Code Samples

Firmware examples must:

- match the described wiring
- use clear pin constants
- include brief comments that teach intent
- avoid unexplained magic numbers when a named constant is clearer

## Safety Language

Safety warnings must be explicit and placed before risky steps.

Never bury polarity or current limits in footnotes only.

## Completeness

Placeholder copy, "TODO", and lorem ipsum are not acceptable in shipped educational content.
