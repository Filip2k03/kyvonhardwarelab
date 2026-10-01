import { Headphones, Pause, Play, Square } from 'lucide-react'
import { useNarration } from '@/hooks/useNarrationAudio'
import { cn } from '@/lib/cn'

interface ListenButtonProps {
  readonly id: string
  readonly title: string
  readonly text: string
  readonly className?: string
  readonly compact?: boolean
}

export function ListenButton({ id, title, text, className, compact = false }: ListenButtonProps) {
  const { supported, status, activeId, listen, pause, resume, stop } = useNarration()
  const isActive = activeId === id
  const speaking = isActive && status === 'speaking'
  const paused = isActive && status === 'paused'
  const busy = isActive && status !== 'idle' && status !== 'unsupported'

  if (!supported) {
    return (
      <p className={cn('text-xs text-[var(--color-text-muted)]', className)}>
        Spoken audio needs a browser with speech synthesis.
      </p>
    )
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {!busy ? (
        <button
          type="button"
          className={cn(
            'inline-flex min-h-11 items-center gap-2 border border-[var(--color-border)] px-3 text-sm hover:border-[var(--color-border-strong)]',
            compact && 'min-h-10 px-2 text-xs',
          )}
          onClick={() => listen(id, title, text)}
        >
          <Headphones className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
          Listen
        </button>
      ) : null}

      {speaking ? (
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 border border-[var(--color-border)] px-3 text-sm"
          onClick={pause}
        >
          <Pause className="h-4 w-4" aria-hidden="true" />
          Pause
        </button>
      ) : null}

      {paused ? (
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 border border-[var(--color-border)] px-3 text-sm"
          onClick={resume}
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          Resume
        </button>
      ) : null}

      {busy ? (
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 border border-[var(--color-border)] px-3 text-sm"
          onClick={stop}
        >
          <Square className="h-3.5 w-3.5" aria-hidden="true" />
          Stop
        </button>
      ) : null}

      {busy ? (
        <span className="font-mono-tech text-[11px] text-[var(--color-accent)]" aria-live="polite">
          {paused ? 'Paused' : 'Speaking'} · female voice
        </span>
      ) : null}
    </div>
  )
}

export function PageListenButton({
  className,
  compact = false,
}: {
  readonly className?: string
  readonly compact?: boolean
}) {
  const { supported, status, activeId, listenToPage, pause, resume, stop } = useNarration()
  const pageActive = Boolean(activeId) && status !== 'idle'

  if (!supported) return null

  const iconOnly = compact
    ? 'min-w-11 justify-center px-2'
    : 'px-3'

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {!pageActive ? (
        <button
          type="button"
          className={cn(
            'inline-flex min-h-11 items-center gap-2 bg-[var(--color-surface-raised)] text-sm',
            iconOnly,
          )}
          onClick={listenToPage}
          aria-label={compact ? 'Listen to this page' : undefined}
        >
          <Headphones className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
          {compact ? <span className="sr-only">Listen to this page</span> : 'Listen to this page'}
        </button>
      ) : status === 'speaking' ? (
        <button
          type="button"
          className={cn(
            'inline-flex min-h-11 items-center gap-2 border border-[var(--color-border)] text-sm',
            iconOnly,
          )}
          onClick={pause}
          aria-label={compact ? 'Pause narration' : undefined}
        >
          <Pause className="h-4 w-4" aria-hidden="true" />
          {compact ? <span className="sr-only">Pause</span> : 'Pause'}
        </button>
      ) : (
        <button
          type="button"
          className={cn(
            'inline-flex min-h-11 items-center gap-2 border border-[var(--color-border)] text-sm',
            iconOnly,
          )}
          onClick={resume}
          aria-label={compact ? 'Resume narration' : undefined}
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          {compact ? <span className="sr-only">Resume</span> : 'Resume'}
        </button>
      )}
      {pageActive ? (
        <button
          type="button"
          className={cn(
            'inline-flex min-h-11 items-center gap-2 border border-[var(--color-border)] text-sm',
            iconOnly,
          )}
          onClick={stop}
          aria-label={compact ? 'Stop narration' : undefined}
        >
          <Square className="h-3.5 w-3.5" aria-hidden="true" />
          {compact ? <span className="sr-only">Stop</span> : 'Stop'}
        </button>
      ) : null}
    </div>
  )
}
