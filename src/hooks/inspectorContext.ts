import { createContext } from 'react'
import type { ReactNode } from 'react'

export interface InspectorContent {
  readonly title: string
  readonly body?: ReactNode
}

export interface InspectorContextValue {
  readonly content: InspectorContent | null
  readonly setContent: (content: InspectorContent | null) => void
  readonly mobileOpen: boolean
  readonly setMobileOpen: (open: boolean) => void
}

export const InspectorContext = createContext<InspectorContextValue | null>(null)
