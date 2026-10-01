import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { findCircuitBySlug } from '@/data/circuits'
import { findHardwareBySlug } from '@/data/hardware'
import { findLessonBySlug } from '@/data/lessons'
import { CircuitViewer } from '@/features/circuits/CircuitViewer'
import { EmptyState } from '@/components/ui/EmptyState'
import { LabPanel } from '@/components/ui/LabPanel'
import { ListenButton } from '@/components/audio/ListenButton'
import { narrateCircuit } from '@/lib/audio/buildNarration'
import { useInspector } from '@/hooks/useInspector'
import { cn } from '@/lib/cn'

const MODES = [
  { id: 'circuit', label: 'Circuit' },
  { id: 'theory', label: 'Theory' },
  { id: 'measurements', label: 'Measurements' },
  { id: 'debug', label: 'Debug' },
] as const

type ModeId = (typeof MODES)[number]['id']

function isMode(value: string | null): value is ModeId {
  return MODES.some((mode) => mode.id === value)
}

export function CircuitPage() {
  const { slug } = useParams<{ slug: string }>()
  const circuit = slug ? findCircuitBySlug(slug) : undefined
  const { setContent } = useInspector()
  const [searchParams, setSearchParams] = useSearchParams()
  const mode: ModeId = isMode(searchParams.get('mode')) ? (searchParams.get('mode') as ModeId) : 'circuit'
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!circuit) {
      setContent(null)
      return
    }
    setContent({
      title: 'Workbench',
      body: (
        <div className="space-y-3 text-sm">
          <p className="font-medium">{circuit.title}</p>
          <p className="text-[var(--color-text-muted)]">{circuit.description}</p>
          <p className="font-mono-tech text-xs text-[var(--color-text-muted)]">
            {circuit.connections.length} connections · {circuit.components.length} nodes
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Click a wire or pin on the diagram to inspect signal type and expected voltage. No SPICE
            simulation is performed.
          </p>
        </div>
      ),
    })
    return () => setContent(null)
  }, [circuit, setContent])

  if (!circuit) {
    return (
      <EmptyState
        title="Circuit not found"
        description={`No diagram matches “${slug ?? 'unknown'}”. Return to the workbench circuit list.`}
      />
    )
  }

  const hardware = (circuit.relatedHardwareSlugs ?? [])
    .map((hwSlug) => findHardwareBySlug(hwSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
  const lessons = (circuit.relatedLessonSlugs ?? [])
    .map((lessonSlug) => findLessonBySlug(lessonSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs text-[var(--color-text-muted)]">
          <Link to="/lab" className="text-[var(--color-accent-strong)] hover:underline">
            Workbench
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="font-mono-tech">{circuit.slug}</span>
        </p>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono-tech text-[11px] tracking-[0.14em] text-[var(--color-accent-strong)] uppercase">
              Workbench
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">{circuit.title}</h1>
            <p className="mt-1 max-w-3xl text-sm text-[var(--color-text-muted)]">
              {circuit.description}
            </p>
          </div>
          <ListenButton
            id={`circuit:${circuit.id}`}
            title={circuit.title}
            text={narrateCircuit(circuit)}
          />
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[14rem_minmax(0,1fr)]">
        <LabPanel padded className="h-fit space-y-3">
          <h2 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            Kit parts
          </h2>
          <ul className="space-y-2">
            {hardware.map((part) => (
              <li key={part.id}>
                <Link
                  to={`/components/${part.slug}`}
                  className="block rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-2 text-xs hover:border-[var(--color-border-strong)]"
                >
                  <span className="font-medium">{part.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <h2 className="pt-2 text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            Lessons
          </h2>
          <ul className="space-y-1">
            {lessons.length === 0 ? (
              <li className="text-xs text-[var(--color-text-muted)]">None linked</li>
            ) : (
              lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    to={`/learn/${lesson.slug}`}
                    className="text-xs text-[var(--color-accent-strong)] hover:underline"
                  >
                    {lesson.title}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </LabPanel>

        <div className="space-y-4">
          <div
            role="tablist"
            aria-label="Workbench modes"
            className="flex gap-1 overflow-x-auto border-b border-[var(--color-border)] pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {MODES.map((item) => {
              const selected = mode === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={cn(
                    'min-h-11 shrink-0 border-b-2 px-3 text-sm whitespace-nowrap transition-colors duration-150',
                    selected
                      ? 'border-[var(--color-accent)] font-medium text-[var(--color-text)]'
                      : 'border-transparent text-[var(--color-text-muted)]',
                  )}
                  onClick={() =>
                    setSearchParams(item.id === 'circuit' ? {} : { mode: item.id }, { replace: true })
                  }
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          {mode === 'circuit' ? <CircuitViewer circuit={circuit} /> : null}

          {mode === 'theory' ? (
            <LabPanel className="space-y-3">
              <p className="text-sm leading-relaxed">{circuit.description}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{circuit.accessibleDescription}</p>
              {circuit.warnings.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--color-warning)]">
                  {circuit.warnings.map((warning) => (
                    <li key={warning.id}>{warning.message}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--color-text-muted)]">
                  No authored warnings beyond normal lab care.
                </p>
              )}
            </LabPanel>
          ) : null}

          {mode === 'measurements' ? (
            <LabPanel className="space-y-3">
              <p className="text-sm text-[var(--color-text-muted)]">
                Record bench measurements here while you validate the wiring. Values stay only in this
                browser session until you export progress elsewhere.
              </p>
              <label className="block space-y-1">
                <span className="text-xs font-medium text-[var(--color-text-muted)]">
                  Notes / readings
                </span>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={8}
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono-tech text-sm"
                  placeholder="e.g. LED anode to D8 via 220Ω, Vf ≈ 2.0V @ 10mA…"
                />
              </label>
            </LabPanel>
          ) : null}

          {mode === 'debug' ? (
            <LabPanel className="space-y-3">
              <h2 className="text-sm font-semibold">Deterministic checks</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>Confirm common GND between modules and the MCU.</li>
                <li>Click each power and ground wire — expected voltages appear in the inspector.</li>
                <li>Educational warnings appear when the diagram heuristics fire (not SPICE).</li>
                <li>If a module is silent, verify pin silk vs catalog pinout before swapping parts.</li>
              </ul>
            </LabPanel>
          ) : null}
        </div>
      </div>
    </div>
  )
}
