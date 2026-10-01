export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

export type HardwareCategory =
  | 'controller'
  | 'prototyping'
  | 'sensor'
  | 'input'
  | 'identification'
  | 'display'
  | 'lighting'
  | 'audio'
  | 'motion'
  | 'time'
  | 'switching'
  | 'logic'
  | 'passive'
  | 'power'

export type HardwareInterface =
  | 'gpio'
  | 'adc'
  | 'pwm'
  | 'i2c'
  | 'spi'
  | 'uart'
  | 'one-wire'
  | 'analog'
  | 'digital'
  | 'power'

export type PinType =
  | 'power'
  | 'ground'
  | 'digital'
  | 'analog'
  | 'pwm'
  | 'spi'
  | 'i2c'
  | 'uart'
  | 'other'

export interface HardwarePin {
  readonly id: string
  readonly name: string
  readonly type: PinType
  readonly description: string
  readonly voltage?: string
}

export interface HardwareComponent {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly category: HardwareCategory
  readonly description: string
  readonly difficulty: Difficulty
  readonly operatingVoltage: string
  readonly logicVoltage: string
  readonly interfaces: readonly HardwareInterface[]
  readonly pins: readonly HardwarePin[]
  readonly operatingPrinciple: string
  readonly useCases: readonly string[]
  readonly safety: readonly string[]
  readonly relatedLessons: readonly string[]
  readonly relatedProjects: readonly string[]
}
