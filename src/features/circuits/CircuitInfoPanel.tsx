import type { CircuitDefinition } from '@/types/circuit'
import type { CircuitSelection } from '@/features/circuits/CircuitSvg'
import { SIGNAL_STYLES } from '@/lib/circuits/signalStyles'
import { analyzeCircuitWarnings, findComponent, findPin } from '@/lib/circuits/geometry'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface CircuitInfoPanelProps {
  readonly circuit: CircuitDefinition
  readonly selection: CircuitSelection
}

export function CircuitInfoPanel({ circuit, selection }: CircuitInfoPanelProps) {
  const warnings = analyzeCircuitWarnings(circuit)

  let detail: ReactNode = (
    <p className="text-sm text-[var(--color-text-muted)]">
      Hover a wire to highlight endpoints. Click a wire or pin for details. Colors are paired with
      labels and stroke patterns — electrical meaning never depends on color alone.
    </p>
  )

  if (selection?.kind === 'wire') {
    const connection = circuit.connections.find((item) => item.id === selection.connectionId)
    if (connection) {
      const style = SIGNAL_STYLES[connection.signalType]
      detail = (
        <div className="space-y-2 text-sm">
          <p className="font-mono-tech text-xs text-[var(--color-accent)]">
            {style.label} · {style.patternDescription}
          </p>
          <p>{connection.description}</p>
          {connection.expectedVoltage ? (
            <p>
              Expected: <span className="font-mono-tech">{connection.expectedVoltage}</span>
            </p>
          ) : null}
          <p className="text-xs text-[var(--color-text-muted)]">
            {connection.fromComponent}.{connection.fromPin} → {connection.toComponent}.
            {connection.toPin}
          </p>
        </div>
      )
    }
  }

  if (selection?.kind === 'pin') {
    const component = findComponent(circuit, selection.componentId)
    const pin = component ? findPin(component, selection.pinId) : undefined
    if (component && pin) {
      const style = SIGNAL_STYLES[pin.type]
      detail = (
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">Component</dt>
            <dd>{component.label}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">Pin</dt>
            <dd className="font-mono-tech">{pin.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">Signal type</dt>
            <dd className="font-mono-tech">
              {style.label} ({style.patternDescription})
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">Expected voltage</dt>
            <dd className="font-mono-tech">{pin.expectedVoltage ?? '—'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-[var(--color-text-muted)]">Purpose</dt>
            <dd>{pin.purpose}</dd>
          </div>
        </dl>
      )
    }
  }

  return (
    <aside className="space-y-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div>
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Selection
        </h2>
        <div className="mt-2">{detail}</div>
      </div>

      <div>
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Educational warnings
        </h2>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Heuristics only — not an electrical simulator.
        </p>
        <ul className="mt-2 space-y-2">
          {warnings.map((warning) => (
            <li
              key={warning.id}
              className={
                warning.severity === 'danger'
                  ? 'rounded-[var(--radius-sm)] border border-[var(--color-danger)]/40 px-3 py-2 text-sm text-[var(--color-danger)]'
                  : warning.severity === 'warning'
                    ? 'rounded-[var(--radius-sm)] border border-[var(--color-warning)]/40 px-3 py-2 text-sm text-[var(--color-warning)]'
                    : 'rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2 text-sm'
              }
            >
              {warning.message}
            </li>
          ))}
        </ul>
      </div>

      {circuit.relatedHardwareSlugs && circuit.relatedHardwareSlugs.length > 0 ? (
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            Hardware
          </h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {circuit.relatedHardwareSlugs.map((slug) => (
              <li key={slug}>
                <Link
                  to={`/components/${slug}`}
                  className="inline-flex min-h-11 items-center rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 font-mono-tech text-xs text-[var(--color-accent)]"
                >
                  {slug}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {circuit.relatedLessonSlugs && circuit.relatedLessonSlugs.length > 0 ? (
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            Lessons
          </h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {circuit.relatedLessonSlugs.map((slug) => (
              <li key={slug}>
                <Link
                  to={`/learn/${slug}`}
                  className="inline-flex min-h-11 items-center rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 font-mono-tech text-xs text-[var(--color-accent)]"
                >
                  {slug}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  )
}
