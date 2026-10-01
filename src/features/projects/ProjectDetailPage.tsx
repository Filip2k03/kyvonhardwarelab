import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findProjectBySlug, PROJECT_CATEGORY_LABELS, resolveBomName } from '@/data/projects'
import { findHardwareById } from '@/data/hardware'
import { findCircuitBySlug } from '@/data/circuits'
import { EmptyState } from '@/components/ui/EmptyState'
import { ListenButton } from '@/components/audio/ListenButton'
import { useProgress } from '@/hooks/useProgress'
import { DIFFICULTY_LABELS } from '@/lib/hardware/labels'
import { PROGRESS_STATUS_LABELS } from '@/lib/learn/labels'
import { narrateProject } from '@/lib/audio/buildNarration'

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? findProjectBySlug(slug) : undefined
  const { getProjectStatus, startProject, completeProject } = useProgress()

  useEffect(() => {
    if (project) startProject(project.id)
  }, [project, startProject])

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description={`No project matches “${slug ?? 'unknown'}”.`}
      />
    )
  }

  const status = getProjectStatus(project.id)
  const circuit = project.circuitId ? findCircuitBySlug(project.circuitId) : undefined

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs text-[var(--color-text-muted)]">
          <Link to="/projects" className="text-[var(--color-accent)] hover:underline">
            Projects
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="font-mono-tech">{String(project.number).padStart(2, '0')}</span>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{project.title}</h1>
        <p className="max-w-3xl text-sm text-[var(--color-text-muted)]">{project.objective}</p>
        <dl className="flex flex-wrap gap-3 text-xs">
          <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
            <dt className="text-[var(--color-text-muted)]">Category</dt>
            <dd>{PROJECT_CATEGORY_LABELS[project.category]}</dd>
          </div>
          <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
            <dt className="text-[var(--color-text-muted)]">Difficulty</dt>
            <dd>{DIFFICULTY_LABELS[project.difficulty]}</dd>
          </div>
          <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
            <dt className="text-[var(--color-text-muted)]">Progress</dt>
            <dd className="font-mono-tech">{PROGRESS_STATUS_LABELS[status]}</dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-2">
          <ListenButton
            id={`project:${project.id}`}
            title={project.title}
            text={narrateProject(project)}
          />
          <button
            type="button"
            className="min-h-11 rounded-[var(--radius-sm)] bg-[var(--color-accent-strong)] px-4 text-sm font-medium text-[var(--color-bg)] disabled:opacity-60"
            disabled={status === 'COMPLETED'}
            onClick={() => completeProject(project.id)}
          >
            {status === 'COMPLETED' ? 'Project completed' : 'Mark project complete'}
          </button>
          <Link
            to={`/handouts/projects/${project.slug}`}
            className="inline-flex min-h-11 items-center rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 text-sm"
          >
            Handout
          </Link>
          <Link
            to={`/projects/${project.slug}/3d`}
            className="inline-flex min-h-11 items-center bg-[var(--color-surface-raised)] px-4 text-sm font-medium text-[var(--color-accent)]"
          >
            Open 3D build
          </Link>
        </div>
      </header>

      <section className="space-y-3 border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
              3D build walkthrough
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-[var(--color-text-muted)]">
              Each construction step reveals parts on a live bench model. Full screen keeps the guide
              beside your real wiring while a female voice explains the step.
            </p>
          </div>
          <Link
            to={`/projects/${project.slug}/3d`}
            className="inline-flex min-h-11 items-center bg-[var(--color-accent-strong)] px-4 text-sm font-medium text-[var(--color-bg)]"
          >
            Launch 3D + audio
          </Link>
        </div>
        <ol className="grid gap-2 sm:grid-cols-3">
          {project.constructionSteps.slice(0, 3).map((item, index) => (
            <li
              key={item.id}
              className="border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm"
            >
              <p className="font-mono-tech text-[11px] text-[var(--color-accent)]">
                Step {String(index + 1).padStart(2, '0')}
              </p>
              <p className="font-medium">{item.title}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Prerequisites
        </h2>
        {project.prerequisites.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">None listed.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {project.prerequisites.map((lessonSlug) => (
              <li key={lessonSlug}>
                <Link
                  to={`/learn/${lessonSlug}`}
                  className="inline-flex min-h-11 items-center rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 font-mono-tech text-xs text-[var(--color-accent)]"
                >
                  {lessonSlug}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2 rounded-[var(--radius-md)] border border-[var(--color-warning)]/40 bg-[var(--color-surface)] p-4">
        <h2 className="text-sm font-semibold text-[var(--color-warning)]">Safety</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {project.safety.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Bill of materials
        </h2>
        <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
          <table className="min-w-full text-left text-sm">
            <caption className="sr-only">BOM for {project.title}</caption>
            <thead className="bg-[var(--color-surface)] text-xs text-[var(--color-text-muted)] uppercase">
              <tr>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Part</th>
                <th className="px-3 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {project.bom.map((item) => {
                const hw = findHardwareById(item.componentId)
                return (
                  <tr key={`${item.componentId}-${item.notes ?? ''}`} className="border-t border-[var(--color-border)]">
                    <td className="px-3 py-2 font-mono-tech">{item.quantity}</td>
                    <td className="px-3 py-2">
                      {hw ? (
                        <Link to={`/components/${hw.slug}`} className="text-[var(--color-accent)] hover:underline">
                          {resolveBomName(item.componentId)}
                        </Link>
                      ) : (
                        resolveBomName(item.componentId)
                      )}
                    </td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">{item.notes ?? '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {circuit ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            Circuit
          </h2>
          <p className="text-sm">
            Related diagram:{' '}
            <Link to={`/lab/circuits/${circuit.slug}`} className="text-[var(--color-accent)] hover:underline">
              {circuit.title}
            </Link>
          </p>
        </section>
      ) : null}

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Explanation
        </h2>
        <p className="max-w-3xl text-sm">{project.explanation}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Construction
        </h2>
        <ol className="space-y-3">
          {project.constructionSteps.map((item, index) => (
            <li key={item.id} className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-3">
              <h3 className="text-sm font-semibold">
                {index + 1}. {item.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{item.instructions}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Firmware
        </h2>
        <pre className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4 font-mono-tech text-xs">
          <code>{project.firmware}</code>
        </pre>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            Testing
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {project.testing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            Debugging
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {project.debugging.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            Extensions
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {project.extensions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  )
}
