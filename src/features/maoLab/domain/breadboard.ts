/**
 * Educational 830-point breadboard connectivity (not SPICE).
 * Models one half + power rails with an optional mid-board rail break.
 */

export type BreadboardHoleKind = 'rail-plus' | 'rail-minus' | 'terminal'

export interface BreadboardHole {
  readonly id: string
  readonly kind: BreadboardHoleKind
  readonly row: number
  readonly col: number
  readonly label: string
  readonly netId: string
}

export interface BreadboardNet {
  readonly id: string
  readonly name: string
  readonly kind: BreadboardHoleKind | 'mixed'
  readonly holeIds: readonly string[]
}

/** Simplified teaching board: 5 terminal columns × 10 rows per half + rails. */
export function buildTeachingBreadboard(options?: {
  readonly splitRails?: boolean
}): { holes: readonly BreadboardHole[]; nets: readonly BreadboardNet[] } {
  const splitRails = options?.splitRails ?? true
  const holes: BreadboardHole[] = []
  const netMap = new Map<string, { name: string; kind: BreadboardHoleKind; holeIds: string[] }>()

  function addHole(hole: BreadboardHole) {
    holes.push(hole)
    const existing = netMap.get(hole.netId)
    if (existing) {
      existing.holeIds.push(hole.id)
    } else {
      netMap.set(hole.netId, {
        name: hole.netId,
        kind: hole.kind,
        holeIds: [hole.id],
      })
    }
  }

  // Power rails — optionally broken at column 5 (common on large boards)
  for (const rail of [
    { kind: 'rail-plus' as const, y: 0, prefix: 'plus' },
    { kind: 'rail-minus' as const, y: 1, prefix: 'minus' },
  ]) {
    for (let col = 0; col < 10; col++) {
      const section = splitRails ? (col < 5 ? 'A' : 'B') : 'ALL'
      const netId = `rail-${rail.prefix}-${section}`
      addHole({
        id: `${rail.prefix}-${col}`,
        kind: rail.kind,
        row: rail.y,
        col,
        label: rail.kind === 'rail-plus' ? `+${col + 1}` : `−${col + 1}`,
        netId,
      })
    }
  }

  // Terminal strips (left half of trench): rows 1–10, columns a–e share a row net
  for (let row = 1; row <= 10; row++) {
    const netId = `term-L-${row}`
    for (let col = 0; col < 5; col++) {
      const letter = String.fromCharCode(97 + col)
      addHole({
        id: `L${row}${letter}`,
        kind: 'terminal',
        row: row + 1,
        col,
        label: `${row}${letter}`,
        netId,
      })
    }
  }

  // Right half: rows 1–10, columns f–j
  for (let row = 1; row <= 10; row++) {
    const netId = `term-R-${row}`
    for (let col = 0; col < 5; col++) {
      const letter = String.fromCharCode(102 + col)
      addHole({
        id: `R${row}${letter}`,
        kind: 'terminal',
        row: row + 1,
        col: col + 6,
        label: `${row}${letter}`,
        netId,
      })
    }
  }

  const nets: BreadboardNet[] = [...netMap.entries()].map(([id, value]) => ({
    id,
    name: humanNetName(id),
    kind: value.kind,
    holeIds: value.holeIds,
  }))

  return { holes, nets }
}

function humanNetName(netId: string): string {
  if (netId.startsWith('rail-plus')) return `Positive rail (${netId.slice(-1)} section)`
  if (netId.startsWith('rail-minus')) return `Ground rail (${netId.slice(-1)} section)`
  if (netId.startsWith('term-L-')) return `Left row ${netId.split('-').at(-1)} (a–e tied)`
  if (netId.startsWith('term-R-')) return `Right row ${netId.split('-').at(-1)} (f–j tied)`
  return netId
}

export function findNetForHole(
  nets: readonly BreadboardNet[],
  holeId: string,
): BreadboardNet | undefined {
  return nets.find((net) => net.holeIds.includes(holeId))
}

export function connectedHoleIds(
  nets: readonly BreadboardNet[],
  holeId: string,
): readonly string[] {
  return findNetForHole(nets, holeId)?.holeIds ?? []
}
