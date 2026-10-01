import { useLayoutEffect, useRef } from 'react'
import { Object3D, type InstancedMesh } from 'three'
import { BREADBOARD_HOLE_COUNT, buildHolePositions } from '@/features/maoLab/domain/breadboardGeometry'

/**
 * All 830 tie points of an 830-point breadboard as ONE InstancedMesh (one draw call):
 *   2 × 5 rows × 63 columns of terminal holes (630) + 4 power rails × 50 holes (200).
 * Local coordinates match Breadboard830Model: 2.2 (x) × 1.5 (z), trench at z = 0.
 */

export function BreadboardHoles({ opacity = 1 }: { readonly opacity?: number }) {
  const ref = useRef<InstancedMesh>(null)

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const dummy = new Object3D()
    buildHolePositions().forEach(([x, z], index) => {
      dummy.position.set(x, 0.056, z)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, BREADBOARD_HOLE_COUNT]}>
      <boxGeometry args={[0.014, 0.012, 0.014]} />
      <meshStandardMaterial color="#2f343d" roughness={0.8} transparent opacity={opacity} />
    </instancedMesh>
  )
}
