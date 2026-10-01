import { useState } from 'react'
import { OhmsLawTool } from '@/features/tools/OhmsLawTool'
import { LedResistorTool } from '@/features/tools/LedResistorTool'
import { VoltageDividerTool } from '@/features/tools/VoltageDividerTool'
import { AdcTool } from '@/features/tools/AdcTool'
import { PwmTool } from '@/features/tools/PwmTool'
import { NumberBaseTool } from '@/features/tools/NumberBaseTool'
import { ResistorColorTool } from '@/features/tools/ResistorColorTool'
import { cn } from '@/lib/cn'

const TOOLS = [
  { id: 'ohms', label: "Ohm's Law", element: <OhmsLawTool /> },
  { id: 'led', label: 'LED resistor', element: <LedResistorTool /> },
  { id: 'divider', label: 'Voltage divider', element: <VoltageDividerTool /> },
  { id: 'adc', label: 'ADC', element: <AdcTool /> },
  { id: 'pwm', label: 'PWM', element: <PwmTool /> },
  { id: 'base', label: 'Bin / Dec / Hex', element: <NumberBaseTool /> },
  { id: 'color', label: 'Resistor color code', element: <ResistorColorTool /> },
] as const

export function ToolsPage() {
  const [activeId, setActiveId] = useState<(typeof TOOLS)[number]['id']>('ohms')
  const active = TOOLS.find((tool) => tool.id === activeId) ?? TOOLS[0]

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Tools</h1>
        <p className="max-w-2xl text-sm text-[var(--color-text-muted)]">
          Pure engineering calculators for lab work. Logic lives in tested functions — these panels
          only collect inputs and render results.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <nav aria-label="Calculators" className="space-y-1">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActiveId(tool.id)}
              className={cn(
                'flex min-h-11 w-full items-center rounded-[var(--radius-sm)] px-3 text-left text-sm',
                tool.id === active.id
                  ? 'bg-[var(--color-surface-raised)] text-[var(--color-text)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]',
              )}
              aria-current={tool.id === active.id ? 'page' : undefined}
            >
              {tool.label}
            </button>
          ))}
        </nav>

        <section
          aria-labelledby="tool-heading"
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
        >
          <h2 id="tool-heading" className="mb-4 text-lg font-semibold">
            {active.label}
          </h2>
          {active.element}
        </section>
      </div>
    </div>
  )
}
