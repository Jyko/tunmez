import { describe, expect, it, vi } from 'vitest'
import type { DisplayPreferences, DisplayPreferencesApi } from '../api/displayPreferences'
import { createDisplayPreferences } from './displayPreferences'

function fakeApi(stored: DisplayPreferences): DisplayPreferencesApi {
  return {
    load: vi.fn(async () => stored),
    setLocale: vi.fn(async () => {}),
    setTheme: vi.fn(async () => {}),
    setContrast: vi.fn(async () => {}),
  }
}

function setup(stored: DisplayPreferences, hostLanguages: readonly string[] = ['fr-FR']) {
  const api = fakeApi(stored)
  const prefs = createDisplayPreferences({ api, hostLanguages })
  return { api, prefs, state: () => prefs.state.get() }
}

describe('createDisplayPreferences', () => {
  it('follows the host before loading', () => {
    const { state } = setup({ locale: 'en', theme: 'dark', contrast: 'standard', invalidConfig: '' }, ['en-US'])

    expect(state()).toEqual({ locale: '', activeLocale: 'en', theme: 'system', contrast: 'standard', invalidConfig: '' })
  })

  it('applies the stored locale and theme on load', async () => {
    const { prefs, state } = setup({ locale: 'en', theme: 'dark', contrast: 'standard', invalidConfig: '' })

    await prefs.load()

    expect(state()).toMatchObject({ locale: 'en', activeLocale: 'en', theme: 'dark' })
  })

  it('reports an invalid settings file', async () => {
    const { prefs, state } = setup({ locale: '', theme: 'system', contrast: 'standard', invalidConfig: '/home/grower/.config/tunmez/config.yaml' })

    await prefs.load()

    expect(state().invalidConfig).toBe('/home/grower/.config/tunmez/config.yaml')
  })

  it('follows the host language when no locale is stored', async () => {
    const { prefs, state } = setup({ locale: '', theme: 'system', contrast: 'standard', invalidConfig: '' }, ['en-GB'])

    await prefs.load()

    expect(state()).toMatchObject({ locale: '', activeLocale: 'en' })
  })

  it('keeps defaults when loading fails', async () => {
    const { api, prefs, state } = setup({ locale: 'en', theme: 'dark', contrast: 'standard', invalidConfig: '' })
    vi.mocked(api.load).mockRejectedValue(new Error('unavailable'))
    vi.spyOn(console, 'error').mockImplementation(() => {})

    await prefs.load()

    expect(state()).toMatchObject({ activeLocale: 'fr-FR', theme: 'system' })
  })

  it('persists then applies a new locale', async () => {
    const { api, prefs, state } = setup({ locale: '', theme: 'system', contrast: 'standard', invalidConfig: '' })

    await prefs.setLocale('en')

    expect(api.setLocale).toHaveBeenCalledWith('en')
    expect(state()).toMatchObject({ locale: 'en', activeLocale: 'en' })
  })

  it('persists then applies a new theme', async () => {
    const { api, prefs, state } = setup({ locale: '', theme: 'system', contrast: 'standard', invalidConfig: '' })

    await prefs.setTheme('light')

    expect(api.setTheme).toHaveBeenCalledWith('light')
    expect(state().theme).toBe('light')
  })
  it('persists then applies a new contrast', async () => {
    const { api, prefs, state } = setup({ locale: '', theme: 'system', contrast: 'standard', invalidConfig: '' })

    await prefs.setContrast('high')

    expect(api.setContrast).toHaveBeenCalledWith('high')
    expect(state().contrast).toBe('high')
  })
})
