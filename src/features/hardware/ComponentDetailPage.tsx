import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findHardwareBySlug } from '@/data/hardware'
import { DIFFICULTY_LABELS, HARDWARE_CATEGORY_LABELS } from '@/lib/hardware/labels'
import { PIN_TYPE_LABELS } from '@/lib/hardware/pinLabels'
import { EmptyState } from '@/components/ui/EmptyState'
import { ListenButton } from '@/components/audio/ListenButton'
import { narrateComponent } from '@/lib/audio/buildNarration'
import { useProgress } from '@/hooks/useProgress'

function RelatedList({
  title,
  items,
  basePath,
}: {
  readonly title: string
  readonly items: readonly string[]
  readonly basePath: string
}) {
  if (items.length === 0) {
    return (
      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          {title}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">None linked yet.</p>
      </section>
    )
  }

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
        {title}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {items.map((slug) => (
          <li key={slug}>
            <Link
              to={`${basePath}/${slug}`}
              className="inline-flex min-h-11 items-center rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 font-mono-tech text-xs text-[var(--color-accent)] hover:border-[var(--color-border-strong)]"
            >
              {slug}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ComponentDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const component = slug ? findHardwareBySlug(slug) : undefined
  const { recordComponentView } = useProgress()

  useEffect(() => {
    if (component) recordComponentView(component.id)
  }, [component, recordComponentView])

  if (!component) {
    return (
      <EmptyState
        title="Component not found"
        description={`No catalog entry matches “${slug ?? 'unknown'}”. Return to the components list and pick a kit part.`}
      />
    )
  }

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs text-[var(--color-text-muted)]">
          <Link to="/components" className="text-[var(--color-accent)] hover:underline">
            Components
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="font-mono-tech">{component.slug}</span>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{component.name}</h1>
        <p className="max-w-3xl text-sm text-[var(--color-text-muted)]">{component.description}</p>
        <ListenButton
          id={`component:${component.id}`}
          title={component.name}
          text={narrateComponent(component)}
        />
        <dl className="flex flex-wrap gap-3 text-xs">
          <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
            <dt className="text-[var(--color-text-muted)]">Category</dt>
            <dd className="font-medium">{HARDWARE_CATEGORY_LABELS[component.category]}</dd>
          </div>
          <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
            <dt className="text-[var(--color-text-muted)]">Difficulty</dt>
            <dd className="font-medium">{DIFFICULTY_LABELS[component.difficulty]}</dd>
          </div>
          <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
            <dt className="text-[var(--color-text-muted)]">Operating voltage</dt>
            <dd className="font-mono-tech font-medium">{component.operatingVoltage}</dd>
          </div>
          <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
            <dt className="text-[var(--color-text-muted)]">Logic voltage</dt>
            <dd className="font-mono-tech font-medium">{component.logicVoltage}</dd>
          </div>
        </dl>
      </header>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Operating principle
        </h2>
        <p className="max-w-3xl text-sm text-[var(--color-text)]">{component.operatingPrinciple}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Interfaces
        </h2>
        {component.interfaces.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">No active interfaces (passive part).</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {component.interfaces.map((iface) => (
              <li
                key={iface}
                className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-1 font-mono-tech text-xs"
              >
                {iface}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Use cases
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {component.useCases.map((useCase) => (
            <li key={useCase}>{useCase}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Pins
        </h2>
        <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
          <table className="min-w-full text-left text-sm">
            <caption className="sr-only">Pin table for {component.name}</caption>
            <thead className="bg-[var(--color-surface)] text-xs tracking-wide text-[var(--color-text-muted)] uppercase">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">
                  Pin
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Type
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Voltage
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody>
              {component.pins.map((pin) => (
                <tr key={pin.id} className="border-t border-[var(--color-border)]">
                  <th scope="row" className="px-3 py-2 font-mono-tech font-medium">
                    {pin.name}
                  </th>
                  <td className="px-3 py-2">
                    <span className="font-mono-tech text-xs">{PIN_TYPE_LABELS[pin.type]}</span>
                  </td>
                  <td className="px-3 py-2 font-mono-tech text-xs text-[var(--color-text-muted)]">
                    {pin.voltage ?? '—'}
                  </td>
                  <td className="px-3 py-2 text-[var(--color-text-muted)]">{pin.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">
          Pin order and labeling can vary by module revision — verify silk screen before wiring.
        </p>
      </section>

      <section className="space-y-2 rounded-[var(--radius-md)] border border-[var(--color-warning)]/40 bg-[var(--color-surface)] p-4">
        <h2 className="text-sm font-semibold text-[var(--color-warning)]">Safety</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {component.safety.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <RelatedList title="Related lessons" items={component.relatedLessons} basePath="/learn" />
      <RelatedList title="Related projects" items={component.relatedProjects} basePath="/projects" />
    </article>
  )
}
