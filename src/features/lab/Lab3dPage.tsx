import { Suspense, lazy, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
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
      <PageHeader
        eyebrow={
          <>
            <Link to="/lab" className="text-[var(--color-accent)] hover:underline">
              Workbench
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="font-mono-tech">3d</span>
          </>
        }
        title="3D Lab"
        description={
          <>
            Orbit the controller and breadboard path. Select pins to jump into the hardware catalog.
            Assembled, exploded, and isolate views stay on this route — Three.js loads only here.{' '}
            {UNO_BOARD_FALLBACK_SUMMARY}
          </>
        }
      />

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
