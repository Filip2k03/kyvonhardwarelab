export interface Lab3dHotspot {
  readonly id: string
  readonly label: string
  readonly category: 'power' | 'digital' | 'analog' | 'special' | 'part'
  readonly position: readonly [number, number, number]
  readonly summary: string
  readonly details: string
  readonly pinNames: readonly string[]
  readonly relatedComponentSlug?: string
  readonly relatedLessonSlug?: string
}

export const UNO_BOARD_HOTSPOTS: readonly Lab3dHotspot[] = [
  {
    id: 'usb',
    label: 'USB port',
    category: 'power',
    position: [-1.0, 0.5, 0],
    summary: 'USB provides 5V power and a programming/serial link to the host.',
    details:
      'On Uno-class boards, USB both powers the regulator path and exposes a UART bridge for uploads and Serial Monitor. Weak USB ports can brown out when motors stall.',
    pinNames: ['VBUS', 'GND', 'D+', 'D−'],
    relatedComponentSlug: 'usb-cable',
    relatedLessonSlug: 'electronics-fundamentals',
  },
  {
    id: 'power-rails',
    label: '5V / 3.3V / GND',
    category: 'power',
    position: [0.565, 0.38, 0.55],
    summary: 'Regulated rails for modules. Confirm voltage before wiring 3.3V-only parts.',
    details:
      '5V is the common logic rail for this kit’s ATmega328P-class board. 3.3V is useful for RC522-class modules. Always share GND with peripherals.',
    pinNames: ['5V', '3.3V', 'GND', 'VIN'],
    relatedComponentSlug: 'atmega328p-arduino-compatible',
    relatedLessonSlug: 'electronics-fundamentals',
  },
  {
    id: 'digital-bank',
    label: 'Digital I/O (D0–D13)',
    category: 'digital',
    position: [-0.28, 0.38, -0.55],
    summary: 'General-purpose digital pins, including PWM-capable pins and UART/SPI shared functions.',
    details:
      'D0/D1 double as UART. D10–D13 commonly serve SPI. Several pins support PWM for LEDs and servos. Never exceed pin current limits.',
    pinNames: ['D0/RX', 'D1/TX', 'D2–D13'],
    relatedLessonSlug: 'gpio',
  },
  {
    id: 'analog-bank',
    label: 'Analog inputs (A0–A5)',
    category: 'analog',
    position: [-0.325, 0.38, 0.55],
    summary: 'ADC inputs for pots, dividers, and analog sensors. A4/A5 also carry I2C.',
    details:
      'Default 10-bit ADC with ~5V reference on classic Uno-class boards. Keep signals within 0..Vref. A4/SDA and A5/SCL are the I2C pair.',
    pinNames: ['A0–A3', 'A4/SDA', 'A5/SCL'],
    relatedLessonSlug: 'analog-to-digital-conversion',
  },
  {
    id: 'reset',
    label: 'Reset button',
    category: 'special',
    position: [0.95, 0.26, -0.35],
    summary: 'Hardware reset restarts the MCU without unplugging USB.',
    details:
      'Useful after uploading or when firmware wedges. Holding reset during certain programming flows can help recover boards, depending on bootloader.',
    pinNames: ['RESET'],
  },
  {
    id: 'crystal',
    label: 'Clock crystal region',
    category: 'special',
    position: [0.35, 0.26, 0.05],
    summary: 'Timing reference for the MCU clock domain.',
    details:
      'Stable timing matters for UART baud, servo pulses, and protocol libraries. Treat physical damage to the crystal area as a board-level fault.',
    pinNames: ['XTAL'],
  },
  {
    id: 'breadboard',
    label: 'Solderless breadboard',
    category: 'part',
    position: [2.05, 0.22, 0.15],
    summary: 'A temporary circuit is built by pressing leads into spring clips under the holes.',
    details:
      'Rows in each half are tied together. The center gap breaks that connection so DIP parts can straddle it. The colored edge rails are for power and ground — confirm which rail you actually wired before trusting the color.',
    pinNames: ['+ rail', '− rail', 'row holes'],
    relatedComponentSlug: 'breadboard-830',
    relatedLessonSlug: 'leds-and-resistors',
  },
  {
    id: 'series-resistor',
    label: '220 Ω series resistor',
    category: 'part',
    position: [1.55, 0.32, -0.2],
    summary: 'Limits LED current so the pin and the diode both stay within safe limits.',
    details:
      'Red-red-brown-gold reads as 220 Ω with a gold ±5% band. Place it in series with the LED, not in parallel across the rails.',
    pinNames: ['220Ω', '5%'],
    relatedComponentSlug: 'resistor-220',
    relatedLessonSlug: 'leds-and-resistors',
  },
  {
    id: 'indicator-led',
    label: 'Indicator LED',
    category: 'part',
    position: [2.35, 0.36, -0.38],
    summary: 'Light-emitting diode. The longer lead is the anode in a fresh part.',
    details:
      'Current enters the anode and leaves the cathode (flat side, shorter lead). Reverse it and the LED stays dark without damaging a 5 V pin, as long as a series resistor is present.',
    pinNames: ['anode', 'cathode'],
    relatedComponentSlug: 'led-red',
    relatedLessonSlug: 'leds-and-resistors',
  },
  {
    id: 'jumper-wire',
    label: 'Jumper wire',
    category: 'part',
    position: [1.05, 0.42, -0.15],
    summary: 'A single solid jumper carries the pin signal onto the breadboard row.',
    details:
      'Match the wire to the row you intend, and share ground between the board and the breadboard rail. A loose jumper looks connected and behaves as an open circuit.',
    pinNames: ['D8', 'row'],
    relatedComponentSlug: 'jumper-wire-set',
    relatedLessonSlug: 'leds-and-resistors',
  },
] as const

export const UNO_BOARD_FALLBACK_SUMMARY =
  'A bench around an ATmega328P Arduino-compatible controller: USB, power rails, digital and analog headers, reset, clock, plus a breadboard, 220 Ω resistor, LED, and jumper for the blink path.'
