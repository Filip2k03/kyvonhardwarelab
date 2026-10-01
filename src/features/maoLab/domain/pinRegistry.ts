import type { MaoPinAssignment } from '@/features/maoLab/domain/types'

/**
 * Central pin registry.
 * Only verified assignments for the active demo circuit are status: verified.
 * Future kit wiring stays provisional until frozen in hardware docs.
 */
export const maoPinRegistry: readonly MaoPinAssignment[] = [
  {
    pin: 'D13',
    partId: 'uno',
    signal: 'LED_BUILTIN heartbeat',
    status: 'verified',
    notes: 'On-board LED — no breadboard wire',
  },
  {
    pin: 'D8',
    partId: 'led-red',
    signal: 'External LED via 220Ω',
    status: 'verified',
    notes: 'M3 demo: D8 → 220Ω → LED → GND',
  },
  {
    pin: '5V',
    partId: 'breadboard',
    signal: 'Breadboard + rail',
    status: 'verified',
  },
  {
    pin: 'GND',
    partId: 'breadboard',
    signal: 'Breadboard − rail',
    status: 'verified',
  },
  // Provisional V0.1 kit allocation (do not wire all yet)
  { pin: 'D2', partId: 'button', signal: 'User button', status: 'provisional' },
  { pin: 'D3', partId: 'rgb', signal: 'RGB channel', status: 'provisional' },
  { pin: 'D5', partId: 'rgb', signal: 'RGB channel', status: 'provisional' },
  { pin: 'D6', partId: 'rgb', signal: 'RGB channel', status: 'provisional' },
  { pin: 'D7', partId: 'ky-037', signal: 'Sound DO', status: 'provisional' },
  { pin: 'D9', partId: 'sg90', signal: 'Servo PWM signal', status: 'provisional' },
  { pin: 'D10', partId: 'buzzer', signal: 'Feedback', status: 'provisional' },
  { pin: 'D11', partId: 'ir-receiver', signal: 'IR data', status: 'provisional' },
  { pin: 'A0', partId: 'ldr', signal: 'Light', status: 'provisional' },
  { pin: 'A1', partId: 'joystick', signal: 'X', status: 'provisional' },
  { pin: 'A2', partId: 'joystick', signal: 'Y', status: 'provisional' },
  { pin: 'A3', partId: 'joystick', signal: 'Switch', status: 'provisional' },
  { pin: 'A4', partId: 'dht11', signal: 'Data', status: 'provisional' },
] as const

export function assignmentsForPin(pin: string): readonly MaoPinAssignment[] {
  return maoPinRegistry.filter((item) => item.pin === pin)
}

export function verifiedAssignments(): readonly MaoPinAssignment[] {
  return maoPinRegistry.filter((item) => item.status === 'verified')
}
