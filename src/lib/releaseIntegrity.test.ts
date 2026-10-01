import { describe, expect, it } from 'vitest'
import { listProjects } from '@/data/projects'
import { listLessons, findLessonBySlug } from '@/data/lessons'
import { findHardwareById, findHardwareBySlug, listHardware } from '@/data/hardware'
import { findCircuitBySlug, listCircuits } from '@/data/circuits'
import { UNO_BOARD_HOTSPOTS } from '@/data/lab3d/unoBoard'
import { buildProjectScene } from '@/lib/projects/buildProjectScene'

describe('release data integrity', () => {
  it('keeps project BOM, prerequisites, circuits, and 3D scenes coherent', () => {
    const projects = listProjects()
    expect(projects.length).toBe(30)

    for (const project of projects) {
      for (const item of project.bom) {
        expect(findHardwareById(item.componentId), `${project.slug} bom ${item.componentId}`).toBeTruthy()
      }
      for (const slug of project.prerequisites) {
        expect(findLessonBySlug(slug), `${project.slug} prereq ${slug}`).toBeTruthy()
      }
      if (project.circuitId) {
        expect(findCircuitBySlug(project.circuitId), `${project.slug} circuit`).toBeTruthy()
      }
      const scene = buildProjectScene(project)
      expect(scene.steps).toHaveLength(project.constructionSteps.length)
      expect(scene.parts).toHaveLength(project.bom.length)
    }
  })

  it('keeps lesson prerequisites and hardware slugs resolvable', () => {
    for (const lesson of listLessons()) {
      for (const slug of lesson.prerequisites) {
        expect(findLessonBySlug(slug), `${lesson.slug} prereq ${slug}`).toBeTruthy()
      }
      for (const slug of lesson.requiredHardware) {
        expect(findHardwareBySlug(slug), `${lesson.slug} hardware ${slug}`).toBeTruthy()
      }
    }
  })

  it('keeps 3D hotspot and circuit related links resolvable', () => {
    expect(listHardware().length).toBeGreaterThan(20)
    expect(listCircuits().length).toBeGreaterThan(5)

    for (const hotspot of UNO_BOARD_HOTSPOTS) {
      if (hotspot.relatedComponentSlug) {
        expect(findHardwareBySlug(hotspot.relatedComponentSlug)).toBeTruthy()
      }
      if (hotspot.relatedLessonSlug) {
        expect(findLessonBySlug(hotspot.relatedLessonSlug)).toBeTruthy()
      }
    }

    for (const circuit of listCircuits()) {
      for (const slug of circuit.relatedLessonSlugs ?? []) {
        expect(findLessonBySlug(slug), `circuit ${circuit.slug} lesson ${slug}`).toBeTruthy()
      }
      for (const slug of circuit.relatedHardwareSlugs ?? []) {
        expect(findHardwareBySlug(slug), `circuit ${circuit.slug} hw ${slug}`).toBeTruthy()
      }
    }
  })
})
