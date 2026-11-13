import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Primer design tokens: light, dark and dark dimmed themes with their high
// contrast variants, sizes, typography and motion.
import '@primer/primitives/dist/css/functional/themes/light.css'
import '@primer/primitives/dist/css/functional/themes/dark.css'
import '@primer/primitives/dist/css/functional/themes/dark-dimmed.css'
import '@primer/primitives/dist/css/functional/themes/light-high-contrast.css'
import '@primer/primitives/dist/css/functional/themes/dark-high-contrast.css'
import '@primer/primitives/dist/css/functional/themes/dark-dimmed-high-contrast.css'
import '@primer/primitives/dist/css/base/size/size.css'
import '@primer/primitives/dist/css/base/size/z-index.css'
import '@primer/primitives/dist/css/base/typography/typography.css'
import '@primer/primitives/dist/css/base/motion/motion.css'
import '@primer/primitives/dist/css/functional/size/size.css'
import '@primer/primitives/dist/css/functional/size/size-fine.css'
import '@primer/primitives/dist/css/functional/size/size-coarse.css'
import '@primer/primitives/dist/css/functional/size/border.css'
import '@primer/primitives/dist/css/functional/size/radius.css'
import '@primer/primitives/dist/css/functional/size/breakpoints.css'
import '@primer/primitives/dist/css/functional/size/viewport.css'
import '@primer/primitives/dist/css/functional/size/z-index.css'
import '@primer/primitives/dist/css/functional/spacing/space.css'
import '@primer/primitives/dist/css/functional/typography/typography.css'
import '@primer/primitives/dist/css/functional/motion/motion.css'
import App from './App'
import { Providers } from './Providers'
import { displayPreferencesApi } from './api/displayPreferences'
import { farmsApi } from './api/farms'
import { createDisplayPreferences } from './state/displayPreferences'
import { createFarms } from './state/farms'
import { createNavigation } from './state/navigation'

const displayPreferences = createDisplayPreferences({ api: displayPreferencesApi, hostLanguages: navigator.languages })
const farms = createFarms(farmsApi)

// Keep the document language in sync for assistive technologies (WCAG 3.1.1).
const syncLanguage = () => {
  document.documentElement.lang = displayPreferences.state.get().activeLocale
}
displayPreferences.state.subscribe(syncLanguage)

// Apply saved preferences and open the last used farm before the first
// render, to avoid a flash of the wrong language, theme or screen.
await Promise.all([displayPreferences.load(), farms.load()])
syncLanguage()

const root = document.getElementById('app')
if (!root) throw new Error('No #app element')

createRoot(root).render(
  <StrictMode>
    <Providers state={{ displayPreferences, farms, navigation: createNavigation() }}>
      <App />
    </Providers>
  </StrictMode>,
)
