/** MAO Mark I Hardware Lab — domain types (v0.1.0) */

export type VerificationStatus = 'verified' | 'provisional' | 'unverified'

export type MaoComponentCategory =
  | 'control'
  | 'display'
  | 'sensor'
  | 'actuator'
  | 'input'
  | 'output'
  | 'power'
  | 'passive'
  | 'communication'
  | 'prototyping'

export type MaoPinType =
  | 'power'
  | 'ground'
  | 'digital'
  | 'analog'
  | 'pwm'
  | 'spi'
  | 'i2c'
  | 'uart'
  | 'unknown'

export type WireKind = 'power' | 'ground' | 'signal' | 'analog' | 'data'

export type ValidationResult = 'VALID' | 'WARNING' | 'BLOCKED' | 'UNVERIFIED'

export type MaoRobotState =
  | 'BOOTING'
  | 'IDLE'
  | 'LISTENING'
  | 'THINKING'
  | 'SPEAKING'
  | 'HAPPY'
  | 'ALERT'
  | 'SLEEPING'
  | 'ERROR'

export type MaoExpressionId =
  | 'neutral'
  | 'blink'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'sleeping'
  | 'love'
  | 'error'

export interface MaoVoltageRange {
  readonly min?: number
  readonly nominal?: number
  readonly max?: number
  readonly unit: 'V'
  readonly status: VerificationStatus
}

export interface MaoHardwarePin {
  readonly id: string
  readonly label: string
  readonly type: MaoPinType
  readonly direction?: 'in' | 'out' | 'inout' | 'power' | 'ground'
  readonly voltageNote?: string
  readonly purpose: string
  readonly verified: boolean
  readonly warnings?: readonly string[]
}

export interface MaoHardwarePart {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly category: MaoComponentCategory
  readonly description: string
  readonly maoUsage: string
  readonly voltage?: MaoVoltageRange
  readonly interfaceNotes: string
  readonly pins: readonly MaoHardwarePin[]
  readonly verified: boolean
  readonly warnings: readonly string[]
  readonly milestoneId?: string
  readonly catalogSlug?: string
}

export interface MaoPinAssignment {
  readonly pin: string
  readonly partId: string
  readonly signal: string
  readonly status: 'verified' | 'provisional'
  readonly notes?: string
}

export interface ConnectionEndpoint {
  readonly partId: string
  readonly pinId: string
  readonly label: string
}

export interface ProposedConnection {
  readonly from: ConnectionEndpoint
  readonly to: ConnectionEndpoint
  readonly kind: WireKind
  readonly purpose: string
}

export interface ConnectionValidation {
  readonly result: ValidationResult
  readonly title: string
  readonly detail: string
}

export interface DemoWire {
  readonly id: string
  readonly from: ConnectionEndpoint
  readonly to: ConnectionEndpoint
  readonly kind: WireKind
  readonly purpose: string
  readonly status: VerificationStatus
  readonly path: readonly [number, number, number][]
}

export interface BuildStep {
  readonly id: string
  readonly index: number
  readonly title: string
  readonly objective: string
  readonly components: readonly string[]
  readonly connections: readonly string[]
  readonly wiring: readonly string[]
  readonly codeHint: string
  readonly expected: string
  readonly test: string
  readonly troubleshooting: readonly string[]
  readonly safety: readonly string[]
  readonly unlocks3d?: boolean
  readonly blockedReason?: string
}

export interface FaceExpression {
  readonly id: MaoExpressionId
  readonly label: string
  /** 8 rows, each bit 0–7 left→right */
  readonly rows: readonly number[]
}
