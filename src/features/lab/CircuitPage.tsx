import { Link, useParams } from 'react-router-dom'
import { findCircuitBySlug } from '@/data/circuits'
import { CircuitViewer } from '@/features/circuits/CircuitViewer'
import { EmptyState } from '@/components/ui/EmptyState'
import { ListenButton } from '@/components/audio/ListenButton'
import { narrateCircuit } from '@/lib/audio/buildNarration'

export function CircuitPage() {
  const { slug } = useParams<{ slug: string }>()
  const circuit = slug ? findCircuitBySlug(slug) : undefined

  if (!circuit) {
    return (
      <EmptyState
        title="Circuit not found"
        description={`No diagram matches “${slug ?? 'unknown'}”. Return to the lab circuit list.`}
      />
    )
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs text-[var(--color-text-muted)]">
          <Link to="/lab" className="text-[var(--color-accent)] hover:underline">
            Lab
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="font-mono-tech">{circuit.slug}</span>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{circuit.title}</h1>
        <p className="max-w-3xl text-sm text-[var(--color-text-muted)]">{circuit.description}</p>
        <ListenButton
          id={`circuit:${circuit.id}`}
          title={circuit.title}
          text={narrateCircuit(circuit)}
        />
      </header>

      <CircuitViewer circuit={circuit} />
    </div>
  )
}
