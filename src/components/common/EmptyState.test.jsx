import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material'
import EmptyState from './EmptyState'
import { createAppTheme } from '../../theme/theme'

describe('EmptyState', () => {
  it('runs its action from the accessible button', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(
      <ThemeProvider theme={createAppTheme('light')}>
        <EmptyState
          title="No products"
          description="Add the first product."
          actionLabel="Add product"
          onAction={onAction}
        />
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Add product' }))
    expect(onAction).toHaveBeenCalledOnce()
  })
})
