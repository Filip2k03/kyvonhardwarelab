import { useMemo, useState } from 'react'
import { adcCountsToVolts, voltsToAdcCounts } from '@/lib/calculators/adc'
import { NumberField, ResultBox } from '@/features/tools/formControls'

export function AdcTool() {
  const [mode, setMode] = useState<'toVolts' | 'toCounts'>('toVolts')
  const [counts, setCounts] = useState('512')
  const [volts, setVolts] = useState('2.5')
  const [bits, setBits] = useState('10')
  const [vref, setVref] = useState('5')

  const result = useMemo(() => {
    if (mode === 'toVolts') {
      return adcCountsToVolts({ counts: Number(counts), bits: Number(bits), vref: Number(vref) })
    }
    return voltsToAdcCounts(Number(volts), Number(bits), Number(vref))
  }, [mode, counts, volts, bits, vref])

  return (
    <div className="space-y-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-xs font-medium text-[var(--color-text-muted)]">Mode</span>
        <select
          value={mode}
          onChange={(event) => setMode(event.target.value as 'toVolts' | 'toCounts')}
          className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm"
        >
          <option value="toVolts">Counts → volts</option>
          <option value="toCounts">Volts → counts</option>
        </select>
      </label>
      <NumberField label="Bits" value={bits} onChange={setBits} min={1} step="1" />
      <NumberField label="Vref" value={vref} onChange={setVref} suffix="V" min={0} />
      {mode === 'toVolts' ? (
        <NumberField label="Counts" value={counts} onChange={setCounts} min={0} step="1" />
      ) : (
        <NumberField label="Volts" value={volts} onChange={setVolts} suffix="V" min={0} />
      )}
      {result.ok ? (
        <ResultBox>
          {'volts' in result.value ? (
            <>
              <p>Volts = {result.value.volts.toPrecision(6)} V</p>
              <p>Max count = {result.value.maxCount}</p>
              <p>LSB ≈ {result.value.lsbVolts.toPrecision(4)} V</p>
            </>
          ) : (
            <>
              <p>Counts = {result.value.counts}</p>
              <p>Max count = {result.value.maxCount}</p>
            </>
          )}
        </ResultBox>
      ) : (
        <ResultBox error={result.error} />
      )}
    </div>
  )
}
