import type { ProgressStatus } from '@/types/hardware'

export const PROGRESS_STATUS_LABELS: Record<ProgressStatus, string> = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
}
