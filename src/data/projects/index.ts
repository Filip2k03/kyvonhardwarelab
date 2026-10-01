import { BEGINNER_PROJECTS } from './beginner'
import { SENSOR_PROJECTS } from './sensors'
import { DISPLAY_PROJECTS, MOTION_PROJECTS } from './displays-motion'
import {
  COMMUNICATION_PROJECTS,
  INTEGRATED_PROJECTS,
  ROBOTICS_PROJECTS,
} from './advanced'
import type { Project, ProjectCategory } from '@/types/project'
import type { Difficulty } from '@/types/hardware'
import { findHardwareById } from '@/data/hardware'

export const PROJECT_LIBRARY: readonly Project[] = [
  ...BEGINNER_PROJECTS,
  ...SENSOR_PROJECTS,
  ...DISPLAY_PROJECTS,
  ...MOTION_PROJECTS,
  ...COMMUNICATION_PROJECTS,
  ...INTEGRATED_PROJECTS,
  ...ROBOTICS_PROJECTS,
]

export function listProjects(): readonly Project[] {
  return PROJECT_LIBRARY
}

export function findProjectBySlug(slug: string): Project | undefined {
  return PROJECT_LIBRARY.find((project) => project.slug === slug)
}

export interface ProjectFilterOptions {
  readonly query?: string
  readonly category?: ProjectCategory | 'all'
  readonly difficulty?: Difficulty | 'all'
}

export function filterProjects(
  projects: readonly Project[],
  options: ProjectFilterOptions = {},
): Project[] {
  const query = (options.query ?? '').trim().toLowerCase()
  const category = options.category ?? 'all'
  const difficulty = options.difficulty ?? 'all'

  return projects.filter((project) => {
    if (category !== 'all' && project.category !== category) return false
    if (difficulty !== 'all' && project.difficulty !== difficulty) return false
    if (!query) return true
    const haystack = [
      project.title,
      project.slug,
      project.objective,
      project.explanation,
      ...project.prerequisites,
    ]
      .join(' ')
      .toLowerCase()
    return query.split(/\s+/).every((token) => haystack.includes(token))
  })
}

export function projectPrerequisitesMet(
  project: Project,
  completedLessonIds: ReadonlySet<string>,
  lessonIdBySlug: ReadonlyMap<string, string>,
): boolean {
  return project.prerequisites.every((slug) => {
    const lessonId = lessonIdBySlug.get(slug)
    return lessonId ? completedLessonIds.has(lessonId) : false
  })
}

export function resolveBomName(componentId: string): string {
  return findHardwareById(componentId)?.name ?? componentId
}

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  beginner: 'Beginner',
  sensors: 'Sensors',
  displays: 'Displays',
  motion: 'Motion',
  communication: 'Communication',
  integrated: 'Integrated',
  robotics: 'Robotics',
}
