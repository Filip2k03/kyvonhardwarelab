import { Link } from 'react-router-dom'
import { PageListenButton } from '@/components/audio/ListenButton'
import { LabPanel, SectionTitle } from '@/components/ui/LabPanel'
import { MAO_BUILD_STEPS } from '@/features/maoLab/data/milestones'

export function MaoLandingPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="font-mono-tech text-[11px] tracking-[0.14em] text-[var(--color-text-muted)]">
          Engineering laboratory · not a marketing page
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">MAO Mark I</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
          Interactive electronics CAD + 3D robotics lab for your RFID UNO kit. Inspect pins, validate
          wires, follow build steps, simulate the face — then graduate to a real USB bridge. Raw 8×8
          matrix and salvaged LCD stay UNVERIFIED until photographed.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link to="/projects/mao-mark-i/workbench" className="lab-btn-primary">
            Open 3D workbench
          </Link>
          <Link to="/projects/mao-mark-i/build" className="lab-btn-ghost">
            Guided build
          </Link>
          <Link to="/projects/mao-mark-i/face" className="lab-btn-ghost">
            Face simulator
          </Link>
          <PageListenButton />
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <LabPanel>
          <p className="font-mono-tech text-[10px] text-[var(--color-warning)] uppercase">Mode</p>
          <p className="mt-1 text-sm font-semibold">SIMULATION</p>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            No Arduino bridge in the browser. CONNECTED appears only after a trusted local bridge confirms USB.
          </p>
        </LabPanel>
        <LabPanel>
          <p className="font-mono-tech text-[10px] text-[var(--color-accent)] uppercase">Demo circuit</p>
          <p className="mt-1 text-sm font-semibold">USB → Uno → rails → D8 LED</p>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Verified educational path with 220 Ω series resistor. No 9V battery. No salvaged LCD.
          </p>
        </LabPanel>
        <LabPanel>
          <p className="font-mono-tech text-[10px] text-[var(--color-warning)] uppercase">Blocked</p>
          <p className="mt-1 text-sm font-semibold">Matrix + salvaged LCD</p>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Physical pinout must be verified before connection. Do not assume MAX7219.
          </p>
        </LabPanel>
      </section>

      <LabPanel className="space-y-3">
        <SectionTitle>Build ladder (excerpt)</SectionTitle>
        <ol className="space-y-2">
          {MAO_BUILD_STEPS.slice(0, 4).map((step) => (
            <li key={step.id} className="rounded-[var(--radius-sm)] border border-[var(--color-border)] p-3 text-sm">
              <span className="font-mono-tech text-[10px] text-[var(--color-accent)]">M{step.index}</span>{' '}
              {step.title}
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">{step.objective}</p>
            </li>
          ))}
        </ol>
        <Link to="/projects/mao-mark-i/build" className="text-xs text-[var(--color-accent)] hover:underline">
          Open full guided build
        </Link>
      </LabPanel>
    </div>
  )
}
