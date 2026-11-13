# Stack et dépendances

Technologies, build et bibliothèques approuvées. S'applique à tout le travail.

## Stack

- Backend : Go.
- Application de bureau : [Wails](https://wails.io) v3.1.0.
- Frontend : React, TypeScript, Vite. Environnement d'exécution : Node.js 24 LTS, installé avec nvm. Gestionnaire de paquets JS : npm.
- Design system : [Primer](https://primer.style), voir [design-system.md](design-system.md).
- Persistance : SQLite avec [github.com/mattn/go-sqlite3](https://github.com/mattn/go-sqlite3).

## Build

- cgo est autorisé. Wails en a besoin sur Linux et macOS pour la webview, et le pilote SQLite aussi.
- Plateformes cibles : Linux, macOS, Windows 11.
- L'application est compilée nativement sur chaque plateforme cible, sans compilation croisée.
- Le build suit le flux standard de Wails : la CLI `wails3` lance Task avec `Taskfile.yml` et `build/`. npm ne construit que le frontend, que le binaire Go embarque et sert ensuite.

## Dépendances

- Le moins possible de bibliothèques JS/TS.
- Uniquement des bibliothèques libres connues, matures, robustes et portées par une communauté, approuvées par le mainteneur ou la mainteneuse.

Bibliothèques d'exécution approuvées :

| Bibliothèque | Usage |
| --- | --- |
| Wails v3 | Coquille de bureau, liaisons Go/frontend |
| github.com/mattn/go-sqlite3 | Pilote SQLite |
| github.com/pressly/goose/v3 | Migrations du schéma SQLite |
| github.com/google/uuid | Identifiants techniques UUIDv7 |
| github.com/goccy/go-yaml | Fichiers de préférences YAML |
| React, react-dom, react-is | Framework frontend (react-is est une dépendance pair de Primer React) |
| @primer/react | Composants Primer |
| @primer/primitives | Tokens de design et thèmes Primer (variables CSS) |
| @primer/octicons-react | Icônes Primer (Octicons) |
| react-intl | Internationalisation du frontend |

Outils de développement approuvés :

| Outil | Usage |
| --- | --- |
| Vite | Outil de build du frontend |
| @vitejs/plugin-react | Support de React dans Vite |
| Vitest, jsdom, @testing-library/react, @testing-library/dom, @testing-library/user-event | Tests unitaires et de composants du frontend |
| ESLint, eslint-plugin-react-hooks, typescript-eslint | Lint du frontend |
| @types/react, @types/react-dom, @types/react-is | Définitions de types React |
| golangci-lint | Lint Go |
