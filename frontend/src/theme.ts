import type { ContrastChoice, ThemeChoice } from './api/displayPreferences'

export interface PrimerScheme {
  colorMode: 'auto' | 'day' | 'night'
  dayScheme: string
  nightScheme: string
}

// Primer theme of each choice. System follows the host setting, with the
// dark dimmed theme at night. High contrast picks the _high_contrast variant.
export function primerScheme(theme: ThemeChoice, contrast: ContrastChoice): PrimerScheme {
  const variant = (name: string) => (contrast === 'high' ? `${name}_high_contrast` : name)
  switch (theme) {
    case 'light':
      return { colorMode: 'day', dayScheme: variant('light'), nightScheme: variant('dark_dimmed') }
    case 'dark':
      return { colorMode: 'night', dayScheme: variant('light'), nightScheme: variant('dark') }
    case 'dark-dimmed':
      return { colorMode: 'night', dayScheme: variant('light'), nightScheme: variant('dark_dimmed') }
    case 'system':
      return { colorMode: 'auto', dayScheme: variant('light'), nightScheme: variant('dark_dimmed') }
  }
}
