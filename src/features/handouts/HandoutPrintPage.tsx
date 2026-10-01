import { Link, useParams } from 'react-router-dom'
import { findCircuitBySlug } from '@/data/circuits'
import { findLessonBySlug } from '@/data/lessons'
import { findProjectBySlug } from '@/data/projects'
import { EmptyState } from '@/components/ui/EmptyState'
import { lessonToHandout, projectToHandout } from '@/lib/handouts/buildHandout'
import { HandoutSheetView } from '@/features/handouts/HandoutSheetView'
import { PrintCircuit } from '@/features/handouts/PrintCircuit'

function PrintToolbar({ backTo }: { readonly backTo: string }) {
  return (
    <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
      <Link to={backTo} className="min-h-11 text-sm text-[var(--color-accent)] hover:underline">
        Back
      </Link>
      <button
        type="button"
        className="min-h-11 border border-[var(--color-border)] px-4 text-sm font-medium"
        onClick={() => window.print()}
      >
        Print / Save as PDF
      </button>
    </div>
  )
}

export function LessonHandoutPage() {
  const { lessonSlug } = useParams<{ lessonSlug: string }>()
  const lesson = lessonSlug ? findLessonBySlug(lessonSlug) : undefined

  if (!lesson) {
    return (
      <EmptyState
        title="Handout not found"
        description={`No lesson worksheet matches “${lessonSlug ?? 'unknown'}”.`}
      />
    )
  }

  return (
    <>
      <PrintToolbar backTo={`/learn/${lesson.slug}`} />
      <HandoutSheetView sheet={lessonToHandout(lesson)} />
    </>
  )
}

export function ProjectHandoutPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? findProjectBySlug(slug) : undefined

  if (!project) {
    return (
      <EmptyState
        title="Handout not found"
        description={`No project worksheet matches “${slug ?? 'unknown'}”.`}
      />
    )
  }

  const circuit = project.circuitId ? findCircuitBySlug(project.circuitId) : undefined

  return (
    <>
      <PrintToolbar backTo={`/projects/${project.slug}`} />
      <HandoutSheetView
        sheet={projectToHandout(project)}
        circuit={circuit ? <PrintCircuit circuit={circuit} /> : undefined}
      />
    </>
  )
}
