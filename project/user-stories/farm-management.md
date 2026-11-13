# User story: farm management

## Story

As a market gardener (maraîcher·e), I want to create several farms and switch between them, so that each farm keeps its own settings, plots, beds, equipment, statistics, tasks and calendar.

## Scope

In scope:

- Create a farm.
- Switch the active farm.
- Rename a farm.
- Delete a farm.

Out of scope:

- The per-farm data itself (settings, plots, beds, equipment, statistics, tasks, calendar). Later stories attach it to a farm.
- Account features. The account icon is only a placeholder.
- Farm fields other than the name.

## Acceptance criteria

### Empty state

- No farm is ever created automatically.
- When no farm exists, the home page of the central content shows a centred neutral state with a call to action to create a farm, as in most modern management applications.
- The call to action is a button with a text label: « Créer une ferme » / "Create a farm". An icon alone is not enough.
- When farms exist but none is active, the same empty state also lists the farms so the user can pick one.

### Startup

- If the last used farm still exists, it becomes the active farm.
- Otherwise, if farms exist, the empty state lists them.
- Otherwise, the empty state shows the call to action to create a farm.

### Application bar

- The farm button of the application bar (see the layout in `project/guideline.md`) shows the active farm name.
- When farms exist but none is active, it shows a placeholder text inviting to choose a farm. When no farm exists, it shows a placeholder text saying there is no farm.
- It shows a trailing chevron, the Primer convention for a button that opens a selection.
- It opens the farm selector, a Primer `SelectPanel` anchored to the button.
- The farm button is reachable with the keyboard: through the usual Tab cycling at least, and through a dedicated keyboard shortcut, documented in `docs/fr/raccourcis.md` and `docs/en/keybinds.md`.
- A name too long for its component is truncated cleanly. The full name stays available.

### Create

- A dialog asks for the farm name.
- The name is required: it must not be empty once leading and trailing spaces are removed.
- The name is at most 255 characters.
- Names do not need to be unique.
- The new farm becomes the active farm.

### Farm selector

- There is no farms page: the farm selector replaces it. The navigation has no farms entry.
- Lists every farm, the active farm first and marked as selected, then the others most recently used first.
- A filter field narrows the list by name, ignoring case and accents. An empty list shows a message: no farm yet, or no farm matching the filter.
- Choosing another farm makes it the active farm, updates its last use and closes the selector. The user stays on the current page. Choosing the active farm only closes the selector.
- The selector footer has a "New farm" action, which closes the selector and opens the creation dialog.
- There is no global create menu while the farm is the only entity created from anywhere in the application.

### Farm settings page

- The navigation has a "Farm settings" entry while a farm is open. It opens the settings page of the active farm.
- A "General" section has a "Rename" action, which opens the name dialog. Rename follows the same name rules as creation.
- A "Danger zone" section, at the bottom of the page, has a "Delete this farm" action. A dialog names the farm, warns that all its data will be lost, and enables the delete button only once the exact farm name is typed. This is a deliberate exception to the "undo rather than confirmation" rule, because deletion destroys data.
- Deleting the farm leaves no active farm: the home page is shown, with the empty state.
- Deleting the last farm is allowed.

### Persistence

- Farms and the active farm persist from one session to the next.

### Quality

- WCAG 2.2 level AA: menu, dialogs and screen are keyboard reachable, controls are labelled.
- UI text in French and English, with inclusive writing.
- Immediate feedback on actions and clear validation errors.

## Technical notes

Implementation guidance, following `project/guideline.md`.

- New domain `internal/farm`: `farm.Service` bound to the frontend, `farm.Repository` interface, SQLite implementation `farm.SQLiteRepository` in `sqlite_repository.go`.
- Migration `internal/database/migrations/00002_farm.sql`: table `farm` with `id` (UUIDv7 as `TEXT`), `name TEXT NOT NULL`, creation and last-use timestamps. Future per-farm tables reference `farm(id)` with `ON DELETE CASCADE`.
- The active farm is a preference entry declared in `internal/preferences/registry.go`, cleared when that farm is deleted.
- Frontend: an API client in `src/api/`, a `useFarms` composable, and small components for the farm selector, the name dialog and the empty state.
- User documentation in French and English is written with the implementation.

## Choices left to the first implementation

The first implementation proposes the following, and the maintainer reviews them afterwards:

- Key combination of the farm menu shortcut.
- FR/EN wording of the labels other than the call to action.
