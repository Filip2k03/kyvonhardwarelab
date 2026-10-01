import { Link } from 'react-router-dom'
import { listLessons } from '@/data/lessons'
import { listProjects } from '@/data/projects'
import { PageListenButton } from '@/components/audio/ListenButton'

export function HandoutsPage() {
  const lessons = listLessons()
  const projects = listProjects()

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Handouts</h1>
          <p className="max-w-2xl text-sm text-[var(--color-text-muted)]">
            A4 worksheets for every lesson and project. Open one, then use Print or Save as PDF in
            the browser. No server-side PDF generator.
          </p>
        </div>
        <PageListenButton />
      </header>

      <section className="space-y-3" aria-labelledby="lesson-handouts">
        <h2 id="lesson-handouts" className="text-sm font-semibold tracking-wide uppercase">
          Lessons
        </h2>
        <ul className="divide-y divide-[var(--color-border)] border border-[var(--color-border)]">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link
                to={`/handouts/lessons/${lesson.slug}`}
                className="flex min-h-11 items-baseline justify-between gap-4 px-3 py-2 text-sm hover:bg-[var(--color-surface)]"
              >
                <span>{lesson.title}</span>
                <span className="font-mono-tech text-xs text-[var(--color-text-muted)]">
                  {String(lesson.number).padStart(2, '0')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="project-handouts">
        <h2 id="project-handouts" className="text-sm font-semibold tracking-wide uppercase">
          Projects
        </h2>
        <ul className="divide-y divide-[var(--color-border)] border border-[var(--color-border)]">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                to={`/handouts/projects/${project.slug}`}
                className="flex min-h-11 items-baseline justify-between gap-4 px-3 py-2 text-sm hover:bg-[var(--color-surface)]"
              >
                <span>{project.title}</span>
                <span className="font-mono-tech text-xs text-[var(--color-text-muted)]">
                  {String(project.number).padStart(2, '0')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
