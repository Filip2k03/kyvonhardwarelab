import { useMemo, useState } from 'react'
import { LabPanel } from '@/components/ui/LabPanel'
import { EXTERNAL_LED_CODE, type LedSimMode } from '@/features/maoLab/data/demoCircuit'
import { listMaoParts } from '@/features/maoLab/data/components'
import { DEMO_CIRCUIT_WIRES } from '@/features/maoLab/data/demoCircuit'
import { validateConnection } from '@/features/maoLab/domain/validation'
import type { ProposedConnection, WireKind } from '@/features/maoLab/domain/types'
import { MaoInspectorPanel } from '@/features/maoLab/components/MaoInspectorPanel'
import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

interface WorkbenchChromeProps {
  readonly selectedId: string | null
  readonly onSelect: (id: string) => void
  readonly ledMode: LedSimMode
  readonly onLedMode: (mode: LedSimMode) => void
  readonly exploded: boolean
  readonly onExploded: (value: boolean) => void
  readonly view: 'orbit' | 'top' | 'front' | 'side' | 'iso'
  readonly onView: (view: 'orbit' | 'top' | 'front' | 'side' | 'iso') => void
  readonly onResetCamera: () => void
  readonly canvas: ReactNode
}

export function WorkbenchChrome({
  selectedId,
  onSelect,
  ledMode,
  onLedMode,
  exploded,
  onExploded,
  view,
  onView,
  onResetCamera,
  canvas,
}: WorkbenchChromeProps) {
  const parts = useMemo(() => listMaoParts(), [])
  const [connectFrom, setConnectFrom] = useState<string>('')
  const [connectTo, setConnectTo] = useState<string>('')
  const [kind, setKind] = useState<WireKind>('signal')
  const [validationMsg, setValidationMsg] = useState<string | null>(null)
  const [codeView, setCodeView] = useState<'beginner' | 'engineering'>('beginner')

  function runValidate() {
    const [fromPart, fromPin] = connectFrom.split(':')
    const [toPart, toPin] = connectTo.split(':')
    if (!fromPart || !fromPin || !toPart || !toPin) {
      setValidationMsg('Pick both endpoints.')
      return
    }
    const proposal: ProposedConnection = {
      from: { partId: fromPart, pinId: fromPin, label: fromPin },
      to: { partId: toPart, pinId: toPin, label: toPin },
      kind,
      purpose: 'Manual connect-mode check',
    }
    const result = validateConnection(proposal)
    setValidationMsg(`${result.result}: ${result.title} — ${result.detail}`)
  }

  const endpoints = [
    'uno:5v',
    'uno:gnd',
    'uno:d8',
    'breadboard:rail-plus',
    'breadboard:rail-minus',
    'resistor-220:a',
    'resistor-220:b',
    'led-red:anode',
    'led-red:cathode',
    'matrix-8x8-raw:unknown',
    'salvaged-lcd:unknown',
  ]

  return (
    <div className="grid gap-3 lg:grid-cols-[14rem_minmax(0,1fr)_17rem]">
      <LabPanel className="max-h-[70vh] space-y-2 overflow-y-auto">
        <h2 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Components
        </h2>
        <ul className="space-y-1">
          {parts.map((part) => (
            <li key={part.id}>
              <button
                type="button"
                onClick={() => onSelect(part.id)}
                className={cn(
                  'flex min-h-11 w-full flex-col rounded-[var(--radius-sm)] px-2 py-2 text-left text-xs',
                  selectedId === part.id
                    ? 'bg-[var(--color-surface-raised)] ring-1 ring-[var(--color-accent)]'
                    : 'hover:bg-[var(--color-surface-raised)]',
                )}
              >
                <span className="font-medium">{part.name}</span>
                <span className="font-mono-tech text-[10px] text-[var(--color-text-muted)]">
                  {part.verified ? 'verified' : 'UNVERIFIED'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </LabPanel>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {(['orbit', 'top', 'front', 'side', 'iso'] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={cn(
                'min-h-11 rounded-[var(--radius-sm)] border px-3 text-xs',
                view === item
                  ? 'border-[var(--color-accent)] text-[var(--color-accent-strong)]'
                  : 'border-[var(--color-border)]',
              )}
              onClick={() => onView(item)}
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 text-xs"
            onClick={onResetCamera}
          >
            Reset camera
          </button>
          <button
            type="button"
            className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 text-xs"
            onClick={() => onExploded(!exploded)}
          >
            {exploded ? 'Assembled' : 'Exploded'}
          </button>
        </div>

        {canvas}

        <LabPanel className="space-y-2">
          <h2 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            D8 LED simulation
          </h2>
          <div className="flex flex-wrap gap-2">
            {(['off', 'on', 'blink'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                className={cn(
                  'min-h-11 rounded-[var(--radius-sm)] border px-3 text-xs uppercase',
                  ledMode === mode
                    ? 'border-[var(--color-accent)] text-[var(--color-accent-strong)]'
                    : 'border-[var(--color-border)]',
                )}
                onClick={() => onLedMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            Animation is a logical signal preview — not electron-motion physics.
          </p>
        </LabPanel>

        <LabPanel className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={cn(
                'min-h-11 rounded-[var(--radius-sm)] border px-3 text-xs',
                codeView === 'beginner' && 'border-[var(--color-accent)]',
              )}
              onClick={() => setCodeView('beginner')}
            >
              Beginner view
            </button>
            <button
              type="button"
              className={cn(
                'min-h-11 rounded-[var(--radius-sm)] border px-3 text-xs',
                codeView === 'engineering' && 'border-[var(--color-accent)]',
              )}
              onClick={() => setCodeView('engineering')}
            >
              Engineering view
            </button>
          </div>
          <pre className="overflow-x-auto rounded-[var(--radius-sm)] bg-[var(--color-surface-raised)] p-3 font-mono-tech text-[11px] whitespace-pre-wrap">
            {EXTERNAL_LED_CODE[codeView]}
          </pre>
        </LabPanel>
      </div>

      <div className="space-y-3">
        <MaoInspectorPanel selectedId={selectedId} />

        <LabPanel className="space-y-2">
          <h2 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            Connect mode
          </h2>
          <label className="block text-xs">
            From
            <select
              className="mt-1 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2"
              value={connectFrom}
              onChange={(event) => setConnectFrom(event.target.value)}
            >
              <option value="">Select</option>
              {endpoints.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs">
            To
            <select
              className="mt-1 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2"
              value={connectTo}
              onChange={(event) => setConnectTo(event.target.value)}
            >
              <option value="">Select</option>
              {endpoints.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs">
            Kind
            <select
              className="mt-1 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2"
              value={kind}
              onChange={(event) => setKind(event.target.value as WireKind)}
            >
              <option value="power">power</option>
              <option value="ground">ground</option>
              <option value="signal">signal</option>
              <option value="analog">analog</option>
              <option value="data">data</option>
            </select>
          </label>
          <button type="button" className="lab-btn-primary w-full" onClick={runValidate}>
            Validate connection
          </button>
          {validationMsg ? (
            <p className="text-xs text-[var(--color-text-muted)]">{validationMsg}</p>
          ) : null}
          <p className="text-[10px] text-[var(--color-text-muted)]">
            Demo wires on bench: {DEMO_CIRCUIT_WIRES.map((w) => w.id).join(', ')}
          </p>
        </LabPanel>
      </div>
    </div>
  )
}
