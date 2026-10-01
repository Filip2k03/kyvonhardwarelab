import { useId, type ReactNode } from 'react'

export function NumberField({
  label,
  value,
  onChange,
  suffix,
  min,
  step,
}: {
  readonly label: string
  readonly value: string
  readonly onChange: (value: string) => void
  readonly suffix?: string
  readonly min?: number
  readonly step?: string
}) {
  const id = useId()
  return (
    <label className="flex flex-col gap-1 text-sm" htmlFor={id}>
      <span className="text-xs font-medium text-[var(--color-text-muted)]">{label}</span>
      <span className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          value={value}
          min={min}
          step={step ?? 'any'}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-mono-tech text-sm"
        />
        {suffix ? <span className="font-mono-tech text-xs text-[var(--color-text-muted)]">{suffix}</span> : null}
      </span>
    </label>
  )
}

export function ResultBox({
  children,
  error,
}: {
  readonly children?: ReactNode
  readonly error?: string | null
}) {
  if (error) {
    return (
      <p
        role="alert"
        className="rounded-[var(--radius-sm)] border border-[var(--color-danger)]/40 px-3 py-2 text-sm text-[var(--color-danger)]"
      >
        {error}
      </p>
    )
  }
  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono-tech text-sm">
      {children}
    </div>
  )
}
