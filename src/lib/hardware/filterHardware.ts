import type { Difficulty, HardwareCategory, HardwareComponent } from '@/types/hardware'

export interface HardwareFilterOptions {
  readonly query?: string
  readonly category?: HardwareCategory | 'all'
  readonly difficulty?: Difficulty | 'all'
}

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function matchesQuery(component: HardwareComponent, query: string): boolean {
  if (!query) return true

  const haystack = [
    component.name,
    component.slug,
    component.description,
    component.operatingPrinciple,
    component.category,
    ...component.interfaces,
    ...component.useCases,
    ...component.pins.map((pin) => `${pin.name} ${pin.description}`),
  ]
    .join(' ')
    .toLowerCase()

  const tokens = query.split(/\s+/).filter(Boolean)
  return tokens.every((token) => haystack.includes(token))
}

export function filterHardware(
  components: readonly HardwareComponent[],
  options: HardwareFilterOptions = {},
): HardwareComponent[] {
  const query = normalize(options.query ?? '')
  const category = options.category ?? 'all'
  const difficulty = options.difficulty ?? 'all'

  return components.filter((component) => {
    if (category !== 'all' && component.category !== category) return false
    if (difficulty !== 'all' && component.difficulty !== difficulty) return false
    return matchesQuery(component, query)
  })
}

export function getHardwareBySlug(
  components: readonly HardwareComponent[],
  slug: string,
): HardwareComponent | undefined {
  return components.find((component) => component.slug === slug)
}

export function getHardwareById(
  components: readonly HardwareComponent[],
  id: string,
): HardwareComponent | undefined {
  return components.find((component) => component.id === id)
}
