import { describe, expect, it } from 'vitest'
import { BREADBOARD_HOLE_COUNT, buildHolePositions } from './breadboardGeometry'

describe('breadboardGeometry', () => {
  const holes = buildHolePositions()

  it('models exactly 830 tie points', () => {
    expect(BREADBOARD_HOLE_COUNT).toBe(830)
    expect(holes).toHaveLength(830)
  })

  it('keeps every hole inside the 2.2 × 1.5 board footprint', () => {
    for (const [x, z] of holes) {
      expect(Math.abs(x)).toBeLessThan(1.1)
      expect(Math.abs(z)).toBeLessThan(0.75)
    }
  })

  it('never places two holes on the same spot and leaves the trench clear', () => {
    const keys = new Set(holes.map(([x, z]) => `${x.toFixed(4)},${z.toFixed(4)}`))
    expect(keys.size).toBe(830)
    expect(holes.every(([, z]) => Math.abs(z) > 0.06)).toBe(true)
  })
})
