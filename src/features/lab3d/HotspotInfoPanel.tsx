import { Link } from 'react-router-dom'
import type { Lab3dHotspot } from '@/data/lab3d/unoBoard'
import { ListenButton } from '@/components/audio/ListenButton'
import { narrateHotspot } from '@/lib/audio/buildNarration'

interface HotspotInfoPanelProps {
  readonly hotspot: Lab3dHotspot | null
}

export function HotspotInfoPanel({ hotspot }: HotspotInfoPanelProps) {
  if (!hotspot) {
    return (
      <aside className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-muted)]">
        Select a hotspot on the board or from the list to inspect pins and teaching notes. Critical
        information is also available without WebGL.
      </aside>
    )
  }

  return (
    <aside className="space-y-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div>
        <p className="font-mono-tech text-xs uppercase tracking-wide text-[var(--color-accent)]">
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
          {hotspot.pinNames.map((name) => (
            <li
              key={name}
              className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-1 font-mono-tech text-xs"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap gap-2">
        {hotspot.relatedComponentSlug ? (
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
