import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh } from 'three'
import type { Lab3dHotspot } from '@/data/lab3d/unoBoard'

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
  readonly onSelect: (id: string) => void
  readonly reducedMotion: boolean
}

export function HotspotMarker({ hotspot, selected, onSelect, reducedMotion }: HotspotMarkerProps) {
  const meshRef = useRef<Mesh>(null)
  const color = CATEGORY_COLOR[hotspot.category]

  useFrame(({ clock }) => {
    if (!meshRef.current || reducedMotion) return
    const pulse = 1 + Math.sin(clock.elapsedTime * 3) * 0.08
    meshRef.current.scale.setScalar(selected ? 1.25 : pulse)
  })

  return (
    <group position={hotspot.position}>
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
          emissiveIntensity={selected ? 0.8 : 0.35}
        />
      </mesh>
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
    </group>
  )
}

export function UnoBoardModel() {
  const body = useMemo(
    () => (
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.08, 1.4]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
    ),
    [],
  )

  return (
    <group>
      {body}
      {/* USB shell */}
      <mesh position={[-1.2, 0.08, 0]} castShadow>
        <boxGeometry args={[0.28, 0.12, 0.35]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.35} />
      </mesh>
      {/* MCU chip */}
      <mesh position={[0.1, 0.08, 0]} castShadow>
        <boxGeometry args={[0.55, 0.08, 0.4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Header strips */}
      <mesh position={[0.15, 0.09, -0.55]}>
        <boxGeometry args={[1.6, 0.06, 0.14]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[-0.2, 0.09, 0.55]}>
        <boxGeometry args={[1.2, 0.06, 0.14]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[0.7, 0.09, 0.55]}>
        <boxGeometry args={[0.7, 0.06, 0.14]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      {/* Reset bump */}
      <mesh position={[0.95, 0.1, -0.35]}>
        <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
    </group>
  )
}
