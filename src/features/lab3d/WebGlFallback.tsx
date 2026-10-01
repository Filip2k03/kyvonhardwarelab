import { Link } from 'react-router-dom'
import { UNO_BOARD_FALLBACK_SUMMARY, UNO_BOARD_HOTSPOTS } from '@/data/lab3d/unoBoard'

interface WebGlFallbackProps {
  readonly reason: string
}

export function WebGlFallback({ reason }: WebGlFallbackProps) {
  return (
    <div className="space-y-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div>
        <h2 className="text-lg font-semibold">3D view unavailable</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{reason}</p>
      </div>
      <p className="text-sm">{UNO_BOARD_FALLBACK_SUMMARY}</p>
      <ul className="space-y-3">
        {UNO_BOARD_HOTSPOTS.map((hotspot) => (
          <li key={hotspot.id} className="rounded-[var(--radius-sm)] border border-[var(--color-border)] p-3">
            <h3 className="text-sm font-semibold">{hotspot.label}</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{hotspot.summary}</p>
            <p className="mt-2 font-mono-tech text-xs text-[var(--color-accent)]">
              {hotspot.pinNames.join(' · ')}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {hotspot.relatedComponentSlug ? (
                <Link
                  to={`/components/${hotspot.relatedComponentSlug}`}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  Component
                </Link>
              ) : null}
              {hotspot.relatedLessonSlug ? (
                <Link
                  to={`/learn/${hotspot.relatedLessonSlug}`}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  Lesson
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
