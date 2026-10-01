import { CONTROLLER_COMPONENTS } from './controllers'
import { PROTOTYPING_COMPONENTS } from './prototyping'
import { SENSOR_COMPONENTS } from './sensors'
import { INPUT_COMPONENTS } from './inputs'
import { IDENTIFICATION_COMPONENTS } from './identification'
import { DISPLAY_COMPONENTS } from './displays'
import { LIGHTING_COMPONENTS } from './lighting'
import {
  AUDIO_COMPONENTS,
  LOGIC_COMPONENTS,
  MOTION_COMPONENTS,
  SWITCHING_COMPONENTS,
  TIME_COMPONENTS,
} from './actuators'
import { PASSIVE_COMPONENTS, POWER_COMPONENTS } from './passives-power'
import type { HardwareComponent } from '@/types/hardware'
import { getHardwareById, getHardwareBySlug } from '@/lib/hardware/filterHardware'

export const HARDWARE_CATALOG: readonly HardwareComponent[] = [
  ...CONTROLLER_COMPONENTS,
  ...PROTOTYPING_COMPONENTS,
  ...SENSOR_COMPONENTS,
  ...INPUT_COMPONENTS,
  ...IDENTIFICATION_COMPONENTS,
  ...DISPLAY_COMPONENTS,
  ...LIGHTING_COMPONENTS,
  ...AUDIO_COMPONENTS,
  ...MOTION_COMPONENTS,
  ...TIME_COMPONENTS,
  ...SWITCHING_COMPONENTS,
  ...LOGIC_COMPONENTS,
  ...PASSIVE_COMPONENTS,
  ...POWER_COMPONENTS,
] as const

export function findHardwareBySlug(slug: string): HardwareComponent | undefined {
  return getHardwareBySlug(HARDWARE_CATALOG, slug)
}

export function findHardwareById(id: string): HardwareComponent | undefined {
  return getHardwareById(HARDWARE_CATALOG, id)
}

export function listHardware(): readonly HardwareComponent[] {
  return HARDWARE_CATALOG
}
