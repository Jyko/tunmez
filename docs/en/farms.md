[🇫🇷 Français](../fr/exploitations.md) | 🇬🇧 English

# Farms

tunmez manages several farms. Each one will have its own data: settings, plots, beds, tasks, calendar…

## First farm

On first launch, no farm exists. The home screen offers a **Create a farm** button. Enter its name and confirm: the farm is created and becomes the active farm.

The name is required and must not exceed 255 characters. Two farms can have the same name.

## Switching farms

The active farm's name is shown at the top right, left of the account icon. Click it, or press Ctrl+O (⌘ Cmd+O on macOS), to open the farm menu:

- your farms, from most to least recently used, with a check mark on the active farm;
- **New farm**;
- **Manage farms**.

Choose a farm to open it.

## Managing farms

The **Manage farms** screen lists your farms:

- the pencil icon renames a farm;
- the bin icon deletes it, after confirmation. **Deletion is permanent**: the farm and all its data are erased.

After the active farm is deleted, no farm is open: the home screen offers to choose one of the remaining farms or to create one.

## At startup

tunmez reopens the last farm you used. If it no longer exists, the home screen lists your farms, or offers to create one if you have none.

## Where data is stored

Farms are saved in the tunmez database, readable by your user account only:

- Linux: `~/.local/share/tunmez/tunmez.db` (or `$XDG_DATA_HOME/tunmez/tunmez.db`)
- macOS: `~/Library/Application Support/tunmez/tunmez.db`
- Windows: `%AppData%\tunmez\tunmez.db`

The active farm is remembered in the [session state](preferences.md#session-state-stateyaml).
