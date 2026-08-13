---
name: cometchat-react-patterns
description: "Framework-specific patterns for integrating CometChat React UI Kit v6 into React projects (Vite or CRA). Covers provider setup, routing, layout integration, env vars, and common pitfalls."
license: "MIT"
compatibility: "Node.js >=18; React >=18; Vite >=4 or react-scripts (CRA); @cometchat/chat-uikit-react ^6; @cometchat/chat-sdk-javascript ^4"
allowed-tools: "executeBash, readFile, fileSearch, listDirectory"
metadata:
  author: "CometChat"
  version: "3.0.0"
  tags: "chat cometchat react vite cra patterns provider routing integration"
---

## Purpose

This skill teaches Claude how to integrate CometChat into a React project that uses Vite or Create React App. These are client-only environments with no SSR, which simplifies integration significantly.

**Read these companion skills first:**
- `cometchat-core` -- initialization, login, CSS, provider pattern, anti-patterns
- `cometchat-components` -- component catalog and composition patterns
- `cometchat-placement` -- WHERE to put chat (route, modal, drawer, embedded)

This skill covers the HOW for React specifically: project detection, provider wiring, routing patterns, env var conventions, and React-specific gotchas.

---

## 1. Project detection

A project is a plain React project (not a meta-framework) when `package.json` has `react` and ONE of these bundlers, but NONE of the framework packages:

**Bundler indicators (must have one):**
- `vite` in `devDependencies` (Vite project)
- `react-scripts` in `dependencies` (Create React App)

**Framework exclusions (must have none):**
- `next` -- use the `cometchat-nextjs-patterns` skill instead
- `astro` -- use the `cometchat-astro-patterns` skill instead
- `@remix-run/react` or `react-router` (v7 with `react-router.config.ts`) -- use the `cometchat-react-router-patterns` skill instead

**Edge case:** If `react-router-dom` is present but `next`, `astro`, and `@remix-run/react` are absent, this IS a plain React project that uses React Router as a library. This skill applies.

**Detection code:**

```bash
# Quick check from the project root
cat package.json | grep -E '"(vite|react-scripts|next|astro|@remix-run)"'
```

---

## 2. CometChatProvider for React

React (Vite/CRA) is client-only, so there are no SSR concerns. The provider can be simple.

### Full implementation

```tsx
// src/providers/CometChatProvider.tsx
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
// StrictMode. StrictMode mounts, unmounts, and remounts in development,
// which fires useEffect twice. Without guards, init runs twice (duplicate
// WebSocket connections) and login() is called a second time while the
// first is still in flight, which makes the SDK throw
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
    await loginInFlight;  // a prior mount already started login — reuse its promise
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

### Where to mount

Mount `CometChatProvider` in the app's entry point, wrapping either the entire app or the router:

```tsx
// src/main.tsx (Vite)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CometChatProvider } from "./providers/CometChatProvider";
import "@cometchat/chat-uikit-react/css-variables.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CometChatProvider>
      <App />
    </CometChatProvider>
  </React.StrictMode>
);
```

For CRA, the pattern is identical but the file is `src/index.tsx` and uses `createRoot` the same way.

### Production login variant

For production, replace the hardcoded `login("cometchat-uid-1")` with token-based auth. Fetch a token from your backend and use `CometChatUIKit.loginWithAuthToken(token)`. See the `cometchat-core` skill, section 2 (Login), for the full production auth pattern.

---

## 3. Routing integration

React projects handle routing in different ways. Detect which pattern the project uses, then integrate accordingly.

### How to detect the routing pattern

```bash
# Check for React Router
grep -r "react-router-dom" package.json
# Check for router usage patterns
grep -rn "createBrowserRouter\|BrowserRouter\|<Routes" src/ --include="*.tsx" --include="*.jsx" 2>/dev/null | head -5
```

### Pattern A: React Router v6 with createBrowserRouter

This is the modern recommended pattern. The router is defined as a data structure.

```tsx
// src/router.tsx (or wherever the router is defined)
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage"; // <-- new

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "messages", element: <ChatPage /> }, // <-- add this route
      // ... existing routes
    ],
  },
]);
```

### Pattern B: React Router v6 with JSX Routes

Older pattern using `<Routes>` and `<Route>` elements:

```tsx
// Inside App.tsx or wherever routes are defined
import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="messages" element={<ChatPage />} /> {/* add this */}
      </Route>
    </Routes>
  );
}
```

### Pattern C: No router (single-page app)

Some React projects have no router at all. Chat is shown conditionally:

```tsx
// App.tsx
import { useState } from "react";
import ChatPage from "./pages/ChatPage";

function App() {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return (
      <div>
        <button onClick={() => setShowChat(false)}>Back</button>
        <ChatPage />
      </div>
    );
  }

  return (
    <div>
      {/* existing app content */}
      <button onClick={() => setShowChat(true)}>Open Messages</button>
    </div>
  );
}
```

For projects without a router, consider suggesting `react-router-dom` if the project has multiple "pages." But do not force it -- some apps are intentionally single-page.

### Full chat page component

See the `cometchat-placement` skill for complete `ChatPage` implementations (two-pane, full messenger, single thread). The page component itself is framework-agnostic -- the React-specific part is only how the route is wired.

---

## 4. Layout integration

### Finding the layout

Read the project's source to find the component that renders the navigation. Common locations:

```bash
# Find likely layout/nav files
find src \( -name "*.tsx" -o -name "*.jsx" \) | xargs grep -l "nav\|Nav\|Sidebar\|Header" 2>/dev/null | head -10
```

Common patterns:
- `src/App.tsx` with inline nav + `<Outlet />`
- `src/components/Layout.tsx` wrapping children
- `src/layouts/MainLayout.tsx` or `src/layouts/AppLayout.tsx`
- `src/components/Navbar.tsx` or `src/components/Header.tsx`

### Adding a navigation link

Once you find the nav, add a "Messages" link alongside existing links. Match the existing style:

```tsx
// If the project uses React Router's <Link>:
import { Link } from "react-router-dom";

// In the nav component, alongside existing links:
<Link to="/messages">Messages</Link>

// If the project uses React Router's <NavLink> for active styling:
import { NavLink } from "react-router-dom";

<NavLink to="/messages" className={({ isActive }) => isActive ? "active" : ""}>
  Messages
</NavLink>
```

### Adding a chat drawer/modal trigger

If the placement is a drawer or modal instead of (or in addition to) a route, add a trigger button to the nav:

```tsx
// In the nav component
import { useState } from "react";
import { ChatDrawer } from "../components/ChatDrawer";

function Navbar() {
  const [showChat, setShowChat] = useState(false);

  return (
    <nav>
      {/* existing nav links */}
      <button onClick={() => setShowChat(true)}>
        Messages
      </button>
      <ChatDrawer isOpen={showChat} onClose={() => setShowChat(false)} />
    </nav>
  );
}
```

See `cometchat-placement` for the full `ChatDrawer` and `ChatModal` implementations.

---

## 5. Environment variables

### Vite projects

Create a `.env` file in the project root:

```env
VITE_COMETCHAT_APP_ID=your_app_id_here
VITE_COMETCHAT_REGION=us
VITE_COMETCHAT_AUTH_KEY=your_auth_key_here
```

**Access in code:** `import.meta.env.VITE_COMETCHAT_APP_ID`

Vite only exposes variables prefixed with `VITE_` to client-side code. Variables without this prefix are server-only (available in `vite.config.ts` but not in components).

**Important:** Vite's `.env` is NOT gitignored by default. Add `.env` to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

### CRA projects

Create a `.env` file in the project root:

```env
REACT_APP_COMETCHAT_APP_ID=your_app_id_here
REACT_APP_COMETCHAT_REGION=us
REACT_APP_COMETCHAT_AUTH_KEY=your_auth_key_here
```

**Access in code:** `process.env.REACT_APP_COMETCHAT_APP_ID`

CRA requires the `REACT_APP_` prefix for client-side variables. CRA requires a restart after changing `.env` files (Vite does not).

### TypeScript type hints (Vite only)

For better IDE support, add CometChat env vars to `src/vite-env.d.ts`:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COMETCHAT_APP_ID: string;
  readonly VITE_COMETCHAT_REGION: string;
  readonly VITE_COMETCHAT_AUTH_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Production auth keys

The `AUTH_KEY` is for development only. In production, you need a backend that generates auth tokens. Plain React (Vite/CRA) projects have no built-in server, so you need either:
- A separate backend (Express, Fastify, etc.)
- A serverless function (Vercel, Netlify, AWS Lambda)
- A BaaS like Firebase or Supabase with a Cloud Function

The backend calls CometChat's REST API with your `AUTH_TOKEN` (server-side secret, never exposed to client) to generate per-user auth tokens. See the `cometchat-core` skill, section 2, for the flow.

---

## 6. CSS import

Import CometChat's CSS variables exactly once, at the app root. For React (Vite/CRA), the right place is `src/main.tsx` (or `src/index.tsx` for CRA):

```tsx
// src/main.tsx
import "@cometchat/chat-uikit-react/css-variables.css";
import "./index.css"; // your app's styles AFTER the CometChat import
```

Alternatively, use a CSS `@import` in your root stylesheet:

```css
/* src/index.css */
@import "@cometchat/chat-uikit-react/css-variables.css";

/* your styles below */
```

### Import order matters

CometChat's `css-variables.css` defines `:root` CSS custom properties. Your overrides must come AFTER this import to take effect:

```css
/* CORRECT: overrides come after */
@import "@cometchat/chat-uikit-react/css-variables.css";

:root {
  --cometchat-primary-color: #6851d6;
}
```

```css
/* WRONG: overrides come before -- they will be overwritten */
:root {
  --cometchat-primary-color: #6851d6;
}

@import "@cometchat/chat-uikit-react/css-variables.css";
```

---

## 7. Common pitfalls

### StrictMode double-init

React's `StrictMode` (used by default in Vite and CRA development mode) intentionally double-invokes effects. Without the module-level `initialized` flag in the provider, `CometChatUIKit.init()` runs twice. The second call may silently fail or create a second WebSocket connection.

The `initialized` flag in the provider pattern (section 2) handles this. Never remove it. It is not a hack -- it is the correct pattern for one-time SDK initialization in React.

### CSS import duplication

If `css-variables.css` is imported in multiple files (e.g., both `main.tsx` and `ChatPage.tsx`), CSS custom properties are declared twice. This usually works but can cause issues with specificity if the imports are processed in different order by the bundler. Import exactly once at the root.

### Hot Module Replacement (HMR)

Vite's HMR replaces modules without a full page reload. CometChat's SDK holds a WebSocket connection that survives HMR. This is generally fine -- the SDK connection persists and chat keeps working.

However, if you change the provider file itself during development, HMR may re-execute the module. The `initialized` flag prevents double-init, but the WebSocket connection from the previous module instance may linger. If you see duplicate messages or connection issues during development, do a full page reload (`Ctrl+Shift+R`).

### Container height

CometChat components fill 100% of their container. The most common visual bug is components rendering with zero height because their container has no explicit dimensions. Always ensure the chat container has a height:

```tsx
/* CORRECT: explicit height */
<div style={{ height: "100vh" }}>
  <CometChatConversations ... />
</div>

/* CORRECT: flex layout with bounded parent */
<div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
  <nav>...</nav>
  <div style={{ flex: 1 }}>
    <CometChatConversations ... />
  </div>
</div>

/* WRONG: no height constraint -- component collapses to zero */
<div>
  <CometChatConversations ... />
</div>
```

### Vite dependency optimization

Vite pre-bundles dependencies for faster dev startup. CometChat's packages are large and may trigger Vite's "new dependency found, reloading" message on first load. This is normal and only happens once. If it causes issues, you can pre-include the packages:

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: [
      "@cometchat/chat-uikit-react",
      "@cometchat/chat-sdk-javascript",
    ],
  },
});
```

---

## 8. Complete integration checklist

When integrating CometChat into a React (Vite/CRA) project, follow these steps in order:

1. Install packages: `npm install @cometchat/chat-uikit-react @cometchat/chat-sdk-javascript`
2. Create `.env` with `VITE_COMETCHAT_APP_ID`, `VITE_COMETCHAT_REGION`, `VITE_COMETCHAT_AUTH_KEY`
3. Add `.env` to `.gitignore` if not already there
4. Import `@cometchat/chat-uikit-react/css-variables.css` in `src/main.tsx`
5. Create `src/providers/CometChatProvider.tsx` (section 2)
6. Mount `CometChatProvider` in `src/main.tsx` wrapping `<App />`
7. Create the chat page component (see `cometchat-placement` for patterns)
8. Wire the route (section 3) or trigger (section 4)
9. Add a "Messages" link to the existing nav

**Do not skip step 6.** The provider must wrap the app root so init happens once, regardless of which route or modal opens chat.
