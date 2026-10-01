import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProgressProvider } from '@/hooks/ProgressProvider'
import { NarrationProvider } from '@/hooks/NarrationProvider'
import { InspectorProvider } from '@/hooks/InspectorProvider'
import { LabPage } from '@/features/lab/LabPage'
import { CircuitPage } from '@/features/lab/CircuitPage'
import { PROGRESS_STORAGE_KEY } from '@/lib/progress/validateProgress'

function renderLab(path: string) {
  return render(
    <ProgressProvider>
      <MemoryRouter initialEntries={[path]}>
        <NarrationProvider>
          <InspectorProvider>
            <Routes>
              <Route path="/lab" element={<LabPage />} />
              <Route path="/lab/circuits/:slug" element={<CircuitPage />} />
            </Routes>
          </InspectorProvider>
        </NarrationProvider>
      </MemoryRouter>
    </ProgressProvider>,
  )
}

describe('Lab circuit UI', () => {
  beforeEach(() => {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY)
  })

  it('lists starter and actuator circuits', () => {
    renderLab('/lab')
    expect(screen.getByRole('heading', { name: 'Workbench' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'LED with series resistor' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Active buzzer on GPIO' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'RC522 RFID over SPI' })).toBeInTheDocument()
  })

  it('opens a circuit viewer with accessible svg and selectable wire', async () => {
    const user = userEvent.setup()
    renderLab('/lab/circuits/led')

    expect(screen.getByRole('heading', { level: 1, name: 'LED with series resistor' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /MCU digital pin D8/i })).toBeInTheDocument()

    const wire = screen.getByRole('button', { name: /DIGITAL wire: GPIO output sources current/i })
    await user.click(wire)

    expect(screen.getByText(/GPIO output sources current into the series resistor/i)).toBeInTheDocument()
    expect(screen.getByText(/Heuristics only/i)).toBeInTheDocument()
  })

  it('shows pin details when a pin is activated', async () => {
    const user = userEvent.setup()
    renderLab('/lab/circuits/button')

    const pin = screen.getByRole('button', { name: /Pin D2, DIGITAL/i })
    await user.click(pin)

    expect(screen.getByText('INPUT_PULLUP button sense')).toBeInTheDocument()
  })
})
