import { err, isFiniteNumber, ok, type CalcResult } from '@/lib/calculators/types'

export interface AdcInput {
  readonly counts: number
  readonly bits: number
  readonly vref: number
}

export interface AdcOutput {
  readonly volts: number
  readonly maxCount: number
  readonly lsbVolts: number
}

export function adcCountsToVolts(input: AdcInput): CalcResult<AdcOutput> {
  const { counts, bits, vref } = input
  if (!isFiniteNumber(counts) || !isFiniteNumber(bits) || !isFiniteNumber(vref)) {
    return err('Counts, bits, and Vref must be finite numbers.')
  }
  if (!Number.isInteger(bits) || bits < 1 || bits > 32) {
    return err('Bits must be an integer from 1 to 32.')
  }
  if (vref <= 0) {
    return err('Vref must be greater than zero.')
  }
  const maxCount = 2 ** bits - 1
  if (counts < 0 || counts > maxCount) {
    return err(`Counts must be between 0 and ${maxCount}.`)
  }

  const volts = (counts / maxCount) * vref
  const lsbVolts = vref / maxCount
  return ok({ volts, maxCount, lsbVolts })
}

export function voltsToAdcCounts(
  volts: number,
  bits: number,
  vref: number,
): CalcResult<{ readonly counts: number; readonly maxCount: number }> {
  if (!isFiniteNumber(volts) || !isFiniteNumber(bits) || !isFiniteNumber(vref)) {
    return err('Volts, bits, and Vref must be finite numbers.')
  }
  if (!Number.isInteger(bits) || bits < 1 || bits > 32) {
    return err('Bits must be an integer from 1 to 32.')
  }
  if (vref <= 0) {
    return err('Vref must be greater than zero.')
  }
  if (volts < 0 || volts > vref) {
    return err('Volts must be between 0 and Vref.')
  }
  const maxCount = 2 ** bits - 1
  const counts = Math.round((volts / vref) * maxCount)
  return ok({ counts, maxCount })
}
