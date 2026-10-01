import { useContext } from 'react'
import { ProgressContext } from '@/hooks/progressContext'
import type { ProgressContextValue } from '@/hooks/progressTypes'

export function useProgress(): ProgressContextValue {
  const value = useContext(ProgressContext)
  if (!value) {
    throw new Error('useProgress must be used within ProgressProvider')
  }
  return value
}
