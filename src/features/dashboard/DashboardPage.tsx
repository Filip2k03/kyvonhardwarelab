import { Link } from 'react-router-dom'
import { PRIMARY_NAV } from '@/app/navigation'
import { PageListenButton } from '@/components/audio/ListenButton'
import { LabPanel, SectionTitle } from '@/components/ui/LabPanel'
import { MeterBar } from '@/components/ui/MeterBar'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusChip } from '@/components/ui/StatusChip'
import { useProgress } from '@/hooks/useProgress'
import { buildDashboardSummary } from '@/lib/dashboard/summary'

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
      <PageHeader
        eyebrow="Bench home"
        title="KYVON Hardware Lab"
        description="Your personal bench companion. Pick up the open lesson, finish an experiment, or jump into a project. Everything below comes from progress stored only on this device."
        actions={
          <>
            <Link to={continueTo} className="lab-btn-primary">
              {continueLabel}
            </Link>
            <Link to="/projects" className="lab-btn-ghost">
              Projects
            </Link>
            <PageListenButton />
          </>
        }
      />

      <section aria-labelledby="progress-heading" className="grid gap-3 sm:grid-cols-3">
        <h2 id="progress-heading" className="sr-only">
          Learning progress
        </h2>
        <LabPanel>
          <p className="text-xs text-[var(--color-text-muted)]">Lessons completed</p>
          <p className="mt-1 font-mono-tech text-2xl">
            {summary.lessonCounts.completed}
            <span className="text-sm text-[var(--color-text-muted)]">
              /{summary.lessonCounts.total}
            </span>
          </p>
          <MeterBar
            className="mt-3"
            label="Curriculum coverage"
            value={summary.lessonCounts.completed}
            max={summary.lessonCounts.total}
          />
        </LabPanel>
        <LabPanel>
          <p className="text-xs text-[var(--color-text-muted)]">Lessons in progress</p>
          <p className="mt-1 font-mono-tech text-2xl">{summary.lessonCounts.inProgress}</p>
          <p className="mt-3 text-xs text-[var(--color-text-muted)]">
            Keep one lesson hot on the bench rather than starting many.
          </p>
        </LabPanel>
        <LabPanel>
          <p className="text-xs text-[var(--color-text-muted)]">Projects completed</p>
          <p className="mt-1 font-mono-tech text-2xl">{summary.completedProjects.length}</p>
          <p className="mt-3 text-xs text-[var(--color-text-muted)]">
            {summary.inProgressProjects.length} active build
            {summary.inProgressProjects.length === 1 ? '' : 's'} open
          </p>
        </LabPanel>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-3" aria-labelledby="experiments-heading">
          <SectionTitle id="experiments-heading">Unfinished experiments</SectionTitle>
          {summary.unfinishedExperiments.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              No open experiments. Open a lesson and mark the physical experiment when you finish it.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] bg-[var(--color-surface)]">
              {summary.unfinishedExperiments.map((item) => (
                <li key={item.experimentId}>
                  {item.lesson ? (
                    <Link
                      to={`/learn/${item.lesson.slug}`}
                      className="flex min-h-11 items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-[var(--color-surface-raised)]"
                    >
                      <span>{item.lesson.title}</span>
                      <span className="lab-chip lab-chip-accent">experiment</span>
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
          <SectionTitle id="bookmarks-heading">Bookmarks</SectionTitle>
          {summary.bookmarkedLessons.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              Bookmark a lesson from its page to pin it here.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] bg-[var(--color-surface)]">
              {summary.bookmarkedLessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    to={`/learn/${lesson.slug}`}
                    className="flex min-h-11 items-center px-3 py-2 text-sm hover:bg-[var(--color-surface-raised)]"
                  >
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3" aria-labelledby="projects-heading">
          <SectionTitle id="projects-heading">Active projects</SectionTitle>
          {summary.inProgressProjects.length === 0 && summary.completedProjects.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              Start a build from{' '}
              <Link to="/projects" className="text-[var(--color-accent)] hover:underline">
                Projects
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] bg-[var(--color-surface)]">
              {summary.inProgressProjects.map((project) => (
                <li key={project.id}>
                  <Link
                    to={`/projects/${project.slug}`}
                    className="flex min-h-11 items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-[var(--color-surface-raised)]"
                  >
                    <span>{project.title}</span>
                    <StatusChip status="IN_PROGRESS" />
                  </Link>
                </li>
              ))}
              {summary.completedProjects.slice(0, 4).map((project) => (
                <li key={project.id}>
                  <Link
                    to={`/projects/${project.slug}`}
                    className="flex min-h-11 items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-[var(--color-surface-raised)]"
                  >
                    <span>{project.title}</span>
                    <StatusChip status="COMPLETED" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3" aria-labelledby="recent-heading">
          <SectionTitle id="recent-heading">Recently viewed components</SectionTitle>
          {summary.recentComponents.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              Open parts in the{' '}
              <Link to="/components" className="text-[var(--color-accent)] hover:underline">
                component catalog
              </Link>{' '}
              and they will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] bg-[var(--color-surface)]">
              {summary.recentComponents.map((component) => (
                <li key={component.id}>
                  <Link
                    to={`/components/${component.slug}`}
                    className="flex min-h-11 items-center px-3 py-2 text-sm hover:bg-[var(--color-surface-raised)]"
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
        <SectionTitle id="areas-heading">Areas</SectionTitle>
        <ul className="grid gap-3 sm:grid-cols-2">
          {PRIMARY_NAV.filter((item) => item.to !== '/').map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="lab-row flex min-h-11 items-center gap-3 px-4 py-3"
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
