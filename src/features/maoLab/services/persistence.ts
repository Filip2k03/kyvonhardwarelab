const KEY = 'mao-lab-build-v1'

export interface MaoLabProgress {
  readonly completedStepIds: readonly string[]
  readonly activeStepId: string
  readonly updatedAt: string
}

const DEFAULT: MaoLabProgress = {
  completedStepIds: [],
  activeStepId: 'm0',
  updatedAt: new Date(0).toISOString(),
}

export function loadMaoProgress(): MaoLabProgress {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return DEFAULT
    const parsed = JSON.parse(raw) as MaoLabProgress
    if (!parsed || !Array.isArray(parsed.completedStepIds) || typeof parsed.activeStepId !== 'string') {
      return DEFAULT
    }
    return parsed
  } catch {
    return DEFAULT
  }
}

export function saveMaoProgress(next: MaoLabProgress): void {
  window.localStorage.setItem(KEY, JSON.stringify({ ...next, updatedAt: new Date().toISOString() }))
}

export function markStepComplete(stepId: string): MaoLabProgress {
  const current = loadMaoProgress()
  const completed = current.completedStepIds.includes(stepId)
    ? current.completedStepIds
    : [...current.completedStepIds, stepId]
  const next: MaoLabProgress = {
    completedStepIds: completed,
    activeStepId: stepId,
    updatedAt: new Date().toISOString(),
  }
  saveMaoProgress(next)
  return next
}
