import { LabPanel, SectionTitle } from '@/components/ui/LabPanel'

export function MaoArchitecturePage() {
  return (
    <div className="space-y-4">
      <LabPanel className="space-y-3">
        <SectionTitle>System layers</SectionTitle>
        <pre className="overflow-x-auto rounded-[var(--radius-sm)] bg-[var(--color-surface-raised)] p-3 font-mono-tech text-[11px] whitespace-pre-wrap">{`lab.thuyakyaw.com  (this lab UI)
        ▲
Mac local bridge   (future: serial + offline AI)
        ▲ USB MAO/1
ATmega328P firmware (deterministic control)
        ▲
kit hardware / breadboard`}</pre>
      </LabPanel>

      <LabPanel className="space-y-2">
        <SectionTitle>Documented modules (not all implemented)</SectionTitle>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm text-[var(--color-text-muted)]">
          {[
            'FaceEngine',
            'ExpressionEngine',
            'SensorManager',
            'MotionController',
            'InputManager',
            'FeedbackController',
            'SerialProtocol',
            'MacBridge',
            'LabIntegration',
          ].map((name) => (
            <li key={name} className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2">
              {name}
            </li>
          ))}
        </ul>
      </LabPanel>

      <LabPanel className="space-y-2">
        <SectionTitle>Roadmap</SectionTitle>
        <ul className="space-y-1 text-sm text-[var(--color-text-muted)]">
          <li>v0.1 — this lab (simulation workbench + face + build)</li>
          <li>v0.2 — sensors + SG90 + sound</li>
          <li>v0.3 — raw matrix after pinout verification</li>
          <li>v0.4 — serial bridge + real telemetry</li>
          <li>v0.5 — offline Mac AI</li>
          <li>v0.6 — voice pipeline</li>
          <li>v0.7 — salvaged LCD after electrical ID</li>
          <li>v1.0 — MAO Mark I complete</li>
        </ul>
      </LabPanel>

      <LabPanel>
        <SectionTitle>Salvaged LCD research fields</SectionTitle>
        <p className="mt-2 text-sm text-[var(--color-warning)]">
          Label seen: HD50LA7002-21B — Controller identification required. Do not invent resolution,
          interface, or voltages.
        </p>
        <ul className="mt-2 list-disc pl-5 text-xs text-[var(--color-text-muted)]">
          <li>panel model</li>
          <li>controller IC</li>
          <li>input interface</li>
          <li>logic voltage</li>
          <li>backlight voltage</li>
          <li>resolution</li>
          <li>pinout</li>
          <li>datasheet</li>
          <li>verification notes</li>
        </ul>
      </LabPanel>
    </div>
  )
}
