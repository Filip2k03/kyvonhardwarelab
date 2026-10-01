# Architecture — MAO web lab

[VERIFIED] Browser UI is frontend-only (Vite + React + R3F).

```
UI (lab.thuyakyaw.com)
  └─ features/maoLab (domain + data + three + pages)
Mac bridge (future)
  └─ USB serial MAO/1
ATmega328P firmware (~/Projects/mao-mark-i)
```

Three.js loads only on `/projects/mao-mark-i/workbench` via `React.lazy`.

Simulation → real hardware should swap telemetry source without rewriting the UI shell.
