import { cn } from '@/lib/cn'

interface SpinnerProps {
  readonly label?: string
  readonly className?: string
}

export function Spinner({ label = 'Loading', className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)]', className)}
    >
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-border-strong)] border-t-[var(--color-accent)] motion-reduce:animate-none"
      />
      <span>{label}</span>
    </div>
  )
}

export function PageLoader({ label = 'Loading page' }: { readonly label?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center p-8">
      <Spinner label={label} />
    </div>
  )
}
