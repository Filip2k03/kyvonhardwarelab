import { useMemo, useState } from 'react'
import { calculateOhmsLaw, type OhmsLawSolveFor } from '@/lib/calculators/ohmsLaw'
import { NumberField, ResultBox } from '@/features/tools/formControls'

export function OhmsLawTool() {
  const [solveFor, setSolveFor] = useState<OhmsLawSolveFor>('resistance')
  const [voltage, setVoltage] = useState('5')
  const [current, setCurrent] = useState('0.02')
  const [resistance, setResistance] = useState('220')

  const result = useMemo(() => {
    if (solveFor === 'voltage') {
      return calculateOhmsLaw({
        solveFor,
        current: Number(current),
        resistance: Number(resistance),
      })
    }
    if (solveFor === 'current') {
      return calculateOhmsLaw({
        solveFor,
        voltage: Number(voltage),
        resistance: Number(resistance),
      })
    }
    return calculateOhmsLaw({
      solveFor,
      voltage: Number(voltage),
      current: Number(current),
    })
  }, [solveFor, voltage, current, resistance])

  return (
    <div className="space-y-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-xs font-medium text-[var(--color-text-muted)]">Solve for</span>
        <select
          value={solveFor}
          onChange={(event) => setSolveFor(event.target.value as OhmsLawSolveFor)}
          className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm"
        >
          <option value="voltage">Voltage (V = IR)</option>
          <option value="current">Current (I = V/R)</option>
          <option value="resistance">Resistance (R = V/I)</option>
        </select>
      </label>
      {solveFor !== 'voltage' ? (
        <NumberField label="Voltage" value={voltage} onChange={setVoltage} suffix="V" min={0} />
      ) : null}
      {solveFor !== 'current' ? (
        <NumberField label="Current" value={current} onChange={setCurrent} suffix="A" min={0} step="0.001" />
      ) : null}
      {solveFor !== 'resistance' ? (
        <NumberField label="Resistance" value={resistance} onChange={setResistance} suffix="Ω" min={0} />
      ) : null}
      {result.ok ? (
        <ResultBox>
          <p>V = {result.value.voltage.toPrecision(6)} V</p>
          <p>I = {result.value.current.toPrecision(6)} A</p>
          <p>R = {result.value.resistance.toPrecision(6)} Ω</p>
          <p>P = {result.value.power.toPrecision(6)} W</p>
        </ResultBox>
      ) : (
        <ResultBox error={result.error} />
      )}
    </div>
  )
}
