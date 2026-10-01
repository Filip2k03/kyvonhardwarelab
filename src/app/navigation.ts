import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  Boxes,
  CircuitBoard,
  ClipboardList,
  Cpu,
  FolderKanban,
  Gauge,
  Home,
  Wrench,
} from 'lucide-react'

export interface NavItem {
  readonly to: string
  readonly label: string
  readonly icon: LucideIcon
  readonly end?: boolean
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { to: '/', label: 'Dashboard', icon: Home, end: true },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/components', label: 'Components', icon: Cpu },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/lab', label: 'Lab', icon: CircuitBoard },
  { to: '/tools', label: 'Tools', icon: Wrench },
  { to: '/handouts', label: 'Handouts', icon: ClipboardList },
  { to: '/progress', label: 'Progress', icon: Gauge },
] as const

export const SECONDARY_NAV: readonly NavItem[] = [
  { to: '/lab/3d', label: '3D Explorer', icon: Boxes },
] as const
