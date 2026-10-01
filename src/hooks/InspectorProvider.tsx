import { useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  InspectorContext,
  type InspectorContent,
} from '@/hooks/inspectorContext'

export function InspectorProvider({ children }: { readonly children: ReactNode }) {
  const [content, setContentState] = useState<InspectorContent | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const setContent = useCallback((next: InspectorContent | null) => {
    setContentState(next)
    if (next) setMobileOpen(true)
  }, [])

  const value = useMemo(
    () => ({ content, setContent, mobileOpen, setMobileOpen }),
    [content, setContent, mobileOpen],
  )

  return <InspectorContext.Provider value={value}>{children}</InspectorContext.Provider>
}
