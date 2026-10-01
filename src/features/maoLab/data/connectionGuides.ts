import type { MaoHardwarePart } from '@/features/maoLab/domain/types'

export interface ConnectionGuide {
  readonly partId: string
  readonly title: string
  readonly status: 'verified' | 'provisional' | 'unverified'
  readonly steps: readonly string[]
  readonly diagram: string
  readonly warnings: readonly string[]
  readonly relatedBuildStepId?: string
}

export const CONNECTION_GUIDES: readonly ConnectionGuide[] = [
  {
    partId: 'uno',
    title: 'Power the breadboard from the Uno (USB only)',
    status: 'verified',
    relatedBuildStepId: 'm2',
    diagram: `Mac --USB--> Uno
                 |-- 5V  --> breadboard RED +
                 |-- GND --> breadboard BLUE -`,
    steps: [
      'Unplug USB before placing jumpers.',
      'Male-to-male jumper: Uno 5V → a hole on the RED + rail (same section you will use).',
      'Male-to-male jumper: Uno GND → a hole on the BLUE − rail (same section).',
      'Double-check you did not bridge 5V to GND.',
      'Plug USB; do not add modules until rails look correct.',
    ],
    warnings: ['Never connect 5V directly to GND.', 'Do not use the 9V battery for M2–M3.'],
  },
  {
    partId: 'breadboard',
    title: 'How 830 breadboard holes connect',
    status: 'verified',
    relatedBuildStepId: 'm2',
    diagram: `+ + + + +   RED rail (may split mid-board)
- - - - -   BLUE rail (may split mid-board)
a b c d e | f g h i j
row N: a–e tied; f–j tied; trench breaks left↔right`,
    steps: [
      'Click a hole in the Wiring explorer to see its electrical net.',
      'Keep early MAO wiring on the rail section where Uno 5V/GND enter.',
      'Parts that need the same signal share a terminal row (e.g. 5a–5e).',
      'Do not assume the entire red/blue column is one continuous net.',
    ],
    warnings: ['Split rails are common — verify continuity before trusting the far end.'],
  },
  {
    partId: 'resistor-220',
    title: 'Series 220 Ω with the LED',
    status: 'verified',
    relatedBuildStepId: 'm3',
    diagram: `Uno D8 --> 220Ω --> LED anode
LED cathode --> BLUE GND rail`,
    steps: [
      'Place the 220 Ω across two different terminal rows (not shorting one row to itself).',
      'One lead toward the D8 jumper row; other lead toward the LED anode row.',
      'Orientation of the resistor does not matter; LED polarity does.',
    ],
    warnings: ['Never omit the series resistor on a GPIO LED.'],
  },
  {
    partId: 'led-red',
    title: 'External indicator LED on D8',
    status: 'verified',
    relatedBuildStepId: 'm3',
    diagram: `D8 -- 220Ω -- LED(+) -- LED(-) -- GND`,
    steps: [
      'Confirm anode (typically longer lead) toward the resistor / signal.',
      'Cathode toward the BLUE − rail (shared with Uno GND).',
      'Upload firmware/external_led only after M2 rails are photo-checked.',
      'Expect ~1 Hz blink in SIMULATION on the website; physical blink after upload.',
    ],
    warnings: ['Reversed LED stays dark — fix polarity before raising voltage or swapping pins.'],
  },
  {
    partId: 'matrix-8x8-raw',
    title: 'Raw 8×8 matrix — do not wire yet',
    status: 'unverified',
    relatedBuildStepId: 'm16',
    diagram: `UNVERIFIED — row/column pins unknown
(Do not assume MAX7219 DIN/CS/CLK)`,
    steps: [
      'Photograph the back of the module (IC silk, pin labels).',
      'Use Face Lab software simulator only until pinout is confirmed.',
      '74HC595 path stays planned — not connected.',
    ],
    warnings: [
      'UNVERIFIED HARDWARE',
      'Physical pinout must be verified before connection.',
    ],
  },
  {
    partId: 'salvaged-lcd',
    title: 'Salvaged LCD — research only',
    status: 'unverified',
    relatedBuildStepId: 'm21',
    diagram: `Label seen: HD50LA7002-21B
Controller / voltages / interface: UNKNOWN`,
    steps: [
      'Leave disconnected from the Uno.',
      'Record markings, ribbon pin count, and any controller IC text.',
      'Do not guess backlight or logic supply onto Arduino 5V.',
    ],
    warnings: ['Never connect an unknown LCD voltage line to the Arduino.'],
  },
  {
    partId: 'sg90',
    title: 'SG90 signal vs power (later)',
    status: 'provisional',
    relatedBuildStepId: 'm8',
    diagram: `RED  -> 5V rail (not GPIO)
BROWN-> GND rail
ORANGE -> PWM pin (provisional D9)`,
    steps: [
      'Do not wire until M3 is solid.',
      'GPIO carries the orange signal only — never servo VCC from a GPIO.',
    ],
    warnings: ['GPIO current warning if VCC is tied to a digital pin.'],
  },
] as const

export function guideForPart(partId: string): ConnectionGuide | undefined {
  return CONNECTION_GUIDES.find((guide) => guide.partId === partId)
}

export function guidesForPartList(parts: readonly MaoHardwarePart[]): readonly ConnectionGuide[] {
  return CONNECTION_GUIDES.filter((guide) => parts.some((part) => part.id === guide.partId))
}
