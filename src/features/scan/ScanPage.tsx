import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, CameraOff, ScanSearch, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageListenButton } from '@/components/audio/ListenButton'
import { LabPanel } from '@/components/ui/LabPanel'
import { analyzeImageData, type FrameAnalysis } from '@/lib/scan/analyzeFrame'
import { listScanTags, matchKitParts, type KitMatch } from '@/lib/scan/matchKitParts'
import {
  scanFacingLabel,
  scanVideoConstraints,
  type ScanFacing,
} from '@/lib/scan/cameraConstraints'
import { useInspector } from '@/hooks/useInspector'
import { cn } from '@/lib/cn'

export function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facing, setFacing] = useState<ScanFacing>('user')
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [analysis, setAnalysis] = useState<FrameAnalysis | null>(null)
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null)
  const [matches, setMatches] = useState<readonly KitMatch[]>([])
  const { setContent } = useInspector()
  const tags = useMemo(() => listScanTags().slice(0, 24), [])

  useEffect(() => {
    setContent({
      title: 'Kit scanner',
      body: (
        <div className="space-y-2 text-sm text-[var(--color-text-muted)]">
          <p>
            Camera stays on-device. Defaults to the front camera and shows the full frame (not a tight crop).
          </p>
          <p className="font-mono-tech text-xs">Hint: plain background, one part, good light.</p>
        </div>
      ),
    })
    return () => setContent(null)
  }, [setContent])

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [stream])

  async function openCamera(nextFacing: ScanFacing) {
    setError(null)
    stream?.getTracks().forEach((track) => track.stop())
    if (videoRef.current) videoRef.current.srcObject = null

    try {
      let media: MediaStream
      try {
        media = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: scanVideoConstraints(nextFacing),
        })
      } catch {
        // Some desktops ignore facingMode; fall back to any camera with a wide frame.
        media = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            width: { ideal: 1920, min: 640 },
            height: { ideal: 1080, min: 480 },
          },
        })
      }
      setFacing(nextFacing)
      setStream(media)
      if (videoRef.current) {
        videoRef.current.srcObject = media
        await videoRef.current.play()
      }
    } catch {
      setStream(null)
      setError('Camera permission denied or unavailable. You can still type a part name below.')
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach((track) => track.stop())
    setStream(null)
    if (videoRef.current) videoRef.current.srcObject = null
  }

  function captureAndMatch(nextQuery = query) {
    const video = videoRef.current
    const canvas = canvasRef.current
    let nextAnalysis: FrameAnalysis | null = analysis

    if (video && canvas && video.readyState >= 2) {
      const w = video.videoWidth || 640
      const h = video.videoHeight || 480
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (ctx) {
        ctx.drawImage(video, 0, 0, w, h)
        const image = ctx.getImageData(0, 0, w, h)
        nextAnalysis = analyzeImageData(image)
        setAnalysis(nextAnalysis)
        setSnapshotUrl(canvas.toDataURL('image/jpeg', 0.85))
      }
    }

    const ranked = matchKitParts(nextAnalysis, nextQuery, 6)
    setMatches(ranked)
  }

  function applyTag(tag: string) {
    setQuery(tag)
    captureAndMatch(tag)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Vision bench"
        title="Kit scanner"
        description="Uses the front camera by default and shows more of the frame so the whole part stays in view. Capture ranks local kit matches — nothing leaves this device."
        actions={<PageListenButton />}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)]">
        <LabPanel className="space-y-3">
          <div className="relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-black">
            <video
              ref={videoRef}
              className="aspect-video w-full object-contain"
              playsInline
              muted
              aria-label="Kit camera preview"
            />
            {!stream ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)]/90 p-6 text-center text-sm text-[var(--color-text-muted)]">
                Start the front camera to detect parts. Switch to Rear if your desk faces the back lens.
              </div>
            ) : null}
          </div>
          <canvas ref={canvasRef} className="hidden" />

          <fieldset>
            <legend className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
              Camera
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {(['user', 'environment'] as const).map((mode) => {
                const selected = facing === mode
                return (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={selected}
                    className={cn(
                      'min-h-11 px-3 text-sm',
                      selected
                        ? 'bg-[var(--color-accent-strong)] text-[var(--color-text-on-accent)]'
                        : 'border border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
                    )}
                    onClick={() => {
                      if (stream) void openCamera(mode)
                      else setFacing(mode)
                    }}
                  >
                    {scanFacingLabel(mode)}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-2">
            {!stream ? (
              <button type="button" className="lab-btn-primary" onClick={() => void openCamera(facing)}>
                <Camera className="mr-2 inline h-4 w-4" aria-hidden="true" />
                Start {scanFacingLabel(facing).toLowerCase()} camera
              </button>
            ) : (
              <>
                <button type="button" className="lab-btn-primary" onClick={() => captureAndMatch()}>
                  <ScanSearch className="mr-2 inline h-4 w-4" aria-hidden="true" />
                  Capture & detect
                </button>
                <button type="button" className="lab-btn-ghost" onClick={stopCamera}>
                  <CameraOff className="mr-2 inline h-4 w-4" aria-hidden="true" />
                  Stop
                </button>
              </>
            )}
          </div>

          {error ? <p className="text-sm text-[var(--color-warning)]">{error}</p> : null}

          <label className="block space-y-1">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">
              Name / hint (improves detection)
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') captureAndMatch()
              }}
              placeholder="e.g. DHT11, servo, red LED, matrix"
              className="min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm"
            />
          </label>

          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => applyTag(tag)}
                className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-1 font-mono-tech text-[10px] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)]"
              >
                {tag}
              </button>
            ))}
          </div>
        </LabPanel>

        <div className="space-y-3">
          {snapshotUrl ? (
            <LabPanel>
              <p className="font-mono-tech text-[10px] tracking-wide text-[var(--color-text-muted)] uppercase">
                Last capture
              </p>
              <img
                src={snapshotUrl}
                alt="Captured kit part"
                className="mt-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] object-contain"
              />
              {analysis ? (
                <p className="mt-2 font-mono-tech text-[11px] text-[var(--color-text-muted)]">
                  hues {analysis.dominantHues.slice(0, 3).join(' · ')} · {analysis.brightness}
                </p>
              ) : null}
            </LabPanel>
          ) : null}

          <LabPanel>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
              <h2 className="text-sm font-semibold">Matches</h2>
            </div>
            {matches.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Capture a frame or type a part hint to rank catalog matches.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {matches.map((match) => (
                  <li
                    key={match.profile.slug}
                    className={cn(
                      'rounded-[var(--radius-sm)] border border-[var(--color-border)] p-3',
                      match.score >= 40 && 'border-[var(--color-accent)]',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{match.component.name}</p>
                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                          {match.profile.howToConfirm}
                        </p>
                        <p className="mt-1 font-mono-tech text-[10px] text-[var(--color-accent)]">
                          score {match.score}
                          {match.reasons.length ? ` · ${match.reasons.slice(0, 2).join(', ')}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Link
                        to={`/components/${match.component.slug}`}
                        className="text-xs text-[var(--color-accent)] hover:underline"
                      >
                        Open datasheet
                      </Link>
                      <Link to="/lab/3d" className="text-xs text-[var(--color-accent)] hover:underline">
                        3D Lab
                      </Link>
                      {match.component.relatedLessons[0] ? (
                        <Link
                          to={`/learn/${match.component.relatedLessons[0]}`}
                          className="text-xs text-[var(--color-accent)] hover:underline"
                        >
                          Lesson
                        </Link>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </LabPanel>
        </div>
      </div>
    </div>
  )
}
