import { err, ok, type CalcResult } from '@/lib/calculators/types'

export type NumberBase = 'bin' | 'dec' | 'hex'

export interface NumberBaseConversion {
  readonly decimal: number
  readonly binary: string
  readonly hex: string
}

function stripPrefix(raw: string, base: NumberBase): string {
  const trimmed = raw.trim().toLowerCase()
  if (base === 'bin') return trimmed.replace(/^0b/, '')
  if (base === 'hex') return trimmed.replace(/^0x/, '')
  return trimmed
}

export function convertNumberBase(raw: string, from: NumberBase): CalcResult<NumberBaseConversion> {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return err('Enter a value to convert.')
  }

  const cleaned = stripPrefix(raw, from)
  if (from === 'bin' && !/^[01]+$/.test(cleaned)) {
    return err('Binary values may only contain 0 and 1.')
  }
  if (from === 'dec' && !/^-?\d+$/.test(cleaned)) {
    return err('Decimal values must be integers.')
  }
  if (from === 'hex' && !/^[0-9a-f]+$/i.test(cleaned)) {
    return err('Hex values may only contain 0-9 and A-F.')
  }

  const radix = from === 'bin' ? 2 : from === 'hex' ? 16 : 10
  const decimal = Number.parseInt(cleaned, radix)
  if (!Number.isFinite(decimal)) {
    return err('Could not parse that value.')
  }
  if (decimal < 0) {
    return err('Only non-negative integers are supported.')
  }

  return ok({
    decimal,
    binary: decimal.toString(2),
    hex: decimal.toString(16).toUpperCase(),
  })
}
