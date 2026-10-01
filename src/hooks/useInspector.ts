import { useContext } from 'react'
import { InspectorContext, type InspectorContextValue } from '@/hooks/inspectorContext'

export function useInspector(): InspectorContextValue {
  const value = useContext(InspectorContext)
  if (!value) throw new Error('useInspector must be used inside InspectorProvider')
  return value
}
