import { describe, expect, it } from 'vitest'
import {
  PROJECT_LIBRARY,
  filterProjects,
  findProjectBySlug,
  listProjects,
  projectPrerequisitesMet,
} from '@/data/projects'
import { CURRICULUM } from '@/data/lessons'
import { findHardwareById } from '@/data/hardware'

describe('project library', () => {
  it('includes projects 01–30', () => {
    expect(listProjects()).toHaveLength(30)
    expect(listProjects().map((project) => project.number)).toEqual(
      Array.from({ length: 30 }, (_, index) => index + 1),
    )
  })

  it('requires complete educational fields', () => {
    for (const project of PROJECT_LIBRARY) {
      expect(project.objective.length).toBeGreaterThan(10)
      expect(project.bom.length).toBeGreaterThan(0)
      expect(project.constructionSteps.length).toBeGreaterThan(0)
      expect(project.safety.length).toBeGreaterThan(0)
      expect(project.firmware.length).toBeGreaterThan(5)
    }
  })

  it('references known hardware ids in BOM', () => {
    for (const project of PROJECT_LIBRARY) {
      for (const item of project.bom) {
        expect(findHardwareById(item.componentId), item.componentId).toBeDefined()
      }
    }
  })
})

describe('filterProjects', () => {
  it('filters by category and query', () => {
    const sensors = filterProjects(PROJECT_LIBRARY, { category: 'sensors', query: 'water' })
    expect(sensors).toHaveLength(1)
    expect(sensors[0]?.slug).toBe('water-leak-alarm')
  })

  it('filters by difficulty', () => {
    const advanced = filterProjects(PROJECT_LIBRARY, { difficulty: 'advanced' })
    expect(advanced.every((project) => project.difficulty === 'advanced')).toBe(true)
    expect(advanced.length).toBeGreaterThan(0)
  })
})

describe('projectPrerequisitesMet', () => {
  it('resolves lesson slug prerequisites', () => {
    const blink = findProjectBySlug('blink')
    expect(blink).toBeDefined()
    const bySlug = new Map(CURRICULUM.map((lesson) => [lesson.slug, lesson.id]))
    expect(projectPrerequisitesMet(blink!, new Set(), bySlug)).toBe(false)
    const leds = CURRICULUM.find((lesson) => lesson.slug === 'leds-and-resistors')
    expect(projectPrerequisitesMet(blink!, new Set([leds!.id]), bySlug)).toBe(true)
  })
})
