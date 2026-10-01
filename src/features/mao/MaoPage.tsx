import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageListenButton } from '@/components/audio/ListenButton'
import { LabPanel, SectionTitle } from '@/components/ui/LabPanel'
import { useInspector } from '@/hooks/useInspector'

const TELEMETRY = [
  { line: 'MAO/1 HELLO fw=<semver> board=uno', meaning: 'Boot / reconnect' },
  { line: 'MAO/1 HEARTBEAT uptime_ms=<u32>', meaning: 'M1 alive tick' },
  { line: 'MAO/1 STATE <expr>', meaning: 'Current expression id' },
  { line: 'MAO/1 PONG uptime_ms=…', meaning: 'Reply to PING' },
] as const

const COMMANDS = [
  { line: 'MAO/1 PING', meaning: 'Expect PONG with uptime' },
  { line: 'MAO/1 FACE <expr>', meaning: 'Request expression (later)' },
  { line: 'MAO/1 HEAD <deg>', meaning: 'Request head angle 0–180' },
  { line: 'MAO/1 BEEP <0|1|n>', meaning: 'Feedback pulse count' },
] as const

const MILESTONES = [
  { id: 'M0', title: 'Board hello', detail: 'USB serial open; HELLO on reset.' },
  { id: 'M1', title: 'Heartbeat', detail: 'Periodic HEARTBEAT + STATE; PING → PONG.' },
  {
    id: 'M2',
    title: 'Face matrix (blocked)',
    detail: 'Photograph the 8×8 module IC before any driver code. Do not assume MAX7219.',
  },
] as const

export function MaoPage() {
  const { setContent } = useInspector()

  useEffect(() => {
    setContent({
      title: 'MAO Mark I',
      body: (
        <div className="space-y-2 text-sm text-[var(--color-text-muted)]">
          <p>Desktop robot on the Uno kit. Firmware speaks MAO/1 over USB. This page is the website contract — the browser does not open serial in V1.</p>
          <p className="font-mono-tech text-xs">Kit-only parts. Matrix controller unknown until photographed.</p>
        </div>
      ),
    })
    return () => setContent(null)
  }, [setContent])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Desktop robot"
        title="MAO Mark I"
        description="Offline-first face robot on your RFID UNO kit. Firmware uses the MAO/1 line protocol. The lab site shows status contracts and next bench steps — USB bridge stays on the host tools, not in the browser."
        actions={
          <>
            <Link to="/scan" className="lab-btn-primary">
              Scan kit parts
            </Link>
            <Link to="/lab/3d" className="lab-btn-ghost">
              3D Lab
            </Link>
            <PageListenButton />
          </>
        }
      />

      <section className="grid gap-3 sm:grid-cols-3">
        {MILESTONES.map((item) => (
          <LabPanel key={item.id}>
            <p className="font-mono-tech text-[10px] tracking-wide text-[var(--color-accent)] uppercase">
              {item.id}
            </p>
            <h2 className="mt-1 text-sm font-semibold">{item.title}</h2>
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">{item.detail}</p>
          </LabPanel>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <LabPanel className="space-y-3">
          <SectionTitle>Telemetry (board → host)</SectionTitle>
          <ul className="space-y-2">
            {TELEMETRY.map((row) => (
              <li key={row.line} className="rounded-[var(--radius-sm)] border border-[var(--color-border)] p-2">
                <p className="font-mono-tech text-[11px] break-all">{row.line}</p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{row.meaning}</p>
              </li>
            ))}
          </ul>
        </LabPanel>

        <LabPanel className="space-y-3">
          <SectionTitle>Commands (host → board)</SectionTitle>
          <ul className="space-y-2">
            {COMMANDS.map((row) => (
              <li key={row.line} className="rounded-[var(--radius-sm)] border border-[var(--color-border)] p-2">
                <p className="font-mono-tech text-[11px] break-all">{row.line}</p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{row.meaning}</p>
              </li>
            ))}
          </ul>
        </LabPanel>
      </div>

      <LabPanel className="space-y-3">
        <SectionTitle>Bench workflow</SectionTitle>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>
            Identify parts with{' '}
            <Link to="/scan" className="text-[var(--color-accent)] hover:underline">
              Camera scan
            </Link>{' '}
            or ask{' '}
            <Link to="/assist" className="text-[var(--color-accent)] hover:underline">
              Bench Assist
            </Link>
            .
          </li>
          <li>
            Study pin banks in{' '}
            <Link to="/lab/3d" className="text-[var(--color-accent)] hover:underline">
              3D Lab
            </Link>{' '}
            (assembled / exploded / isolate).
          </li>
          <li>
            Confirm the 8×8 matrix IC with photos before writing face firmware — see{' '}
            <Link to="/components/led-matrix-8x8" className="text-[var(--color-accent)] hover:underline">
              LED matrix catalog
            </Link>
            .
          </li>
        </ol>
      </LabPanel>
    </div>
  )
}
