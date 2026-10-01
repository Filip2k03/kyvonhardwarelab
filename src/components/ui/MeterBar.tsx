import { cn } from '@/lib/cn'

interface MeterBarProps {
  readonly value: number
  readonly max: number
  readonly label: string
  readonly className?: string
}

export function MeterBar({ value, max, label, className }: MeterBarProps) {
  const safeMax = Math.max(max, 1)
  const ratio = Math.min(1, Math.max(0, value / safeMax))
  const percent = Math.round(ratio * 100)

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
        <p className="font-mono-tech text-xs text-[var(--color-text-muted)]">{percent}%</p>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-bg)]"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={value}
      >
        <div
          className="h-full rounded-[var(--radius-sm)] bg-[var(--color-accent)] transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
