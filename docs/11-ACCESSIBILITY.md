# Accessibility

## Requirements

Support:

- keyboard navigation
- semantic HTML
- visible focus
- reduced motion
- accessible forms
- screen-reader labels
- sufficient contrast

## Electrical Semantics

Electrical meaning must never depend solely on color.

Wires, pins, and warnings must also expose:

- text labels
- patterns or stroke styles where color encodes signal type
- accessible descriptions for SVG diagrams

## Keyboard

All interactive controls must be reachable and operable by keyboard.

Circuit pin / wire selection must have a non-pointer alternative.

Focus order must follow visual order in the primary reading flow.

## Motion

Respect `prefers-reduced-motion`.

Disable or simplify:

- decorative transitions
- auto-orbiting 3D cameras
- continuous render loops used only for motion

## 3D Fallback

When WebGL is unavailable, provide:

- static diagrams / photos
- pin tables
- textual hotspot content

Critical teaching content must not live only inside the 3D canvas.

## Forms & Quizzes

- Associate labels with inputs
- Announce validation errors
- Do not rely on color alone for correct/incorrect quiz feedback

## Contrast

Meet WCAG AA contrast for text and interactive controls.

Safety warnings must remain readable in light and dark surfaces if both exist.

## Target

Lighthouse Accessibility >= 95.
