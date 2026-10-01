import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProgressProvider } from '@/hooks/ProgressProvider'
import { NarrationProvider } from '@/hooks/NarrationProvider'
import { AppRouter } from '@/app/router'
import { PROGRESS_STORAGE_KEY } from '@/lib/progress/validateProgress'

function renderAt(path: string) {
  return render(
    <ProgressProvider>
      <MemoryRouter initialEntries={[path]}>
        <NarrationProvider>
          <AppRouter />
        </NarrationProvider>
      </MemoryRouter>
    </ProgressProvider>,
  )
}

describe('MAO Mark I lab routes', () => {
  beforeEach(() => {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY)
  })

  afterEach(() => {
    cleanup()
  })

  it('renders landing and redirects /mao', () => {
    renderAt('/projects/mao-mark-i')
    expect(screen.getByRole('heading', { name: 'Interactive 3D workbench' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'MAO Mark I' })).toBeInTheDocument()
    cleanup()

    renderAt('/mao')
    expect(screen.getByRole('heading', { name: 'MAO Mark I' })).toBeInTheDocument()
  })

  it('renders build and face sections', () => {
    renderAt('/projects/mao-mark-i/build')
    expect(screen.getByRole('heading', { name: /Mac \+ Arduino CLI/i })).toBeInTheDocument()
    cleanup()

    renderAt('/projects/mao-mark-i/face')
    expect(screen.getByText(/Virtual 8×8 face simulator/i)).toBeInTheDocument()
    expect(screen.getByText(/do not assume MAX7219/i)).toBeInTheDocument()
  })

  it('shows breadboard net explorer on wiring', () => {
    renderAt('/projects/mao-mark-i/wiring')
    expect(screen.getByText(/Interactive 830 connectivity/i)).toBeInTheDocument()
    expect(screen.getByText(/Power the breadboard from the Uno/i)).toBeInTheDocument()
    expect(screen.getByText(/Try a connection/i)).toBeInTheDocument()
  })

  it('shows M2 photo checklist on build deep link', () => {
    renderAt('/projects/mao-mark-i/build?step=m2')
    expect(screen.getByRole('heading', { name: /Breadboard power rails/i })).toBeInTheDocument()
    expect(screen.getByText(/M2 rail photo checklist/i)).toBeInTheDocument()
    expect(screen.getByText(/Uno 5V → RED \+ rail/i)).toBeInTheDocument()
  })

  it('shows simulation mode on firmware page', () => {
    renderAt('/projects/mao-mark-i/firmware')
    expect(screen.getAllByText(/SIMULATION/i).length).toBeGreaterThan(0)
  })
})
