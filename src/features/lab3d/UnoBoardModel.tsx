import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh } from 'three'
import type { Lab3dHotspot } from '@/data/lab3d/unoBoard'
import type { Lab3dViewMode } from '@/lib/lab3d/viewModes'
import { boardGroupOffset } from '@/lib/lab3d/viewModes'
import { UnoBoardBody } from './UnoBoardBody'

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
      {selected ? (
        <Html distanceFactor={6} position={[0, 0.16, 0]} center zIndexRange={[100, 0]}>
          <div className="pointer-events-none rounded bg-[var(--color-surface)]/95 px-2 py-1 font-mono-tech text-[10px] whitespace-nowrap text-[var(--color-text)] shadow">
            {hotspot.label}
          </div>
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
  return (
    <group position={offset}>
      <UnoBoardBody opacity={dimmed ? 0.22 : 1} />
    </group>
  )
}
