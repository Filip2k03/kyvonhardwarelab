# Design System

## Intent

Professional engineering software — not a marketing site.

Prioritize information hierarchy, legibility, and predictable interaction.
Avoid decorative excess.

## Visual Direction

- Dense but readable layouts
- Clear section boundaries without heavy card chrome
- Monospace accents for pins, values, and code
- Neutral base palette with a single technical accent
- High contrast for diagrams and safety warnings

Avoid:

- excessive gradients
- glassmorphism
- decorative animations
- giant hero typography
- purple-on-white marketing themes
- fake metrics dashboards

## Tokens

Define CSS variables (or Tailwind theme extensions) for:

| Token group | Purpose |
|-------------|---------|
| `--color-bg` / `--color-surface` / `--color-border` | Surfaces |
| `--color-text` / `--color-text-muted` | Typography |
| `--color-accent` | Interactive emphasis |
| `--color-danger` / `--color-warning` / `--color-success` | Status |
| `--color-power` / `--color-ground` / `--color-signal-*` | Circuit semantics |
| `--font-sans` / `--font-mono` | Type |
| `--space-*` | Spacing scale |
| `--radius-sm` / `--radius-md` | Subtle radii only |
| `--focus-ring` | Visible focus |

## Typography

- Sans for UI chrome and prose
- Mono for pin names, voltages, hex, code snippets
- Modest scale — no oversized marketing headlines in the app shell

## Circuit Semantics

Electrical meaning must never depend solely on color.

Combine:

- color
- label
- pattern / stroke style
- accessible text alternatives

## Interaction

- Visible focus rings
- Predictable hover / active states
- Keyboard-reachable controls
- Touch targets ≥ 44px on mobile where practical

## Motion

- Prefer functional transitions (panel open, route fade)
- Respect `prefers-reduced-motion`
- No continuous decorative loops

## Print

Handouts use a separate high-contrast print stylesheet.
Hide navigation and interactive chrome in print mode.
See `docs/08-HANDOUT-SYSTEM.md`.

## Layout Breakpoints

Validate at:

- 320px
- 375px
- 768px
- 1024px
- 1440px
