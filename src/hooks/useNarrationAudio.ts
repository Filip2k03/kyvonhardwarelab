import { useContext } from 'react'
import { NarrationContext, type NarrationContextValue } from '@/hooks/narrationContext'

export function useNarration(): NarrationContextValue {
  const value = useContext(NarrationContext)
  if (!value) throw new Error('useNarration must be used inside NarrationProvider')
  return value
}
