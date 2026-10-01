export type ScanFacing = 'user' | 'environment'

export function scanVideoConstraints(facing: ScanFacing): MediaTrackConstraints {
  return {
    facingMode: { ideal: facing },
    width: { ideal: 1920, min: 640 },
    height: { ideal: 1080, min: 480 },
    // Prefer the widest useful frame so more of the desk / part is visible.
    aspectRatio: { ideal: 16 / 9 },
  }
}

export function scanFacingLabel(facing: ScanFacing): string {
  return facing === 'user' ? 'Front' : 'Rear'
}
