import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface LabPanelProps {
  readonly children: ReactNode
  readonly className?: string
  readonly padded?: boolean
  readonly id?: string
}

export function LabPanel({ children, className, padded = true, id }: LabPanelProps) {
  return (
    <div
      id={id}
      className={cn(
        'lab-panel border border-[var(--color-border)] bg-[var(--color-surface)]',
        padded ? 'p-4' : null,
        className,
      )}
    >
      {children}
    </div>
  )
}

interface SectionTitleProps {
  readonly id?: string
  readonly children: ReactNode
  readonly className?: string
}

export function SectionTitle({ id, children, className }: SectionTitleProps) {
  return (
    <h2
      id={id}
      className={cn(
        'text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase',
        className,
      )}
    >
      {children}
    </h2>
  )
}
