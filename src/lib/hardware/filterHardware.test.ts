import { describe, expect, it } from 'vitest'
import { HARDWARE_CATALOG, findHardwareBySlug, listHardware } from '@/data/hardware'
import { filterHardware } from '@/lib/hardware/filterHardware'

describe('hardware catalog data', () => {
  it('includes every kit category represented at least once', () => {
    const categories = new Set(HARDWARE_CATALOG.map((item) => item.category))
    expect(categories.has('controller')).toBe(true)
    expect(categories.has('sensor')).toBe(true)
    expect(categories.has('motion')).toBe(true)
    expect(categories.has('passive')).toBe(true)
    expect(categories.has('power')).toBe(true)
  })

  it('uses unique ids and slugs', () => {
    const ids = HARDWARE_CATALOG.map((item) => item.id)
    const slugs = HARDWARE_CATALOG.map((item) => item.slug)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('finds components by slug', () => {
    expect(findHardwareBySlug('dht11')?.name).toMatch(/DHT11/)
    expect(findHardwareBySlug('missing')).toBeUndefined()
  })
})

describe('filterHardware', () => {
  const catalog = listHardware()

  it('returns all components when filters are empty', () => {
    expect(filterHardware(catalog)).toHaveLength(catalog.length)
  })

  it('filters by category', () => {
    const sensors = filterHardware(catalog, { category: 'sensor' })
    expect(sensors.length).toBeGreaterThan(0)
    expect(sensors.every((item) => item.category === 'sensor')).toBe(true)
  })

  it('filters by difficulty', () => {
    const beginners = filterHardware(catalog, { difficulty: 'beginner' })
    expect(beginners.length).toBeGreaterThan(0)
    expect(beginners.every((item) => item.difficulty === 'beginner')).toBe(true)
  })

  it('searches by name tokens', () => {
    const results = filterHardware(catalog, { query: 'dht11 humidity' })
    expect(results.some((item) => item.slug === 'dht11')).toBe(true)
  })

  it('searches pin descriptions', () => {
    const results = filterHardware(catalog, { query: 'mosi' })
    expect(results.some((item) => item.slug === 'rc522')).toBe(true)
  })

  it('combines category and query', () => {
    const results = filterHardware(catalog, { category: 'lighting', query: 'led-green' })
    expect(results).toHaveLength(1)
    expect(results[0]?.slug).toBe('led-green')
  })

  it('returns empty array for non-matching query', () => {
    expect(filterHardware(catalog, { query: 'zzzz-not-a-part' })).toEqual([])
  })
})
