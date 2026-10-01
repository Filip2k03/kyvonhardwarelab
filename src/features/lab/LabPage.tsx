import { Link } from 'react-router-dom'
import { listCircuits } from '@/data/circuits'

export function LabPage() {
  const circuits = listCircuits()

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Lab</h1>
        <p className="max-w-2xl text-sm text-[var(--color-text-muted)]">
          Educational wiring diagrams for kit experiments. This is not a SPICE simulator — use it to
          inspect connections, pins, and safety heuristics before building on a breadboard.
        </p>
      </header>

      <section className="space-y-3" aria-labelledby="circuits-heading">
        <h2
          id="circuits-heading"
          className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase"
        >
          Circuit diagrams
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {circuits.map((circuit) => (
            <li key={circuit.id}>
              <Link
                to={`/lab/circuits/${circuit.slug}`}
                className="block rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:border-[var(--color-border-strong)]"
              >
                <h3 className="text-sm font-semibold">{circuit.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-[var(--color-text-muted)]">
                  {circuit.description}
                </p>
                <p className="mt-3 font-mono-tech text-xs text-[var(--color-accent)]">
                  {circuit.connections.length} connections · {circuit.components.length} nodes
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] p-4 text-sm text-[var(--color-text-muted)]">
        <p>
          3D inspection lives at{' '}
          <Link to="/lab/3d" className="text-[var(--color-accent)] hover:underline">
            /lab/3d
          </Link>{' '}
          (Phase 06). Calculators are under Tools.
        </p>
      </section>
    </div>
  )
}
