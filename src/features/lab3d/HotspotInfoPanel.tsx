import { Link } from 'react-router-dom'
import type { Lab3dHotspot } from '@/data/lab3d/unoBoard'
import { findHardwareBySlug } from '@/data/hardware'
import { ListenButton } from '@/components/audio/ListenButton'
import { narrateHotspot } from '@/lib/audio/buildNarration'
import { cn } from '@/lib/cn'

interface HotspotInfoPanelProps {
  readonly hotspot: Lab3dHotspot | null
  readonly selectedPin: string | null
  readonly onSelectPin: (pin: string | null) => void
}

export function HotspotInfoPanel({ hotspot, selectedPin, onSelectPin }: HotspotInfoPanelProps) {
  if (!hotspot) {
    return (
      <aside className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-muted)]">
        Select a hotspot on the board or from the list to inspect pins and teaching notes. Critical
        information is also available without WebGL.
      </aside>
    )
  }

  const catalog = hotspot.relatedComponentSlug
    ? findHardwareBySlug(hotspot.relatedComponentSlug)
    : undefined

  return (
    <aside className="space-y-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div>
        <p className="font-mono-tech text-xs tracking-wide text-[var(--color-accent)] uppercase">
          {hotspot.category}
        </p>
        <h2 className="text-lg font-semibold">{hotspot.label}</h2>
      </div>
      <ListenButton
        id={`hotspot:${hotspot.id}`}
        title={hotspot.label}
        text={narrateHotspot(hotspot)}
        compact
      />
      <p className="text-sm">{hotspot.summary}</p>
      <p className="text-sm text-[var(--color-text-muted)]">{hotspot.details}</p>

      <div>
        <h3 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Pins / labels
        </h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {hotspot.pinNames.map((name) => {
            const active = selectedPin === name
            return (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => onSelectPin(active ? null : name)}
                  className={cn(
                    'min-h-11 rounded-[var(--radius-sm)] border px-2 py-1 font-mono-tech text-xs',
                    active
                      ? 'border-[var(--color-accent)] bg-[var(--color-surface-raised)] text-[var(--color-accent-strong)]'
                      : 'border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-raised)]',
                  )}
                  aria-pressed={active}
                >
                  {name}
                </button>
              </li>
            )
          })}
        </ul>
        {selectedPin ? (
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Selected pin <span className="font-mono-tech text-[var(--color-text)]">{selectedPin}</span>
            {catalog ? (
              <>
                {' '}
                maps to catalog part{' '}
                <Link
                  to={`/components/${catalog.slug}`}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {catalog.name}
                </Link>
                .
              </>
            ) : (
              <> — open the linked lesson for wiring context.</>
            )}
          </p>
        ) : null}
      </div>

      {catalog ? (
        <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3">
          <p className="font-mono-tech text-[10px] tracking-wide text-[var(--color-text-muted)] uppercase">
            Hardware catalog
          </p>
          <p className="mt-1 text-sm font-medium">{catalog.name}</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{catalog.description}</p>
          <Link
            to={`/components/${catalog.slug}`}
            className="mt-2 inline-flex min-h-11 items-center text-xs text-[var(--color-accent)] hover:underline"
          >
            Open component sheet
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {hotspot.relatedComponentSlug && !catalog ? (
          <Link
            to={`/components/${hotspot.relatedComponentSlug}`}
            className="inline-flex min-h-11 items-center rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 text-xs text-[var(--color-accent)]"
          >
            Open component
          </Link>
        ) : null}
        {hotspot.relatedLessonSlug ? (
          <Link
            to={`/learn/${hotspot.relatedLessonSlug}`}
            className="inline-flex min-h-11 items-center rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 text-xs text-[var(--color-accent)]"
          >
            Open lesson
          </Link>
        ) : null}
      </div>
    </aside>
  )
}
