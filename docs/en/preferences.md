[🇫🇷 Français](../fr/preferences.md) | 🇬🇧 English | [Brezhoneg](../br/gwellveziou.md)

# Display preferences

tunmez remembers your display choices and restores them the next time it starts.

## Language, theme and contrast

Click the round profile picture at the top right to open the **Profile** page. Its **Preferences** section offers:

- **Interface language**, menu: System, Brezhoneg, English or Français. *System* follows your computer's language; if it is not French, English or Breton, the interface is shown in French.
- **Theme**: System, Light, Dark or Dark dimmed. *Dark dimmed* is a dark theme with softer contrast. *System* follows your computer's light or dark setting, including when it changes, and uses *Dark dimmed* in dark mode.
- **High contrast**, switch: uses the high contrast variant of the theme, whatever the theme.

Changes apply immediately.

## Window

When you close tunmez, it records the window size, its position and whether it is maximised. The window reopens the same way next time.

On Linux with Wayland, the system does not let applications choose their position: the window keeps its size, but the system places it.

## Preference files

Preferences are saved in your user profile, in YAML files readable by your user account only.

### Settings: `config.yaml`

Language, theme and contrast. You can edit this file by hand, preferably while tunmez is closed:

```yaml
locale: en      # fr-FR, en or br; remove the line to follow the system language
theme: dark     # system, light, dark or dark-dimmed
contrast: high  # standard or high
```

Location:

- Linux: `~/.config/tunmez/config.yaml` (or `$XDG_CONFIG_HOME/tunmez/config.yaml`)
- macOS: `~/Library/Application Support/tunmez/config.yaml`
- Windows: `%AppData%\tunmez\config.yaml`

If the file is invalid (syntax error, unknown value), tunmez starts with the default settings and shows a message with the file path. The file is left untouched until you change a setting in tunmez, which then replaces it.

### Session state: `state.yaml`

The window and the active farm. tunmez writes this file itself; it is not meant to be edited.

Location:

- Linux: `~/.local/state/tunmez/state.yaml` (or `$XDG_STATE_HOME/tunmez/state.yaml`)
- macOS: `~/Library/Application Support/tunmez/state.yaml`
- Windows: `%AppData%\tunmez\state.yaml`
