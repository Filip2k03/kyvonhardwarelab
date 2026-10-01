import type { ProgressStatus } from './hardware'

export interface Bookmark {
  readonly id: string
  readonly kind: 'lesson' | 'component' | 'project'
  readonly targetId: string
  readonly createdAt: string
}

export interface QuizProgress {
  readonly quizId: string
  readonly score: number
  readonly maxScore: number
  readonly completedAt: string
}

export interface ExperimentProgress {
  readonly experimentId: string
  readonly status: ProgressStatus
  readonly lastActivityAt: string
}

export interface LessonProgressRecord {
  readonly status: ProgressStatus
  readonly quizScore?: number
  readonly lastActivityAt: string
}

export interface ProjectProgressRecord {
  readonly status: ProgressStatus
  readonly lastActivityAt: string
}

export interface ProgressDocument {
  readonly version: 1
  readonly updatedAt: string
  readonly lessons: Readonly<Record<string, LessonProgressRecord>>
  readonly experiments: Readonly<Record<string, ExperimentProgress>>
  readonly projects: Readonly<Record<string, ProjectProgressRecord>>
  readonly quizzes: Readonly<Record<string, QuizProgress>>
  readonly bookmarks: readonly Bookmark[]
  readonly recentlyViewedComponents: readonly string[]
  readonly lastActivityAt: string
}
