import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProgressProvider } from '@/hooks/ProgressProvider'
import { NarrationProvider } from '@/hooks/NarrationProvider'
import { LearnPage } from '@/features/learn/LearnPage'
import { LessonPage } from '@/features/learn/LessonPage'
import { PROGRESS_STORAGE_KEY } from '@/lib/progress/validateProgress'

function renderLearn(path: string) {
  return render(
    <ProgressProvider>
      <MemoryRouter initialEntries={[path]}>
        <NarrationProvider>
          <Routes>
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/learn/:lessonSlug" element={<LessonPage />} />
          </Routes>
        </NarrationProvider>
      </MemoryRouter>
    </ProgressProvider>,
  )
}

describe('learning UI', () => {
  beforeEach(() => {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY)
  })

  it('lists curriculum lessons', () => {
    renderLearn('/learn')
    expect(screen.getByRole('heading', { name: 'Learn' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Electronics Fundamentals' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'ESP32 and IoT' })).toBeInTheDocument()
  })

  it('renders a lesson and persists progress after quiz submit', async () => {
    const user = userEvent.setup()
    renderLearn('/learn/electronics-fundamentals')

    expect(screen.getByRole('heading', { level: 1, name: 'Electronics Fundamentals' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Prediction' })).toBeInTheDocument()

    const options = screen.getAllByRole('radio')
    await user.click(options[0]!)
    await user.click(options[3]!)
    await user.click(screen.getByRole('button', { name: /Submit quiz/i }))

    expect(screen.getByText(/Score/i)).toBeInTheDocument()
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY)
    expect(raw).toBeTruthy()
    expect(raw).toMatch(/COMPLETED/)
  })
})
