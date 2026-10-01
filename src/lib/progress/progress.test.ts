import { describe, expect, it } from 'vitest'
import { createEmptyProgress, validateProgressDocument } from '@/lib/progress/validateProgress'
import { parseProgressImport, saveProgressToStorage, loadProgressFromStorage } from '@/lib/progress/storage'
import { markLessonCompleted, markLessonInProgress } from '@/lib/progress/mutations'

describe('validateProgressDocument', () => {
  it('accepts an empty valid document', () => {
    const result = validateProgressDocument(createEmptyProgress('2026-01-01T00:00:00.000Z'))
    expect(result.ok).toBe(true)
  })

  it('rejects wrong versions', () => {
    const result = validateProgressDocument({
      ...createEmptyProgress('2026-01-01T00:00:00.000Z'),
      version: 2,
    })
    expect(result.ok).toBe(false)
  })

  it('rejects invalid lesson status', () => {
    const result = validateProgressDocument({
      ...createEmptyProgress('2026-01-01T00:00:00.000Z'),
      lessons: {
        'lesson-1': { status: 'DONE', lastActivityAt: '2026-01-01T00:00:00.000Z' },
      },
    })
    expect(result.ok).toBe(false)
  })
})

describe('progress storage', () => {
  it('round-trips through a memory store', () => {
    const memory = new Map<string, string>()
    const storage = {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => {
        memory.set(key, value)
      },
    }

    const started = markLessonInProgress(createEmptyProgress('2026-01-01T00:00:00.000Z'), 'lesson-a', '2026-01-01T01:00:00.000Z')
    saveProgressToStorage(started, storage)
    const loaded = loadProgressFromStorage(storage)
    expect(loaded.resetReason).toBeNull()
    expect(loaded.document.lessons['lesson-a']?.status).toBe('IN_PROGRESS')
  })

  it('resets corrupt JSON', () => {
    const storage = {
      getItem: () => '{not-json',
      setItem: () => undefined,
    }
    const loaded = loadProgressFromStorage(storage)
    expect(loaded.resetReason).toMatch(/valid JSON/i)
  })

  it('parses import payloads', () => {
    const completed = markLessonCompleted(
      createEmptyProgress('2026-01-01T00:00:00.000Z'),
      'lesson-a',
      2,
      '2026-01-01T02:00:00.000Z',
    )
    const raw = JSON.stringify(completed)
    const parsed = parseProgressImport(raw)
    expect(parsed.ok).toBe(true)
    if (parsed.ok) {
      expect(parsed.value.lessons['lesson-a']?.quizScore).toBe(2)
    }
  })

  it('rejects invalid import JSON', () => {
    expect(parseProgressImport('nope').ok).toBe(false)
  })
})
