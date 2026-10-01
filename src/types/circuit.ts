export type SignalType =
  | 'POWER'
  | 'GROUND'
  | 'DIGITAL'
  | 'ANALOG'
  | 'PWM'
  | 'SPI'
  | 'I2C'
  | 'UART'
  | 'OTHER'

export type CircuitWarningSeverity = 'info' | 'warning' | 'danger'

export type ComponentKind =
  | 'mcu'
  | 'led'
  | 'resistor'
  | 'button'
  | 'potentiometer'
  | 'sensor'
  | 'display'
  | 'servo'
  | 'rfid'
  | 'generic'

export interface PinNode {
  readonly id: string
  readonly name: string
  readonly type: SignalType
  readonly x: number
  readonly y: number
  readonly purpose: string
  readonly expectedVoltage?: string
}

export interface ComponentNode {
  readonly id: string
  readonly label: string
  readonly kind: ComponentKind
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly pins: readonly PinNode[]
}

export interface WiringConnection {
  readonly id: string
  readonly fromComponent: string
  readonly fromPin: string
  readonly toComponent: string
  readonly toPin: string
  readonly signalType: SignalType
  readonly expectedVoltage?: string
  readonly description: string
  readonly warning?: string
}

export interface PowerRail {
  readonly id: string
  readonly label: string
  readonly signalType: 'POWER' | 'GROUND'
  readonly y: number
  readonly x1: number
  readonly x2: number
}

export interface CircuitWarning {
  readonly id: string
  readonly severity: CircuitWarningSeverity
  readonly message: string
  readonly relatedConnectionIds?: readonly string[]
}

export interface CircuitDefinition {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly description: string
  readonly width: number
  readonly height: number
  readonly components: readonly ComponentNode[]
  readonly connections: readonly WiringConnection[]
  readonly rails: readonly PowerRail[]
  readonly warnings: readonly CircuitWarning[]
  readonly accessibleDescription: string
  readonly relatedLessonSlugs?: readonly string[]
  readonly relatedHardwareSlugs?: readonly string[]
}
