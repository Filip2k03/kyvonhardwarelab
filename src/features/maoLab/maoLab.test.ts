import { describe, expect, it } from 'vitest'
import { validateConnection } from '@/features/maoLab/domain/validation'
import { parseMaoLine, applyTelemetryVerb } from '@/features/maoLab/domain/protocol'
import { getExpression, pixelOn } from '@/features/maoLab/data/expressions'
import { DEMO_CIRCUIT_WIRES } from '@/features/maoLab/data/demoCircuit'
import { listMaoParts } from '@/features/maoLab/data/components'
import {
  buildTeachingBreadboard,
  connectedHoleIds,
  findNetForHole,
} from '@/features/maoLab/domain/breadboard'
import { guideForPart } from '@/features/maoLab/data/connectionGuides'
import { photoChecklistForStep } from '@/features/maoLab/data/photoChecklists'
import { canMarkStepComplete, missingPrerequisites } from '@/features/maoLab/domain/buildProgress'
import { CHECKER_ENDPOINTS, findCheckerEndpoint, guessWireKind } from '@/features/maoLab/data/checkerEndpoints'

describe('MAO connection validation', () => {
  it('blocks 5V to GND shorts', () => {
    const result = validateConnection({
      from: { partId: 'uno', pinId: '5v', label: '5V' },
      to: { partId: 'uno', pinId: 'gnd', label: 'GND' },
      kind: 'power',
      purpose: 'bad',
    })
    expect(result.result).toBe('BLOCKED')
  })

  it('marks raw matrix as unverified', () => {
    const result = validateConnection({
      from: { partId: 'uno', pinId: 'd8', label: 'D8' },
      to: { partId: 'matrix-8x8-raw', pinId: 'unknown', label: 'unknown' },
      kind: 'signal',
      purpose: 'no',
    })
    expect(result.result).toBe('UNVERIFIED')
  })

  it('accepts verified demo 5V rail', () => {
    const result = validateConnection({
      from: { partId: 'uno', pinId: '5v', label: '5V' },
      to: { partId: 'breadboard', pinId: 'rail-plus', label: '+ RED rail' },
      kind: 'power',
      purpose: 'power rail',
    })
    expect(result.result).toBe('VALID')
  })

  it('blocks GPIO powering servo VCC via checker labels', () => {
    const from = findCheckerEndpoint('uno:d9')!
    const to = findCheckerEndpoint('sg90:vcc')!
    const result = validateConnection({
      from,
      to,
      kind: guessWireKind(from, to),
      purpose: 'illegal servo power',
    })
    expect(result.result).toBe('BLOCKED')
  })
})

describe('MAO protocol', () => {
  it('parses and rejects bad lines', () => {
    expect(parseMaoLine('MAO/1 STATE IDLE').ok).toBe(true)
    expect(parseMaoLine('NOPE').ok).toBe(false)
    const next = applyTelemetryVerb({ state: 'IDLE' }, 'TEMP', '28.4')
    expect(next.tempC).toBe(28.4)
  })
})

describe('MAO face + inventory', () => {
  it('keeps matrix unverified and expressions 8 wide', () => {
    const matrix = listMaoParts().find((part) => part.id === 'matrix-8x8-raw')
    expect(matrix?.verified).toBe(false)
    const face = getExpression('happy')
    expect(face.rows).toHaveLength(8)
    expect(typeof pixelOn(face.rows, 1, 1)).toBe('boolean')
    expect(DEMO_CIRCUIT_WIRES.length).toBeGreaterThan(0)
  })
})

describe('breadboard nets', () => {
  it('ties a terminal row and splits power rails', () => {
    const { holes, nets } = buildTeachingBreadboard({ splitRails: true })
    expect(holes.length).toBeGreaterThan(20)
    const leftRow1 = connectedHoleIds(nets, 'L1a')
    expect(leftRow1).toContain('L1e')
    expect(leftRow1).not.toContain('R1f')
    const plusA = findNetForHole(nets, 'plus-0')
    const plusB = findNetForHole(nets, 'plus-9')
    expect(plusA?.id).not.toBe(plusB?.id)
  })
})

describe('connection guides', () => {
  it('marks matrix and LCD guides unverified', () => {
    expect(guideForPart('matrix-8x8-raw')?.status).toBe('unverified')
    expect(guideForPart('salvaged-lcd')?.status).toBe('unverified')
    expect(guideForPart('uno')?.status).toBe('verified')
  })
})

describe('build progress gates', () => {
  it('requires M2 before M3 and a filled photo checklist', () => {
    expect(missingPrerequisites('m3', ['m0', 'm1'])).toEqual(['m2'])
    const blocked = canMarkStepComplete('m2', ['m0', 'm1'], [])
    expect(blocked.ok).toBe(false)
    const checklist = photoChecklistForStep('m2')!
    const ready = canMarkStepComplete(
      'm2',
      ['m0', 'm1'],
      checklist.items.map((item) => item.id),
    )
    expect(ready.ok).toBe(true)
    expect(CHECKER_ENDPOINTS.length).toBeGreaterThan(8)
  })
})
