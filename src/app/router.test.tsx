import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppRouter } from '@/app/router'
import { PRIMARY_NAV } from '@/app/navigation'
import { ProgressProvider } from '@/hooks/ProgressProvider'
import { NarrationProvider } from '@/hooks/NarrationProvider'
import { PROGRESS_STORAGE_KEY } from '@/lib/progress/validateProgress'

function renderAt(path: string) {
  return render(
    <ProgressProvider>
      <MemoryRouter initialEntries={[path]}>
        <NarrationProvider>
          <AppRouter />
        </NarrationProvider>
      </MemoryRouter>
    </ProgressProvider>,
  )
}

describe('AppRouter', () => {
  beforeEach(() => {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY)
  })

  it('renders the dashboard shell', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: 'KYVON Hardware Lab' })).toBeInTheDocument()
  })

  it('navigates to Learn from the sidebar', async () => {
    const user = userEvent.setup()
    renderAt('/')

    const learnLinks = screen.getAllByRole('link', { name: 'Learn' })
    await user.click(learnLinks[0]!)

    expect(screen.getByRole('heading', { name: 'Learn' })).toBeInTheDocument()
  })

  it('exposes all primary destinations', () => {
    renderAt('/')
    for (const item of PRIMARY_NAV) {
      expect(screen.getAllByRole('link', { name: item.label }).length).toBeGreaterThan(0)
    }
  })

  it('renders 404 for unknown routes', () => {
    renderAt('/does-not-exist')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('resolves component detail slug routes', () => {
    renderAt('/components/dht11')
    expect(screen.getByRole('heading', { level: 1, name: /DHT11/i })).toBeInTheDocument()
  })

  it('keeps shell landmarks and core routes after redesign', () => {
    const home = renderAt('/')
    expect(within(home.container).getByRole('link', { name: 'Skip to content' })).toBeInTheDocument()
    expect(within(home.container).getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(within(home.container).getByRole('navigation', { name: 'Mobile primary' })).toBeInTheDocument()
    expect(within(home.container).getByRole('main')).toBeInTheDocument()
    home.unmount()

    for (const path of ['/learn', '/components', '/lab', '/projects', '/tools', '/progress', '/scan', '/assist', '/projects/mao-mark-i'] as const) {
      const view = renderAt(path)
      expect(within(view.container).getByRole('main')).toBeInTheDocument()
      view.unmount()
    }
  })
})
