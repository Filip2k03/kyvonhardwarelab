import { useState, type ReactNode } from 'react'
import type { CircuitDefinition } from '@/types/circuit'
import { CircuitSvg, SignalLegend, type CircuitSelection } from '@/features/circuits/CircuitSvg'
import { CircuitInfoPanel } from '@/features/circuits/CircuitInfoPanel'

interface CircuitViewerProps {
  readonly circuit: CircuitDefinition
  readonly footer?: ReactNode
}

export function CircuitViewer({ circuit, footer }: CircuitViewerProps) {
  const [selection, setSelection] = useState<CircuitSelection>(null)
  const [hoveredWireId, setHoveredWireId] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <SignalLegend />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <CircuitSvg
          circuit={circuit}
          selection={selection}
          hoveredWireId={hoveredWireId}
          onSelect={setSelection}
          onHoverWire={setHoveredWireId}
        />
        <CircuitInfoPanel circuit={circuit} selection={selection} />
      </div>
      {footer}
    </div>
  )
}
