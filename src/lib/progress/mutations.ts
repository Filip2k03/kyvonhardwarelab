import type { ProgressDocument, LessonProgressRecord } from '@/types/progress'
import type { ProgressStatus } from '@/types/hardware'

function touch(document: ProgressDocument, now: string): ProgressDocument {
  return {
    ...document,
    updatedAt: now,
    lastActivityAt: now,
  }
}

export function getLessonStatus(document: ProgressDocument, lessonId: string): ProgressStatus {
  return document.lessons[lessonId]?.status ?? 'NOT_STARTED'
}

export function markLessonInProgress(
  document: ProgressDocument,
  lessonId: string,
  now = new Date().toISOString(),
): ProgressDocument {
  const existing = document.lessons[lessonId]
  if (existing?.status === 'IN_PROGRESS' || existing?.status === 'COMPLETED') {
    return document
  }

  const next: LessonProgressRecord = { status: 'IN_PROGRESS', lastActivityAt: now }

  return touch(
    {
      ...document,
      lessons: {
        ...document.lessons,
        [lessonId]: next,
      },
    },
    now,
  )
}

export function markLessonCompleted(
  document: ProgressDocument,
  lessonId: string,
  quizScore: number | undefined,
  now = new Date().toISOString(),
): ProgressDocument {
  const next: LessonProgressRecord =
    quizScore === undefined
      ? { status: 'COMPLETED', lastActivityAt: now }
      : { status: 'COMPLETED', lastActivityAt: now, quizScore }

  return touch(
    {
      ...document,
      lessons: {
        ...document.lessons,
        [lessonId]: next,
      },
    },
    now,
  )
}

export function markExperimentCompleted(
  document: ProgressDocument,
  experimentId: string,
  now = new Date().toISOString(),
): ProgressDocument {
  return touch(
    {
      ...document,
      experiments: {
        ...document.experiments,
        [experimentId]: {
          experimentId,
          status: 'COMPLETED',
          lastActivityAt: now,
        },
      },
    },
    now,
  )
}

export function recordQuizResult(
  document: ProgressDocument,
  quizId: string,
  score: number,
  maxScore: number,
  now = new Date().toISOString(),
): ProgressDocument {
  return touch(
    {
      ...document,
      quizzes: {
        ...document.quizzes,
        [quizId]: {
          quizId,
          score,
          maxScore,
          completedAt: now,
        },
      },
    },
    now,
  )
}

export function toggleLessonBookmark(
  document: ProgressDocument,
  lessonId: string,
  now = new Date().toISOString(),
): ProgressDocument {
  const existing = document.bookmarks.find(
    (bookmark) => bookmark.kind === 'lesson' && bookmark.targetId === lessonId,
  )

  if (existing) {
    return touch(
      {
        ...document,
        bookmarks: document.bookmarks.filter((bookmark) => bookmark.id !== existing.id),
      },
      now,
    )
  }

  return touch(
    {
      ...document,
      bookmarks: [
        ...document.bookmarks,
        {
          id: `bookmark-lesson-${lessonId}`,
          kind: 'lesson',
          targetId: lessonId,
          createdAt: now,
        },
      ],
    },
    now,
  )
}

export function isLessonBookmarked(document: ProgressDocument, lessonId: string): boolean {
  return document.bookmarks.some((bookmark) => bookmark.kind === 'lesson' && bookmark.targetId === lessonId)
}

export function markProjectCompleted(
  document: ProgressDocument,
  projectId: string,
  now = new Date().toISOString(),
): ProgressDocument {
  return touch(
    {
      ...document,
      projects: {
        ...document.projects,
        [projectId]: {
          status: 'COMPLETED',
          lastActivityAt: now,
        },
      },
    },
    now,
  )
}

export function markProjectInProgress(
  document: ProgressDocument,
  projectId: string,
  now = new Date().toISOString(),
): ProgressDocument {
  const existing = document.projects[projectId]
  if (existing?.status === 'IN_PROGRESS' || existing?.status === 'COMPLETED') {
    return document
  }
  return touch(
    {
      ...document,
      projects: {
        ...document.projects,
        [projectId]: {
          status: 'IN_PROGRESS',
          lastActivityAt: now,
        },
      },
    },
    now,
  )
}

export function getProjectStatus(document: ProgressDocument, projectId: string): ProgressStatus {
  return document.projects[projectId]?.status ?? 'NOT_STARTED'
}

const MAX_RECENT_COMPONENTS = 8

export function recordComponentView(
  document: ProgressDocument,
  componentId: string,
  now = new Date().toISOString(),
): ProgressDocument {
  const trimmed = componentId.trim()
  if (!trimmed) return document
  if (document.recentlyViewedComponents[0] === trimmed) return document

  const nextRecent = [
    trimmed,
    ...document.recentlyViewedComponents.filter((id) => id !== trimmed),
  ].slice(0, MAX_RECENT_COMPONENTS)

  return touch(
    {
      ...document,
      recentlyViewedComponents: nextRecent,
    },
    now,
  )
}
