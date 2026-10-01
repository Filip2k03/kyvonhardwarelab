import { useMemo, useState } from 'react'
import {
  buildTeachingBreadboard,
  connectedHoleIds,
  findNetForHole,
} from '@/features/maoLab/domain/breadboard'
import { LabPanel, SectionTitle } from '@/components/ui/LabPanel'
import { cn } from '@/lib/cn'

export function BreadboardNetExplorer() {
  const board = useMemo(() => buildTeachingBreadboard({ splitRails: true }), [])
  const [selectedHoleId, setSelectedHoleId] = useState<string | null>(null)
  const [splitNote] = useState(true)

  const activeNet = selectedHoleId ? findNetForHole(board.nets, selectedHoleId) : undefined
  const lit = selectedHoleId ? new Set(connectedHoleIds(board.nets, selectedHoleId)) : new Set<string>()

  const terminals = board.holes.filter((hole) => hole.kind === 'terminal')
  const plusRail = board.holes.filter((hole) => hole.kind === 'rail-plus')
  const minusRail = board.holes.filter((hole) => hole.kind === 'rail-minus')

  return (
    <LabPanel className="space-y-3">
      <SectionTitle>Interactive 830 connectivity</SectionTitle>
      <p className="text-sm text-[var(--color-text-muted)]">
        Click a hole to highlight every hole on the same electrical net. Teaching model with{' '}
        {splitNote ? 'split' : 'continuous'} power rails — not a full 830 map, not SPICE.
      </p>

      <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[#f5f0e6] p-3">
        <div className="mx-auto w-max space-y-1">
          <RailRow
            holes={plusRail}
            lit={lit}
            selectedHoleId={selectedHoleId}
            onSelect={setSelectedHoleId}
            tone="plus"
          />
          <RailRow
            holes={minusRail}
            lit={lit}
            selectedHoleId={selectedHoleId}
            onSelect={setSelectedHoleId}
            tone="minus"
          />
          <div className="h-2" />
          <div className="grid grid-cols-[repeat(11,1.5rem)] gap-0.5">
            {Array.from({ length: 10 }, (_, rowIndex) => {
              const row = rowIndex + 1
              const left = terminals.filter((hole) => hole.id.startsWith(`L${row}`))
              const right = terminals.filter((hole) => hole.id.startsWith(`R${row}`))
              return (
                <div key={row} className="contents">
                  {left.map((hole) => (
                    <HoleButton
                      key={hole.id}
                      holeId={hole.id}
                      label={hole.label}
                      lit={lit.has(hole.id)}
                      selected={selectedHoleId === hole.id}
                      onSelect={setSelectedHoleId}
                    />
                  ))}
                  <div className="flex h-6 w-6 items-center justify-center text-[8px] text-[var(--color-text-muted)]">
                    {row}
                  </div>
                  {right.map((hole) => (
                    <HoleButton
                      key={hole.id}
                      holeId={hole.id}
                      label={hole.label}
                      lit={lit.has(hole.id)}
                      selected={selectedHoleId === hole.id}
                      onSelect={setSelectedHoleId}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {activeNet ? (
        <div className="rounded-[var(--radius-sm)] border border-[var(--color-accent)] bg-[var(--color-surface-raised)] p-3 text-sm">
          <p className="font-mono-tech text-[10px] text-[var(--color-accent)] uppercase">Selected net</p>
          <p className="mt-1 font-medium">{activeNet.name}</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {activeNet.holeIds.length} holes tied together · id {activeNet.id}
          </p>
        </div>
      ) : (
        <p className="text-xs text-[var(--color-text-muted)]">No hole selected.</p>
      )}
    </LabPanel>
  )
}

function RailRow({
  holes,
  lit,
  selectedHoleId,
  onSelect,
  tone,
}: {
  readonly holes: readonly { id: string; label: string }[]
  readonly lit: ReadonlySet<string>
  readonly selectedHoleId: string | null
  readonly onSelect: (id: string) => void
  readonly tone: 'plus' | 'minus'
}) {
  return (
    <div className="flex gap-0.5">
      <span
        className={cn(
          'flex h-6 w-6 items-center justify-center font-mono-tech text-[10px]',
          tone === 'plus' ? 'text-[var(--color-power)]' : 'text-[var(--color-ground)]',
        )}
      >
        {tone === 'plus' ? '+' : '−'}
      </span>
      {holes.map((hole) => (
        <HoleButton
          key={hole.id}
          holeId={hole.id}
          label={hole.label}
          lit={lit.has(hole.id)}
          selected={selectedHoleId === hole.id}
          onSelect={onSelect}
          rail={tone}
        />
      ))}
    </div>
  )
}

function HoleButton({
  holeId,
  label,
  lit,
  selected,
  onSelect,
  rail,
}: {
  readonly holeId: string
  readonly label: string
  readonly lit: boolean
  readonly selected: boolean
  readonly onSelect: (id: string) => void
  readonly rail?: 'plus' | 'minus'
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={`Breadboard hole ${label}`}
      aria-pressed={selected}
      onClick={() => onSelect(holeId)}
      className={cn(
        'h-6 w-6 rounded-sm border text-[8px] font-mono-tech',
        rail === 'plus' && 'border-red-300',
        rail === 'minus' && 'border-blue-300',
        !rail && 'border-[var(--color-border-strong)]',
        lit
          ? 'bg-[var(--color-accent)] text-[var(--color-text-on-accent)]'
          : 'bg-white text-[var(--color-text-muted)]',
        selected && 'ring-2 ring-[var(--color-accent-strong)]',
      )}
    >
      {label.length <= 3 ? label : '•'}
    </button>
  )
}
