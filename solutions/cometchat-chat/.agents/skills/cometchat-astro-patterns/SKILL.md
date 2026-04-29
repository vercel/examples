---
name: cometchat-astro-patterns
description: "Framework-specific patterns for integrating CometChat React UI Kit v6 into Astro projects using React islands. Covers client:only rendering, island communication, CSS handling, and common pitfalls."
license: "MIT"
compatibility: "Node.js >=18; React >=18; Astro >=3; @astrojs/react; @cometchat/chat-uikit-react ^6; @cometchat/chat-sdk-javascript ^4"
allowed-tools: "executeBash, readFile, fileSearch, listDirectory"
metadata:
  author: "CometChat"
  version: "3.0.0"
  tags: "chat cometchat astro react islands client-only patterns"
---

## Purpose

This skill teaches Claude how to integrate CometChat into an Astro project using React islands. Astro is a static-first framework -- most of the page is HTML rendered at build time. Interactive React components run as isolated "islands" in the browser. CometChat components are React islands that must use `client:only="react"` to bypass server rendering entirely.

**Read these companion skills first:**
- `cometchat-core` -- initialization, login, CSS, provider pattern, anti-patterns
- `cometchat-components` -- component catalog and composition patterns
- `cometchat-placement` -- WHERE to put chat (route, modal, drawer, embedded)

---

## 1. Project detection

A project uses Astro when `package.json` has `astro` as a dependency. CometChat integration also requires the React integration:

```bash
# Check for Astro + React
grep -E '"astro"|"@astrojs/react"' package.json
```

**If `@astrojs/react` is missing**, it must be installed first:

```bash
npx astro add react
```

This adds `@astrojs/react` to `package.json` and configures it in `astro.config.mjs`.

Verify the React integration is configured:

```bash
# astro.config.mjs should have react() in the integrations array
grep -A 5 "integrations" astro.config.mjs 2>/dev/null || grep -A 5 "integrations" astro.config.ts 2>/dev/null
```

---

## 2. Critical: client:only="react"

Every Astro component that renders CometChat MUST use `client:only="react"`. This is the single most important rule for Astro + CometChat.

### Why client:only and not client:load or client:visible

Astro's client directives control when and how interactive components are hydrated:

| Directive | Server renders? | When hydrates? | Works with CometChat? |
|---|---|---|---|
| `client:load` | Yes | On page load | **NO** -- server render crashes |
| `client:visible` | Yes | When visible in viewport | **NO** -- server render crashes |
| `client:idle` | Yes | When browser is idle | **NO** -- server render crashes |
| `client:only="react"` | No | On page load (client-only) | **YES** |

`client:load`, `client:visible`, and `client:idle` all attempt to render the component on the server first, then hydrate in the browser. CometChat components access `window` and `document` at import time, so server rendering crashes with `ReferenceError: window is not defined`.

`client:only="react"` skips server rendering entirely. The component only runs in the browser. This is the ONLY valid directive for CometChat.

### Usage in .astro files

```astro
---
import ChatView from "../components/ChatView";
---

<!-- CORRECT -->
<ChatView client:only="react" />

<!-- WRONG -- will crash during build -->
<ChatView client:load />

<!-- WRONG -- will crash during build -->
<ChatView client:visible />

<!-- WRONG -- no directive, component won't be interactive at all -->
<ChatView />
```

---

## 3. CometChatProvider for Astro

The provider pattern is the same React component as in other frameworks, but in Astro it runs entirely inside a React island. The provider is not mounted at the Astro layout level -- it is mounted inside the React island.

### Full implementation

```tsx
// src/components/CometChatProvider.tsx
import React, { useEffect, useState, createContext, useContext } from "react";
import { CometChatUIKit, UIKitSettingsBuilder } from "@cometchat/chat-uikit-react";
import "@cometchat/chat-uikit-react/css-variables.css";

interface CometChatContextValue {
  isReady: boolean;
  error: string | null;
}

const CometChatContext = createContext<CometChatContextValue>({
  isReady: false,
  error: null,
});

export const useCometChat = () => useContext(CometChatContext);

// Module-level state prevents both double-init AND double-login in React
// StrictMode. Without the loginInFlight guard, a second mount calls
// login() while the first is still pending and the SDK throws
// "Please wait until the previous login request ends."
let initialized = false;
let loginInFlight: Promise<unknown> | null = null;

async function ensureLoggedIn(
  uid: string,
  authToken?: string,
): Promise<void> {
  const existing = await CometChatUIKit.getLoggedinUser();
  if (existing) return;
  if (loginInFlight) {
    await loginInFlight;
    return;
  }
  loginInFlight = authToken
    ? CometChatUIKit.loginWithAuthToken(authToken)
    : CometChatUIKit.login(uid);
  try {
    await loginInFlight;
  } finally {
    loginInFlight = null;
  }
}

interface CometChatProviderProps {
  children: React.ReactNode;
}

export function CometChatProvider({ children }: CometChatProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setup() {
      try {
        if (!initialized) {
          initialized = true;

          const settings = new UIKitSettingsBuilder()
            .setAppId(import.meta.env.PUBLIC_COMETCHAT_APP_ID)
            .setRegion(import.meta.env.PUBLIC_COMETCHAT_REGION)
            .setAuthKey(import.meta.env.PUBLIC_COMETCHAT_AUTH_KEY)
            .subscribePresenceForAllUsers()
            .build();

          await CometChatUIKit.init(settings);
        }

        await ensureLoggedIn("cometchat-uid-1"); // DEVELOPMENT ONLY — see cometchat-production skill

        setIsReady(true);
      } catch (e) {
        setError(String(e));
      }
    }

    setup();
  }, []);

  if (error) {
    return (
      <div style={{ color: "red", padding: 16, fontFamily: "monospace" }}>
        CometChat Error: {error}
      </div>
    );
  }

  if (!isReady) return null;

  return (
    <CometChatContext.Provider value={{ isReady, error }}>
      {children}
    </CometChatContext.Provider>
  );
}
```

### Key difference: CSS import is INSIDE the component

Notice that `@cometchat/chat-uikit-react/css-variables.css` is imported inside the React component file, not in an Astro layout or global stylesheet. This is because `client:only` islands are completely isolated from Astro's CSS pipeline. Stylesheets imported in `.astro` files or global CSS do NOT reach `client:only` islands.

---

## 4. Chat page with React island

### Full page implementation

```astro
---
// src/pages/messages.astro
import Layout from "../layouts/Layout.astro";
import ChatView from "../components/ChatView";
---

<Layout title="Messages">
  <div class="chat-container">
    <ChatView client:only="react" />
  </div>
</Layout>

<style>
  .chat-container {
    height: calc(100vh - 64px); /* subtract header height */
    width: 100%;
  }
</style>
```

### ChatView component

```tsx
// src/components/ChatView.tsx
import { useState } from "react";
import { CometChatProvider } from "./CometChatProvider";
import {
  CometChatConversations,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

export default function ChatView() {
  return (
    <CometChatProvider>
      <ChatContent />
    </CometChatProvider>
  );
}

function ChatContent() {
  const [selectedUser, setSelectedUser] = useState<CometChat.User>();
  const [selectedGroup, setSelectedGroup] = useState<CometChat.Group>();

  function handleConversationClick(conversation: CometChat.Conversation) {
    const entity = conversation.getConversationWith();
    if (entity instanceof CometChat.User) {
      setSelectedUser(entity);
      setSelectedGroup(undefined);
    } else if (entity instanceof CometChat.Group) {
      setSelectedUser(undefined);
      setSelectedGroup(entity);
    }
  }

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ width: "360px", borderRight: "1px solid #eee" }}>
        <CometChatConversations onItemClick={handleConversationClick} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {(selectedUser || selectedGroup) ? (
          <>
            {selectedUser && <CometChatMessageHeader user={selectedUser} />}
            {selectedGroup && <CometChatMessageHeader group={selectedGroup} />}
            {selectedUser && <CometChatMessageList user={selectedUser} />}
            {selectedGroup && <CometChatMessageList group={selectedGroup} />}
            {selectedUser && <CometChatMessageComposer user={selectedUser} />}
            {selectedGroup && <CometChatMessageComposer group={selectedGroup} />}
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
```

**Important:** The `CometChatProvider` wraps the content INSIDE the React island, not at the Astro level. Each island is an independent React tree. The provider initializes CometChat when this specific island mounts.

---

## 5. Drawer and modal patterns

### Chat drawer as a React island

```tsx
// src/components/ChatDrawerIsland.tsx
import { useState, useEffect } from "react";
import { CometChatProvider } from "./CometChatProvider";
import {
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

interface ChatDrawerIslandProps {
  targetUserId: string;
}

export default function ChatDrawerIsland({ targetUserId }: ChatDrawerIslandProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CometChatProvider>
      <button onClick={() => setIsOpen(true)}>Message</button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 999, backgroundColor: "rgba(0,0,0,0.3)" }}
          />
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0, width: "400px", zIndex: 1000,
            backgroundColor: "#fff", boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid #eee" }}>
              <span style={{ fontWeight: 600 }}>Chat</span>
              <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }} aria-label="Close">&times;</button>
            </div>
            <DrawerContent targetUserId={targetUserId} />
          </div>
        </>
      )}
    </CometChatProvider>
  );
}

function DrawerContent({ targetUserId }: { targetUserId: string }) {
  const [user, setUser] = useState<CometChat.User>();

  useEffect(() => {
    CometChat.getUser(targetUserId).then(setUser);
  }, [targetUserId]);

  if (!user) return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <>
      <CometChatMessageHeader user={user} />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <CometChatMessageList user={user} />
      </div>
      <CometChatMessageComposer user={user} />
    </>
  );
}
```

Usage in an Astro page:

```astro
---
import Layout from "../layouts/Layout.astro";
import ChatDrawerIsland from "../components/ChatDrawerIsland";
---

<Layout title="Product">
  <h1>Product Details</h1>
  <p>Some product description...</p>
  <ChatDrawerIsland client:only="react" targetUserId="seller-uid-123" />
</Layout>
```

**Note:** The trigger button is INSIDE the React island. Astro's static HTML cannot trigger React state changes directly. The button must be part of the same React tree.

---

## 6. Inter-island communication

Astro's island architecture means different React islands are separate React trees. They cannot share React state, context, or refs. If you need communication between a navbar island and a chat island, use one of these approaches:

### Option A: Custom DOM events

```tsx
// NavbarIsland.tsx -- fires a custom event
function NavbarIsland() {
  function openChat() {
    window.dispatchEvent(new CustomEvent("open-chat", { detail: { userId: "uid-123" } }));
  }

  return <button onClick={openChat}>Messages</button>;
}

// ChatIsland.tsx -- listens for the event
function ChatIsland() {
  const [isOpen, setIsOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string>();

  useEffect(() => {
    function handleOpenChat(e: CustomEvent) {
      setTargetUserId(e.detail.userId);
      setIsOpen(true);
    }

    window.addEventListener("open-chat", handleOpenChat as EventListener);
    return () => window.removeEventListener("open-chat", handleOpenChat as EventListener);
  }, []);

  // ... render chat drawer when isOpen
}
```

### Option B: Nanostores (Astro's recommended approach)

Install nanostores: `npm install nanostores @nanostores/react`

```typescript
// src/stores/chatStore.ts
import { atom } from "nanostores";

export const $chatOpen = atom(false);
export const $chatTargetUserId = atom<string | undefined>(undefined);
```

```tsx
// NavbarIsland.tsx
import { useStore } from "@nanostores/react";
import { $chatOpen, $chatTargetUserId } from "../stores/chatStore";

function NavbarIsland() {
  function openChat() {
    $chatTargetUserId.set("uid-123");
    $chatOpen.set(true);
  }

  return <button onClick={openChat}>Messages</button>;
}
```

```tsx
// ChatIsland.tsx
import { useStore } from "@nanostores/react";
import { $chatOpen, $chatTargetUserId } from "../stores/chatStore";

function ChatIsland() {
  const isOpen = useStore($chatOpen);
  const targetUserId = useStore($chatTargetUserId);

  // ... render chat drawer when isOpen
}
```

Nanostores work across framework boundaries -- if the project also has Svelte or Vue islands, they can all share the same store.

### Option C: URL-based state

Navigate to a chat page with query parameters:

```astro
<!-- In the navbar (static HTML or any island) -->
<a href="/messages?user=uid-123">Message this user</a>
```

```tsx
// ChatView.tsx -- reads user from URL
function ChatView() {
  const params = new URLSearchParams(window.location.search);
  const targetUserId = params.get("user");

  // ... resolve and render chat for this user
}
```

---

## 7. Environment variables

### Astro env var conventions

Astro uses Vite under the hood. Client-side variables must have the `PUBLIC_` prefix:

```env
PUBLIC_COMETCHAT_APP_ID=your_app_id
PUBLIC_COMETCHAT_REGION=us
PUBLIC_COMETCHAT_AUTH_KEY=your_auth_key
```

**Access in code:** `import.meta.env.PUBLIC_COMETCHAT_APP_ID`

Variables without `PUBLIC_` prefix are server-only (available in Astro's frontmatter and API routes, but not in client islands).

### .env file

Create `.env` in the project root. Astro's `.env` is NOT gitignored by default -- add it:

```bash
echo ".env" >> .gitignore
```

### Server-only variables (for production auth)

```env
# Server-only (no PUBLIC_ prefix) -- for API endpoints
COMETCHAT_AUTH_TOKEN=your_server_secret
COMETCHAT_APP_ID=your_app_id
COMETCHAT_REGION=us
```

Access in Astro API routes or server-side code:

```typescript
// src/pages/api/cometchat-token.ts
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const { uid } = await request.json();
  const appId = import.meta.env.COMETCHAT_APP_ID;
  const region = import.meta.env.COMETCHAT_REGION;
  const authToken = import.meta.env.COMETCHAT_AUTH_TOKEN;

  const response = await fetch(
    `https://${appId}.api-${region}.cometchat.io/v3/users/${uid}/auth_tokens`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: authToken,
        appId: appId,
      },
      body: JSON.stringify({}),
    }
  );

  const data = await response.json();
  return new Response(JSON.stringify({ token: data.data.authToken }), {
    headers: { "Content-Type": "application/json" },
  });
};
```

**Note:** Astro API routes require on-demand rendering. In Astro 3: set `output: "server"` or `output: "hybrid"` in `astro.config.mjs`. In Astro 4+: the default is `output: "static"` with per-route opt-in — add `export const prerender = false;` at the top of the API route file. If the project is fully static, the auth endpoint must be hosted elsewhere.

---

## 8. CSS handling

### The island CSS isolation problem

Unlike other frameworks, Astro's `client:only` islands are completely isolated from the Astro CSS pipeline. CSS imported in `.astro` files, global stylesheets linked in `<head>`, and `<style>` tags in Astro layouts do NOT reach `client:only` React components.

### Solution: import CSS inside the React component

```tsx
// src/components/ChatView.tsx
import "@cometchat/chat-uikit-react/css-variables.css"; // MUST be here, not in .astro
import { CometChatConversations } from "@cometchat/chat-uikit-react";

export default function ChatView() {
  return <CometChatConversations />;
}
```

### Where NOT to import CSS

```astro
---
// src/layouts/Layout.astro
// WRONG -- this CSS won't reach client:only islands
---
<html>
  <head>
    <link rel="stylesheet" href="@cometchat/chat-uikit-react/css-variables.css" />
  </head>
  <body><slot /></body>
</html>
```

```css
/* src/styles/global.css */
/* WRONG -- @import here won't reach client:only islands */
@import "@cometchat/chat-uikit-react/css-variables.css";
```

### Theming overrides

To override CometChat CSS variables in Astro, do it inside the React component:

```tsx
// src/components/ChatView.tsx
import "@cometchat/chat-uikit-react/css-variables.css";
import "./cometchat-overrides.css"; // your overrides, imported AFTER

export default function ChatView() {
  // ...
}
```

```css
/* src/components/cometchat-overrides.css */
:root {
  --cometchat-primary-color: #6851d6;
  --cometchat-font-family: "Inter", sans-serif;
}
```

---

## 9. Common pitfalls

### client:load vs client:only

**Symptom:** `ReferenceError: window is not defined` during `astro build` or `astro dev`.

**Cause:** Using `client:load` (or `client:visible`, `client:idle`) instead of `client:only="react"`. These directives attempt server-side rendering.

**Fix:** Replace with `client:only="react"`. Always. For every CometChat component.

### CSS not appearing

**Symptom:** CometChat components render with no styling -- raw unstyled HTML, missing colors, broken layout.

**Cause:** CSS imported in an Astro layout or global stylesheet does not reach `client:only` islands.

**Fix:** Import `@cometchat/chat-uikit-react/css-variables.css` inside the React component file (section 8).

### View Transitions

Astro's View Transitions API enables smooth page transitions without full reloads. CometChat's WebSocket connection persists across view transitions (the connection is on `window`, which survives transitions). However, the React island REMOUNTS on each navigation because Astro replaces the DOM.

To keep chat state across page navigations, add `transition:persist` to the island element:

```astro
<ChatView client:only="react" transition:persist />
```

With `transition:persist`, Astro keeps the same DOM element across navigations, so the React tree stays mounted and chat state is preserved. Without it, navigating away and back remounts the island, requiring re-initialization (the `initialized` flag prevents double-init, but the UI state resets).

### Content Collections

Astro's Content Collections are for static content (Markdown, MDX, JSON). Chat data is dynamic and comes from CometChat's SDK. Do not try to store or query chat data via Content Collections.

### Multiple chat islands on one page

If a page has multiple `client:only="react"` islands that use CometChat, each island is a separate React tree. The module-level `initialized` flag ensures CometChat only initializes once even with multiple islands (the flag is shared across imports of the same module).

However, each island needs its own `CometChatProvider` wrapping its content. The provider's `isReady` state is local to each React tree.

### Passing data from Astro to React islands

Props passed to `client:only` components must be serializable (strings, numbers, booleans, plain objects, arrays). You cannot pass React components, functions, or class instances from Astro frontmatter:

```astro
---
// CORRECT -- serializable props
const userId = "cometchat-uid-1";
---
<ChatDrawerIsland client:only="react" targetUserId={userId} />

---
// WRONG -- function props are not serializable
const handleClose = () => console.log("closed");
---
<ChatDrawerIsland client:only="react" onClose={handleClose} />
```

---

## 10. Complete integration checklist

1. Ensure `@astrojs/react` is installed: `npx astro add react`
2. Install packages: `npm install @cometchat/chat-uikit-react @cometchat/chat-sdk-javascript`
3. Create `.env` with `PUBLIC_COMETCHAT_APP_ID`, `PUBLIC_COMETCHAT_REGION`, `PUBLIC_COMETCHAT_AUTH_KEY`
4. Add `.env` to `.gitignore`
5. Create `src/components/CometChatProvider.tsx` with CSS import inside it (section 3)
6. Create `src/components/ChatView.tsx` wrapping content in `CometChatProvider` (section 4)
7. Create `src/pages/messages.astro` with `<ChatView client:only="react" />` (section 4)
8. Add a "Messages" link to the Astro layout's nav
9. Verify: `npm run build` should succeed without `window is not defined` errors

**The three things to remember for Astro:**
1. Always `client:only="react"` -- never `client:load`
2. CSS imports go INSIDE the React component -- never in `.astro` files
3. Each island wraps its own `CometChatProvider` -- there is no global provider at the Astro level
