import type { HardwareCategory } from '@/types/hardware'

/** Engineering catalog filter groups (UI), mapped onto typed HardwareCategory values. */
export const EXPLORER_GROUPS = [
  { id: 'sensors', label: 'Sensors', categories: ['sensor'] as const },
  { id: 'input', label: 'Input', categories: ['input', 'identification'] as const },
  { id: 'display', label: 'Display', categories: ['display', 'lighting'] as const },
  { id: 'motion', label: 'Motion', categories: ['motion'] as const },
  { id: 'communication', label: 'Communication', categories: ['identification', 'time'] as const },
  { id: 'power', label: 'Power', categories: ['power', 'switching'] as const },
  { id: 'logic', label: 'Logic', categories: ['logic', 'controller'] as const },
  { id: 'output', label: 'Output', categories: ['audio', 'switching', 'lighting', 'motion'] as const },
] as const

export type ExplorerGroupId = (typeof EXPLORER_GROUPS)[number]['id'] | 'all'

export function categoriesForExplorerGroup(group: ExplorerGroupId): readonly HardwareCategory[] | null {
  if (group === 'all') return null
  const match = EXPLORER_GROUPS.find((item) => item.id === group)
  return match ? [...match.categories] : null
}

export function componentMatchesExplorerGroup(
  category: HardwareCategory,
  group: ExplorerGroupId,
): boolean {
  const categories = categoriesForExplorerGroup(group)
  if (!categories) return true
  return categories.includes(category)
}
