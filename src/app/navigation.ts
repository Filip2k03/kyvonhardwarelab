import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  Bot,
  Boxes,
  Camera,
  CircuitBoard,
  ClipboardList,
  Cpu,
  FolderKanban,
  Gauge,
  Home,
  BotMessageSquare,
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
  { to: '/scan', label: 'Scan', icon: Camera },
  { to: '/assist', label: 'Assist', icon: BotMessageSquare },
  { to: '/projects/mao-mark-i', label: 'MAO Lab', icon: Bot },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tools', label: 'Tools', icon: Wrench },
  { to: '/handouts', label: 'Handouts', icon: ClipboardList },
  { to: '/progress', label: 'Progress', icon: Gauge },
] as const

/** Compact mobile bottom bar (subset + overflow via Home). */
export const MOBILE_NAV: readonly NavItem[] = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/scan', label: 'Scan', icon: Camera },
  { to: '/assist', label: 'Assist', icon: BotMessageSquare },
  { to: '/lab/3d', label: '3D', icon: Boxes },
  { to: '/projects/mao-mark-i', label: 'MAO', icon: Bot },
] as const

/** @deprecated Prefer PRIMARY_NAV — kept empty for older imports. */
export const SECONDARY_NAV: readonly NavItem[] = [] as const
