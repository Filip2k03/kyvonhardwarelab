import type { CircuitDefinition } from '@/types/circuit'

export const LED_CIRCUIT: CircuitDefinition = {
  id: 'circuit-led',
  slug: 'led',
  title: 'LED with series resistor',
  description:
    'GPIO drives an LED through a current-limiting resistor back to ground. Educational wiring diagram — not a SPICE simulation.',
  width: 640,
  height: 360,
  relatedLessonSlugs: ['leds-and-resistors'],
  relatedHardwareSlugs: ['atmega328p-arduino-compatible', 'led-red', 'resistor-220'],
  accessibleDescription:
    'MCU digital pin D8 connects through a 220 ohm resistor to the anode of a red LED. The LED cathode returns to ground. A 5V rail and ground rail are shown for reference.',
  rails: [
    { id: 'rail-5v', label: '5V', signalType: 'POWER', y: 40, x1: 40, x2: 600 },
    { id: 'rail-gnd', label: 'GND', signalType: 'GROUND', y: 320, x1: 40, x2: 600 },
  ],
  components: [
    {
      id: 'mcu',
      label: 'ATmega328P',
      kind: 'mcu',
      x: 48,
      y: 90,
      width: 140,
      height: 160,
      pins: [
        { id: 'd8', name: 'D8', type: 'DIGITAL', x: 140, y: 50, purpose: 'GPIO output to LED path', expectedVoltage: '0/5V' },
        { id: 'gnd', name: 'GND', type: 'GROUND', x: 70, y: 160, purpose: 'Common ground', expectedVoltage: '0V' },
        { id: '5v', name: '5V', type: 'POWER', x: 70, y: 0, purpose: 'Board 5V rail', expectedVoltage: '5V' },
      ],
    },
    {
      id: 'r220',
      label: '220Ω',
      kind: 'resistor',
      x: 260,
      y: 120,
      width: 100,
      height: 48,
      pins: [
        { id: 'a', name: 'A', type: 'DIGITAL', x: 0, y: 24, purpose: 'From MCU', expectedVoltage: '~5V when ON' },
        { id: 'b', name: 'B', type: 'DIGITAL', x: 100, y: 24, purpose: 'To LED anode', expectedVoltage: 'depends on LED Vf' },
      ],
    },
    {
      id: 'led',
      label: 'Red LED',
      kind: 'led',
      x: 420,
      y: 110,
      width: 110,
      height: 70,
      pins: [
        { id: 'a', name: 'Anode', type: 'DIGITAL', x: 0, y: 35, purpose: 'Positive LED terminal' },
        { id: 'k', name: 'Cathode', type: 'GROUND', x: 110, y: 35, purpose: 'Returns to GND' },
      ],
    },
  ],
  connections: [
    {
      id: 'w1',
      fromComponent: 'mcu',
      fromPin: 'd8',
      toComponent: 'r220',
      toPin: 'a',
      signalType: 'DIGITAL',
      expectedVoltage: '0/5V',
      description: 'GPIO output sources current into the series resistor when driven HIGH.',
    },
    {
      id: 'w2',
      fromComponent: 'r220',
      fromPin: 'b',
      toComponent: 'led',
      toPin: 'a',
      signalType: 'DIGITAL',
      expectedVoltage: 'LED anode voltage',
      description: 'Resistor limits LED current according to (Vgpio − Vf) / R.',
    },
    {
      id: 'w3',
      fromComponent: 'led',
      fromPin: 'k',
      toComponent: 'mcu',
      toPin: 'gnd',
      signalType: 'GROUND',
      expectedVoltage: '0V',
      description: 'LED cathode returns to MCU ground — required common reference.',
    },
  ],
  warnings: [
    {
      id: 'led-polarity',
      severity: 'info',
      message: 'Observe LED polarity. Reverse orientation usually yields a dark LED, not a working circuit.',
    },
  ],
}

export const BUTTON_CIRCUIT: CircuitDefinition = {
  id: 'circuit-button',
  slug: 'button',
  title: 'Button with internal pull-up',
  description: 'Active-low button to ground with MCU INPUT_PULLUP. LED indicator optional path shown separately in lessons.',
  width: 640,
  height: 360,
  relatedLessonSlugs: ['buttons-and-digital-input'],
  relatedHardwareSlugs: ['atmega328p-arduino-compatible', 'push-button'],
  accessibleDescription:
    'Push button connects digital pin D2 to ground when pressed. MCU uses an internal pull-up so idle reads HIGH.',
  rails: [
    { id: 'rail-5v', label: '5V', signalType: 'POWER', y: 40, x1: 40, x2: 600 },
    { id: 'rail-gnd', label: 'GND', signalType: 'GROUND', y: 320, x1: 40, x2: 600 },
  ],
  components: [
    {
      id: 'mcu',
      label: 'ATmega328P',
      kind: 'mcu',
      x: 60,
      y: 100,
      width: 150,
      height: 150,
      pins: [
        { id: 'd2', name: 'D2', type: 'DIGITAL', x: 150, y: 60, purpose: 'INPUT_PULLUP button sense', expectedVoltage: '5V idle / 0V pressed' },
        { id: 'gnd', name: 'GND', type: 'GROUND', x: 75, y: 150, purpose: 'Common ground', expectedVoltage: '0V' },
      ],
    },
    {
      id: 'btn',
      label: 'Push button',
      kind: 'button',
      x: 360,
      y: 140,
      width: 130,
      height: 70,
      pins: [
        { id: 'a', name: 'A', type: 'DIGITAL', x: 0, y: 35, purpose: 'To D2' },
        { id: 'b', name: 'B', type: 'GROUND', x: 130, y: 35, purpose: 'To GND' },
      ],
    },
  ],
  connections: [
    {
      id: 'w1',
      fromComponent: 'mcu',
      fromPin: 'd2',
      toComponent: 'btn',
      toPin: 'a',
      signalType: 'DIGITAL',
      expectedVoltage: '5V idle / 0V pressed',
      description: 'Sense line held HIGH by pull-up until the button closes to ground.',
    },
    {
      id: 'w2',
      fromComponent: 'btn',
      fromPin: 'b',
      toComponent: 'mcu',
      toPin: 'gnd',
      signalType: 'GROUND',
      expectedVoltage: '0V',
      description: 'Press connects D2 to GND (active-low).',
    },
  ],
  warnings: [
    {
      id: 'no-hard-short',
      severity: 'warning',
      message: 'Do not wire a button that can hard-short 5V directly to GND without a defined path.',
    },
  ],
}
