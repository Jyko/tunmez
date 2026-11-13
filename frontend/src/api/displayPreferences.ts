import { Contrast, DisplayService, Theme } from '../../bindings/github.com/Jyko/tunmez/internal/preferences'
import { SUPPORTED_LOCALES, type Locale } from '../i18n/locale'

// dark-dimmed is a dark theme with lower contrast.
export type ThemeChoice = 'system' | 'light' | 'dark' | 'dark-dimmed'

// high uses the high contrast variant of the theme.
export type ContrastChoice = 'standard' | 'high'

// An empty locale follows the host language.
export type LocaleChoice = Locale | ''

export interface DisplayPreferences {
  locale: LocaleChoice
  theme: ThemeChoice
  contrast: ContrastChoice
  // Path of the settings file when it is invalid and defaults are used, or empty.
  invalidConfig: string
}

export interface DisplayPreferencesApi {
  load(): Promise<DisplayPreferences>
  setLocale(locale: LocaleChoice): Promise<void>
  setTheme(theme: ThemeChoice): Promise<void>
  setContrast(contrast: ContrastChoice): Promise<void>
}

const themes: Record<ThemeChoice, Theme> = {
  system: Theme.ThemeSystem,
  light: Theme.ThemeLight,
  dark: Theme.ThemeDark,
  'dark-dimmed': Theme.ThemeDarkDimmed,
}

function toLocaleChoice(locale: string): LocaleChoice {
  return SUPPORTED_LOCALES.find((supported) => supported === locale) ?? ''
}

function toThemeChoice(theme: Theme): ThemeChoice {
  return (Object.keys(themes) as ThemeChoice[]).find((choice) => themes[choice] === theme) ?? 'system'
}

// Client for the Go DisplayService, the only module that calls its bindings.
export const displayPreferencesApi: DisplayPreferencesApi = {
  async load() {
    const display = await DisplayService.Get()
    return {
      locale: toLocaleChoice(display.locale),
      theme: toThemeChoice(display.theme),
      contrast: display.contrast === Contrast.ContrastHigh ? 'high' : 'standard',
      invalidConfig: display.invalidConfig,
    }
  },
  async setLocale(locale) {
    await DisplayService.SetLocale(locale)
  },
  async setTheme(theme) {
    await DisplayService.SetTheme(themes[theme])
  },
  async setContrast(contrast) {
    await DisplayService.SetContrast(contrast === 'high' ? Contrast.ContrastHigh : Contrast.ContrastStandard)
  },
}
