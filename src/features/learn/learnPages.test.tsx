import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProgressProvider } from '@/hooks/ProgressProvider'
import { NarrationProvider } from '@/hooks/NarrationProvider'
import { InspectorProvider } from '@/hooks/InspectorProvider'
import { LearnPage } from '@/features/learn/LearnPage'
import { LessonPage } from '@/features/learn/LessonPage'
import { PROGRESS_STORAGE_KEY } from '@/lib/progress/validateProgress'

function renderLearn(path: string) {
  return render(
    <ProgressProvider>
      <MemoryRouter initialEntries={[path]}>
        <NarrationProvider>
          <InspectorProvider>
            <Routes>
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/learn/:lessonSlug" element={<LessonPage />} />
            </Routes>
          </InspectorProvider>
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

  it('walks Learn → Build → Challenge flow and persists quiz progress', async () => {
    const user = userEvent.setup()
    renderLearn('/learn/electronics-fundamentals')

    expect(screen.getByRole('heading', { level: 1, name: 'Electronics Fundamentals' })).toBeInTheDocument()
    const flow = screen.getByRole('navigation', { name: 'Lesson flow' })
    expect(flow).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Theory' })).toBeInTheDocument()

    await user.click(within(flow).getByRole('button', { name: /Build/i }))
    expect(screen.getByRole('heading', { name: 'Prediction' })).toBeInTheDocument()

    await user.click(within(flow).getByRole('button', { name: /Challenge/i }))
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
