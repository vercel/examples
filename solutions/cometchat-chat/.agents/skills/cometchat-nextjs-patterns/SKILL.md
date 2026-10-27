---
name: cometchat-nextjs-patterns
description: "Framework-specific patterns for integrating CometChat React UI Kit v6 into Next.js projects (App Router and Pages Router). Covers SSR prevention, provider setup, route placement, API routes, and common pitfalls."
license: "MIT"
compatibility: "Node.js >=18; React >=18; Next.js >=13; @cometchat/chat-uikit-react ^6; @cometchat/chat-sdk-javascript ^4"
allowed-tools: "executeBash, readFile, fileSearch, listDirectory"
metadata:
  author: "CometChat"
  version: "3.0.0"
  tags: "chat cometchat nextjs next react ssr app-router pages-router patterns"
---

## Purpose

This skill teaches Claude how to integrate CometChat into a Next.js project. Next.js is the most complex framework to integrate with because of Server-Side Rendering (SSR) and the Server Component / Client Component boundary. Every CometChat component is browser-only -- getting this wrong is the #1 source of integration failures.

**Read these companion skills first:**
- `cometchat-core` -- initialization, login, CSS, provider pattern, anti-patterns
- `cometchat-components` -- component catalog and composition patterns
- `cometchat-placement` -- WHERE to put chat (route, modal, drawer, embedded)

This skill covers the HOW for Next.js specifically.

---

## 1. Project detection

A project uses Next.js when `package.json` has `next` as a dependency.

### Detecting App Router vs Pages Router

Both may coexist in a project. Check which is primary:

```bash
# App Router: look for app/ directory with layout.tsx
ls app/layout.tsx app/layout.jsx 2>/dev/null

# Pages Router: look for pages/ directory with _app.tsx
ls pages/_app.tsx pages/_app.jsx pages/_app.js 2>/dev/null
```

**If `app/layout.tsx` exists, treat the project as App Router.** Even if `pages/` also exists, App Router is the primary routing mechanism in modern Next.js.

**If only `pages/` exists, treat the project as Pages Router.**

---

## 2. Critical: SSR prevention

**Every file that imports from `@cometchat/chat-uikit-react` MUST prevent server-side rendering.** CometChat components access `window`, `document`, and WebSocket APIs during import -- not just during render, but at import time. If Next.js tries to import these modules on the server, the build crashes with `ReferenceError: window is not defined`.

### App Router: "use client" directive

Add `"use client"` as the FIRST line of every file that imports CometChat:

```tsx
"use client";

import { CometChatConversations } from "@cometchat/chat-uikit-react";
// This file only runs in the browser
```

**Common mistake:** Putting `"use client"` AFTER imports. It must be the very first line, before any import statements.

```tsx
// WRONG -- "use client" is not the first line
import React from "react";
"use client"; // too late, has no effect

// CORRECT
"use client";
import React from "react";
```

### App Router: dynamic import from Server Components

If you need to render a CometChat component inside a Server Component (e.g., a page that does data fetching), use `next/dynamic` with `ssr: false`:

```tsx
// app/messages/page.tsx (this is a Server Component)
import dynamic from "next/dynamic";

const ChatView = dynamic(() => import("../../components/ChatView"), {
  ssr: false,
  loading: () => <div>Loading chat...</div>,
});

export default function MessagesPage() {
  return <ChatView />;
}
```

The `ChatView` component itself must still have `"use client"` at the top.

### Pages Router: dynamic import

In the Pages Router, every page can potentially run on the server. Use `next/dynamic`:

```tsx
// pages/messages.tsx
import dynamic from "next/dynamic";

const ChatView = dynamic(() => import("../components/ChatView"), {
  ssr: false,
  loading: () => <div>Loading chat...</div>,
});

export default function MessagesPage() {
  return <ChatView />;
}
```

---

## 3. CometChatProvider for Next.js (App Router)

### Full implementation

```tsx
// app/providers/CometChatProvider.tsx
"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import { CometChatUIKit, UIKitSettingsBuilder } from "@cometchat/chat-uikit-react";

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
            .setAppId(process.env.NEXT_PUBLIC_COMETCHAT_APP_ID!)
            .setRegion(process.env.NEXT_PUBLIC_COMETCHAT_REGION!)
            .setAuthKey(process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY!)
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

### Where to mount: Option A -- Global (chat available everywhere)

Wrap the entire app in `app/layout.tsx`. The layout itself is a Server Component, but the provider is a Client Component via `"use client"` in its file:

```tsx
// app/layout.tsx (Server Component)
import { CometChatProvider } from "./providers/CometChatProvider";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CometChatProvider>
          {children}
        </CometChatProvider>
      </body>
    </html>
  );
}
```

**Note:** Importing a `"use client"` component from a Server Component is fine. Next.js renders the Server Component on the server and defers the Client Component to the browser. The `CometChatProvider` only runs its `useEffect` (and init) in the browser.

### Where to mount: Option B -- Scoped (chat only on chat routes)

Use a route group to scope the provider to chat-related routes:

```
app/
  layout.tsx          <-- no CometChat here
  page.tsx            <-- home page, no chat overhead
  (chat)/
    layout.tsx        <-- CometChatProvider wraps only this group
    messages/
      page.tsx        <-- chat page
    inbox/
      page.tsx        <-- another chat page
```

```tsx
// app/(chat)/layout.tsx
import { CometChatProvider } from "../providers/CometChatProvider";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <CometChatProvider>{children}</CometChatProvider>;
}
```

Option B is better for performance: CometChat's SDK and WebSocket connection are only loaded when the user visits a chat route. Option A is simpler and ensures incoming call notifications work everywhere.

---

## 4. CometChatProvider for Next.js (Pages Router)

In the Pages Router, mount the provider in `_app.tsx`. Use dynamic import to prevent SSR:

```tsx
// pages/_app.tsx
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import "../styles/globals.css";

const CometChatProvider = dynamic(
  () => import("../components/CometChatProvider").then((mod) => mod.CometChatProvider),
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CometChatProvider>
      <Component {...pageProps} />
    </CometChatProvider>
  );
}
```

The provider implementation is the same as section 3, but the file lives at `components/CometChatProvider.tsx` (no `"use client"` needed in Pages Router -- `ssr: false` handles SSR prevention).

---

## 5. Route placement (App Router)

Next.js App Router uses file-system routing. Creating a file at the right path automatically creates the route.

### Create the chat page

```tsx
// app/messages/page.tsx
"use client";

import { useState } from "react";
import {
  CometChatConversations,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

export default function MessagesPage() {
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
    <div style={{ display: "flex", height: "100vh" }}>
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

This page is accessible at `/messages`. No router configuration needed -- Next.js handles it via the file system.

### Add a navigation link

Find the layout's nav component and add a link:

```tsx
import Link from "next/link";

// In the nav, alongside existing links:
<Link href="/messages">Messages</Link>
```

**Important:** Use Next.js's `<Link>` component (from `next/link`), not a plain `<a>` tag or React Router's `<Link>`. Next.js's Link handles client-side navigation and prefetching.

---

## 6. Route placement (Pages Router)

### Create the chat page

```tsx
// pages/messages.tsx
import dynamic from "next/dynamic";

const ChatView = dynamic(() => import("../components/ChatView"), {
  ssr: false,
  loading: () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      Loading chat...
    </div>
  ),
});

export default function MessagesPage() {
  return <ChatView />;
}
```

The `ChatView` component contains the actual CometChat composition (see `cometchat-placement` for patterns). It is dynamically imported with `ssr: false` to prevent server rendering.

### ChatView implementation

```tsx
// components/ChatView.tsx
import { useState } from "react";
import {
  CometChatConversations,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

export default function ChatView() {
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
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "360px", borderRight: "1px solid #eee" }}>
        <CometChatConversations onItemClick={handleConversationClick} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedUser && (
          <>
            <CometChatMessageHeader user={selectedUser} />
            <CometChatMessageList user={selectedUser} />
            <CometChatMessageComposer user={selectedUser} />
          </>
        )}
        {selectedGroup && (
          <>
            <CometChatMessageHeader group={selectedGroup} />
            <CometChatMessageList group={selectedGroup} />
            <CometChatMessageComposer group={selectedGroup} />
          </>
        )}
      </div>
    </div>
  );
}
```

---

## 7. Modal/drawer placement

### App Router

Create a Client Component for the drawer:

```tsx
// components/ChatDrawer.tsx
"use client";

import { useEffect, useState } from "react";
import {
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId?: string;
}

export function ChatDrawer({ isOpen, onClose, targetUserId }: ChatDrawerProps) {
  const [user, setUser] = useState<CometChat.User>();

  useEffect(() => {
    if (!isOpen || !targetUserId) return;
    CometChat.getUser(targetUserId).then(setUser);
  }, [isOpen, targetUserId]);

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 999, backgroundColor: "rgba(0,0,0,0.3)" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "400px", zIndex: 1000,
        backgroundColor: "#fff", boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid #eee" }}>
          <span style={{ fontWeight: 600 }}>Chat</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>X</button>
        </div>
        {user && (
          <>
            <CometChatMessageHeader user={user} />
            <div style={{ flex: 1, overflow: "hidden" }}>
              <CometChatMessageList user={user} />
            </div>
            <CometChatMessageComposer user={user} />
          </>
        )}
      </div>
    </>
  );
}
```

**Mounting the drawer:** The drawer component has `"use client"`, so it can be imported from either Server or Client Components. Import it in the layout or any page:

```tsx
// In a Server Component layout -- this works because ChatDrawer is "use client"
import { ChatDrawer } from "../components/ChatDrawer";

// But state management (isOpen) must be in a Client Component.
// Option 1: wrap in a small client component
// Option 2: use a client-side context for drawer state
```

For state lifting across the Server/Client boundary, create a small Client Component wrapper:

```tsx
// components/ChatDrawerTrigger.tsx
"use client";

import { useState } from "react";
import { ChatDrawer } from "./ChatDrawer";

export function ChatDrawerTrigger({ targetUserId }: { targetUserId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Message</button>
      <ChatDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} targetUserId={targetUserId} />
    </>
  );
}
```

### Pages Router

Use `dynamic` import for the drawer/modal component:

```tsx
import dynamic from "next/dynamic";

const ChatDrawer = dynamic(() => import("../components/ChatDrawer").then(m => m.ChatDrawer), {
  ssr: false,
});
```

See `cometchat-placement` for complete modal and drawer implementations.

---

## 8. API route for production auth

Next.js can serve as both frontend and backend. Use an API route to generate CometChat auth tokens server-side.

### App Router API route

```tsx
// app/api/cometchat-token/route.ts
import { NextRequest, NextResponse } from "next/server";

const COMETCHAT_APP_ID = process.env.COMETCHAT_APP_ID!;       // server-only, no NEXT_PUBLIC_ prefix
const COMETCHAT_REGION = process.env.COMETCHAT_REGION!;        // server-only
const COMETCHAT_AUTH_TOKEN = process.env.COMETCHAT_AUTH_TOKEN!; // server-only secret

export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid || typeof uid !== "string") {
      return NextResponse.json({ error: "uid is required" }, { status: 400 });
    }

    const response = await fetch(
      `https://${COMETCHAT_APP_ID}.api-${COMETCHAT_REGION}.cometchat.io/v3/users/${uid}/auth_tokens`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: COMETCHAT_AUTH_TOKEN,
          appId: COMETCHAT_APP_ID,
        },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ token: data.data.authToken });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
```

### Pages Router API route

```tsx
// pages/api/cometchat-token.ts
import type { NextApiRequest, NextApiResponse } from "next";

const COMETCHAT_APP_ID = process.env.COMETCHAT_APP_ID!;
const COMETCHAT_REGION = process.env.COMETCHAT_REGION!;
const COMETCHAT_AUTH_TOKEN = process.env.COMETCHAT_AUTH_TOKEN!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { uid } = req.body;

    if (!uid || typeof uid !== "string") {
      return res.status(400).json({ error: "uid is required" });
    }

    const response = await fetch(
      `https://${COMETCHAT_APP_ID}.api-${COMETCHAT_REGION}.cometchat.io/v3/users/${uid}/auth_tokens`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: COMETCHAT_AUTH_TOKEN,
          appId: COMETCHAT_APP_ID,
        },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    return res.status(200).json({ token: data.data.authToken });
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  }
}
```

### Environment variables for the API route

Add server-only variables to `.env.local` (no `NEXT_PUBLIC_` prefix -- these must NOT be exposed to the browser):

```env
# .env.local -- server-only (no NEXT_PUBLIC_ prefix)
COMETCHAT_APP_ID=your_app_id
COMETCHAT_REGION=us
COMETCHAT_AUTH_TOKEN=your_server_auth_token

# Client-side (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_COMETCHAT_APP_ID=your_app_id
NEXT_PUBLIC_COMETCHAT_REGION=us
NEXT_PUBLIC_COMETCHAT_AUTH_KEY=your_client_auth_key
```

**Note:** `COMETCHAT_AUTH_TOKEN` (server secret) and `COMETCHAT_AUTH_KEY` (client key) are different values from the CometChat dashboard. The auth token has higher privileges. Never prefix it with `NEXT_PUBLIC_`.

---

## 9. Environment variables

### Next.js env var conventions

| Variable | Prefix | Accessible from | File |
|---|---|---|---|
| Client-side vars | `NEXT_PUBLIC_` | Browser + Server | `.env.local` |
| Server-only vars | None | Server only (API routes, Server Components) | `.env.local` |

### .env.local file

```env
NEXT_PUBLIC_COMETCHAT_APP_ID=your_app_id
NEXT_PUBLIC_COMETCHAT_REGION=us
NEXT_PUBLIC_COMETCHAT_AUTH_KEY=your_auth_key
```

**Access in client code:** `process.env.NEXT_PUBLIC_COMETCHAT_APP_ID`

**Important:** `.env.local` is gitignored by default in Next.js. Unlike Vite, you do not need to manually add it to `.gitignore`.

---

## 10. CSS import

### App Router

Import in `app/globals.css` or `app/layout.tsx`:

```css
/* app/globals.css */
@import "@cometchat/chat-uikit-react/css-variables.css";

/* your styles below */
```

Or as a JS import in the root layout:

```tsx
// app/layout.tsx
import "@cometchat/chat-uikit-react/css-variables.css";
import "./globals.css";
```

### Pages Router

Import in `pages/_app.tsx` or `styles/globals.css`:

```tsx
// pages/_app.tsx
import "@cometchat/chat-uikit-react/css-variables.css";
import "../styles/globals.css";
```

---

## 11. Common pitfalls

### Missing "use client"

**Symptom:** `ReferenceError: window is not defined` or `ReferenceError: document is not defined` during build or at runtime.

**Cause:** A file imports from `@cometchat/chat-uikit-react` without `"use client"` at the top. Next.js tries to render it on the server.

**Fix:** Add `"use client"` as the first line of the file.

### Server/client code mixing

**Symptom:** Build errors about `next/headers`, `cookies()`, or `generateMetadata` in the same file as CometChat imports.

**Cause:** Server-only APIs and client-only APIs cannot coexist in the same file. CometChat requires `"use client"`, but `next/headers` and `cookies()` are server-only.

**Fix:** Split the file. Keep server logic in a Server Component; keep CometChat in a separate `"use client"` component that the Server Component imports.

```tsx
// app/messages/page.tsx (Server Component -- does data fetching)
import { cookies } from "next/headers";
import dynamic from "next/dynamic";

const ChatView = dynamic(() => import("../../components/ChatView"), { ssr: false });

export default async function MessagesPage() {
  const session = cookies().get("session"); // server-only
  if (!session) redirect("/login");

  return <ChatView />;
}
```

### Image optimization

CometChat renders avatars and media images via its own components. These do not conflict with `next/image`. Do not try to replace CometChat's internal images with `next/image` -- they are managed by the SDK.

### Middleware

CometChat has no middleware requirements. Do not add CometChat-related middleware. If the project has auth middleware (e.g., protecting routes), just ensure the chat route is behind the same auth as the rest of the app.

### ISR/SSG pages with chat

If a page uses static generation (`generateStaticParams`) or ISR, you can still add chat. Wrap the CometChat components in a Client Component. The page's static HTML ships without chat, and the Client Component hydrates and renders chat in the browser:

```tsx
// app/products/[id]/page.tsx
export async function generateStaticParams() {
  // ... returns product IDs for static generation
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {/* ChatPanel is "use client" -- renders only in the browser */}
      <ChatPanel targetUserId={product.sellerId} />
    </div>
  );
}
```

### Turbopack

Next.js's Turbopack (dev mode with `next dev --turbo`) works with CometChat. No special configuration needed. If you encounter issues, fall back to the standard Webpack dev server (`next dev` without `--turbo`).

### Pages Router: do NOT use CometChat from `getServerSideProps` / `getStaticProps` / `getInitialProps`

**Symptom:** `ReferenceError: window is not defined` or cryptic SDK errors during `next build` or page rendering.

**Cause:** The CometChat client SDK needs the browser (localStorage, WebSocket, etc.) and a logged-in user session. It cannot run inside `getServerSideProps`, `getStaticProps`, or `getInitialProps` — those execute on the Node.js server before the browser has hydrated.

**Fix:** Do chat-related work in client components only. If you need to pre-seed a conversation from server data, pass just the primitive IDs (user UID, group GUID) as page props and let the client component fetch the CometChat entity on mount:

```tsx
// pages/products/[id].tsx — server-side data fetch, no CometChat
export async function getServerSideProps({ params }) {
  const product = await fetchProduct(params.id);
  return { props: { product } }; // pass sellerId as string, not a CometChat.User
}

export default function ProductPage({ product }) {
  return (
    <>
      <h1>{product.name}</h1>
      <ChatWithSeller sellerUid={product.sellerId} /> {/* client component */}
    </>
  );
}
```

### Pages Router: `_document.tsx` doesn't need CometChat changes

If the project has a custom `pages/_document.tsx` for font preloading or third-party SSR CSS injection, leave it alone. CometChat CSS variables are client-side only — they don't need `_document.tsx` integration. Mount the CSS import in `_app.tsx` as shown in section 10; `_document.tsx` is the wrong layer.

---

## 12. Complete integration checklist (App Router)

1. Install packages: `npm install @cometchat/chat-uikit-react @cometchat/chat-sdk-javascript`
2. Create `.env.local` with `NEXT_PUBLIC_COMETCHAT_APP_ID`, `NEXT_PUBLIC_COMETCHAT_REGION`, `NEXT_PUBLIC_COMETCHAT_AUTH_KEY`
3. Import `@cometchat/chat-uikit-react/css-variables.css` in `app/globals.css`
4. Create `app/providers/CometChatProvider.tsx` with `"use client"` (section 3)
5. Mount `CometChatProvider` in `app/layout.tsx` wrapping `{children}`
6. Create `app/messages/page.tsx` with `"use client"` (section 5)
7. Add a `<Link href="/messages">Messages</Link>` to the layout's nav
8. Verify: `npm run build` should succeed without SSR errors

## 13. Complete integration checklist (Pages Router)

1. Install packages: `npm install @cometchat/chat-uikit-react @cometchat/chat-sdk-javascript`
2. Create `.env.local` with `NEXT_PUBLIC_COMETCHAT_APP_ID`, `NEXT_PUBLIC_COMETCHAT_REGION`, `NEXT_PUBLIC_COMETCHAT_AUTH_KEY`
3. Import `@cometchat/chat-uikit-react/css-variables.css` in `pages/_app.tsx`
4. Create `components/CometChatProvider.tsx` (section 3 code, without `"use client"`)
5. Dynamically import `CometChatProvider` in `pages/_app.tsx` with `ssr: false` (section 4)
6. Create `pages/messages.tsx` with dynamic import (section 6)
7. Add a `<Link href="/messages">Messages</Link>` to the layout's nav
8. Verify: `npm run build` should succeed without SSR errors
