import { useId, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { LabControls } from '@/components/studio/LabControls'
import { PageListenButton } from '@/components/audio/ListenButton'
import { PRIMARY_NAV, SECONDARY_NAV } from '@/app/navigation'
import { cn } from '@/lib/cn'

function resolveTitle(pathname: string): string {
  const all = [...PRIMARY_NAV, ...SECONDARY_NAV]
  const exact = all.find((item) => item.to === pathname)
  if (exact) return exact.label

  if (pathname.startsWith('/components/')) return 'Component'
  if (pathname.startsWith('/projects/') && pathname.endsWith('/3d')) return 'Project 3D'
  if (pathname.startsWith('/projects/')) return 'Project'
  if (pathname.startsWith('/learn/')) return 'Lesson'
  return 'KYVON Hardware Lab'
}

export function AppShell() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const titleId = useId()
  const pageTitle = resolveTitle(location.pathname)

  return (
    <div className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-text)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-[var(--radius-sm)] focus:bg-[var(--color-surface)] focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <div className="flex min-h-dvh">
        <aside className="no-print sticky top-0 hidden h-dvh w-60 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:flex lg:flex-col">
          <div className="border-b border-[var(--color-border)] px-4 py-4">
            <Link to="/" className="block">
              <span className="font-mono-tech text-sm font-semibold tracking-wide text-[var(--color-accent)]">
                KYVON
              </span>
              <span className="mt-0.5 block text-xs text-[var(--color-text-muted)]">Hardware Lab</span>
              <span className="mt-2 block text-[11px] leading-snug text-[var(--color-text-muted)]">
                Work at the pace of a real bench.
              </span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <AppSidebar />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="no-print sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-sm">
            <div className="flex h-14 items-center gap-3 px-4">
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] lg:hidden"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                onClick={() => setMobileOpen((open) => !open)}
              >
                {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
                <span className="sr-only">{mobileOpen ? 'Close navigation' : 'Open navigation'}</span>
              </button>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" id={titleId}>
                  {pageTitle}
                </p>
                <p className="truncate font-mono-tech text-xs text-[var(--color-text-muted)]">
                  {location.pathname}
                </p>
              </div>
              <PageListenButton className="hidden sm:flex" />
            </div>

            {mobileOpen ? (
              <div
                id="mobile-nav"
                className="border-t border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden"
              >
                <AppSidebar onNavigate={() => setMobileOpen(false)} />
              </div>
            ) : null}
          </header>

          <main
            id="main-content"
            aria-labelledby={titleId}
            className={cn(
              'mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 sm:px-6',
            )}
          >
            <Outlet />
          </main>
        </div>
      </div>
      <LabControls />
    </div>
  )
}
