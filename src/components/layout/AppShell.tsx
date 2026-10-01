import { Outlet } from 'react-router-dom'
import { LabControls } from '@/components/studio/LabControls'
import {
  InspectorPanel,
  LeftWorkstationNav,
  MobileBottomNav,
  StatusBar,
  TopCommandBar,
} from '@/components/layout/WorkstationChrome'
import { InspectorProvider } from '@/hooks/InspectorProvider'

export function AppShell() {
  return (
    <InspectorProvider>
      <div className="lab-bench-bg flex min-h-dvh flex-col text-[var(--color-text)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-[var(--radius-sm)] focus:bg-[var(--color-surface)] focus:px-3 focus:py-2"
        >
          Skip to content
        </a>

        <TopCommandBar />

        <div className="flex min-h-0 flex-1">
          <aside className="no-print hidden w-56 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:flex lg:flex-col">
            <LeftWorkstationNav />
          </aside>

          <main
            id="main-content"
            className="lab-page-enter mx-auto w-full max-w-5xl flex-1 overflow-y-auto px-4 py-6 pb-28 sm:px-6 lg:pb-8"
          >
            <Outlet />
          </main>

          <InspectorPanel />
        </div>

        <StatusBar />
        <MobileBottomNav />
        <LabControls />
      </div>
    </InspectorProvider>
  )
}
