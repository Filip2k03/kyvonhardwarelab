import { describe, expect, it } from 'vitest'
import {
  componentMatchesExplorerGroup,
  categoriesForExplorerGroup,
} from '@/lib/hardware/explorerGroups'
import { findCircuitsForHardwareSlug } from '@/lib/hardware/relatedCircuits'

describe('explorer groups', () => {
  it('maps family filters onto typed hardware categories', () => {
    expect(categoriesForExplorerGroup('sensors')).toEqual(['sensor'])
    expect(componentMatchesExplorerGroup('sensor', 'sensors')).toBe(true)
    expect(componentMatchesExplorerGroup('display', 'sensors')).toBe(false)
    expect(componentMatchesExplorerGroup('audio', 'all')).toBe(true)
  })
})

describe('related circuits', () => {
  it('finds SVG diagrams linked to a hardware slug', () => {
    const circuits = findCircuitsForHardwareSlug('dht11')
    expect(circuits.some((circuit) => circuit.slug === 'dht11')).toBe(true)
  })
})
