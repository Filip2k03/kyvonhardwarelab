import type { SignalType } from '@/types/circuit'

export interface SignalStyle {
  readonly label: string
  readonly stroke: string
  readonly dashArray: string
  readonly patternDescription: string
}

export const SIGNAL_STYLES: Record<SignalType, SignalStyle> = {
  POWER: {
    label: 'POWER',
    stroke: 'var(--color-power)',
    dashArray: 'none',
    patternDescription: 'solid red power rail',
  },
  GROUND: {
    label: 'GND',
    stroke: 'var(--color-ground)',
    dashArray: '2 4',
    patternDescription: 'dashed ground return',
  },
  DIGITAL: {
    label: 'DIGITAL',
    stroke: 'var(--color-signal-digital)',
    dashArray: 'none',
    patternDescription: 'solid digital signal',
  },
  ANALOG: {
    label: 'ANALOG',
    stroke: 'var(--color-signal-analog)',
    dashArray: '6 3',
    patternDescription: 'long-dash analog signal',
  },
  PWM: {
    label: 'PWM',
    stroke: 'var(--color-signal-pwm)',
    dashArray: '4 2 1 2',
    patternDescription: 'dash-dot PWM signal',
  },
  SPI: {
    label: 'SPI',
    stroke: 'var(--color-signal-spi)',
    dashArray: '8 2 2 2',
    patternDescription: 'dash-dot-dot SPI bus',
  },
  I2C: {
    label: 'I2C',
    stroke: 'var(--color-signal-i2c)',
    dashArray: '10 3',
    patternDescription: 'long-dash I2C bus',
  },
  UART: {
    label: 'UART',
    stroke: 'var(--color-signal-uart)',
    dashArray: '3 3',
    patternDescription: 'short-dash UART',
  },
  OTHER: {
    label: 'OTHER',
    stroke: 'var(--color-text-muted)',
    dashArray: '1 3',
    patternDescription: 'dotted other signal',
  },
}
