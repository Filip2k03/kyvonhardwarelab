import { RoundedBox } from '@react-three/drei'

/**
 * Arduino Uno R3–style board body. Footprint stays 2.4 × 1.4 (x × z) so view-mode
 * offsets, the breadboard bench and hotspot x/z anchors keep working; heights are
 * stylised for readability. Board top surface sits at y = BOARD_TOP.
 */

const BOARD_TOP = 0.04
const PITCH = 0.09

const COLOR = {
  pcb: '#0b7a85',
  pcbEdge: '#075c64',
  silk: '#e8f4f2',
  chip: '#1a1d23',
  plastic: '#15181e',
  gold: '#d4a73a',
  steel: '#b8c0cc',
  steelDark: '#8b95a3',
  reset: '#c92a2a',
  cap: '#2b2f38',
  ledGreen: '#4ade80',
  ledAmber: '#f59e0b',
  hole: '#0a1a1c',
} as const

interface PartProps {
  readonly opacity: number
}

interface BlockProps extends PartProps {
  readonly position: readonly [number, number, number]
  readonly size: readonly [number, number, number]
  readonly color: string
  readonly metalness?: number
  readonly roughness?: number
  readonly emissive?: string
}

function Block({ position, size, color, opacity, metalness = 0.05, roughness = 0.6, emissive }: BlockProps) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        emissive={emissive ?? '#000000'}
        emissiveIntensity={emissive ? 0.6 : 0}
        transparent
        opacity={opacity}
      />
    </mesh>
  )
}

interface HeaderProps extends PartProps {
  readonly x: number
  readonly z: number
  readonly pins: number
}

/** Black plastic female header with a gold contact visible in every socket. */
function Header({ x, z, pins, opacity }: HeaderProps) {
  const length = pins * PITCH
  const slots = Array.from({ length: pins }, (_, index) => x + (index - (pins - 1) / 2) * PITCH)
  return (
    <group>
      <Block
        position={[x, BOARD_TOP + 0.075, z]}
        size={[length, 0.15, 0.1]}
        color={COLOR.plastic}
        roughness={0.7}
        opacity={opacity}
      />
      {slots.map((slotX) => (
        <mesh key={slotX} position={[slotX, BOARD_TOP + 0.152, z]}>
          <boxGeometry args={[0.04, 0.006, 0.04]} />
          <meshStandardMaterial
            color={COLOR.gold}
            metalness={0.85}
            roughness={0.3}
            transparent
            opacity={opacity}
          />
        </mesh>
      ))}
    </group>
  )
}

interface Dip28Props extends PartProps {
  readonly x: number
  readonly z: number
}

/** ATmega328P in a DIP-28 body with a pin-1 notch and visible legs. */
function Dip28({ x, z, opacity }: Dip28Props) {
  const legs = Array.from({ length: 14 }, (_, index) => (index - 6.5) * 0.055)
  return (
    <group position={[x, BOARD_TOP, z]}>
      <Block position={[0, 0.045, 0]} size={[0.78, 0.09, 0.3]} color={COLOR.chip} roughness={0.45} opacity={opacity} />
      <mesh position={[-0.37, 0.092, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.004, 14]} />
        <meshStandardMaterial color="#0b0d11" transparent opacity={opacity} />
      </mesh>
      {[-0.17, 0.17].map((legZ) =>
        legs.map((legX) => (
          <Block
            key={`${legZ}-${legX}`}
            position={[legX, 0.015, legZ]}
            size={[0.022, 0.03, 0.04]}
            color={COLOR.steel}
            metalness={0.8}
            roughness={0.35}
            opacity={opacity}
          />
        )),
      )}
    </group>
  )
}

interface CylinderPartProps extends PartProps {
  readonly position: readonly [number, number, number]
  readonly radius: number
  readonly height: number
  readonly color: string
  readonly metalness?: number
  readonly roughness?: number
  readonly rotation?: readonly [number, number, number]
}

function CylinderPart({
  position,
  radius,
  height,
  color,
  opacity,
  metalness = 0.2,
  roughness = 0.5,
  rotation = [0, 0, 0],
}: CylinderPartProps) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <cylinderGeometry args={[radius, radius, height, 24]} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        transparent
        opacity={opacity}
      />
    </mesh>
  )
}

function MountingHole({ x, z, opacity }: { readonly x: number; readonly z: number } & PartProps) {
  return (
    <group position={[x, BOARD_TOP + 0.003, z]}>
      <CylinderPart position={[0, 0, 0]} radius={0.06} height={0.006} color={COLOR.gold} metalness={0.8} roughness={0.35} opacity={opacity} />
      <CylinderPart position={[0, 0.002, 0]} radius={0.04} height={0.008} color={COLOR.hole} opacity={opacity} />
    </group>
  )
}

function SilkLine({
  position,
  size,
  opacity,
}: {
  readonly position: readonly [number, number, number]
  readonly size: readonly [number, number, number]
} & PartProps) {
  return <Block position={position} size={size} color={COLOR.silk} roughness={0.9} opacity={opacity * 0.9} />
}

export function UnoBoardBody({ opacity }: PartProps) {
  const top = BOARD_TOP
  return (
    <group>
      <RoundedBox
        args={[2.4, 0.08, 1.4]}
        radius={0.03}
        smoothness={3}
        position={[0, 0, 0]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial color={COLOR.pcb} roughness={0.55} metalness={0.05} transparent opacity={opacity} />
      </RoundedBox>
      <Block position={[0, -0.041, 0]} size={[2.34, 0.004, 1.34]} color={COLOR.pcbEdge} opacity={opacity} />

      {/* Silkscreen: header outlines and the board's pin-bank guides */}
      <SilkLine position={[0.1, top + 0.001, -0.62]} size={[1.9, 0.002, 0.012]} opacity={opacity} />
      <SilkLine position={[0.1, top + 0.001, 0.62]} size={[1.9, 0.002, 0.012]} opacity={opacity} />
      <SilkLine position={[0.9, top + 0.001, 0.3]} size={[0.5, 0.002, 0.012]} opacity={opacity} />

      {/* USB-B (programming + 5 V) and DC barrel jack */}
      <Block position={[-1.0, top + 0.17, 0]} size={[0.56, 0.34, 0.42]} color={COLOR.steel} metalness={0.85} roughness={0.28} opacity={opacity} />
      <Block position={[-0.76, top + 0.17, 0]} size={[0.06, 0.2, 0.28]} color={COLOR.steelDark} metalness={0.7} roughness={0.4} opacity={opacity} />
      <Block position={[-1.03, top + 0.16, 0.47]} size={[0.45, 0.32, 0.3]} color={COLOR.plastic} roughness={0.55} opacity={opacity} />
      <CylinderPart position={[-1.2, top + 0.16, 0.47]} radius={0.075} height={0.1} color={COLOR.steel} metalness={0.9} roughness={0.25} rotation={[0, 0, Math.PI / 2]} opacity={opacity} />

      {/* Regulator and the two big electrolytic capacitors near the power input */}
      <Block position={[-0.58, top + 0.06, 0.3]} size={[0.14, 0.12, 0.1]} color={COLOR.chip} roughness={0.5} opacity={opacity} />
      <Block position={[-0.58, top + 0.13, 0.3]} size={[0.14, 0.02, 0.04]} color={COLOR.steelDark} metalness={0.8} roughness={0.35} opacity={opacity} />
      <CylinderPart position={[-0.62, top + 0.09, -0.3]} radius={0.075} height={0.18} color={COLOR.cap} roughness={0.35} opacity={opacity} />
      <CylinderPart position={[-0.62, top + 0.186, -0.3]} radius={0.06} height={0.012} color={COLOR.steelDark} metalness={0.7} roughness={0.35} opacity={opacity} />

      {/* ATmega328P (main MCU), ATmega16U2 (USB bridge), 16 MHz crystal */}
      <Dip28 x={-0.12} z={0.02} opacity={opacity} />
      <Block position={[-0.6, top + 0.025, -0.02]} size={[0.14, 0.05, 0.14]} color={COLOR.chip} roughness={0.4} opacity={opacity} />
      <CylinderPart position={[0.35, top + 0.05, 0.05]} radius={0.045} height={0.12} color={COLOR.steel} metalness={0.85} roughness={0.25} rotation={[0, 0, Math.PI / 2]} opacity={opacity} />
      <Block position={[0.35, top + 0.1, 0.05]} size={[0.12, 0.012, 0.09]} color={COLOR.steelDark} metalness={0.8} roughness={0.3} opacity={opacity} />

      {/* Reset button: steel housing with a red cap */}
      <Block position={[0.95, top + 0.04, -0.35]} size={[0.15, 0.08, 0.15]} color={COLOR.steel} metalness={0.8} roughness={0.3} opacity={opacity} />
      <CylinderPart position={[0.95, top + 0.1, -0.35]} radius={0.045} height={0.06} color={COLOR.reset} roughness={0.4} opacity={opacity} />

      {/* Status LEDs: ON (green), L / TX / RX */}
      <Block position={[0.82, top + 0.012, 0.22]} size={[0.06, 0.024, 0.035]} color={COLOR.ledGreen} emissive={COLOR.ledGreen} roughness={0.3} opacity={opacity} />
      <Block position={[0.82, top + 0.012, -0.12]} size={[0.06, 0.024, 0.035]} color={COLOR.ledAmber} emissive={COLOR.ledAmber} roughness={0.3} opacity={opacity} />
      <Block position={[0.7, top + 0.012, -0.12]} size={[0.06, 0.024, 0.035]} color={COLOR.ledAmber} emissive={COLOR.ledAmber} roughness={0.3} opacity={opacity} />
      <Block position={[0.7, top + 0.012, -0.2]} size={[0.06, 0.024, 0.035]} color={COLOR.ledAmber} emissive={COLOR.ledAmber} roughness={0.3} opacity={opacity} />

      {/* ICSP 2×3 headers: one by the MCU, one by the USB bridge */}
      <Block position={[1.12, top + 0.04, 0]} size={[0.1, 0.08, 0.15]} color={COLOR.plastic} roughness={0.7} opacity={opacity} />
      <Block position={[-0.6, top + 0.04, 0.15]} size={[0.15, 0.08, 0.1]} color={COLOR.plastic} roughness={0.7} opacity={opacity} />

      {/* Female headers: digital (8 + 10) on top edge, power (8) and analog (6) below */}
      <Header x={-0.28} z={-0.55} pins={8} opacity={opacity} />
      <Header x={0.67} z={-0.55} pins={10} opacity={opacity} />
      <Header x={0.565} z={0.55} pins={8} opacity={opacity} />
      <Header x={-0.325} z={0.55} pins={6} opacity={opacity} />

      {/* Corner mounting holes */}
      <MountingHole x={-1.05} z={-0.6} opacity={opacity} />
      <MountingHole x={1.1} z={0.58} opacity={opacity} />
      <MountingHole x={0.1} z={0.4} opacity={opacity} />
      <MountingHole x={1.1} z={-0.22} opacity={opacity} />
    </group>
  )
}
