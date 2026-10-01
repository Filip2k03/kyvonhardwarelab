import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToolsPage } from '@/features/tools/ToolsPage'

describe('ToolsPage', () => {
  it('switches calculators and computes Ohm’s law', async () => {
    const user = userEvent.setup()
    render(<ToolsPage />)

    expect(screen.getByRole('heading', { name: 'Tools' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: "Ohm's Law" })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'LED resistor' }))
    expect(screen.getByRole('heading', { name: 'LED resistor' })).toBeInTheDocument()
    expect(screen.getByText(/Ideal R/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Resistor color code' }))
    expect(screen.getByText('220 Ω')).toBeInTheDocument()
  })
})
