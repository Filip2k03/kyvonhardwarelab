import type { Lesson, QuizQuestion } from '@/types/lesson'

interface LessonDraft extends Omit<Lesson, 'id'> {
  readonly id?: string
}

export function defineLesson(draft: LessonDraft): Lesson {
  return {
    ...draft,
    id: draft.id ?? `lesson-${String(draft.number).padStart(2, '0')}-${draft.slug}`,
  }
}

export function q(
  id: string,
  prompt: string,
  options: readonly { readonly id: string; readonly label: string; readonly correct?: boolean }[],
  explanation: string,
): QuizQuestion {
  return {
    id,
    prompt,
    explanation,
    options: options.map((option) => ({
      id: option.id,
      label: option.label,
      correct: option.correct === true,
    })),
  }
}
