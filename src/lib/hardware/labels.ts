import type { Difficulty, HardwareCategory } from '@/types/hardware'

export const HARDWARE_CATEGORY_LABELS: Record<HardwareCategory, string> = {
  controller: 'Controller',
  prototyping: 'Prototyping',
  sensor: 'Sensors',
  input: 'User Input',
  identification: 'Identification',
  display: 'Displays',
  lighting: 'Lighting',
  audio: 'Audio',
  motion: 'Motion',
  time: 'Time',
  switching: 'Switching',
  logic: 'Logic',
  passive: 'Passive Components',
  power: 'Power',
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const HARDWARE_CATEGORIES = Object.keys(HARDWARE_CATEGORY_LABELS) as HardwareCategory[]

export const DIFFICULTIES = Object.keys(DIFFICULTY_LABELS) as Difficulty[]
