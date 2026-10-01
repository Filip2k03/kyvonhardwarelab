import { LabPanel, SectionTitle } from '@/components/ui/LabPanel'
import { BreadboardNetExplorer } from '@/features/maoLab/components/BreadboardNetExplorer'
import { ConnectionChecker } from '@/features/maoLab/components/ConnectionChecker'
import { ConnectionGuidePanel } from '@/features/maoLab/components/ConnectionGuidePanel'
import { DEMO_CIRCUIT_WIRES } from '@/features/maoLab/data/demoCircuit'
import { maoPinRegistry } from '@/features/maoLab/domain/pinRegistry'
import { validateConnection } from '@/features/maoLab/domain/validation'

const SHORT = validateConnection({
  from: { partId: 'uno', pinId: '5v', label: '5V' },
  to: { partId: 'uno', pinId: 'gnd', label: 'GND' },
  kind: 'power',
  purpose: 'illegal',
})

const MATRIX = validateConnection({
  from: { partId: 'uno', pinId: 'd8', label: 'D8' },
  to: { partId: 'matrix-8x8-raw', pinId: 'unknown', label: 'unknown' },
  kind: 'signal',
  purpose: 'blocked until ID',
})

export function MaoWiringPage() {
  return (
    <div className="space-y-4">
      <BreadboardNetExplorer />

      <ConnectionChecker />

      <ConnectionGuidePanel />

      <LabPanel className="space-y-3">
        <SectionTitle>Verified demo nets</SectionTitle>
        <p className="text-sm text-[var(--color-text-muted)]">
          Educational connection graph for the M2–M3 circuit. Not SPICE. Traceable metadata on every wire.
        </p>
        <ul className="space-y-2">
          {DEMO_CIRCUIT_WIRES.map((wire) => (
            <li key={wire.id} className="rounded-[var(--radius-sm)] border border-[var(--color-border)] p-3 text-sm">
              <p className="font-mono-tech text-[10px] text-[var(--color-accent)] uppercase">
                {wire.kind} · {wire.status}
              </p>
              <p className="mt-1 font-medium">
                {wire.from.label} → {wire.to.label}
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">{wire.purpose}</p>
            </li>
          ))}
          <li className="rounded-[var(--radius-sm)] border border-[var(--color-border)] p-3 text-sm">
            <p className="font-mono-tech text-[10px] text-[var(--color-accent)] uppercase">signal · verified</p>
            <p className="mt-1 font-medium">220 Ω lead B → LED anode (on breadboard)</p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">Series path implied by component placement in M3.</p>
          </li>
        </ul>
      </LabPanel>

      <LabPanel className="space-y-3">
        <SectionTitle>Validator examples</SectionTitle>
        <p className="text-xs text-[var(--color-danger)]">
          {SHORT.result}: {SHORT.title} — {SHORT.detail}
        </p>
        <p className="text-xs text-[var(--color-warning)]">
          {MATRIX.result}: {MATRIX.title} — {MATRIX.detail}
        </p>
      </LabPanel>

      <LabPanel className="space-y-3">
        <SectionTitle>Pin registry</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)]">
                <th className="py-2 pr-3">Pin</th>
                <th className="py-2 pr-3">Part</th>
                <th className="py-2 pr-3">Signal</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {maoPinRegistry.map((row) => (
                <tr key={`${row.pin}-${row.signal}`} className="border-b border-[var(--color-border)]">
                  <td className="py-2 pr-3 font-mono-tech">{row.pin}</td>
                  <td className="py-2 pr-3">{row.partId}</td>
                  <td className="py-2 pr-3">{row.signal}</td>
                  <td className="py-2">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LabPanel>
    </div>
  )
}
