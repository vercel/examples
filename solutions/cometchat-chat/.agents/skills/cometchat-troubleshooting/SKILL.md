---
name: cometchat-troubleshooting
description: Diagnose and fix problems with a CometChat integration. Runs verify checks, detects drift, queries the docs MCP for symptom-to-cause lookups, and proposes targeted fixes. Works on any state — broken, missing, or drifted integrations.
license: "MIT"
compatibility: "Node.js >=18; @cometchat/chat-uikit-react ^6"
allowed-tools: "executeBash, readFile, fileSearch, listDirectory, grepSearch"
metadata:
  author: "CometChat"
  version: "3.0.0"
  tags: "cometchat troubleshooting fix diagnose verify drift errors doctor"
---

> **Companion skills:** `cometchat-core` is the authoritative source for
> correct init, login, and provider patterns; `cometchat-customization`
> explains why drift after customization is expected;
> `cometchat-theming` covers the CSS variable cascade for
> theme-not-applying symptoms.

## Purpose

This skill teaches Claude how to diagnose CometChat integration problems
systematically. It explains what each diagnostic tool checks, what the
known failure modes are and why they happen, and how to distinguish
infrastructure problems (env vars, dashboard config, network) from code
problems (wrong init sequence, missing CSS import, drift).

---

## 1. Use this skill when

The user has a problem with their CometChat integration. Trigger phrases:

- `/cometchat troubleshoot`
- `/cometchat fix`
- `/cometchat fix <symptom>`
- "chat isn't loading"
- "i'm getting a cometchat error"
- "the chat is broken"
- "blank screen on /chat"
- "401 Unauthorized from cometchat"
- "css-variables not loading"
- "the chat doesn't show messages"

## 2. Docs MCP contract

The CometChat docs MCP at `cometchat-docs` is a **hard requirement** for
this skill. `cometchat doctor` handles the local diagnostic checks
(integration state, drift, env vars, AST verify rules), but for any
symptom that doesn't match a doctor known-issue code, the MCP is the
canonical source for symptom → cause → fix.

**Hard rules:**

1. **Always run `cometchat doctor` first** — its known-issues table
   covers the common failure modes (env-placeholder, env-missing, drift,
   init-before-login, no-auth-key-in-source).
2. **For symptoms NOT in doctor's table**, query the docs MCP with the
   exact error message or symptom keywords. Never guess at the cause.
3. **If the docs MCP is not installed**, STOP. Tell the user: "Doctor
   didn't recognize this symptom and I need the CometChat docs MCP to
   diagnose further. Install it with `claude mcp add --transport http
   cometchat-docs https://www.cometchat.com/docs/mcp` and re-run."
4. **Never blame the user's code** if doctor + MCP both pass — the issue
   is probably infrastructure (network, dashboard config, auth provider).
5. **Canonical reference URL:**
   https://www.cometchat.com/docs/ui-kit/react/troubleshooting

---

## 3. What `cometchat doctor` actually checks

Understanding what doctor checks helps you interpret its output and
know when to look beyond it:

1. **Detection** — reads `.cometchat/state.json` to confirm an
   integration exists. If absent, reports `integrated: false`.

2. **Env var checks** — reads the framework's env file (`.env` for
   Vite/Astro/React Router, `.env.local` for Next.js). Checks each
   `COMETCHAT_*` variable for:
   - Presence (key exists in the file)
   - Placeholder sentinels (`YOUR_*_HERE` still present = warning)

3. **AST verify** — parses owned TypeScript files and runs 5 checks:
   - `css_variables_imported_once` — counts
     `@cometchat/chat-uikit-react/css-variables.css` imports (must be
     exactly 1)
   - `init_before_login` — confirms `login()` call sites appear after
     `init()` resolves (in a `.then()` chain or after `await`)
   - `render_gated_on_login_resolve` — checks that `createRoot().render()`
     or JSX is not called at module top level before init completes
   - `no_auth_key_in_source` — searches string literals for patterns
     matching auth key format (should be in `.env`, not source)
   - `error_ui_visible_on_failure` — confirms that catch handlers set
     state variables that render visible error UI

4. **Drift detection** — checksums each file in `state.files_owned`
   against the originally applied template. Reports modified or missing
   files.

**When to go beyond doctor:** doctor passes but the app still shows a
blank screen → likely SSR, network, or dashboard config. Doctor only
checks local code and env files.

---

## 4. Steps

### Step 1 — Triage: read the project state

```bash
npx @cometchat/skills-cli info --json
```

Three possible outcomes:

| `info` says | Diagnosis | Next step |
|---|---|---|
| `integrated: false` | No integration exists | Check for **partial state** (below). If none, tell user to run `/cometchat` first and stop. |
| `integrated: true, drift.has_drift: true` | User edited owned files | Step 2 + flag the drift |
| `integrated: true, drift.has_drift: false` | Clean integration but something is broken | Step 2 |

If drift is detected, surface the modified file list verbatim. **Do not
automatically offer to restore** — drift after using
`cometchat-customization` is expected and correct. Ask the user whether
the changes were intentional before suggesting any restore.

### Step 1a — Partial-state recovery (aborted /cometchat runs)

`info` returning `integrated: false` doesn't always mean the project is
clean. `/cometchat` may have been started, errored out, or been
interrupted mid-flow, leaving the project in an inconsistent half-state.
Check these markers in parallel before offering to re-run from scratch:

```bash
# All four of these can exist independently after a partial run
test -f .cometchat/config.json && cat .cometchat/config.json
grep -l "COMETCHAT_APP_ID" .env .env.local 2>/dev/null
find src app -name "CometChatProvider.*" -o -name "ChatDrawer.*" 2>/dev/null
grep -rln "@cometchat/chat-uikit-react" src app 2>/dev/null | head -5
```

Interpret the combination:

| Markers present | Likely state | Recovery |
|---|---|---|
| config.json exists, no `COMETCHAT_APP_ID` in env | Onboarding was started but app provisioning didn't finish | Re-run the provision step only: `npx @cometchat/skills-cli provision setup --app-id <id> --framework <k>` (or `--name <n>` for a new app) |
| env has credentials, no config.json | Credentials were pasted manually but integration wasn't recorded | Run `npx @cometchat/skills-cli config init --json` to regenerate config.json from detect + env |
| Provider/drawer files written, no CSS import, no provider mount | Integration code was partially written | Ask user whether to finish the integration (route through `/cometchat` resuming from the plan step) or delete the partial files and start clean |
| CSS import present, no provider wired | CSS-only leftover from an earlier attempt | Delete the stray `css-variables.css` import or mount the provider — ask user |
| All four present but `info` still says `integrated: false` | `.cometchat/state.json` was never written — the `/cometchat` flow skipped Step 8 (`state record`), so every Phase B command (`info`, `status`, `doctor`, `verify`, `uninstall`, `apply-theme`, etc.) thinks the project is un-integrated | Run `state record` to rebuild the state.json from what's on disk. Read the list of CometChat files the user has, then: `npx @cometchat/skills-cli state record --framework "<fw>" --placement "<type>" --placement-path "<path>" --auth-mode "<mode>" --files-owned "<new-files>" --files-patched "<patched-files-with-patch-id>" --json`. After this, `info` / `status` / `doctor` all work correctly. |

**Rule:** always show the user which markers you found before proposing a
recovery path. Never delete config.json, env entries, or source files
without explicit approval.

### Step 2 — Run verify

```bash
npx @cometchat/skills-cli verify --json
```

This runs the AST checks. The output looks like:

```json
{
  "status": "fail",
  "checks": {
    "css_variables_imported_once": { "status": "fail", "reason": "..." },
    "init_before_login": { "status": "pass" },
    ...
  }
}
```

For each failed check, look up the fix in the table below or via the docs MCP.

### Step 3 — Match symptom to known issues

Common doctor issue codes + verify failures and their fixes:

| Issue code / failed check | Likely cause | Fix |
|---|---|---|
| `env-placeholder` | CometChat env vars still contain `YOUR_*_HERE` sentinels — user ran integration but never filled in real credentials | Open the env file doctor names (`.env` or `.env.local`) and replace each `YOUR_*_HERE` with the real value from https://app.cometchat.com → Your App → API & Auth Keys. This is the most common post-init failure. |
| `env-missing` | A required CometChat env var key isn't in the env file at all | Run `cometchat apply --force-overwrite` to re-emit the placeholders, then fill them in. |
| `drift-modified` | Owned files have been edited since apply | If the user used `cometchat-customization` or hand-edited intentionally, this is **expected** — not a bug. `cometchat info` flags it because the checksum changed. Only offer `cometchat apply --force` if the drift is accidental. **Ask before restoring** — force-apply destroys intentional customizations. |
| `drift-missing` | An owned file was deleted | Run `cometchat apply --force` to recreate the missing file. |
| `css_variables_imported_once` (count=0) | The css-variables.css import was removed | Re-add `@import url("@cometchat/chat-uikit-react/css-variables.css");` to the top of `src/index.css` (or the per-framework target). For Astro, it goes inside the .tsx file, not the global CSS. |
| `css_variables_imported_once` (count>1) | Imported in multiple places | Remove the duplicate. Keep only the one in the canonical location. |
| `init_before_login` | Code calls `CometChatUIKit.login` before `CometChatUIKit.init` resolves | In the provider pattern (Next.js, Astro, React Router SSR): use `await init(settings)` followed by `await login()` sequentially inside `useEffect`. In the entry-file pattern (Vite/CRA): chain `init(settings).then(() => login()).then(() => mount())`. See `cometchat-core` section 6. |
| `render_gated_on_login_resolve` | `createRoot(...).render` is called at top level, not inside a `mount()` function | Wrap render in `mount()` and call it only after `login()` resolves. For React island frameworks, gate render with `if (!user) return null`. |
| `no_auth_key_in_source` | Auth Key hardcoded in a source file | Move it to `.env` and reference via the framework's env prefix (`import.meta.env.VITE_COMETCHAT_AUTH_KEY`, `process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY`, etc.). |
| `error_ui_visible_on_failure` | No visible error state rendered on init/login failure | In the component that calls `init()`/`login()`, add a catch handler that sets an error state, then render: `<div style={{ color: "red", padding: 16 }}>CometChat Error: {error}</div>`. The full pattern is in `cometchat-core` section 6 (CometChatProvider). |

For symptoms not in this table, proceed to Step 4.

### Step 4 — Framework-specific patterns

Many issues are framework-specific. Check against these common patterns:

| Framework | Symptom | Likely cause | Fix |
|---|---|---|---|
| Next.js | Blank screen / hydration mismatch | CometChat components rendered on the server | Add `"use client"` to the file, or use `dynamic(() => import(...), { ssr: false })`. See `cometchat-core` section 5. |
| Astro | Theme not applying | CSS override in a global `.css` file instead of inside the React island | Move `--cometchat-*` overrides inside `src/cometchat/ChatApp.tsx`. See `cometchat-theming` section 1. |
| Astro | Components not rendering | Missing `client:only="react"` directive | Add `client:only="react"` to the island component in the `.astro` file. |
| React Router v7 | `window is not defined` at build | CometChat imported in a module that runs on the server | Wrap in `React.lazy` + `Suspense` with a `ClientOnly` guard. See `cometchat-react-router-patterns` section 3. |
| Vite / CRA | CSS variables not taking effect | Override block appears BEFORE the `@import` of css-variables.css | Reorder: the `@import` must come first, overrides must follow. |
| Any | 401 Unauthorized | Wrong or expired auth key in `.env` | Check `.env` for `YOUR_AUTH_KEY_HERE`. Replace with real value from app.cometchat.com → API & Auth Keys. |
| Any | `CometChat is not initialized` | Component renders before `init()` resolves | Use the provider pattern from `cometchat-core` section 6, or add an `isReady` gate before rendering CometChat components. |
| Any (React 19) | `Cannot update a component (ForwardRef) while rendering a different component` | Known React 19 warning from CometChat UI Kit internals (`closePopover` calls setState during render). **Not a bug in your code.** | Ignore — this is a cosmetic warning from inside the UI Kit's minified bundle. The UI works correctly. Will be fixed in a future UI Kit release. Do NOT try to patch this in user code. |

### Step 5 — Symptom-driven lookup via the docs MCP

If the user has reported a specific symptom that isn't covered by verify
checks or the framework table, query the CometChat docs MCP:

```
Use the cometchat-docs MCP to search for "<symptom keywords>"
```

Common symptom searches:

| Symptom | MCP search query |
|---|---|
| Blank screen at /chat | "blank screen ssr nextjs" or "blank screen react-router" |
| 401 Unauthorized | "401 unauthorized authentication" |
| Chat doesn't load | "chat not loading init login" |
| Build error | "<exact error message from build output>" |
| CORS error | "cors origin allowed" |
| Mixed user/group error | "user group same component" |
| Theme not applying | "theming css variables override" |

The docs MCP returns the canonical fix. Apply it as a targeted patch.

### Step 6 — Propose the fix

Show the user:
1. What's broken (verify output, drift report, or symptom)
2. The likely cause (from the table or docs MCP)
3. The exact fix (file path + content change)
4. Whether to:
   - **Patch the specific issue** — targeted edit to the broken file.
     Preferred for most issues.
   - **Restore from the registry** — `cometchat apply --force` rewrites
     all owned files back to their template state. Safe only if the
     user hasn't customized them. **Ask first.**
   - **Re-run the integration cleanly** — `cometchat uninstall --force`
     followed by `/cometchat`. Wipes state.json and starts over. Last
     resort.

For dashboard/network/auth issues, the fix is on the user's side
(CometChat dashboard, .env values, network connectivity) — `cometchat
doctor` surfaces the issue and the fix verbatim. Don't try to "fix"
infrastructure issues from the CLI.

### Step 7 — Verify the fix

After any fix is applied, re-run:

```bash
npx @cometchat/skills-cli verify --json
```

Confirm `status: "pass"`. If anything is still failing, repeat from Step 2.

## Hard rules

- Never apply a fix without showing the user what will change first.
- Never invent error causes — query the docs MCP if you don't know.
- Never blame the user's code if the verify checks are passing — the issue
  is probably in the docs MCP territory (network, auth, dashboard config).
- For drift, default to **showing** the drift and asking if it was
  intentional, not auto-restoring. Drift after customization is expected.
- Always use `npx @cometchat/skills-cli`.
