import { err, isFiniteNumber, ok, type CalcResult } from '@/lib/calculators/types'

export interface VoltageDividerInput {
  readonly vin: number
  readonly r1: number
  readonly r2: number
}

export interface VoltageDividerOutput {
  readonly vout: number
  readonly ratio: number
  readonly currentAmps: number
}

export function calculateVoltageDivider(input: VoltageDividerInput): CalcResult<VoltageDividerOutput> {
  const { vin, r1, r2 } = input
  if (!isFiniteNumber(vin) || !isFiniteNumber(r1) || !isFiniteNumber(r2)) {
    return err('Vin, R1, and R2 must be finite numbers.')
  }
  if (vin < 0 || r1 < 0 || r2 < 0) {
    return err('Vin, R1, and R2 must be non-negative.')
  }
  if (r1 + r2 === 0) {
    return err('R1 + R2 cannot be zero.')
  }

  const vout = vin * (r2 / (r1 + r2))
  const ratio = r2 / (r1 + r2)
  const currentAmps = vin / (r1 + r2)
  return ok({ vout, ratio, currentAmps })
}

export function solveR2ForVout(vin: number, r1: number, vout: number): CalcResult<number> {
  if (!isFiniteNumber(vin) || !isFiniteNumber(r1) || !isFiniteNumber(vout)) {
    return err('Vin, R1, and Vout must be finite numbers.')
  }
  if (vin <= 0 || r1 < 0 || vout < 0) {
    return err('Vin must be > 0 and R1/Vout must be non-negative.')
  }
  if (vout >= vin) {
    return err('Vout must be less than Vin for a passive divider.')
  }
  const r2 = (vout * r1) / (vin - vout)
  return ok(r2)
}
