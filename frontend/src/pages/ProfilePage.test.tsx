import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderWithApp } from '../test/render'
import ProfilePage from './ProfilePage'

const renderPage = () => renderWithApp(<ProfilePage />, { display: { locale: '' } })

describe('ProfilePage', () => {
  it('groups the preferences into a labelled section', async () => {
    await renderPage()

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Profile')
    const section = screen.getByRole('region', { name: 'Preferences' })
    expect(within(section).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Interface language',
      'Theme',
      'High contrast',
    ])
  })

  it('saves the chosen language from the menu', async () => {
    const { user, displayApi } = await renderPage()

    const button = screen.getByRole('button', { name: /^Interface language System/ })
    await user.click(button)
    await user.click(screen.getByRole('menuitemradio', { name: 'Français' }))

    expect(displayApi.setLocale).toHaveBeenCalledWith('fr-FR')
  })

  it('lists System first, then the languages sorted by ISO code', async () => {
    const { user } = await renderPage()

    await user.click(screen.getByRole('button', { name: /^Interface language System/ }))

    expect(screen.getAllByRole('menuitemradio').map((item) => item.textContent)).toEqual([
      'System',
      'Brezhoneg',
      'English',
      'Français',
    ])
  })

  it('offers Breton, named in Breton', async () => {
    const { user, displayApi } = await renderPage()

    await user.click(screen.getByRole('button', { name: /^Interface language System/ }))
    await user.click(screen.getByRole('menuitemradio', { name: 'Brezhoneg' }))

    expect(displayApi.setLocale).toHaveBeenCalledWith('br')
  })

  it('saves the chosen theme, dark dimmed included', async () => {
    const { user, displayApi } = await renderPage()
    const theme = screen.getByRole('list', { name: 'Theme' })

    expect(within(theme).getByRole('button', { name: 'System' }).getAttribute('aria-pressed')).toBe('true')
    await user.click(within(theme).getByRole('button', { name: 'Dark dimmed' }))

    expect(displayApi.setTheme).toHaveBeenCalledWith('dark-dimmed')
    expect(within(theme).getByRole('button', { name: 'Dark dimmed' }).getAttribute('aria-pressed')).toBe('true')
  })
  it('turns the high contrast on', async () => {
    const { user, displayApi } = await renderPage()
    const toggle = screen.getByRole('button', { name: 'High contrast' })

    expect(toggle.getAttribute('aria-pressed')).toBe('false')
    await user.click(toggle)

    expect(displayApi.setContrast).toHaveBeenCalledWith('high')
    expect(toggle.getAttribute('aria-pressed')).toBe('true')
  })
})
