import { useState } from 'react'
import { LabPanel, SectionTitle } from '@/components/ui/LabPanel'

const KEY = 'mao-lcd-research-v1'

export interface LcdResearchNotes {
  readonly panelModel: string
  readonly controllerIc: string
  readonly inputInterface: string
  readonly logicVoltage: string
  readonly backlightVoltage: string
  readonly resolution: string
  readonly pinout: string
  readonly datasheet: string
  readonly verificationNotes: string
}

const EMPTY: LcdResearchNotes = {
  panelModel: 'HD50LA7002-21B (label seen)',
  controllerIc: '',
  inputInterface: '',
  logicVoltage: '',
  backlightVoltage: '',
  resolution: '',
  pinout: '',
  datasheet: '',
  verificationNotes: '',
}

const FIELDS: readonly { readonly key: keyof LcdResearchNotes; readonly label: string }[] = [
  { key: 'panelModel', label: 'Panel model' },
  { key: 'controllerIc', label: 'Controller IC' },
  { key: 'inputInterface', label: 'Input interface' },
  { key: 'logicVoltage', label: 'Logic voltage' },
  { key: 'backlightVoltage', label: 'Backlight voltage' },
  { key: 'resolution', label: 'Resolution' },
  { key: 'pinout', label: 'Pinout notes' },
  { key: 'datasheet', label: 'Datasheet / link' },
  { key: 'verificationNotes', label: 'Verification notes' },
]

function load(): LcdResearchNotes {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return EMPTY
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<LcdResearchNotes>) }
  } catch {
    return EMPTY
  }
}

/** Research-only form — never invents electrical facts; never enables wiring. */
export function LcdResearchForm() {
  const [notes, setNotes] = useState<LcdResearchNotes>(load)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  function update(key: keyof LcdResearchNotes, value: string) {
    setNotes((current) => ({ ...current, [key]: value }))
  }

  function save() {
    window.localStorage.setItem(KEY, JSON.stringify(notes))
    setSavedAt(new Date().toISOString())
  }

  return (
    <LabPanel className="space-y-3">
      <SectionTitle>Salvaged LCD research</SectionTitle>
      <p className="text-sm text-[var(--color-warning)]">
        UNVERIFIED HARDWARE — Controller identification required. Physical pinout must be verified before
        connection. Never connect unknown LCD voltage lines to the Arduino.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <label key={field.key} className="block text-xs sm:col-span-1">
            <span className="font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
              {field.label}
            </span>
            {field.key === 'pinout' || field.key === 'verificationNotes' ? (
              <textarea
                className="mt-1 min-h-24 w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-2 text-sm"
                value={notes[field.key]}
                onChange={(event) => update(field.key, event.target.value)}
                placeholder="Leave blank until measured / photographed"
              />
            ) : (
              <input
                className="mt-1 min-h-11 w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2 text-sm"
                value={notes[field.key]}
                onChange={(event) => update(field.key, event.target.value)}
                placeholder="Unknown until verified"
              />
            )}
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="lab-btn-primary" onClick={save}>
          Save research notes
        </button>
        {savedAt ? (
          <span className="font-mono-tech text-[10px] text-[var(--color-text-muted)]">Saved {savedAt}</span>
        ) : null}
      </div>
    </LabPanel>
  )
}
