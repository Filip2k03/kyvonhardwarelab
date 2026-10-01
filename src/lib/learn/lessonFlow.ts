export const LESSON_FLOW_STAGES = [
  {
    id: 'learn',
    label: 'Learn',
    hint: 'Theory and visual model',
  },
  {
    id: 'build',
    label: 'Build',
    hint: 'Parts, safety, wiring, firmware',
  },
  {
    id: 'experiment',
    label: 'Experiment',
    hint: 'Physical run and measurements',
  },
  {
    id: 'challenge',
    label: 'Challenge',
    hint: 'Extension work and quiz',
  },
] as const

export type LessonFlowStageId = (typeof LESSON_FLOW_STAGES)[number]['id']

export function isLessonFlowStage(value: string | null): value is LessonFlowStageId {
  return LESSON_FLOW_STAGES.some((stage) => stage.id === value)
}

export function nextLessonFlowStage(current: LessonFlowStageId): LessonFlowStageId | null {
  const index = LESSON_FLOW_STAGES.findIndex((stage) => stage.id === current)
  if (index < 0 || index >= LESSON_FLOW_STAGES.length - 1) return null
  return LESSON_FLOW_STAGES[index + 1]!.id
}

export function previousLessonFlowStage(current: LessonFlowStageId): LessonFlowStageId | null {
  const index = LESSON_FLOW_STAGES.findIndex((stage) => stage.id === current)
  if (index <= 0) return null
  return LESSON_FLOW_STAGES[index - 1]!.id
}
