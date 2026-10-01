import { Suspense, lazy, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { WebGlFallback } from '@/features/lab3d/WebGlFallback'
import { detectWebGL } from '@/lib/lab3d/detectWebGL'
import { UNO_BOARD_FALLBACK_SUMMARY } from '@/data/lab3d/unoBoard'

const Lab3dExperience = lazy(async () => {
  const module = await import('@/features/lab3d/Lab3dExperience')
  return { default: module.Lab3dExperience }
})

export function Lab3dPage() {
  const [webgl] = useState(() => detectWebGL())

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs text-[var(--color-text-muted)]">
          <Link to="/lab" className="text-[var(--color-accent)] hover:underline">
            Lab
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="font-mono-tech">3d</span>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">3D Explorer</h1>
        <p className="max-w-3xl text-sm text-[var(--color-text-muted)]">
          Orbit the controller, then the breadboard beside it: a 220 Ω resistor, an LED, and the
          jumper that ties them to a pin. Three.js loads only on this route.{' '}
          {UNO_BOARD_FALLBACK_SUMMARY}
        </p>
      </header>

      {!webgl ? (
        <WebGlFallback reason="WebGL is not available in this environment." />
      ) : (
        <Suspense fallback={<PageLoader label="Loading 3D lab" />}>
          <Lab3dExperience />
        </Suspense>
      )}
    </div>
  )
}
