import type { ConnectionValidation, ProposedConnection } from '@/features/maoLab/domain/types'

const UNVERIFIED_PARTS = new Set([
  'matrix-8x8-raw',
  'salvaged-lcd',
  'salvaged-lcd-controller',
])

function isPower(label: string, type: string): boolean {
  return type === 'power' || /\b5v\b|\b3\.3v\b|\bvcc\b|\bvin\b/i.test(label)
}

function isGround(label: string, type: string): boolean {
  return type === 'ground' || /\bgnd\b|\bground\b/i.test(label)
}

/**
 * Educational connection validation — not SPICE.
 * Never silently accepts shorts or unverified hardware power ties.
 */
export function validateConnection(proposal: ProposedConnection): ConnectionValidation {
  const fromLabel = proposal.from.label
  const toLabel = proposal.to.label
  const fromType = guessType(fromLabel)
  const toType = guessType(toLabel)

  if (UNVERIFIED_PARTS.has(proposal.from.partId) || UNVERIFIED_PARTS.has(proposal.to.partId)) {
    return {
      result: 'UNVERIFIED',
      title: 'Unverified hardware',
      detail:
        'Physical pinout must be verified before connection. Raw matrix and salvaged LCD stay blocked until identified.',
    }
  }

  if (
    (isPower(fromLabel, fromType) && isGround(toLabel, toType)) ||
    (isGround(fromLabel, fromType) && isPower(toLabel, toType))
  ) {
    return {
      result: 'BLOCKED',
      title: 'Short circuit warning',
      detail: 'Connecting 5V (or another supply) directly to GND creates a short. Do not confirm.',
    }
  }

  if (
    (/\bgpio\b|d\d+/i.test(fromLabel) && /servo.*(vcc|power|5v)|motor.*power/i.test(toLabel)) ||
    (/\bgpio\b|d\d+/i.test(toLabel) && /servo.*(vcc|power|5v)|motor.*power/i.test(fromLabel))
  ) {
    return {
      result: 'BLOCKED',
      title: 'GPIO current warning',
      detail: 'Do not power motors or servo VCC from a GPIO pin. Use the 5V rail with shared GND; GPIO only for signal.',
    }
  }

  const lcdMention = /lcd|panel|hd50/i.test(`${fromLabel} ${toLabel} ${proposal.from.partId} ${proposal.to.partId}`)
  if (lcdMention && (isPower(fromLabel, fromType) || isPower(toLabel, toType))) {
    return {
      result: 'UNVERIFIED',
      title: 'Unknown LCD voltage',
      detail: 'Never connect an unknown LCD voltage line to the Arduino. Identify the panel first.',
    }
  }

  if (proposal.from.partId === proposal.to.partId && proposal.from.pinId === proposal.to.pinId) {
    return {
      result: 'BLOCKED',
      title: 'Same endpoint',
      detail: 'Source and destination must be different pins or holes.',
    }
  }

  // Known-good demo paths
  const key = `${proposal.from.partId}:${proposal.from.pinId}->${proposal.to.partId}:${proposal.to.pinId}`
  const reverse = `${proposal.to.partId}:${proposal.to.pinId}->${proposal.from.partId}:${proposal.from.pinId}`
  const knownGood = new Set([
    'uno:5v->breadboard:rail-plus',
    'uno:gnd->breadboard:rail-minus',
    'uno:d8->resistor-220:a',
    'resistor-220:b->led-red:anode',
    'led-red:cathode->breadboard:rail-minus',
    'breadboard:rail-plus->uno:5v',
    'breadboard:rail-minus->uno:gnd',
    'resistor-220:a->uno:d8',
    'led-red:anode->resistor-220:b',
    'breadboard:rail-minus->led-red:cathode',
  ])

  if (knownGood.has(key) || knownGood.has(reverse)) {
    return {
      result: 'VALID',
      title: 'Valid educational connection',
      detail: `${proposal.purpose} — still verify polarity on the physical bench before powering.`,
    }
  }

  if (isPower(fromLabel, fromType) || isPower(toLabel, toType)) {
    return {
      result: 'WARNING',
      title: 'Power path needs review',
      detail: 'Power connections outside the verified demo circuit should be double-checked against PINOUT docs.',
    }
  }

  return {
    result: 'WARNING',
    title: 'Not in verified demo set',
    detail: 'Software validation does not replace physical verification. Confirm against kit docs before wiring.',
  }
}

function guessType(label: string): string {
  if (/gnd|ground/i.test(label)) return 'ground'
  if (/5v|3\.3v|vcc|vin/i.test(label)) return 'power'
  return 'signal'
}
