import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import type { ReactElement } from 'react'
import { ProgressProvider } from '@/hooks/ProgressProvider'
import { NarrationProvider } from '@/hooks/NarrationProvider'
import { InspectorProvider } from '@/hooks/InspectorProvider'
import { AssistPage } from '@/features/assist/AssistPage'
import { ScanPage } from '@/features/scan/ScanPage'
import { MaoPage } from '@/features/mao/MaoPage'
import { PROGRESS_STORAGE_KEY } from '@/lib/progress/validateProgress'

function wrap(ui: ReactElement) {
  return render(
    <MemoryRouter>
      <ProgressProvider>
        <NarrationProvider>
          <InspectorProvider>{ui}</InspectorProvider>
        </NarrationProvider>
      </ProgressProvider>
    </MemoryRouter>,
  )
}

describe('Assist / Scan / MAO pages', () => {
  beforeEach(() => {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY)
  })

  afterEach(() => {
    cleanup()
  })

  it('answers a starter on Assist', async () => {
    const user = userEvent.setup()
    wrap(<AssistPage />)
    expect(screen.getByRole('heading', { name: 'Bench Assist' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /scan a DHT11/i }))
    expect(screen.getByRole('heading', { level: 2, name: /camera kit scanner/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open camera scanner/i })).toHaveAttribute('href', '/scan')
  })

  it('renders Scan controls without requiring a camera', () => {
    wrap(<ScanPage />)
    expect(screen.getByRole('heading', { name: 'Kit scanner' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start front camera/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Front$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Rear$/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/dht11/i)).toBeInTheDocument()
  })

  it('shows MAO milestones and protocol snippets', () => {
    wrap(<MaoPage />)
    expect(screen.getByRole('heading', { name: 'MAO Mark I' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Heartbeat' })).toBeInTheDocument()
    expect(screen.getByText('MAO/1 PING')).toBeInTheDocument()
    expect(screen.getByText(/do not assume MAX7219/i)).toBeInTheDocument()
  })
})
