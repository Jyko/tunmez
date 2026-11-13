# User story: settings page

## Story

As a market gardener (maraîcher·e), I want a settings page, so that I can find and change all my preferences in one place.

## Scope

In scope:

- The settings page, opened from the settings button of the application bar.
- The existing settings: language and theme.

Out of scope:

- Farm settings. They will belong to each farm.
- Editing `config.yaml` by hand, already supported.

## Acceptance criteria

- The settings button of the application bar opens the settings page in the central content, as in modern desktop applications and browsers. It no longer opens a menu.
- The page groups settings into labelled sections. A section holds related settings, each with a label and a short description when needed.
- Language: System, Français, English. Language names are shown in their own language.
- Theme: System, Light, Dark.
- A change applies and is saved immediately, with no save button.
- The page is fully usable with the keyboard and screen readers (WCAG 2.2 AA).

## Choices left to the first implementation

The first implementation proposes the following, and the maintainer reviews them afterwards:

- Section names and layout.
- Controls used for each setting.
