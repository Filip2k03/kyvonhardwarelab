import { useMemo } from 'react'
import { CatmullRomCurve3, Vector3 } from 'three'
import { Tube } from '@react-three/drei'
import type { DemoWire, WireKind } from '@/features/maoLab/domain/types'

const WIRE_COLOR: Record<WireKind, string> = {
  power: '#dc2626',
  ground: '#64748b',
  signal: '#2563eb',
  analog: '#7c3aed',
  data: '#0891b2',
}

interface Props {
  readonly wire: DemoWire
  readonly selected: boolean
  readonly signalOn?: boolean
  readonly onSelect: (id: string) => void
}

export function JumperWire3d({ wire, selected, signalOn = false, onSelect }: Props) {
  const curve = useMemo(
    () => new CatmullRomCurve3(wire.path.map((p) => new Vector3(p[0], p[1], p[2]))),
    [wire.path],
  )
  const color = WIRE_COLOR[wire.kind]
  const emissive = wire.kind === 'signal' && signalOn ? color : '#000000'
  const intensity = wire.kind === 'signal' && signalOn ? 0.45 : 0

  return (
    <Tube
      args={[curve, 32, selected ? 0.028 : 0.022, 8, false]}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(wire.id)
      }}
    >
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={intensity}
        roughness={0.45}
        metalness={0.15}
      />
    </Tube>
  )
}
