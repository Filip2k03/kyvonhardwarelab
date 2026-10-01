import { lazy, Suspense, useState } from 'react'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { WorkbenchChrome } from '@/features/maoLab/components/WorkbenchChrome'
import type { LedSimMode } from '@/features/maoLab/data/demoCircuit'
import { detectWebGL } from '@/lib/lab3d/detectWebGL'
import { WebGlFallback } from '@/features/lab3d/WebGlFallback'

const MaoWorkbenchCanvas = lazy(async () => {
  const module = await import('@/features/maoLab/three/WorkbenchCanvas')
  return { default: module.MaoWorkbenchCanvas }
})

export function MaoWorkbenchPage() {
  const [webgl] = useState(() => detectWebGL())
  const [selectedId, setSelectedId] = useState<string | null>('uno')
  const [ledMode, setLedMode] = useState<LedSimMode>('blink')
  const [exploded, setExploded] = useState(false)
  const [view, setView] = useState<'orbit' | 'top' | 'front' | 'side' | 'iso'>('orbit')
  const [resetToken, setResetToken] = useState(0)

  if (!webgl) {
    return <WebGlFallback reason="WebGL unavailable — use Components / Build / Face Lab lists instead." />
  }

  return (
    <WorkbenchChrome
      selectedId={selectedId}
      onSelect={setSelectedId}
      ledMode={ledMode}
      onLedMode={setLedMode}
      exploded={exploded}
      onExploded={setExploded}
      view={view}
      onView={setView}
      onResetCamera={() => setResetToken((value) => value + 1)}
      canvas={
        <Suspense fallback={<PageLoader label="Loading MAO workbench" />}>
          <MaoWorkbenchCanvas
            selectedId={selectedId}
            onSelect={setSelectedId}
            ledMode={ledMode}
            exploded={exploded}
            view={view}
            resetToken={resetToken}
          />
        </Suspense>
      }
    />
  )
}
