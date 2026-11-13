---
name: browser-preview
description: See and drive the running tunmez app in a headless browser through the Playwright MCP plugin, with the real Go backend in Wails server mode. Use it to check a UI change visually (layout, hover, focus, light/dark theme, FR/EN), to iterate on a design with the maintainer, or to smoke-test a flow by hand. It does not replace unit or e2e tests.
---

# Browser preview

The desktop window of `wails3 dev` cannot be captured by the agent. Instead, the same Go code is built with the Wails `server` build tag: it serves the frontend over HTTP, proxies the Vite dev server, and answers the bindings, so the Playwright MCP plugin can open the app in a headless Chromium.

## Prerequisites

- Plugin `playwright@claude-plugins-official` enabled.
- `.claude/settings.json` sets `PLAYWRIGHT_MCP_BROWSER=chromium` and `PLAYWRIGHT_MCP_HEADLESS=true`, so the plugin uses Playwright's Chromium without a window. Without them it looks for Google Chrome and fails with `Chromium distribution 'chrome' is not found`. A change to these variables needs a Claude Code restart.
- Playwright's Chromium is installed for the version the plugin runs. If `browser_navigate` reports a missing browser, run the `install` command it suggests, or:
  ```bash
  . "$HOME/.nvm/nvm.sh"; node "$(dirname "$(ls -d ~/.npm/_npx/*/node_modules/playwright-core | head -1)")/playwright-core/cli.js" install chromium
  ```

## Start and stop

```bash
.claude/skills/browser-preview/scripts/start.sh          # keeps the preview data
.claude/skills/browser-preview/scripts/start.sh --reset  # starts from an empty profile (no farm)
.claude/skills/browser-preview/scripts/stop.sh
```

`start.sh` stops a previous preview, builds `-tags server`, starts Vite and the backend, waits until both answer, and prints the URL: `http://localhost:8765/`.

- Data: database, `config.yaml` and `state.yaml` go to `/tmp/tunmez-preview/xdg/` through the `XDG_*` variables. The maintainer's real data is never touched.
- Logs: `/tmp/tunmez-preview/vite.log` and `server.log`.
- Ports: backend `8765`, Vite `9246`, so the preview can run next to `wails3 dev` (Vite `9245`). Override with `TUNMEZ_PREVIEW_PORT`, `TUNMEZ_PREVIEW_VITE_PORT`, `TUNMEZ_PREVIEW_DIR`.
- Go changes need `start.sh` again. Frontend changes only need a page reload (`browser_navigate` to the URL): Vite hot reload does not go through the Wails proxy, and the console shows a harmless WebSocket `501` error for it.

When the work is done, release everything: `browser_close`, then `stop.sh`, then delete the screenshots and logs in `.playwright-mcp/` unless the maintainer still needs them.

## Drive

Use the `mcp__plugin_playwright_playwright__*` tools:

1. `browser_navigate` to `http://localhost:8765/`.
2. `browser_snapshot` gives the accessibility tree with element refs. Prefer it to find and act on elements; it also shows accessible names and roles, which helps check WCAG labelling.
3. Act with `browser_click`, `browser_hover`, `browser_type`, `browser_fill_form`, `browser_press_key` (`Tab` for focus order; app shortcuts such as `Control+o` for the farm selector).
4. `browser_take_screenshot` and look at the image (`Read` the saved file). A blank page means the app did not start: read the logs. Use `target` to capture only the component under work. After a hover or focus, wait about 300 ms (`browser_wait_for` with `time`) before the screenshot: Primer hover and focus states, and tooltips, transition in, and an immediate capture misses them.
5. `browser_console_messages` with level `error` after each flow. Expected noise: the Vite WebSocket `501`, a `favicon.ico` 404, and the Wails "Browser Environment Detected" warning (the bindings still work in server mode).

The browser locale is English, so the UI starts in English until a language is chosen on the settings page.

Variants to check for a UI change:

- Theme: `browser_emulate_media` with `colorScheme` `dark` or `light`. It applies while the theme setting is "system". Primer controls transition their colours on a theme switch: wait about 1.5 s before a screenshot, otherwise some buttons show a mix of both themes (filled grey, invisible icon) and look like a bug.
- Language: change it on the settings page. The browser locale only applies when no language is saved.
- Width: `browser_resize`, for example 600 px wide for a narrow window.
- States: hover, keyboard focus (`Tab`), dialogs, empty state (`start.sh --reset`).

Screenshots go to `.playwright-mcp/` at the repo root, which is git-ignored. Show the maintainer the ones that matter for a decision.

## Limits

- Chromium, not WebKitGTK, the engine of the Linux desktop window: the rendering is close but not identical. Check fine details in `wails3 dev`.
- Server mode has no native window: window geometry, native menus and dialogs are not exercised.
- This is a manual check. Behaviour still needs unit tests (`npm run test`, `go test ./...`).
