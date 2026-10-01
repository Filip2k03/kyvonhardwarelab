interface EmptyStateProps {
  readonly title: string
  readonly description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <h2 className="text-base font-semibold text-[var(--color-text)]">{title}</h2>
      <p className="mt-2 max-w-prose text-sm text-[var(--color-text-muted)]">{description}</p>
    </div>
  )
}
