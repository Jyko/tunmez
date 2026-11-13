# Design system

Primer et thèmes. S'applique à tout le travail d'interface.

## Primer

[Primer](https://primer.style), le design system de GitHub, avec Primer React. GitHub et son interface web servent de référence. La disposition, la typographie, le thème et les composants viennent de Primer :

- Les composants viennent de `@primer/react` (et `@primer/react/experimental`). Aucun composant d'interface maison n'est créé avant d'avoir épuisé les possibilités de Primer, et jamais sans l'accord du mainteneur ou de la mainteneuse. Les composants de l'application ne font qu'assembler des composants Primer.
- Le style utilise les tokens de design Primer (variables CSS de `@primer/primitives`) dans des CSS Modules, jamais de valeurs en dur, la prop `sx` ou le composant `Box`. Les icônes viennent de `@primer/octicons-react`.
- La documentation, les patterns et les tokens Primer se consultent avec le serveur MCP `@primer/mcp` (`.mcp.json`).

## Exceptions approuvées

Écarts à Primer approuvés par le mainteneur ou la mainteneuse. Tout autre écart demande d'abord son accord.

- Bouton de profil : un `Button` Primer (variante `invisible`) qui contient l'`Avatar` Primer, restylé en rond, parce que Primer n'a pas de bouton-avatar. Son CSS Module retire seulement la marge intérieure, fixe la largeur à `--control-medium-size` pour que l'avatar de 32 px remplisse le bouton, et l'arrondit avec `--borderRadius-full`. Son nom accessible vient d'un `Tooltip` Primer de type `label`.

## Thèmes

- Thèmes : Système, Clair, Sombre profond et Sombre doux, les thèmes Primer par défaut `light`, `dark` et `dark_dimmed`, sans changer leurs couleurs pour l'instant. Système bascule entre Clair et Sombre doux.
- Contraste : standard ou élevé. Le contraste élevé utilise la variante à contraste élevé de Primer du thème (`light_high_contrast`, `dark_high_contrast`, `dark_dimmed_high_contrast`).
- Le thème actif suit les réglages de l'ordinateur et le choix de l'utilisateur ou de l'utilisatrice.
