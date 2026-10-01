import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { NarrationProvider } from '@/hooks/NarrationProvider'
import { ProgressProvider } from '@/hooks/ProgressProvider'
import { InspectorProvider } from '@/hooks/InspectorProvider'
import { ComponentsPage } from '@/features/hardware/ComponentsPage'
import { ComponentDetailPage } from '@/features/hardware/ComponentDetailPage'

describe('ComponentsPage', () => {
  it('filters the catalog from the search field', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ComponentsPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Components' })).toBeInTheDocument()
    await user.type(screen.getByRole('searchbox'), 'rc522')
    expect(screen.getByRole('heading', { name: /RC522/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /DHT11/i })).not.toBeInTheDocument()
  })
})

describe('ComponentDetailPage', () => {
  it('renders pin table and safety for a known slug', async () => {
    const user = userEvent.setup()
    render(
      <ProgressProvider>
        <MemoryRouter initialEntries={['/components/dht11']}>
          <NarrationProvider>
            <InspectorProvider>
              <Routes>
                <Route path="/components/:slug" element={<ComponentDetailPage />} />
              </Routes>
            </InspectorProvider>
          </NarrationProvider>
        </MemoryRouter>
      </ProgressProvider>,
    )

    expect(screen.getByRole('heading', { name: /DHT11/i })).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: 'Pinout' }))
    expect(screen.getByRole('table', { name: /Pin table for DHT11/i })).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: 'Electrical Limits' }))
    expect(screen.getByRole('heading', { name: 'Safety limits' })).toBeInTheDocument()
  })

  it('shows not found for unknown slugs', () => {
    render(
      <ProgressProvider>
        <MemoryRouter initialEntries={['/components/nope']}>
          <NarrationProvider>
            <InspectorProvider>
              <Routes>
                <Route path="/components/:slug" element={<ComponentDetailPage />} />
              </Routes>
            </InspectorProvider>
          </NarrationProvider>
        </MemoryRouter>
      </ProgressProvider>,
    )

    expect(screen.getByRole('heading', { name: 'Component not found' })).toBeInTheDocument()
  })
})
