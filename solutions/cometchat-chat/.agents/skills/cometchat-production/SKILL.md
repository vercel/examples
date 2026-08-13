---
name: cometchat-production
description: "Production readiness for CometChat — server-side token auth, user management CRUD, environment hardening, and security checklist. Replaces dev-mode authKey with server-side tokens."
license: "MIT"
compatibility: "Node.js >=18; @cometchat/chat-uikit-react ^6; @cometchat/chat-sdk-javascript ^4"
allowed-tools: "executeBash, readFile, fileSearch, listDirectory"
metadata:
  author: "CometChat"
  version: "3.0.0"
  tags: "cometchat production auth token security user-management rest-api"
---

## Purpose

This skill teaches Claude how to harden a CometChat integration for production. It covers two critical areas:

1. **Token-based authentication** — replacing client-side `authKey` with server-side token generation
2. **User management** — server-side CRUD for CometChat users (create on signup, update on profile change, delete on account deletion)

The `cometchat-core` skill's provider pattern supports both dev mode (`login(uid)`) and production mode (`loginWithAuthToken(token)`). This skill provides the server-side half: the token endpoint and user management endpoints.

---

## 1. Why production auth matters

In development mode, `CometChatUIKit.login(uid)` uses the `authKey` configured via `UIKitSettingsBuilder.setAuthKey()`. This key is embedded in your client-side JavaScript bundle. Anyone can open browser DevTools, find the auth key, and use it to log in as ANY user in your CometChat app. They can read private messages, send messages as other users, and access every conversation.

Production deployments MUST use server-side token generation. The auth key stays on your server. Clients receive short-lived tokens scoped to a single user. If a token leaks, the blast radius is one user session, not your entire app.

---

## 2. The token auth pattern

The production auth flow has four steps:

1. **Client authenticates with YOUR auth system.** The user logs into your app using your existing login flow (email/password, OAuth, magic link, etc.). This step has nothing to do with CometChat.

2. **Your server calls the CometChat REST API.** After verifying the user's identity, your server makes a POST request to CometChat's token endpoint using the REST API key (a server-only secret). CometChat returns an auth token for that specific user.

3. **Client receives the token.** Your server sends the auth token back to the client in the API response.

4. **Client calls `CometChatUIKit.loginWithAuthToken(token)`.** The CometChat SDK uses the token to establish a session. The auth key NEVER touches the browser.

```
┌─────────┐     1. Login      ┌──────────┐    2. POST /v3/users/{uid}/auth_tokens    ┌──────────────┐
│  Client  │ ───────────────→  │  Your    │ ──────────────────────────────────────→    │  CometChat   │
│ (Browser)│                   │  Server  │ ←──────────────────────────────────────    │  REST API    │
│          │ ←───────────────  │          │    { authToken: "..." }                    │              │
│          │  3. auth token    │          │                                            │              │
│          │                   └──────────┘                                            └──────────────┘
│          │
│  4. CometChatUIKit.loginWithAuthToken(token)
└─────────┘
```

---

## 3. Server endpoint implementations

Each endpoint does the same thing:
1. Receives a user UID (from the authenticated session, NOT from the request body in production)
2. Validates that the caller is authenticated
3. POSTs to `https://{APP_ID}.api-{REGION}.cometchat.io/v3/users/{uid}/auth_tokens`
4. Returns the auth token to the client

The CometChat REST API requires two headers:
- `appId` — your CometChat app ID
- `apiKey` — a **REST API Key** (NOT the Auth Key used in dev mode)

**Auth Key vs REST API Key — these are different keys:**

| Key type | Where to find | Purpose | Security |
|---|---|---|---|
| **Auth Key** | Dashboard → Your App → API & Auth Keys → "Auth Keys" table | Client-side SDK: `CometChatUIKit.login(uid)` in dev mode | Exposed in browser. Dev only. |
| **REST API Key** | Dashboard → Your App → API & Auth Keys → "Rest API Keys" table | Server-to-server: token generation, user CRUD, message send | Server only. Never expose to client. |

The `.env` should have both for production:
```env
# Client-side (prefixed for the framework)
VITE_COMETCHAT_APP_ID=your_app_id
VITE_COMETCHAT_REGION=us

# Server-side (no prefix — never exposed to the client)
COMETCHAT_APP_ID=your_app_id
COMETCHAT_REGION=us
COMETCHAT_REST_API_KEY=your_rest_api_key
```

If the user only has an Auth Key, tell them to create a REST API Key in the dashboard: **API & Auth Keys → Rest API Keys → Add Key.**

### Next.js App Router

`app/api/cometchat-token/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

const APP_ID = process.env.COMETCHAT_APP_ID!;
const REGION = process.env.COMETCHAT_REGION!;
const REST_API_KEY = process.env.COMETCHAT_REST_API_KEY!;

export async function POST(request: NextRequest) {
  // TODO: Replace this with your real auth check.
  // Example with NextAuth: const session = await getServerSession(authOptions);
  // Example with Clerk: const { userId } = auth();
  // If not authenticated, return 401.
  const body = await request.json();
  const uid = body.uid as string;

  if (!uid || typeof uid !== "string") {
    return NextResponse.json({ error: "Missing uid" }, { status: 400 });
  }

  // In production, derive UID from the authenticated session, not from
  // the request body. The body approach is shown here as a starting point.
  // Example: const uid = session.user.id;

  const response = await fetch(
    `https://${APP_ID}.api-${REGION}.cometchat.io/v3/users/${encodeURIComponent(uid)}/auth_tokens`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appId: APP_ID,
        apiKey: REST_API_KEY,
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("CometChat token error:", error);
    return NextResponse.json(
      { error: "Failed to generate auth token" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json({ authToken: data.data.authToken });
}
```

### Next.js Pages Router

`pages/api/cometchat-token.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from "next";

const APP_ID = process.env.COMETCHAT_APP_ID!;
const REGION = process.env.COMETCHAT_REGION!;
const REST_API_KEY = process.env.COMETCHAT_REST_API_KEY!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // TODO: Replace with your auth check (e.g., getServerSession, Clerk, JWT).
  const { uid } = req.body;

  if (!uid || typeof uid !== "string") {
    return res.status(400).json({ error: "Missing uid" });
  }

  const response = await fetch(
    `https://${APP_ID}.api-${REGION}.cometchat.io/v3/users/${encodeURIComponent(uid)}/auth_tokens`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appId: APP_ID,
        apiKey: REST_API_KEY,
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("CometChat token error:", error);
    return res.status(response.status).json({ error: "Failed to generate auth token" });
  }

  const data = await response.json();
  return res.status(200).json({ authToken: data.data.authToken });
}
```

### React Router v7 (framework mode)

In React Router framework mode, server logic lives in `action` functions within route modules. Create a resource route (no UI) for the token endpoint.

`app/routes/api.cometchat-token.ts`

```typescript
import type { ActionFunctionArgs } from "react-router";

const APP_ID = process.env.COMETCHAT_APP_ID!;
const REGION = process.env.COMETCHAT_REGION!;
const REST_API_KEY = process.env.COMETCHAT_REST_API_KEY!;

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // TODO: Replace with your auth check (e.g., session cookie, JWT).
  const body = await request.json();
  const uid = body.uid as string;

  if (!uid || typeof uid !== "string") {
    return Response.json({ error: "Missing uid" }, { status: 400 });
  }

  const response = await fetch(
    `https://${APP_ID}.api-${REGION}.cometchat.io/v3/users/${encodeURIComponent(uid)}/auth_tokens`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appId: APP_ID,
        apiKey: REST_API_KEY,
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("CometChat token error:", error);
    return Response.json(
      { error: "Failed to generate auth token" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return Response.json({ authToken: data.data.authToken });
}
```

Register this route in your `routes.ts` (or `app/routes.ts`):

```typescript
// Add to your route config:
route("api/cometchat-token", "routes/api.cometchat-token.ts"),
```

### Express / Hono standalone (React + Vite projects)

React/Vite projects have no built-in server. You need a separate backend. Here are patterns for the two most common choices.

**Express:**

```typescript
// server/index.ts (or server.js)
import express from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // Your Vite dev server
app.use(express.json());

const APP_ID = process.env.COMETCHAT_APP_ID!;
const REGION = process.env.COMETCHAT_REGION!;
const REST_API_KEY = process.env.COMETCHAT_REST_API_KEY!;

app.post("/api/cometchat-token", async (req, res) => {
  // TODO: Replace with your auth check.
  const { uid } = req.body;

  if (!uid || typeof uid !== "string") {
    return res.status(400).json({ error: "Missing uid" });
  }

  const response = await fetch(
    `https://${APP_ID}.api-${REGION}.cometchat.io/v3/users/${encodeURIComponent(uid)}/auth_tokens`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appId: APP_ID,
        apiKey: REST_API_KEY,
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("CometChat token error:", error);
    return res.status(response.status).json({ error: "Failed to generate auth token" });
  }

  const data = await response.json();
  return res.json({ authToken: data.data.authToken });
});

app.listen(3001, () => console.log("Server running on :3001"));
```

**Hono:**

```typescript
// server/index.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

const app = new Hono();
app.use("/*", cors({ origin: "http://localhost:5173" }));

const APP_ID = process.env.COMETCHAT_APP_ID!;
const REGION = process.env.COMETCHAT_REGION!;
const REST_API_KEY = process.env.COMETCHAT_REST_API_KEY!;

app.post("/api/cometchat-token", async (c) => {
  // TODO: Replace with your auth check.
  const { uid } = await c.req.json();

  if (!uid || typeof uid !== "string") {
    return c.json({ error: "Missing uid" }, 400);
  }

  const response = await fetch(
    `https://${APP_ID}.api-${REGION}.cometchat.io/v3/users/${encodeURIComponent(uid)}/auth_tokens`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appId: APP_ID,
        apiKey: REST_API_KEY,
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("CometChat token error:", error);
    return c.json({ error: "Failed to generate auth token" }, { status: response.status });
  }

  const data = await response.json();
  return c.json({ authToken: data.data.authToken });
});

serve({ fetch: app.fetch, port: 3001 });
```

### Astro

`src/pages/api/cometchat-token.ts`

Astro SSR endpoints work in hybrid or server mode. Make sure your `astro.config.mjs` has `output: "server"` or `output: "hybrid"`.

```typescript
import type { APIRoute } from "astro";

const APP_ID = import.meta.env.COMETCHAT_APP_ID;
const REGION = import.meta.env.COMETCHAT_REGION;
const REST_API_KEY = import.meta.env.COMETCHAT_REST_API_KEY;

export const POST: APIRoute = async ({ request }) => {
  // TODO: Replace with your auth check (e.g., session cookie, Astro middleware).
  const body = await request.json();
  const uid = body.uid as string;

  if (!uid || typeof uid !== "string") {
    return new Response(JSON.stringify({ error: "Missing uid" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const response = await fetch(
    `https://${APP_ID}.api-${REGION}.cometchat.io/v3/users/${encodeURIComponent(uid)}/auth_tokens`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appId: APP_ID,
        apiKey: REST_API_KEY,
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("CometChat token error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate auth token" }),
      { status: response.status, headers: { "Content-Type": "application/json" } }
    );
  }

  const data = await response.json();
  return new Response(JSON.stringify({ authToken: data.data.authToken }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
```

---

## 4. Client-side changes

The `cometchat-core` skill's `CometChatProvider` already supports both `authKey` (dev) and `authToken` (production) props. To switch to production mode:

### Step 1 — Create a hook to fetch the token

```typescript
// hooks/useCometChatToken.ts
"use client"; // Required for Next.js App Router; harmless elsewhere

import { useState, useEffect } from "react";

/**
 * Fetches a CometChat auth token from your server-side endpoint.
 * Call this after the user is authenticated in your app.
 */
export function useCometChatToken(uid: string | null) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uid) return;

    let cancelled = false;
    setLoading(true);

    fetch("/api/cometchat-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Token request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setToken(data.authToken);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(String(err));
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [uid]);

  return { token, error, loading };
}
```

### Step 2 — Update the CometChatProvider usage

**Before (dev mode):**

```typescript
<CometChatProvider
  appId={import.meta.env.VITE_COMETCHAT_APP_ID}
  region={import.meta.env.VITE_COMETCHAT_REGION}
  authKey={import.meta.env.VITE_COMETCHAT_AUTH_KEY}
  uid="cometchat-uid-1"
>
  <ChatPage />
</CometChatProvider>
```

**After (production mode):**

```typescript
function ChatWrapper() {
  // Get the authenticated user's ID from your auth system
  const { user } = useAuth(); // Your auth hook (NextAuth, Clerk, Supabase, etc.)
  const { token, error, loading } = useCometChatToken(user?.id ?? null);

  if (!user) return <LoginPage />;
  if (loading) return <div>Connecting to chat...</div>;
  if (error) return <div>Chat connection failed: {error}</div>;

  return (
    <CometChatProvider
      appId={import.meta.env.VITE_COMETCHAT_APP_ID}
      region={import.meta.env.VITE_COMETCHAT_REGION}
      authToken={token!}
      uid={user.id}
    >
      <ChatPage />
    </CometChatProvider>
  );
}
```

Key changes:
- Removed `authKey` prop entirely
- Added `authToken` prop with the token from your server
- `uid` comes from your auth system, not a hardcoded test user
- The provider only renders after the token is fetched

### Step 3 — Handle token refresh on 401

CometChat auth tokens expire. When a token expires, SDK calls will fail. Handle this in your provider:

```typescript
// In your CometChatProvider or a wrapper:
import { CometChat } from "@cometchat/chat-sdk-javascript";

// Listen for auth errors
CometChat.addConnectionListener(
  "auth-refresh-listener",
  new CometChat.ConnectionListener({
    onDisconnected: () => {
      console.log("CometChat disconnected — token may have expired");
      // Re-fetch token from your endpoint and call loginWithAuthToken again
    },
  })
);
```

A simpler approach: if any CometChat operation returns a 401 or auth error, re-fetch the token and call `CometChatUIKit.loginWithAuthToken(newToken)`.

**Guard refresh calls with the same concurrency pattern.** If two components both see a 401 at the same time, two `loginWithAuthToken` calls race and the SDK throws *"Please wait until the previous login request ends."* Route token refresh through the same `ensureLoggedIn(uid, authToken)` helper defined in `cometchat-core`'s provider pattern — the module-level `loginInFlight` promise dedupes concurrent refreshes automatically.

Concrete refresh handler — pair the helper from `cometchat-core` with the connection listener and a token-refetch path:

```typescript
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";

// Module-level — shared across every refresh attempt.
// Identical shape to the one in cometchat-core § 2.
let refreshInFlight: Promise<unknown> | null = null;

async function refreshSession(uid: string): Promise<void> {
  if (refreshInFlight) {
    // Another component already triggered a refresh — wait for it,
    // don't fire a second loginWithAuthToken.
    await refreshInFlight;
    return;
  }

  refreshInFlight = (async () => {
    // 1. Fetch a fresh token from your server endpoint.
    //    Your existing useCometChatToken hook (Step 1) calls /api/cometchat-token.
    //    Extract that fetch into a helper so the refresh path can reuse it.
    const res = await fetch("/api/cometchat-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    });
    if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);
    const { token } = (await res.json()) as { token: string };

    // 2. Re-authenticate with the new token. SDK swaps the in-memory
    //    session — no full reload needed.
    await CometChatUIKit.loginWithAuthToken(token);
  })();

  try {
    await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

// Wire it into the connection listener so a disconnect triggers refresh.
CometChat.addConnectionListener(
  "auth-refresh-listener",
  new CometChat.ConnectionListener({
    onDisconnected: () => {
      const uid = CometChatUIKit.getLoggedInUser()?.getUid();
      if (uid) {
        refreshSession(uid).catch((e) => {
          console.error("CometChat refresh failed; user may need to re-login", e);
        });
      }
    },
  }),
);
```

`refreshInFlight` mirrors `loginInFlight` from `cometchat-core` § 2 — same dedup pattern, separate promise so the initial-login and refresh paths don't accidentally serialize against each other. If the same component renders in StrictMode AND a 401 arrives during the second mount, the listener and the provider effect can both touch the SDK without colliding.

---

## 5. User management patterns

In production, you need to keep CometChat users in sync with your app's users. CometChat users are managed via the REST API using the REST API key (server-only).

### Create user — on signup

When a user signs up for your app, create a corresponding CometChat user.

```typescript
// Server-side utility function
async function createCometChatUser(uid: string, name: string, avatar?: string) {
  const response = await fetch(
    `https://${APP_ID}.api-${REGION}.cometchat.io/v3/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appId: APP_ID,
        apiKey: REST_API_KEY,
      },
      body: JSON.stringify({
        uid,
        name,
        ...(avatar ? { avatar } : {}),
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    // If user already exists (409), that's OK — just log it
    if (response.status === 409) {
      console.log(`CometChat user ${uid} already exists`);
      return;
    }
    throw new Error(`Failed to create CometChat user: ${JSON.stringify(error)}`);
  }
}
```

### Update user — on profile change

When a user updates their name or avatar in your app, update the CometChat user.

```typescript
async function updateCometChatUser(
  uid: string,
  updates: { name?: string; avatar?: string; metadata?: Record<string, unknown> }
) {
  const response = await fetch(
    `https://${APP_ID}.api-${REGION}.cometchat.io/v3/users/${encodeURIComponent(uid)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        appId: APP_ID,
        apiKey: REST_API_KEY,
      },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to update CometChat user: ${JSON.stringify(error)}`);
  }
}
```

### Delete user — on account deletion

When a user deletes their account, delete the CometChat user.

```typescript
async function deleteCometChatUser(uid: string) {
  const response = await fetch(
    `https://${APP_ID}.api-${REGION}.cometchat.io/v3/users/${encodeURIComponent(uid)}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        appId: APP_ID,
        apiKey: REST_API_KEY,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to delete CometChat user: ${JSON.stringify(error)}`);
  }
}
```

### Where to hook user management into common auth providers

**NextAuth (next-auth):**

```typescript
// app/api/auth/[...nextauth]/route.ts or pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";

export default NextAuth({
  // ... your providers ...
  events: {
    createUser: async ({ user }) => {
      await createCometChatUser(user.id, user.name ?? user.email ?? "User");
    },
    // Note: NextAuth doesn't have a deleteUser event by default.
    // Handle deletion in your account deletion endpoint.
  },
});
```

**Clerk:**

```typescript
// Clerk webhook handler — app/api/webhooks/clerk/route.ts
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const body = await req.text();
  // Verify webhook signature with svix (see Clerk docs)

  const event = JSON.parse(body);

  switch (event.type) {
    case "user.created":
      await createCometChatUser(
        event.data.id,
        `${event.data.first_name} ${event.data.last_name}`.trim(),
        event.data.image_url
      );
      break;
    case "user.updated":
      await updateCometChatUser(event.data.id, {
        name: `${event.data.first_name} ${event.data.last_name}`.trim(),
        avatar: event.data.image_url,
      });
      break;
    case "user.deleted":
      await deleteCometChatUser(event.data.id);
      break;
  }

  return NextResponse.json({ received: true });
}
```

**Supabase Auth:**

```typescript
// Supabase Edge Function or webhook handler
// Supabase fires webhooks on auth events via Database Webhooks
// pointing at the auth.users table.

// In a Next.js API route triggered by Supabase webhook:
export async function POST(req: Request) {
  const { type, record } = await req.json();

  if (type === "INSERT") {
    await createCometChatUser(
      record.id,
      record.raw_user_meta_data?.full_name ?? record.email ?? "User",
      record.raw_user_meta_data?.avatar_url
    );
  } else if (type === "UPDATE") {
    await updateCometChatUser(record.id, {
      name: record.raw_user_meta_data?.full_name,
      avatar: record.raw_user_meta_data?.avatar_url,
    });
  } else if (type === "DELETE") {
    await deleteCometChatUser(record.id);
  }

  return new Response("OK");
}
```

**Firebase Auth:**

```typescript
// Firebase Cloud Function triggered by auth events
import * as functions from "firebase-functions";

export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  await createCometChatUser(
    user.uid,
    user.displayName ?? user.email ?? "User",
    user.photoURL ?? undefined
  );
});

export const onUserDeleted = functions.auth.user().onDelete(async (user) => {
  await deleteCometChatUser(user.uid);
});

// For profile updates, call updateCometChatUser from your
// profile update endpoint — Firebase Auth doesn't fire a
// Cloud Function on profile changes.
```

---

## 6. Environment variables

### Production environment variables

| Variable | Where | Description |
|---|---|---|
| `COMETCHAT_APP_ID` | Server + Client | Your app ID. Client-side copies use the framework prefix (`NEXT_PUBLIC_`, `VITE_`, `PUBLIC_`). |
| `COMETCHAT_REGION` | Server + Client | Region code: `us`, `eu`, `in`. Client-side copies use the framework prefix. |
| `COMETCHAT_REST_API_KEY` | SERVER ONLY | The REST API key from your CometChat dashboard. Used for token generation and user management. |
| `COMETCHAT_AUTH_KEY` | REMOVE in production | The auth key used in dev mode. Remove it from `.env` in production. |

### Critical: REST API key must be server-only

The REST API key grants full access to your CometChat app: creating users, generating tokens, deleting messages, managing groups. It MUST stay on the server.

**NEVER prefix it with:**
- `NEXT_PUBLIC_` (Next.js)
- `VITE_` (Vite / React Router)
- `PUBLIC_` (Astro)
- `REACT_APP_` (Create React App)

Any of these prefixes will bundle the key into your client-side JavaScript, exposing it to every visitor.

### Example .env file (production)

```bash
# Client-side (with framework prefix)
NEXT_PUBLIC_COMETCHAT_APP_ID=your-app-id
NEXT_PUBLIC_COMETCHAT_REGION=us

# Server-side ONLY (no prefix)
COMETCHAT_APP_ID=your-app-id
COMETCHAT_REGION=us
COMETCHAT_REST_API_KEY=your-rest-api-key

# REMOVED — do not include in production:
# NEXT_PUBLIC_COMETCHAT_AUTH_KEY=...
```

### Finding the REST API key

1. Go to [app.cometchat.com](https://app.cometchat.com)
2. Select your app
3. Navigate to **API & Auth Keys**
4. Copy the **REST API Key** (it is different from the Auth Key)

---

## 7. Security checklist

Before deploying to production, verify every item:

- [ ] **Auth key removed from client-side env vars.** No `NEXT_PUBLIC_COMETCHAT_AUTH_KEY`, `VITE_COMETCHAT_AUTH_KEY`, or `PUBLIC_COMETCHAT_AUTH_KEY` in your `.env` file.

- [ ] **REST API key is server-only.** The `COMETCHAT_REST_API_KEY` variable has NO framework prefix (`NEXT_PUBLIC_`, `VITE_`, `PUBLIC_`, `REACT_APP_`).

- [ ] **Token endpoint validates the caller's identity.** The `/api/cometchat-token` endpoint checks that the request comes from an authenticated user (session cookie, JWT, etc.) before issuing a token. The example code includes `TODO` comments where you add this check.

- [ ] **UID comes from the session, not the request.** In production, the token endpoint should derive the user's UID from the authenticated session, not from the request body. This prevents users from requesting tokens for other users.

- [ ] **CORS configured.** If the token endpoint runs on a different origin than the frontend (e.g., Express on port 3001, Vite on port 5173), configure CORS to allow only your frontend origin.

- [ ] **Rate limiting on the token endpoint.** Add rate limiting to prevent abuse. Most frameworks have middleware for this (e.g., `express-rate-limit`, Next.js middleware, Astro middleware).

- [ ] **User management endpoints are authenticated.** The create/update/delete user endpoints must verify that the caller has permission to perform the operation (admin role, webhook signature, etc.).

- [ ] **UIKitSettingsBuilder does NOT call `.setAuthKey()`.** In production, remove the `setAuthKey()` call entirely. The builder should only have `setAppId()` and `setRegion()`.

---

## 8. Rate limits and retry

CometChat's REST API enforces per-app rate limits on the token and user-management endpoints. When limits are exceeded, the API returns **HTTP 429** with a `Retry-After` header (in seconds). Your server code should handle this gracefully — without retry logic, a burst of simultaneous logins on app startup can fail silently.

### What to retry, and what not to

**Retry these:**
- `429 Too Many Requests` — rate limit hit, back off and retry
- `502 / 503 / 504` — transient upstream failures (gateway, unavailable, timeout)
- Network errors (`ECONNRESET`, `ETIMEDOUT`) — local/transport issues

**Do NOT retry these:**
- `400 Bad Request` — malformed payload, retry will fail identically
- `401 Unauthorized` / `403 Forbidden` — wrong API key or missing permissions, retry can't help
- `404 Not Found` — wrong endpoint or user/group doesn't exist

### Exponential backoff pattern

The minimum useful retry is exponential backoff with a cap and full jitter. The pattern below works in any Node.js / Edge runtime (Next.js API routes, Astro endpoints, Hono, Express):

```typescript
interface RetryOptions {
  maxAttempts?: number;   // default 3 (initial + 2 retries)
  baseDelayMs?: number;   // default 500ms
  maxDelayMs?: number;    // default 8000ms (cap)
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  opts: RetryOptions = {},
): Promise<Response> {
  const { maxAttempts = 3, baseDelayMs = 500, maxDelayMs = 8000 } = opts;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, init);

      // Retry 429 and 5xx (except 501/505 — those are protocol-level, not transient)
      if (res.status === 429 || (res.status >= 500 && res.status !== 501 && res.status !== 505)) {
        if (attempt === maxAttempts) return res; // give up, return the failed response

        // Prefer Retry-After header when present; otherwise exponential backoff
        const retryAfter = res.headers.get("Retry-After");
        const delayMs = retryAfter
          ? Math.min(parseInt(retryAfter, 10) * 1000, maxDelayMs)
          : Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
        const jitter = Math.random() * delayMs * 0.3;  // ±30% full jitter
        await new Promise((resolve) => setTimeout(resolve, delayMs + jitter));
        continue;
      }
      return res;
    } catch (err) {
      lastError = err;
      if (attempt === maxAttempts) throw err;
      const delayMs = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}
```

### Wire it into the token endpoint

Replace the bare `fetch` in Section 3's patterns with `fetchWithRetry`:

```typescript
// Before
const response = await fetch(
  `https://${COMETCHAT_APP_ID}.api-${COMETCHAT_REGION}.cometchat.io/v3/users/${uid}/auth_tokens`,
  { method: "POST", headers: { ...headers } },
);

// After
const response = await fetchWithRetry(
  `https://${COMETCHAT_APP_ID}.api-${COMETCHAT_REGION}.cometchat.io/v3/users/${uid}/auth_tokens`,
  { method: "POST", headers: { ...headers } },
  { maxAttempts: 3, baseDelayMs: 500, maxDelayMs: 4000 },
);
```

The same wrapper applies to user-management endpoints (create/update/delete) and any other CometChat REST call.

### Logging without leaking

When logging retry attempts for observability, **never log the request headers as-is** — the `apiKey` and `appId` headers contain secrets. Safe shape:

```typescript
console.warn("CometChat API rate-limited", {
  url: url.replace(/\/users\/[^/]+\/auth_tokens/, "/users/<redacted>/auth_tokens"),
  status: res.status,
  attempt,
  retryAfter: res.headers.get("Retry-After"),
});
```

Log the URL path, status, attempt number, and `Retry-After` — never the UID (user identifier), the API key, or the auth token.

### Circuit breaker (for high-traffic endpoints)

If you're behind a load balancer with many parallel requests, a simple backoff isn't enough — every process independently retries, amplifying the pressure. For those setups, add a circuit breaker (e.g. `opossum` for Node.js) around `fetchWithRetry` so repeated failures stop traffic to CometChat for a cooldown window instead of continuing to hammer it.

**Don't prematurely add a circuit breaker** — it's only worth it once you have production metrics showing sustained 429s under normal load.

---

## 9. CLI complement

The CLI has `production-auth` and `add-user-mgmt` commands that can scaffold the token endpoint and user management routes for supported frameworks:

```bash
npx @cometchat/skills-cli production-auth --json
npx @cometchat/skills-cli add-user-mgmt --json
```

These commands:
- Read `.cometchat/state.json` to detect the framework
- Create the API route file from a template
- Auto-patch the client login flow (replacing `CometChatUIKit.login(uid)` with `loginWithAuthToken`)
- Update the integration state

**Supported frameworks:** Next.js, React Router (framework mode), Astro.

**Not supported:** React/Vite (no built-in server). For React/Vite projects, use the Express or Hono patterns in Section 3 of this skill.

The CLI templates are a starting point. This skill's patterns are more complete (they cover more frameworks, show auth provider integration, and include the security checklist). Use the CLI for scaffolding, then refer to this skill for the full picture.

---

## 10. Common mistakes

1. **Using the Auth Key instead of the REST API Key on the server.** The Auth Key (`setAuthKey()`) is for client-side dev mode. The REST API Key is for server-side API calls. They are different keys with different permissions.

2. **Exposing the REST API Key to the client.** Adding `NEXT_PUBLIC_` or `VITE_` prefix to the REST API Key variable bundles it into the client. This is worse than exposing the Auth Key because the REST API Key can create and delete users.

3. **Not validating the caller before issuing tokens.** If your token endpoint accepts any UID without checking the caller's identity, anyone can request tokens for any user. Always validate the session first.

4. **Forgetting to create CometChat users.** If you use token auth but never create the CometChat user via the REST API, `loginWithAuthToken` will fail with "User not found." Always create the CometChat user when the app user signs up.

5. **Hardcoding UIDs in production.** The example code uses `"cometchat-uid-1"` as a placeholder. In production, the UID must come from your authentication system.
