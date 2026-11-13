# User story: preferences

## Story

As a market gardener (maraîcher·e), I want to find and change all my preferences in one place, so that the application suits me.

## Scope

In scope:

- The preferences section of the profile page.
- The preferences: language, theme and contrast.

Out of scope:

- Farm settings. They belong to each farm, on the farm settings page.
- Editing `config.yaml` by hand, already supported.

## Acceptance criteria

- There is no settings button nor settings page. The preferences live in a **Preferences** section of the profile page, opened from the profile button of the header, as GitHub keeps appearance in the account settings.
- The gear icon belongs to the farm settings tab, labelled Settings (French: Réglages), like the Settings tab of a GitHub repository.
- Each preference has a label and a short description when needed.
- Language: System, Français, English, in a menu with single selection (Primer `ActionMenu`). Language names are shown in their own language.
- Theme: System, Light, Dark, Dark dimmed (French: Système, Clair, Sombre profond, Sombre doux), in a Primer `SegmentedControl`. Dark dimmed is Primer's `dark_dimmed` theme. System switches between Light and Dark dimmed.
- High contrast: a Primer `ToggleSwitch` that turns on the high contrast variant of the three themes (Light, Dark, Dark dimmed).
- A change applies and is saved on selection, with no save button (Primer customize pattern: imperative controls).
- The preferences are fully usable with the keyboard and screen readers (WCAG 2.2 AA).
