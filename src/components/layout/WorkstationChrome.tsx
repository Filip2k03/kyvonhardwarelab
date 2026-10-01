import { NavLink, useLocation } from 'react-router-dom'
import { Headphones, PanelRight, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MOBILE_NAV, PRIMARY_NAV } from '@/app/navigation'
import { PageListenButton } from '@/components/audio/ListenButton'
import { useInspector } from '@/hooks/useInspector'
import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

function resolveTitle(pathname: string): string {
  if (pathname === '/') return 'Home'
  if (pathname.startsWith('/learn/')) return 'Lesson'
  if (pathname.startsWith('/components/')) return 'Component'
  if (pathname.startsWith('/projects/') && pathname.endsWith('/3d')) return 'Project 3D'
  if (pathname.startsWith('/projects/')) return 'Project'
  if (pathname.startsWith('/lab/circuits/')) return 'Circuit'
  if (pathname === '/lab/3d') return '3D Lab'
  if (pathname === '/lab' || pathname === '/workbench') return 'Workbench'
  if (pathname.startsWith('/tools')) return 'Tools'
  if (pathname.startsWith('/handouts')) return 'Handouts'
  if (pathname.startsWith('/progress')) return 'Progress'
  return 'KYVON Hardware Lab'
}

function defaultInspectorBody(pathname: string): ReactNode {
  if (pathname.startsWith('/lab/3d')) {
    return (
      <p className="text-sm text-[var(--color-text-muted)]">
        Select a hotspot on the board to inspect pins, voltages, and related lessons from the hardware
        catalog.
      </p>
    )
  }
  if (pathname.startsWith('/lab')) {
    return (
      <p className="text-sm text-[var(--color-text-muted)]">
        Open a circuit diagram to inspect wires, pins, and educational safety warnings. This is not a
        SPICE simulator.
      </p>
    )
  }
  if (pathname.startsWith('/components')) {
    return (
      <p className="text-sm text-[var(--color-text-muted)]">
        Catalog records are typed data. Detail pages expose electrical limits, pinouts, and related
        lessons without duplicating content into 3D.
      </p>
    )
  }
  if (pathname.startsWith('/learn')) {
    return (
      <p className="text-sm text-[var(--color-text-muted)]">
        Follow Learn → Predict → Wire → Code → Build → Measure → Debug → Challenge. Progress stays in
        this browser only.
      </p>
    )
  }
  return (
    <p className="text-sm text-[var(--color-text-muted)]">
      Context for the active view appears here. Selection in Workbench or 3D Lab will drive this panel.
    </p>
  )
}

export function TopCommandBar() {
  const location = useLocation()
  const title = resolveTitle(location.pathname)
  const { content, setMobileOpen } = useInspector()

  return (
    <header className="no-print sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 shadow-[var(--shadow-sm)] backdrop-blur-sm">
      <div className="flex h-14 items-center gap-3 px-3 sm:px-4">
        <Link to="/" className="hidden min-w-0 shrink-0 sm:block">
          <span className="font-mono-tech text-xs font-semibold tracking-[0.16em] text-[var(--color-accent-strong)]">
            KYVON
          </span>
          <span className="ml-2 text-xs text-[var(--color-text-muted)]">Hardware Lab</span>
        </Link>

        <div className="mx-1 hidden h-6 w-px bg-[var(--color-border)] sm:block" aria-hidden="true" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[var(--color-text)]">{title}</p>
          <p className="truncate font-mono-tech text-[11px] text-[var(--color-text-muted)]">
            {location.pathname}
          </p>
        </div>

        <PageListenButton className="hidden sm:flex" />

        <button
          type="button"
          className={cn(
            'inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 text-xs xl:hidden',
            content
              ? 'border-[var(--color-accent)] text-[var(--color-accent-strong)]'
              : 'text-[var(--color-text-muted)]',
          )}
          onClick={() => setMobileOpen(true)}
        >
          <PanelRight className="h-4 w-4" aria-hidden="true" />
          Inspector
        </button>

        <span className="hidden items-center gap-1 font-mono-tech text-[10px] tracking-wide text-[var(--color-text-muted)] uppercase md:inline-flex">
          <Headphones className="h-3.5 w-3.5" aria-hidden="true" />
          Local bench
        </span>
      </div>
    </header>
  )
}

export function LeftWorkstationNav({ onNavigate }: { readonly onNavigate?: () => void }) {
  return (
    <nav aria-label="Primary" className="flex h-full flex-col p-3">
      <p className="mb-3 px-2 font-mono-tech text-[10px] tracking-[0.14em] text-[var(--color-text-muted)] uppercase">
        Workspace
      </p>
      <ul className="space-y-0.5">
        {PRIMARY_NAV.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              {...(item.end === true ? { end: true } : {})}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex min-h-11 items-center gap-3 rounded-[var(--radius-sm)] border-l-2 px-3 py-2 text-sm transition-colors duration-150',
                  isActive
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-text)]'
                    : 'border-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]',
                )
              }
            >
              <item.icon aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-auto border-t border-[var(--color-border)] px-2 pt-3">
        <p className="font-mono-tech text-[10px] tracking-wide text-[var(--color-text-muted)] uppercase">
          Progress stays on this device
        </p>
      </div>
    </nav>
  )
}

export function InspectorPanel() {
  const location = useLocation()
  const { content, mobileOpen, setMobileOpen } = useInspector()
  const title = content?.title ?? 'Inspector'
  const body = content?.body ?? defaultInspectorBody(location.pathname)

  const panel = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <h2 className="font-mono-tech text-xs tracking-[0.12em] text-[var(--color-text-muted)] uppercase">
          {title}
        </h2>
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] xl:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Close inspector</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">{body}</div>
    </div>
  )

  return (
    <>
      <aside className="no-print hidden w-72 shrink-0 border-l border-[var(--color-border)] bg-[var(--color-surface)] xl:block">
        {panel}
      </aside>

      {mobileOpen ? (
        <div className="no-print fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Dismiss inspector"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[70vh] overflow-hidden rounded-t-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-md)]">
            {panel}
          </div>
        </div>
      ) : null}
    </>
  )
}

export function StatusBar() {
  const location = useLocation()
  return (
    <footer className="no-print hidden h-8 items-center gap-3 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[11px] text-[var(--color-text-muted)] md:flex">
      <span className="font-mono-tech tracking-wide uppercase">Lab ready</span>
      <span aria-hidden="true">·</span>
      <span className="truncate font-mono-tech">{location.pathname}</span>
      <span className="ml-auto font-mono-tech">Frontend only · no cloud sync</span>
    </footer>
  )
}

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile primary"
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)] pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-md)] lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {MOBILE_NAV.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              {...(item.end === true ? { end: true } : {})}
              className={({ isActive }) =>
                cn(
                  'flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[10px]',
                  isActive ? 'text-[var(--color-accent-strong)]' : 'text-[var(--color-text-muted)]',
                )
              }
            >
              <item.icon aria-hidden="true" className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
