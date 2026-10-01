import type { DemoWire } from '@/features/maoLab/domain/types'

/** Initial verified demo circuit: USB→Uno→rails + D8→220Ω→LED→GND */
export const DEMO_CIRCUIT_WIRES: readonly DemoWire[] = [
  {
    id: 'w-5v',
    from: { partId: 'uno', pinId: '5v', label: '5V' },
    to: { partId: 'breadboard', pinId: 'rail-plus', label: '+ RED rail' },
    kind: 'power',
    purpose: 'USB-powered 5V to breadboard positive rail',
    status: 'verified',
    path: [
      [-0.92, 0.24, 0.385],
      [-0.2, 0.35, 0.45],
      [0.9, 0.18, 0.55],
    ],
  },
  {
    id: 'w-gnd',
    from: { partId: 'uno', pinId: 'gnd', label: 'GND' },
    to: { partId: 'breadboard', pinId: 'rail-minus', label: '− BLUE rail' },
    kind: 'ground',
    purpose: 'Common ground to breadboard negative rail',
    status: 'verified',
    path: [
      [-1.1, 0.24, -0.385],
      [0.0, 0.32, -0.4],
      [0.9, 0.16, -0.55],
    ],
  },
  {
    id: 'w-d8',
    from: { partId: 'uno', pinId: 'd8', label: 'D8' },
    to: { partId: 'resistor-220', pinId: 'a', label: '220Ω A' },
    kind: 'signal',
    purpose: 'Digital drive to series resistor',
    status: 'verified',
    path: [
      [-0.6, 0.24, -0.385],
      [0.4, 0.4, -0.35],
      [1.35, 0.22, -0.15],
    ],
  },
  {
    id: 'w-led-gnd',
    from: { partId: 'led-red', pinId: 'cathode', label: 'LED cathode' },
    to: { partId: 'breadboard', pinId: 'rail-minus', label: '− BLUE rail' },
    kind: 'ground',
    purpose: 'LED return to ground rail',
    status: 'verified',
    path: [
      [2.1, 0.2, -0.25],
      [1.6, 0.28, -0.45],
      [1.0, 0.16, -0.55],
    ],
  },
] as const

export type LedSimMode = 'off' | 'on' | 'blink'

export const EXTERNAL_LED_CODE = {
  beginner: `D8 turns the LED on and off.
A 220 ohm resistor limits current.
Ground closes the path on the blue rail.
Blink uses timing without blocking forever in production firmware.`,
  engineering: `const uint8_t LED_PIN = 8;
const unsigned long HALF_MS = 500;
unsigned long last;
bool on;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  unsigned long now = millis();
  if (now - last >= HALF_MS) {
    last = now;
    on = !on;
    digitalWrite(LED_PIN, on);
  }
}`,
} as const
