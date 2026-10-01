import { describe, expect, it, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProgressProvider } from '@/hooks/ProgressProvider'
import { NarrationProvider } from '@/hooks/NarrationProvider'
import { Project3dPage } from '@/features/projects/Project3dPage'
import { PROGRESS_STORAGE_KEY } from '@/lib/progress/validateProgress'

vi.mock('@/lib/lab3d/detectWebGL', () => ({
  detectWebGL: () => false,
}))

describe('Project3dPage', () => {
  beforeEach(() => {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      }),
    })
  })

  it('renders the 3D build shell for a known project', () => {
    render(
      <ProgressProvider>
        <MemoryRouter initialEntries={['/projects/blink/3d']}>
          <NarrationProvider>
            <Routes>
              <Route path="/projects/:slug/3d" element={<Project3dPage />} />
            </Routes>
          </NarrationProvider>
        </MemoryRouter>
      </ProgressProvider>,
    )

    expect(screen.getByRole('heading', { name: /Blink · 3D build/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Explain this step/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Full screen/i })).toBeInTheDocument()
    expect(screen.getByText(/WebGL is unavailable/i)).toBeInTheDocument()
  })
})
