import { DisplayService, Theme } from '../../bindings/github.com/Jyko/tunmez/internal/preferences'
import { SUPPORTED_LOCALES, type Locale } from '../i18n/locale'

export type ThemeChoice = 'system' | 'light' | 'dark'

// An empty locale follows the host language.
export type LocaleChoice = Locale | ''

export interface DisplayPreferences {
  locale: LocaleChoice
  theme: ThemeChoice
}

export interface DisplayPreferencesApi {
  load(): Promise<DisplayPreferences>
  setLocale(locale: LocaleChoice): Promise<void>
  setTheme(theme: ThemeChoice): Promise<void>
}

const themes: Record<ThemeChoice, Theme> = {
  system: Theme.ThemeSystem,
  light: Theme.ThemeLight,
  dark: Theme.ThemeDark,
}

function toLocaleChoice(locale: string): LocaleChoice {
  return SUPPORTED_LOCALES.find((supported) => supported === locale) ?? ''
}

function toThemeChoice(theme: Theme): ThemeChoice {
  return theme === Theme.ThemeLight || theme === Theme.ThemeDark ? theme : 'system'
}

// Client for the Go DisplayService, the only module that calls its bindings.
export const displayPreferencesApi: DisplayPreferencesApi = {
  async load() {
    const display = await DisplayService.Get()
    return { locale: toLocaleChoice(display.locale), theme: toThemeChoice(display.theme) }
  },
  async setLocale(locale) {
    await DisplayService.SetLocale(locale)
  },
  async setTheme(theme) {
    await DisplayService.SetTheme(themes[theme])
  },
}
