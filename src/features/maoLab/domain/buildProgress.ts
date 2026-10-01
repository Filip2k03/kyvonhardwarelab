import { MAO_BUILD_STEPS } from '@/features/maoLab/data/milestones'
import { photoChecklistForStep } from '@/features/maoLab/data/photoChecklists'

/** Soft ladder: later bench steps should not skip earlier verified ones. */
export const BUILD_STEP_REQUIRES: Readonly<Record<string, readonly string[]>> = {
  m1: ['m0'],
  m2: ['m1'],
  m3: ['m2'],
  m4: ['m3'],
  m5: ['m3'],
  m6: ['m3'],
  m7: ['m3'],
  m8: ['m3'],
}

export function requiredStepsFor(stepId: string): readonly string[] {
  return BUILD_STEP_REQUIRES[stepId] ?? []
}

export function missingPrerequisites(
  stepId: string,
  completedStepIds: readonly string[],
): readonly string[] {
  return requiredStepsFor(stepId).filter((id) => !completedStepIds.includes(id))
}

export function stepTitle(stepId: string): string {
  const step = MAO_BUILD_STEPS.find((item) => item.id === stepId)
  return step ? `M${step.index} ${step.title}` : stepId
}

export function canMarkStepComplete(
  stepId: string,
  completedStepIds: readonly string[],
  checkedPhotoItemIds: readonly string[] = [],
): { readonly ok: boolean; readonly reasons: readonly string[] } {
  const reasons: string[] = []
  const step = MAO_BUILD_STEPS.find((item) => item.id === stepId)
  if (!step) {
    return { ok: false, reasons: ['Unknown build step'] }
  }
  if (step.blockedReason) {
    reasons.push(step.blockedReason)
  }
  for (const missing of missingPrerequisites(stepId, completedStepIds)) {
    reasons.push(`Complete ${stepTitle(missing)} first`)
  }
  const checklist = photoChecklistForStep(stepId)
  if (checklist) {
    const pending = checklist.items.filter((item) => !checkedPhotoItemIds.includes(item.id))
    if (pending.length > 0) {
      reasons.push(`Check all ${pending.length} photo-checklist items`)
    }
  }
  return { ok: reasons.length === 0, reasons }
}
