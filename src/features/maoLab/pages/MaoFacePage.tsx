import { useEffect, useState } from 'react'
import { LabPanel, SectionTitle } from '@/components/ui/LabPanel'
import {
  getExpression,
  MAO_EXPRESSIONS,
  pixelOn,
  togglePixel,
} from '@/features/maoLab/data/expressions'
import type { MaoExpressionId, MaoRobotState } from '@/features/maoLab/domain/types'
import { cn } from '@/lib/cn'

const STATES: readonly MaoRobotState[] = [
  'BOOTING',
  'IDLE',
  'LISTENING',
  'THINKING',
  'SPEAKING',
  'HAPPY',
  'ALERT',
  'SLEEPING',
  'ERROR',
]

const STATE_FACE: Partial<Record<MaoRobotState, MaoExpressionId>> = {
  BOOTING: 'surprised',
  IDLE: 'neutral',
  LISTENING: 'listening',
  THINKING: 'thinking',
  SPEAKING: 'speaking',
  HAPPY: 'happy',
  ALERT: 'angry',
  SLEEPING: 'sleeping',
  ERROR: 'error',
}

export function MaoFacePage() {
  const [expressionId, setExpressionId] = useState<MaoExpressionId>('neutral')
  const [rows, setRows] = useState(() => [...getExpression('neutral').rows])
  const [playing, setPlaying] = useState(false)
  const [fps, setFps] = useState(4)
  const [robotState, setRobotState] = useState<MaoRobotState>('IDLE')
  const [frame, setFrame] = useState(0)

  function selectExpression(id: MaoExpressionId) {
    setExpressionId(id)
    setRows([...getExpression(id).rows])
  }

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setFrame((value) => value + 1)
      setExpressionId((current) => {
        const next = current === 'blink' ? 'neutral' : 'blink'
        setRows([...getExpression(next).rows])
        return next
      })
    }, Math.max(100, Math.round(1000 / fps)))
    return () => window.clearInterval(id)
  }, [playing, fps])

  function applyState(state: MaoRobotState) {
    setRobotState(state)
    const face = STATE_FACE[state]
    if (face) selectExpression(face)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <LabPanel className="space-y-4">
        <div>
          <SectionTitle>Virtual 8×8 face simulator</SectionTitle>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Software-only. No physical matrix driver. Pinout remains UNVERIFIED — do not assume MAX7219.
          </p>
        </div>

        <div
          className="mx-auto grid w-max grid-cols-8 gap-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[#0f172a] p-3"
          role="grid"
          aria-label="8 by 8 LED face editor"
        >
          {Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) => {
              const on = pixelOn(rows, row, col)
              return (
                <button
                  key={`${row}-${col}`}
                  type="button"
                  role="gridcell"
                  aria-label={`Pixel ${row},${col} ${on ? 'on' : 'off'}`}
                  aria-pressed={on}
                  className={cn(
                    'h-8 w-8 rounded-sm border border-white/10',
                    on ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'bg-slate-800',
                  )}
                  onClick={() => setRows(togglePixel(rows, row, col))}
                />
              )
            }),
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {MAO_EXPRESSIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn(
                'min-h-11 rounded-[var(--radius-sm)] border px-3 text-xs',
                expressionId === item.id
                  ? 'border-[var(--color-accent)] text-[var(--color-accent-strong)]'
                  : 'border-[var(--color-border)]',
              )}
              onClick={() => selectExpression(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="lab-btn-primary" onClick={() => setPlaying((value) => !value)}>
            {playing ? 'Pause' : 'Play blink'}
          </button>
          <label className="text-xs text-[var(--color-text-muted)]">
            FPS
            <input
              type="range"
              min={1}
              max={12}
              value={fps}
              onChange={(event) => setFps(Number(event.target.value))}
              className="ml-2 align-middle"
            />{' '}
            {fps}
          </label>
          <span className="font-mono-tech text-[10px] text-[var(--color-text-muted)]">frame {frame}</span>
        </div>

        <pre className="overflow-x-auto rounded-[var(--radius-sm)] bg-[var(--color-surface-raised)] p-3 font-mono-tech text-[11px]">
          {`uint8_t face[8] = {\n${rows.map((row) => `  0b${row.toString(2).padStart(8, '0')}`).join(',\n')}\n};`}
        </pre>
      </LabPanel>

      <div className="space-y-3">
        <LabPanel className="space-y-2">
          <SectionTitle>System simulator</SectionTitle>
          <div className="flex flex-wrap gap-1">
            {STATES.map((state) => (
              <button
                key={state}
                type="button"
                className={cn(
                  'rounded-[var(--radius-sm)] border px-2 py-1 font-mono-tech text-[10px]',
                  robotState === state
                    ? 'border-[var(--color-accent)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-muted)]',
                )}
                onClick={() => applyState(state)}
              >
                {state}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            State drives virtual face + status cues only. No USB bridge in v0.1.
          </p>
        </LabPanel>

        <LabPanel>
          <p className="text-xs text-[var(--color-warning)]">
            UNVERIFIED HARDWARE: raw 8×8 matrix — Physical pinout must be verified before connection.
          </p>
        </LabPanel>
      </div>
    </div>
  )
}
