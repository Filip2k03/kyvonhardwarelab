import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { DEMO_CIRCUIT_WIRES, type LedSimMode } from '@/features/maoLab/data/demoCircuit'
import { JumperWire3d } from '@/features/maoLab/three/wires/JumperWire'
import {
  ArduinoUnoModel,
  Breadboard830Model,
  DeskSurface,
  LedModel,
  MaoAssemblyModel,
  ResistorModel,
  UnverifiedMatrixPlaceholder,
} from '@/features/maoLab/three/models/Primitives'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface Resettable {
  reset: () => void
}

function CameraRig({
  resetToken,
  view,
  reducedMotion,
}: {
  readonly resetToken: number
  readonly view: 'orbit' | 'top' | 'front' | 'side' | 'iso'
  readonly reducedMotion: boolean
}) {
  const controls = useRef<Resettable | null>(null)
  const { camera, invalidate } = useThree()

  useEffect(() => {
    const positions: Record<typeof view, [number, number, number]> = {
      orbit: [3.6, 2.8, 4.2],
      top: [0.4, 6.5, 0.2],
      front: [0.4, 1.6, 5.5],
      side: [6.2, 1.8, 0.2],
      iso: [4.2, 3.4, 4.2],
    }
    const [x, y, z] = positions[view]
    camera.position.set(x, y, z)
    controls.current?.reset()
    invalidate()
  }, [view, resetToken, camera, invalidate])

  return (
    <OrbitControls
      ref={controls as never}
      makeDefault
      enableDamping={!reducedMotion}
      dampingFactor={0.08}
      minDistance={2}
      maxDistance={14}
      maxPolarAngle={Math.PI * 0.49}
      onChange={() => invalidate()}
    />
  )
}

function SignalWires({
  selectedId,
  onSelect,
  ledMode,
}: {
  readonly selectedId: string | null
  readonly onSelect: (id: string) => void
  readonly ledMode: LedSimMode
  readonly reducedMotion: boolean
}) {
  const signalOn = ledMode === 'on' || ledMode === 'blink'

  return (
    <>
      {DEMO_CIRCUIT_WIRES.map((wire) => (
        <JumperWire3d
          key={wire.id}
          wire={wire}
          selected={selectedId === wire.id}
          signalOn={wire.kind === 'signal' ? signalOn : false}
          onSelect={onSelect}
        />
      ))}
    </>
  )
}

interface SceneProps {
  readonly selectedId: string | null
  readonly onSelect: (id: string) => void
  readonly ledMode: LedSimMode
  readonly exploded: boolean
  readonly resetToken: number
  readonly view: 'orbit' | 'top' | 'front' | 'side' | 'iso'
  readonly reducedMotion: boolean
}

function Scene({ selectedId, onSelect, ledMode, exploded, resetToken, view, reducedMotion }: SceneProps) {
  return (
    <>
      <color attach="background" args={['#eef1f5']} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 7, 3]} intensity={1.1} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.3} />
      <DeskSurface />
      <ArduinoUnoModel id="uno" selected={selectedId === 'uno'} onSelect={onSelect} />
      <Breadboard830Model id="breadboard" selected={selectedId === 'breadboard'} onSelect={onSelect} />
      <ResistorModel id="resistor-220" selected={selectedId === 'resistor-220'} onSelect={onSelect} />
      <LedModel
        id="led-red"
        selected={selectedId === 'led-red'}
        onSelect={onSelect}
        ledMode={ledMode}
        reducedMotion={reducedMotion}
      />
      <MaoAssemblyModel exploded={exploded} ledMode={ledMode} reducedMotion={reducedMotion} />
      <UnverifiedMatrixPlaceholder onSelect={onSelect} />
      <SignalWires
        selectedId={selectedId}
        onSelect={onSelect}
        ledMode={ledMode}
        reducedMotion={reducedMotion}
      />
      <ContactShadows position={[0, -0.05, 0]} opacity={0.3} scale={10} blur={2.2} far={3} />
      <CameraRig resetToken={resetToken} view={view} reducedMotion={reducedMotion} />
    </>
  )
}

export interface MaoWorkbenchCanvasProps {
  readonly selectedId: string | null
  readonly onSelect: (id: string) => void
  readonly ledMode: LedSimMode
  readonly exploded: boolean
  readonly view: 'orbit' | 'top' | 'front' | 'side' | 'iso'
  readonly resetToken: number
}

export function MaoWorkbenchCanvas({
  selectedId,
  onSelect,
  ledMode,
  exploded,
  view,
  resetToken,
}: MaoWorkbenchCanvasProps) {
  const reducedMotion = usePrefersReducedMotion()
  const dpr = useMemo(() => (typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1), [])
  const frameloop = ledMode === 'blink' && !reducedMotion ? 'always' : 'demand'

  return (
    <div className="relative h-[min(62vh,560px)] w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[#eef1f5]">
      <Canvas
        shadows
        dpr={dpr}
        frameloop={frameloop}
        camera={{ position: [3.6, 2.8, 4.2], fov: 40 }}
        gl={{ antialias: true, powerPreference: 'default' }}
        aria-label="MAO Mark I interactive 3D workbench"
      >
        <Suspense fallback={null}>
          <Scene
            selectedId={selectedId}
            onSelect={onSelect}
            ledMode={ledMode}
            exploded={exploded}
            resetToken={resetToken}
            view={view}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
      <p className="pointer-events-none absolute bottom-2 left-2 rounded bg-[var(--color-surface)]/90 px-2 py-1 font-mono-tech text-[10px] text-[var(--color-text-muted)]">
        SIMULATION MODE · drag orbit · scroll zoom · tap parts/wires
      </p>
    </div>
  )
}
