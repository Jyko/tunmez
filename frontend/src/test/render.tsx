import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import type { DisplayPreferences } from '../api/displayPreferences'
import type { FarmsApi } from '../api/farms'
import type { Locale } from '../i18n/locale'
import { Providers } from '../Providers'
import { createDisplayPreferences } from '../state/displayPreferences'
import { createFarms } from '../state/farms'
import { createNavigation, type Page } from '../state/navigation'
import { memoryFarmsApi } from './farms'

interface Options {
  locale?: Locale
  api?: FarmsApi
  display?: Partial<DisplayPreferences>
  // Page shown when ui renders.
  page?: Page
}

// Renders ui inside the application providers, with loaded preferences and
// farms. Returns the state, the API spies and a user-event instance.
export async function renderWithApp(ui: ReactElement, { locale = 'en', api = memoryFarmsApi(), display = {}, page = 'home' }: Options = {}) {
  const displayApi = {
    load: vi.fn(async (): Promise<DisplayPreferences> => ({ locale, theme: 'system', contrast: 'standard', invalidConfig: '', ...display })),
    setLocale: vi.fn(async () => {}),
    setTheme: vi.fn(async () => {}),
    setContrast: vi.fn(async () => {}),
  }
  const displayPreferences = createDisplayPreferences({ api: displayApi, hostLanguages: [locale] })
  const farms = createFarms(api)
  const navigation = createNavigation()
  navigation.navigate(page)
  await Promise.all([displayPreferences.load(), farms.load()])
  const user = userEvent.setup()
  const result = render(<Providers state={{ displayPreferences, farms, navigation }}>{ui}</Providers>)
  return { ...result, user, displayApi, displayPreferences, farms, navigation }
}
