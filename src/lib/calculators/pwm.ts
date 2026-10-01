import { err, isFiniteNumber, ok, type CalcResult } from '@/lib/calculators/types'

export interface PwmFromTimesInput {
  readonly highTimeSeconds: number
  readonly periodSeconds: number
  readonly supplyVoltage?: number
}

export interface PwmDutyOutput {
  readonly dutyCycle: number
  readonly dutyPercent: number
  readonly averageVoltage?: number
}

export function calculatePwmDuty(input: PwmFromTimesInput): CalcResult<PwmDutyOutput> {
  const { highTimeSeconds, periodSeconds, supplyVoltage } = input
  if (!isFiniteNumber(highTimeSeconds) || !isFiniteNumber(periodSeconds)) {
    return err('High time and period must be finite numbers.')
  }
  if (highTimeSeconds < 0 || periodSeconds <= 0) {
    return err('High time must be ≥ 0 and period must be > 0.')
  }
  if (highTimeSeconds > periodSeconds) {
    return err('High time cannot exceed period.')
  }
  if (supplyVoltage !== undefined) {
    if (!isFiniteNumber(supplyVoltage) || supplyVoltage < 0) {
      return err('Supply voltage must be a non-negative finite number.')
    }
  }

  const dutyCycle = highTimeSeconds / periodSeconds
  const dutyPercent = dutyCycle * 100
  if (supplyVoltage === undefined) {
    return ok({ dutyCycle, dutyPercent })
  }
  return ok({
    dutyCycle,
    dutyPercent,
    averageVoltage: dutyCycle * supplyVoltage,
  })
}

export function mapToPwmByte(value: number, inMin: number, inMax: number): CalcResult<number> {
  if (![value, inMin, inMax].every(isFiniteNumber)) {
    return err('Value and range bounds must be finite numbers.')
  }
  if (inMax === inMin) {
    return err('Input range cannot be zero-width.')
  }
  const normalized = (value - inMin) / (inMax - inMin)
  const clamped = Math.min(1, Math.max(0, normalized))
  return ok(Math.round(clamped * 255))
}
