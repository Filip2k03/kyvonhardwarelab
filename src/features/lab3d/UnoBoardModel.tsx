import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh } from 'three'
import type { Lab3dHotspot } from '@/data/lab3d/unoBoard'
import type { Lab3dViewMode } from '@/lib/lab3d/viewModes'
import { boardGroupOffset } from '@/lib/lab3d/viewModes'

const CATEGORY_COLOR: Record<Lab3dHotspot['category'], string> = {
  power: '#ef4444',
  digital: '#38bdf8',
  analog: '#a78bfa',
  special: '#fbbf24',
  part: '#34d399',
}

interface HotspotMarkerProps {
  readonly hotspot: Lab3dHotspot
  readonly selected: boolean
  readonly dimmed: boolean
  readonly onSelect: (id: string) => void
  readonly reducedMotion: boolean
}

export function HotspotMarker({
  hotspot,
  selected,
  dimmed,
  onSelect,
  reducedMotion,
}: HotspotMarkerProps) {
  const meshRef = useRef<Mesh>(null)
  const color = CATEGORY_COLOR[hotspot.category]

  useFrame(({ clock, invalidate }) => {
    if (!meshRef.current) return
    if (reducedMotion || !selected) {
      meshRef.current.scale.setScalar(selected ? 1.2 : dimmed ? 0.85 : 1)
      return
    }
    const pulse = 1.15 + Math.sin(clock.elapsedTime * 3) * 0.08
    meshRef.current.scale.setScalar(pulse)
    invalidate()
  })

  return (
    <group position={hotspot.position} visible={!dimmed || selected}>
      <mesh
        ref={meshRef}
        onClick={(event) => {
          event.stopPropagation()
          onSelect(hotspot.id)
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 0.8 : dimmed ? 0.1 : 0.35}
          transparent
          opacity={dimmed && !selected ? 0.25 : 1}
        />
      </mesh>
      {!dimmed || selected ? (
        <Html distanceFactor={6} position={[0, 0.16, 0]} center>
          <button
            type="button"
            className="rounded bg-[var(--color-surface)]/95 px-2 py-1 font-mono-tech text-[10px] text-[var(--color-text)] shadow"
            onClick={(event) => {
              event.stopPropagation()
              onSelect(hotspot.id)
            }}
          >
            {hotspot.label}
          </button>
        </Html>
      ) : null}
    </group>
  )
}

interface UnoBoardModelProps {
  readonly viewMode: Lab3dViewMode
  readonly dimmed?: boolean
}

export function UnoBoardModel({ viewMode, dimmed = false }: UnoBoardModelProps) {
  const offset = boardGroupOffset(viewMode)
  const opacity = dimmed ? 0.22 : 1
  const body = useMemo(
    () => (
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.08, 1.4]} />
        <meshStandardMaterial color="#1e3a5f" transparent opacity={opacity} />
      </mesh>
    ),
    [opacity],
  )

  return (
    <group position={offset}>
      {body}
      <mesh position={[-1.2, 0.08, 0]} castShadow>
        <boxGeometry args={[0.28, 0.12, 0.35]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.35} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.1, 0.08, 0]} castShadow>
        <boxGeometry args={[0.55, 0.08, 0.4]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.15, 0.09, -0.55]}>
        <boxGeometry args={[1.6, 0.06, 0.14]} />
        <meshStandardMaterial color="#111827" transparent opacity={opacity} />
      </mesh>
      <mesh position={[-0.2, 0.09, 0.55]}>
        <boxGeometry args={[1.2, 0.06, 0.14]} />
        <meshStandardMaterial color="#111827" transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.7, 0.09, 0.55]}>
        <boxGeometry args={[0.7, 0.06, 0.14]} />
        <meshStandardMaterial color="#111827" transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.95, 0.1, -0.35]}>
        <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={opacity} />
      </mesh>
    </group>
  )
}
