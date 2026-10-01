import type { ProgressStatus } from '@/types/hardware'
import { PROGRESS_STATUS_LABELS } from '@/lib/learn/labels'
import { cn } from '@/lib/cn'

const STATUS_CLASS: Record<ProgressStatus, string> = {
  NOT_STARTED: 'lab-chip lab-chip-muted',
  IN_PROGRESS: 'lab-chip lab-chip-accent',
  COMPLETED: 'lab-chip lab-chip-success',
}

interface StatusChipProps {
  readonly status: ProgressStatus
  readonly className?: string
}

export function StatusChip({ status, className }: StatusChipProps) {
  return (
    <span className={cn(STATUS_CLASS[status], className)}>{PROGRESS_STATUS_LABELS[status]}</span>
  )
}
