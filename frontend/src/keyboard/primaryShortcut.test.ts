import { describe, expect, it } from 'vitest'
import { primaryShortcut } from './primaryShortcut'

const key = (init: KeyboardEventInit) => new KeyboardEvent('keydown', init)

describe('primaryShortcut', () => {
  it('uses Ctrl on Windows and Linux', () => {
    const shortcut = primaryShortcut('o', false)

    expect(shortcut.matches(key({ key: 'o', ctrlKey: true }))).toBe(true)
    expect(shortcut.matches(key({ key: 'O', ctrlKey: true }))).toBe(true)
    expect(shortcut.matches(key({ key: 'o', metaKey: true }))).toBe(false)
    expect(shortcut.matches(key({ key: 'o', ctrlKey: true, shiftKey: true }))).toBe(false)
    expect(shortcut.matches(key({ key: 'o' }))).toBe(false)
    expect(shortcut.label).toBe('Ctrl+O')
    expect(shortcut.aria).toBe('Control+O')
  })

  it('uses Cmd on macOS', () => {
    const shortcut = primaryShortcut('o', true)

    expect(shortcut.matches(key({ key: 'o', metaKey: true }))).toBe(true)
    expect(shortcut.matches(key({ key: 'o', ctrlKey: true }))).toBe(false)
    expect(shortcut.label).toBe('⌘O')
    expect(shortcut.aria).toBe('Meta+O')
  })
})
