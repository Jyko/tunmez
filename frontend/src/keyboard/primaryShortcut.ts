// Shortcuts using the primary modifier: ⌘ Cmd on macOS, Ctrl elsewhere.

export function isMacPlatform(): boolean {
  return /Mac|iPhone|iPad/.test(navigator.userAgent)
}

export interface PrimaryShortcut {
  // Whether event is the primary modifier plus the shortcut key, alone.
  matches(event: KeyboardEvent): boolean
  // Label shown to the user, for example "Ctrl+O" or "⌘O".
  label: string
  // Value for the aria-keyshortcuts attribute.
  aria: string
}

export function primaryShortcut(key: string, mac = isMacPlatform()): PrimaryShortcut {
  const upper = key.toUpperCase()
  return {
    matches: (e) =>
      (mac ? e.metaKey && !e.ctrlKey : e.ctrlKey && !e.metaKey) &&
      !e.altKey &&
      !e.shiftKey &&
      e.key.toLowerCase() === key.toLowerCase(),
    label: mac ? `⌘${upper}` : `Ctrl+${upper}`,
    aria: mac ? `Meta+${upper}` : `Control+${upper}`,
  }
}
