import { useEffect, useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { findHardwareBySlug } from '@/data/hardware'
import { findProjectBySlug } from '@/data/projects'
import { DIFFICULTY_LABELS, HARDWARE_CATEGORY_LABELS } from '@/lib/hardware/labels'
import { PIN_TYPE_LABELS } from '@/lib/hardware/pinLabels'
import { findCircuitsForHardwareSlug } from '@/lib/hardware/relatedCircuits'
import { EmptyState } from '@/components/ui/EmptyState'
import { LabPanel } from '@/components/ui/LabPanel'
import { ListenButton } from '@/components/audio/ListenButton'
import { narrateComponent } from '@/lib/audio/buildNarration'
import { useProgress } from '@/hooks/useProgress'
import { useInspector } from '@/hooks/useInspector'
import { cn } from '@/lib/cn'
import type { HardwareComponent } from '@/types/hardware'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'pinout', label: 'Pinout' },
  { id: 'electrical', label: 'Electrical Limits' },
  { id: '3d', label: '3D' },
  { id: 'wiring', label: 'Wiring' },
  { id: 'code', label: 'Code' },
  { id: 'experiments', label: 'Experiments' },
  { id: 'projects', label: 'Projects' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
] as const

type TabId = (typeof TABS)[number]['id']

function isTabId(value: string | null): value is TabId {
  return TABS.some((tab) => tab.id === value)
}

function RelatedChips({
  items,
  basePath,
}: {
  readonly items: readonly string[]
  readonly basePath: string
}) {
  if (items.length === 0) {
    return <p className="text-sm text-[var(--color-text-muted)]">None linked in the catalog yet.</p>
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((slug) => (
        <li key={slug}>
          <Link
            to={`${basePath}/${slug}`}
            className="inline-flex min-h-11 items-center rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 font-mono-tech text-xs text-[var(--color-accent-strong)] hover:border-[var(--color-border-strong)]"
          >
            {slug}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function PinTable({ component }: { readonly component: HardwareComponent }) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
      <table className="min-w-full text-left text-sm">
        <caption className="sr-only">Pin table for {component.name}</caption>
        <thead className="bg-[var(--color-surface-raised)] text-xs tracking-wide text-[var(--color-text-muted)] uppercase">
          <tr>
            <th scope="col" className="px-3 py-2 font-medium">
              Pin
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Type
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Voltage
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Purpose
            </th>
          </tr>
        </thead>
        <tbody>
          {component.pins.map((pin) => (
            <tr key={pin.id} className="border-t border-[var(--color-border)]">
              <th scope="row" className="px-3 py-2 font-mono-tech font-medium">
                {pin.name}
              </th>
              <td className="px-3 py-2">
                <span className="font-mono-tech text-xs">{PIN_TYPE_LABELS[pin.type]}</span>
              </td>
              <td className="px-3 py-2 font-mono-tech text-xs text-[var(--color-text-muted)]">
                {pin.voltage ?? '—'}
              </td>
              <td className="px-3 py-2 text-[var(--color-text-muted)]">{pin.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ComponentDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const component = slug ? findHardwareBySlug(slug) : undefined
  const { recordComponentView } = useProgress()
  const { setContent } = useInspector()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: TabId = isTabId(tabParam) ? tabParam : 'overview'

  const relatedCircuits = useMemo(
    () => (component ? findCircuitsForHardwareSlug(component.slug) : []),
    [component],
  )

  const relatedFirmware = useMemo(() => {
    if (!component) return []
    return component.relatedProjects
      .map((projectSlug) => findProjectBySlug(projectSlug))
      .filter((project): project is NonNullable<typeof project> => Boolean(project))
  }, [component])

  useEffect(() => {
    if (component) recordComponentView(component.id)
  }, [component, recordComponentView])

  useEffect(() => {
    if (!component) {
      setContent(null)
      return
    }
    setContent({
      title: component.name,
      body: (
        <div className="space-y-3 text-sm">
          <p className="text-[var(--color-text-muted)]">{component.description}</p>
          <dl className="space-y-2 font-mono-tech text-xs">
            <div>
              <dt className="text-[var(--color-text-muted)]">Vop</dt>
              <dd>{component.operatingVoltage}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-text-muted)]">Logic</dt>
              <dd>{component.logicVoltage}</dd>
            </div>
          </dl>
          <p className="text-xs text-[var(--color-text-muted)]">
            Pin details live in the Pinout tab — 3D selection will drive this inspector in a later
            phase.
          </p>
        </div>
      ),
    })
    return () => setContent(null)
  }, [component, setContent])

  if (!component) {
    return (
      <EmptyState
        title="Component not found"
        description={`No catalog entry matches “${slug ?? 'unknown'}”. Return to the components list and pick a kit part.`}
      />
    )
  }

  function selectTab(next: TabId) {
    setSearchParams(next === 'overview' ? {} : { tab: next }, { replace: true })
  }

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <p className="text-xs text-[var(--color-text-muted)]">
          <Link to="/components" className="text-[var(--color-accent-strong)] hover:underline">
            Components
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="font-mono-tech">{component.slug}</span>
        </p>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="font-mono-tech text-[11px] tracking-[0.14em] text-[var(--color-accent-strong)] uppercase">
              Engineering catalog
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">{component.name}</h1>
            <p className="max-w-3xl text-sm text-[var(--color-text-muted)]">{component.description}</p>
          </div>
          <ListenButton
            id={`component:${component.id}`}
            title={component.name}
            text={narrateComponent(component)}
          />
        </div>
        <dl className="flex flex-wrap gap-2 text-xs">
          <div className="lab-chip lab-chip-accent">
            {HARDWARE_CATEGORY_LABELS[component.category]}
          </div>
          <div className="lab-chip lab-chip-muted">{DIFFICULTY_LABELS[component.difficulty]}</div>
          <div className="lab-chip lab-chip-muted font-mono-tech">{component.operatingVoltage}</div>
        </dl>
      </header>

      <div
        role="tablist"
        aria-label="Component sections"
        className="flex gap-1 overflow-x-auto border-b border-[var(--color-border)] pb-px"
      >
        {TABS.map((tab) => {
          const selected = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              id={`component-tab-${tab.id}`}
              className={cn(
                'min-h-11 shrink-0 border-b-2 px-3 text-sm transition-colors duration-150',
                selected
                  ? 'border-[var(--color-accent)] font-medium text-[var(--color-text)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
              )}
              onClick={() => selectTab(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div role="tabpanel" aria-labelledby={`component-tab-${activeTab}`} className="space-y-4">
        {activeTab === 'overview' ? (
          <LabPanel className="space-y-4">
            <p className="text-sm leading-relaxed">{component.description}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <h2 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
                  Interfaces
                </h2>
                {component.interfaces.length === 0 ? (
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">Passive / none.</p>
                ) : (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {component.interfaces.map((iface) => (
                      <li key={iface} className="lab-chip lab-chip-muted">
                        {iface}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h2 className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
                  Use cases
                </h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {component.useCases.map((useCase) => (
                    <li key={useCase}>{useCase}</li>
                  ))}
                </ul>
              </div>
            </div>
          </LabPanel>
        ) : null}

        {activeTab === 'how-it-works' ? (
          <LabPanel>
            <h2 className="text-sm font-semibold">Operating principle</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed">{component.operatingPrinciple}</p>
          </LabPanel>
        ) : null}

        {activeTab === 'pinout' ? (
          <div className="space-y-3">
            <PinTable component={component} />
            <p className="text-xs text-[var(--color-text-muted)]">
              Pin order and labeling can vary by module revision — verify silk screen before wiring.
            </p>
          </div>
        ) : null}

        {activeTab === 'electrical' ? (
          <LabPanel className="space-y-4">
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-[var(--color-text-muted)]">Operating voltage</dt>
                <dd className="font-mono-tech text-sm">{component.operatingVoltage}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-text-muted)]">Logic voltage</dt>
                <dd className="font-mono-tech text-sm">{component.logicVoltage}</dd>
              </div>
            </dl>
            <div className="rounded-[var(--radius-sm)] border border-[var(--color-warning)]/40 bg-[var(--color-surface-raised)] p-3">
              <h2 className="text-sm font-semibold text-[var(--color-warning)]">Safety limits</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {component.safety.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </LabPanel>
        ) : null}

        {activeTab === '3d' ? (
          <LabPanel className="space-y-3">
            <p className="text-sm text-[var(--color-text-muted)]">
              3D inspection uses the shared lab board model. Component facts stay in this catalog —
              the 3D view must not become a second copy of pin data.
            </p>
            <Link to="/lab/3d" className="lab-btn-primary">
              Open 3D Lab
            </Link>
          </LabPanel>
        ) : null}

        {activeTab === 'wiring' ? (
          <LabPanel className="space-y-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              Prefer a known-good educational diagram before improvising jumpers. Validate common
              ground and voltage domains on every build.
            </p>
            {relatedCircuits.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">
                No dedicated SVG circuit is linked to this part yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {relatedCircuits.map((circuit) => (
                  <li key={circuit.id}>
                    <Link
                      to={`/lab/circuits/${circuit.slug}`}
                      className="lab-row flex flex-col gap-1 px-4 py-3"
                    >
                      <span className="text-sm font-semibold">{circuit.title}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {circuit.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <RelatedChips items={component.relatedLessons} basePath="/learn" />
          </LabPanel>
        ) : null}

        {activeTab === 'code' ? (
          <LabPanel className="space-y-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              Firmware examples live on projects that use this part. Open a project for the full
              sketch and construction path.
            </p>
            {relatedFirmware.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No related project firmware linked.</p>
            ) : (
              relatedFirmware.map((project) => (
                <div key={project.id} className="space-y-2 border-t border-[var(--color-border)] pt-3 first:border-t-0 first:pt-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold">{project.title}</h2>
                    <Link
                      to={`/projects/${project.slug}`}
                      className="text-xs text-[var(--color-accent-strong)] hover:underline"
                    >
                      Open project
                    </Link>
                  </div>
                  <pre className="overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] p-3 font-mono-tech text-xs leading-relaxed">
                    {project.firmware.slice(0, 480)}
                    {project.firmware.length > 480 ? '\n…' : ''}
                  </pre>
                </div>
              ))
            )}
          </LabPanel>
        ) : null}

        {activeTab === 'experiments' ? (
          <LabPanel className="space-y-3">
            <p className="text-sm text-[var(--color-text-muted)]">
              Lessons that exercise this component. Complete the Predict → Wire → Measure path on
              each lesson page.
            </p>
            <RelatedChips items={component.relatedLessons} basePath="/learn" />
          </LabPanel>
        ) : null}

        {activeTab === 'projects' ? (
          <LabPanel className="space-y-3">
            <RelatedChips items={component.relatedProjects} basePath="/projects" />
          </LabPanel>
        ) : null}

        {activeTab === 'troubleshooting' ? (
          <LabPanel className="space-y-3">
            <h2 className="text-sm font-semibold">Check these first</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {component.safety.map((item) => (
                <li key={item}>{item}</li>
              ))}
              <li>Confirm common ground between the module and the MCU.</li>
              <li>Compare silk-screen pin order to this pinout table before powering.</li>
              <li>
                If readings are stuck, verify the interface listed above (ADC pin vs digital GPIO).
              </li>
            </ul>
          </LabPanel>
        ) : null}
      </div>
    </article>
  )
}
