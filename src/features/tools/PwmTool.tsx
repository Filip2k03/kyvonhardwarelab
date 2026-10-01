import { useMemo, useState } from 'react'
import { calculatePwmDuty, mapToPwmByte } from '@/lib/calculators/pwm'
import { NumberField, ResultBox } from '@/features/tools/formControls'

export function PwmTool() {
  const [highMs, setHighMs] = useState('1')
  const [periodMs, setPeriodMs] = useState('20')
  const [supply, setSupply] = useState('5')
  const [mapValue, setMapValue] = useState('512')
  const [mapMin, setMapMin] = useState('0')
  const [mapMax, setMapMax] = useState('1023')

  const duty = useMemo(
    () =>
      calculatePwmDuty({
        highTimeSeconds: Number(highMs) / 1000,
        periodSeconds: Number(periodMs) / 1000,
        supplyVoltage: Number(supply),
      }),
    [highMs, periodMs, supply],
  )

  const mapped = useMemo(
    () => mapToPwmByte(Number(mapValue), Number(mapMin), Number(mapMax)),
    [mapValue, mapMin, mapMax],
  )

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Duty from timing
        </h3>
        <NumberField label="High time" value={highMs} onChange={setHighMs} suffix="ms" min={0} />
        <NumberField label="Period" value={periodMs} onChange={setPeriodMs} suffix="ms" min={0} />
        <NumberField label="Supply" value={supply} onChange={setSupply} suffix="V" min={0} />
        {duty.ok ? (
          <ResultBox>
            <p>Duty = {duty.value.dutyPercent.toPrecision(4)}%</p>
            <p>Average V ≈ {duty.value.averageVoltage?.toPrecision(4)} V</p>
          </ResultBox>
        ) : (
          <ResultBox error={duty.error} />
        )}
      </div>
      <div className="space-y-3">
        <h3 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
          Map to analogWrite (0–255)
        </h3>
        <NumberField label="Value" value={mapValue} onChange={setMapValue} />
        <NumberField label="In min" value={mapMin} onChange={setMapMin} />
        <NumberField label="In max" value={mapMax} onChange={setMapMax} />
        {mapped.ok ? (
          <ResultBox>
            <p>analogWrite = {mapped.value}</p>
          </ResultBox>
        ) : (
          <ResultBox error={mapped.error} />
        )}
      </div>
    </div>
  )
}
