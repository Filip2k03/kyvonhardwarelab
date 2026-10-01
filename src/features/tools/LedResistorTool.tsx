import { useMemo, useState } from 'react'
import { calculateLedResistor } from '@/lib/calculators/ledResistor'
import { NumberField, ResultBox } from '@/features/tools/formControls'

export function LedResistorTool() {
  const [supply, setSupply] = useState('5')
  const [vf, setVf] = useState('2.0')
  const [ma, setMa] = useState('10')

  const result = useMemo(
    () =>
      calculateLedResistor({
        supplyVoltage: Number(supply),
        forwardVoltage: Number(vf),
        forwardCurrentAmps: Number(ma) / 1000,
      }),
    [supply, vf, ma],
  )

  return (
    <div className="space-y-3">
      <NumberField label="Supply voltage" value={supply} onChange={setSupply} suffix="V" min={0} />
      <NumberField label="LED forward voltage (Vf)" value={vf} onChange={setVf} suffix="V" min={0} step="0.1" />
      <NumberField label="Desired LED current" value={ma} onChange={setMa} suffix="mA" min={0} step="0.1" />
      {result.ok ? (
        <ResultBox>
          <p>Ideal R = {result.value.resistanceOhms.toPrecision(6)} Ω</p>
          <p>Prefer ≥ E24 = {result.value.preferredE24Ohms} Ω</p>
          <p>Actual I ≈ {(result.value.actualCurrentAmps * 1000).toPrecision(4)} mA</p>
          <p>Resistor P ≈ {result.value.powerWatts.toPrecision(4)} W</p>
        </ResultBox>
      ) : (
        <ResultBox error={result.error} />
      )}
    </div>
  )
}
