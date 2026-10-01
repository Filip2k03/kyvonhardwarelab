export interface PhotoChecklistItem {
  readonly id: string
  readonly label: string
}

export interface PhotoChecklist {
  readonly stepId: string
  readonly title: string
  readonly note: string
  readonly items: readonly PhotoChecklistItem[]
}

/** Operator self-check before claiming a physical milestone done. */
export const PHOTO_CHECKLISTS: readonly PhotoChecklist[] = [
  {
    stepId: 'm2',
    title: 'M2 rail photo checklist',
    note: 'Unplug USB while wiring. After these are true, send a top-down photo of Uno + full breadboard before the LED.',
    items: [
      { id: 'usb-out', label: 'USB was unplugged while placing the two jumpers' },
      { id: '5v-red', label: 'Only Uno 5V → RED + rail (one jumper)' },
      { id: 'gnd-blue', label: 'Only Uno GND → BLUE − rail (one jumper)' },
      { id: 'same-section', label: 'Both jumpers on the same rail section if rails are split' },
      { id: 'no-modules', label: 'No LED, sensors, matrix, or modules on the board yet' },
      { id: 'no-short', label: '5V and GND are not bridged to each other' },
      { id: 'full-frame', label: 'Photo will show Uno + full breadboard top-down' },
    ],
  },
  {
    stepId: 'm3',
    title: 'M3 LED photo checklist',
    note: 'Only after M2 rails are photo-checked. Upload external_led after this wiring looks correct.',
    items: [
      { id: 'm2-done', label: 'M2 rails already photo-checked and marked complete' },
      { id: 'series-r', label: '220 Ω is in series between D8 and the LED anode' },
      { id: 'polarity', label: 'LED anode toward resistor / signal; cathode toward BLUE −' },
      { id: 'gnd-shared', label: 'LED cathode shares the BLUE − rail with Uno GND' },
      { id: 'no-matrix', label: 'Raw matrix and salvaged LCD still disconnected' },
    ],
  },
] as const

export function photoChecklistForStep(stepId: string): PhotoChecklist | undefined {
  return PHOTO_CHECKLISTS.find((list) => list.stepId === stepId)
}
