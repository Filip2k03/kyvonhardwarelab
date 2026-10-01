import { Suspense, useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import type { ProjectScene } from '@/lib/projects/buildProjectScene'
import { ProjectBenchFloor, ProjectPart } from '@/features/project3d/ProjectParts'

interface Project3dCanvasProps {
  readonly scene: ProjectScene
  readonly stepIndex: number
  readonly reducedMotion: boolean
  readonly className?: string
}

function CameraRig({
  target,
  reducedMotion,
}: {
  readonly target: readonly [number, number, number]
  readonly reducedMotion: boolean
}) {
  const { camera, invalidate } = useThree()

  useEffect(() => {
    camera.position.set(target[0], target[1], target[2])
    camera.lookAt(0.4, 0.15, 0)
    invalidate()
  }, [camera, invalidate, target])

  return (
    <OrbitControls
      makeDefault
      enableDamping={!reducedMotion}
      dampingFactor={0.08}
      minDistance={1.8}
      maxDistance={10}
      maxPolarAngle={Math.PI * 0.49}
      onChange={() => invalidate()}
    />
  )
}

function SceneBody({
  scene,
  stepIndex,
  reducedMotion,
}: {
  readonly scene: ProjectScene
  readonly stepIndex: number
  readonly reducedMotion: boolean
}) {
  const { invalidate } = useThree()
  const step = scene.steps[stepIndex] ?? scene.steps[0]
  const visible = useMemo(() => new Set(step?.visiblePartIds ?? []), [step])

  useEffect(() => {
    invalidate()
  }, [invalidate, stepIndex, visible])

  return (
    <>
      <color attach="background" args={['#eef1f5']} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 7, 3]} intensity={1.2} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.3} />
      <ProjectBenchFloor />
      {scene.parts.map((part) => (
        <ProjectPart
          key={part.id}
          part={part}
          visible={visible.has(part.id)}
          focused={step?.focusPartId === part.id}
        />
      ))}
      <ContactShadows position={[0, -0.03, 0]} opacity={0.42} scale={7} blur={2.4} far={2.2} />
      <CameraRig
        target={step?.cameraHint ?? [3.2, 2.6, 3.8]}
        reducedMotion={reducedMotion}
      />
    </>
  )
}

export function Project3dCanvas({
  scene,
  stepIndex,
  reducedMotion,
  className,
}: Project3dCanvasProps) {
  return (
    <div className={className ?? 'relative h-full min-h-[320px] w-full overflow-hidden bg-[#0a1018]'}>
      <Canvas
        shadows
        dpr={[1, 1.6]}
        frameloop="demand"
        camera={{ position: [3.2, 2.6, 3.8], fov: 40 }}
        gl={{ antialias: true, powerPreference: 'default' }}
        aria-label={`3D build scene for ${scene.title}`}
      >
        <Suspense fallback={null}>
          <SceneBody scene={scene} stepIndex={stepIndex} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
      <p className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-[10px] text-white/80">
        Drag to orbit · scroll to zoom · model updates with each step
      </p>
    </div>
  )
}
