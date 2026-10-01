# Hardware Catalog

The initial curriculum must support the user's physical kit.

## Controller

- ATmega328P Arduino-compatible controller

## Prototyping

- 830-point breadboard
- male-to-female jumper wires
- jumper wire set
- 2.54 mm pin headers

## Sensors

- DHT11 temperature/humidity sensor
- water sensor
- KY-037 sound sensor
- LM35 temperature sensor
- photoresistor / LDR 5528
- tilt switch

## User Input

- 4x4 matrix keypad
- joystick
- 10K potentiometer
- push button
- infrared remote
- infrared receiver

## Identification

- RC522 RFID module
- RFID card/tag

## Displays

- LCD1602
- 4-digit seven-segment display
- 1-digit seven-segment display
- 8x8 LED matrix
- 4x4 matrix module

## Lighting

- RGB module
- red LEDs
- yellow LEDs
- green LEDs

## Audio

- active buzzer
- passive buzzer

## Motion

- SG90 micro servo
- 5V stepper motor
- ULN2003 stepper driver

## Time

- DS1302 RTC module

## Switching

- 5V relay

## Logic

- 74HC595 shift register

## Passive Components

- 220 ohm resistors
- 1K resistors
- 10K resistors

## Power

- 9V battery connector
- USB cable

---

# Required Metadata

Every component must implement:

```ts
HardwareComponent {
  id
  slug
  name
  category
  description
  difficulty
  operatingVoltage
  logicVoltage
  interfaces
  pins
  operatingPrinciple
  useCases
  safety
  relatedLessons
  relatedProjects
}
```

Do not invent exact electrical specifications when they depend on the
particular module revision.

Mark revision-dependent values appropriately.
