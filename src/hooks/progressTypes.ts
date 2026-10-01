import type { ProgressDocument } from '@/types/progress'
import type { ProgressStatus } from '@/types/hardware'

export interface ProgressContextValue {
  readonly document: ProgressDocument
  readonly storageNotice: string | null
  readonly dismissNotice: () => void
  readonly getStatus: (lessonId: string) => ProgressStatus
  readonly startLesson: (lessonId: string) => void
  readonly completeLesson: (lessonId: string, quizScore?: number) => void
  readonly completeExperiment: (experimentId: string) => void
  readonly saveQuiz: (quizId: string, score: number, maxScore: number) => void
  readonly toggleBookmark: (lessonId: string) => void
  readonly isBookmarked: (lessonId: string) => boolean
  readonly getProjectStatus: (projectId: string) => ProgressStatus
  readonly startProject: (projectId: string) => void
  readonly completeProject: (projectId: string) => void
  readonly recordComponentView: (componentId: string) => void
  readonly exportJson: () => string
  readonly importJson: (raw: string) => { ok: true } | { ok: false; error: string }
  readonly resetProgress: () => void
}
