import type { CircuitDefinition, PinNode, SignalType, WiringConnection } from '@/types/circuit'
import { SIGNAL_STYLES } from '@/lib/circuits/signalStyles'
import { connectionEndpoints, wirePath } from '@/lib/circuits/geometry'
import { cn } from '@/lib/cn'

export type CircuitSelection =
  | { readonly kind: 'wire'; readonly connectionId: string }
  | { readonly kind: 'pin'; readonly componentId: string; readonly pinId: string }
  | null

interface CircuitSvgProps {
  readonly circuit: CircuitDefinition
  readonly selection: CircuitSelection
  readonly hoveredWireId: string | null
  readonly onSelect: (selection: CircuitSelection) => void
  readonly onHoverWire: (connectionId: string | null) => void
}

function pinAbsolute(
  componentX: number,
  componentY: number,
  pin: PinNode,
): { x: number; y: number } {
  return { x: componentX + pin.x, y: componentY + pin.y }
}

function isWireActive(
  connectionId: string,
  selection: CircuitSelection,
  hoveredWireId: string | null,
): boolean {
  if (hoveredWireId === connectionId) return true
  return selection?.kind === 'wire' && selection.connectionId === connectionId
}

function wireTouchesPin(
  connection: WiringConnection,
  componentId: string,
  pinId: string,
): boolean {
  return (
    (connection.fromComponent === componentId && connection.fromPin === pinId) ||
    (connection.toComponent === componentId && connection.toPin === pinId)
  )
}

export function CircuitSvg({
  circuit,
  selection,
  hoveredWireId,
  onSelect,
  onHoverWire,
}: CircuitSvgProps) {
  const activePin =
    selection?.kind === 'pin' ? selection : null

  const highlightPinIds = new Set<string>()
  if (hoveredWireId) {
    const wire = circuit.connections.find((connection) => connection.id === hoveredWireId)
    if (wire) {
      highlightPinIds.add(`${wire.fromComponent}:${wire.fromPin}`)
      highlightPinIds.add(`${wire.toComponent}:${wire.toPin}`)
    }
  }
  if (selection?.kind === 'wire') {
    const wire = circuit.connections.find((connection) => connection.id === selection.connectionId)
    if (wire) {
      highlightPinIds.add(`${wire.fromComponent}:${wire.fromPin}`)
      highlightPinIds.add(`${wire.toComponent}:${wire.toPin}`)
    }
  }
  if (activePin) {
    highlightPinIds.add(`${activePin.componentId}:${activePin.pinId}`)
    for (const connection of circuit.connections) {
      if (wireTouchesPin(connection, activePin.componentId, activePin.pinId)) {
        highlightPinIds.add(`${connection.fromComponent}:${connection.fromPin}`)
        highlightPinIds.add(`${connection.toComponent}:${connection.toPin}`)
      }
    }
  }

  return (
    <svg
      role="img"
      aria-label={circuit.accessibleDescription}
      viewBox={`0 0 ${circuit.width} ${circuit.height}`}
      className="h-auto w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]"
    >
      <title>{circuit.title}</title>
      <desc>{circuit.accessibleDescription}</desc>

      {circuit.rails.map((rail) => {
        const style = SIGNAL_STYLES[rail.signalType]
        return (
          <g key={rail.id}>
            <line
              x1={rail.x1}
              y1={rail.y}
              x2={rail.x2}
              y2={rail.y}
              stroke={style.stroke}
              strokeWidth={3}
              strokeDasharray={style.dashArray === 'none' ? undefined : style.dashArray}
            />
            <text
              x={rail.x1}
              y={rail.y - 6}
              className="fill-[var(--color-text-muted)]"
              style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}
            >
              {rail.label} ({style.label})
            </text>
          </g>
        )
      })}

      {circuit.connections.map((connection) => {
        const ends = connectionEndpoints(circuit, connection)
        if (!ends) return null
        const style = SIGNAL_STYLES[connection.signalType]
        const active = isWireActive(connection.id, selection, hoveredWireId)
        return (
          <g key={connection.id}>
            <path
              d={wirePath(ends.from.x, ends.from.y, ends.to.x, ends.to.y)}
              fill="none"
              stroke={style.stroke}
              strokeWidth={active ? 4 : 2.5}
              strokeDasharray={style.dashArray === 'none' ? undefined : style.dashArray}
              opacity={active ? 1 : 0.85}
              className="cursor-pointer"
              onMouseEnter={() => onHoverWire(connection.id)}
              onMouseLeave={() => onHoverWire(null)}
              onFocus={() => onHoverWire(connection.id)}
              onBlur={() => onHoverWire(null)}
              onClick={() => onSelect({ kind: 'wire', connectionId: connection.id })}
              tabIndex={0}
              role="button"
              aria-label={`${style.label} wire: ${connection.description}`}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelect({ kind: 'wire', connectionId: connection.id })
                }
              }}
            />
            <text
              x={(ends.from.x + ends.to.x) / 2}
              y={(ends.from.y + ends.to.y) / 2 - 8}
              textAnchor="middle"
              style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: 'var(--color-text-muted)' }}
              className="pointer-events-none"
            >
              {style.label}
            </text>
          </g>
        )
      })}

      {circuit.components.map((component) => (
        <g key={component.id} transform={`translate(${component.x} ${component.y})`}>
          <rect
            width={component.width}
            height={component.height}
            rx={4}
            className="fill-[var(--color-surface)] stroke-[var(--color-border-strong)]"
            strokeWidth={1.5}
          />
          <text
            x={8}
            y={18}
            style={{ fontSize: 12, fontFamily: 'var(--font-sans)', fill: 'var(--color-text)' }}
          >
            {component.label}
          </text>
          <text
            x={8}
            y={34}
            style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: 'var(--color-text-muted)' }}
          >
            {component.kind}
          </text>
          {component.pins.map((pin) => {
            const abs = pinAbsolute(0, 0, pin)
            const key = `${component.id}:${pin.id}`
            const highlighted = highlightPinIds.has(key)
            const selected = activePin?.componentId === component.id && activePin.pinId === pin.id
            const style = SIGNAL_STYLES[pin.type as SignalType]
            return (
              <g key={pin.id}>
                <circle
                  cx={abs.x}
                  cy={abs.y}
                  r={selected || highlighted ? 7 : 5}
                  fill={style.stroke}
                  stroke={selected ? 'var(--color-text)' : 'var(--color-bg)'}
                  strokeWidth={selected ? 2 : 1}
                  className="cursor-pointer"
                  tabIndex={0}
                  role="button"
                  aria-label={`Pin ${pin.name}, ${style.label}: ${pin.purpose}`}
                  onClick={() =>
                    onSelect({ kind: 'pin', componentId: component.id, pinId: pin.id })
                  }
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelect({ kind: 'pin', componentId: component.id, pinId: pin.id })
                    }
                  }}
                />
                <text
                  x={abs.x + 8}
                  y={abs.y + 4}
                  style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: 'var(--color-text-muted)' }}
                  className="pointer-events-none"
                >
                  {pin.name}
                </text>
              </g>
            )
          })}
        </g>
      ))}
    </svg>
  )
}

export function SignalLegend({ className }: { readonly className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-3 text-xs', className)} aria-label="Signal legend">
      {(Object.keys(SIGNAL_STYLES) as SignalType[]).map((signal) => {
        const style = SIGNAL_STYLES[signal]
        return (
          <li key={signal} className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-0.5 w-6"
              style={{
                backgroundImage:
                  style.dashArray === 'none'
                    ? undefined
                    : `repeating-linear-gradient(90deg, ${style.stroke}, ${style.stroke} 4px, transparent 4px, transparent 7px)`,
                backgroundColor: style.dashArray === 'none' ? style.stroke : undefined,
              }}
            />
            <span className="font-mono-tech">{style.label}</span>
            <span className="sr-only">{style.patternDescription}</span>
          </li>
        )
      })}
    </ul>
  )
}
