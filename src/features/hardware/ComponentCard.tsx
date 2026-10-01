import { Link } from 'react-router-dom'
import type { HardwareComponent } from '@/types/hardware'
import { DIFFICULTY_LABELS, HARDWARE_CATEGORY_LABELS } from '@/lib/hardware/labels'

interface ComponentCardProps {
  readonly component: HardwareComponent
}

export function ComponentCard({ component }: ComponentCardProps) {
  return (
    <li>
      <Link
        to={`/components/${component.slug}`}
        className="block rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-border-strong)]"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">{component.name}</h2>
          <span className="font-mono-tech text-xs text-[var(--color-text-muted)]">
            {DIFFICULTY_LABELS[component.difficulty]}
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--color-accent)]">
          {HARDWARE_CATEGORY_LABELS[component.category]}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-[var(--color-text-muted)]">{component.description}</p>
      </Link>
    </li>
  )
}
