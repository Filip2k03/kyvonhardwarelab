import { useMemo, useState } from 'react'
import { LabPanel, SectionTitle } from '@/components/ui/LabPanel'
import {
  CHECKER_ENDPOINTS,
  endpointKey,
  findCheckerEndpoint,
  guessWireKind,
} from '@/features/maoLab/data/checkerEndpoints'
import { validateConnection } from '@/features/maoLab/domain/validation'
import { cn } from '@/lib/cn'

export function ConnectionChecker() {
  const [fromKey, setFromKey] = useState('uno:5v')
  const [toKey, setToKey] = useState('breadboard:rail-plus')
  const [purpose, setPurpose] = useState('M2 power rail')

  const result = useMemo(() => {
    const from = findCheckerEndpoint(fromKey)
    const to = findCheckerEndpoint(toKey)
    if (!from || !to) return null
    return validateConnection({
      from,
      to,
      kind: guessWireKind(from, to),
      purpose: purpose.trim() || 'proposed wire',
    })
  }, [fromKey, toKey, purpose])

  return (
    <LabPanel className="space-y-3">
      <SectionTitle>Try a connection</SectionTitle>
      <p className="text-sm text-[var(--color-text-muted)]">
        Pick two endpoints. The lab checks shorts, GPIO→servo power, and unverified hardware — not SPICE.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs">
          <span className="font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">From</span>
          <select
            className="mt-1 min-h-11 w-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-sm"
            value={fromKey}
            onChange={(event) => setFromKey(event.target.value)}
            aria-label="Connection from endpoint"
          >
            {CHECKER_ENDPOINTS.map((endpoint) => (
              <option key={endpointKey(endpoint)} value={endpointKey(endpoint)}>
                {endpoint.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs">
          <span className="font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">To</span>
          <select
            className="mt-1 min-h-11 w-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-sm"
            value={toKey}
            onChange={(event) => setToKey(event.target.value)}
            aria-label="Connection to endpoint"
          >
            {CHECKER_ENDPOINTS.map((endpoint) => (
              <option key={`to-${endpointKey(endpoint)}`} value={endpointKey(endpoint)}>
                {endpoint.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-xs">
        <span className="font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">Purpose</span>
        <input
          className="mt-1 min-h-11 w-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-sm"
          value={purpose}
          onChange={(event) => setPurpose(event.target.value)}
          aria-label="Connection purpose"
        />
      </label>
      {result ? (
        <div
          className={cn(
            'rounded-[var(--radius-sm)] border p-3 text-sm',
            result.result === 'VALID' && 'border-[var(--color-success)] text-[var(--color-success)]',
            result.result === 'WARNING' && 'border-[var(--color-accent)] text-[var(--color-accent)]',
            result.result === 'BLOCKED' && 'border-[var(--color-danger)] text-[var(--color-danger)]',
            result.result === 'UNVERIFIED' && 'border-[var(--color-warning)] text-[var(--color-warning)]',
          )}
          role="status"
        >
          <p className="font-mono-tech text-[10px] tracking-wide uppercase">{result.result}</p>
          <p className="mt-1 font-medium">{result.title}</p>
          <p className="mt-1 text-xs opacity-90">{result.detail}</p>
        </div>
      ) : null}
    </LabPanel>
  )
}
