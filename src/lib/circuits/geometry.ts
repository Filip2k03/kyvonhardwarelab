import type {
  CircuitDefinition,
  CircuitWarning,
  ComponentNode,
  PinNode,
  WiringConnection,
} from '@/types/circuit'

export interface AbsolutePin {
  readonly component: ComponentNode
  readonly pin: PinNode
  readonly x: number
  readonly y: number
}

export function findComponent(
  circuit: CircuitDefinition,
  componentId: string,
): ComponentNode | undefined {
  return circuit.components.find((component) => component.id === componentId)
}

export function findPin(
  component: ComponentNode,
  pinId: string,
): PinNode | undefined {
  return component.pins.find((pin) => pin.id === pinId)
}

export function getAbsolutePin(
  circuit: CircuitDefinition,
  componentId: string,
  pinId: string,
): AbsolutePin | undefined {
  const component = findComponent(circuit, componentId)
  if (!component) return undefined
  const pin = findPin(component, pinId)
  if (!pin) return undefined
  return {
    component,
    pin,
    x: component.x + pin.x,
    y: component.y + pin.y,
  }
}

export function connectionEndpoints(
  circuit: CircuitDefinition,
  connection: WiringConnection,
): { readonly from: AbsolutePin; readonly to: AbsolutePin } | undefined {
  const from = getAbsolutePin(circuit, connection.fromComponent, connection.fromPin)
  const to = getAbsolutePin(circuit, connection.toComponent, connection.toPin)
  if (!from || !to) return undefined
  return { from, to }
}

/** Orthogonal-ish path for readable educational diagrams. */
export function wirePath(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): string {
  const midX = (fromX + toX) / 2
  return `M ${fromX} ${fromY} L ${midX} ${fromY} L ${midX} ${toY} L ${toX} ${toY}`
}

export function componentsConnectedToGround(circuit: CircuitDefinition): Set<string> {
  const grounded = new Set<string>()
  for (const connection of circuit.connections) {
    if (connection.signalType !== 'GROUND') continue
    grounded.add(connection.fromComponent)
    grounded.add(connection.toComponent)
  }
  for (const component of circuit.components) {
    if (component.pins.some((pin) => pin.type === 'GROUND' && pin.name.toUpperCase().includes('GND'))) {
      // only counts if wired — handled via connections
    }
  }
  return grounded
}

export function analyzeCircuitWarnings(circuit: CircuitDefinition): readonly CircuitWarning[] {
  const computed: CircuitWarning[] = []
  const kinds = new Map(circuit.components.map((component) => [component.id, component.kind]))

  const hasLed = circuit.components.some((component) => component.kind === 'led')
  const hasResistor = circuit.components.some((component) => component.kind === 'resistor')
  if (hasLed && !hasResistor) {
    computed.push({
      id: 'auto-led-no-resistor',
      severity: 'danger',
      message:
        'Educational check: an LED is present without a series current-limiting resistor in this diagram.',
    })
  }

  const nonMcu = circuit.components.filter((component) => component.kind !== 'mcu' && component.kind !== 'generic')
  const grounded = componentsConnectedToGround(circuit)
  const mcu = circuit.components.find((component) => component.kind === 'mcu')
  if (mcu) grounded.add(mcu.id)

  for (const component of nonMcu) {
    const hasPower = circuit.connections.some(
      (connection) =>
        connection.signalType === 'POWER' &&
        (connection.fromComponent === component.id || connection.toComponent === component.id),
    )
    const hasGround = grounded.has(component.id)
    if (hasPower && !hasGround) {
      computed.push({
        id: `auto-missing-gnd-${component.id}`,
        severity: 'warning',
        message: `Educational check: “${component.label}” appears powered without a ground connection in this diagram.`,
      })
    }
  }

  for (const connection of circuit.connections) {
    if (connection.warning) {
      computed.push({
        id: `conn-warning-${connection.id}`,
        severity: 'warning',
        message: connection.warning,
        relatedConnectionIds: [connection.id],
      })
    }

    const fromKind = kinds.get(connection.fromComponent)
    const toKind = kinds.get(connection.toComponent)
    const touchesRfid = fromKind === 'rfid' || toKind === 'rfid'
    if (
      touchesRfid &&
      connection.signalType === 'POWER' &&
      connection.expectedVoltage?.includes('5')
    ) {
      computed.push({
        id: `auto-rfid-5v-${connection.id}`,
        severity: 'danger',
        message:
          'Educational check: many RC522 modules are 3.3V-only — a 5V supply connection may damage the module. Verify your revision.',
        relatedConnectionIds: [connection.id],
      })
    }
  }

  return [...circuit.warnings, ...computed]
}
