# Technical guidelines

Structural architecture and technical decisions.

## Stack

- Backend: Go.
- Desktop application: [Wails](https://wails.io) v3.1.0.
- Frontend: Vue 3, TypeScript, Vite. Runtime: Node.js 24 LTS, installed through nvm. JS package manager: npm.
- Design system: Material Design through [Vuetify](https://vuetifyjs.com). Standard components (calendar, lanes, drag-and-drop cards, toasts, etc.) come from Vuetify and are not re-implemented.
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
| Vue 3 | Frontend framework |
| Vuetify | Material Design components |
| vue-i18n | Frontend internationalisation |
| @mdi/js | Material Design icons (SVG) |

Approved development tools:

| Tool | Use |
| --- | --- |
| Vite | Frontend build tool |
| vite-plugin-vuetify | Vuetify component tree-shaking |
| Vitest, @vue/test-utils, jsdom | Frontend unit and component tests |
| ESLint, eslint-plugin-vue, typescript-eslint | Frontend linting |
| golangci-lint | Go linting |

## Code

- Code, identifiers and comments are in English.
- Code is brief, concise, clean and secure.
- Use test-driven development wherever possible.

### Go

- Follow the Go guidelines and philosophy to the letter ([Effective Go](https://go.dev/doc/effective_go), [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments)).
- Code is self-documenting: clear names and small functions. Comments explain why, not what. Doc comments on exported identifiers follow [Go Doc Comments](https://go.dev/doc/comment).
- The package layout is defined step by step.

### Frontend

- Follow the [Vue style guide](https://vuejs.org/style-guide/).
- Single-file components with `<script setup lang="ts">` and the Composition API.
- TypeScript in strict mode, no `any`.
- Reusable logic lives in composables (`useXxx`).
- Props and emits are typed. Components stay small and focused.

## User interface

### Internationalisation and localisation

- Available languages: French and English.
- Fallback locale: `fr-FR`.
- The active language follows the host settings and the user's choice.
- Internationalisation uses vue-i18n.

### Themes

- Light and dark modes.
- The active theme follows the host settings and the user's choice.

### User preferences

User choices (language, theme, etc.) persist from one session to the next.

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
