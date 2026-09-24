---
name: cometchat-features
description: Add features (calls, reactions, polls, file sharing, presence, etc.) to an already-integrated CometChat project. Routes to the right sub-flow based on feature type — default features (already enabled), dashboard-toggle features (extensions + AI), package-install features (calls), or component-swap features (rich text).
license: "MIT"
compatibility: "Node.js >=18; @cometchat/chat-uikit-react ^6; integration must already be applied"
allowed-tools: "executeBash, readFile, fileSearch, listDirectory"
metadata:
  author: "CometChat"
  version: "3.0.0"
  tags: "cometchat features extensions calls reactions polls ai-features"
---

> **Companion skills:** `cometchat-core` covers initialization and the
> provider pattern; `cometchat-customization` is the next step when a
> feature is enabled but needs visual customization;
> `cometchat-troubleshooting` handles post-feature-enable failures.

## Purpose

This skill teaches Claude how CometChat features are structured and
what work is actually required to enable each one. Most features require
**zero code** — they are either already built into the UI Kit, enabled
via a dashboard toggle, or activated by a single npm install.
Understanding which type a feature is prevents unnecessary work.

---

## 1. Use this skill when

The user wants to add a specific feature to an already-integrated CometChat
project. Trigger phrases:

- `/cometchat features`
- `/cometchat features <name>` (e.g. `/cometchat features reactions`)
- `/cometchat <feature>` (e.g. `/cometchat polls`, `/cometchat calls`)
- "add reactions to my chat"
- "add video calling"
- "enable polls"
- "add file sharing"
- "enable smart replies"
- "add typing indicators"

## 2. Preconditions

The user must have an existing integration:

```bash
npx @cometchat/skills-cli info --json
```

If `integrated` is `false`, **stop** and tell the user to run `/cometchat`
first to create the integration.

## 3. Why features fall into each type

CometChat features split into 4 types based on their architecture:

- **Type 1 — Default (compiled-in):** These are shipped inside the UI
  Kit component bundle unconditionally. CometChat builds reactions,
  typing indicators, mentions, etc. into `CometChatMessageList` and
  `CometChatMessageComposer` at compile time. The feature is always
  present; the only question is whether the prop that surfaces it is
  enabled. No code or dashboard changes needed.

- **Type 2 — Dashboard-toggle (backend extensions):** These are
  backend services hosted by CometChat's infrastructure. The UI Kit
  polls which extensions are enabled via the app's init response. When
  you flip the dashboard toggle, the backend returns a different
  feature flag, and the UI Kit renders the corresponding UI
  automatically. No client code change is needed — the rendering logic
  is already in the UI Kit, just gated on the flag.

- **Type 3 — Package-install (separate SDK):** Voice/video calling
  requires a separate WebRTC SDK (`@cometchat/calls-sdk-javascript`)
  because it links against browser media APIs that would bloat every
  integration if bundled unconditionally. Once installed, the UI Kit
  detects it via dynamic import and enables the call UI.

- **Type 4 — Component-swap (variant component):** Some features
  require a different component variant because the base component has
  a hard-coded behavior that can't be toggled via props. The CLI does
  a safe word-boundary replace of the component name in your owned
  files. If CometChat adds new variant components in future SDK
  releases, they will follow this same pattern.

---

## 4. The feature catalog

### Type 1 — Default features (~14, already enabled in UI Kit)

These are already part of the components your integration uses. The skill's
job is to **tell the user they're already there** and point at the relevant
component:

- Instant Messaging
- Media Sharing (file/image/audio/video)
- Read Receipts
- Mark as Unread
- Typing Indicator
- User Presence (online/offline)
- Reactions
- Mentions (incl. @all)
- Threaded Conversations
- Quoted Replies
- Group Chat
- Report Message
- Conversation/Advanced Search

For these: query the docs MCP for the feature's component/usage docs, show
the user where it is in their integration. **No code changes needed.**

### Type 2 — Dashboard-toggle features (~40+, no code needed)

These require flipping a toggle in the [CometChat Dashboard](https://app.cometchat.com).
Once enabled, the UI Kit auto-integrates them. **No code changes needed.**

> **Note:** The dashboard features page also shows the Type 1 features
> (Instant Messaging, Reactions, Mentions, etc.) as always-on toggles
> at the top. Those are already enabled — no action needed. The
> features below are the ones that actually require toggling on.

> **Note:** Conversation and Advanced Search has its own toggle on the
> Features page. It is on by default but can be disabled. If a user
> reports that search is missing, check this toggle.

**Extensions — User Experience:**
Avatar, Bitly, Link Preview, Message Shortcuts, Pin Message, Rich
Media Preview, Save Message, Thumbnail Generation, TinyURL, Voice
Transcription

**Extensions — User Engagement:**
Broadcast, Giphy, Gfycat, Message Translation, Polls, Reminders,
Stickers, Stipop, Tenor

**Extensions — Collaboration:**
Collaborative Document, Collaborative Whiteboard

**Extensions — Security:**
Disappearing Messages, E2E Encryption (Enterprise plan only)

**Extensions — Moderation** (on the separate Extensions page, not Features):
Data Masking, Image Moderation, Profanity Filter, Sentiment Analysis,
XSS Filter, Human Moderation, Report User, Slow Mode,
Virus/Malware Scanner

**Extensions — Notifications** (on the separate Extensions page):
Email Notification, Push Notification, SMS Notification

**Extensions — Customer Support:**
Chatwoot, Intercom

**Smart Chat Features (AI):**
Conversation Starter, Smart Replies, Conversation Summary
(AI features are fetched dynamically from the API — the exact list
depends on your plan and backend configuration.)

**Exact dashboard path (give this to the user verbatim):**

> **For most features (User Experience, User Engagement, Collaboration, Security, AI):**
> 1. Open https://app.cometchat.com
> 2. Select your app
> 3. In the left sidebar: **Chat & Messaging** → **Features**
> 4. Find the feature and flip its **Status** toggle to ON
> 5. Some extensions have a settings icon — click it if the feature
>    needs configuration (e.g. API keys for Giphy)
> 6. Changes take effect immediately — refresh the chat in the browser
>
> **For Moderation and Notification extensions:**
> These are NOT on the Features page. Navigate to:
> **Left sidebar → Extensions** (the separate Extensions page)
> Find the extension and enable it there.

After enabling, run `cometchat verify` to ensure the existing
integration still passes. No code changes are needed — the UI Kit
picks up enabled features automatically.

### Type 3 — Package-install features (4, calls)

These require installing `@cometchat/calls-sdk-javascript`. Once installed,
the UI Kit auto-detects it and surfaces the call UI in CometChatMessageHeader,
CometChatConversations, etc.

- Call Buttons (in message headers)
- Incoming Call notifications
- Outgoing Call interface
- Call Logs (call history)

For these, the user opting in IS consent — run the install directly:

```bash
npm install @cometchat/calls-sdk-javascript
npx @cometchat/skills-cli verify --json
```

The UI Kit's `initiateAfterLogin()` auto-calls `enableCalling()` after the
package is installed. No manual wiring needed for default call buttons in
CometChatMessageHeader. Restart the dev server.

### Type 4 — Component-swap features (drop-in variant)

Some features require swapping one component for a variant that has
different default behavior. The CLI handles the swap automatically —
it walks `state.files_owned`, performs a word-boundary regex replace,
updates `state.json` checksums, and records the applied feature so
re-runs are no-ops. Idempotent.

Currently available:

- `rich-text-formatting` — swaps `CometChatMessageComposer` →
  `CometChatCompactMessageComposer` (the compact variant enables rich
  text formatting by default; the regular composer has
  `enableRichTextEditor=false` baked in)

```bash
npx @cometchat/skills-cli apply-feature rich-text-formatting
```

Do NOT hand-edit the swap. The CLI is the source of truth. If future
SDK releases add new variant components, they will follow this same
`apply-feature <id>` pattern.

---

## 4b. Deep patterns for three most-requested features

For calls, AI smart replies, and presence, the catalog above only says "install a package" or "toggle in dashboard." Here are the concrete compositional patterns so common requests don't require a docs MCP round-trip.

### Calls (audio + video)

After `npm install @cometchat/calls-sdk-javascript`, call buttons auto-appear in `CometChatMessageHeader` and the call UI renders in place. **No manual wiring needed** for basic 1:1 audio/video calls.

For custom integration — e.g. putting a "Start video call" button outside the message header, or handling an incoming call notification in a custom way — use `CometChatCallButtons` + `CometChatIncomingCall` + `CometChatOngoingCall`:

```tsx
import { useState, useEffect } from "react";
import {
  CometChatCallButtons,
  CometChatIncomingCall,
  CometChatOngoingCall,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

export function CustomCallUI({ targetUser }: { targetUser: CometChat.User }) {
  const [ongoingCall, setOngoingCall] = useState<CometChat.Call>();

  useEffect(() => {
    // Listen for call state changes
    const listenerId = "custom-call-listener";
    CometChat.addCallListener(
      listenerId,
      new CometChat.CallListener({
        onOutgoingCallAccepted: (call: CometChat.Call) => setOngoingCall(call),
        onIncomingCallCancelled: () => setOngoingCall(undefined),
        onCallEnded: () => setOngoingCall(undefined),
      }),
    );
    return () => CometChat.removeCallListener(listenerId);
  }, []);

  return (
    <>
      <CometChatCallButtons user={targetUser} />
      <CometChatIncomingCall />
      {ongoingCall && <CometChatOngoingCall call={ongoingCall} />}
    </>
  );
}
```

**Common gotchas:**
- Calls require a logged-in CometChat user on *both* sides. Test from two browsers (or incognito) logged in as different UIDs.
- `CometChatIncomingCall` must be mounted globally (e.g. in your provider or layout) so incoming calls ring on every page.
- Group calls use `CometChat.Group` instead of `CometChat.User` on `CometChatCallButtons`.

### AI smart replies

Smart replies is a dashboard-toggle feature (Type 2). After enabling it in the dashboard (Extensions → Smart Replies → Toggle on), **no code changes are required** — the `CometChatMessageComposer` automatically renders suggested replies as chips above the input when there's a recent incoming message.

For a custom UI — e.g. showing smart replies inline instead of above the composer, or only for certain conversation types — you read the extension data from the incoming message and render your own chips:

```tsx
function SmartReplyChips({ message }: { message: CometChat.BaseMessage }) {
  const metadata = message.getMetadata() as Record<string, unknown> | undefined;
  const extensions = (metadata?.["@injected"] as Record<string, unknown>)?.["extensions"] as
    | Record<string, unknown>
    | undefined;
  const smartReply = extensions?.["smart-reply"] as { reply_positive?: string; reply_neutral?: string; reply_negative?: string } | undefined;

  if (!smartReply) return null;

  const replies = [smartReply.reply_positive, smartReply.reply_neutral, smartReply.reply_negative].filter(Boolean) as string[];
  return (
    <div style={{ display: "flex", gap: 8, padding: 8 }}>
      {replies.map((r) => (
        <button key={r} onClick={() => sendTextMessage(r)}>{r}</button>
      ))}
    </div>
  );
}
```

Smart replies are server-generated and attached to messages via the `@injected.extensions.smart-reply` metadata path — the AI feature runs on CometChat's backend, not in your code.

### Presence (online / offline status)

Presence is a **default feature** (Type 1) — online status indicators appear automatically on user avatars in `CometChatConversations`, `CometChatUsers`, and `CometChatGroupMembers`. Nothing to install, nothing to enable.

For custom UI that needs to know a specific user's online state — e.g. a "Sold by Aria Chen · online now" label on a product page — subscribe to user events:

```tsx
import { useEffect, useState } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

export function useUserPresence(uid: string): "online" | "offline" | "unknown" {
  const [status, setStatus] = useState<"online" | "offline" | "unknown">("unknown");

  useEffect(() => {
    // 1. Fetch initial state
    CometChat.getUser(uid).then((u) => {
      setStatus(u.getStatus() === "online" ? "online" : "offline");
    });

    // 2. Subscribe to live changes
    const listenerId = `presence-${uid}`;
    CometChat.addUserListener(
      listenerId,
      new CometChat.UserListener({
        onUserOnline: (user: CometChat.User) => {
          if (user.getUid() === uid) setStatus("online");
        },
        onUserOffline: (user: CometChat.User) => {
          if (user.getUid() === uid) setStatus("offline");
        },
      }),
    );
    return () => CometChat.removeUserListener(listenerId);
  }, [uid]);

  return status;
}
```

**Common gotchas:**
- Presence events only fire for users the current user has interacted with (conversation exists, in same group, etc.). For arbitrary UIDs with no prior interaction, you may need to call `CometChat.getUser(uid)` periodically instead.
- `getStatus()` returns `"online"` or `"offline"` — also check `getLastActiveAt()` for a "last seen X ago" timestamp.
- "Last seen" is disabled by default on free-tier apps. Enable it in the dashboard (Settings → Chat → Last Seen).

---

## 5. Docs MCP contract

The CometChat docs MCP at `cometchat-docs` is a **hard requirement** for
this skill. It's the canonical source for:

- Per-feature SDK reference (props, callbacks, builders, events)
- Per-feature configuration details beyond the dashboard path above
- Feature compatibility notes (which features need backend setup,
  which auto-wire, which require explicit `setExtensions([...])`)

**Hard rules:**

1. **Always query the docs MCP first** before answering any feature
   question that's not in our local catalog (`cometchat features info`).
2. **If the docs MCP is not installed**, STOP. Tell the user:
   "I need the CometChat docs MCP to walk you through this feature.
   Install it with `claude mcp add --transport http cometchat-docs
   https://www.cometchat.com/docs/mcp` and re-run."
3. **Use the dashboard path from this skill** (Chat & Messaging →
   Features) for all toggle features. Query the docs MCP for
   per-feature configuration details beyond the basic toggle.
4. **Canonical reference URLs** (use as starting points if the agent
   doesn't have an MCP query handy):
   - Extensions: https://www.cometchat.com/docs/ui-kit/react/extensions
   - AI features: https://www.cometchat.com/docs/ui-kit/react/ai-features
   - Calls: https://www.cometchat.com/docs/ui-kit/react/call-features
   - Core features: https://www.cometchat.com/docs/ui-kit/react/core-features

---

## 6. Steps

### Step 1 — Read state

```bash
npx @cometchat/skills-cli info --json
```

If not integrated, stop. Otherwise note the framework + experience so you
can find the right files.

### Step 2 — Determine feature

If the user named a feature, use it. Otherwise list the categories above
and ask which feature they want.

### Step 3 — Classify the feature

Match the feature name against the 4 types in section 4. If you don't know
the type, query the docs MCP first.

### Step 4 — Execute the right sub-flow

- **Default:** show the user it's already there. Point at the component.
  Use `npx @cometchat/skills-cli features info <id>` to surface
  the walkthrough verbatim.
  - **CRITICAL — if the user explicitly wants a UI element to surface
    the default feature** (e.g. "implement conversation search",
    "add a search bar", "show typing indicators in the header",
    "expose mentions in the composer"), **do NOT add a new component
    yet**. Most default features are exposed via PROPS on the
    components your integration already mounts:
    - "search bar" → `showSearchBar` on `CometChatConversations`
      (and `onSearchBarClicked` to swap in `<CometChatSearch>` for
      advanced dual-scope search if the user wants that)
    - "filter conversations / messages" → `conversationsRequestBuilder`
      / `messagesRequestBuilder`
    - "custom empty / error / loading state" → `emptyStateView`,
      `errorStateView`, `loadingStateView`
    - "custom message bubble" → `templates` prop on
      `CometChatMessageList` (NOT a custom bubble component)
    - "hide / disable a sub-feature" → `disable*` boolean props
    - "click handler" → `onItemClick`, `onMessageClick`,
      `onSearchBarClicked`, `onBack`
    - "custom subtitle / status / timestamp" → `subtitleView`,
      `statusView`, `timestampView`
    Process before any code change:
    1. Read the files in `.cometchat/state.json` `files_owned` and
       grep for the `<CometChat[A-Z]` JSX components actually in use:
       ```bash
       grep -hoE '<CometChat[A-Z][a-zA-Z]*' \
         $(jq -r '.files_owned[]' .cometchat/state.json 2>/dev/null) \
         2>/dev/null | sort -u
       ```
    2. Query the docs MCP for `"<ComponentName> props"` for each one.
    3. If a prop matches the user's intent, **add the prop and stop**.
       No new components, no custom CSS, no new files.
    4. Only if no prop matches, route to the `cometchat-customization`
       skill for the full four-tier discovery.
- **Dashboard-toggle:** prefer the CLI — it flips the toggle via the
  same API the dashboard UI uses, so the user doesn't leave the
  terminal:
  ```bash
  npx @cometchat/skills-cli features enable <id> --json
  # to turn it off:
  npx @cometchat/skills-cli features disable <id> --json
  ```
  The CLI reads the app id from `.cometchat/config.json` and the
  bearer token from the OS keychain (requires a prior
  `cometchat auth login`). Response shape:
  - `"status": "enabled"` / `"disabled"` → done. Tell the user to
    hard-refresh (Cmd+Shift+R) the browser tab running their dev
    server.
  - `"status": "no-op"` → already in the desired state.
  - `"status": "not-logged-in"` → run `cometchat auth login` first.
  - `"status": "no-app"` → run `/cometchat` or
    `cometchat provision setup` first so `.cometchat/config.json`
    has the app id.
  - `"status": "error"` → surface `next_steps` verbatim. Includes
    the dashboard URL as a manual fallback.

  **Only fall back to the dashboard walkthrough** (app.cometchat.com
  → Chat & Messaging → Features → flip Status toggle) if the CLI
  returns `error` or isn't available. Run
  `cometchat features info <id>` for per-feature configuration
  details (Giphy API keys, translation languages, etc.) beyond the
  basic toggle.

  **Note:** if the feature has `auto_wired_in_uikit: false` in the
  catalog (most non-default extensions), the toggle alone isn't
  enough — you also need to register the extension via
  `UIKitSettingsBuilder.setExtensions([...])` before `init`. The
  CLI's success output flags this; query the docs MCP for the exact
  builder syntax.
- **Package-install (calls):** run `npm install @cometchat/calls-sdk-javascript`
  directly. The user opted in, that IS consent.
- **Component-swap:** run `npx @cometchat/skills-cli apply-feature <id>`.
  The CLI handles the swap deterministically. Do NOT hand-edit.

### Step 5 — Verify

```bash
npx @cometchat/skills-cli verify --json
```

Surface any failed checks verbatim. If anything looks off after enabling
a feature (drift, unexpected build error, env warning), run
`cometchat doctor` for combined drift + env + AST diagnostics with
per-issue fix instructions, or route to the `cometchat-troubleshooting`
skill for deeper triage.

## Hard rules

- Never modify a project without an existing CometChat integration.
- Always query the docs MCP for SDK reference (do not invent function names).
- For component-swap features, always use `cometchat apply-feature <id>` —
  the CLI is the source of truth, never hand-edit.
- For package-install features (calls), the user opting in IS consent —
  run `npm install <package>` directly.
- For dashboard-toggle features, walk the user through the dashboard
  activation steps from `cometchat features info <id>` — the dashboard
  flip is something only the human can do.
- For dashboard-toggle features, always give the canonical path:
  **app.cometchat.com → select app → Chat & Messaging → Features →
  toggle ON.** Query the docs MCP for per-feature config details
  (e.g. Giphy API key, Translation language settings).
- Always use `npx @cometchat/skills-cli`.

## Sources

- [Core features](https://www.cometchat.com/docs/ui-kit/react/core-features)
- [Extensions](https://www.cometchat.com/docs/ui-kit/react/extensions)
- [AI features](https://www.cometchat.com/docs/ui-kit/react/ai-features)
- [Call features](https://www.cometchat.com/docs/ui-kit/react/call-features)
