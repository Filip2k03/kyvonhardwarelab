import { Link } from 'react-router-dom'
import { PRIMARY_NAV } from '@/app/navigation'
import { PageListenButton } from '@/components/audio/ListenButton'
import { useProgress } from '@/hooks/useProgress'
import { buildDashboardSummary } from '@/lib/dashboard/summary'
import { PROGRESS_STATUS_LABELS } from '@/lib/learn/labels'

export function DashboardPage() {
  const { document } = useProgress()
  const summary = buildDashboardSummary(document)
  const continueTo = summary.continueLesson
    ? `/learn/${summary.continueLesson.slug}`
    : '/learn'
  const continueLabel = summary.continueLesson
    ? `Continue: ${summary.continueLesson.title}`
    : 'Start learning'

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">KYVON Hardware Lab</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
          Your personal bench companion. Pick up the open lesson, finish an experiment, or jump into
          a project. Everything below comes from progress stored only on this device.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            to={continueTo}
            className="inline-flex min-h-11 items-center bg-[var(--color-accent-strong)] px-4 text-sm font-medium text-[var(--color-bg)]"
          >
            {continueLabel}
          </Link>
          <Link
            to="/projects"
            className="inline-flex min-h-11 items-center border border-[var(--color-border)] px-4 text-sm"
          >
            Projects
          </Link>
          <PageListenButton />
        </div>
      </header>

      <section
        aria-labelledby="progress-heading"
        className="grid gap-3 sm:grid-cols-3"
      >
        <h2 id="progress-heading" className="sr-only">
          Learning progress
        </h2>
        <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs text-[var(--color-text-muted)]">Lessons completed</p>
          <p className="font-mono-tech text-2xl">
            {summary.lessonCounts.completed}
            <span className="text-sm text-[var(--color-text-muted)]">
              /{summary.lessonCounts.total}
            </span>
          </p>
        </div>
        <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs text-[var(--color-text-muted)]">Lessons in progress</p>
          <p className="font-mono-tech text-2xl">{summary.lessonCounts.inProgress}</p>
        </div>
        <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs text-[var(--color-text-muted)]">Projects completed</p>
          <p className="font-mono-tech text-2xl">{summary.completedProjects.length}</p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-3" aria-labelledby="experiments-heading">
          <h2
            id="experiments-heading"
            className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase"
          >
            Unfinished experiments
          </h2>
          {summary.unfinishedExperiments.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              No open experiments. Open a lesson and mark the physical experiment when you finish it.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--color-border)] border border-[var(--color-border)]">
              {summary.unfinishedExperiments.map((item) => (
                <li key={item.experimentId}>
                  {item.lesson ? (
                    <Link
                      to={`/learn/${item.lesson.slug}`}
                      className="flex min-h-11 items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-[var(--color-surface)]"
                    >
                      <span>{item.lesson.title}</span>
                      <span className="font-mono-tech text-xs text-[var(--color-accent)]">
                        experiment
                      </span>
                    </Link>
                  ) : (
                    <p className="px-3 py-2 font-mono-tech text-xs text-[var(--color-text-muted)]">
                      {item.experimentId}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3" aria-labelledby="bookmarks-heading">
          <h2
            id="bookmarks-heading"
            className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase"
          >
            Bookmarks
          </h2>
          {summary.bookmarkedLessons.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              Bookmark a lesson from its page to pin it here.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--color-border)] border border-[var(--color-border)]">
              {summary.bookmarkedLessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    to={`/learn/${lesson.slug}`}
                    className="flex min-h-11 items-center px-3 py-2 text-sm hover:bg-[var(--color-surface)]"
                  >
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3" aria-labelledby="projects-heading">
          <h2
            id="projects-heading"
            className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase"
          >
            Active projects
          </h2>
          {summary.inProgressProjects.length === 0 && summary.completedProjects.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              Start a build from{' '}
              <Link to="/projects" className="text-[var(--color-accent)] hover:underline">
                Projects
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-[var(--color-border)] border border-[var(--color-border)]">
              {summary.inProgressProjects.map((project) => (
                <li key={project.id}>
                  <Link
                    to={`/projects/${project.slug}`}
                    className="flex min-h-11 items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-[var(--color-surface)]"
                  >
                    <span>{project.title}</span>
                    <span className="font-mono-tech text-xs text-[var(--color-accent)]">
                      {PROGRESS_STATUS_LABELS.IN_PROGRESS}
                    </span>
                  </Link>
                </li>
              ))}
              {summary.completedProjects.slice(0, 4).map((project) => (
                <li key={project.id}>
                  <Link
                    to={`/projects/${project.slug}`}
                    className="flex min-h-11 items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-[var(--color-surface)]"
                  >
                    <span>{project.title}</span>
                    <span className="font-mono-tech text-xs text-[var(--color-text-muted)]">
                      {PROGRESS_STATUS_LABELS.COMPLETED}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3" aria-labelledby="recent-heading">
          <h2
            id="recent-heading"
            className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase"
          >
            Recently viewed components
          </h2>
          {summary.recentComponents.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              Open parts in the{' '}
              <Link to="/components" className="text-[var(--color-accent)] hover:underline">
                component catalog
              </Link>{' '}
              and they will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--color-border)] border border-[var(--color-border)]">
              {summary.recentComponents.map((component) => (
                <li key={component.id}>
                  <Link
                    to={`/components/${component.slug}`}
                    className="flex min-h-11 items-center px-3 py-2 text-sm hover:bg-[var(--color-surface)]"
                  >
                    {component.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section aria-labelledby="areas-heading" className="space-y-3">
        <h2
          id="areas-heading"
          className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase"
        >
          Areas
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {PRIMARY_NAV.filter((item) => item.to !== '/').map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="flex min-h-11 items-center gap-3 border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 hover:border-[var(--color-border-strong)]"
              >
                <item.icon aria-hidden="true" className="h-4 w-4 text-[var(--color-accent)]" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
