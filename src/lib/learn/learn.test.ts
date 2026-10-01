import { describe, expect, it } from 'vitest'
import { scoreQuiz } from '@/lib/learn/scoreQuiz'
import { getAdjacentLessons, prerequisitesMet } from '@/lib/learn/curriculum'
import { CURRICULUM, findLessonBySlug, listLessons } from '@/data/lessons'

describe('curriculum data', () => {
  it('includes lessons 00–21', () => {
    expect(listLessons()).toHaveLength(22)
    expect(listLessons().map((lesson) => lesson.number)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    ])
  })

  it('requires educational sections on every lesson', () => {
    for (const lesson of CURRICULUM) {
      expect(lesson.theory.length).toBeGreaterThan(20)
      expect(lesson.prediction.length).toBeGreaterThan(10)
      expect(lesson.quiz.length).toBeGreaterThan(0)
      expect(lesson.safety.length).toBeGreaterThan(0)
    }
  })
})

describe('scoreQuiz', () => {
  const lesson = findLessonBySlug('electronics-fundamentals')
  if (!lesson) throw new Error('missing fixture lesson')

  it('scores correct answers', () => {
    const answers = Object.fromEntries(
      lesson.quiz.map((question) => {
        const correct = question.options.find((option) => option.correct)
        return [question.id, correct?.id]
      }),
    )
    const result = scoreQuiz(lesson.quiz, answers)
    expect(result.score).toBe(result.maxScore)
  })

  it('scores incorrect and missing answers as wrong', () => {
    const result = scoreQuiz(lesson.quiz, {})
    expect(result.score).toBe(0)
  })
})

describe('curriculum helpers', () => {
  it('returns adjacent lessons', () => {
    const { previous, next } = getAdjacentLessons(CURRICULUM, 'gpio')
    expect(previous?.slug).toBe('buttons-and-digital-input')
    expect(next?.slug).toBe('potentiometers')
  })

  it('checks prerequisites against completed ids', () => {
    const leds = findLessonBySlug('leds-and-resistors')
    if (!leds) throw new Error('missing lesson')
    const bySlug = new Map(CURRICULUM.map((lesson) => [lesson.slug, lesson]))
    expect(prerequisitesMet(leds, new Set(), bySlug)).toBe(false)
    const breadboard = findLessonBySlug('breadboard-fundamentals')
    expect(prerequisitesMet(leds, new Set([breadboard!.id]), bySlug)).toBe(true)
  })
})
