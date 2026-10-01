import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { currentBridgeMode } from '@/features/maoLab/domain/protocol'

const SUBNAV: readonly { to: string; label: string; end: boolean }[] = [
  { to: '/projects/mao-mark-i', label: 'Overview', end: true },
  { to: '/projects/mao-mark-i/workbench', label: 'Workbench', end: false },
  { to: '/projects/mao-mark-i/components', label: 'Components', end: false },
  { to: '/projects/mao-mark-i/wiring', label: 'Wiring', end: false },
  { to: '/projects/mao-mark-i/build', label: 'Build', end: false },
  { to: '/projects/mao-mark-i/face', label: 'Face Lab', end: false },
  { to: '/projects/mao-mark-i/firmware', label: 'Firmware', end: false },
  { to: '/projects/mao-mark-i/telemetry', label: 'Telemetry', end: false },
  { to: '/projects/mao-mark-i/architecture', label: 'Architecture', end: false },
]

export function MaoLabShell() {
  const mode = currentBridgeMode()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
        <div>
          <p className="font-mono-tech text-[10px] tracking-[0.16em] text-[var(--color-text-muted)] uppercase">
            MAO Mark I Hardware Lab v0.1.0
          </p>
          <h1 className="text-xl font-semibold tracking-tight">Interactive 3D workbench</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'rounded-[var(--radius-sm)] border px-2 py-1 font-mono-tech text-[10px]',
              mode === 'SIMULATION'
                ? 'border-[var(--color-warning)] text-[var(--color-warning)]'
                : 'border-[var(--color-success)] text-[var(--color-success)]',
            )}
          >
            Arduino: {mode === 'SIMULATION' ? 'SIMULATION MODE' : 'CONNECTED'}
          </span>
        </div>
      </div>

      <nav aria-label="MAO Mark I sections" className="flex gap-1 overflow-x-auto pb-1">
        {SUBNAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'shrink-0 rounded-[var(--radius-sm)] border px-3 py-2 text-xs',
                isActive
                  ? 'border-[var(--color-accent)] bg-[var(--color-surface-raised)] text-[var(--color-accent-strong)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)]',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  )
}
