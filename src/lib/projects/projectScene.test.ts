import { describe, expect, it } from 'vitest'
import { findProjectBySlug, listProjects } from '@/data/projects'
import { buildProjectScene } from '@/lib/projects/buildProjectScene'
import { narrateProjectIntro, narrateProjectStep } from '@/lib/audio/projectStepNarration'
import { resolvePageNarration } from '@/lib/audio/resolvePageNarration'

describe('project 3D scenes', () => {
  it('builds a stepped scene for every project', () => {
    for (const project of listProjects()) {
      const scene = buildProjectScene(project)
      expect(scene.steps).toHaveLength(project.constructionSteps.length)
      expect(scene.parts.length).toBe(project.bom.length)
      expect(scene.steps[0]?.visiblePartIds.length).toBeGreaterThan(0)
    }
  })

  it('writes human step narration and resolves the 3d route', () => {
    const blink = findProjectBySlug('blink')!
    const scene = buildProjectScene(blink)
    const step = scene.steps[0]!
    expect(narrateProjectIntro(blink)).toMatch(/3D walkthrough/i)
    expect(narrateProjectStep(blink, step, scene.steps.length)).toMatch(/step one/i)
    expect(resolvePageNarration('/projects/blink/3d').id).toContain('project3d:')
  })
})
