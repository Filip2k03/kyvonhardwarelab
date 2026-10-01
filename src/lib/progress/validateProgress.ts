import type { ProgressDocument } from '@/types/progress'

export const PROGRESS_STORAGE_KEY = 'kyvon-hardware-lab:progress:v1' as const

export function createEmptyProgress(now = new Date().toISOString()): ProgressDocument {
  return {
    version: 1,
    updatedAt: now,
    lessons: {},
    experiments: {},
    projects: {},
    quizzes: {},
    bookmarks: [],
    recentlyViewedComponents: [],
    lastActivityAt: now,
  }
}

export type ProgressValidationResult =
  | { readonly ok: true; readonly value: ProgressDocument }
  | { readonly ok: false; readonly error: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isProgressStatus(value: unknown): value is 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' {
  return value === 'NOT_STARTED' || value === 'IN_PROGRESS' || value === 'COMPLETED'
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}

export function validateProgressDocument(input: unknown): ProgressValidationResult {
  if (!isRecord(input)) {
    return { ok: false, error: 'Progress JSON must be an object.' }
  }

  if (input.version !== 1) {
    return { ok: false, error: 'Unsupported progress schema version. Expected version 1.' }
  }

  if (!isIsoTimestamp(input.updatedAt) || !isIsoTimestamp(input.lastActivityAt)) {
    return { ok: false, error: 'updatedAt and lastActivityAt must be valid ISO timestamps.' }
  }

  if (!isRecord(input.lessons) || !isRecord(input.experiments) || !isRecord(input.projects) || !isRecord(input.quizzes)) {
    return { ok: false, error: 'lessons, experiments, projects, and quizzes must be objects.' }
  }

  if (!Array.isArray(input.bookmarks) || !Array.isArray(input.recentlyViewedComponents)) {
    return { ok: false, error: 'bookmarks and recentlyViewedComponents must be arrays.' }
  }

  const lessons: Record<string, ProgressDocument['lessons'][string]> = {}
  for (const [lessonId, record] of Object.entries(input.lessons)) {
    if (!isRecord(record) || !isProgressStatus(record.status) || !isIsoTimestamp(record.lastActivityAt)) {
      return { ok: false, error: `Invalid lesson progress for “${lessonId}”.` }
    }
    if (record.quizScore !== undefined && (typeof record.quizScore !== 'number' || record.quizScore < 0)) {
      return { ok: false, error: `Invalid quizScore for lesson “${lessonId}”.` }
    }
    lessons[lessonId] =
      record.quizScore === undefined
        ? { status: record.status, lastActivityAt: record.lastActivityAt }
        : {
            status: record.status,
            lastActivityAt: record.lastActivityAt,
            quizScore: record.quizScore,
          }
  }

  const experiments: Record<string, ProgressDocument['experiments'][string]> = {}
  for (const [experimentId, record] of Object.entries(input.experiments)) {
    if (
      !isRecord(record) ||
      typeof record.experimentId !== 'string' ||
      record.experimentId !== experimentId ||
      !isProgressStatus(record.status) ||
      !isIsoTimestamp(record.lastActivityAt)
    ) {
      return { ok: false, error: `Invalid experiment progress for “${experimentId}”.` }
    }
    experiments[experimentId] = {
      experimentId,
      status: record.status,
      lastActivityAt: record.lastActivityAt,
    }
  }

  const projects: Record<string, ProgressDocument['projects'][string]> = {}
  for (const [projectId, record] of Object.entries(input.projects)) {
    if (!isRecord(record) || !isProgressStatus(record.status) || !isIsoTimestamp(record.lastActivityAt)) {
      return { ok: false, error: `Invalid project progress for “${projectId}”.` }
    }
    projects[projectId] = {
      status: record.status,
      lastActivityAt: record.lastActivityAt,
    }
  }

  const quizzes: Record<string, ProgressDocument['quizzes'][string]> = {}
  for (const [quizId, record] of Object.entries(input.quizzes)) {
    if (
      !isRecord(record) ||
      typeof record.quizId !== 'string' ||
      record.quizId !== quizId ||
      typeof record.score !== 'number' ||
      typeof record.maxScore !== 'number' ||
      record.score < 0 ||
      record.maxScore <= 0 ||
      record.score > record.maxScore ||
      !isIsoTimestamp(record.completedAt)
    ) {
      return { ok: false, error: `Invalid quiz progress for “${quizId}”.` }
    }
    quizzes[quizId] = {
      quizId,
      score: record.score,
      maxScore: record.maxScore,
      completedAt: record.completedAt,
    }
  }

  const bookmarks: ProgressDocument['bookmarks'][number][] = []
  for (const bookmark of input.bookmarks) {
    if (
      !isRecord(bookmark) ||
      typeof bookmark.id !== 'string' ||
      (bookmark.kind !== 'lesson' && bookmark.kind !== 'component' && bookmark.kind !== 'project') ||
      typeof bookmark.targetId !== 'string' ||
      !isIsoTimestamp(bookmark.createdAt)
    ) {
      return { ok: false, error: 'Invalid bookmark entry.' }
    }
    bookmarks.push({
      id: bookmark.id,
      kind: bookmark.kind,
      targetId: bookmark.targetId,
      createdAt: bookmark.createdAt,
    })
  }

  const recentlyViewedComponents: string[] = []
  for (const componentId of input.recentlyViewedComponents) {
    if (typeof componentId !== 'string' || componentId.length === 0) {
      return { ok: false, error: 'recentlyViewedComponents must contain non-empty strings.' }
    }
    recentlyViewedComponents.push(componentId)
  }

  return {
    ok: true,
    value: {
      version: 1,
      updatedAt: input.updatedAt,
      lessons,
      experiments,
      projects,
      quizzes,
      bookmarks,
      recentlyViewedComponents,
      lastActivityAt: input.lastActivityAt,
    },
  }
}
