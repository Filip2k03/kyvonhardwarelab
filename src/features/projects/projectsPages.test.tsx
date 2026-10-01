import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProgressProvider } from '@/hooks/ProgressProvider'
import { NarrationProvider } from '@/hooks/NarrationProvider'
import { ProjectsPage } from '@/features/projects/ProjectsPage'
import { ProjectDetailPage } from '@/features/projects/ProjectDetailPage'
import { PROGRESS_STORAGE_KEY } from '@/lib/progress/validateProgress'

function renderProjects(path: string) {
  return render(
    <ProgressProvider>
      <MemoryRouter initialEntries={[path]}>
        <NarrationProvider>
          <Routes>
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          </Routes>
        </NarrationProvider>
      </MemoryRouter>
    </ProgressProvider>,
  )
}

describe('Projects UI', () => {
  beforeEach(() => {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY)
  })

  it('lists and filters projects', async () => {
    const user = userEvent.setup()
    renderProjects('/projects')
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Blink' })).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox'), 'rfid access')
    expect(screen.getByRole('heading', { name: 'RFID Access Terminal' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Blink' })).not.toBeInTheDocument()
  })

  it('renders project detail with BOM and completion', async () => {
    const user = userEvent.setup()
    renderProjects('/projects/blink')
    expect(screen.getByRole('heading', { level: 1, name: 'Blink' })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: /BOM for Blink/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Mark project complete/i }))
    expect(screen.getByRole('button', { name: /Project completed/i })).toBeDisabled()
    expect(screen.getByRole('link', { name: /Open 3D build/i })).toHaveAttribute(
      'href',
      '/projects/blink/3d',
    )
  })
})
