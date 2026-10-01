import { useMemo, useState } from 'react'
import { LabPanel, SectionTitle } from '@/components/ui/LabPanel'
import { findMaoPart } from '@/features/maoLab/data/components'
import { assignmentsForPin } from '@/features/maoLab/domain/pinRegistry'
import { cn } from '@/lib/cn'

const GROUPS = [
  {
    title: 'Digital',
    ids: ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'd11', 'd12', 'd13'],
  },
  {
    title: 'Analog',
    ids: ['a0', 'a1', 'a2', 'a3', 'a4', 'a5'],
  },
  {
    title: 'Power / control',
    ids: ['5v', '3v3', 'gnd', 'vin', 'reset', 'aref'],
  },
] as const

export function UnoPinMap() {
  const uno = findMaoPart('uno')
  const [selectedPinId, setSelectedPinId] = useState('d8')
  const pin = useMemo(
    () => uno?.pins.find((item) => item.id === selectedPinId),
    [uno, selectedPinId],
  )
  const registry = pin ? assignmentsForPin(pin.label.split(' ')[0] ?? pin.label) : []

  if (!uno || !pin) return null

  return (
    <LabPanel className="space-y-3">
      <SectionTitle>Interactive Uno pin map</SectionTitle>
      <p className="text-sm text-[var(--color-text-muted)]">
        Click a pin. Verified demo assignments stay sparse — provisional kit plans never silently overlap
        verified D8 / rails.
      </p>
      {GROUPS.map((group) => (
        <div key={group.title}>
          <p className="mb-2 text-[10px] font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            {group.title}
          </p>
          <div className="flex flex-wrap gap-1">
            {group.ids.map((id) => {
              const item = uno.pins.find((entry) => entry.id === id)
              if (!item) return null
              const selected = selectedPinId === id
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  className={cn(
                    'min-h-11 min-w-14 px-2 font-mono-tech text-[11px]',
                    selected
                      ? 'bg-[var(--color-accent-strong)] text-[var(--color-text-on-accent)]'
                      : item.verified
                        ? 'border border-[var(--color-border)]'
                        : 'border border-[var(--color-warning)] text-[var(--color-warning)]',
                  )}
                  onClick={() => setSelectedPinId(id)}
                >
                  {item.label.split(' ')[0]}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] p-3 text-sm">
        <p className="font-mono-tech text-[10px] text-[var(--color-accent)] uppercase">
          {pin.type} · {pin.verified ? 'verified metadata' : 'provisional / unassigned'}
        </p>
        <h3 className="mt-1 font-semibold">{pin.label}</h3>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">{pin.purpose}</p>
        {pin.direction ? (
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Direction: {pin.direction}</p>
        ) : null}
        {pin.warnings?.map((warning) => (
          <p key={warning} className="mt-1 text-xs text-[var(--color-warning)]">
            {warning}
          </p>
        ))}
        {registry.length > 0 ? (
          <ul className="mt-2 space-y-1 text-xs text-[var(--color-text-muted)]">
            {registry.map((item) => (
              <li key={`${item.pin}-${item.signal}`}>
                Registry: {item.signal} [{item.status}]
                {item.notes ? ` — ${item.notes}` : ''}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">No central registry assignment yet.</p>
        )}
      </div>
    </LabPanel>
  )
}
