import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { UNO_BOARD_HOTSPOTS } from '@/data/lab3d/unoBoard'
import { BenchModels } from '@/features/lab3d/BenchModels'
import { HotspotMarker, UnoBoardModel } from '@/features/lab3d/UnoBoardModel'

interface BoardSceneProps {
  readonly selectedId: string | null
  readonly onSelect: (id: string) => void
  readonly reducedMotion: boolean
  readonly resetToken: number
}

interface ResettableControls {
  reset: () => void
}

function CameraReset({
  resetToken,
  reducedMotion,
}: {
  readonly resetToken: number
  readonly reducedMotion: boolean
}) {
  const controls = useRef<ResettableControls | null>(null)
  const { invalidate } = useThree()

  useEffect(() => {
    controls.current?.reset()
    invalidate()
  }, [resetToken, invalidate])

  return (
    <OrbitControls
      ref={controls as never}
      makeDefault
      enableDamping={!reducedMotion}
      dampingFactor={0.08}
      minDistance={2.2}
      maxDistance={12}
      maxPolarAngle={Math.PI * 0.49}
      onChange={() => invalidate()}
    />
  )
}

function SceneContent({ selectedId, onSelect, reducedMotion, resetToken }: BoardSceneProps) {
  const { invalidate } = useThree()

  useEffect(() => {
    invalidate()
  }, [selectedId, invalidate])

  return (
    <>
      <color attach="background" args={['#0b1220']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 3]} intensity={1.15} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} />
      <UnoBoardModel />
      <BenchModels />
      {UNO_BOARD_HOTSPOTS.map((hotspot) => (
        <HotspotMarker
          key={hotspot.id}
          hotspot={hotspot}
          selected={selectedId === hotspot.id}
          onSelect={onSelect}
          reducedMotion={reducedMotion}
        />
      ))}
      <ContactShadows position={[0, -0.05, 0]} opacity={0.4} scale={6} blur={2.5} far={2} />
      <CameraReset resetToken={resetToken} reducedMotion={reducedMotion} />
    </>
  )
}

export function BoardCanvas({ selectedId, onSelect, reducedMotion, resetToken }: BoardSceneProps) {
  return (
    <div className="relative h-[min(60vh,520px)] w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[#0b1220]">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        frameloop="demand"
        camera={{ position: [3.4, 2.8, 4.1], fov: 40 }}
        gl={{ antialias: true, powerPreference: 'default' }}
        onCreated={({ gl, invalidate }) => {
          gl.setClearColor('#0b1220')
          invalidate()
        }}
        aria-label="Interactive 3D bench with board, breadboard, resistor, LED, and jumper"
      >
        <Suspense fallback={null}>
          <SceneContent
            selectedId={selectedId}
            onSelect={onSelect}
            reducedMotion={reducedMotion}
            resetToken={resetToken}
          />
        </Suspense>
      </Canvas>
      <p className="pointer-events-none absolute bottom-2 left-2 rounded bg-[var(--color-surface)]/80 px-2 py-1 text-[10px] text-[var(--color-text-muted)]">
        Drag to orbit · pinch/scroll to zoom · tap hotspots
      </p>
    </div>
  )
}
