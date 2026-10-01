/** Guided build steps for the 3D Lab workbench experience. */
export interface Lab3dBuildStep {
  readonly id: string
  readonly title: string
  readonly detail: string
  readonly hotspotId: string
  readonly preferredMode: 'assembled' | 'exploded' | 'isolate'
}

export const LAB3D_BUILD_STEPS: readonly Lab3dBuildStep[] = [
  {
    id: 'orient',
    title: 'Orient the Uno',
    detail: 'Find USB, power jack, and the digital/analog header banks before placing jumpers.',
    hotspotId: 'usb',
    preferredMode: 'assembled',
  },
  {
    id: 'power',
    title: 'Power rails',
    detail: '5V and GND feed the breadboard rails. Exploded view separates board from bench.',
    hotspotId: 'power-rails',
    preferredMode: 'exploded',
  },
  {
    id: 'digital',
    title: 'Digital I/O bank',
    detail: 'Isolate the digital headers when planning LED or sensor signal wires.',
    hotspotId: 'digital-bank',
    preferredMode: 'isolate',
  },
  {
    id: 'resistor',
    title: 'Series resistor',
    detail: 'Place the 220 Ω in series with the LED — red-red-brown-gold on this bench model.',
    hotspotId: 'series-resistor',
    preferredMode: 'assembled',
  },
  {
    id: 'led',
    title: 'Indicator LED',
    detail: 'Anode toward the signal through the resistor; cathode toward GND. Isolate to focus the part.',
    hotspotId: 'indicator-led',
    preferredMode: 'isolate',
  },
  {
    id: 'analog',
    title: 'Analog inputs',
    detail: 'A0–A5 for pots, LDR, and sensor modules. Confirm pin labels before wiring.',
    hotspotId: 'analog-bank',
    preferredMode: 'isolate',
  },
] as const
