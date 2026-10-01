import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { NarrationProvider } from '@/hooks/NarrationProvider'
import { HandoutsPage } from '@/features/handouts/HandoutsPage'
import { LessonHandoutPage, ProjectHandoutPage } from '@/features/handouts/HandoutPrintPage'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <NarrationProvider>
        <Routes>
          <Route path="/handouts" element={<HandoutsPage />} />
          <Route path="/handouts/lessons/:lessonSlug" element={<LessonHandoutPage />} />
          <Route path="/handouts/projects/:slug" element={<ProjectHandoutPage />} />
        </Routes>
      </NarrationProvider>
    </MemoryRouter>,
  )
}

describe('Handouts UI', () => {
  it('indexes lessons and projects', () => {
    renderAt('/handouts')
    expect(screen.getByRole('heading', { name: 'Handouts' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Blink/ })).toHaveAttribute(
      'href',
      '/handouts/projects/blink',
    )
  })

  it('renders a lesson worksheet with name and date, and hides print chrome', () => {
    renderAt('/handouts/lessons/leds-and-resistors')
    expect(screen.getByText('KYVON HARDWARE LAB')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Objectives' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Circuit' })).toBeInTheDocument()
    const printButton = screen.getByRole('button', { name: /Print \/ Save as PDF/i })
    expect(printButton.parentElement).toHaveClass('no-print')
  })

  it('renders a project worksheet with the circuit diagram', () => {
    renderAt('/handouts/projects/blink')
    expect(screen.getByRole('heading', { level: 1, name: 'Blink' })).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
