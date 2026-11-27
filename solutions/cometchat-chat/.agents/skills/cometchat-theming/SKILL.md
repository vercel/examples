---
name: cometchat-theming
description: Customize CometChat UI to match the user's app design system. Covers the CSS variable cascade, preset themes, brand color overrides, design system extraction, dark mode, and framework-specific override locations.
license: "MIT"
compatibility: "Node.js >=18; @cometchat/chat-uikit-react ^6; integration must already be applied"
allowed-tools: "executeBash, readFile, fileSearch, listDirectory, grepSearch"
metadata:
  author: "CometChat"
  version: "3.1.0"
  tags: "cometchat theming css customization branding dark-mode"
---

> **Companion skills:** `cometchat-core` covers CSS import placement
> and the one-import rule; `cometchat-customization` covers
> component-level CSS selectors for deeper overrides;
> `cometchat-troubleshooting` handles cases where the theme doesn't
> apply.

## Purpose

Teach Claude how to theme CometChat in a v3 (AI-written) integration.
Themes are just CSS variable overrides — you write them directly into
the project's CSS (or, for Astro, the React island file). **Do not use
the `cometchat apply-theme` CLI command — it was a v2 tool that expects
a CLI-generated `.cometchat/state.json` marker that v3 integrations
don't create, and it will fail with "No integration found".**

---

## 1. How CometChat theming works

### The CSS variable cascade

CometChat's entire visual identity is driven by **200+ CSS custom
properties** defined in `@cometchat/chat-uikit-react/css-variables.css`.
This file is imported once at the app root (see `cometchat-core`).
Every `<CometChat*>` component reads these variables — there is no
component-level style-props API for colors, fonts, or spacing.

To override: write CSS rules that set `--cometchat-*` variables on
`:root` (or a scoped container), **after** the `css-variables.css`
import. The cascade does the rest — every component picks up the new
values automatically.

```css
/* Must appear AFTER the @import of css-variables.css */
:root {
  --cometchat-primary-color: #6C63FF;
  --cometchat-background-color-01: #FFFFFF;
  --cometchat-text-color-primary: #141414;
  --cometchat-font-family: "Inter", sans-serif;
  --cometchat-radius-2: 8px;
}
```

### Dark mode

Two broad strategies — pick based on how the project already handles dark mode.

**Strategy A — OS-driven only** (simplest). Overrides live inside a `@media (prefers-color-scheme: dark)` block. The browser swaps themes based on the user's OS preference:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --cometchat-primary-color: #7B73FF;
    --cometchat-background-color-01: #1A1A2E;
    --cometchat-text-color-primary: #E0E0E0;
    /* ... remaining dark overrides ... */
  }
}
```

**Strategy B — App-controlled theme toggle.** If the project already has a theme toggle (next-themes, Tailwind `dark:` prefix, React Context, etc.), wire CometChat's dark mode to the same trigger. The shared trigger is typically a CSS class or `data-theme` attribute on `<html>` or `<body>`. Scope the override to that selector:

```css
/* next-themes default: applies a `.dark` class to <html> */
.dark :root {
  --cometchat-primary-color: #7B73FF;
  --cometchat-background-color-01: #1A1A2E;
  --cometchat-text-color-primary: #E0E0E0;
}

/* OR if the project uses data-theme="dark" on <html> (common with Tailwind CSS v4) */
[data-theme="dark"] :root {
  --cometchat-primary-color: #7B73FF;
  --cometchat-background-color-01: #1A1A2E;
  --cometchat-text-color-primary: #E0E0E0;
}

/* OR for Tailwind's `class` strategy with `darkMode: 'class'` in tailwind.config */
html.dark {
  --cometchat-primary-color: #7B73FF;
  --cometchat-background-color-01: #1A1A2E;
  --cometchat-text-color-primary: #E0E0E0;
}
```

**How to tell which selector the project uses:**

| Library / setup | Selector to target |
|---|---|
| `next-themes` (Next.js default) | `.dark` on `<html>` |
| Tailwind with `darkMode: 'class'` | `html.dark` (or `.dark` on any ancestor) |
| Tailwind with `darkMode: 'media'` | Matches `@media (prefers-color-scheme: dark)` — use Strategy A |
| Tailwind CSS v4 (`@custom-variant dark`) | `[data-theme="dark"]` by default |
| Radix UI / shadcn defaults | `.dark` class on `<html>` |
| Custom React Context (`useTheme()` hook) | Check what the context writes to the DOM — usually a class on `<html>` or `<body>` |

**Rule:** whichever selector is toggled by the app's theme system, use that same selector as the CometChat override's parent. The UI Kit components sit inside the app's DOM, so they inherit whatever variable values are active at the nearest matching scope.

**Do not** emit both Strategy A and Strategy B in the same stylesheet unless the user explicitly wants "follow OS except when app toggle is set." That's a legitimate pattern but usually over-engineered for a first integration — ship Strategy B alone if the project has a toggle, Strategy A if it doesn't.

### Why Astro is different

Astro's `client:only="react"` islands run in isolation — global
stylesheets in `.astro` layouts do not cascade into them. CSS variable
overrides in a global `.css` file will have no effect on CometChat
components. The overrides must live **inside the React island `.tsx`
file** (typically `src/cometchat/ChatApp.tsx`), as an inline `<style>`
tag or a CSS import within the component.

---

## 2. Use this skill when

The user wants to customize the look and feel of an already-integrated
CometChat UI. Trigger phrases:

- `/cometchat theming`, `/cometchat theme`
- "match my brand colors"
- "make cometchat dark mode"
- "change the chat colors"
- "customize the cometchat ui"
- "the chat doesn't match my design system"

## 3. Preconditions

The project must already have a CometChat integration. Check by looking
for `.cometchat/config.json` and the UI Kit dependency:

```bash
test -f .cometchat/config.json && cat package.json | grep "@cometchat/chat-uikit-react"
```

If neither is present, **stop** and tell the user to run `/cometchat`
to create an integration first. Theming requires the provider +
`css-variables.css` import to already be in place.

## 4. When to use which path

| Situation | Path |
|---|---|
| Complete, opinionated theme fast | **Path A** — Preset |
| Brand color hex (and optionally font/radius) | **Path B** — Brand color |
| Existing Tailwind config or CSS custom properties | **Path C** — Design system extraction |

---

## 5. Preset values

Five built-in presets. All values are in the table below — write them
directly into the override CSS; do **not** try to call a CLI for this.

| Preset | `--cometchat-primary-color` | `--cometchat-text-color-primary` | `--cometchat-background-color-01` | `--cometchat-font-family` | `--cometchat-radius-2` | Dark mode included |
|---|---|---|---|---|---|---|
| `slack` | `#611f69` | `#1d1c1d` | `#ffffff` | `Lato, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | `8px` | no |
| `whatsapp` | `#25d366` | `#111b21` | `#f0f2f5` | `'Segoe UI', Helvetica, Arial, sans-serif` | `12px` | no |
| `imessage` | `#007aff` | `#000000` | `#ffffff` | `-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif` | `18px` | no |
| `discord` | `#5865f2` | `#dcddde` | `#36393f` | `'gg sans', 'Noto Sans', Helvetica, Arial, sans-serif` | `8px` | **yes** |
| `notion` | `#2eaadc` | `#37352f` | `#ffffff` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif` | `6px` | no |

## 6. Where to write the overrides

Target file is determined by `framework` in `.cometchat/config.json`:

| Framework | Target file |
|---|---|
| `reactjs` | `src/index.css` (append `:root { ... }` block after the existing import) |
| `nextjs` | `src/app/globals.css` (App Router) or `styles/globals.css` (Pages Router) |
| `react-router` | `app/app.css` (or `src/index.css` if you used a Vite-style structure) |
| `astro` | Inline `<style>` tag or imported CSS **inside** `src/cometchat/ChatApp.tsx` (see section 1 for why) |

The override block must be written **after** the existing
`@cometchat/chat-uikit-react/css-variables.css` import so it takes
precedence. If the project imports the CometChat CSS in a TSX file
(e.g. `src/main.tsx`), the override can still live in the adjacent
`index.css` because it appears in the DOM after the JS import resolves.

## 7. Steps

### Step 1 — Ask what theme source to use

If the user already specified a preset name, brand color, or pointed
to a design system file, skip to Step 2.

Otherwise use `AskUserQuestion`:
- **question:** "How do you want to theme CometChat?"
- **header:** "Theme"
- **multiSelect:** false
- **options:**
  1. label: "Use a preset", description: "Pick one of: slack, whatsapp, imessage, discord, notion."
  2. label: "Match my brand", description: "Give me your primary brand color (hex). I'll also ask about font and radius."
  3. label: "Match my existing design system", description: "Point me at your tailwind.config.{js,ts} or your CSS variables file. I'll extract the tokens."

### Step 2 — Build the override block

**Path A — Preset:** Look up the preset in section 5's table. Emit a
`:root { ... }` block with those five variables. If the preset's
`Dark mode included` column is "yes" (currently just `discord`),
also emit a `@media (prefers-color-scheme: dark) { :root { ... } }`
block with sensible dark variants (invert background to dark, text to
light, keep primary).

**Path B — Custom brand color:** The user gave you a hex (e.g.
`#853953`). Emit at minimum:

```css
:root {
  --cometchat-primary-color: #853953;
}
```

Then ask if they want:
- a matching font family (defaults to the project's existing font
  stack from `body { font-family: ... }` in the project's main CSS)
- a border radius (defaults to `8px`)
- dark mode variants

### Step 3 — Read the current CSS file

Read the target file (see section 6) so you can append to it instead
of overwriting existing rules. Check the file doesn't already have a
`--cometchat-primary-color` line — if it does, you're updating an
earlier theming pass; replace that block rather than duplicating.

### Step 4 — Write / update the override block

Use `Edit` to insert or replace the `:root` block. Keep it grouped and
commented so the user can see where their theme lives:

```css
/* CometChat theme override — edit these to change the chat UI */
:root {
  --cometchat-primary-color: #853953;
  --cometchat-font-family: "Inter", sans-serif;
}
```

**Path C — Design system extraction:** Read
`tailwind.config.{js,ts}` (look for `theme.colors.primary`,
`theme.colors.background`, `theme.fontFamily.sans`,
`theme.borderRadius`) or the project's root CSS file (look for
`--primary`, `--background`, etc.). Extract the tokens. Then use
Path B's block shape with the extracted values.

### Step 5 — Save the choice to config

```bash
npx @cometchat/skills-cli config set theme "<preset-or-custom>"
```

Where `<preset-or-custom>` is the preset name (e.g. `slack`) or
`custom` for Path B / Path C.

### Step 6 — Tell the user to restart the dev server

The theme is applied. Tell the user:
1. Restart the dev server (CSS changes need a fresh reload)
2. Refresh the chat page
3. Verify the colors match their design

If the theme doesn't appear to apply:
- Double-check the override block is **after** the css-variables.css
  import in the DOM order
- For Astro: confirm the override is inside the `.tsx` island, not a
  global `.css` file
- Route to `cometchat-troubleshooting` for deeper triage.

## 8. Extended variable list (reference)

Beyond the five "headline" variables in the preset table, common ones
worth knowing:

| Variable | What it controls |
|---|---|
| `--cometchat-primary-color` | Active message bubble, primary buttons, brand accents |
| `--cometchat-text-color-primary` | Main body text |
| `--cometchat-text-color-secondary` | Timestamps, muted labels |
| `--cometchat-background-color-01` | Main app background |
| `--cometchat-background-color-02` | Panels (conversation list, details sidebar) |
| `--cometchat-background-color-03` | Hover / selected states |
| `--cometchat-border-color-light` | Dividers between rows |
| `--cometchat-font-family` | All text |
| `--cometchat-radius-2` | Medium radius (bubbles, buttons) |
| `--cometchat-radius-3` | Larger radius (panels) |

For the full 200+ list, query the docs MCP (see below) or read
`node_modules/@cometchat/chat-uikit-react/dist/styles/css-variables/css-variables.css`.

## 9. Docs MCP contract

The CometChat docs MCP at `cometchat-docs` is the canonical source for:

- The full CSS variable list (200+ tokens) with descriptions
- Component-level styling selectors (`.cometchat-message-bubble-outgoing`,
  `.cometchat-conversations-header`, etc.)
- Dark mode patterns beyond the simple invert
- Font / radius / spacing token names

**When to use it:**
- Component-level overrides beyond the 10 tokens above (e.g., "make
  incoming bubbles green" needs a specific selector) — query the docs
  MCP. Never invent CSS class names from memory.
- If the docs MCP is not installed and the user asks for this, tell
  them: "I need the CometChat docs MCP for component-level styling.
  Install it with `claude mcp add --transport http cometchat-docs
  https://www.cometchat.com/docs/mcp` and re-run."

**Canonical reference URL:**
https://www.cometchat.com/docs/ui-kit/react/theme

## Hard rules

- **Do NOT call `cometchat apply-theme`.** It's a v2 CLI command that
  requires a CLI-generated `.cometchat/state.json` and fails on v3
  AI-written integrations. Write CSS directly instead.
- Never apply theming to a project without an existing CometChat
  integration (no `.cometchat/config.json` = no integration).
- Always write theme overrides **after** the css-variables.css import.
- Never invent CSS variable names. Use the preset table (section 5),
  the common-variables table (section 8), or query the docs MCP.
- Never edit `node_modules` or vendor files.
- Astro is special: theme overrides must live inside the `.tsx`
  React island file, not a global `.css`.
- Always use `npx @cometchat/skills-cli` for config saves.
