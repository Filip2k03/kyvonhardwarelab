import type { FaceExpression, MaoExpressionId } from '@/features/maoLab/domain/types'

/** Compact 8×8 bitmaps — software simulator only (no physical driver). */
export const MAO_EXPRESSIONS: readonly FaceExpression[] = [
  {
    id: 'neutral',
    label: 'Neutral',
    rows: [0b00000000, 0b01100110, 0b01100110, 0b00000000, 0b00000000, 0b01111110, 0b00000000, 0b00000000],
  },
  {
    id: 'blink',
    label: 'Blink',
    rows: [0b00000000, 0b00000000, 0b01100110, 0b00000000, 0b00000000, 0b01111110, 0b00000000, 0b00000000],
  },
  {
    id: 'happy',
    label: 'Happy',
    rows: [0b00000000, 0b01100110, 0b01100110, 0b00000000, 0b01000010, 0b00111100, 0b00000000, 0b00000000],
  },
  {
    id: 'sad',
    label: 'Sad',
    rows: [0b00000000, 0b01100110, 0b01100110, 0b00000000, 0b00111100, 0b01000010, 0b00000000, 0b00000000],
  },
  {
    id: 'angry',
    label: 'Angry',
    rows: [0b01000010, 0b00100100, 0b01100110, 0b00000000, 0b00111100, 0b01000010, 0b00000000, 0b00000000],
  },
  {
    id: 'surprised',
    label: 'Surprised',
    rows: [0b00000000, 0b01100110, 0b01100110, 0b00000000, 0b00111100, 0b00100100, 0b00111100, 0b00000000],
  },
  {
    id: 'listening',
    label: 'Listening',
    rows: [0b00000000, 0b00100100, 0b01100110, 0b01100110, 0b00000000, 0b00111100, 0b00000000, 0b00000000],
  },
  {
    id: 'thinking',
    label: 'Thinking',
    rows: [0b00000000, 0b01100110, 0b00000000, 0b00000000, 0b00011000, 0b00011000, 0b00000000, 0b00010000],
  },
  {
    id: 'speaking',
    label: 'Speaking',
    rows: [0b00000000, 0b01100110, 0b01100110, 0b00000000, 0b00111100, 0b00111100, 0b00011000, 0b00000000],
  },
  {
    id: 'sleeping',
    label: 'Sleeping',
    rows: [0b00000000, 0b00000000, 0b01100110, 0b00000000, 0b00000000, 0b00111100, 0b00000000, 0b00000000],
  },
  {
    id: 'love',
    label: 'Love',
    rows: [0b00000000, 0b01100110, 0b11111111, 0b11111111, 0b01111110, 0b00111100, 0b00011000, 0b00000000],
  },
  {
    id: 'error',
    label: 'Error',
    rows: [0b10000001, 0b01000010, 0b00100100, 0b00011000, 0b00011000, 0b00100100, 0b01000010, 0b10000001],
  },
] as const

export function getExpression(id: MaoExpressionId): FaceExpression {
  return MAO_EXPRESSIONS.find((item) => item.id === id) ?? MAO_EXPRESSIONS[0]!
}

export function pixelOn(rows: readonly number[], row: number, col: number): boolean {
  const line = rows[row] ?? 0
  return ((line >> (7 - col)) & 1) === 1
}

export function togglePixel(rows: readonly number[], row: number, col: number): number[] {
  const next = [...rows]
  const bit = 1 << (7 - col)
  next[row] = (next[row] ?? 0) ^ bit
  return next
}
