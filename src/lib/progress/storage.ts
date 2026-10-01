import type { ProgressDocument } from '@/types/progress'
import {
  PROGRESS_STORAGE_KEY,
  createEmptyProgress,
  validateProgressDocument,
} from '@/lib/progress/validateProgress'

export interface ProgressLoadResult {
  readonly document: ProgressDocument
  readonly resetReason: string | null
}

export function loadProgressFromStorage(
  storage: Pick<Storage, 'getItem'> = localStorage,
): ProgressLoadResult {
  const raw = storage.getItem(PROGRESS_STORAGE_KEY)
  if (raw === null) {
    return { document: createEmptyProgress(), resetReason: null }
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    const validated = validateProgressDocument(parsed)
    if (!validated.ok) {
      return {
        document: createEmptyProgress(),
        resetReason: validated.error,
      }
    }
    return { document: validated.value, resetReason: null }
  } catch {
    return {
      document: createEmptyProgress(),
      resetReason: 'Stored progress was not valid JSON and was reset.',
    }
  }
}

export function saveProgressToStorage(
  document: ProgressDocument,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  const validated = validateProgressDocument(document)
  if (!validated.ok) {
    throw new Error(`Refusing to write invalid progress: ${validated.error}`)
  }
  storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(validated.value))
}

export function serializeProgress(document: ProgressDocument): string {
  const validated = validateProgressDocument(document)
  if (!validated.ok) {
    throw new Error(validated.error)
  }
  return JSON.stringify(validated.value, null, 2)
}

export function parseProgressImport(raw: string): ReturnType<typeof validateProgressDocument> {
  try {
    const parsed: unknown = JSON.parse(raw)
    return validateProgressDocument(parsed)
  } catch {
    return { ok: false, error: 'Import file is not valid JSON.' }
  }
}
