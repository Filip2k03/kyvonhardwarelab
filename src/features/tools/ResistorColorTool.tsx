import { useMemo, useState } from 'react'
import {
  decodeResistorColors,
  RESISTOR_DIGIT_COLORS,
  RESISTOR_MULTIPLIER_COLORS,
  RESISTOR_TOLERANCE_COLORS,
  type ResistorDigitColor,
  type ResistorMultiplierColor,
  type ResistorToleranceColor,
} from '@/lib/calculators/resistorColorCode'
import { ResultBox } from '@/features/tools/formControls'

function BandSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  readonly label: string
  readonly value: T
  readonly options: readonly T[]
  readonly onChange: (value: T) => void
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-xs font-medium text-[var(--color-text-muted)]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm capitalize"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export function ResistorColorTool() {
  const [band1, setBand1] = useState<ResistorDigitColor>('red')
  const [band2, setBand2] = useState<ResistorDigitColor>('red')
  const [multiplier, setMultiplier] = useState<ResistorMultiplierColor>('brown')
  const [tolerance, setTolerance] = useState<ResistorToleranceColor>('gold')

  const result = useMemo(
    () => decodeResistorColors({ band1, band2, multiplier, tolerance }),
    [band1, band2, multiplier, tolerance],
  )

  return (
    <div className="space-y-3">
      <BandSelect label="1st digit" value={band1} options={RESISTOR_DIGIT_COLORS} onChange={setBand1} />
      <BandSelect label="2nd digit" value={band2} options={RESISTOR_DIGIT_COLORS} onChange={setBand2} />
      <BandSelect
        label="Multiplier"
        value={multiplier}
        options={RESISTOR_MULTIPLIER_COLORS}
        onChange={setMultiplier}
      />
      <BandSelect
        label="Tolerance"
        value={tolerance}
        options={RESISTOR_TOLERANCE_COLORS}
        onChange={setTolerance}
      />
      {result.ok ? (
        <ResultBox>
          <p>{result.value.display}</p>
          <p>Exact = {result.value.ohms} Ω</p>
          <p>
            Tolerance ={' '}
            {result.value.tolerancePercent === null ? '—' : `±${result.value.tolerancePercent}%`}
          </p>
        </ResultBox>
      ) : (
        <ResultBox error={result.error} />
      )}
    </div>
  )
}
