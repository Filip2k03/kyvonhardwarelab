import { Link } from 'react-router-dom'
import { LabPanel } from '@/components/ui/LabPanel'
import { CONNECTION_GUIDES } from '@/features/maoLab/data/connectionGuides'
import { cn } from '@/lib/cn'

interface Props {
  readonly partId?: string | null
}

export function ConnectionGuidePanel({ partId }: Props) {
  const guides = partId
    ? CONNECTION_GUIDES.filter((guide) => guide.partId === partId)
    : CONNECTION_GUIDES

  if (guides.length === 0) {
    return (
      <LabPanel>
        <p className="text-sm text-[var(--color-text-muted)]">No connection guide for this part yet.</p>
      </LabPanel>
    )
  }

  return (
    <div className="space-y-3">
      {guides.map((guide) => (
        <LabPanel
          key={`${guide.partId}-${guide.title}`}
          id={`guide-${guide.partId}`}
          className="space-y-3 scroll-mt-24"
        >
          <div>
            <p
              className={cn(
                'font-mono-tech text-[10px] tracking-wide uppercase',
                guide.status === 'verified' && 'text-[var(--color-success)]',
                guide.status === 'provisional' && 'text-[var(--color-accent)]',
                guide.status === 'unverified' && 'text-[var(--color-warning)]',
              )}
            >
              How to connect · {guide.status}
            </p>
            <h3 className="mt-1 text-sm font-semibold">{guide.title}</h3>
          </div>
          <pre className="overflow-x-auto rounded-[var(--radius-sm)] bg-[var(--color-surface-raised)] p-3 font-mono-tech text-[11px] whitespace-pre-wrap">
            {guide.diagram}
          </pre>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-[var(--color-text-muted)]">
            {guide.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          {guide.warnings.length > 0 ? (
            <ul className="space-y-1 text-xs text-[var(--color-warning)]">
              {guide.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          ) : null}
          {guide.relatedBuildStepId ? (
            <Link
              to={`/projects/mao-mark-i/build?step=${guide.relatedBuildStepId}`}
              className="text-xs text-[var(--color-accent)] hover:underline"
            >
              Open guided build ({guide.relatedBuildStepId})
            </Link>
          ) : null}
        </LabPanel>
      ))}
    </div>
  )
}
