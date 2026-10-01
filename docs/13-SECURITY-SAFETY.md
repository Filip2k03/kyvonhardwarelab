# Security and Safety

## Application Security (V1)

Frontend-only application.

Rules:

- No secrets in the repository
- No backend endpoints to attack in V1
- Validate all JSON imports before writing to `localStorage`
- Sanitize or safely render user-provided import content (treat as data, not HTML)
- Do not use `eval` or dynamic code execution on imported progress
- Prefer `noopener,noreferrer` on external links

## Hardware Safety Curriculum

Never teach direct mains-voltage breadboard experimentation.

Focus on low-voltage electronics suitable for the kit.

## Required Warnings

Clearly warn about:

- polarity
- excessive current
- short circuits
- incorrect supply voltage
- motor current draw
- relay isolation (coil vs contact side)
- battery safety (9V connector handling, polarity)
- reverse connection of sensors / modules
- exceeding pin current limits on MCU GPIO

## Content Rules

- Prefer USB / regulated 5V lab supply patterns in early lessons
- Mark relay contact-side experiments carefully; keep V1 examples on low-voltage loads unless isolation is explicit
- Never present unsafe wiring as a challenge without a clear prohibition
- Safety sections are mandatory on lessons and projects that involve power, motors, or relays

## User Trust

Do not claim electrical simulation accuracy beyond educational validation.

Circuit warnings are educational heuristics, not guarantees of safe physical construction.
