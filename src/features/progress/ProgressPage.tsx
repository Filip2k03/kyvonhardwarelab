import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { listLessons } from '@/data/lessons'
import { listProjects } from '@/data/projects'
import { PageListenButton } from '@/components/audio/ListenButton'
import { useProgress } from '@/hooks/useProgress'
import { PROGRESS_STATUS_LABELS } from '@/lib/learn/labels'

export function ProgressPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importMessage, setImportMessage] = useState<string | null>(null)
  const {
    document,
    storageNotice,
    dismissNotice,
    exportJson,
    importJson,
    resetProgress,
    getStatus,
    getProjectStatus,
  } = useProgress()

  const lessons = listLessons()
  const projects = listProjects()
  const completedCount = lessons.filter((lesson) => getStatus(lesson.id) === 'COMPLETED').length
  const inProgressCount = lessons.filter((lesson) => getStatus(lesson.id) === 'IN_PROGRESS').length
  const projectsCompleted = projects.filter(
    (project) => getProjectStatus(project.id) === 'COMPLETED',
  ).length

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Progress</h1>
          <p className="max-w-2xl text-sm text-[var(--color-text-muted)]">
            Learning history stays on this device. Export a JSON backup anytime. Imports are validated
            before they replace stored progress.
          </p>
        </div>
        <PageListenButton />
      </header>

      {storageNotice ? (
        <div
          role="status"
          className="flex flex-wrap items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-warning)]/50 bg-[var(--color-surface)] p-4 text-sm"
        >
          <p>{storageNotice}</p>
          <button type="button" className="text-[var(--color-accent)]" onClick={dismissNotice}>
            Dismiss
          </button>
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs text-[var(--color-text-muted)]">Completed lessons</p>
          <p className="font-mono-tech text-2xl">{completedCount}</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs text-[var(--color-text-muted)]">Lessons in progress</p>
          <p className="font-mono-tech text-2xl">{inProgressCount}</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs text-[var(--color-text-muted)]">Completed projects</p>
          <p className="font-mono-tech text-2xl">{projectsCompleted}</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs text-[var(--color-text-muted)]">Bookmarks</p>
          <p className="font-mono-tech text-2xl">{document.bookmarks.length}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Backup
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="min-h-11 rounded-[var(--radius-sm)] bg-[var(--color-accent-strong)] px-4 text-sm font-medium text-[var(--color-bg)]"
            onClick={() => {
              const blob = new Blob([exportJson()], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const anchor = window.document.createElement('a')
              anchor.href = url
              anchor.download = 'kyvon-hardware-lab-progress.json'
              anchor.click()
              URL.revokeObjectURL(url)
              setImportMessage('Exported progress JSON.')
            }}
          >
            Export JSON
          </button>
          <button
            type="button"
            className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 text-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Import JSON
          </button>
          <button
            type="button"
            className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-danger)]/50 px-4 text-sm text-[var(--color-danger)]"
            onClick={() => {
              if (window.confirm('Reset all local progress? This cannot be undone.')) {
                resetProgress()
                setImportMessage('Progress reset.')
              }
            }}
          >
            Reset
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={async (event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (!file) return

              const hasExisting =
                Object.keys(document.lessons).length > 0 ||
                Object.keys(document.projects).length > 0 ||
                document.bookmarks.length > 0 ||
                Object.keys(document.quizzes).length > 0

              if (hasExisting && !window.confirm('Replace existing local progress with this file?')) {
                setImportMessage('Import cancelled.')
                return
              }

              const raw = await file.text()
              const result = importJson(raw)
              setImportMessage(result.ok ? 'Import successful.' : result.error)
            }}
          />
        </div>
        {importMessage ? (
          <p className="text-sm text-[var(--color-text-muted)]" aria-live="polite">
            {importMessage}
          </p>
        ) : null}
        <p className="text-xs text-[var(--color-text-muted)]">
          Last activity: <span className="font-mono-tech">{document.lastActivityAt}</span>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Lesson status
        </h2>
        <ul className="divide-y divide-[var(--color-border)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
          {lessons.map((lesson) => (
            <li key={lesson.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <Link to={`/learn/${lesson.slug}`} className="text-[var(--color-accent)] hover:underline">
                {String(lesson.number).padStart(2, '0')} {lesson.title}
              </Link>
              <span className="font-mono-tech text-xs text-[var(--color-text-muted)]">
                {PROGRESS_STATUS_LABELS[getStatus(lesson.id)]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Project status
        </h2>
        <ul className="divide-y divide-[var(--color-border)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
            >
              <Link
                to={`/projects/${project.slug}`}
                className="text-[var(--color-accent)] hover:underline"
              >
                {String(project.number).padStart(2, '0')} {project.title}
              </Link>
              <div className="flex items-center gap-3">
                <Link
                  to={`/projects/${project.slug}/3d`}
                  className="text-xs text-[var(--color-text-muted)] hover:underline"
                >
                  3D
                </Link>
                <span className="font-mono-tech text-xs text-[var(--color-text-muted)]">
                  {PROGRESS_STATUS_LABELS[getProjectStatus(project.id)]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
