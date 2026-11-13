[🇫🇷 Français](../fr/preferences.md) | 🇬🇧 English

# Display preferences

tunmez remembers your display choices and restores them the next time it starts.

## Language and theme

Open the **Settings** menu (gear icon, top right):

- **Language**: System, Français or English. *System* follows your computer's language; if it is neither French nor English, the interface is shown in French.
- **Theme**: System, Light or Dark. *System* follows your computer's light or dark setting, including when it changes.

Changes apply immediately.

## Window

When you close tunmez, it records the window size, its position and whether it is maximised. The window reopens the same way next time.

On Linux with Wayland, the system does not let applications choose their position: the window keeps its size, but the system places it.

## Where data is stored

Preferences are saved in the tunmez database, readable by your user account only:

- Linux: `~/.local/share/tunmez/tunmez.db` (or `$XDG_DATA_HOME/tunmez/tunmez.db`)
- macOS: `~/Library/Application Support/tunmez/tunmez.db`
- Windows: `%AppData%\tunmez\tunmez.db`
