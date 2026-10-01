import { useMemo, useState } from 'react'
import { listHardware } from '@/data/hardware'
import { filterHardware } from '@/lib/hardware/filterHardware'
import {
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  HARDWARE_CATEGORIES,
  HARDWARE_CATEGORY_LABELS,
} from '@/lib/hardware/labels'
import type { Difficulty, HardwareCategory } from '@/types/hardware'
import { ComponentCard } from '@/features/hardware/ComponentCard'
import { EmptyState } from '@/components/ui/EmptyState'

type CategoryFilter = HardwareCategory | 'all'
type DifficultyFilter = Difficulty | 'all'

export function ComponentsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all')

  const results = useMemo(
    () =>
      filterHardware(listHardware(), {
        query,
        category,
        difficulty,
      }),
    [query, category, difficulty],
  )

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Components</h1>
        <p className="max-w-2xl text-sm text-[var(--color-text-muted)]">
          Searchable encyclopedia of the KYVON physical kit. Content is typed data — pages render
          catalog records rather than hard-coded copy.
        </p>
      </header>

      <form
        className="grid gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:grid-cols-3"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="flex flex-col gap-1 sm:col-span-3">
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

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-[var(--color-text-muted)]">Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as CategoryFilter)}
            className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm"
          >
            <option value="all">All categories</option>
            {HARDWARE_CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {HARDWARE_CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>
        </label>

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

        <div className="flex items-end">
          <p className="font-mono-tech text-xs text-[var(--color-text-muted)]" aria-live="polite">
            {results.length} result{results.length === 1 ? '' : 's'}
          </p>
        </div>
      </form>

      {results.length === 0 ? (
        <EmptyState
          title="No components match"
          description="Try a broader search or clear category/difficulty filters."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">{results.map((component) => (
          <ComponentCard key={component.id} component={component} />
        ))}</ul>
      )}
    </div>
  )
}
