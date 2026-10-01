import type { Difficulty } from './hardware'
import type { ProgressStatus } from './hardware'

export type ProjectCategory =
  | 'beginner'
  | 'sensors'
  | 'displays'
  | 'motion'
  | 'communication'
  | 'integrated'
  | 'robotics'

export interface ProjectBomItem {
  readonly componentId: string
  readonly quantity: number
  readonly notes?: string
}

export interface ProjectStep {
  readonly id: string
  readonly title: string
  readonly instructions: string
}

export interface Project {
  readonly id: string
  readonly slug: string
  readonly number: number
  readonly title: string
  readonly objective: string
  readonly difficulty: Difficulty
  readonly category: ProjectCategory
  readonly prerequisites: readonly string[]
  readonly bom: readonly ProjectBomItem[]
  readonly circuitId?: string
  readonly firmware: string
  readonly explanation: string
  readonly constructionSteps: readonly ProjectStep[]
  readonly testing: readonly string[]
  readonly debugging: readonly string[]
  readonly extensions: readonly string[]
  readonly safety: readonly string[]
}

export interface ProjectProgress {
  readonly projectId: string
  readonly status: ProgressStatus
  readonly lastActivityAt: string
}
