import { FUNDAMENTALS_LESSONS } from './fundamentals'
import { INTERMEDIATE_LESSONS } from './intermediate'
import { ADVANCED_LESSONS } from './advanced'
import type { Lesson } from '@/types/lesson'
import { getAdjacentLessons, getLessonBySlug } from '@/lib/learn/curriculum'

export const CURRICULUM: readonly Lesson[] = [
  ...FUNDAMENTALS_LESSONS,
  ...INTERMEDIATE_LESSONS,
  ...ADVANCED_LESSONS,
]

export function listLessons(): readonly Lesson[] {
  return CURRICULUM
}

export function findLessonBySlug(slug: string): Lesson | undefined {
  return getLessonBySlug(CURRICULUM, slug)
}

export function findAdjacentLessons(slug: string) {
  return getAdjacentLessons(CURRICULUM, slug)
}

export function lessonsBySlugMap(): ReadonlyMap<string, Lesson> {
  return new Map(CURRICULUM.map((lesson) => [lesson.slug, lesson]))
}
