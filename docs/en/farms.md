[🇫🇷 Français](../fr/exploitations.md) | 🇬🇧 English

# Farms

tunmez manages several farms. Each one will have its own data: settings, plots, beds, tasks, calendar…

## First farm

On first launch, no farm exists. The home page offers a **Create a farm** button. Enter its name and confirm: the farm is created and becomes the active farm.

The name is required and must not exceed 255 characters. Two farms can have the same name.

## Switching farms

The active farm's name is shown at the top right, left of the profile icon. When no farm is open, it is replaced by *Choose a farm*, or by *No farms* if you have none.

Click it, or press Ctrl+O (⌘ Cmd+O on macOS), to open the **Farms** page. It shows each of your farms as a card, from most to least recently used. The **Active farm** section shows the highlighted card of the open farm, and the **Other farms** section shows the cards of the others. Clicking another farm's card makes it the active farm: its card moves to the **Active farm** section and you stay on the page.

## Managing farms

The **New farm** button of the **Farms** page creates a farm, which becomes the active farm.

The settings of the active farm open from the **Farm settings** entry of the navigation menu, on the left. This entry only appears while a farm is open. The page offers:

- in the **General** section, the **Rename** button to change the farm's name;
- in the **Danger zone** section, the **Delete this farm** button. To confirm, type the farm's exact name in the window that opens. **Deletion is permanent**: the farm and all its data are erased.

After the active farm is deleted, no farm is open: the home page offers to choose one of the remaining farms or to create one.

## At startup

tunmez reopens the last farm you used. If it no longer exists, the home page lists your farms, or offers to create one if you have none.

## Where data is stored

Farms are saved in the tunmez database, readable by your user account only:

- Linux: `~/.local/share/tunmez/tunmez.db` (or `$XDG_DATA_HOME/tunmez/tunmez.db`)
- macOS: `~/Library/Application Support/tunmez/tunmez.db`
- Windows: `%AppData%\tunmez\tunmez.db`

The active farm is remembered in the [session state](preferences.md#session-state-stateyaml).
