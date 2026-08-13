---
name: cometchat-react-router-patterns
description: "Framework-specific patterns for integrating CometChat React UI Kit v6 into React Router projects (v6 library mode and v7 framework mode). Covers SSR prevention, routing patterns, outlet nesting, and common pitfalls."
license: "MIT"
compatibility: "Node.js >=18; React >=18; react-router-dom ^6 or react-router ^7; @cometchat/chat-uikit-react ^6; @cometchat/chat-sdk-javascript ^4"
allowed-tools: "executeBash, readFile, fileSearch, listDirectory"
metadata:
  author: "CometChat"
  version: "3.0.0"
  tags: "chat cometchat react-router remix routing ssr patterns"
---

## Purpose

This skill teaches Claude how to integrate CometChat into React Router projects. React Router exists in two distinct modes with very different integration patterns:

- **v6 library mode:** React Router is used as a routing library in a Vite/CRA app. No SSR. Simple.
- **v7 framework mode:** React Router is a full framework (successor to Remix) with file-system routing, loaders, actions, and SSR. Complex -- similar SSR concerns as Next.js.

**Read these companion skills first:**
- `cometchat-core` -- initialization, login, CSS, provider pattern, anti-patterns
- `cometchat-components` -- component catalog and composition patterns
- `cometchat-placement` -- WHERE to put chat (route, modal, drawer, embedded)

---

## 1. Project detection

### Identifying React Router

```bash
# Check package.json for React Router
grep -E '"react-router-dom"|"react-router"' package.json
```

### Distinguishing v6 library mode from v7 framework mode

```bash
# v7 framework mode: has a config file
ls react-router.config.ts react-router.config.js 2>/dev/null

# v6 library mode: uses createBrowserRouter or <BrowserRouter> in source
grep -rn "createBrowserRouter\|BrowserRouter\|<Routes" src/ --include="*.tsx" --include="*.jsx" 2>/dev/null | head -5
```

**Decision:**
- If `react-router.config.ts` or `react-router.config.js` exists: **v7 framework mode**
- If `react-router-dom` is in `package.json` with `createBrowserRouter` or `<BrowserRouter>` in source: **v6 library mode**
- If `react-router` (not `react-router-dom`) is in `package.json` without a config file: likely v7 in library mode -- treat as v6 library mode

---

## 2. v6 library mode patterns

v6 library mode is essentially a plain React app with routing. There are no SSR concerns. CometChat integration follows the same patterns as the `cometchat-react-patterns` skill, with routing-specific additions.

### CometChatProvider placement

Mount the provider at the router level, wrapping the entire router or a specific route subtree:

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { CometChatProvider } from "./providers/CometChatProvider";
import { router } from "./router";
import "@cometchat/chat-uikit-react/css-variables.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CometChatProvider>
      <RouterProvider router={router} />
    </CometChatProvider>
  </React.StrictMode>
);
```

The provider implementation is the same as in `cometchat-react-patterns` section 2 -- uses `import.meta.env.VITE_COMETCHAT_*` for env vars.

### Adding a route with createBrowserRouter

Find the router configuration and add a new route:

```tsx
// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "messages", element: <ChatPage /> },
      // ... existing routes
    ],
  },
]);
```

### Adding a route with JSX Routes

```tsx
// In App.tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="messages" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}
```

### Nested conversation routes with Outlet

A powerful pattern for React Router: use nested routes to show conversation details alongside the conversation list.

```tsx
// Router config
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "messages",
        element: <ChatLayout />,
        children: [
          { index: true, element: <EmptyState /> },
          { path: ":conversationId", element: <ConversationView /> },
        ],
      },
    ],
  },
]);
```

```tsx
// ChatLayout.tsx -- renders conversation list + Outlet for message view
import { Outlet } from "react-router-dom";
import { CometChatConversations } from "@cometchat/chat-uikit-react";
import { useNavigate } from "react-router-dom";

export default function ChatLayout() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "360px", borderRight: "1px solid #eee" }}>
        <CometChatConversations
          onItemClick={(conversation) => {
            const id = conversation.getConversationId();
            navigate(`/messages/${id}`);
          }}
        />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Outlet />
      </div>
    </div>
  );
}
```

```tsx
// ConversationView.tsx -- renders messages for the selected conversation
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

export default function ConversationView() {
  const { conversationId } = useParams();
  const [user, setUser] = useState<CometChat.User>();
  const [group, setGroup] = useState<CometChat.Group>();

  useEffect(() => {
    if (!conversationId) return;

    // Conversation IDs follow the pattern: "user_<uid>" or "group_<guid>"
    if (conversationId.startsWith("user_")) {
      const uid = conversationId.replace("user_", "");
      CometChat.getUser(uid).then((u) => {
        setUser(u);
        setGroup(undefined);
      });
    } else if (conversationId.startsWith("group_")) {
      const guid = conversationId.replace("group_", "");
      CometChat.getGroup(guid).then((g) => {
        setUser(undefined);
        setGroup(g);
      });
    }
  }, [conversationId]);

  if (!user && !group) return null;

  return (
    <>
      {user && <CometChatMessageHeader user={user} />}
      {group && <CometChatMessageHeader group={group} />}
      {user && <CometChatMessageList user={user} />}
      {group && <CometChatMessageList group={group} />}
      {user && <CometChatMessageComposer user={user} />}
      {group && <CometChatMessageComposer group={group} />}
    </>
  );
}
```

### useNavigate inside CometChat callbacks

CometChat's `onItemClick` callbacks can use React Router's `useNavigate` to drive URL changes:

```tsx
import { useNavigate } from "react-router-dom";

function ConversationsList() {
  const navigate = useNavigate();

  return (
    <CometChatConversations
      onItemClick={(conversation) => {
        const entity = conversation.getConversationWith();
        if (entity instanceof CometChat.User) {
          navigate(`/messages/user_${entity.getUid()}`);
        } else if (entity instanceof CometChat.Group) {
          navigate(`/messages/group_${entity.getGuid()}`);
        }
      }}
    />
  );
}
```

This works because `useNavigate` returns a stable function that CometChat's callback invokes in the browser.

---

## 3. v7 framework mode patterns

React Router v7 in framework mode is a full meta-framework with SSR, file-system routing, loaders, and actions. It has the same SSR concerns as Next.js: CometChat components cannot run on the server.

### SSR prevention

v7 renders components on the server by default. CometChat components will crash during server rendering. Use a `ClientOnly` wrapper:

```tsx
// app/components/ClientOnly.tsx
import { useState, useEffect, type ReactNode } from "react";

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <>{children}</> : <>{fallback}</>;
}
```

Or use `React.lazy` + `Suspense`:

```tsx
import { lazy, Suspense } from "react";

const ChatView = lazy(() => import("../components/ChatView"));

export default function MessagesRoute() {
  return (
    <ClientOnly fallback={<div>Loading chat...</div>}>
      <Suspense fallback={<div>Loading chat...</div>}>
        <ChatView />
      </Suspense>
    </ClientOnly>
  );
}
```

### CometChatProvider for v7 framework mode

The provider needs `ClientOnly` wrapping because `useEffect` runs on the client but the module import of `@cometchat/chat-uikit-react` happens on the server too:

```tsx
// app/providers/CometChatProvider.tsx
import React, { useEffect, useState, createContext, useContext } from "react";

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

export function CometChatProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setup() {
      try {
        // Dynamic import to prevent server-side module resolution
        const { CometChatUIKit, UIKitSettingsBuilder } = await import(
          "@cometchat/chat-uikit-react"
        );

        if (!initialized) {
          initialized = true;

          const settings = new UIKitSettingsBuilder()
            .setAppId(import.meta.env.VITE_COMETCHAT_APP_ID)
            .setRegion(import.meta.env.VITE_COMETCHAT_REGION)
            .setAuthKey(import.meta.env.VITE_COMETCHAT_AUTH_KEY)
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

**Key difference from the plain React provider:** The `import("@cometchat/chat-uikit-react")` is done dynamically inside `useEffect`, NOT at the top level. This prevents the server from trying to resolve the module.

### Mount the provider

**Option A — Chat-only app (all routes use CometChat):**

Wrap the entire app. This disables SSR for all routes since `ClientOnly` renders nothing on the server.

```tsx
// app/root.tsx
import { Outlet } from "react-router";
import { ClientOnly } from "./components/ClientOnly";
import { CometChatProvider } from "./providers/CometChatProvider";

export default function Root() {
  return (
    <html lang="en">
      <body>
        <ClientOnly>
          <CometChatProvider>
            <Outlet />
          </CometChatProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
```

**Option B — Mixed app (some routes need SSR):**

Keep the root clean and scope CometChat to a layout route. Non-chat routes keep full SSR.

```tsx
// app/root.tsx — no CometChat here, SSR works normally
import { Outlet } from "react-router";

export default function Root() {
  return (
    <html lang="en">
      <body>
        <Outlet />
      </body>
    </html>
  );
}
```

```tsx
// app/routes/chat.tsx — layout route for all /chat/* paths
import { Outlet } from "react-router";
import { ClientOnly } from "../components/ClientOnly";
import { CometChatProvider } from "../providers/CometChatProvider";

export default function ChatLayout() {
  return (
    <ClientOnly fallback={<div>Loading chat...</div>}>
      <CometChatProvider>
        <Outlet />
      </CometChatProvider>
    </ClientOnly>
  );
}
```

Then nest chat routes under this layout (e.g. `app/routes/chat.messages.tsx`). Marketing pages, dashboards, and other non-chat routes render server-side as normal.

**Use Option A** for apps where every page involves chat (messaging apps, social platforms). **Use Option B** for apps that add chat to an existing product (SaaS, marketplaces, support).

### File-system routing

v7 framework mode uses file-based routing. Create a route file:

```tsx
// app/routes/messages.tsx
import { lazy, Suspense } from "react";
import { ClientOnly } from "../components/ClientOnly";

const ChatView = lazy(() => import("../components/ChatView"));

export default function MessagesRoute() {
  return (
    <ClientOnly fallback={<div>Loading chat...</div>}>
      <Suspense fallback={<div>Loading chat...</div>}>
        <ChatView />
      </Suspense>
    </ClientOnly>
  );
}
```

### Loaders and actions

**NEVER put CometChat initialization or SDK calls in a `loader` or `action`.** Loaders and actions run on the server in v7 framework mode. CometChat requires browser APIs.

```tsx
// WRONG -- loader runs on the server
export async function loader() {
  const { CometChat } = await import("@cometchat/chat-sdk-javascript");
  const user = await CometChat.getUser("uid"); // crashes on server
  return { user };
}

// CORRECT -- use clientLoader if you need chat data at route entry
export async function clientLoader() {
  const { CometChat } = await import("@cometchat/chat-sdk-javascript");
  const user = await CometChat.getUser("uid");
  return { user };
}
```

`clientLoader` runs only in the browser. It is the right place for CometChat data fetching at the route level. However, most CometChat integrations do not need loaders at all -- the components handle their own data fetching.

---

## 4. Outlet patterns for nested conversations

This pattern works in both v6 and v7. Chat as a parent route with nested child routes:

```
/messages                → Conversation list (left pane), empty state (right pane)
/messages/:conversationId → Conversation list (left pane), messages (right pane)
```

### v6 route config

```tsx
{
  path: "messages",
  element: <ChatLayout />,
  children: [
    { index: true, element: <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>Select a conversation</div> },
    { path: ":conversationId", element: <ConversationView /> },
  ],
}
```

### v7 file-system routes

```
app/routes/
  messages.tsx          → ChatLayout (renders <Outlet />)
  messages._index.tsx   → Empty state
  messages.$conversationId.tsx → ConversationView
```

```tsx
// app/routes/messages.tsx
import { Outlet } from "react-router";
import { ClientOnly } from "../components/ClientOnly";
import { lazy, Suspense } from "react";

const ConversationList = lazy(() => import("../components/ConversationList"));

export default function MessagesLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "360px", borderRight: "1px solid #eee" }}>
        <ClientOnly>
          <Suspense fallback={<div>Loading...</div>}>
            <ConversationList />
          </Suspense>
        </ClientOnly>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Outlet />
      </div>
    </div>
  );
}
```

---

## 5. Environment variables

### v6 library mode (Vite-based)

Same as `cometchat-react-patterns` -- uses `VITE_` prefix:

```env
VITE_COMETCHAT_APP_ID=your_app_id
VITE_COMETCHAT_REGION=us
VITE_COMETCHAT_AUTH_KEY=your_auth_key
```

Access: `import.meta.env.VITE_COMETCHAT_APP_ID`

### v7 framework mode

Also uses Vite under the hood, so the same `VITE_` prefix applies:

```env
VITE_COMETCHAT_APP_ID=your_app_id
VITE_COMETCHAT_REGION=us
VITE_COMETCHAT_AUTH_KEY=your_auth_key
```

Server-only variables (for auth token generation in actions) can omit the `VITE_` prefix so they are never exposed to the client bundle:

```env
COMETCHAT_AUTH_TOKEN=your_server_secret
```

Access server-only vars in loaders/actions via `process.env`:

```tsx
// app/routes/api.cometchat-token.tsx (runs server-side only)
export async function action({ request }: ActionFunctionArgs) {
  const secret = process.env.COMETCHAT_AUTH_TOKEN;
  // ...
}
```

> **Note:** `process.env` is available in loaders/actions when using the
> default Node adapter (`@react-router/node`). Other adapters (Cloudflare,
> Deno) expose env differently — check your adapter's docs.

---

## 6. CSS import

### v6 library mode

Import in `src/main.tsx`:

```tsx
import "@cometchat/chat-uikit-react/css-variables.css";
```

### v7 framework mode

Import in `app/root.tsx`:

```tsx
import "@cometchat/chat-uikit-react/css-variables.css";
```

Or use the `links` export:

```tsx
// app/root.tsx
import cometchatStyles from "@cometchat/chat-uikit-react/css-variables.css?url";

export function links() {
  return [{ rel: "stylesheet", href: cometchatStyles }];
}
```

The `?url` suffix tells Vite to return a URL instead of injecting the CSS, which works with React Router's `links` convention.

---

## 7. Common pitfalls

### Loaders are server-side in v7

The most common mistake in v7 framework mode. Loaders and actions run on the server. Any CometChat code in a loader crashes with `window is not defined`. Use `clientLoader` instead, or handle data fetching in the component.

### v7's unstable_middleware

React Router v7's `unstable_middleware` feature does NOT affect CometChat. CometChat has no middleware requirements. Do not add CometChat-related middleware.

### useNavigate in CometChat callbacks

`useNavigate` works inside CometChat's event callbacks (`onItemClick`, etc.) because these callbacks execute in the browser within the React tree. This is safe:

```tsx
const navigate = useNavigate();

<CometChatConversations
  onItemClick={(conv) => navigate(`/messages/${conv.getConversationId()}`)}
/>
```

### Don't init in loaders

Even `clientLoader` is not the right place for CometChat initialization. Init should happen once in the provider (app root), not per-route. `clientLoader` is only appropriate for CometChat data queries (like `CometChat.getUser()`) that need to complete before the route renders.

### v6 to v7 migration

If a project is migrating from v6 library mode to v7 framework mode, the CometChat integration must change:
- Add `ClientOnly` wrapper
- Move from static imports to dynamic imports for CometChat modules
- Move from `createBrowserRouter` routes to file-system routes
- Add SSR guards

Do not mix v6 and v7 patterns. Detect the mode (section 1) and use the correct pattern.

---

## 8. Complete integration checklist (v6 library mode)

1. Install packages: `npm install @cometchat/chat-uikit-react @cometchat/chat-sdk-javascript`
2. Create `.env` with `VITE_COMETCHAT_APP_ID`, `VITE_COMETCHAT_REGION`, `VITE_COMETCHAT_AUTH_KEY`
3. Add `.env` to `.gitignore`
4. Import `@cometchat/chat-uikit-react/css-variables.css` in `src/main.tsx`
5. Create `src/providers/CometChatProvider.tsx` (uses `import.meta.env.VITE_*`)
6. Mount `CometChatProvider` in `src/main.tsx` wrapping `<RouterProvider>`
7. Create `src/pages/ChatPage.tsx` (see `cometchat-placement` for patterns)
8. Add `{ path: "messages", element: <ChatPage /> }` to the router config
9. Add a "Messages" link to the layout's nav

## 9. Complete integration checklist (v7 framework mode)

1. Install packages: `npm install @cometchat/chat-uikit-react @cometchat/chat-sdk-javascript`
2. Create `.env` with `VITE_COMETCHAT_APP_ID`, `VITE_COMETCHAT_REGION`, `VITE_COMETCHAT_AUTH_KEY`
3. Add `.env` to `.gitignore`
4. Import `@cometchat/chat-uikit-react/css-variables.css` in `app/root.tsx`
5. Create `app/components/ClientOnly.tsx` (section 3)
6. Create `app/providers/CometChatProvider.tsx` with dynamic imports (section 3)
7. Mount `ClientOnly` + `CometChatProvider` in `app/root.tsx`
8. Create `app/routes/messages.tsx` with `ClientOnly` + lazy import (section 3)
9. Add a "Messages" link to the layout's nav
10. Verify: loaders/actions contain NO CometChat imports
