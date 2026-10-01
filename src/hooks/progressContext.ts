import { createContext } from 'react'
import type { ProgressContextValue } from '@/hooks/progressTypes'

export type { ProgressContextValue }

export const ProgressContext = createContext<ProgressContextValue | null>(null)
