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

/** Primary destinations for the workstation shell. */
export const PRIMARY_NAV: readonly NavItem[] = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/components', label: 'Components', icon: Cpu },
  { to: '/lab', label: 'Workbench', icon: CircuitBoard },
  { to: '/lab/3d', label: '3D Lab', icon: Boxes },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tools', label: 'Tools', icon: Wrench },
  { to: '/handouts', label: 'Handouts', icon: ClipboardList },
  { to: '/progress', label: 'Progress', icon: Gauge },
] as const

/** Compact mobile bottom bar (subset + overflow via Home). */
export const MOBILE_NAV: readonly NavItem[] = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/lab', label: 'Workbench', icon: CircuitBoard },
  { to: '/lab/3d', label: '3D Lab', icon: Boxes },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
] as const

/** @deprecated Prefer PRIMARY_NAV — kept empty for older imports. */
export const SECONDARY_NAV: readonly NavItem[] = [] as const
