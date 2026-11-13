---
name: primer-review
description: Review frontend changes (React components and CSS Modules) against the Primer design system and the UI rules of project/guidelines/. Use it before committing any frontend change, always when a .module.css file is added or modified, or when the maintainer asks whether the UI follows Primer. It reports findings; it applies fixes only when asked.
---

# Primer review

tunmez follows Primer, GitHub's design system (see `project/guidelines/design-system.md` and `project/guidelines/interface.md`). This review checks that a frontend change uses Primer components, props, patterns and tokens before any custom code, and that every departure is deliberate and approved.

## Scope

- Default: the frontend files changed on the branch and in the working tree, `git diff dev --name-only -- frontend/src` plus untracked files from `git status --short frontend/src`.
- A path or file list given as argument: those files only.
- `all`: every file of `frontend/src`.

Tests (`*.test.tsx`) and `src/test/` are out of scope.

## Sources

Read before judging, never from memory:

1. `project/guidelines/design-system.md`, `interface.md` and `frontend.md`: the project rules, which take precedence over Primer.
2. `mcp__primer__primer_coding_guidelines`: Primer coding rules.
3. For each Primer component used in the changed code: `mcp__primer__get_component` (props), `mcp__primer__get_component_usage_guidelines` and `mcp__primer__get_component_accessibility_guidelines`. Some usage pages come back empty: then say so, and rely on the props and accessibility pages.
4. For a screen or flow: `mcp__primer__list_patterns`, then `mcp__primer__get_pattern` for the matching pattern (empty states, forms, notification messaging, navigation…).
5. For tokens: `mcp__primer__find_tokens`, `mcp__primer__get_token_usage_patterns`.

## Checks

### Components (`*.tsx`)

- A Primer component exists for each UI element. A native element (`button`, `a`, `input`, `h1`…) or a home-made component where Primer has one is a finding. A custom component is allowed only with the maintainer's approval, recorded in `project/guidelines/design-system.md`.
- Styling goes through component props first (`Stack` `gap`/`padding`/`align`, `Text` `size`/`weight`, `Button` `variant`/`size`, `Heading` `variant`…). A CSS class doing what a prop does is a finding.
- No `sx` prop, no `Box`, no styled-components, no inline `style` other than passing a CSS variable.
- Icons come from `@primer/octicons-react`.
- The component is used as its usage guidelines say (variant for the purpose, one primary button per view, tooltips on icon-only buttons…), and meets its accessibility guidelines (accessible name, `aria-current`, focus management, keyboard).
- The screen follows the matching Primer pattern when one exists.

### CSS Modules (`*.module.css`)

1. Run `mcp__primer__lint_css` on the content of each changed file. Its output may list no detail: then say so in the report, and rely on the checks below.
2. Check by reading:
   - Every colour, spacing, size, radius, border, shadow, typography, motion, z-index and breakpoint value is a Primer token. Layout values such as `0`, `100%`, `auto` or `min-width: 0` are fine.
   - Every token exists and is not deprecated: confirm it with `mcp__primer__find_tokens`.
   - The token fits its meaning: functional tokens (`--fgColor-*`, `--bgColor-*`, `--borderColor-*`, `--stack-gap-*`, `--control-*`, `--text-*`) before base tokens (`--base-*`); related properties use tokens of the same group (background and border of the same role).
   - Tokens are theme-aware: no colour that stays the same across light, dark, dark dimmed and their high contrast variants. Images are the exception: their colours are part of the image.
   - No override of Primer internals: no `prc-*` class, `:global`, `[data-component]` or Primer data attribute selector, no `!important`.
   - Restyling a Primer component (radius, padding, colours of a `Button`…) is a finding unless the maintainer approved it.
   - Focus stays visible: an `outline: none` without a replacement is a finding; custom focus uses `--focus-outline` and `--focus-outline-offset`.
   - Each rule has a reason a Primer prop could not cover; dead or redundant rules are findings.

### Visual check (optional)

When the change alters the look, check it with the `browser-preview` skill: light and dark themes, high contrast, hover and keyboard focus, narrow width.

## Report

List the findings, most severe first. For each one:

- `file:line`, the rule broken and its source (Primer page or `project/guidelines/` file and section);
- what to do instead, with the Primer component, prop or token to use;
- whether it needs a maintainer decision (custom component, restyled Primer component, rule missing from the guidelines).

Then list the checks that could not be run (an empty Primer page, `lint_css` without detail). End with a one-line verdict.

Do not fix anything unless the maintainer asks. Never record a new UI rule in `project/guidelines/` without their explicit decision.
