import { Link } from 'react-router-dom'
import { listCircuits } from '@/data/circuits'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionTitle } from '@/components/ui/LabPanel'

export function LabPage() {
  const circuits = listCircuits()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workbench"
        title="Workbench"
        description="Educational wiring diagrams for kit experiments. This is not a SPICE simulator — use it to inspect connections, pins, and safety heuristics before building on a breadboard."
      />

      <section className="space-y-3" aria-labelledby="circuits-heading">
        <SectionTitle id="circuits-heading">Circuit diagrams</SectionTitle>
        <ul className="grid gap-3 sm:grid-cols-2">
          {circuits.map((circuit) => (
            <li key={circuit.id}>
              <Link to={`/lab/circuits/${circuit.slug}`} className="lab-row block p-4">
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

      <section className="border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/60 p-4 text-sm text-[var(--color-text-muted)]">
        <p>
          3D inspection lives at{' '}
          <Link to="/lab/3d" className="text-[var(--color-accent)] hover:underline">
            /lab/3d
          </Link>
          . Calculators are under Tools.
        </p>
      </section>
    </div>
  )
}
