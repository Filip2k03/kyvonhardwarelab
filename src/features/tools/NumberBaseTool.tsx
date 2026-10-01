import { useMemo, useState } from 'react'
import { convertNumberBase, type NumberBase } from '@/lib/calculators/numberBase'
import { ResultBox } from '@/features/tools/formControls'

export function NumberBaseTool() {
  const [from, setFrom] = useState<NumberBase>('hex')
  const [raw, setRaw] = useState('0xFF')

  const result = useMemo(() => convertNumberBase(raw, from), [raw, from])

  return (
    <div className="space-y-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-xs font-medium text-[var(--color-text-muted)]">Input base</span>
        <select
          value={from}
          onChange={(event) => setFrom(event.target.value as NumberBase)}
          className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm"
        >
          <option value="bin">Binary</option>
          <option value="dec">Decimal</option>
          <option value="hex">Hex</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-xs font-medium text-[var(--color-text-muted)]">Value</span>
        <input
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
          className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-mono-tech text-sm"
          spellCheck={false}
        />
      </label>
      {result.ok ? (
        <ResultBox>
          <p>DEC = {result.value.decimal}</p>
          <p>BIN = {result.value.binary}</p>
          <p>HEX = {result.value.hex}</p>
        </ResultBox>
      ) : (
        <ResultBox error={result.error} />
      )}
    </div>
  )
}
