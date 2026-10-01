import { listLessons } from '@/data/lessons'
import { listProjects } from '@/data/projects'
import { findHardwareById } from '@/data/hardware'
import type { ProgressDocument } from '@/types/progress'
import type { Lesson } from '@/types/lesson'
import type { Project } from '@/types/project'
import type { HardwareComponent } from '@/types/hardware'
import { getLessonStatus, getProjectStatus } from '@/lib/progress/mutations'

export interface DashboardSummary {
  readonly continueLesson: Lesson | null
  readonly unfinishedExperiments: readonly { readonly experimentId: string; readonly lesson: Lesson | null }[]
  readonly bookmarkedLessons: readonly Lesson[]
  readonly inProgressProjects: readonly Project[]
  readonly completedProjects: readonly Project[]
  readonly recentComponents: readonly HardwareComponent[]
  readonly lessonCounts: {
    readonly completed: number
    readonly inProgress: number
    readonly total: number
  }
}

export function buildDashboardSummary(document: ProgressDocument): DashboardSummary {
  const lessons = listLessons()
  const projects = listProjects()

  const inProgressLessons = lessons
    .filter((lesson) => getLessonStatus(document, lesson.id) === 'IN_PROGRESS')
    .sort((a, b) => {
      const aAt = document.lessons[a.id]?.lastActivityAt ?? ''
      const bAt = document.lessons[b.id]?.lastActivityAt ?? ''
      return bAt.localeCompare(aAt)
    })

  const notStarted = lessons.find((lesson) => getLessonStatus(document, lesson.id) === 'NOT_STARTED')
  const continueLesson = inProgressLessons[0] ?? notStarted ?? null

  const unfinishedExperiments = Object.values(document.experiments)
    .filter((experiment) => experiment.status === 'IN_PROGRESS')
    .map((experiment) => {
      const lessonId = experiment.experimentId.replace(/:experiment$/, '')
      const lesson = lessons.find((item) => item.id === lessonId) ?? null
      return { experimentId: experiment.experimentId, lesson }
    })

  // Experiments are marked COMPLETED only in V1 — surface incomplete lessons that still need the experiment mark.
  const experimentBacklog = lessons
    .filter((lesson) => {
      const status = getLessonStatus(document, lesson.id)
      if (status === 'NOT_STARTED') return false
      const experiment = document.experiments[`${lesson.id}:experiment`]
      return experiment?.status !== 'COMPLETED'
    })
    .slice(0, 5)
    .map((lesson) => ({
      experimentId: `${lesson.id}:experiment`,
      lesson,
    }))

  const bookmarkedLessons = document.bookmarks
    .filter((bookmark) => bookmark.kind === 'lesson')
    .map((bookmark) => lessons.find((lesson) => lesson.id === bookmark.targetId))
    .filter((lesson): lesson is Lesson => Boolean(lesson))

  const inProgressProjects = projects.filter(
    (project) => getProjectStatus(document, project.id) === 'IN_PROGRESS',
  )
  const completedProjects = projects.filter(
    (project) => getProjectStatus(document, project.id) === 'COMPLETED',
  )

  const recentComponents = document.recentlyViewedComponents
    .map((id) => findHardwareById(id))
    .filter((component): component is HardwareComponent => Boolean(component))

  const lessonCounts = {
    completed: lessons.filter((lesson) => getLessonStatus(document, lesson.id) === 'COMPLETED').length,
    inProgress: inProgressLessons.length,
    total: lessons.length,
  }

  return {
    continueLesson,
    unfinishedExperiments: unfinishedExperiments.length > 0 ? unfinishedExperiments : experimentBacklog,
    bookmarkedLessons,
    inProgressProjects,
    completedProjects,
    recentComponents,
    lessonCounts,
  }
}
