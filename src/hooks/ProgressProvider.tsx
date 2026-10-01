import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ProgressDocument } from '@/types/progress'
import {
  loadProgressFromStorage,
  parseProgressImport,
  saveProgressToStorage,
  serializeProgress,
} from '@/lib/progress/storage'
import {
  getLessonStatus,
  getProjectStatus,
  isLessonBookmarked,
  markExperimentCompleted,
  markLessonCompleted,
  markLessonInProgress,
  markProjectCompleted,
  markProjectInProgress,
  recordComponentView,
  recordQuizResult,
  toggleLessonBookmark,
} from '@/lib/progress/mutations'
import { createEmptyProgress } from '@/lib/progress/validateProgress'
import { ProgressContext, type ProgressContextValue } from '@/hooks/progressContext'

export function ProgressProvider({ children }: { readonly children: ReactNode }) {
  const loaded = useMemo(() => loadProgressFromStorage(), [])
  const [document, setDocument] = useState<ProgressDocument>(loaded.document)
  const [storageNotice, setStorageNotice] = useState<string | null>(loaded.resetReason)

  useEffect(() => {
    saveProgressToStorage(document)
  }, [document])

  const update = useCallback((updater: (current: ProgressDocument) => ProgressDocument) => {
    setDocument((current) => updater(current))
  }, [])

  const value = useMemo<ProgressContextValue>(
    () => ({
      document,
      storageNotice,
      dismissNotice: () => setStorageNotice(null),
      getStatus: (lessonId) => getLessonStatus(document, lessonId),
      startLesson: (lessonId) => update((current) => markLessonInProgress(current, lessonId)),
      completeLesson: (lessonId, quizScore) =>
        update((current) => markLessonCompleted(current, lessonId, quizScore)),
      completeExperiment: (experimentId) =>
        update((current) => markExperimentCompleted(current, experimentId)),
      saveQuiz: (quizId, score, maxScore) =>
        update((current) => recordQuizResult(current, quizId, score, maxScore)),
      toggleBookmark: (lessonId) => update((current) => toggleLessonBookmark(current, lessonId)),
      isBookmarked: (lessonId) => isLessonBookmarked(document, lessonId),
      getProjectStatus: (projectId) => getProjectStatus(document, projectId),
      startProject: (projectId) => update((current) => markProjectInProgress(current, projectId)),
      completeProject: (projectId) => update((current) => markProjectCompleted(current, projectId)),
      recordComponentView: (componentId) =>
        update((current) => recordComponentView(current, componentId)),
      exportJson: () => serializeProgress(document),
      importJson: (raw) => {
        const parsed = parseProgressImport(raw)
        if (!parsed.ok) return { ok: false, error: parsed.error }
        setDocument(parsed.value)
        setStorageNotice(null)
        return { ok: true }
      },
      resetProgress: () => {
        setDocument(createEmptyProgress())
        setStorageNotice(null)
      },
    }),
    [document, storageNotice, update],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
