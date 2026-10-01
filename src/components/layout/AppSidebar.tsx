import { NavLink } from 'react-router-dom'
import { PRIMARY_NAV, SECONDARY_NAV } from '@/app/navigation'
import { cn } from '@/lib/cn'

interface AppSidebarProps {
  readonly onNavigate?: () => void
}

function linkClass({ isActive }: { isActive: boolean }): string {
  return cn(
    'flex min-h-11 items-center gap-3 border-l-2 px-3 py-2 text-sm transition-colors',
    isActive
      ? 'border-[var(--color-accent)] bg-[var(--color-surface-raised)] text-[var(--color-text)]'
      : 'border-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]',
  )
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  return (
    <nav aria-label="Primary" className="flex h-full flex-col gap-6 p-4">
      <div>
        <p className="px-3 text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Workspace
        </p>
        <ul className="mt-2 space-y-1">
          {PRIMARY_NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                {...(item.end === true ? { end: true } : {})}
                className={linkClass}
                onClick={onNavigate}
              >
                <item.icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="px-3 text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Inspection
        </p>
        <ul className="mt-2 space-y-1">
          {SECONDARY_NAV.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={linkClass} onClick={onNavigate}>
                <item.icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
