import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Lab3dPage } from '@/features/lab/Lab3dPage'

vi.mock('@/lib/lab3d/detectWebGL', () => ({
  detectWebGL: () => false,
}))

describe('Lab3dPage fallback', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('renders accessible fallback content when WebGL is unavailable', async () => {
    render(
      <MemoryRouter>
        <Lab3dPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: '3D Lab' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '3D view unavailable' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Digital I/O (D0–D13)' })).toBeInTheDocument()
    expect(screen.getByText(/USB provides 5V power/i)).toBeInTheDocument()
  })
})
