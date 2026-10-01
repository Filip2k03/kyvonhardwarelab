import { describe, expect, it } from 'vitest'
import { answerBenchAssist } from '@/lib/assist/benchAssist'
import { analyzeImageData } from '@/lib/scan/analyzeFrame'
import { matchKitParts, scoreKitProfile } from '@/lib/scan/matchKitParts'
import { KIT_VISUAL_PROFILES } from '@/data/scan/kitVisualProfiles'
import { LAB3D_BUILD_STEPS } from '@/lib/lab3d/buildSteps'
import { UNO_BOARD_HOTSPOTS } from '@/data/lab3d/unoBoard'
import { resolvePageNarration } from '@/lib/audio/resolvePageNarration'

describe('benchAssist', () => {
  it('routes scan and MAO questions to the right pages', () => {
    const scan = answerBenchAssist('How do I scan with the camera?')
    expect(scan.links.some((link) => link.to === '/scan')).toBe(true)

    const mao = answerBenchAssist('MAO heartbeat')
    expect(mao.links.some((link) => link.to === '/projects/mao-mark-i')).toBe(true)

    const empty = answerBenchAssist('   ')
    expect(empty.title).toMatch(/Bench Assist/i)
  })

  it('resolves known kit part aliases', () => {
    const reply = answerBenchAssist('dht11')
    expect(reply.title.toLowerCase()).toMatch(/dht/)
    expect(reply.links.some((link) => link.to.includes('/components/'))).toBe(true)
  })
})

describe('kit scanner matching', () => {
  it('scores text aliases strongly', () => {
    const profile = KIT_VISUAL_PROFILES.find((item) => item.slug === 'led-red')!
    const { score, reasons } = scoreKitProfile(profile, null, 'red led')
    expect(score).toBeGreaterThanOrEqual(40)
    expect(reasons.join(' ')).toMatch(/text/i)
  })

  it('ranks camera+hint matches without inventing parts', () => {
    const buffer = new Uint8ClampedArray(8 * 8 * 4)
    for (let i = 0; i < buffer.length; i += 4) {
      buffer[i] = 220
      buffer[i + 1] = 40
      buffer[i + 2] = 40
      buffer[i + 3] = 255
    }
    const data = { data: buffer, width: 8, height: 8, colorSpace: 'srgb' } as ImageData
    const analysis = analyzeImageData(data)
    const matches = matchKitParts(analysis, 'led', 4)
    expect(matches.length).toBeGreaterThan(0)
    expect(matches.every((match) => Boolean(match.component.slug))).toBe(true)
  })
})

describe('3D build steps', () => {
  it('points only at real hotspots', () => {
    const ids = new Set(UNO_BOARD_HOTSPOTS.map((hotspot) => hotspot.id))
    for (const step of LAB3D_BUILD_STEPS) {
      expect(ids.has(step.hotspotId)).toBe(true)
    }
  })
})

describe('phase 14 narration', () => {
  it('covers scan, assist, and mao routes', () => {
    expect(resolvePageNarration('/scan').id).toBe('scan')
    expect(resolvePageNarration('/assist').id).toBe('assist')
    expect(resolvePageNarration('/mao').text).toMatch(/matrix/i)
  })
})
