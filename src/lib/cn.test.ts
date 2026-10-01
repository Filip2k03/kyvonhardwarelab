import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/cn'

describe('cn', () => {
  it('joins truthy class parts', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b')
  })
})
