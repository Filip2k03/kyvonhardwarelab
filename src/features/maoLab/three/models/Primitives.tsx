import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Grid } from '@react-three/drei'
import type { Mesh } from 'three'
import { UnoBoardBody } from '@/features/lab3d/UnoBoardBody'
import { BreadboardHoles } from './BreadboardHoles'
import type { LedSimMode } from '@/features/maoLab/data/demoCircuit'

interface SelectableProps {
  readonly selected?: boolean
  readonly onSelect?: (id: string) => void
  readonly id: string
}

export function ArduinoUnoModel({ selected, onSelect, id }: SelectableProps) {
  return (
    <group
      position={[-1.35, 0.06, 0]}
      scale={0.7}
      onClick={(event) => {
        event.stopPropagation()
        onSelect?.(id)
      }}
    >
      <UnoBoardBody opacity={1} />
      {selected ? (
        <mesh>
          <boxGeometry args={[2.46, 0.12, 1.46]} />
          <meshBasicMaterial color="#6366f1" wireframe />
        </mesh>
      ) : null}
    </group>
  )
}

export function Breadboard830Model({ selected, onSelect, id }: SelectableProps) {
  return (
    <group
      position={[1.35, 0.05, 0.05]}
      onClick={(event) => {
        event.stopPropagation()
        onSelect?.(id)
      }}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.1, 1.5]} />
        <meshStandardMaterial color={selected ? '#fff7ed' : '#f5f0e6'} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.055, 0.68]}>
        <boxGeometry args={[2.0, 0.02, 0.08]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0, 0.055, 0.58]}>
        <boxGeometry args={[2.0, 0.02, 0.08]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>
      <mesh position={[0, 0.055, -0.58]}>
        <boxGeometry args={[2.0, 0.02, 0.08]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>
      <mesh position={[0, 0.055, -0.68]}>
        <boxGeometry args={[2.0, 0.02, 0.08]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0, 0.052, 0]}>
        <boxGeometry args={[2.0, 0.01, 0.12]} />
        <meshStandardMaterial color="#e7e0d4" />
      </mesh>
      <BreadboardHoles />
    </group>
  )
}

export function ResistorModel({ selected, onSelect, id }: SelectableProps) {
  return (
    <group
      position={[1.45, 0.18, -0.12]}
      rotation={[0, 0.5, Math.PI / 2]}
      onClick={(event) => {
        event.stopPropagation()
        onSelect?.(id)
      }}
    >
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.38, 14]} />
        <meshStandardMaterial color={selected ? '#fde68a' : '#d6b48a'} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.03, 10]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.03, 10]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.03, 10]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.03, 10]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>
    </group>
  )
}

export function LedModel({
  selected,
  onSelect,
  id,
  ledMode,
  reducedMotion,
}: SelectableProps & { readonly ledMode: LedSimMode; readonly reducedMotion: boolean }) {
  const bulb = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (!bulb.current) return
    const material = bulb.current.material
    if (Array.isArray(material)) return
    const mat = material as unknown as { emissiveIntensity: number }
    if (ledMode === 'off') mat.emissiveIntensity = 0.08
    else if (ledMode === 'on' || reducedMotion) mat.emissiveIntensity = 0.85
    else mat.emissiveIntensity = Math.floor(clock.elapsedTime * 2) % 2 === 0 ? 0.85 : 0.08
  })

  return (
    <group
      position={[2.05, 0.16, -0.22]}
      onClick={(event) => {
        event.stopPropagation()
        onSelect?.(id)
      }}
    >
      <mesh castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.14, 14]} />
        <meshStandardMaterial color="#fecaca" transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.078, 0.078, 0.022, 14]} />
        <meshStandardMaterial color="#fecaca" transparent opacity={0.9} />
      </mesh>
      <mesh position={[-0.03, -0.14, 0]}>
        <boxGeometry args={[0.014, 0.16, 0.014]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0.03, -0.12, 0]}>
        <boxGeometry args={[0.014, 0.12, 0.014]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh ref={bulb} position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.07, 16, 12]} />
        <meshStandardMaterial
          color={selected ? '#f87171' : '#ef4444'}
          emissive="#ef4444"
          emissiveIntensity={0.2}
          roughness={0.25}
        />
      </mesh>
    </group>
  )
}

export function DeskSurface() {
  return (
    <group>
      <mesh position={[0.2, -0.06, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#dfe3ea" roughness={0.95} />
      </mesh>
      <Grid
        position={[0.2, -0.055, 0]}
        args={[8, 5]}
        cellSize={0.25}
        cellThickness={0.6}
        cellColor="#c3c9d4"
        sectionSize={1}
        sectionThickness={1}
        sectionColor="#9aa3b2"
        fadeDistance={14}
        fadeStrength={1.5}
      />
    </group>
  )
}

export function MaoAssemblyModel({
  exploded,
  ledMode,
  reducedMotion,
}: {
  readonly exploded: boolean
  readonly ledMode: LedSimMode
  readonly reducedMotion: boolean
}) {
  const headY = exploded ? 1.35 : 0.95
  const bodyY = exploded ? 0.35 : 0.45
  const eyeL = useRef<Mesh>(null)
  const eyeR = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    const on =
      ledMode === 'on' || reducedMotion
        ? true
        : ledMode === 'blink'
          ? Math.floor(clock.elapsedTime * 2) % 2 === 0
          : false
    const intensity = on ? 0.7 : 0.15
    for (const eye of [eyeL.current, eyeR.current]) {
      if (!eye) continue
      const material = eye.material
      if (Array.isArray(material)) continue
      ;(material as unknown as { emissiveIntensity: number }).emissiveIntensity = intensity
    }
  })

  return (
    <group position={[3.4, 0, 0.8]}>
      <mesh position={[0, bodyY, 0]} castShadow>
        <boxGeometry args={[0.55, 0.7, 0.4]} />
        <meshStandardMaterial color="#312e81" roughness={0.5} />
      </mesh>
      <mesh position={[0, headY, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.18]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh ref={eyeL} position={[-0.12, headY + 0.08, 0.1]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.15} />
      </mesh>
      <mesh ref={eyeR} position={[0.12, headY + 0.08, 0.1]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0, exploded ? 0.75 : 0.72, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 10]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[0.7, 0.08, 0.55]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
    </group>
  )
}

export function UnverifiedMatrixPlaceholder({ onSelect }: { readonly onSelect: (id: string) => void }) {
  return (
    <group
      position={[3.35, 0.45, -0.6]}
      onClick={(event) => {
        event.stopPropagation()
        onSelect('matrix-8x8-raw')
      }}
    >
      <mesh>
        <boxGeometry args={[0.55, 0.55, 0.08]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.45, 0.45, 0.02]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}
