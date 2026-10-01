import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LabControls } from '@/components/studio/LabControls'
import { NarrationProvider } from '@/hooks/NarrationProvider'
import { LAB_PREFERENCES_KEY } from '@/lib/studio/preferences'

function renderControls() {
  return render(
    <MemoryRouter>
      <NarrationProvider>
        <LabControls />
      </NarrationProvider>
    </MemoryRouter>,
  )
}

describe('LabControls', () => {
  beforeEach(() => {
    window.localStorage.removeItem(LAB_PREFERENCES_KEY)
    document.documentElement.style.fontSize = ''
  })

  it('opens language, dimmer, type size, and ten female voices', async () => {
    const user = userEvent.setup()
    renderControls()

    await user.click(screen.getByRole('button', { name: 'Adjust' }))
    expect(screen.getByRole('button', { name: /မြန်မာ/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /日本語/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Русский/ })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Screen dimmer' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reading' })).toBeInTheDocument()
    expect(screen.getByText('Female voice · 10 versions')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Soft Mentor/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Confident Lead/ })).toBeInTheDocument()
  })
})
