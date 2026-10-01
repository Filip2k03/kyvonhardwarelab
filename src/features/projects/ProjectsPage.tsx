import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PROJECT_CATEGORY_LABELS,
  filterProjects,
  listProjects,
} from '@/data/projects'
import type { Difficulty } from '@/types/hardware'
import type { ProjectCategory } from '@/types/project'
import { DIFFICULTIES, DIFFICULTY_LABELS } from '@/lib/hardware/labels'
import { useProgress } from '@/hooks/useProgress'
import { EmptyState } from '@/components/ui/EmptyState'
import { LabPanel } from '@/components/ui/LabPanel'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusChip } from '@/components/ui/StatusChip'

const CATEGORIES = Object.keys(PROJECT_CATEGORY_LABELS) as ProjectCategory[]

export function ProjectsPage() {
  const projects = listProjects()
  const { getProjectStatus } = useProgress()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ProjectCategory | 'all'>('all')
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')

  const results = useMemo(
    () => filterProjects(projects, { query, category, difficulty }),
    [projects, query, category, difficulty],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Builds"
        title="Projects"
        description="Progressive physical builds from Blink through robotics expansion. BOM items link to the hardware catalog; lesson prerequisites link to Learn."
      />

      <LabPanel>
        <form
          className="grid gap-3 sm:grid-cols-3"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="flex flex-col gap-1 sm:col-span-3">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm"
              placeholder="Title, objective, prerequisite…"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as ProjectCategory | 'all')}
              className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm"
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {PROJECT_CATEGORY_LABELS[value]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">Difficulty</span>
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as Difficulty | 'all')}
              className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm"
            >
              <option value="all">All difficulties</option>
              {DIFFICULTIES.map((value) => (
                <option key={value} value={value}>
                  {DIFFICULTY_LABELS[value]}
                </option>
              ))}
            </select>
          </label>
          <p
            className="self-end font-mono-tech text-xs text-[var(--color-text-muted)]"
            aria-live="polite"
          >
            {results.length} project{results.length === 1 ? '' : 's'}
          </p>
        </form>
      </LabPanel>

      {results.length === 0 ? (
        <EmptyState title="No projects match" description="Clear filters or broaden your search." />
      ) : (
        <ul className="space-y-2">
          {results.map((project) => {
            const status = getProjectStatus(project.id)
            return (
              <li key={project.id} className="lab-row overflow-hidden">
                <Link
                  to={`/projects/${project.slug}`}
                  className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-mono-tech text-xs text-[var(--color-text-muted)]">
                      {String(project.number).padStart(2, '0')} ·{' '}
                      {PROJECT_CATEGORY_LABELS[project.category]}
                    </p>
                    <h2 className="text-sm font-semibold">{project.title}</h2>
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--color-text-muted)]">
                      {project.objective}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-1 sm:items-end">
                    <span className="lab-chip lab-chip-accent">
                      {DIFFICULTY_LABELS[project.difficulty]}
                    </span>
                    <StatusChip status={status} />
                  </div>
                </Link>
                <div className="flex flex-wrap gap-2 border-t border-[var(--color-border)] px-4 py-2">
                  <Link
                    to={`/projects/${project.slug}/3d`}
                    className="inline-flex min-h-10 items-center text-xs font-medium text-[var(--color-accent)] hover:underline"
                  >
                    3D + audio guide
                  </Link>
                  <Link
                    to={`/handouts/projects/${project.slug}`}
                    className="inline-flex min-h-10 items-center text-xs text-[var(--color-text-muted)] hover:underline"
                  >
                    Handout
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
