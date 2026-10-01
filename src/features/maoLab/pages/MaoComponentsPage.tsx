import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LabPanel } from '@/components/ui/LabPanel'
import { listMaoParts } from '@/features/maoLab/data/components'
import { MaoInspectorPanel } from '@/features/maoLab/components/MaoInspectorPanel'
import { ConnectionGuidePanel } from '@/features/maoLab/components/ConnectionGuidePanel'
import { cn } from '@/lib/cn'

export function MaoComponentsPage() {
  const parts = useMemo(() => listMaoParts(), [])
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(parts[0]?.id ?? null)
  const filtered = parts.filter((part) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      part.name.toLowerCase().includes(q) ||
      part.category.includes(q) ||
      part.maoUsage.toLowerCase().includes(q)
    )
  })

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)]">
      <div className="space-y-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search kit parts…"
          className="min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm"
        />
        <ul className="grid gap-2 sm:grid-cols-2">
          {filtered.map((part) => (
            <li key={part.id}>
              <button
                type="button"
                onClick={() => setSelectedId(part.id)}
                className={cn(
                  'flex min-h-11 w-full flex-col rounded-[var(--radius-md)] border p-3 text-left',
                  selectedId === part.id
                    ? 'border-[var(--color-accent)] bg-[var(--color-surface-raised)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)]',
                )}
              >
                <span className="text-sm font-medium">{part.name}</span>
                <span className="mt-1 font-mono-tech text-[10px] text-[var(--color-text-muted)]">
                  {part.category} · {part.verified ? 'verified' : 'UNVERIFIED'}
                </span>
                <span className="mt-2 text-xs text-[var(--color-text-muted)]">{part.maoUsage}</span>
                {part.catalogSlug ? (
                  <Link
                    to={`/components/${part.catalogSlug}`}
                    className="mt-2 text-xs text-[var(--color-accent)] hover:underline"
                    onClick={(event) => event.stopPropagation()}
                  >
                    Catalog
                  </Link>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
        <LabPanel>
          <p className="text-xs text-[var(--color-text-muted)]">
            Select a part for pins + how-to-connect. Unverified hardware never gets authoritative wiring.
          </p>
        </LabPanel>
      </div>
      <div className="space-y-3">
        <MaoInspectorPanel selectedId={selectedId} />
        <ConnectionGuidePanel partId={selectedId} />
      </div>
    </div>
  )
}
