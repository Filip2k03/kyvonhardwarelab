export type MaoBridgeMode = 'SIMULATION' | 'CONNECTED'

export interface MaoTelemetrySample {
  readonly state: string
  readonly tempC?: number
  readonly humPct?: number
  readonly light?: number
  readonly sound?: 0 | 1
  readonly headDeg?: number
  readonly uptimeMs?: number
}

const LINE = /^MAO\/(\d+)\s+([A-Z]+)(?:\s+(.*))?$/

export function parseMaoLine(raw: string): { ok: true; major: number; verb: string; rest: string } | { ok: false; reason: string } {
  const trimmed = raw.trim()
  if (!trimmed) return { ok: false, reason: 'empty' }
  const match = LINE.exec(trimmed)
  if (!match) return { ok: false, reason: 'framing' }
  const major = Number(match[1])
  if (major !== 1) return { ok: false, reason: 'unsupported major' }
  return { ok: true, major, verb: match[2]!, rest: match[3] ?? '' }
}

export function applyTelemetryVerb(
  sample: MaoTelemetrySample,
  verb: string,
  rest: string,
): MaoTelemetrySample {
  switch (verb) {
    case 'STATE':
      return { ...sample, state: rest.trim() || sample.state }
    case 'TEMP':
      return { ...sample, tempC: Number.parseFloat(rest) }
    case 'HUM':
      return { ...sample, humPct: Number.parseFloat(rest) }
    case 'LIGHT':
      return { ...sample, light: Number.parseInt(rest, 10) }
    case 'SOUND':
      return { ...sample, sound: rest.trim() === '1' ? 1 : 0 }
    case 'HEAD':
      return { ...sample, headDeg: Number.parseInt(rest, 10) }
    case 'HEARTBEAT': {
      const m = /uptime_ms=(\d+)/.exec(rest)
      const value = m?.[1]
      if (!value) return sample
      return { ...sample, uptimeMs: Number.parseInt(value, 10) }
    }
    default:
      return sample
  }
}

/** Browser has no USB serial in v0.1 — always simulation unless a future bridge sets CONNECTED. */
export function currentBridgeMode(): MaoBridgeMode {
  return 'SIMULATION'
}
