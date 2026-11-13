import { describe, expect, it } from 'vitest'
import { primerScheme } from './theme'

describe('primerScheme', () => {
  it.each([
    ['system', 'standard', 'auto', 'light', 'dark_dimmed'],
    ['light', 'standard', 'day', 'light', 'dark_dimmed'],
    ['dark', 'standard', 'night', 'light', 'dark'],
    ['dark-dimmed', 'standard', 'night', 'light', 'dark_dimmed'],
    ['system', 'high', 'auto', 'light_high_contrast', 'dark_dimmed_high_contrast'],
    ['light', 'high', 'day', 'light_high_contrast', 'dark_dimmed_high_contrast'],
    ['dark', 'high', 'night', 'light_high_contrast', 'dark_high_contrast'],
    ['dark-dimmed', 'high', 'night', 'light_high_contrast', 'dark_dimmed_high_contrast'],
  ] as const)('maps %s with %s contrast', (theme, contrast, colorMode, dayScheme, nightScheme) => {
    expect(primerScheme(theme, contrast)).toEqual({ colorMode, dayScheme, nightScheme })
  })
})
