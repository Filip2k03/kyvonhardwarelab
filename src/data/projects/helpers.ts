import type { Project, ProjectBomItem, ProjectStep } from '@/types/project'

type ProjectDraft = Omit<Project, 'id'> & { readonly id?: string }

export function defineProject(draft: ProjectDraft): Project {
  return {
    ...draft,
    id: draft.id ?? `project-${String(draft.number).padStart(2, '0')}-${draft.slug}`,
  }
}

export function bom(componentId: string, quantity: number, notes?: string): ProjectBomItem {
  return notes === undefined ? { componentId, quantity } : { componentId, quantity, notes }
}

export function step(id: string, title: string, instructions: string): ProjectStep {
  return { id, title, instructions }
}
