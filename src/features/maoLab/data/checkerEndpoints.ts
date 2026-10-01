import type { ConnectionEndpoint, WireKind } from '@/features/maoLab/domain/types'

/** Curated endpoints for the educational connection checker (not every kit pin). */
export const CHECKER_ENDPOINTS: readonly ConnectionEndpoint[] = [
  { partId: 'uno', pinId: '5v', label: 'Uno 5V' },
  { partId: 'uno', pinId: 'gnd', label: 'Uno GND' },
  { partId: 'uno', pinId: 'd8', label: 'Uno D8' },
  { partId: 'uno', pinId: 'd9', label: 'Uno D9 (GPIO/PWM)' },
  { partId: 'breadboard', pinId: 'rail-plus', label: '+ RED rail' },
  { partId: 'breadboard', pinId: 'rail-minus', label: '− BLUE rail' },
  { partId: 'resistor-220', pinId: 'a', label: '220 Ω lead A' },
  { partId: 'resistor-220', pinId: 'b', label: '220 Ω lead B' },
  { partId: 'led-red', pinId: 'anode', label: 'LED anode' },
  { partId: 'led-red', pinId: 'cathode', label: 'LED cathode' },
  { partId: 'sg90', pinId: 'vcc', label: 'SG90 VCC (servo power)' },
  { partId: 'sg90', pinId: 'sig', label: 'SG90 signal (orange)' },
  { partId: 'matrix-8x8-raw', pinId: 'unknown', label: 'Raw 8×8 matrix (unknown)' },
  { partId: 'salvaged-lcd', pinId: 'unknown', label: 'Salvaged LCD (unknown)' },
] as const

export function endpointKey(endpoint: ConnectionEndpoint): string {
  return `${endpoint.partId}:${endpoint.pinId}`
}

export function findCheckerEndpoint(key: string): ConnectionEndpoint | undefined {
  return CHECKER_ENDPOINTS.find((endpoint) => endpointKey(endpoint) === key)
}

export function guessWireKind(from: ConnectionEndpoint, to: ConnectionEndpoint): WireKind {
  const blob = `${from.label} ${to.label}`.toLowerCase()
  if (/\bgnd\b|ground|blue −|blue -/.test(blob)) return 'ground'
  if (/\b5v\b|vcc|\+ red|power/.test(blob)) return 'power'
  return 'signal'
}
