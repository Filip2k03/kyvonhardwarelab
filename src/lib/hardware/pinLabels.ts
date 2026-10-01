import type { PinType } from '@/types/hardware'

export const PIN_TYPE_LABELS: Record<PinType, string> = {
  power: 'Power',
  ground: 'Ground',
  digital: 'Digital',
  analog: 'Analog',
  pwm: 'PWM',
  spi: 'SPI',
  i2c: 'I2C',
  uart: 'UART',
  other: 'Other',
}
