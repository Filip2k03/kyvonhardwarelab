import type { Lesson } from '@/types/lesson'

export function getLessonBySlug(
  lessons: readonly Lesson[],
  slug: string,
): Lesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug)
}

export function getAdjacentLessons(
  lessons: readonly Lesson[],
  slug: string,
): { readonly previous: Lesson | undefined; readonly next: Lesson | undefined } {
  const ordered = [...lessons].sort((a, b) => a.number - b.number)
  const index = ordered.findIndex((lesson) => lesson.slug === slug)
  if (index < 0) {
    return { previous: undefined, next: undefined }
  }
  return {
    previous: ordered[index - 1],
    next: ordered[index + 1],
  }
}

export function prerequisitesMet(
  lesson: Lesson,
  completedLessonIds: ReadonlySet<string>,
  lessonsBySlug: ReadonlyMap<string, Lesson>,
): boolean {
  return lesson.prerequisites.every((slug) => {
    const required = lessonsBySlug.get(slug)
    return required ? completedLessonIds.has(required.id) : false
  })
}
