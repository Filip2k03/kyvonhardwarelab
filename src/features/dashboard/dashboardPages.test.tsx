import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProgressProvider } from '@/hooks/ProgressProvider'
import { NarrationProvider } from '@/hooks/NarrationProvider'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { PROGRESS_STORAGE_KEY } from '@/lib/progress/validateProgress'

describe('DashboardPage', () => {
  beforeEach(() => {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY)
  })

  it('shows product dashboard sections from local progress', () => {
    render(
      <ProgressProvider>
        <MemoryRouter>
          <NarrationProvider>
            <DashboardPage />
          </NarrationProvider>
        </MemoryRouter>
      </ProgressProvider>,
    )

    expect(screen.getByRole('heading', { name: 'KYVON Hardware Lab' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Unfinished experiments' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bookmarks' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Active projects' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Recently viewed components' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Continue:/i })).toBeInTheDocument()
  })
})
