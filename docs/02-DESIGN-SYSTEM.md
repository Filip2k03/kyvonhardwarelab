# Design System

## Intent

Professional engineering software — not a marketing site.

Prioritize information hierarchy, legibility, and predictable interaction.
Avoid decorative excess.

## Visual Direction

Light engineering workstation inspired by CAD tools, lab instruments, and
technical documentation.

- Dense but readable layouts
- Clear section boundaries with restrained elevation
- Monospace accents for pins, values, and code
- Neutral light surfaces with a single technical blue accent
- High contrast for diagrams and safety warnings
- Radii 6–12px only

Avoid:

- heavy gradients
- neon cyberpunk styling
- excessive glassmorphism
- giant marketing headings
- purple-on-white marketing themes
- fake metrics dashboards
- decorative animations

## Tokens

| Token | Value / purpose |
|-------|------------------|
| `--color-bg` | `#F7F8FA` page background |
| `--color-surface` | `#FFFFFF` primary panels |
| `--color-surface-raised` | `#F1F3F5` secondary panels |
| `--color-border` / `--color-border-strong` | subtle neutrals |
| `--color-text` | `#111318` |
| `--color-text-muted` | `#667085` |
| `--color-accent` / `--color-accent-strong` | restrained electric blue |
| `--color-danger` / `--color-warning` / `--color-success` | semantic status |
| `--color-power` / `--color-ground` / `--color-signal-*` | circuit semantics |
| `--font-sans` / `--font-mono` | type |
| `--radius-sm` / `--radius-md` / `--radius-lg` | 6 / 8 / 12px |
| `--shadow-sm` / `--shadow-md` | elevation only where hierarchy needs it |

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
- Functional motion only (~120–240ms)
- Respect `prefers-reduced-motion`

## Print

Handouts use a separate high-contrast print stylesheet.
Hide navigation and interactive chrome in print mode.
See `docs/08-HANDOUT-SYSTEM.md`.

## Layout Breakpoints

Validate at:

- 320px
- 375px
- 430px
- 768px
- 1024px
- 1280px
- 1440px+
