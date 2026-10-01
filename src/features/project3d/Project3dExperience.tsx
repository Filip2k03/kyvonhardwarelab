import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Headphones,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Square,
  X,
} from 'lucide-react'
import type { Project } from '@/types/project'
import { buildProjectScene } from '@/lib/projects/buildProjectScene'
import {
  narrateProjectIntro,
  narrateProjectStep,
} from '@/lib/audio/projectStepNarration'
import {
  pauseSpeech,
  resumeSpeech,
  speakNarration,
  speechSupported,
  stopSpeech,
} from '@/lib/audio/speechEngine'
import { useNarration } from '@/hooks/useNarrationAudio'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { detectWebGL } from '@/lib/lab3d/detectWebGL'
import { Project3dCanvas } from '@/features/project3d/Project3dCanvas'
import { cn } from '@/lib/cn'

interface Project3dExperienceProps {
  readonly project: Project
}

export function Project3dExperience({ project }: Project3dExperienceProps) {
  const scene = useMemo(() => buildProjectScene(project), [project])
  const reducedMotion = usePrefersReducedMotion()
  const { voiceId } = useNarration()
  const [stepIndex, setStepIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [audioStep, setAudioStep] = useState<number | null>(null)
  const [webgl] = useState(() => detectWebGL())
  const supported = speechSupported()
  const playGen = useRef(0)

  const step = scene.steps[stepIndex]
  const total = scene.steps.length
  const liveSpeaking = speaking && audioStep === stepIndex
  const livePaused = paused && audioStep === stepIndex

  useEffect(() => {
    playGen.current += 1
    stopSpeech()
  }, [stepIndex, project.id])

  useEffect(() => () => stopSpeech(), [])

  useEffect(() => {
    if (!fullscreen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullscreen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fullscreen])

  const playStep = useCallback(
    async (index: number) => {
      const current = scene.steps[index]
      if (!current || !supported) return
      const gen = ++playGen.current
      setAudioStep(index)
      setSpeaking(true)
      setPaused(false)
      const text = narrateProjectStep(project, current, total)
      await speakNarration({
        text,
        voiceId,
        onStatus: (status) => {
          if (gen !== playGen.current) return
          if (status === 'speaking') {
            setSpeaking(true)
            setPaused(false)
          }
          if (status === 'paused') setPaused(true)
          if (status === 'idle' || status === 'unsupported') {
            setSpeaking(false)
            setPaused(false)
            setAudioStep(null)
          }
        },
      })
      if (gen !== playGen.current) return
      if (autoAdvance && index < total - 1) {
        setStepIndex(index + 1)
      }
    },
    [scene.steps, supported, project, total, voiceId, autoAdvance],
  )

  const playIntro = useCallback(async () => {
    if (!supported) return
    const gen = ++playGen.current
    setAudioStep(stepIndex)
    setSpeaking(true)
    await speakNarration({
      text: narrateProjectIntro(project),
      voiceId,
      onStatus: (status) => {
        if (gen !== playGen.current) return
        setSpeaking(status === 'speaking')
        setPaused(status === 'paused')
        if (status === 'idle' || status === 'unsupported') {
          setSpeaking(false)
          setPaused(false)
          setAudioStep(null)
        }
      },
    })
  }, [project, supported, voiceId, stepIndex])

  const shell = (
    <div
      className={cn(
        'flex min-h-0 flex-col bg-[var(--color-bg)]',
        fullscreen ? 'fixed inset-0 z-[60]' : 'relative min-h-[34rem] border border-[var(--color-border)]',
      )}
    >
      <header className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
        <div className="min-w-0">
          <p className="font-mono-tech text-[11px] text-[var(--color-accent)]">
            3D build · step {stepIndex + 1}/{total || 1}
          </p>
          <h2 className="truncate text-sm font-semibold sm:text-base">
            {step?.title ?? project.title}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-2 border border-[var(--color-border)] px-3 text-sm"
            onClick={() => setFullscreen((value) => !value)}
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            )}
            {fullscreen ? 'Exit full screen' : 'Full screen'}
          </button>
          {fullscreen ? (
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--color-border)]"
              onClick={() => setFullscreen(false)}
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Close full screen</span>
            </button>
          ) : (
            <Link
              to={`/projects/${project.slug}`}
              className="inline-flex min-h-11 items-center border border-[var(--color-border)] px-3 text-sm"
            >
              Back to project
            </Link>
          )}
        </div>
      </header>

      <div
        className={cn(
          'grid min-h-0 flex-1',
          fullscreen ? 'lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.9fr)]' : 'lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.9fr)]',
        )}
      >
        <div className={cn('min-h-[280px]', fullscreen ? 'min-h-0' : 'h-[min(52vh,460px)]')}>
          {webgl ? (
            <Project3dCanvas
              scene={scene}
              stepIndex={stepIndex}
              reducedMotion={reducedMotion}
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[var(--color-surface)] p-6 text-sm text-[var(--color-text-muted)]">
              WebGL is unavailable. Use the step list and audio guide to continue the build.
            </div>
          )}
        </div>

        <aside className="flex min-h-0 flex-col gap-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] p-4 lg:border-t-0 lg:border-l">
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            {step?.instructions}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex min-h-11 items-center gap-2 bg-[var(--color-accent-strong)] px-3 text-sm font-medium text-[var(--color-bg)] disabled:opacity-50"
              disabled={!supported || liveSpeaking}
              onClick={() => void playStep(stepIndex)}
            >
              <Headphones className="h-4 w-4" aria-hidden="true" />
              Explain this step
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 items-center gap-2 border border-[var(--color-border)] px-3 text-sm disabled:opacity-50"
              disabled={!supported || liveSpeaking}
              onClick={() => void playIntro()}
            >
              Intro
            </button>
            {liveSpeaking && !livePaused ? (
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-2 border border-[var(--color-border)] px-3 text-sm"
                onClick={() => {
                  pauseSpeech()
                  setPaused(true)
                }}
              >
                <Pause className="h-4 w-4" aria-hidden="true" />
                Pause
              </button>
            ) : null}
            {livePaused ? (
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-2 border border-[var(--color-border)] px-3 text-sm"
                onClick={() => {
                  resumeSpeech()
                  setPaused(false)
                  setSpeaking(true)
                }}
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                Resume
              </button>
            ) : null}
            {liveSpeaking || livePaused ? (
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-2 border border-[var(--color-border)] px-3 text-sm"
                onClick={() => {
                  playGen.current += 1
                  stopSpeech()
                  setSpeaking(false)
                  setPaused(false)
                  setAudioStep(null)
                }}
              >
                <Square className="h-3.5 w-3.5" aria-hidden="true" />
                Stop
              </button>
            ) : null}
          </div>

          <label className="flex min-h-11 items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(event) => setAutoAdvance(event.target.checked)}
            />
            Auto-advance after audio
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-1 border border-[var(--color-border)] text-sm disabled:opacity-40"
              disabled={stepIndex <= 0}
              onClick={() => setStepIndex((value) => Math.max(0, value - 1))}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-1 border border-[var(--color-border)] text-sm disabled:opacity-40"
              disabled={stepIndex >= total - 1}
              onClick={() => setStepIndex((value) => Math.min(total - 1, value + 1))}
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <ol className="min-h-0 flex-1 space-y-1 overflow-y-auto">
            {scene.steps.map((item) => {
              const active = item.stepIndex === stepIndex
              return (
                <li key={item.stepIndex}>
                  <button
                    type="button"
                    onClick={() => setStepIndex(item.stepIndex)}
                    className={cn(
                      'flex min-h-11 w-full items-start gap-2 px-3 py-2 text-left text-sm',
                      active
                        ? 'bg-[var(--color-surface-raised)] text-[var(--color-text)]'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]',
                    )}
                  >
                    <span className="font-mono-tech text-[11px] text-[var(--color-accent)]">
                      {String(item.stepIndex + 1).padStart(2, '0')}
                    </span>
                    <span>{item.title}</span>
                  </button>
                </li>
              )
            })}
          </ol>

          <p className="text-[11px] leading-relaxed text-[var(--color-text-muted)]">
            Spoken guides use your browser&apos;s free female voices. Pick Voice 01–10 in Adjust.
            Parts appear as each construction step unlocks.
          </p>
        </aside>
      </div>
    </div>
  )

  return shell
}
