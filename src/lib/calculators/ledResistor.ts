import { err, isFiniteNumber, ok, type CalcResult } from '@/lib/calculators/types'

export interface LedResistorInput {
  readonly supplyVoltage: number
  readonly forwardVoltage: number
  readonly forwardCurrentAmps: number
}

export interface LedResistorOutput {
  readonly resistanceOhms: number
  readonly preferredE24Ohms: number
  readonly powerWatts: number
  readonly actualCurrentAmps: number
}

/** Nearest equal-or-higher common E24 value for conservative current limiting. */
const E24 = [
  1, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2, 2.2, 2.4, 2.7, 3, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5,
  8.2, 9.1,
] as const

function nearestE24AtLeast(ohms: number): number {
  if (ohms <= 0) return E24[0]!
  const exponent = Math.floor(Math.log10(ohms))
  const mantissa = ohms / 10 ** exponent
  for (const value of E24) {
    if (value + 1e-12 >= mantissa) {
      return value * 10 ** exponent
    }
  }
  return E24[0]! * 10 ** (exponent + 1)
}

export function calculateLedResistor(input: LedResistorInput): CalcResult<LedResistorOutput> {
  const { supplyVoltage, forwardVoltage, forwardCurrentAmps } = input

  if (
    !isFiniteNumber(supplyVoltage) ||
    !isFiniteNumber(forwardVoltage) ||
    !isFiniteNumber(forwardCurrentAmps)
  ) {
    return err('Supply voltage, LED forward voltage, and current must be finite numbers.')
  }
  if (supplyVoltage <= 0 || forwardVoltage < 0 || forwardCurrentAmps <= 0) {
    return err('Supply must be > 0, forward voltage ≥ 0, and current > 0.')
  }
  if (forwardVoltage >= supplyVoltage) {
    return err('LED forward voltage must be less than the supply voltage.')
  }

  const resistanceOhms = (supplyVoltage - forwardVoltage) / forwardCurrentAmps
  const preferredE24Ohms = nearestE24AtLeast(resistanceOhms)
  const actualCurrentAmps = (supplyVoltage - forwardVoltage) / preferredE24Ohms
  const powerWatts = actualCurrentAmps * actualCurrentAmps * preferredE24Ohms

  return ok({
    resistanceOhms,
    preferredE24Ohms,
    powerWatts,
    actualCurrentAmps,
  })
}
