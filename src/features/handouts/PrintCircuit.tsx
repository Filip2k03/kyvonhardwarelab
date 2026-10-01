import type { CircuitDefinition, PinNode, WiringConnection } from '@/types/circuit'
import { SIGNAL_STYLES } from '@/lib/circuits/signalStyles'
import { connectionEndpoints, wirePath } from '@/lib/circuits/geometry'

interface PrintCircuitProps {
  readonly circuit: CircuitDefinition
}

function pinAbsolute(componentX: number, componentY: number, pin: PinNode) {
  return { x: componentX + pin.x, y: componentY + pin.y }
}

export function PrintCircuit({ circuit }: PrintCircuitProps) {
  return (
    <figure className="handout-circuit break-inside-avoid">
      <svg
        role="img"
        aria-label={circuit.accessibleDescription}
        viewBox={`0 0 ${circuit.width} ${circuit.height}`}
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
              <text x={rail.x1} y={rail.y - 6} className="handout-svg-label">
                {rail.label}
              </text>
            </g>
          )
        })}
        {circuit.connections.map((connection: WiringConnection) => {
          const ends = connectionEndpoints(circuit, connection)
          if (!ends) return null
          const style = SIGNAL_STYLES[connection.signalType]
          return (
            <g key={connection.id}>
              <path
                d={wirePath(ends.from.x, ends.from.y, ends.to.x, ends.to.y)}
                fill="none"
                stroke={style.stroke}
                strokeWidth={2.5}
                strokeDasharray={style.dashArray === 'none' ? undefined : style.dashArray}
              />
              <text
                x={(ends.from.x + ends.to.x) / 2}
                y={(ends.from.y + ends.to.y) / 2 - 8}
                textAnchor="middle"
                className="handout-svg-label"
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
              className="handout-svg-box"
            />
            <text x={8} y={18} className="handout-svg-title">
              {component.label}
            </text>
            {component.pins.map((pin) => {
              const abs = pinAbsolute(0, 0, pin)
              const style = SIGNAL_STYLES[pin.type]
              return (
                <g key={pin.id}>
                  <circle cx={abs.x} cy={abs.y} r={5} fill={style.stroke} />
                  <text x={abs.x + 8} y={abs.y + 4} className="handout-svg-label">
                    {pin.name}
                  </text>
                </g>
              )
            })}
          </g>
        ))}
      </svg>
      <figcaption>{circuit.title}</figcaption>
    </figure>
  )
}
