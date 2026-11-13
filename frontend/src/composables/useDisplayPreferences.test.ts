import { describe, expect, it, vi } from 'vitest'
import { createI18nPlugin } from '../plugins/i18n'
import { createVuetifyPlugin } from '../plugins/vuetify'
import type { DisplayPreferences, DisplayPreferencesApi } from '../api/displayPreferences'
import { createDisplayPreferences } from './useDisplayPreferences'

function fakeApi(stored: DisplayPreferences): DisplayPreferencesApi {
  return {
    load: vi.fn(async () => stored),
    setLocale: vi.fn(async () => {}),
    setTheme: vi.fn(async () => {}),
  }
}

function setup(stored: DisplayPreferences, hostLanguages: readonly string[] = ['fr-FR']) {
  const i18n = createI18nPlugin('fr-FR')
  const { theme } = createVuetifyPlugin(i18n)
  const api = fakeApi(stored)
  const prefs = createDisplayPreferences({ api, i18n, theme, hostLanguages })
  return { i18n, theme, api, prefs }
}

describe('createDisplayPreferences', () => {
  it('applies the stored locale and theme on load', async () => {
    const { i18n, theme, prefs } = setup({ locale: 'en', theme: 'dark', invalidConfig: '' })

    await prefs.load()

    expect(i18n.global.locale.value).toBe('en')
    expect(theme.name.value).toBe('dark')
    expect(prefs.locale.value).toBe('en')
    expect(prefs.theme.value).toBe('dark')
  })

  it('reports an invalid settings file', async () => {
    const { prefs } = setup({ locale: '', theme: 'system', invalidConfig: '/home/grower/.config/tunmez/config.yaml' })

    await prefs.load()

    expect(prefs.invalidConfig.value).toBe('/home/grower/.config/tunmez/config.yaml')
  })

  it('follows the host language when no locale is stored', async () => {
    const { i18n, prefs } = setup({ locale: '', theme: 'system', invalidConfig: '' }, ['en-GB'])

    await prefs.load()

    expect(i18n.global.locale.value).toBe('en')
    expect(prefs.locale.value).toBe('')
  })

  it('keeps defaults when loading fails', async () => {
    const { i18n, api, prefs } = setup({ locale: 'en', theme: 'dark', invalidConfig: '' })
    vi.mocked(api.load).mockRejectedValue(new Error('unavailable'))
    vi.spyOn(console, 'error').mockImplementation(() => {})

    await prefs.load()

    expect(i18n.global.locale.value).toBe('fr-FR')
    expect(prefs.theme.value).toBe('system')
  })

  it('persists then applies a new locale', async () => {
    const { i18n, api, prefs } = setup({ locale: '', theme: 'system', invalidConfig: '' })

    await prefs.setLocale('en')

    expect(api.setLocale).toHaveBeenCalledWith('en')
    expect(i18n.global.locale.value).toBe('en')
    expect(prefs.locale.value).toBe('en')
  })

  it('persists then applies a new theme', async () => {
    const { theme, api, prefs } = setup({ locale: '', theme: 'system', invalidConfig: '' })

    await prefs.setTheme('light')

    expect(api.setTheme).toHaveBeenCalledWith('light')
    expect(theme.name.value).toBe('light')
    expect(prefs.theme.value).toBe('light')
  })
})
