# Frontend

Code React et TypeScript.

- Suivre les [règles de React](https://react.dev/reference/rules) : composants fonctions et hooks, vérifiés par eslint-plugin-react-hooks.
- TypeScript en mode strict, sans `any`.
- L'état partagé vit dans des stores indépendants du framework (`src/state/`), testables sans rendu. Chaque store est fourni par un contexte React et lu avec un hook (`useFarms`, `useNavigation`, `useDisplayPreferences`).
- Les props sont typées. Les composants restent petits et ciblés.
- Les pages du contenu central changent avec l'état de navigation (`useNavigation`), sans routeur.
- Les liaisons Wails ne sont appelées que depuis les clients d'API de `src/api/`. Les composants utilisent ces clients, jamais les liaisons directement.
