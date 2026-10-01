import type { QuizQuestion } from '@/types/lesson'

export interface QuizAnswerMap {
  readonly [questionId: string]: string | undefined
}

export interface QuizQuestionResult {
  readonly questionId: string
  readonly selectedOptionId: string | undefined
  readonly correctOptionId: string
  readonly isCorrect: boolean
  readonly explanation: string
}

export interface QuizScoreResult {
  readonly score: number
  readonly maxScore: number
  readonly results: readonly QuizQuestionResult[]
}

export function scoreQuiz(
  questions: readonly QuizQuestion[],
  answers: QuizAnswerMap,
): QuizScoreResult {
  const results = questions.map((question) => {
    const correctOption = question.options.find((option) => option.correct)
    if (!correctOption) {
      throw new Error(`Quiz question “${question.id}” has no correct option.`)
    }

    const selectedOptionId = answers[question.id]
    return {
      questionId: question.id,
      selectedOptionId,
      correctOptionId: correctOption.id,
      isCorrect: selectedOptionId === correctOption.id,
      explanation: question.explanation,
    }
  })

  const score = results.filter((result) => result.isCorrect).length
  return {
    score,
    maxScore: questions.length,
    results,
  }
}
