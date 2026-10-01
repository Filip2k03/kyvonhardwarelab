import { useMemo } from 'react'
import { Tube } from '@react-three/drei'
import { CatmullRomCurve3, Vector3 } from 'three'

function ColorBand({
  x,
  color,
}: {
  readonly x: number
  readonly color: string
}) {
  return (
    <mesh position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.055, 0.055, 0.03, 12]} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
  )
}

export function BenchModels() {
  const jumper = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(0.55, 0.12, -0.48),
        new Vector3(1.05, 0.48, -0.22),
        new Vector3(1.48, 0.18, -0.08),
      ]),
    [],
  )

  return (
    <group>
      <mesh position={[1.15, -0.02, 0.05]} receiveShadow>
        <boxGeometry args={[4.8, 0.04, 2.3]} />
        <meshStandardMaterial color="#1a120c" roughness={0.9} />
      </mesh>

      <group position={[2.05, 0.08, 0.12]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.55, 0.1, 0.95]} />
          <meshStandardMaterial color="#f3efe6" roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.052, 0]}>
          <boxGeometry args={[1.35, 0.01, 0.08]} />
          <meshStandardMaterial color="#d6d0c4" />
        </mesh>
        <mesh position={[0, 0.055, 0.4]}>
          <boxGeometry args={[1.45, 0.012, 0.06]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[0, 0.055, -0.4]}>
          <boxGeometry args={[1.45, 0.012, 0.06]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
      </group>

      <group position={[1.55, 0.2, -0.18]} rotation={[0, 0.4, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.42, 16]} />
          <meshStandardMaterial color="#d6b48a" roughness={0.55} />
        </mesh>
        <ColorBand x={-0.08} color="#b91c1c" />
        <ColorBand x={-0.02} color="#b91c1c" />
        <ColorBand x={0.04} color="#7c2d12" />
        <ColorBand x={0.1} color="#eab308" />
        <mesh position={[-0.28, -0.06, 0]}>
          <boxGeometry args={[0.02, 0.16, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.25} />
        </mesh>
        <mesh position={[0.28, -0.06, 0]}>
          <boxGeometry args={[0.02, 0.16, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.25} />
        </mesh>
      </group>

      <group position={[2.35, 0.16, -0.36]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.07, 0.08, 0.16, 16]} />
          <meshStandardMaterial color="#fecaca" roughness={0.35} transparent opacity={0.92} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.075, 16, 12]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={0.35}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[-0.03, -0.14, 0]}>
          <boxGeometry args={[0.02, 0.16, 0.02]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.55} roughness={0.3} />
        </mesh>
        <mesh position={[0.03, -0.16, 0]}>
          <boxGeometry args={[0.02, 0.12, 0.02]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.55} roughness={0.3} />
        </mesh>
      </group>

      <Tube args={[jumper, 24, 0.028, 8, false]}>
        <meshStandardMaterial color="#f97316" roughness={0.45} />
      </Tube>
    </group>
  )
}
