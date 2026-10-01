import { Link } from 'react-router-dom'
import { LabPanel } from '@/components/ui/LabPanel'
import { findMaoPart } from '@/features/maoLab/data/components'
import { DEMO_CIRCUIT_WIRES } from '@/features/maoLab/data/demoCircuit'
import { assignmentsForPin } from '@/features/maoLab/domain/pinRegistry'
import { cn } from '@/lib/cn'

interface Props {
  readonly selectedId: string | null
}

export function MaoInspectorPanel({ selectedId }: Props) {
  if (!selectedId) {
    return (
      <LabPanel>
        <h2 className="text-sm font-semibold">Inspector</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Select a part or wire in the 3D workbench. Keyboard: use the component list.
        </p>
      </LabPanel>
    )
  }

  const wire = DEMO_CIRCUIT_WIRES.find((item) => item.id === selectedId)
  if (wire) {
    return (
      <LabPanel className="space-y-2">
        <p className="font-mono-tech text-[10px] tracking-wide text-[var(--color-accent)] uppercase">
          Wire · {wire.kind} · {wire.status}
        </p>
        <h2 className="text-sm font-semibold">{wire.id}</h2>
        <dl className="space-y-1 text-xs text-[var(--color-text-muted)]">
          <div>
            <dt className="font-medium text-[var(--color-text)]">From</dt>
            <dd>
              {wire.from.label} ({wire.from.partId})
            </dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--color-text)]">To</dt>
            <dd>
              {wire.to.label} ({wire.to.partId})
            </dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--color-text)]">Purpose</dt>
            <dd>{wire.purpose}</dd>
          </div>
        </dl>
      </LabPanel>
    )
  }

  const part = findMaoPart(selectedId)
  if (!part) {
    return (
      <LabPanel>
        <p className="text-sm text-[var(--color-text-muted)]">Unknown selection: {selectedId}</p>
      </LabPanel>
    )
  }

  return (
    <LabPanel className="space-y-3">
      <div>
        <p className="font-mono-tech text-[10px] tracking-wide text-[var(--color-accent)] uppercase">
          {part.category} · {part.verified ? 'verified' : 'UNVERIFIED'}
        </p>
        <h2 className="text-sm font-semibold">{part.name}</h2>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">{part.description}</p>
      </div>

      {!part.verified ? (
        <p className="rounded-[var(--radius-sm)] border border-[var(--color-warning)] bg-[var(--color-surface-raised)] p-2 text-xs text-[var(--color-warning)]">
          UNVERIFIED HARDWARE — Physical pinout must be verified before connection.
        </p>
      ) : null}

      <div>
        <h3 className="text-[10px] font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Pins
        </h3>
        <ul className="mt-1 space-y-1">
          {part.pins.map((pin) => (
            <li
              key={pin.id}
              className={cn(
                'rounded-[var(--radius-sm)] border border-[var(--color-border)] p-2 text-xs',
                !pin.verified && 'border-[var(--color-warning)]',
              )}
            >
              <p className="font-medium">
                {pin.label}{' '}
                <span className="font-mono-tech text-[10px] text-[var(--color-text-muted)]">
                  {pin.type}
                </span>
              </p>
              <p className="mt-0.5 text-[var(--color-text-muted)]">{pin.purpose}</p>
              {pin.warnings?.map((warning) => (
                <p key={warning} className="mt-1 text-[var(--color-warning)]">
                  {warning}
                </p>
              ))}
            </li>
          ))}
        </ul>
      </div>

      {part.id === 'uno' ? (
        <div>
          <h3 className="text-[10px] font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            Registry (D8)
          </h3>
          <ul className="mt-1 text-xs text-[var(--color-text-muted)]">
            {assignmentsForPin('D8').map((item) => (
              <li key={`${item.pin}-${item.signal}`}>
                {item.pin}: {item.signal} [{item.status}]
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {part.catalogSlug ? (
        <Link
          to={`/components/${part.catalogSlug}`}
          className="inline-flex text-xs text-[var(--color-accent)] hover:underline"
        >
          Open kit catalog sheet
        </Link>
      ) : null}

      {part.warnings.length > 0 ? (
        <ul className="space-y-1 text-xs text-[var(--color-warning)]">
          {part.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}
    </LabPanel>
  )
}
