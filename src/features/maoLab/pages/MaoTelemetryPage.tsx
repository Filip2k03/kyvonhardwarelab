import { useMemo, useState } from 'react'
import { LabPanel, SectionTitle } from '@/components/ui/LabPanel'
import {
  applyTelemetryVerb,
  currentBridgeMode,
  parseMaoLine,
  type MaoTelemetrySample,
} from '@/features/maoLab/domain/protocol'

const SEED: MaoTelemetrySample = {
  state: 'IDLE',
  tempC: 28.4,
  humPct: 70,
  light: 530,
  sound: 0,
  headDeg: 90,
  uptimeMs: 12000,
}

export function MaoTelemetryPage() {
  const mode = currentBridgeMode()
  const [sample, setSample] = useState<MaoTelemetrySample>(SEED)
  const [line, setLine] = useState('MAO/1 STATE LISTENING')
  const [log, setLog] = useState<string[]>([])

  const parsed = useMemo(() => parseMaoLine(line), [line])

  function apply() {
    const result = parseMaoLine(line)
    if (!result.ok) {
      setLog((prev) => [`REJECT ${result.reason}: ${line}`, ...prev].slice(0, 8))
      return
    }
    setSample((prev) => applyTelemetryVerb(prev, result.verb, result.rest))
    setLog((prev) => [`OK ${result.verb} ${result.rest}`, ...prev].slice(0, 8))
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <LabPanel className="space-y-3">
        <SectionTitle>Live sample ({mode})</SectionTitle>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">STATE</dt>
            <dd className="font-mono-tech">{sample.state}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">HEAD</dt>
            <dd className="font-mono-tech">{sample.headDeg ?? '—'}°</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">TEMP</dt>
            <dd className="font-mono-tech">{sample.tempC ?? '—'} °C</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">HUM</dt>
            <dd className="font-mono-tech">{sample.humPct ?? '—'} %</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">LIGHT</dt>
            <dd className="font-mono-tech">{sample.light ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">SOUND</dt>
            <dd className="font-mono-tech">{sample.sound ?? '—'}</dd>
          </div>
        </dl>
        <p className="text-xs text-[var(--color-text-muted)]">
          Values are simulated until a Mac bridge streams real MAO/1 lines.
        </p>
      </LabPanel>

      <LabPanel className="space-y-3">
        <SectionTitle>Protocol sandbox</SectionTitle>
        <input
          value={line}
          onChange={(event) => setLine(event.target.value)}
          className="min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-mono-tech text-xs"
        />
        <p className="font-mono-tech text-[10px] text-[var(--color-text-muted)]">
          parse: {parsed.ok ? `OK ${parsed.verb}` : `FAIL ${parsed.reason}`}
        </p>
        <button type="button" className="lab-btn-primary" onClick={apply}>
          Apply line
        </button>
        <ul className="space-y-1 text-xs text-[var(--color-text-muted)]">
          {log.map((item) => (
            <li key={item} className="font-mono-tech">
              {item}
            </li>
          ))}
        </ul>
      </LabPanel>
    </div>
  )
}
