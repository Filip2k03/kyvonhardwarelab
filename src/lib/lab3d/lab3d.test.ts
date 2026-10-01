import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { UNO_BOARD_HOTSPOTS } from '@/data/lab3d/unoBoard'
import { detectWebGL } from '@/lib/lab3d/detectWebGL'
import {
  boardGroupOffset,
  benchGroupOffset,
  isBoardSideHotspot,
} from '@/lib/lab3d/viewModes'

describe('uno board hotspots', () => {
  it('defines teaching hotspots with positions and copy', () => {
    expect(UNO_BOARD_HOTSPOTS.length).toBeGreaterThanOrEqual(5)
    for (const hotspot of UNO_BOARD_HOTSPOTS) {
      expect(hotspot.position).toHaveLength(3)
      expect(hotspot.summary.length).toBeGreaterThan(10)
      expect(hotspot.details.length).toBeGreaterThan(20)
      expect(hotspot.pinNames.length).toBeGreaterThan(0)
    }
  })
})

describe('lab3d view modes', () => {
  it('offsets board and bench in exploded layout', () => {
    expect(boardGroupOffset('assembled')).toEqual([0, 0, 0])
    expect(benchGroupOffset('assembled')).toEqual([0, 0, 0])
    expect(boardGroupOffset('exploded')[0]).toBeLessThan(0)
    expect(benchGroupOffset('exploded')[0]).toBeGreaterThan(0)
    expect(isBoardSideHotspot('digital')).toBe(true)
    expect(isBoardSideHotspot('part')).toBe(false)
  })
})

describe('detectWebGL', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns true when a webgl context exists', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation((type: string) => {
      if (type === 'webgl2' || type === 'webgl' || type === 'experimental-webgl') {
        return {} as unknown as RenderingContext
      }
      return null
    })
    expect(detectWebGL()).toBe(true)
  })

  it('returns false when no webgl context is available', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    expect(detectWebGL()).toBe(false)
  })
})
