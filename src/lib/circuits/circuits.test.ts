import { describe, expect, it } from 'vitest'
import { analyzeCircuitWarnings, connectionEndpoints, wirePath } from '@/lib/circuits/geometry'
import { CIRCUIT_CATALOG, CIRCUIT_FIXTURES, findCircuitBySlug, listCircuits } from '@/data/circuits'
import { SIGNAL_STYLES } from '@/lib/circuits/signalStyles'

describe('circuit catalog', () => {
  it('publishes the starter plus actuator/signal circuits', () => {
    const slugs = listCircuits().map((circuit) => circuit.slug)
    expect(slugs).toEqual([
      'led',
      'button',
      'potentiometer',
      'ldr-divider',
      'dht11',
      'lcd',
      'buzzer',
      'relay',
      'ir-receiver',
      'servo',
      'stepper-uln2003',
      'rfid',
    ])
  })

  it('includes accessible descriptions and rails/components/connections', () => {
    for (const circuit of CIRCUIT_CATALOG) {
      expect(circuit.accessibleDescription.length).toBeGreaterThan(20)
      expect(circuit.components.length).toBeGreaterThan(0)
      expect(circuit.connections.length).toBeGreaterThan(0)
      for (const connection of circuit.connections) {
        expect(connectionEndpoints(circuit, connection)).toBeDefined()
      }
    }
  })
})

describe('analyzeCircuitWarnings', () => {
  it('flags LED without resistor', () => {
    const warnings = analyzeCircuitWarnings(CIRCUIT_FIXTURES.ledUnsafe)
    expect(warnings.some((warning) => warning.id === 'auto-led-no-resistor')).toBe(true)
  })

  it('does not flag the safe LED circuit for missing resistor', () => {
    const led = findCircuitBySlug('led')
    expect(led).toBeDefined()
    const warnings = analyzeCircuitWarnings(led!)
    expect(warnings.some((warning) => warning.id === 'auto-led-no-resistor')).toBe(false)
  })

  it('flags missing ground on powered modules', () => {
    const dht = findCircuitBySlug('dht11')
    expect(dht).toBeDefined()
    const noGround = {
      ...dht!,
      id: 'dht-no-gnd',
      connections: dht!.connections.filter((connection) => connection.signalType !== 'GROUND'),
    }
    const warnings = analyzeCircuitWarnings(noGround)
    expect(warnings.some((warning) => warning.id.startsWith('auto-missing-gnd-'))).toBe(true)
  })
})

describe('signal styles', () => {
  it('provides labels and patterns for every signal type', () => {
    for (const style of Object.values(SIGNAL_STYLES)) {
      expect(style.label.length).toBeGreaterThan(0)
      expect(style.patternDescription.length).toBeGreaterThan(0)
    }
  })
})

describe('wirePath', () => {
  it('returns an orthogonal path string', () => {
    expect(wirePath(0, 0, 100, 50)).toContain('M 0 0')
    expect(wirePath(0, 0, 100, 50)).toContain('L 100 50')
  })
})
