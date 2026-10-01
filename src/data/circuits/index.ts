import {
  BUTTON_CIRCUIT,
  LED_CIRCUIT,
} from './basics'
import {
  DHT11_CIRCUIT,
  LCD_CIRCUIT,
  POTENTIOMETER_CIRCUIT,
} from './sensors-displays'
import { RFID_CIRCUIT, SERVO_CIRCUIT, LED_UNSAFE_FIXTURE } from './motion-rfid'
import {
  BUZZER_CIRCUIT,
  IR_RECEIVER_CIRCUIT,
  LDR_DIVIDER_CIRCUIT,
  RELAY_CIRCUIT,
  STEPPER_ULN_CIRCUIT,
} from './actuators-signals'
import type { CircuitDefinition } from '@/types/circuit'

/** Published educational circuits (fixtures excluded). */
export const CIRCUIT_CATALOG: readonly CircuitDefinition[] = [
  LED_CIRCUIT,
  BUTTON_CIRCUIT,
  POTENTIOMETER_CIRCUIT,
  LDR_DIVIDER_CIRCUIT,
  DHT11_CIRCUIT,
  LCD_CIRCUIT,
  BUZZER_CIRCUIT,
  RELAY_CIRCUIT,
  IR_RECEIVER_CIRCUIT,
  SERVO_CIRCUIT,
  STEPPER_ULN_CIRCUIT,
  RFID_CIRCUIT,
]

export const CIRCUIT_FIXTURES = {
  ledUnsafe: LED_UNSAFE_FIXTURE,
} as const

export function listCircuits(): readonly CircuitDefinition[] {
  return CIRCUIT_CATALOG
}

export function findCircuitBySlug(slug: string): CircuitDefinition | undefined {
  return CIRCUIT_CATALOG.find((circuit) => circuit.slug === slug)
}
