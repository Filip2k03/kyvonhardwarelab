import { useMemo, useState } from 'react'
import { calculateVoltageDivider, solveR2ForVout } from '@/lib/calculators/voltageDivider'
import { NumberField, ResultBox } from '@/features/tools/formControls'

export function VoltageDividerTool() {
  const [mode, setMode] = useState<'vout' | 'r2'>('vout')
  const [vin, setVin] = useState('5')
  const [r1, setR1] = useState('10000')
  const [r2, setR2] = useState('10000')
  const [vout, setVout] = useState('2.5')

  const divider = useMemo(
    () => calculateVoltageDivider({ vin: Number(vin), r1: Number(r1), r2: Number(r2) }),
    [vin, r1, r2],
  )
  const solvedR2 = useMemo(
    () => solveR2ForVout(Number(vin), Number(r1), Number(vout)),
    [vin, r1, vout],
  )

  return (
    <div className="space-y-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-xs font-medium text-[var(--color-text-muted)]">Mode</span>
        <select
          value={mode}
          onChange={(event) => setMode(event.target.value as 'vout' | 'r2')}
          className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm"
        >
          <option value="vout">Find Vout from R1/R2</option>
          <option value="r2">Find R2 for target Vout</option>
        </select>
      </label>
      <NumberField label="Vin" value={vin} onChange={setVin} suffix="V" min={0} />
      <NumberField label="R1 (top)" value={r1} onChange={setR1} suffix="Ω" min={0} />
      {mode === 'vout' ? (
        <NumberField label="R2 (bottom)" value={r2} onChange={setR2} suffix="Ω" min={0} />
      ) : (
        <NumberField label="Target Vout" value={vout} onChange={setVout} suffix="V" min={0} />
      )}
      {mode === 'vout' ? (
        divider.ok ? (
          <ResultBox>
            <p>Vout = {divider.value.vout.toPrecision(6)} V</p>
            <p>Ratio = {divider.value.ratio.toPrecision(6)}</p>
            <p>I = {divider.value.currentAmps.toPrecision(6)} A</p>
          </ResultBox>
        ) : (
          <ResultBox error={divider.error} />
        )
      ) : solvedR2.ok ? (
        <ResultBox>
          <p>R2 = {solvedR2.value.toPrecision(6)} Ω</p>
        </ResultBox>
      ) : (
        <ResultBox error={solvedR2.error} />
      )}
    </div>
  )
}
