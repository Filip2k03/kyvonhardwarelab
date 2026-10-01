import { useMemo, useState } from 'react'
import { listHardware } from '@/data/hardware'
import { filterHardware } from '@/lib/hardware/filterHardware'
import { DIFFICULTIES, DIFFICULTY_LABELS } from '@/lib/hardware/labels'
import {
  EXPLORER_GROUPS,
  componentMatchesExplorerGroup,
  type ExplorerGroupId,
} from '@/lib/hardware/explorerGroups'
import type { Difficulty } from '@/types/hardware'
import { ComponentCard } from '@/features/hardware/ComponentCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { LabPanel } from '@/components/ui/LabPanel'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageListenButton } from '@/components/audio/ListenButton'
import { cn } from '@/lib/cn'

type DifficultyFilter = Difficulty | 'all'

export function ComponentsPage() {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<ExplorerGroupId>('all')
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all')

  const results = useMemo(() => {
    const base = filterHardware(listHardware(), {
      query,
      category: 'all',
      difficulty,
    })
    return base.filter((component) => componentMatchesExplorerGroup(component.category, group))
  }, [query, group, difficulty])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Kit encyclopedia"
        title="Components"
        description="Engineering catalog of the KYVON physical kit. Open a part for pinout, electrical limits, wiring diagrams, firmware excerpts, and related experiments."
        actions={<PageListenButton />}
      />

      <LabPanel>
        <form
          className="grid gap-3"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, pin, interface, use case…"
              className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text)]"
              autoComplete="off"
            />
          </label>

          <fieldset>
            <legend className="text-xs font-medium text-[var(--color-text-muted)]">Family</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={group === 'all'}
                className={cn(
                  'min-h-10 rounded-[var(--radius-sm)] border px-3 text-xs',
                  group === 'all'
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-muted)]',
                )}
                onClick={() => setGroup('all')}
              >
                All
              </button>
              {EXPLORER_GROUPS.map((item) => {
                const selected = group === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    className={cn(
                      'min-h-10 rounded-[var(--radius-sm)] border px-3 text-xs',
                      selected
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]'
                        : 'border-[var(--color-border)] text-[var(--color-text-muted)]',
                    )}
                    onClick={() => setGroup(item.id)}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-[var(--color-text-muted)]">Difficulty</span>
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value as DifficultyFilter)}
                className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm"
              >
                <option value="all">All difficulties</option>
                {DIFFICULTIES.map((value) => (
                  <option key={value} value={value}>
                    {DIFFICULTY_LABELS[value]}
                  </option>
                ))}
              </select>
            </label>
            <p
              className="self-end font-mono-tech text-xs text-[var(--color-text-muted)]"
              aria-live="polite"
            >
              {results.length} result{results.length === 1 ? '' : 's'}
            </p>
          </div>
        </form>
      </LabPanel>

      {results.length === 0 ? (
        <EmptyState
          title="No components match"
          description="Try a broader search or clear family/difficulty filters."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {results.map((component) => (
            <ComponentCard key={component.id} component={component} />
          ))}
        </ul>
      )}
    </div>
  )
}
