import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import ProfileButton from './ProfileButton'
import { renderWithApp } from '../test/render'

describe('ProfileButton', () => {
  it('shows the user picture in a button labelled with the profile', async () => {
    const onClick = vi.fn()
    const { user } = await renderWithApp(<ProfileButton onClick={onClick} />, { locale: 'fr-FR' })

    const button = screen.getByRole('button', { name: 'Profil' })
    // The picture is decorative: the button already names the profile.
    expect(button.querySelector('img')?.getAttribute('alt')).toBe('')

    await user.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('marks the profile page as current', async () => {
    await renderWithApp(<ProfileButton current onClick={() => {}} />, { locale: 'en' })

    expect(screen.getByRole('button', { name: 'Profile' }).getAttribute('aria-current')).toBe('page')
  })
})
