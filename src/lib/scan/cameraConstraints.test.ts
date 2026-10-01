import { describe, expect, it } from 'vitest'
import { scanFacingLabel, scanVideoConstraints } from '@/lib/scan/cameraConstraints'

describe('scan camera constraints', () => {
  it('defaults front-camera ideal with a wider frame request', () => {
    const front = scanVideoConstraints('user')
    expect(front.facingMode).toEqual({ ideal: 'user' })
    expect(front.width).toEqual({ ideal: 1920, min: 640 })
    expect(front.height).toEqual({ ideal: 1080, min: 480 })
    expect(scanFacingLabel('user')).toBe('Front')
    expect(scanFacingLabel('environment')).toBe('Rear')
  })
})
