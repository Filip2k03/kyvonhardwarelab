import { err, isFiniteNumber, ok, type CalcResult } from '@/lib/calculators/types'

export type OhmsLawSolveFor = 'voltage' | 'current' | 'resistance'

export interface OhmsLawInput {
  readonly solveFor: OhmsLawSolveFor
  readonly voltage?: number
  readonly current?: number
  readonly resistance?: number
}

export interface OhmsLawOutput {
  readonly voltage: number
  readonly current: number
  readonly resistance: number
  readonly power: number
}

export function calculateOhmsLaw(input: OhmsLawInput): CalcResult<OhmsLawOutput> {
  const { solveFor, voltage, current, resistance } = input

  if (solveFor === 'voltage') {
    if (!isFiniteNumber(current!) || !isFiniteNumber(resistance!)) {
      return err('Current and resistance are required to solve for voltage.')
    }
    if (current! < 0 || resistance! < 0) {
      return err('Current and resistance must be non-negative.')
    }
    const v = current! * resistance!
    return ok({ voltage: v, current: current!, resistance: resistance!, power: v * current! })
  }

  if (solveFor === 'current') {
    if (!isFiniteNumber(voltage!) || !isFiniteNumber(resistance!)) {
      return err('Voltage and resistance are required to solve for current.')
    }
    if (voltage! < 0 || resistance! < 0) {
      return err('Voltage and resistance must be non-negative.')
    }
    if (resistance! === 0) {
      return err('Resistance cannot be zero when solving for current.')
    }
    const i = voltage! / resistance!
    return ok({ voltage: voltage!, current: i, resistance: resistance!, power: voltage! * i })
  }

  if (!isFiniteNumber(voltage!) || !isFiniteNumber(current!)) {
    return err('Voltage and current are required to solve for resistance.')
  }
  if (voltage! < 0 || current! < 0) {
    return err('Voltage and current must be non-negative.')
  }
  if (current! === 0) {
    return err('Current cannot be zero when solving for resistance.')
  }
  const r = voltage! / current!
  return ok({ voltage: voltage!, current: current!, resistance: r, power: voltage! * current! })
}
