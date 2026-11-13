import { describe, expect, it } from 'vitest'
import { act, screen, waitFor, within } from '@testing-library/react'
import App from './App'
import type { Locale } from './i18n/locale'
import { memoryFarmsApi } from './test/farms'
import { renderWithApp } from './test/render'

function renderApp(locale: Locale = 'en', names: string[] = [], activeId = '', invalidConfig = '') {
  return renderWithApp(<App />, { locale, api: memoryFarmsApi(names, activeId), display: { invalidConfig } })
}

const header = () => screen.getByRole('banner')
const nav = () => screen.getByRole('navigation', { name: 'Navigation' })
const mainHeading = () => within(screen.getByRole('main')).queryByRole('heading', { level: 1 })

describe('App', () => {
  it.each([
    ['fr-FR', 'Profil'],
    ['en', 'Profile'],
  ] as const)('labels the profile button in %s', async (locale, profile) => {
    await renderApp(locale)

    expect(within(header()).getByRole('button', { name: profile })).toBeTruthy()
  })

  it('has no settings button in the header: preferences live on the profile page', async () => {
    await renderApp('en')

    expect(within(header()).queryByRole('button', { name: 'Settings' })).toBeNull()
  })

  it('shows the empty state without an active farm', async () => {
    await renderApp('en')

    expect(mainHeading()?.textContent).toBe('No farms yet')
  })

  it('opens the last used farm', async () => {
    await renderApp('en', ['Les Jardins du Lac'], 'farm-1')

    expect(mainHeading()).toBeNull()
    expect(header().textContent).toContain('Les Jardins du Lac')
  })

  it('creates a farm from the empty state', async () => {
    const { user } = await renderApp('en')

    await user.click(screen.getByRole('button', { name: 'Create a farm' }))
    await user.type(screen.getByRole('textbox', { name: /Farm name/ }), 'Les Jardins du Lac')
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Create a farm' }))

    await waitFor(() => expect(header().textContent).toContain('Les Jardins du Lac'))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(mainHeading()).toBeNull()
  })

  it('opens the profile page in the central content and goes back', async () => {
    const { user, navigation } = await renderApp('en', ['A'], 'farm-1')

    await user.click(within(nav()).getByRole('button', { name: 'Settings' }))
    await user.click(within(header()).getByRole('button', { name: 'Profile' }))
    expect(mainHeading()?.textContent).toBe('Profile')
    expect(document.activeElement).toBe(mainHeading())

    expect(navigation.history.get()).toEqual(['home', 'farmSettings', 'profile'])
    act(() => {
      navigation.back()
    })
    expect(mainHeading()?.textContent).toBe('Farm settings')
  })

  it('switches farm from the farm button and stays on the current page', async () => {
    const { user, navigation } = await renderApp('en', ['A', 'B'], 'farm-1')

    await user.click(within(header()).getByRole('button', { name: 'A' }))
    await user.click(screen.getByRole('option', { name: 'B' }))

    await waitFor(() => expect(header().textContent).toContain('B'))
    expect(navigation.history.get()).toEqual(['home'])
  })

  it('creates a farm from the farm button', async () => {
    const { user } = await renderApp('en', ['A'], 'farm-1')

    await user.click(within(header()).getByRole('button', { name: 'A' }))
    await user.click(screen.getByRole('button', { name: 'New farm' }))
    await user.type(screen.getByRole('textbox', { name: /Farm name/ }), 'B')
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Create a farm' }))

    await waitFor(() => expect(header().textContent).toContain('B'))
  })

  it('shows the farm settings tab only while a farm is open', async () => {
    const { user } = await renderApp('en', ['A'])
    expect(within(nav()).queryByRole('button', { name: 'Settings' })).toBeNull()

    await user.click(within(screen.getByRole('main')).getByText('A'))
    await user.click(await within(nav()).findByRole('button', { name: 'Settings' }))

    expect(mainHeading()?.textContent).toBe('Farm settings')
    expect(within(nav()).getByRole('button', { name: 'Settings' }).getAttribute('aria-current')).toBe('page')
  })

  it('warns about an invalid settings file until dismissed', async () => {
    const { user } = await renderApp('en', [], '', '/home/grower/.config/tunmez/config.yaml')

    expect(document.body.textContent).toContain('The settings file /home/grower/.config/tunmez/config.yaml is invalid.')

    await user.click(screen.getByRole('button', { name: /Dismiss/ }))
    expect(document.body.textContent).not.toContain('The settings file')
  })

  it('shows no warning for a valid settings file', async () => {
    await renderApp('en')

    expect(document.body.textContent).not.toContain('The settings file')
  })
})
