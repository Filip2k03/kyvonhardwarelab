/**
 * Tie-point layout of an 830-point breadboard (local coordinates, 2.2 × 1.5):
 *   2 × 5 rows × 63 columns of terminal holes (630) + 4 power rails × 50 holes (200).
 * Pure data so the 3D layer can render it as one InstancedMesh and tests can verify the count.
 */

const COLUMNS = 63
const COLUMN_PITCH = 0.0315
const ROW_PITCH = 0.066
const TERMINAL_ROW_START = 0.13
const RAIL_PITCH = 0.0385
const RAIL_Z = [0.68, 0.58, -0.58, -0.68] as const

export const BREADBOARD_HOLE_COUNT = COLUMNS * 10 + RAIL_Z.length * 50

export function buildHolePositions(): readonly (readonly [number, number])[] {
  const positions: [number, number][] = []
  const startX = -((COLUMNS - 1) / 2) * COLUMN_PITCH
  for (const side of [-1, 1]) {
    for (let row = 0; row < 5; row += 1) {
      const z = side * (TERMINAL_ROW_START + row * ROW_PITCH)
      for (let column = 0; column < COLUMNS; column += 1) {
        positions.push([startX + column * COLUMN_PITCH, z])
      }
    }
  }
  for (const z of RAIL_Z) {
    for (let index = 0; index < 50; index += 1) {
      // Rails are split into 10 groups of 5 holes with a small gap between groups.
      const group = Math.floor(index / 5)
      positions.push([-0.97 + index * RAIL_PITCH + group * 0.02, z])
    }
  }
  return positions
}
