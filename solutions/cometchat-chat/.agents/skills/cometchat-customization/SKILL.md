---
name: cometchat-customization
description: Customize a CometChat React UI Kit integration beyond what `cometchat init` and `cometchat apply-feature` produce — custom message bubbles, custom header views, custom subtitle views, custom empty/loading states, custom action menus, request builder filters, event listeners, and component composition. Picks up where the framework skills end (after Phase A init succeeds).
license: "MIT"
compatibility: "Node.js >=18; @cometchat/chat-uikit-react ^6"
allowed-tools: "executeBash, readFile, fileSearch, listDirectory, grepSearch"
metadata:
  author: "CometChat"
  version: "3.0.0"
  tags: "cometchat react customization custom-view message-bubble header-view subtitle-view request-builder events"
---

> **Companion skills:** `cometchat-components` provides the component
> catalog (what exists); this skill provides the customization workflow
> (how to modify what exists). Use `cometchat-components` to look up
> component names and props, then use this skill to plan and execute
> the customization. For any pattern not covered below, the docs MCP
> at `cometchat-docs` is the source of truth — query it before
> generating any code.

## Use this skill when

The user has already run `/cometchat` (Phase A complete — there's a
working integration with `.cometchat/state.json`) and wants to **change
how a component looks or behaves** beyond what the CLI's deterministic
commands handle.

Trigger phrases:
- "customize the message list"
- "filter the conversations to only show X"
- "change the message bubble color/shape/layout"
- "add a custom header above the chat"
- "subscribe to message-received events"
- "show a custom loading state"
- "add a custom action to the message options menu"
- "I want to inject my own UI into CometChatX"
- `/cometchat customize`

## Do not use this skill when

- The user wants to enable a **packaged feature** (calls, polls, AI smart
  replies, etc.) → use `cometchat-features` instead
- The user wants to change **theme tokens** (primary color, font,
  border radius) → use `cometchat-theming` instead — `cometchat
  apply-theme` is deterministic and doesn't need this skill
- The user wants to **start a new integration** → use the `cometchat`
  dispatcher skill to run Phase A first
- The user wants to **fix something broken** → use
  `cometchat-troubleshooting` and run `cometchat doctor`

## Docs MCP contract

This skill is **fundamentally docs-driven** — every customization
question requires a fact (prop name, callback signature, builder method,
event topic, CSS selector) that lives in the canonical CometChat docs,
not in this skill's text. Embedding examples here would create drift
the moment the SDK changes.

The CometChat docs MCP at `cometchat-docs` is a **hard requirement**
for this skill. It's the source of truth for:

- Component prop tables (every component, every prop, every default)
- Custom view slots: `headerView`, `subtitleView`, `tailView`,
  `optionsView`, `bubbleView`, `emptyStateView`, `loadingStateView`,
  `errorStateView` (which components support which slots)
- Message template overrides (`CometChatMessageTemplate.type`,
  `category`, `contentView`, `headerView`, `footerView`)
- Request builders for filtering data: `ConversationsRequestBuilder`,
  `MessagesRequestBuilder`, `UsersRequestBuilder`, `GroupsRequestBuilder`,
  `CallLogsRequestBuilder` and their methods
- SDK events: `CometChatMessageEvents`, `CometChatUserEvents`,
  `CometChatGroupEvents`, `CometChatCallEvents`, `CometChatUIEvents`
  and the topic names
- CSS selectors for component-level styling overrides
  (`.cometchat-message-bubble-incoming`, `.cometchat-conversations-header`,
  etc.)

**Hard rules:**

1. **Always query the docs MCP first** before generating any
   customization code. Never invent prop names, builder methods, event
   topics, or CSS classes from training-data memory.
2. **If the docs MCP is not installed**, STOP. Tell the user:
   "Customization needs the CometChat docs MCP because every prop +
   builder + event signature is canonical. Install it with
   `claude mcp add --transport http cometchat-docs https://www.cometchat.com/docs/mcp`
   and re-run."
3. **Prefer composition (custom view props) over CSS overrides** when
   both are options — composition is more stable across SDK versions.
4. **Canonical reference URLs:**
   - Components overview: https://www.cometchat.com/docs/ui-kit/react/components-overview
   - Theming + styling: https://www.cometchat.com/docs/ui-kit/react/theme
   - Events: https://www.cometchat.com/docs/ui-kit/react/events
   - Methods: https://www.cometchat.com/docs/ui-kit/react/methods

## Steps

### Step 1 — Verify Phase A is done

```bash
npx @cometchat/skills-cli info --json
```

If `integrated` is `false`, **stop** and tell the user to run
`/cometchat` first to create the base integration. Customization
modifies an existing integration; it doesn't create one.

Note the `framework`, `experience`, `files_owned`, and `applied_features`
from the response — you'll need them in the next steps.

### Step 2 — Four-tier discovery: existing-component prop, new component, stylesheet, sample app

> **START HERE:** Read the **component catalog** at
> `references/component-catalog.md` (in this skill's directory). It has
> the canonical list of all 88 exported symbols, all 14 sample-app
> patterns, and a 40-row task→component lookup table. If the user's
> request maps to an entry in the catalog, use that entry directly —
> skip the rest of this step.

**If the catalog doesn't have a match (or you need prop-level detail),
walk these FOUR discovery checks in this exact order:**

1. **Existing-component prop check (2a):** does a component the
   integration ALREADY mounts have a prop that does what the user is
   asking for? **The kit follows a "props over components" philosophy
   — most additions are props on existing components, not new
   components.** This check goes FIRST.
2. **New-component check (2b):** if 2a turned up nothing, is there a
   built-in `CometChat<X>` component in `@cometchat/chat-uikit-react`'s
   exports?
3. **Stylesheet check (2c):** is there a `--cometchat-<x>` CSS
   variable for any styling you'd write?
4. **Sample app check (2d):** is there a reference implementation in
   the sample app at
   `github.com/cometchat/cometchat-uikit-react/tree/v6/sample-app/src/components`
   for the user's pattern?

The CometChat React UI Kit ships FOUR things, not one:
- A "props over components" API where most features (search bar,
  filters, custom views, click handlers, disable flags) are PROPS on
  existing components — NOT new components
- 60+ named React components in the npm package
- A 200+ CSS variable system at
  `@cometchat/chat-uikit-react/css-variables.css`
- A reference sample app on GitHub with implementations for common
  chat UX patterns (user/group details, threaded messages layout,
  top-level home layout, multi-tab chat, notifications, new chat
  dialog, etc.) that combine multiple kit components but aren't
  shipped as single named exports

**Critical:** the docs MCP does NOT index the sample app. When the MCP
says *"no `CometChat<X>` component exists"*, that only covers the npm
package — you must still check the sample app via GitHub before
concluding the user needs hand-rolled code.

Hand-rolling something the kit, the variable system, OR the sample
app already provides means missing the kit's theming, accessibility,
i18n, error handling, and every future SDK update.

#### 2a. Existing-component prop check (do this FIRST)

**Most chat features are already props on the components you have.**
A user asking for "add search", "filter conversations", "custom empty
state", or "click handler on a message" is almost always asking for a
prop, not a new component or custom code.

**Process:**

1. **List the CometChat components currently mounted in the
   integration.** Read the integration's owned files (from
   `state.json`) and grep for `<CometChat` JSX usage:
   ```bash
   grep -hoE '<CometChat[A-Z][a-zA-Z]*' \
     $(jq -r '.files_owned[]' .cometchat/state.json 2>/dev/null) \
     2>/dev/null | sort -u
   ```
2. **Query the docs MCP for the props of each mounted component:**
   - `"CometChatConversations props"`
   - `"CometChatMessageList props"`
   - `"CometChatMessageHeader props"`
   - `"CometChatMessageComposer props"`
3. **Look for a prop that maps to the user's intent.** Common
   mappings:

| User asks for | Likely prop on which component |
|---|---|
| Search bar / "add search" | `showSearchBar` on `CometChatConversations` (or `onSearchBarClicked` to swap in `<CometChatSearch>` for advanced dual-scope search) |
| Filter conversations | `conversationsRequestBuilder` on `CometChatConversations` |
| Filter messages | `messagesRequestBuilder` on `CometChatMessageList` |
| Filter users / groups | `usersRequestBuilder` / `groupsRequestBuilder` |
| Custom empty state | `emptyStateView` on most list components |
| Custom error UI | `errorStateView` |
| Custom loading UI | `loadingStateView` |
| Custom header above the list | `headerView` |
| Custom message bubble | `templates` prop on `CometChatMessageList` (not a custom bubble component) |
| Click handler on item / message / search bar / back button | `onItemClick`, `onMessageClick`, `onBack`, `onSearchBarClicked` |
| Hide / disable a sub-feature | `disable*` boolean props (e.g. `disableTyping`, `disableReactions`) |
| Custom subtitle / status / timestamp | `subtitleView`, `statusView`, `timestampView` |
| Show / hide receipts | `hideReceipts` |
| Selection mode | `selectionMode` on list components |

If you find a matching prop, **just add the prop and stop**. No new
components. No custom CSS. No new files. Surface to the user: *"The
`<X>` you already have supports this via the `<propName>` prop. Adding
that single prop."*

If 2a turns up nothing, proceed to 2b.

#### 2b. New-component check (do this only if 2a turned up nothing)

**Common requests that look like "customization" but are actually
"use the existing component":**

| User asks for | Use this built-in component |
|---|---|
| Threaded replies / "wire up threads" | `CometChatThreadHeader` + scope a `CometChatMessageList` and `CometChatMessageComposer` with `parentMessageId` |
| Group members panel / "list group members" | `CometChatGroupMembers` |
| Add members to a group | `CometChatAddMembers` |
| Transfer group ownership | `CometChatTransferOwnership` |
| Banned users management | `CometChatBannedMembers` |
| Block/unblock users panel | `CometChatBlockedUsers` |
| New chat / "start a new conversation" dialog | `CometChatNewChat` |
| Create new group dialog | `CometChatCreateGroup` |
| User / group details panel | `CometChatDetails` |
| Mentions popover in composer | `CometChatMentionsFormatter` (already wired into the composer) |
| Voice / video call buttons in header | `CometChatCallButtons` |
| Outgoing call screen | `CometChatOutgoingCall` |
| Incoming call notification | `CometChatIncomingCall` |
| Ongoing call UI | `CometChatOngoingCall` |
| Call logs list | `CometChatCallLogs` |
| Reactions on messages | Already built into `CometChatMessageList` — check if it's just disabled |
| Message bubble customization | Use the `templates` prop on `CometChatMessageList`, not a custom bubble component |

**Search strategies, in this order:**

1. **Query the docs MCP** with the user's intent in plain English.
   Examples:
   - `"thread reply UI react ui kit"` → finds `CometChatThreadHeader`
   - `"new chat dialog"` → finds `CometChatNewChat`
   - `"group transfer ownership"` → finds `CometChatTransferOwnership`
   - `"block user list"` → finds `CometChatBlockedUsers`
2. **Grep the user's installed package** for matching exports:
   ```bash
   grep -E "^export.*CometChat[A-Z][a-zA-Z]+" \
     node_modules/@cometchat/chat-uikit-react/dist/index.d.ts \
     2>/dev/null | head -50
   ```
3. **Browse the v6 components reference** at
   https://www.cometchat.com/docs/ui-kit/react/components-overview

If you find a built-in component that matches, **use it as-is**.
Surface to the user: *"The kit already ships `CometChat<X>` for this.
I'll wire it up directly."*

#### 2c. Stylesheet check (do this even when you DO need custom layout glue)

Even when you have to write some CSS for layout glue (positioning a
panel, sizing a container, wiring up the height chain that
`.cometchat-message-list` requires), **never hand-pick colors, fonts,
borders, spacings, or radii from your head**. The kit ships a
canonical CSS variable system. Use it.

**The rule:**
- ✅ **OK:** custom CSS for layout glue (positioning, sizing, flex
  containers, the height chain). Example: `.thread-wrapper { width:
  400px; height: 100vh; display: flex; flex-direction: column; }`
- ✅ **OK:** custom CSS that consumes kit variables. Example:
  `.thread-wrapper { border-left: 1px solid var(--cometchat-border-color-light); background: var(--cometchat-background-color-01); }`
- ❌ **NOT OK:** custom CSS for any header / button / icon / panel /
  badge / divider that the kit already provides as a component.
  Example: a hand-rolled `.thread-header` + `.thread-close` button when
  `CometChatThreadHeader` exists.
- ❌ **NOT OK:** hardcoded colors / fonts / borders / radii / spacings
  that don't reference the `--cometchat-*` variables. Example:
  `border: 1px solid #E8E8E8` instead of
  `border: 1px solid var(--cometchat-border-color-light)`.

**Discovery commands for the variable system:**
```bash
# List every --cometchat-* variable the kit defines
grep -oE '\-\-cometchat-[a-z0-9-]+' \
  node_modules/@cometchat/chat-uikit-react/css-variables.css \
  2>/dev/null | sort -u | head -60

# Or search for a specific token category
grep -E '\-\-cometchat-(border|background|text|primary|font)' \
  node_modules/@cometchat/chat-uikit-react/css-variables.css \
  2>/dev/null | head -40
```

**Common variable categories** (query the docs MCP for the canonical
list — these change between SDK versions):

| Category | Example variables |
|---|---|
| Brand colors | `--cometchat-primary-color`, `--cometchat-error-color`, `--cometchat-success-color` |
| Backgrounds | `--cometchat-background-color-01` (white), `--cometchat-background-color-02`, `--cometchat-background-color-03` (light grey) |
| Text | `--cometchat-text-color-primary`, `--cometchat-text-color-secondary`, `--cometchat-text-color-tertiary` |
| Borders | `--cometchat-border-color-light`, `--cometchat-border-color-default`, `--cometchat-border-color-dark` |
| Radii | `--cometchat-radius-1`, `--cometchat-radius-2`, `--cometchat-radius-3`, `--cometchat-radius-max` |
| Fonts | `--cometchat-font-heading1-bold`, `--cometchat-font-heading4-medium`, `--cometchat-font-body-regular`, `--cometchat-font-caption2-regular` |
| Spacing | `--cometchat-spacing-1` through `--cometchat-spacing-10` |
| Shadows | `--cometchat-shadow-1`, `--cometchat-shadow-2`, `--cometchat-shadow-3` |

#### 2d. Sample app reference check (do this when 2a + 2b turned up nothing)

If 2b didn't find a `CometChat<X>` component for the user's request,
**don't immediately conclude they need custom code**. The kit ships a
**reference sample app** at:

> https://github.com/cometchat/cometchat-uikit-react/tree/v6/sample-app/src/components

with implementations for common chat UX patterns that combine multiple
kit components but aren't shipped as single named exports. Examples
that look like "missing components" but are in the sample app:

| User asks for | Sample app reference path |
|---|---|
| User / group details panel | `sample-app/src/components/CometChatDetails/CometChatUserDetails.tsx` (group details is inline in `CometChatHome.tsx`'s `SideComponentGroup`) |
| Threaded messages panel layout | `sample-app/src/components/CometChatDetails/CometChatThreadedMessages.tsx` |
| Top-level chat layout (left pane + main + side rail) | `sample-app/src/components/CometChatHome/CometChatHome.tsx` |
| Multi-tab chat (Chats / Calls / Users / Groups) | `sample-app/src/components/CometChatSelector/CometChatTabs.tsx` |
| New conversation dialog with user/group picker | Inline in `CometChatHome.tsx` as `CometChatNewChatView` (CSS: `sample-app/src/styles/CometChatNewChat/CometChatNewChatView.css`) |
| Search view (conversations + messages) | `sample-app/src/components/CometChatSearchView/` |
| Call log details / history / recordings | `sample-app/src/components/CometChatCallLog/` (5 sub-files: Details, History, Info, Participants, Recordings) |
| App state / active-chat React context | `sample-app/src/context/AppContext.jsx` + `appReducer.ts` |
| Group ownership transfer modal | `sample-app/src/components/CometChatTransferOwnership/` |

These patterns include matching CSS at
`sample-app/src/styles/<ComponentName>/` using BEM-style class names
that are already wired to the kit's CSS variable system.

**Discovery commands:**

```bash
# List the sample app's components directory via the GitHub API
curl -s "https://api.github.com/repos/cometchat/cometchat-uikit-react/contents/sample-app/src/components?ref=v6" \
  | grep -oE '"name":\s*"[^"]+"' | head -30

# Fetch a specific component file directly
curl -s "https://raw.githubusercontent.com/cometchat/cometchat-uikit-react/v6/sample-app/src/components/CometChatDetails/CometChatUserDetails.tsx"

# Fetch its matching stylesheet
curl -s "https://raw.githubusercontent.com/cometchat/cometchat-uikit-react/v6/sample-app/src/styles/CometChatDetails/CometChatUserDetails.css"
```

You can also use WebFetch on the URLs above. The docs MCP does NOT
index the sample app — you must fetch it from GitHub directly.

**If you find a matching reference implementation:**

1. Read BOTH the `.tsx` file AND its matching `.css` file (at
   `sample-app/src/styles/<ComponentName>/`)
2. Mirror the sample app's file/folder structure in the user's project,
   e.g. `src/cometchat/CometChatDetails/CometChatUserDetails.tsx` plus
   `src/cometchat/CometChatDetails/CometChatDetails.css`
3. Match the **exact BEM class names** from the sample
   (`.cometchat-user-details__header`,
   `.cometchat-user-details__content-avatar`, etc.) — they're already
   integrated with the kit's CSS variable system
4. Strip the sample app's local dependencies that the user's project
   doesn't have:
   - `useContext(AppContext)` → inline the values
   - `getLocalizedString(...)` → inline the English strings
   - `cometchat-resources/` SVG icons → use Unicode equivalents or
     strip them
5. Tell the user: *"The kit doesn't export this as a single component,
   but the official sample app has the reference implementation at
   `cometchat/cometchat-uikit-react/v6/sample-app/.../CometChat<X>`.
   I'm adapting it to your project."*

#### 2e. After discovery — decide what to do

In strict order, take the FIRST option that applies:

1. **An existing component prop matches (2a):** add the prop. Done.
   No new files. Most chat features land here.
2. **A new component matches (2b) AND has its own styling:** use the
   component as-is. Zero custom CSS.
3. **A new component matches (2b) but you need layout glue:** use the
   component; write minimal layout-only CSS that consumes
   `--cometchat-*` variables (per 2c).
4. **Sample app has a reference implementation (2d):** adapt the
   sample app pattern, mirroring its file structure and BEM class
   names.
5. **None of the above:** then (and only then) proceed to Step 3 to
   classify the request as a true customization.

### Step 3 — Classify the customization

Read the user's request and place it into one of these buckets. The
right approach is different per bucket:

| Bucket | Examples | Approach |
|---|---|---|
| **A. Custom view slot** | "add a custom header above the conversation list", "show a custom empty state", "render messages with my own bubble" | Use the corresponding `*View` prop (`headerView`, `emptyStateView`, `bubbleView`, etc.) — query the MCP for which prop the target component supports |
| **B. Filter / pagination** | "only show conversations with VIP users", "load 10 messages at a time", "show only joined groups" | Use the corresponding RequestBuilder (`ConversationsRequestBuilder.setTags`, `setLimit`, `setUserAndGroupTags`, etc.) — query the MCP for the builder methods |
| **C. Action / callback** | "do X when a user clicks a conversation", "intercept message send", "log every search" | Use the corresponding `on*` callback prop (`onItemClick`, `onSendButtonClick`, `onSearch`, etc.) — query the MCP for the callback signature |
| **D. Event subscription** | "show a toast when a new message arrives", "update my unread count when someone reads a message", "track typing indicators" | Subscribe to the corresponding `CometChat*Events` topic (`CometChatMessageEvents.ccMessageSent`, `ccMessageRead`, `CometChatUserEvents.ccUserOnline`, etc.) — query the MCP for the event topic |
| **E. Component-level CSS** | "make incoming bubbles green", "hide the conversation timestamps", "compact the message list spacing" | Add a CSS rule under `.cometchat <selector>` in the integration's global stylesheet — query the MCP for the right selector class. NEVER invent class names; the SDK's selectors are namespaced and prefix-protected. |
| **F. Component composition** | "wrap CometChatConversations with my own search bar", "render two CometChatGroups side by side", "embed CometChatMessageList inside my own card layout" | Standard React composition. The CometChat components are React components — use them like any other component. Query the MCP for which props are required vs optional. |

If the user's request doesn't fit any bucket, **ask them to clarify** —
don't guess. Customization is the place where ambiguous requests
produce wrong code most often.

### Step 4 — Query the docs MCP for the canonical pattern (only if Step 2 turned up nothing)

Once you've classified the request, query the docs MCP with a specific
search:

| Bucket | MCP query example |
|---|---|
| A. Custom view slot | "headerView prop CometChatConversations" |
| B. Filter / pagination | "ConversationsRequestBuilder methods setTags" |
| C. Action / callback | "CometChatMessageList onMessageClick callback signature" |
| D. Event subscription | "CometChatMessageEvents ccMessageSent subscribe" |
| E. Component-level CSS | "CSS selector cometchat-message-bubble-incoming" |
| F. Component composition | "CometChatConversations props required" |

The MCP returns canonical, current docs. Read them BEFORE writing any
code. If multiple results come back, prefer the React UI Kit v6 result
over older versions.

### Step 5 — Identify the file to modify

Use the framework + experience you noted in Step 1 to find the right
file. The integration's primary client file is conventional per
framework:

| Framework | Primary client file |
|---|---|
| reactjs (Vite) | `src/App.tsx` (renders the conversation list / messages) + `src/cometchat/CometChatSelector.tsx` (the selector) |
| nextjs (App Router) | `src/app/cometchat/CometChatNoSSR.tsx` (renders the chat) + `src/app/cometchat/CometChatSelector.tsx` (the selector) |
| nextjs (Pages Router) | `src/cometchat/CometChatNoSSR.tsx` + `src/cometchat/CometChatSelector.tsx` |
| react-router (v6 + v7) | `app/cometchat/CometChatNoSSR.tsx` + `app/cometchat/CometChatSelector.tsx` |
| astro | `src/cometchat/ChatApp.tsx` (the React island) + `src/cometchat/CometChatSelector.tsx` |

For CSS overrides (bucket E), the global stylesheet is:
- reactjs → `src/index.css`
- nextjs (App Router) → `src/app/globals.css`
- nextjs (Pages Router) → `src/styles/globals.css`
- react-router → `app/app.css`
- astro → inside `src/cometchat/ChatApp.tsx` (NOT a global stylesheet)

These are also in `state.json` under `files_owned` if you need to verify.

### Step 6 — Write the customization

Generate the code based on the docs MCP response from Step 4. Show the
user:

1. **What you're going to change** (which file, which lines, the new
   code)
2. **Why** (which prop/builder/event the docs say to use)
3. **A preview of the diff** (just the changed region, not the whole
   file)

**Wait for the user to confirm** before writing. Customization edits
the integration's owned files — drift detection will show this on the
next `cometchat info`. The user should know.

If the user confirms, write the change. If they don't, surface what
they'd want to change and stop.

### Step 7 — Verify

```bash
npx @cometchat/skills-cli verify --json
```

The 5 AST checks still apply to customized files. If anything fails,
surface verbatim and offer to revert.

```bash
npx @cometchat/skills-cli info --json
```

The customized file will now show as drifted (its checksum no longer
matches the original template). This is expected — it's the
**explicit** drift the user just asked for. Not a bug.

### Step 8 — Tell the user what to do next

The dev server picks up React changes via HMR. Tell the user:
1. Save the file (if their editor doesn't auto-save)
2. Refresh the browser tab
3. Test the customization

Then offer to do another customization OR to return to the framework
skill's Phase B menu.

## Hard rules

- **Always do the FOUR-tier discovery before adding any new component
  or hand-rolled UI.** The kit follows a "props over components"
  philosophy and ships FOUR things, not one:
  (0) **props** on already-mounted components for most features
      (search bar, filters, custom views, click handlers, disable
      flags) — check this FIRST,
  (1) 60+ named React components in `@cometchat/chat-uikit-react`,
  (2) a 200+ CSS variable system in `css-variables.css`,
  (3) a reference sample app at
      `github.com/cometchat/cometchat-uikit-react/tree/v6/sample-app/src/components`
      with implementations for common chat UX patterns that combine
      multiple kit components but aren't shipped as single named
      exports (user/group details panels, thread layouts, top-level
      home layout, notifications, new chat dialog, etc.).
  The docs MCP does NOT index the sample app — fetch it from GitHub
  directly. Adding a new component when an existing one's prop would
  do, or hand-rolling something the kit, the variable system, or the
  sample app already provides, means missing the kit's theming, i18n,
  accessibility, and every future SDK update. Step 2 (subsections 2a
  + 2b + 2c + 2d) is mandatory — do NOT skip it. **2a
  (existing-component prop check) goes FIRST** because most features
  are props on already-mounted components, not new components.
- **Custom CSS is allowed ONLY for layout glue** (positioning,
  sizing, flex/grid containers, the height chain). Even there, never
  hardcode colors / fonts / borders / radii / spacings — always
  reference `--cometchat-*` variables. Hand-rolled headers, buttons,
  icons, panels, badges, dividers, etc. are NEVER OK if the kit
  already provides them.
- **Always query the docs MCP first** for any prop, builder, event, or
  CSS selector. Never invent SDK API from memory.
- **Verify Phase A is done** before customizing. This skill modifies
  existing integration files; it does not create new ones.
- **Show the user the change before writing**. Customization is
  user-side intent — they need visibility.
- **Drift detection is expected after customization**, not a bug.
  The user's customizations live in `state.files_owned` and will
  show up in `cometchat info` as modified. That's correct.
- **Prefer composition over CSS overrides** when both are options —
  composition is stable across SDK versions; CSS selectors are not.
- **Never invent CSS class names** — query the MCP. The SDK's class
  prefix is `.cometchat-` but the leaf names (`-message-bubble-incoming`,
  `-conversations-header`, etc.) MUST come from the docs.
- **If the docs MCP is not installed**, refuse to continue and tell
  the user how to install it.
- **Always use `npx @cometchat/skills-cli`** for any CLI commands.

## What this skill does NOT do

- It does not write **template** files (that's `cometchat init`)
- It does not **enable packaged features** (that's `cometchat-features`
  + `cometchat apply-feature`)
- It does not **change theme tokens** (that's `cometchat-theming` +
  `cometchat apply-theme`)
- It does not **fix broken integrations** (that's
  `cometchat-troubleshooting` + `cometchat doctor`)
- It does not **add new components from scratch** — it customizes
  components that the integration already uses

For anything in the "does not" list, route the user to the right
skill/command instead of attempting it here.

