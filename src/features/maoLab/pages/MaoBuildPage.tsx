import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LabPanel } from '@/components/ui/LabPanel'
import { CONNECTION_GUIDES } from '@/features/maoLab/data/connectionGuides'
import { MAO_BUILD_STEPS } from '@/features/maoLab/data/milestones'
import { photoChecklistForStep } from '@/features/maoLab/data/photoChecklists'
import { canMarkStepComplete, missingPrerequisites, stepTitle } from '@/features/maoLab/domain/buildProgress'
import { loadMaoProgress, markStepComplete, saveMaoProgress } from '@/features/maoLab/services/persistence'
import { cn } from '@/lib/cn'

export function MaoBuildPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [progress, setProgress] = useState(() => loadMaoProgress())
  const [photoChecks, setPhotoChecks] = useState<Record<string, string[]>>({})
  const requested = searchParams.get('step')
  const active =
    MAO_BUILD_STEPS.find((step) => step.id === (requested ?? progress.activeStepId)) ?? MAO_BUILD_STEPS[0]!

  const checklist = photoChecklistForStep(active.id)
  const checkedIds = photoChecks[active.id] ?? []
  const gate = canMarkStepComplete(active.id, progress.completedStepIds, checkedIds)
  const missing = missingPrerequisites(active.id, progress.completedStepIds)
  const relatedGuides = CONNECTION_GUIDES.filter((guide) => guide.relatedBuildStepId === active.id)

  function selectStep(id: string) {
    const next = { ...progress, activeStepId: id, updatedAt: new Date().toISOString() }
    saveMaoProgress(next)
    setProgress(next)
    setSearchParams(id === 'm0' ? {} : { step: id }, { replace: true })
  }

  function togglePhotoItem(itemId: string) {
    setPhotoChecks((current) => {
      const existing = current[active.id] ?? []
      const nextIds = existing.includes(itemId)
        ? existing.filter((id) => id !== itemId)
        : [...existing, itemId]
      return { ...current, [active.id]: nextIds }
    })
  }

  function complete() {
    if (!gate.ok) return
    setProgress(markStepComplete(active.id))
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <LabPanel className="max-h-[70vh] space-y-1 overflow-y-auto">
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Steps
        </h2>
        {MAO_BUILD_STEPS.map((step) => {
          const done = progress.completedStepIds.includes(step.id)
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => selectStep(step.id)}
              className={cn(
                'flex min-h-11 w-full flex-col rounded-[var(--radius-sm)] px-2 py-2 text-left text-xs',
                active.id === step.id
                  ? 'bg-[var(--color-surface-raised)] ring-1 ring-[var(--color-accent)]'
                  : 'hover:bg-[var(--color-surface-raised)]',
              )}
            >
              <span className="font-medium">
                M{step.index} {step.title}
              </span>
              <span className="font-mono-tech text-[10px] text-[var(--color-text-muted)]">
                {done ? 'complete' : step.blockedReason ? 'blocked' : 'open'}
              </span>
            </button>
          )
        })}
      </LabPanel>

      <LabPanel className="space-y-4">
        <div>
          <p className="font-mono-tech text-[10px] text-[var(--color-accent)] uppercase">
            Step M{active.index}
          </p>
          <h2 className="text-lg font-semibold">{active.title}</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">{active.objective}</p>
        </div>

        {active.blockedReason ? (
          <p className="rounded-[var(--radius-sm)] border border-[var(--color-warning)] p-3 text-sm text-[var(--color-warning)]">
            BLOCKED: {active.blockedReason}
          </p>
        ) : null}

        {missing.length > 0 ? (
          <p className="rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] p-3 text-sm text-[var(--color-text-muted)]">
            Prerequisites: {missing.map((id) => stepTitle(id)).join(' · ')}
          </p>
        ) : null}

        {checklist ? (
          <section className="space-y-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-3">
            <h3 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
              {checklist.title}
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">{checklist.note}</p>
            <ul className="space-y-2">
              {checklist.items.map((item) => {
                const checked = checkedIds.includes(item.id)
                return (
                  <li key={item.id}>
                    <label className="flex min-h-11 cursor-pointer items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="mt-1 accent-[var(--color-accent)]"
                        checked={checked}
                        onChange={() => togglePhotoItem(item.id)}
                      />
                      <span>{item.label}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null}

        {relatedGuides.length > 0 ? (
          <section>
            <h3 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
              How to connect
            </h3>
            <ul className="mt-2 space-y-1">
              {relatedGuides.map((guide) => (
                <li key={`${guide.partId}-${guide.title}`}>
                  <Link
                    to={`/projects/mao-mark-i/wiring#guide-${guide.partId}`}
                    className="text-sm text-[var(--color-accent)] hover:underline"
                  >
                    {guide.title} · {guide.status}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <h3 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            Components
          </h3>
          <p className="mt-1 text-sm">{active.components.join(', ') || '—'}</p>
        </section>
        <section>
          <h3 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            Connections
          </h3>
          <ul className="mt-1 list-disc pl-5 text-sm text-[var(--color-text-muted)]">
            {active.connections.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            Wiring
          </h3>
          <ul className="mt-1 list-disc pl-5 text-sm text-[var(--color-text-muted)]">
            {active.wiring.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            Code
          </h3>
          <pre className="mt-1 overflow-x-auto rounded-[var(--radius-sm)] bg-[var(--color-surface-raised)] p-3 font-mono-tech text-[11px] whitespace-pre-wrap">
            {active.codeHint}
          </pre>
        </section>
        <section className="grid gap-3 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
              Expected
            </h3>
            <p className="mt-1 text-sm">{active.expected}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
              Test
            </h3>
            <p className="mt-1 text-sm">{active.test}</p>
          </div>
        </section>
        <section>
          <h3 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            Troubleshooting
          </h3>
          <ul className="mt-1 list-disc pl-5 text-sm text-[var(--color-text-muted)]">
            {active.troubleshooting.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            Safety
          </h3>
          <ul className="mt-1 list-disc pl-5 text-sm text-[var(--color-warning)]">
            {active.safety.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {!gate.ok ? (
          <ul className="space-y-1 text-xs text-[var(--color-warning)]">
            {gate.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button type="button" className="lab-btn-primary" onClick={complete} disabled={!gate.ok}>
            Mark complete
          </button>
          <Link to="/projects/mao-mark-i/wiring" className="lab-btn-ghost">
            Wiring tools
          </Link>
          {active.unlocks3d ? (
            <Link to="/projects/mao-mark-i/workbench" className="lab-btn-ghost">
              Open 3D view
            </Link>
          ) : null}
        </div>
      </LabPanel>
    </div>
  )
}
