# Interactive Circuit Engine

V1 is NOT a SPICE simulator.

Build an educational wiring visualization system.

## Technology

Use SVG.

## Domain Model

```
CircuitDefinition
ComponentNode
PinNode
WiringConnection
PowerRail
CircuitWarning
```

A connection contains:

- fromComponent
- fromPin
- toComponent
- toPin
- signalType
- expectedVoltage
- description
- warning

## Interaction

Hover wire:
highlight both endpoints.

Click wire:
show connection explanation.

Click pin:
show:

- pin name
- pin type
- expected signal
- voltage
- purpose

## Electrical Semantics

Represent:

```
POWER
GROUND
DIGITAL
ANALOG
PWM
SPI
I2C
UART
OTHER
```

Never rely solely on wire color.

Use labels/patterns/accessibility text as well.

## Validation

Implement deterministic educational validation where possible.

Examples:

- LED without current limiting resistor → warning
- missing common ground → warning
- known 3.3V-only device connected incorrectly → warning

Do not claim to electrically simulate the circuit.

## Catalog (post Phase 11)

Published educational diagrams:

- LED, button, potentiometer, LDR divider
- DHT11, LCD
- Active buzzer, relay (low-voltage load), IR receiver
- Servo, stepper + ULN2003, RFID (RC522)

Fixtures (e.g. unsafe LED) stay out of the published catalog and exist only for warning tests.
