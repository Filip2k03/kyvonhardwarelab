import type { ProgressStatus } from './hardware'

export type { ProgressStatus }

export interface QuizOption {
  readonly id: string
  readonly label: string
  readonly correct: boolean
}

export interface QuizQuestion {
  readonly id: string
  readonly prompt: string
  readonly options: readonly QuizOption[]
  readonly explanation: string
}

export interface Lesson {
  readonly id: string
  readonly slug: string
  readonly number: number
  readonly title: string
  readonly objective: string
  readonly prerequisites: readonly string[]
  readonly requiredHardware: readonly string[]
  readonly safety: readonly string[]
  readonly theory: string
  readonly visualExplanation: string
  readonly wiring: string
  readonly prediction: string
  readonly firmware: string
  readonly codeWalkthrough: string
  readonly physicalExperiment: string
  readonly expectedResult: string
  readonly measurements: readonly string[]
  readonly commonMistakes: readonly string[]
  readonly debugging: readonly string[]
  readonly challenge: string
  readonly miniProject: string
  readonly quiz: readonly QuizQuestion[]
}

export interface LessonProgress {
  readonly lessonId: string
  readonly status: ProgressStatus
  readonly quizScore?: number
  readonly lastActivityAt: string
}
