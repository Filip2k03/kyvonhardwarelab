import { Link } from 'react-router-dom'
import { listLessons, lessonsBySlugMap } from '@/data/lessons'
import { useProgress } from '@/hooks/useProgress'
import { PROGRESS_STATUS_LABELS } from '@/lib/learn/labels'
import { prerequisitesMet } from '@/lib/learn/curriculum'
import { cn } from '@/lib/cn'

export function LearnPage() {
  const lessons = listLessons()
  const bySlug = lessonsBySlugMap()
  const { getStatus, document } = useProgress()

  const completedIds = new Set(
    Object.entries(document.lessons)
      .filter(([, record]) => record.status === 'COMPLETED')
      .map(([id]) => id),
  )

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Learn</h1>
        <p className="max-w-2xl text-sm text-[var(--color-text-muted)]">
          Curriculum from electronics fundamentals through ESP32/IoT. Predict before you power.
          Progress is stored locally in your browser.
        </p>
      </header>

      <ol className="space-y-2">
        {lessons.map((lesson) => {
          const status = getStatus(lesson.id)
          const unlocked = prerequisitesMet(lesson, completedIds, bySlug)
          return (
            <li key={lesson.id}>
              <Link
                to={`/learn/${lesson.slug}`}
                className={cn(
                  'flex flex-col gap-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
                  !unlocked && status === 'NOT_STARTED' ? 'opacity-80' : null,
                )}
              >
                <div className="min-w-0">
                  <p className="font-mono-tech text-xs text-[var(--color-text-muted)]">
                    {String(lesson.number).padStart(2, '0')}
                  </p>
                  <h2 className="text-sm font-semibold">{lesson.title}</h2>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--color-text-muted)]">
                    {lesson.objective}
                  </p>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <p className="font-mono-tech text-xs text-[var(--color-accent)]">
                    {PROGRESS_STATUS_LABELS[status]}
                  </p>
                  {!unlocked && status === 'NOT_STARTED' ? (
                    <p className="text-xs text-[var(--color-warning)]">Prerequisites recommended</p>
                  ) : null}
                </div>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
