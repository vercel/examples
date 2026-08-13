---
name: cometchat-placement
description: "Production integration patterns -- how to add CometChat as a route, modal, drawer, embedded panel, or widget in an existing project. Teaches Claude WHERE to put chat."
license: "MIT"
compatibility: "@cometchat/chat-uikit-react ^6; @cometchat/chat-sdk-javascript ^4"
allowed-tools: "executeBash, readFile, fileSearch, listDirectory"
metadata:
  author: "CometChat"
  version: "3.0.0"
  tags: "chat cometchat react placement route modal drawer widget embedded integration"
---

## Purpose

This skill teaches you WHERE to put CometChat in an existing project. It covers five placement patterns: route, modal, drawer, embedded panel, and floating widget. Each pattern includes step-by-step instructions and complete code examples.

**This skill is framework-AGNOSTIC.** It uses generic instructions like "create a page at the framework's route location" and "add a route entry to the project's router." The framework-specific details (file paths, SSR handling, env var prefixes) come from the framework skill and the `cometchat-core` skill.

**Before using this skill:**
- Read `cometchat-core` for initialization, login, CSS, and provider patterns
- Read `cometchat-components` for component names, props, and composition patterns

---

## "What are you building?" -- placement recommendation

Use this table to recommend a placement based on what the user is building. If the user says "add chat to my app" without specifying where, ask them what they are building and use this table.

| User intent | Recommended placement | Experience composition |
|---|---|---|
| Messaging app | Route (full page) | Multi-conversation (CometChatConversations + MessageHeader + MessageList + MessageComposer) |
| Marketplace / platform | Drawer on product page + `/messages` route | Single thread (drawer) + Multi-conversation (route) |
| SaaS / dashboard | Modal from navbar + `/messages` route | Single thread (modal) + Multi-conversation (route) |
| Social / community | Route (tabs) | Full messenger (CometChatConversations + CallLogs + Users + Groups with tabs) |
| Support / helpdesk | Floating widget | Widget (use CLI) |
| Just exploring | Demo (replace home page) | Multi-conversation |

---

## Visual reference — experience layouts

When presenting experience options to the user, describe these layouts
or share the ASCII art so they can visualize what each looks like.

### Multi-conversation (Experience 1)

Two-pane layout: conversation list on the left, active chat thread on the right.

```
┌─────────────────────────┬───────────────────────────────────────┐
│ Chats               Q   │ Richard Ray               v  c  i     │
├─────────────────────────┼───────────────────────────────────────┤
│                         │                                       │
│ (RR) Richard Ray  3:45  │           ╭─────────────────────╮     │
│      Is it still up..   │           │ Hi, is the watch    │     │
│                         │           │ still up for sale?  │     │
│ (SB) Sarah Beth   3:40  │           ╰────────── 4:56 PM ─╯      │
│      Sure! Sending ..   │                                       │
│                         │ ╭─────────────────╮                   │
│ (RA) Robert Allen 3:38  │ │ Yes, it is      │                   │
│      Thanks! Looks ..   │ │ available.      │                   │
│                         │ ╰─ 4:56 PM ──────╯                    │
│ (SG) Sam Game     3:30  │                                       │
│      Sending them ..    │           ╭─────────────────────╮     │
│                         │           │ Can I see a couple  │     │
│ (SF) Scott F.     3:22  │           │ of pictures?        │     │
│      I will look ..     │           ╰────────── 4:56 PM ─╯      │
│                         │                                       │
│ (EP) Evan Parker  3:15  │ ╭─────────────────╮                   │
│      Hey, did you ..    │ │ Sure! Sending   │                   │
│                         │ │ them over now.  │                   │
│ (JP) John Paul    3:10  │ ╰─ 4:56 PM ──────╯                    │
│      Sounds good        │                                       │
│                         │           ╭─────────────────────╮     │
│ (LK) Linda Kay    3:05  │           │ Thanks! Looks good. │     │
│      See you there      │           ╰────────── 4:56 PM ─╯      │
│                         ├───────────────────────────────────────┤
│                         │ Type a message...                 >   │
└─────────────────────────┴───────────────────────────────────────┘
```

Best for: messaging apps, team chat, inboxes, dedicated chat sections.

### Single thread (Experience 2)

One chat window — no conversation list. Shows a direct chat with one user or group.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│ (RR) Richard Ray                              v    c    i       │
│      . Online                                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                        ╭───────────────────────────────╮        │
│                        │ Hi, is the watch still up     │        │
│                        │ for sale?          4:56 PM vv │        │
│                        ╰───────────────────────────────╯        │
│                                                                 │
│ ╭───────────────────────╮                                       │
│ │ Yes, it is available. │                                       │
│ ╰── 4:56 PM ───────────╯                                        │
│                                                                 │
│                        ╭───────────────────────────────╮        │
│                        │ Awesome! Can I see a couple   │        │
│                        │ of pictures?       4:56 PM vv │        │
│                        ╰───────────────────────────────╯        │
│                                                                 │
│ ╭────────────────────────────────╮                              │
│ │ Sure! Sending them over now.   │                              │
│ ╰── 4:56 PM ────────────────────╯                               │
│                                                                 │
│                        ╭───────────────────────────────╮        │
│                        │ Thanks! Looks good. 4:56 PM vv│        │
│                        ╰───────────────────────────────╯        │
│                                                                 │
│ ╭─────────────╮                                                 │
│ │ Thank you!  │                                                 │
│ ╰── 4:56 PM ─╯                                                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ +  m  e  a     Type a message...                            >   │
└─────────────────────────────────────────────────────────────────┘
```

Best for: marketplace chat, embedded consult, support, one-on-one conversations.

### Full messenger (Experience 3)

Two-pane layout like Experience 1, plus a bottom tab bar for switching
between Chats, Calls, Users, and Groups.

```
┌─────────────────────────┬───────────────────────────────────────┐
│ Chats               Q   │ Richard Ray               v  c  i     │
├─────────────────────────┼───────────────────────────────────────┤
│                         │                                       │
│ (RR) Richard Ray  3:45  │           ╭─────────────────────╮     │
│      How much extra..   │           │ How much extra are  │     │
│                         │           │ we talking for the  │     │
│ (SB) Sarah Beth   3:40  │           │ direct flight?      │     │
│      That sounds w..    │           ╰────────── 4:56 PM ─╯      │
│                         │                                       │
│ (RA) Robert Allen 3:38  │ ╭──────────────────────╮              │
│      4:56 PM            │ │ It is $50 more. Save │              │
│                         │ │ a couple of hours.   │              │
│ (SG) Sam Game     3:30  │ ╰─ 4:56 PM ───────────╯               │
│      Sending them ..    │                                       │
│                         │           ╭─────────────────────╮     │
│ (SF) Scott F.     3:22  │           │ That sounds worth   │     │
│      I will look ..     │           │ it. Let us do it.   │     │
│                         │           ╰────────── 4:56 PM ─╯      │
│ (EP) Evan Parker  3:15  │                                       │
│      Hey, did you ..    │ ╭──────────────────────╮              │
│                         │ │ Great, I will send   │              │
│                         │ │ you the details.     │              │
│                         │ ╰─ 4:56 PM ───────────╯               │
│                         ├───────────────────────────────────────┤
│                         │ Type a message...                 >   │
├─────────────────────────┼───────────────────────────────────────┤
│ Ch   Ca   Us   Gr       │                                       │
└─────────────────────────┴───────────────────────────────────────┘
```

Best for: social apps, community platforms, dating apps, full-featured
chat products.

---

## Thread replies — hidden by default in every example below

Every `<CometChatMessageList ...>` in the placement patterns below
includes `hideReplyInThreadOption`. The kit's default (`false`) puts a
**"Reply in Thread"** entry in every message's action menu — but that
entry only works if the integrator has wired up a thread panel
(`CometChatThreadHeader` + a scoped `CometChatMessageList` +
`CometChatMessageComposer` with `parentMessageId`). If the thread
panel isn't wired (the case for a simple drawer, widget, modal, or
single-thread experience), the option is still visible and clicking it
silently does nothing — confusing UX.

Default: **threads hidden**. To enable threads for an experience that
actually has the side-panel plumbing:

1. Remove `hideReplyInThreadOption` from the main `<CometChatMessageList>`
2. Add `onThreadRepliesClick` to capture the thread message
3. Render the thread panel (see `cometchat-components` § Threading for
   the full pattern — `CometChatThreadHeader` + scoped `MessageList` +
   scoped `MessageComposer` with `parentMessageId`)

---

## Route placement

The most common pattern. Chat gets its own page in the app, accessible via navigation.

### Steps

#### 1. Set up CometChatProvider at the app root

The provider (from `cometchat-core`) should wrap the entire app or the chat route's layout. This ensures init and login happen once, not per-navigation.

- **Read the project's existing layout/root component first.** Look for the outermost wrapper (e.g., `App.tsx`, `layout.tsx`, `root.tsx`).
- Add the `CometChatProvider` inside the existing layout, wrapping the router outlet or children.
- Import `@cometchat/chat-uikit-react/css-variables.css` at the app root CSS file if not already imported.

#### 2. Create a chat page component

Create a new file (e.g., `ChatPage.tsx` or `MessagesPage.tsx`) at the framework's conventional page location:

- React (Vite): `src/pages/ChatPage.tsx` or `src/ChatPage.tsx`
- Next.js (App Router): `app/chat/page.tsx`
- Next.js (Pages Router): `pages/chat.tsx`
- Astro: `src/pages/chat.astro` (with a React island)
- React Router: `app/routes/chat.tsx`

#### 3. Implement the page

Choose the experience composition from `cometchat-components`:

**Two-pane (most common for routes):**

```tsx
// ChatPage.tsx
import { useState } from "react";
import {
  CometChatConversations,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

export default function ChatPage() {
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
            {selectedUser && <CometChatMessageList user={selectedUser} hideReplyInThreadOption />}
            {selectedGroup && <CometChatMessageList group={selectedGroup} hideReplyInThreadOption />}
            {selectedUser && <CometChatMessageComposer user={selectedUser} />}
            {selectedGroup && <CometChatMessageComposer group={selectedGroup} />}
          </>
        ) : (
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
          }}>
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
```

**Full messenger (tabs -- for standalone messaging sections):**

```tsx
// MessagesPage.tsx
import { useState } from "react";
import {
  CometChatConversations,
  CometChatCallLogs,
  CometChatUsers,
  CometChatGroups,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

type Tab = "chats" | "calls" | "users" | "groups";

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [selectedUser, setSelectedUser] = useState<CometChat.User>();
  const [selectedGroup, setSelectedGroup] = useState<CometChat.Group>();

  function selectUser(user: CometChat.User) {
    setSelectedUser(user);
    setSelectedGroup(undefined);
  }
  function selectGroup(group: CometChat.Group) {
    setSelectedUser(undefined);
    setSelectedGroup(group);
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "360px", display: "flex", flexDirection: "column", borderRight: "1px solid #eee" }}>
        <nav style={{ display: "flex", borderBottom: "1px solid #eee" }}>
          {(["chats", "calls", "users", "groups"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "12px 0",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontWeight: activeTab === tab ? 700 : 400,
                borderBottom: activeTab === tab ? "2px solid var(--cometchat-primary-color, #3399ff)" : "2px solid transparent",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <div style={{ flex: 1, overflow: "hidden" }}>
          {activeTab === "chats" && (
            <CometChatConversations
              onItemClick={(conv) => {
                const entity = conv.getConversationWith();
                if (entity instanceof CometChat.User) selectUser(entity);
                else if (entity instanceof CometChat.Group) selectGroup(entity);
              }}
            />
          )}
          {activeTab === "calls" && <CometChatCallLogs />}
          {activeTab === "users" && <CometChatUsers onItemClick={selectUser} />}
          {activeTab === "groups" && <CometChatGroups onItemClick={selectGroup} />}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedUser && (
          <>
            <CometChatMessageHeader user={selectedUser} />
            <CometChatMessageList user={selectedUser} hideReplyInThreadOption />
            <CometChatMessageComposer user={selectedUser} />
          </>
        )}
        {selectedGroup && (
          <>
            <CometChatMessageHeader group={selectedGroup} />
            <CometChatMessageList group={selectedGroup} hideReplyInThreadOption />
            <CometChatMessageComposer group={selectedGroup} />
          </>
        )}
        {!selectedUser && !selectedGroup && (
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
          }}>
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
```

#### 4. Wire the route into the project's router

**Read the project's existing routing setup first.** Do not assume a pattern. Look for:

- **React Router:** `createBrowserRouter()`, `<Routes>`, `<Route>` in `App.tsx` or a routes file
- **Next.js App Router:** `app/` directory -- just creating the page file at `app/chat/page.tsx` IS the route
- **Next.js Pages Router:** `pages/` directory -- creating `pages/chat.tsx` IS the route
- **Astro:** `src/pages/` directory -- creating `src/pages/chat.astro` IS the route
- **React Router v7:** File-based routing in `app/routes/` or manual routes in `app/routes.ts`

For manual routers (React Router), add a route entry:

```tsx
// Example: adding to an existing createBrowserRouter
{
  path: "/chat",
  element: <ChatPage />,
}
```

For file-based routers (Next.js, Astro, React Router v7), creating the file at the right path is sufficient.

#### 5. Add a navigation link

**Read the project's existing navbar/sidebar first.** Find the component that renders navigation links (could be `Navbar.tsx`, `Sidebar.tsx`, `Header.tsx`, `Nav.tsx`, or inline in a layout).

Add a "Messages" or "Chat" link alongside the existing links:

```tsx
// Example: adding to an existing nav component
<Link to="/chat">Messages</Link>
// or
<a href="/chat">Messages</a>
```

Match the existing link style. If the nav uses icons, add a chat/message icon. If it uses a specific `NavLink` or `Link` component, use the same one.

#### 6. Import CSS

Check if `@cometchat/chat-uikit-react/css-variables.css` is already imported at the app root. If not, add it to the root CSS file or root layout:

```css
/* In globals.css or index.css at the app root */
@import "@cometchat/chat-uikit-react/css-variables.css";
```

---

## Modal placement

A centered overlay for quick one-off messages. Use when chat is a secondary action (e.g., "message this user" from a profile page).

### When to use modal vs. drawer

- **Modal:** Quick, one-off messages. User sends a message and closes. No ongoing conversation visible.
- **Drawer:** Ongoing conversation. User keeps the drawer open while browsing the main app. Better for marketplace/support contexts.

### Steps

#### 1. Create a ChatModal component

```tsx
// ChatModal.tsx
import { useEffect, useState } from "react";
import {
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId?: string;
  targetGroupId?: string;
}

export function ChatModal({ isOpen, onClose, targetUserId, targetGroupId }: ChatModalProps) {
  const [user, setUser] = useState<CometChat.User>();
  const [group, setGroup] = useState<CometChat.Group>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    if (targetUserId) {
      CometChat.getUser(targetUserId)
        .then((u) => {
          setUser(u);
          setGroup(undefined);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (targetGroupId) {
      CometChat.getGroup(targetGroupId)
        .then((g) => {
          setUser(undefined);
          setGroup(g);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, targetUserId, targetGroupId]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />

      {/* Modal content */}
      <div
        style={{
          position: "relative",
          width: "min(600px, 90vw)",
          height: "min(700px, 80vh)",
          backgroundColor: "var(--cometchat-background-color-01, #fff)",
          borderRadius: "var(--cometchat-border-radius-lg, 12px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 10,
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            padding: "4px 8px",
          }}
          aria-label="Close chat"
        >
          X
        </button>

        {loading ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            Loading...
          </div>
        ) : (
          <>
            {user && <CometChatMessageHeader user={user} />}
            {group && <CometChatMessageHeader group={group} />}
            <div style={{ flex: 1, overflow: "hidden" }}>
              {user && <CometChatMessageList user={user} hideReplyInThreadOption />}
              {group && <CometChatMessageList group={group} hideReplyInThreadOption />}
            </div>
            {user && <CometChatMessageComposer user={user} />}
            {group && <CometChatMessageComposer group={group} />}
          </>
        )}
      </div>
    </div>
  );
}
```

#### 2. Wire the trigger

**Read the project's components to find the right trigger point.** This could be:

- A "Message" button on a user profile page
- A "Contact Seller" button on a product card
- A chat icon in a navbar
- A "Send Message" link in a user list

```tsx
// Example: adding a chat button to an existing product card
import { useState } from "react";
import { ChatModal } from "./ChatModal";

function ProductCard({ product }) {
  const [showChat, setShowChat] = useState(false);

  return (
    <div>
      {/* existing product card content */}
      <button onClick={() => setShowChat(true)}>
        Message Seller
      </button>
      <ChatModal
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        targetUserId={product.sellerId}
      />
    </div>
  );
}
```

#### 3. CometChatProvider placement

The `CometChatProvider` (or equivalent init logic) MUST be at the app root, NOT inside the modal. If init is inside the modal, it re-runs every time the modal opens, causing flicker and reconnection delays.

---

## Drawer placement

A side panel that slides in from the right. Better than a modal for ongoing conversations because the user can keep it open while browsing.

### Steps

#### 1. Create a ChatDrawer component

```tsx
// ChatDrawer.tsx
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
  targetGroupId?: string;
}

export function ChatDrawer({ isOpen, onClose, targetUserId, targetGroupId }: ChatDrawerProps) {
  const [user, setUser] = useState<CometChat.User>();
  const [group, setGroup] = useState<CometChat.Group>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    if (targetUserId) {
      CometChat.getUser(targetUserId)
        .then((u) => {
          setUser(u);
          setGroup(undefined);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (targetGroupId) {
      CometChat.getGroup(targetGroupId)
        .then((g) => {
          setUser(undefined);
          setGroup(g);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, targetUserId, targetGroupId]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        />
      )}

      {/* Drawer */}
      {/*
        IMPORTANT: do NOT animate with `transform: translateX(...)`.
        `transform` on an element creates a new containing block for
        `position: fixed` descendants (per the CSS spec), so every
        fixed-positioned popover that CometChat renders inside the drawer
        — message options menu, emoji picker, file preview, reactions
        popover, thread panel — becomes anchored to the transformed
        drawer instead of the viewport. The result is popovers that
        appear clipped, offset, or drift as the drawer animates. Animate
        the `right` offset instead; no transform, no containing-block
        takeover, fixed popovers stay anchored to the viewport.
      */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-400px",  // matches width; slides off-screen when closed
          bottom: 0,
          width: "400px",
          maxWidth: "100vw",
          zIndex: 1000,
          backgroundColor: "var(--cometchat-background-color-01, #fff)",
          boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
          transition: "right 0.3s ease-in-out",
        }}
      >
        {/* Header with close button */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          borderBottom: "1px solid #eee",
        }}>
          <span style={{ fontWeight: 600 }}>Chat</span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
              padding: "4px 8px",
            }}
            aria-label="Close chat"
          >
            X
          </button>
        </div>

        {/* Chat content */}
        {loading ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            Loading...
          </div>
        ) : (
          <>
            {user && <CometChatMessageHeader user={user} />}
            {group && <CometChatMessageHeader group={group} />}
            <div style={{ flex: 1, overflow: "hidden" }}>
              {user && <CometChatMessageList user={user} hideReplyInThreadOption />}
              {group && <CometChatMessageList group={group} hideReplyInThreadOption />}
            </div>
            {user && <CometChatMessageComposer user={user} />}
            {group && <CometChatMessageComposer group={group} />}
          </>
        )}
      </div>
    </>
  );
}
```

#### 2. Wire the trigger

Same approach as the modal -- find the right trigger point in the existing project:

```tsx
import { useState } from "react";
import { ChatDrawer } from "./ChatDrawer";

function UserProfile({ userId }) {
  const [showChat, setShowChat] = useState(false);

  return (
    <div>
      {/* existing profile content */}
      <button onClick={() => setShowChat(true)}>
        Chat with this user
      </button>
      <ChatDrawer
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        targetUserId={userId}
      />
    </div>
  );
}
```

#### 3. Multi-conversation drawer variant

For a drawer that shows the full conversation list (not just a single thread):

```tsx
// ConversationDrawer.tsx -- shows conversation list + message view
import { useState } from "react";
import {
  CometChatConversations,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

interface ConversationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConversationDrawer({ isOpen, onClose }: ConversationDrawerProps) {
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

  const hasSelection = selectedUser || selectedGroup;

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 999, backgroundColor: "rgba(0,0,0,0.3)" }}
        />
      )}
      {/*
        Animate the `right` offset, never `transform: translateX(...)` —
        `transform` creates a new containing block, which re-anchors
        CometChat's fixed-positioned popovers (emoji picker, message
        options, file preview, thread panel) to the drawer instead of
        the viewport and makes them misalign.
      */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-720px",  // off-screen by widest width when closed
          bottom: 0,
          width: hasSelection ? "720px" : "360px",
          maxWidth: "100vw",
          zIndex: 1000,
          backgroundColor: "var(--cometchat-background-color-01, #fff)",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
          display: "flex",
          transition: "right 0.3s ease-in-out, width 0.3s ease-in-out",
        }}
      >
        {/* Conversation list */}
        <div style={{ width: "360px", borderRight: hasSelection ? "1px solid #eee" : "none", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid #eee" }}>
            <span style={{ fontWeight: 600 }}>Messages</span>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }} aria-label="Close">&times;</button>
          </div>
          <div style={{ flex: 1 }}>
            <CometChatConversations onItemClick={handleConversationClick} />
          </div>
        </div>

        {/* Message view */}
        {hasSelection && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {selectedUser && <CometChatMessageHeader user={selectedUser} />}
            {selectedGroup && <CometChatMessageHeader group={selectedGroup} />}
            <div style={{ flex: 1, overflow: "hidden" }}>
              {selectedUser && <CometChatMessageList user={selectedUser} hideReplyInThreadOption />}
              {selectedGroup && <CometChatMessageList group={selectedGroup} hideReplyInThreadOption />}
            </div>
            {selectedUser && <CometChatMessageComposer user={selectedUser} />}
            {selectedGroup && <CometChatMessageComposer group={selectedGroup} />}
          </div>
        )}
      </div>
    </>
  );
}
```

---

## Floating widget

A button-in-the-corner chat overlay. Available on every page of the app
without a dedicated route. Common for support widgets, helpdesk chat,
"contact us" overlays.

**When to use:** chat is a secondary concern (not the core product), and
should be accessible from anywhere without navigating. **When NOT to use:**
if chat is central to the app, use a route placement instead — widgets
don't scale to inbox-style usage.

### Steps

#### 1. Create the ChatWidget component

```tsx
// src/components/ChatWidget.tsx (or components/ChatWidget.tsx in Next.js)
import { useState } from "react";
import {
  CometChatConversations,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<CometChat.User | CometChat.Group>();

  function handleConversationClick(conv: CometChat.Conversation) {
    const entity = conv.getConversationWith();
    if (entity instanceof CometChat.User || entity instanceof CometChat.Group) {
      setSelected(entity);
    }
  }

  return (
    <>
      {/* Floating trigger button — always visible */}
      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--cometchat-primary-color, #6c63ff)",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: 24,
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
          zIndex: 9999,
        }}
      >
        {open ? "×" : "💬"}
      </button>

      {/* Widget panel — overlay, not a full-page drawer */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 96,  // leave room for the button
            right: 24,
            width: "min(380px, calc(100vw - 48px))",
            height: "min(600px, calc(100vh - 120px))",
            background: "var(--cometchat-background-color-01, white)",
            border: "1px solid var(--cometchat-border-color-light, #eee)",
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9998,
          }}
        >
          {selected ? (
            <>
              <button
                onClick={() => setSelected(undefined)}
                style={{ alignSelf: "flex-start", background: "none", border: "none", padding: 12, cursor: "pointer" }}
              >
                ← Back
              </button>
              {selected instanceof CometChat.User && (
                <>
                  <CometChatMessageHeader user={selected} />
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <CometChatMessageList user={selected} hideReplyInThreadOption />
                  </div>
                  <CometChatMessageComposer user={selected} />
                </>
              )}
              {selected instanceof CometChat.Group && (
                <>
                  <CometChatMessageHeader group={selected} />
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <CometChatMessageList group={selected} hideReplyInThreadOption />
                  </div>
                  <CometChatMessageComposer group={selected} />
                </>
              )}
            </>
          ) : (
            <CometChatConversations onItemClick={handleConversationClick} />
          )}
        </div>
      )}
    </>
  );
}
```

**Key points:**
- Button and panel are both `position: fixed`. `z-index: 9999` / `9998` ensures they float above the app's content but don't conflict with modals (which typically go to `z-index: 10000+`).
- Width/height clamp against viewport (`min(...)`) so the widget shrinks gracefully on mobile. On screens < 428px you may want to switch to full-screen (`width: 100vw; height: 100vh; bottom: 0; right: 0`) — gate with a `useEffect` + `window.innerWidth` or CSS media query.
- The panel renders conversation list by default; clicking a conversation swaps to the single-thread view with a back arrow. Mirrors WhatsApp / iMessage widget UX.
- Wrap everything in `{open && (...)}` rather than animating transforms — the CometChat components subscribe to SDK events on mount, so keeping the panel in the tree when closed wastes resources.

#### 2. Mount at the app root

Where to mount depends on the framework. The widget must be a sibling (not a descendant) of the app's main layout so its fixed positioning escapes any overflow-hidden containers.

| Framework | Mount location |
|---|---|
| React (Vite / CRA) | `src/main.tsx` or `src/App.tsx`, sibling of `<Routes>` |
| Next.js App Router | `app/layout.tsx`, sibling of `{children}` (inside `<body>`, outside any main container with `overflow: hidden`) |
| Next.js Pages Router | `pages/_app.tsx`, sibling of `<Component />` |
| React Router | `app/root.tsx` (v7) or wherever `<Outlet />` lives (v6) |
| Astro | Inside a `client:only="react"` island in `src/layouts/BaseLayout.astro` |

**Example — Next.js App Router:**

```tsx
// app/layout.tsx
import ChatWidget from "@/components/ChatWidget";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
```

In the Pages Router and Vite cases, the provider (`CometChatProvider`) must wrap both the app content *and* the widget — otherwise the widget won't have access to the init'd SDK.

#### 3. Conditional rendering per route (optional)

Most apps want to hide the widget on auth pages (login, signup, password reset). Options:

**React Router / Next.js** — use `useLocation()` / `usePathname()`:

```tsx
// Wrap the export with a router-aware gate
import { useLocation } from "react-router-dom"; // or `usePathname` in Next.js

export default function ChatWidgetGate() {
  const pathname = useLocation().pathname;
  const hiddenOn = ["/login", "/signup", "/forgot-password"];
  if (hiddenOn.some((p) => pathname.startsWith(p))) return null;
  return <ChatWidget />;
}
```

**Astro** — render the island only on the pages that want it, rather than globally in the layout.

#### 4. Feature toggle via config

Record the choice in `.cometchat/config.json` so the integration skill knows the widget was used:

```bash
npx @cometchat/skills-cli config save --placement widget --json
```

**Do not invoke `cometchat add-widget`** — that's a v2 CLI command that writes a template-based widget. v3 skills write the widget directly using the pattern above, so it fits the project's existing code style. `add-widget` is retained only for backward compatibility with v2 integrations.

---

## Embedded placement

Chat embedded directly in an existing page, alongside other content. Common for marketplace product pages, dashboards, or support panels.

### Steps

#### 1. Create a ChatPanel component

The critical thing about embedded placement is the container MUST have an explicit height. CometChat components fill 100% of their container -- if the container has no height constraint, the components either collapse to zero or overflow the page.

```tsx
// ChatPanel.tsx
import { useEffect, useState } from "react";
import {
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

interface ChatPanelProps {
  targetUserId?: string;
  targetGroupId?: string;
  height?: string;       // e.g., "500px", "60vh"
  conversationMode?: boolean; // Show conversation list instead of single thread
}

export function ChatPanel({
  targetUserId,
  targetGroupId,
  height = "500px",
}: ChatPanelProps) {
  const [user, setUser] = useState<CometChat.User>();
  const [group, setGroup] = useState<CometChat.Group>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (targetUserId) {
      CometChat.getUser(targetUserId)
        .then((u) => {
          setUser(u);
          setGroup(undefined);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (targetGroupId) {
      CometChat.getGroup(targetGroupId)
        .then((g) => {
          setUser(undefined);
          setGroup(g);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [targetUserId, targetGroupId]);

  return (
    <div
      style={{
        height,
        display: "flex",
        flexDirection: "column",
        border: "1px solid #eee",
        borderRadius: "var(--cometchat-border-radius-lg, 8px)",
        overflow: "hidden",
      }}
    >
      {loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          Loading chat...
        </div>
      ) : (
        <>
          {user && <CometChatMessageHeader user={user} />}
          {group && <CometChatMessageHeader group={group} />}
          <div style={{ flex: 1, overflow: "hidden" }}>
            {user && <CometChatMessageList user={user} hideReplyInThreadOption />}
            {group && <CometChatMessageList group={group} hideReplyInThreadOption />}
          </div>
          {user && <CometChatMessageComposer user={user} />}
          {group && <CometChatMessageComposer group={group} />}
        </>
      )}
    </div>
  );
}
```

#### 2. Find the container in the existing page

**Read the existing page where chat should be embedded.** Understand the layout before adding anything. Common patterns:

- **Product page:** Chat panel below or beside the product description
- **Dashboard:** Chat panel in a sidebar or a dashboard card
- **Profile page:** Chat panel as a tab or section

#### 3. Render the panel with a target

Connect the target user/group based on the page's data:

```tsx
// Example: embedding on a product page
function ProductPage({ product }) {
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        {/* other product content */}
      </div>
      <div style={{ width: 400 }}>
        <h3>Chat with the seller</h3>
        <ChatPanel
          targetUserId={product.sellerId}
          height="500px"
        />
      </div>
    </div>
  );
}
```

#### 4. Conversation-list embedded panel

If you want an embedded panel with a conversation list (not just a single thread), use the multi-conversation composition from `cometchat-components` inside a container with explicit height:

```tsx
// EmbeddedInbox.tsx
import { useState } from "react";
import {
  CometChatConversations,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

interface EmbeddedInboxProps {
  height?: string;
}

export function EmbeddedInbox({ height = "600px" }: EmbeddedInboxProps) {
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
    <div style={{ height, display: "flex", border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ width: "300px", borderRight: "1px solid #eee" }}>
        <CometChatConversations onItemClick={handleConversationClick} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedUser && (
          <>
            <CometChatMessageHeader user={selectedUser} />
            <div style={{ flex: 1, overflow: "hidden" }}>
              <CometChatMessageList user={selectedUser} hideReplyInThreadOption />
            </div>
            <CometChatMessageComposer user={selectedUser} />
          </>
        )}
        {selectedGroup && (
          <>
            <CometChatMessageHeader group={selectedGroup} />
            <div style={{ flex: 1, overflow: "hidden" }}>
              <CometChatMessageList group={selectedGroup} hideReplyInThreadOption />
            </div>
            <CometChatMessageComposer group={selectedGroup} />
          </>
        )}
        {!selectedUser && !selectedGroup && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Hard rules

These rules apply to ALL placement patterns. Violating any of them causes integration bugs or destroys the user's existing project.

1. **NEVER replace the project's existing entry file** (`App.tsx`, `page.tsx`, `layout.tsx`, `main.tsx`, etc.) unless the user explicitly chose "demo mode." Replacing the entry file destroys all existing functionality.

2. **ALWAYS read the project's existing files before deciding where to put things.** Do not assume a project structure. Read the router config, the nav component, the layout files. Understand what exists before adding to it.

3. **ALWAYS create new files alongside existing ones.** Do not modify files you do not fully understand. The exceptions are:
   - The router config (to add a route) -- read it first
   - The nav component (to add a link) -- read it first
   - The root CSS file (to add the css-variables.css import) -- read it first

4. **CometChat CSS must be imported exactly once.** Before adding the import, check if it already exists:
   ```bash
   grep -r "css-variables.css" src/ app/ pages/ 2>/dev/null
   ```
   If it is already imported, do not add a duplicate.

5. **CometChatProvider or init must be at the app root**, not inside a modal/drawer/panel. Re-initializing on every open causes flicker, dropped WebSocket connections, and race conditions.

6. **Every CometChat container must have explicit dimensions.** Components fill 100% of their parent. If the parent has no height, the components collapse to zero. Always set `height`, `min-height`, or use flex/grid layout with a bounded container.

7. **Resolve target users/groups before rendering CometChat components.** Use `CometChat.getUser(uid)` or `CometChat.getGroup(guid)` to get the full `CometChat.User` or `CometChat.Group` object. Do not pass a raw UID string to `user` props -- they expect object instances.

8. **For SSR frameworks, wrap CometChat components appropriately.** See the `cometchat-core` skill, section 5 (SSR safety), for framework-specific patterns.

9. **Every `<CometChatMessageList>` MUST include `hideReplyInThreadOption`** unless the integration also wires a thread panel (`CometChatThreadHeader` + scoped `MessageList` + scoped `MessageComposer` with `parentMessageId`). The kit's default (`false`) puts a "Reply in Thread" entry in the message action menu that silently does nothing when no panel is wired. Drawer, widget, modal, and embed patterns never wire a thread panel, so the prop is mandatory there. Two-pane route patterns (full messenger, social) MAY omit it if-and-only-if they implement the full thread-panel plumbing; otherwise keep it. Writing `<CometChatMessageList user={user} />` without the prop in a drawer or widget is a generation bug — every example in this skill includes it for a reason.

10. **Never animate a CometChat-containing element with `transform`, `translate-*`, or any `transition-transform`.** This includes:
    - Inline `transform: translateX(...)`, `transform: scale(...)`, etc.
    - Tailwind utilities `translate-x-*`, `-translate-x-*`, `translate-x-0`, `translate-x-full`, `translate-y-*`, `scale-*`, `rotate-*`, `skew-*`, `transform-*`
    - `transition-transform`, `motion-safe:translate-*`, `will-change: transform`
    - `filter`, `perspective`, `backdrop-filter`

    Any of these creates a new containing block for `position: fixed` descendants, which reparents CometChat's fixed-positioned popovers (emoji picker, message options menu, file preview, reactions popover, thread panel) to the animated container instead of the viewport. Animate the `right` / `left` offset instead (inline: `right: isOpen ? 0 : '-420px'`; Tailwind: `right-0` / `right-[-420px]` with `transition-[right]`). See `cometchat-core` § 8 anti-pattern 11 for the full CSS-spec explanation.
