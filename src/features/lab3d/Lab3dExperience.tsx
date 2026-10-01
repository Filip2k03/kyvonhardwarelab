import { Component, type ErrorInfo, type ReactNode, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { UNO_BOARD_HOTSPOTS } from '@/data/lab3d/unoBoard'
import { findHardwareBySlug } from '@/data/hardware'
import { detectWebGL } from '@/lib/lab3d/detectWebGL'
import { LAB3D_VIEW_MODES, type Lab3dViewMode } from '@/lib/lab3d/viewModes'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useInspector } from '@/hooks/useInspector'
import { BoardCanvas } from '@/features/lab3d/BoardCanvas'
import { HotspotInfoPanel } from '@/features/lab3d/HotspotInfoPanel'
import { WebGlFallback } from '@/features/lab3d/WebGlFallback'
import { cn } from '@/lib/cn'

class Lab3dErrorBoundary extends Component<
  { readonly children: ReactNode; readonly onError: (message: string) => void },
  { readonly failed: boolean }
> {
  public constructor(props: { readonly children: ReactNode; readonly onError: (message: string) => void }) {
    super(props)
    this.state = { failed: false }
  }

  public static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true }
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('3D lab failed:', error, info.componentStack)
    this.props.onError(error.message || 'The 3D renderer crashed.')
  }

  public render(): ReactNode {
    if (this.state.failed) return null
    return this.props.children
  }
}

export function Lab3dExperience() {
  const reducedMotion = usePrefersReducedMotion()
  const webgl = useMemo(() => detectWebGL(), [])
  const { setContent } = useInspector()
  const [selectedId, setSelectedId] = useState<string | null>('digital-bank')
  const [selectedPin, setSelectedPin] = useState<string | null>(null)
  const [resetToken, setResetToken] = useState(0)
  const [runtimeError, setRuntimeError] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState<Lab3dViewMode>('assembled')

  const selected = UNO_BOARD_HOTSPOTS.find((hotspot) => hotspot.id === selectedId) ?? null
  const catalog = selected?.relatedComponentSlug
    ? findHardwareBySlug(selected.relatedComponentSlug)
    : undefined

  function selectHotspot(id: string) {
    setSelectedId(id)
    setSelectedPin(null)
  }

  useEffect(() => {
    if (!selected) {
      setContent({
        title: '3D Lab',
        body: (
          <p className="text-sm text-[var(--color-text-muted)]">
            Select a hotspot to inspect pins and linked catalog parts.
          </p>
        ),
      })
      return () => setContent(null)
    }

    setContent({
      title: selected.label,
      body: (
        <div className="space-y-3 text-sm">
          <p className="font-mono-tech text-[10px] tracking-wide text-[var(--color-accent)] uppercase">
            {selected.category} · {viewMode}
          </p>
          <p className="text-[var(--color-text-muted)]">{selected.summary}</p>
          <p className="font-mono-tech text-xs">{selected.pinNames.join(' · ')}</p>
          {selectedPin ? (
            <p className="text-xs">
              Active pin: <span className="font-mono-tech">{selectedPin}</span>
            </p>
          ) : null}
          {catalog ? (
            <Link
              to={`/components/${catalog.slug}`}
              className="inline-flex min-h-11 items-center text-xs text-[var(--color-accent)] hover:underline"
            >
              {catalog.name}
            </Link>
          ) : null}
        </div>
      ),
    })
    return () => setContent(null)
  }, [selected, selectedPin, catalog, viewMode, setContent])

  if (!webgl || runtimeError) {
    return (
      <WebGlFallback
        reason={
          runtimeError ??
          'This browser or device did not expose a WebGL context. Use the text inspection list instead.'
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {LAB3D_VIEW_MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            title={mode.hint}
            className={cn(
              'min-h-11 rounded-[var(--radius-sm)] border px-3 text-sm',
              viewMode === mode.id
                ? 'border-[var(--color-accent)] bg-[var(--color-surface-raised)] text-[var(--color-accent-strong)]'
                : 'border-[var(--color-border)]',
            )}
            aria-pressed={viewMode === mode.id}
            onClick={() => setViewMode(mode.id)}
          >
            {mode.label}
          </button>
        ))}
        <button
          type="button"
          className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 text-sm"
          onClick={() => setResetToken((value) => value + 1)}
        >
          Reset camera
        </button>
        <button
          type="button"
          className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 text-sm"
          onClick={() => setFullscreen((value) => !value)}
        >
          {fullscreen ? 'Exit wide view' : 'Wide view'}
        </button>
        {reducedMotion ? (
          <p className="self-center text-xs text-[var(--color-text-muted)]">
            Reduced motion: damping/pulse animation minimized; render-on-demand enabled.
          </p>
        ) : null}
      </div>

      <div
        className={cn(
          'grid gap-4',
          fullscreen ? 'lg:grid-cols-1' : 'lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]',
        )}
      >
        <Lab3dErrorBoundary onError={setRuntimeError}>
          <BoardCanvas
            selectedId={selectedId}
            onSelect={selectHotspot}
            reducedMotion={reducedMotion}
            resetToken={resetToken}
            viewMode={viewMode}
          />
        </Lab3dErrorBoundary>
        <div className="space-y-3">
          <HotspotInfoPanel
            hotspot={selected}
            selectedPin={selectedPin}
            onSelectPin={setSelectedPin}
          />
          <div>
            <h2 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
              Hotspots
            </h2>
            <ul className="mt-2 space-y-1">
              {UNO_BOARD_HOTSPOTS.map((hotspot) => (
                <li key={hotspot.id}>
                  <button
                    type="button"
                    onClick={() => selectHotspot(hotspot.id)}
                    className={cn(
                      'flex min-h-11 w-full items-center rounded-[var(--radius-sm)] px-3 text-left text-sm',
                      selectedId === hotspot.id
                        ? 'bg-[var(--color-surface-raised)]'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]',
                    )}
                  >
                    {hotspot.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
