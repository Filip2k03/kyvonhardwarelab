import type { ProjectPartKind, ProjectScenePart } from '@/lib/projects/buildProjectScene'

function LedMesh({ color }: { readonly color: string }) {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.16, 16]} />
        <meshStandardMaterial color="#fecaca" roughness={0.35} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.075, 16, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} />
      </mesh>
    </group>
  )
}

function PartMesh({ kind }: { readonly kind: ProjectPartKind }) {
  switch (kind) {
    case 'mcu':
      return (
        <group>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.35, 0.08, 0.85]} />
            <meshStandardMaterial color="#1e3a5f" roughness={0.55} />
          </mesh>
          <mesh position={[0.05, 0.08, 0]} castShadow>
            <boxGeometry args={[0.4, 0.06, 0.28]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      )
    case 'breadboard':
      return (
        <group>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.1, 0.75]} />
            <meshStandardMaterial color="#f3efe6" roughness={0.72} />
          </mesh>
          <mesh position={[0, 0.055, 0.3]}>
            <boxGeometry args={[1.1, 0.01, 0.05]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          <mesh position={[0, 0.055, -0.3]}>
            <boxGeometry args={[1.1, 0.01, 0.05]} />
            <meshStandardMaterial color="#2563eb" />
          </mesh>
        </group>
      )
    case 'led':
      return <LedMesh color="#ef4444" />
    case 'led-yellow':
      return <LedMesh color="#facc15" />
    case 'led-green':
      return <LedMesh color="#22c55e" />
    case 'resistor':
      return (
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.36, 14]} />
          <meshStandardMaterial color="#d6b48a" roughness={0.5} />
        </mesh>
      )
    case 'button':
      return (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.08, 0.22]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
        </group>
      )
    case 'potentiometer':
      return (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.1, 0.24]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.08, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      )
    case 'sensor':
      return (
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.08, 0.28]} />
          <meshStandardMaterial color="#166534" />
        </mesh>
      )
    case 'display':
      return (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.7, 0.08, 0.32]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.55, 0.02, 0.18]} />
            <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.35} />
          </mesh>
        </group>
      )
    case 'servo':
      return (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.36, 0.22, 0.2]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.22, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.18, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
          </mesh>
        </group>
      )
    case 'rfid':
      return (
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.06, 0.36]} />
          <meshStandardMaterial color="#7c2d12" />
        </mesh>
      )
    case 'relay':
      return (
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.18, 0.28]} />
          <meshStandardMaterial color="#14532d" />
        </mesh>
      )
    case 'buzzer':
      return (
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      )
    case 'jumper':
      return (
        <mesh rotation={[0, 0.6, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.55, 10]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
      )
    default:
      return (
        <mesh castShadow>
          <boxGeometry args={[0.28, 0.1, 0.22]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      )
  }
}

interface ProjectPartProps {
  readonly part: ProjectScenePart
  readonly focused: boolean
  readonly visible: boolean
}

export function ProjectPart({ part, focused, visible }: ProjectPartProps) {
  if (!visible) return null
  return (
    <group position={part.position} scale={focused ? 1.12 : 1}>
      <PartMesh kind={part.kind} />
      {focused ? (
        <mesh position={[0, -0.02, 0]}>
          <ringGeometry args={[0.22, 0.28, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
        </mesh>
      ) : null}
    </group>
  )
}

export function ProjectBenchFloor() {
  return (
    <mesh position={[0.4, -0.04, 0]} receiveShadow>
      <boxGeometry args={[4.6, 0.04, 2.4]} />
      <meshStandardMaterial color="#1a120c" roughness={0.92} />
    </mesh>
  )
}
