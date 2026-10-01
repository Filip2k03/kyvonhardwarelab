import { describe, expect, it } from 'vitest'
import { createEmptyProgress } from '@/lib/progress/validateProgress'
import {
  markLessonInProgress,
  recordComponentView,
  toggleLessonBookmark,
} from '@/lib/progress/mutations'
import { buildDashboardSummary } from '@/lib/dashboard/summary'
import { listLessons } from '@/data/lessons'

describe('dashboard summary', () => {
  it('points continue learning at the first lesson when nothing is started', () => {
    const summary = buildDashboardSummary(createEmptyProgress())
    expect(summary.continueLesson?.slug).toBe(listLessons()[0]?.slug)
    expect(summary.lessonCounts.completed).toBe(0)
    expect(summary.recentComponents).toHaveLength(0)
  })

  it('surfaces bookmarks, recent components, and in-progress lessons', () => {
    let doc = createEmptyProgress()
    const first = listLessons()[0]!
    const second = listLessons()[1]!
    doc = markLessonInProgress(doc, second.id)
    doc = toggleLessonBookmark(doc, first.id)
    doc = recordComponentView(doc, 'hw-dht11')
    doc = recordComponentView(doc, 'hw-led-red')
    doc = recordComponentView(doc, 'hw-dht11')

    const summary = buildDashboardSummary(doc)
    expect(summary.continueLesson?.id).toBe(second.id)
    expect(summary.bookmarkedLessons.map((lesson) => lesson.id)).toContain(first.id)
    expect(summary.recentComponents.map((component) => component.id)).toEqual([
      'hw-dht11',
      'hw-led-red',
    ])
  })
})
