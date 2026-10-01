import { describe, expect, it } from 'vitest'
import { calculateOhmsLaw } from '@/lib/calculators/ohmsLaw'
import { calculateLedResistor } from '@/lib/calculators/ledResistor'
import { calculateVoltageDivider, solveR2ForVout } from '@/lib/calculators/voltageDivider'
import { adcCountsToVolts, voltsToAdcCounts } from '@/lib/calculators/adc'
import { calculatePwmDuty, mapToPwmByte } from '@/lib/calculators/pwm'
import { convertNumberBase } from '@/lib/calculators/numberBase'
import { decodeResistorColors, formatOhms } from '@/lib/calculators/resistorColorCode'

describe('calculateOhmsLaw', () => {
  it('solves for voltage', () => {
    const result = calculateOhmsLaw({ solveFor: 'voltage', current: 0.02, resistance: 220 })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.voltage).toBeCloseTo(4.4)
  })

  it('rejects zero resistance when solving current', () => {
    expect(calculateOhmsLaw({ solveFor: 'current', voltage: 5, resistance: 0 }).ok).toBe(false)
  })

  it('rejects negative values', () => {
    expect(calculateOhmsLaw({ solveFor: 'voltage', current: -1, resistance: 10 }).ok).toBe(false)
  })
})

describe('calculateLedResistor', () => {
  it('computes series resistance for a typical red LED', () => {
    const result = calculateLedResistor({
      supplyVoltage: 5,
      forwardVoltage: 2,
      forwardCurrentAmps: 0.01,
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.resistanceOhms).toBeCloseTo(300)
      expect(result.value.preferredE24Ohms).toBeGreaterThanOrEqual(300)
    }
  })

  it('rejects Vf >= supply', () => {
    expect(
      calculateLedResistor({ supplyVoltage: 3.3, forwardVoltage: 3.3, forwardCurrentAmps: 0.01 }).ok,
    ).toBe(false)
  })

  it('rejects zero/negative current', () => {
    expect(
      calculateLedResistor({ supplyVoltage: 5, forwardVoltage: 2, forwardCurrentAmps: 0 }).ok,
    ).toBe(false)
  })
})

describe('voltage divider', () => {
  it('halves voltage for equal resistors', () => {
    const result = calculateVoltageDivider({ vin: 5, r1: 10_000, r2: 10_000 })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.vout).toBeCloseTo(2.5)
  })

  it('rejects both resistors zero', () => {
    expect(calculateVoltageDivider({ vin: 5, r1: 0, r2: 0 }).ok).toBe(false)
  })

  it('solves R2 for target Vout', () => {
    const result = solveR2ForVout(5, 10_000, 2.5)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBeCloseTo(10_000)
  })

  it('rejects Vout >= Vin when solving R2', () => {
    expect(solveR2ForVout(5, 1000, 5).ok).toBe(false)
  })
})

describe('ADC', () => {
  it('converts mid-scale 10-bit count', () => {
    const result = adcCountsToVolts({ counts: 512, bits: 10, vref: 5 })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.volts).toBeCloseTo((512 / 1023) * 5)
  })

  it('rejects out-of-range counts', () => {
    expect(adcCountsToVolts({ counts: 2000, bits: 10, vref: 5 }).ok).toBe(false)
  })

  it('rejects zero Vref', () => {
    expect(adcCountsToVolts({ counts: 0, bits: 10, vref: 0 }).ok).toBe(false)
  })

  it('maps volts back to counts', () => {
    const result = voltsToAdcCounts(2.5, 10, 5)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.counts).toBe(512)
  })
})

describe('PWM', () => {
  it('computes 25% duty', () => {
    const result = calculatePwmDuty({ highTimeSeconds: 0.001, periodSeconds: 0.004, supplyVoltage: 5 })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.dutyPercent).toBeCloseTo(25)
      expect(result.value.averageVoltage).toBeCloseTo(1.25)
    }
  })

  it('rejects high time above period', () => {
    expect(calculatePwmDuty({ highTimeSeconds: 2, periodSeconds: 1 }).ok).toBe(false)
  })

  it('rejects zero period', () => {
    expect(calculatePwmDuty({ highTimeSeconds: 0, periodSeconds: 0 }).ok).toBe(false)
  })

  it('maps ADC span into PWM byte', () => {
    const result = mapToPwmByte(512, 0, 1023)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe(128)
  })

  it('rejects zero-width map range', () => {
    expect(mapToPwmByte(1, 5, 5).ok).toBe(false)
  })
})

describe('number base', () => {
  it('converts hex', () => {
    const result = convertNumberBase('0xFF', 'hex')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.decimal).toBe(255)
      expect(result.value.binary).toBe('11111111')
    }
  })

  it('converts binary', () => {
    const result = convertNumberBase('0b1010', 'bin')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.decimal).toBe(10)
  })

  it('rejects invalid binary', () => {
    expect(convertNumberBase('102', 'bin').ok).toBe(false)
  })

  it('rejects empty input', () => {
    expect(convertNumberBase('  ', 'dec').ok).toBe(false)
  })

  it('rejects negatives', () => {
    expect(convertNumberBase('-3', 'dec').ok).toBe(false)
  })
})

describe('resistor color code', () => {
  it('decodes a 220Ω 5% resistor', () => {
    const result = decodeResistorColors({
      band1: 'red',
      band2: 'red',
      multiplier: 'brown',
      tolerance: 'gold',
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.ohms).toBe(220)
      expect(result.value.tolerancePercent).toBe(5)
      expect(result.value.display).toBe('220 Ω')
    }
  })

  it('formats kilo-ohms', () => {
    expect(formatOhms(10_000)).toBe('10 kΩ')
  })
})
