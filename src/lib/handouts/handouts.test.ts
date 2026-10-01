import { describe, expect, it } from 'vitest'
import { listLessons } from '@/data/lessons'
import { listProjects } from '@/data/projects'
import { lessonToHandout, projectToHandout } from '@/lib/handouts/buildHandout'

const REQUIRED = [
  'OBJECTIVES',
  'THEORY',
  'COMPONENTS',
  'CIRCUIT',
  'PREDICTION',
  'PROCEDURE',
  'MEASUREMENTS',
  'OBSERVATIONS',
  'DEBUGGING',
  'CHALLENGE',
  'NOTES',
]

describe('handout builders', () => {
  it('maps every lesson to the worksheet sections', () => {
    for (const lesson of listLessons()) {
      const sheet = lessonToHandout(lesson)
      expect(sheet.kind).toBe('lesson')
      expect(sheet.title).toBe(lesson.title)
      expect(sheet.sections.map((block) => block.title.toUpperCase())).toEqual(REQUIRED)
      const circuit = sheet.sections.find((block) => block.id === 'circuit')
      expect(circuit?.avoidPageBreak).toBe(true)
    }
  })

  it('maps every project and keeps the circuit block intact', () => {
    const blink = listProjects().find((project) => project.slug === 'blink')
    expect(blink).toBeDefined()
    const sheet = projectToHandout(blink!)
    expect(sheet.kind).toBe('project')
    expect(sheet.sections.map((block) => block.title.toUpperCase())).toEqual(REQUIRED)
    expect(sheet.sections.find((block) => block.id === 'components')?.items?.length).toBe(
      blink!.bom.length,
    )
    expect(sheet.sections.find((block) => block.id === 'circuit')?.avoidPageBreak).toBe(true)
  })
})
