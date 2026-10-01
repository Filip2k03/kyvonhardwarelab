import { listCircuits } from '@/data/circuits'
import type { CircuitDefinition } from '@/types/circuit'

export function findCircuitsForHardwareSlug(slug: string): readonly CircuitDefinition[] {
  return listCircuits().filter((circuit) =>
    (circuit.relatedHardwareSlugs ?? []).includes(slug),
  )
}
