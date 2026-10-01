import { Link, useParams } from 'react-router-dom'
import { findProjectBySlug } from '@/data/projects'
import { EmptyState } from '@/components/ui/EmptyState'
import { Project3dExperience } from '@/features/project3d/Project3dExperience'

export function Project3dPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? findProjectBySlug(slug) : undefined

  if (!project) {
    return (
      <EmptyState
        title="3D build not found"
        description={`No project matches “${slug ?? 'unknown'}”.`}
      />
    )
  }

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs text-[var(--color-text-muted)]">
          <Link to="/projects" className="text-[var(--color-accent)] hover:underline">
            Projects
          </Link>
          <span aria-hidden="true"> / </span>
          <Link to={`/projects/${project.slug}`} className="text-[var(--color-accent)] hover:underline">
            {project.title}
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="font-mono-tech">3d</span>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{project.title} · 3D build</h1>
        <p className="max-w-3xl text-sm text-[var(--color-text-muted)]">
          Watch each construction step appear on the bench, then listen while a female voice walks
          you through it. Open full screen when you want the model beside your real board.
        </p>
      </header>

      <Project3dExperience project={project} />
    </div>
  )
}
