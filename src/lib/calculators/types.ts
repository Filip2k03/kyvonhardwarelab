export type CalcResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: string }

export function ok<T>(value: T): CalcResult<T> {
  return { ok: true, value }
}

export function err<T = never>(error: string): CalcResult<T> {
  return { ok: false, error }
}

export function isFiniteNumber(value: number): boolean {
  return typeof value === 'number' && Number.isFinite(value)
}
