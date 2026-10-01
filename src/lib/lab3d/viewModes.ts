export type Lab3dViewMode = 'assembled' | 'exploded' | 'isolate'

export const LAB3D_VIEW_MODES: readonly {
  readonly id: Lab3dViewMode
  readonly label: string
  readonly hint: string
}[] = [
  {
    id: 'assembled',
    label: 'Assembled',
    hint: 'Board and breadboard as wired on the bench',
  },
  {
    id: 'exploded',
    label: 'Exploded',
    hint: 'Separate the controller from the breadboard path',
  },
  {
    id: 'isolate',
    label: 'Isolate',
    hint: 'Dim everything except the selected hotspot',
  },
] as const

export function boardGroupOffset(mode: Lab3dViewMode): readonly [number, number, number] {
  if (mode === 'exploded') return [-0.4, 0.08, 0]
  return [0, 0, 0]
}

export function benchGroupOffset(mode: Lab3dViewMode): readonly [number, number, number] {
  if (mode === 'exploded') return [0.95, 0.28, 0.12]
  return [0, 0, 0]
}

export function isBoardSideHotspot(category: string): boolean {
  return category !== 'part'
}
