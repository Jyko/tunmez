# Technical guidelines

Structural architecture and technical decisions.

## Stack

- Backend: Go.
- Desktop application: [Wails](https://wails.io) v3.1.0.
- Frontend: React, TypeScript, Vite. Runtime: Node.js 24 LTS, installed through nvm. JS package manager: npm.
- Design system: [Primer](https://primer.style), GitHub's design system, through Primer React. GitHub and its web UI are the reference. Layout, typography, theme and components come from Primer:
  - Components come from `@primer/react` (and `@primer/react/experimental`). No custom UI component is created before the Primer possibilities are exhausted, and never without the maintainer's approval. App components only assemble Primer components.
  - Styling uses Primer design tokens (`@primer/primitives` CSS variables) in CSS Modules, never hard-coded values, the `sx` prop or the `Box` component. Icons come from `@primer/octicons-react`.
  - Primer documentation, patterns and tokens are queried through the `@primer/mcp` MCP server (`.mcp.json`).
- Persistence: SQLite through [github.com/mattn/go-sqlite3](https://github.com/mattn/go-sqlite3).

## Build

- cgo is allowed. Wails requires it on Linux and macOS for the webview, and the SQLite driver requires it as well.
- Target platforms: Linux, macOS, Windows 11.
- The application is compiled natively on each target platform, without cross-compilation.
- The build follows the standard Wails workflow: the `wails3` CLI runs Task with `Taskfile.yml` and `build/`. npm only builds the frontend, which the Go binary then embeds and serves.

## Dependencies

- Keep JS/TS libraries to a minimum.
- Only well-known, mature, robust, community-driven FOSS libraries that the maintainer has approved.

Approved runtime libraries:

| Library | Use |
| --- | --- |
| Wails v3 | Desktop shell, Go/frontend bindings |
| github.com/mattn/go-sqlite3 | SQLite driver |
| github.com/pressly/goose/v3 | SQLite schema migrations |
| github.com/google/uuid | UUIDv7 technical identifiers |
| github.com/goccy/go-yaml | YAML preference files |
| React, react-dom, react-is | Frontend framework (react-is is a peer dependency of Primer React) |
| @primer/react | Primer components |
| @primer/primitives | Primer design tokens and themes (CSS variables) |
| @primer/octicons-react | Primer icons (Octicons) |
| react-intl | Frontend internationalisation |

Approved development tools:

| Tool | Use |
| --- | --- |
| Vite | Frontend build tool |
| @vitejs/plugin-react | React support for Vite |
| Vitest, jsdom, @testing-library/react, @testing-library/dom, @testing-library/user-event | Frontend unit and component tests |
| ESLint, eslint-plugin-react-hooks, typescript-eslint | Frontend linting |
| @types/react, @types/react-dom, @types/react-is | React type definitions |
| golangci-lint | Go linting |

## Code

- Code, identifiers and comments are in English.
- Code is brief, concise, clean and secure.
- Use test-driven development wherever possible.

### Go

- Follow the Go guidelines and philosophy to the letter ([Effective Go](https://go.dev/doc/effective_go), [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments)).
- Code is self-documenting: clear names and small functions. Comments explain why, not what. Doc comments on exported identifiers follow [Go Doc Comments](https://go.dev/doc/comment).
- The package layout is defined step by step. Domain code lives in `internal/<domain>`.

### Architecture

- Responsibilities are separated: services hold the business logic, repositories hold the data access.
- SQL is only used in `internal/database` and in repositories. A service never accesses the database directly.
- A service depends on a repository interface declared in its own package. The SQLite implementation lives next to it in a `sqlite_<entity>_repository.go` file, a YAML file implementation in a `yaml_<entity>_repository.go` file.
- Naming: entity + role, the package name qualifying the domain, for example `preferences.DisplayService`, `preferences.SettingsRepository`, `farm.SQLiteRepository`. Never repeat the package name (`preferences.PreferencesService`).

### Persistence

- A single SQLite database, stored in the user data directory: `$XDG_DATA_HOME/tunmez/tunmez.db` (default `~/.local/share/tunmez/tunmez.db`) on Linux, `tunmez/tunmez.db` under the user configuration directory on macOS and Windows. The file is owner-only (`0600`).
- `internal/database` opens the database and applies the migrations. Migrations are numbered SQL files embedded in the binary (`internal/database/migrations/`), applied with goose at startup.
- Technical identifiers are UUIDv7 stored as `TEXT`.
- User preferences are not stored in the database. They live in owner-only YAML files in the user's profile, read at startup:
  - Settings the user may edit by hand (language, theme): `config.yaml` in the user configuration directory (`$XDG_CONFIG_HOME/tunmez/`, default `~/.config/tunmez/`, on Linux; `tunmez/` under the user configuration directory on macOS and Windows).
  - Session state written by the application (window geometry, active farm): `state.yaml` in `$XDG_STATE_HOME/tunmez/` (default `~/.local/state/tunmez/`) on Linux, next to `config.yaml` on macOS and Windows.
  - Defaults are declared in code; keys missing from a file keep their default.
  - An invalid settings file does not block startup: defaults are used, the user is told which file is invalid, and the file is replaced only when a setting changes. An invalid state file falls back to defaults silently.
  - Files are written atomically (temporary file then rename).
- Farm-owned data references `farm(id)` with `ON DELETE CASCADE`, so deleting a farm deletes its data.

### Frontend

- Follow the [Rules of React](https://react.dev/reference/rules): function components and hooks, enforced by eslint-plugin-react-hooks.
- TypeScript in strict mode, no `any`.
- Shared state lives in framework-agnostic stores (`src/state/`), testable without rendering. Each store is provided through a React context and read with a hook (`useFarms`, `useNavigation`, `useDisplayPreferences`).
- Props are typed. Components stay small and focused.
- Pages of the central content switch through the navigation state (`useNavigation`), without a router.
- Wails bindings are only called from API client modules in `src/api/`. Components and composables use these clients, never the bindings directly.

## User interface

### Internationalisation and localisation

- Available languages: French and English.
- Fallback locale: `fr-FR`.
- The active language follows the host settings and the user's choice.
- Internationalisation uses react-intl. Translation files are nested JSON with ICU placeholders (`{name}`).

### Themes

- Themes: System, Light, Dark and Dark dimmed (French: Système, Clair, Sombre profond, Sombre doux), the default Primer `light`, `dark` and `dark_dimmed` themes, with their colours unchanged for now. System switches between Light and Dark dimmed.
- Contrast: standard or high. High contrast uses the Primer high contrast variant of the theme (`light_high_contrast`, `dark_high_contrast`, `dark_dimmed_high_contrast`).
- The active theme follows the host settings and the user's choice.

### User preferences

User choices persist from one session to the next: language, theme, contrast, size, maximised state and position of the main window, and the active farm. Language, theme and contrast are set in the preferences of the profile page. They save on selection, as imperative controls (Primer customize pattern): an `ActionMenu` with single selection for the language, a `SegmentedControl` for the theme, a `ToggleSwitch` for high contrast. There is no settings page.

### Layout

The application is a single-page application laid out like a GitHub repository page:

- Header, on a muted band (`--bgColor-inset`): on the left the application name, a `/` separator and the farm button (active farm name), as GitHub shows `owner / repository`; at the right end the profile button. No tagline. Primer React's `Header` component is not used: it is GitHub's former dark header, on which Primer buttons are not readable.
- Main navigation: `UnderlineNav` tabs at the bottom of the header, listing the main destinations of the application. The current destination is the selected tab (`aria-current="page"`).
- Main navigation entries: home, and the farm settings while a farm is open. The farm settings tab is labelled Settings (French: Réglages) with the gear icon, like the Settings tab of a GitHub repository.
- Central content: shows one page at a time, in a Primer `PageLayout`, and holds the core of the application. Each page starts with a `PageHeader`.
  - The farm button opens the farm selector, a `SelectPanel` with a filter field, used to switch farm, with a "New farm" action in its footer. There is no farms page.
  - The farm settings page holds the settings of the active farm: rename, and deletion in a danger zone at the bottom of the page.
  - The profile button opens the profile page, which holds the user's preferences (language, theme).
- Messages follow the Primer notification messaging pattern: `Banner` at the top of the content or inside a dialog, no toast.
- Navigation history: the central content records the pages visited and can go back to the previous page on command. No button, shortcut or action triggers it yet.
- When the page changes, focus moves to the page heading, so keyboard and screen reader users land on the new content.

### Accessibility

- Target: WCAG 2.2 level AA.

### UI/UX

- Follow modern UI/UX good practices on top of accessibility requirements: consistency, clear visual hierarchy, immediate feedback on actions, undo rather than confirmation where possible, clear empty states and error messages.

### Inclusive writing

- UI text and user documentation use inclusive writing (for example « maraîcher·es », « l'utilisateur ou l'utilisatrice »).
- This does not apply to code.

### Keyboard shortcuts

- The application provides a keymap.
- Shortcuts follow web standards first, then those of modern operating systems. The primary modifier is ⌘ Cmd on macOS and Ctrl on Windows and Linux (for example Cmd/Ctrl+C and Cmd/Ctrl+V to copy and paste, Cmd/Ctrl+A to select all).
- Every shortcut is documented in `docs/fr/raccourcis.md` and `docs/en/keybinds.md`.

## Documentation

- Technical documents (`project/`) are written in English.
- User documentation is written in French and in English, as plain Markdown that renders on GitHub:
  - `README.md` (French) and `README.en.md` (English).
  - `docs/fr/` and `docs/en/` have the same structure. File names are localised and meaningful in each language (for example `raccourcis.md` and `keybinds.md`).
  - User documentation is split into several files for readability and maintainability.
  - Each page starts with a language switch linking to its counterpart, for example: `🇫🇷 Français | [🇬🇧 English](README.en.md)`.

## Licence

The project is FOSS, released into the public domain under The Unlicense (`LICENSE.md`).
