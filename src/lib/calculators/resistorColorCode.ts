import { err, ok, type CalcResult } from '@/lib/calculators/types'

export const RESISTOR_DIGIT_COLORS = [
  'black',
  'brown',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'violet',
  'grey',
  'white',
] as const

export const RESISTOR_MULTIPLIER_COLORS = [
  'black',
  'brown',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'violet',
  'grey',
  'white',
  'gold',
  'silver',
] as const

export const RESISTOR_TOLERANCE_COLORS = [
  'brown',
  'red',
  'green',
  'blue',
  'violet',
  'grey',
  'gold',
  'silver',
  'none',
] as const

export type ResistorDigitColor = (typeof RESISTOR_DIGIT_COLORS)[number]
export type ResistorMultiplierColor = (typeof RESISTOR_MULTIPLIER_COLORS)[number]
export type ResistorToleranceColor = (typeof RESISTOR_TOLERANCE_COLORS)[number]

const DIGIT: Record<ResistorDigitColor, number> = {
  black: 0,
  brown: 1,
  red: 2,
  orange: 3,
  yellow: 4,
  green: 5,
  blue: 6,
  violet: 7,
  grey: 8,
  white: 9,
}

const MULTIPLIER: Record<ResistorMultiplierColor, number> = {
  black: 1,
  brown: 10,
  red: 100,
  orange: 1_000,
  yellow: 10_000,
  green: 100_000,
  blue: 1_000_000,
  violet: 10_000_000,
  grey: 100_000_000,
  white: 1_000_000_000,
  gold: 0.1,
  silver: 0.01,
}

const TOLERANCE: Record<ResistorToleranceColor, number | null> = {
  brown: 1,
  red: 2,
  green: 0.5,
  blue: 0.25,
  violet: 0.1,
  grey: 0.05,
  gold: 5,
  silver: 10,
  none: 20,
}

export interface ResistorColorInput {
  readonly band1: ResistorDigitColor
  readonly band2: ResistorDigitColor
  readonly multiplier: ResistorMultiplierColor
  readonly tolerance: ResistorToleranceColor
}

export interface ResistorColorOutput {
  readonly ohms: number
  readonly tolerancePercent: number | null
  readonly display: string
}

export function decodeResistorColors(input: ResistorColorInput): CalcResult<ResistorColorOutput> {
  const { band1, band2, multiplier, tolerance } = input
  if (!(band1 in DIGIT) || !(band2 in DIGIT) || !(multiplier in MULTIPLIER) || !(tolerance in TOLERANCE)) {
    return err('One or more band colors are invalid.')
  }

  const ohms = (DIGIT[band1] * 10 + DIGIT[band2]) * MULTIPLIER[multiplier]
  const tolerancePercent = TOLERANCE[tolerance]
  return ok({
    ohms,
    tolerancePercent,
    display: formatOhms(ohms),
  })
}

export function formatOhms(ohms: number): string {
  if (!Number.isFinite(ohms)) return '—'
  if (ohms >= 1_000_000) return `${trimNumber(ohms / 1_000_000)} MΩ`
  if (ohms >= 1_000) return `${trimNumber(ohms / 1_000)} kΩ`
  return `${trimNumber(ohms)} Ω`
}

function trimNumber(value: number): string {
  return Number(value.toPrecision(6)).toString()
}
