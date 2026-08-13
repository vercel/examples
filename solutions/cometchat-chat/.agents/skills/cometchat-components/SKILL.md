---
name: cometchat-components
description: "Complete catalog of CometChat React UI Kit v6 components. Reference before writing integration code -- never invent component names."
license: "MIT"
compatibility: "@cometchat/chat-uikit-react ^6; @cometchat/chat-sdk-javascript ^4"
allowed-tools: "executeBash, readFile, fileSearch, listDirectory"
metadata:
  author: "CometChat"
  version: "3.0.0"
  tags: "chat cometchat react components catalog reference ui-kit"
---

## Purpose

This is the single source of truth for CometChat React UI Kit v6 component names, props, and usage. **Check this catalog before writing any `<CometChat*>` JSX.** If a component is not listed here, it does not exist in the exported API.

All components are imported from `@cometchat/chat-uikit-react`. All SDK types are imported from `@cometchat/chat-sdk-javascript`.

### Importing `CometChat.User` / `CometChat.Group` / etc.

`CometChat.User`, `CometChat.Group`, `CometChat.BaseMessage`, `CometChat.Conversation`, `CometChat.GroupMember`, `CometChat.TextMessage` are **classes** (runtime values), not pure types. That means the import strategy depends on how you use them:

**Pattern A — you call the class as a value or use it with `instanceof`.** Use a plain value import:

```tsx
import { CometChat } from "@cometchat/chat-sdk-javascript";

if (entity instanceof CometChat.User) { ... }
const user = await CometChat.getUser(uid);
```

**Pattern B — you use it only as a type annotation, nowhere else.** Two options:

```tsx
// Option 1: value import, reference the type via the namespace — TS lets this slide
// because CometChat is a class-namespace
import { CometChat } from "@cometchat/chat-sdk-javascript";
function renderHeader(user: CometChat.User) { ... }

// Option 2: explicit type-only import
import type { CometChat } from "@cometchat/chat-sdk-javascript";
function renderHeader(user: CometChat.User) { ... }
```

**Do NOT mix these.** If you write `import type { CometChat }` and then try `entity instanceof CometChat.User`, TypeScript strips the import at compile time and the code throws at runtime. If you write `import { CometChat }` but only reference `CometChat.User` as a type, `noUnusedLocals` can flag it (TS6133).

**Safest default:** use the plain value import (`import { CometChat }`). It always works; the TS6133 warning only fires in strict `noUnusedLocals` configs and can be fixed by actually using the runtime value (e.g. `instanceof CometChat.User`) or by adding an `eslint-disable-next-line` if you truly only need the type.

---

## 1. Core messaging

These are the components you use to build a chat experience. Most integrations use some combination of these seven.

### CometChatConversations

Renders a scrollable list of the logged-in user's conversations (both 1:1 and group).

**Key props:**
| Prop | Type | Description |
|---|---|---|
| `activeConversation` | `CometChat.Conversation` | Highlights the currently selected conversation |
| `onItemClick` | `(conversation: CometChat.Conversation) => void` | Called when the user taps a conversation |
| `showSearchBar` | `boolean` | Shows a basic name-filter search bar above the list |
| `onSearchBarClicked` | `() => void` | Called when the search bar is clicked (use to swap in `CometChatSearch` for full search) |
| `conversationsRequestBuilder` | `CometChat.ConversationsRequestBuilder` | Customize which conversations to fetch (filters, limits) |

**Usage:**
```tsx
<CometChatConversations
  activeConversation={activeConversation}
  onItemClick={(conversation) => setActiveConversation(conversation)}
/>
```

**Works with:** CometChatMessageHeader, CometChatMessageList, CometChatMessageComposer (two-pane layout)

---

### CometChatMessageList

Renders messages for a specific user or group conversation. Supports threaded views via `parentMessageId`.

**Key props:**
| Prop | Type | Description |
|---|---|---|
| `user` | `CometChat.User` | Show messages with this user (mutually exclusive with `group`) |
| `group` | `CometChat.Group` | Show messages in this group (mutually exclusive with `user`) |
| `parentMessageId` | `number` | If set, shows only replies to this message (thread view) |
| `templates` | `CometChatMessageTemplate[]` | Custom message bubble templates |
| `messagesRequestBuilder` | `CometChat.MessagesRequestBuilder` | Customize message fetching |

**Usage:**
```tsx
<CometChatMessageList user={selectedUser} />
```

**Works with:** CometChatMessageHeader (above), CometChatMessageComposer (below)

---

### CometChatMessageComposer

A text input with send button, attachment options, and emoji support. Sends messages to the specified user or group.

**Key props:**
| Prop | Type | Description |
|---|---|---|
| `user` | `CometChat.User` | Send messages to this user (mutually exclusive with `group`) |
| `group` | `CometChat.Group` | Send messages to this group (mutually exclusive with `user`) |
| `parentMessageId` | `number` | If set, sends replies to this message (thread mode) |
| `onSendButtonClick` | `(message: CometChat.BaseMessage) => void` | Called when send is clicked |

**Usage:**
```tsx
<CometChatMessageComposer user={selectedUser} />
```

**Works with:** CometChatMessageList (above), CometChatMessageHeader (at top of message area)

---

### CometChatCompactMessageComposer

A rich-text variant of the message composer with formatting toolbar (bold, italic, code, etc.). Same props as CometChatMessageComposer.

**Key props:**
| Prop | Type | Description |
|---|---|---|
| `user` | `CometChat.User` | Send messages to this user |
| `group` | `CometChat.Group` | Send messages to this group |
| `parentMessageId` | `number` | Thread mode |
| `onSendButtonClick` | `(message: CometChat.BaseMessage) => void` | Called on send |

**Usage:**
```tsx
<CometChatCompactMessageComposer user={selectedUser} />
```

**Works with:** Same as CometChatMessageComposer -- drop-in replacement for rich text

---

### CometChatMessageHeader

Displays the name, avatar, and status of the user or group at the top of a message view. Supports a menu slot and search.

**Key props:**
| Prop | Type | Description |
|---|---|---|
| `user` | `CometChat.User` | Show header for this user |
| `group` | `CometChat.Group` | Show header for this group |
| `onItemClick` | `() => void` | Called when the header info area is clicked (use to open details panel) |
| `onBack` | `() => void` | Called when back button is clicked |
| `auxiliaryButtonView` | `JSX.Element` | Custom button area (e.g., CometChatCallButtons) |
| `showBackButton` | `boolean` | Show a back button (for mobile/nested views) |
| `showSearchOption` | `boolean` | Show a search icon in the header |
| `onSearchOptionClicked` | `() => void` | Called when search icon is clicked |
| `hideVideoCallButton` | `boolean` | Hide the video call button |
| `hideVoiceCallButton` | `boolean` | Hide the voice call button |

**Usage:**
```tsx
<CometChatMessageHeader
  user={selectedUser}
  onItemClick={() => setShowDetails(true)}
  auxiliaryButtonView={<CometChatCallButtons user={selectedUser} />}
/>
```

**Works with:** CometChatMessageList (below), CometChatCallButtons (in auxiliaryButtonView slot)

---

### CometChatSearch

Full-featured dual-scope search: searches across conversations AND messages with filter chips. This is the primary search component.

**Key props:**
| Prop | Type | Description |
|---|---|---|
| `onConversationClicked` | `(conversation: CometChat.Conversation) => void` | Called when a conversation result is clicked |
| `onMessageClicked` | `(message: CometChat.BaseMessage) => void` | Called when a message result is clicked |

**Usage:**
```tsx
<CometChatSearch
  onConversationClicked={(conv) => navigateToConversation(conv)}
  onMessageClicked={(msg) => scrollToMessage(msg)}
/>
```

**Works with:** CometChatConversations (replaces the list when search is active)

> **Hard rule — never roll your own search.** Any request involving
> "search", "find messages", "search conversations", or "search across
> conversations" MUST use `<CometChatSearch>` (or `showSearchBar={true}`
> + `onSearchBarClicked` on `CometChatConversations` to swap into
> `<CometChatSearch>` on click). Do NOT build custom `<input type="search">`
> bars, hand-rolled result lists, or filter UIs — they bypass the SDK's
> pagination, highlighting, and dual-scope (conversations + messages)
> matching that ship with the built-in component.

---

### CometChatThreadHeader

Header bar for a threaded message view. Shows the parent message and a close button.

**Key props:**
| Prop | Type | Description |
|---|---|---|
| `parentMessage` | `CometChat.BaseMessage` | The message that started the thread |
| `onClose` | `() => void` | Called when the user closes the thread view |

**Usage:**
```tsx
<CometChatThreadHeader
  parentMessage={threadParentMessage}
  onClose={() => setThreadParent(null)}
/>
```

**Works with:** CometChatMessageList (with `parentMessageId`), CometChatMessageComposer (with `parentMessageId`)

---

## 2. Lists and selection

Components for browsing and selecting users, groups, and group members.

### CometChatUsers

A scrollable list of users. Used for starting new conversations or browsing the user directory.

**Key props:**
| Prop | Type | Description |
|---|---|---|
| `onItemClick` | `(user: CometChat.User) => void` | Called when a user is selected |
| `usersRequestBuilder` | `CometChat.UsersRequestBuilder` | Customize which users to fetch |

**Usage:**
```tsx
<CometChatUsers onItemClick={(user) => startConversation(user)} />
```

**Works with:** CometChatMessageHeader, CometChatMessageList, CometChatMessageComposer (after selection)

---

### CometChatGroups

A scrollable list of groups. Used for browsing and joining groups.

**Key props:**
| Prop | Type | Description |
|---|---|---|
| `onItemClick` | `(group: CometChat.Group) => void` | Called when a group is selected |
| `groupsRequestBuilder` | `CometChat.GroupsRequestBuilder` | Customize which groups to fetch |

**Usage:**
```tsx
<CometChatGroups onItemClick={(group) => openGroup(group)} />
```

**Works with:** CometChatMessageHeader, CometChatMessageList, CometChatMessageComposer (after selection)

---

### CometChatGroupMembers

Displays members of a specific group with their roles (owner, admin, member).

**Key props:**
| Prop | Type | Description |
|---|---|---|
| `group` | `CometChat.Group` | The group whose members to display (required) |
| `onItemClick` | `(member: CometChat.GroupMember) => void` | Called when a member is selected |

**Usage:**
```tsx
<CometChatGroupMembers group={selectedGroup} />
```

**Works with:** Group details panel, CometChatGroups

---

### CometChatSearchBar

A standalone search input component. Used for filtering within other components.

**Key props:**
| Prop | Type | Description |
|---|---|---|
| `onSearch` | `(text: string) => void` | Called as the user types |
| `text` | `string` | Controlled input value |

**Usage:**
```tsx
<CometChatSearchBar onSearch={(text) => filterUsers(text)} />
```

**Works with:** Any list component for client-side filtering

---

## 3. Calls

Components for voice and video calling.

### CometChatCallButtons

Renders voice and video call buttons. Typically placed in the `auxiliaryButtonView` prop of CometChatMessageHeader.

**Key props:**
| Prop | Type | Description |
|---|---|---|
| `user` | `CometChat.User` | Call this user |
| `group` | `CometChat.Group` | Call this group |
| `hideVideoCallButton` | `boolean` | Hide the video call button |
| `hideVoiceCallButton` | `boolean` | Hide the voice call button |

**Usage:**
```tsx
<CometChatCallButtons user={selectedUser} />
```

**Works with:** CometChatMessageHeader (in `menu` prop), CometChatIncomingCall (at app root)

---

### CometChatIncomingCall

Renders an incoming call notification overlay. Mount this at the app root so it can show incoming calls from any screen.

**Key props:** None required -- it auto-listens for incoming call events.

**Usage:**
```tsx
// At your app root, always mounted:
<CometChatIncomingCall />
```

**Works with:** CometChatCallButtons (triggers outgoing calls that the other user sees as incoming)

---

### CometChatOutgoingCall

Renders the outgoing call screen (ringing state). Automatically shown when the user initiates a call.

**Key props:** None required -- auto-triggered by call initiation.

**Usage:**
```tsx
<CometChatOutgoingCall />
```

**Works with:** CometChatCallButtons

---

### CometChatOngoingCall

Renders the active call screen with video feeds, mute/unmute, and hang-up controls.

**Key props:** None required -- auto-triggered when a call connects.

**Usage:**
```tsx
<CometChatOngoingCall />
```

**Works with:** CometChatIncomingCall, CometChatOutgoingCall

---

### CometChatCallLogs

Displays a history of past voice and video calls.

**Key props:** None required for basic usage.

**Usage:**
```tsx
<CometChatCallLogs />
```

**Works with:** Tab-based layouts (as one of the tabs alongside Conversations, Users, Groups)

---

## 4. Interactions

Components for message reactions and emoji.

### CometChatReactions

Displays reaction badges on a message (e.g., thumbs-up x3). Automatically rendered inside message bubbles when reactions are enabled.

**Key props:** Typically used internally by the message list. Not usually instantiated directly.

---

### CometChatReactionList

Shows a detailed list of who reacted with what emoji on a specific message.

**Key props:** Used internally. Shown when the user clicks on a reaction badge.

---

### CometChatEmojiKeyboard

A full emoji picker. Automatically rendered inside the message composer when the emoji button is clicked.

**Key props:** Used internally by CometChatMessageComposer. Not usually instantiated directly.

---

### CometChatReactionInfo

Tooltip or popover showing reaction details on hover.

**Key props:** Used internally by the message list. Not usually instantiated directly.

---

## 5. AI

AI-powered assistant components. These require AI features (Smart Chat Features) to be enabled in your CometChat dashboard at **Chat & Messaging → Features → Smart Chat Features**.

### CometChatAIAssistantChat

An AI chatbot interface that users can interact with for automated responses. Typically rendered inside a panel or modal triggered from the message header.

**Prerequisites:** Enable "Conversation Starter" and/or "Smart Replies" in the dashboard.

**Usage:**
```tsx
<CometChatAIAssistantChat />
```

---

### CometChatAIAssistantChatHistory

Displays past AI assistant interactions. Used alongside `CometChatAIAssistantChat` to show conversation history with the AI.

**Usage:**
```tsx
<CometChatAIAssistantChatHistory />
```

---

### CometChatAIAssistantTools

Renders AI tool options (summarize conversation, translate message, etc.) that can be applied to messages or conversations.

**Prerequisites:** Enable "Conversation Summary" and/or other AI tools in the dashboard.

**Usage:**
```tsx
<CometChatAIAssistantTools />
```

> **Note:** For detailed props, configuration options, and customization of AI components, query the docs MCP — these components' APIs evolve with CometChat's AI feature releases.

### CometChatStreamMessageBubble

Renders a streaming AI message with a typing animation effect. Used internally by AI assistant features.

### CometChatAIAssistantMessageBubble

Renders AI assistant response bubbles with special formatting. Used internally by AI features.

---

## 5b. Moderation and utility components

These are exported but typically rendered internally by the kit. You may need them for advanced customization.

### CometChatFlagMessageDialog

A dialog for reporting/flagging messages. Rendered internally when a user reports a message.

### CometChatMessageInformation

Shows message delivery and read receipt details (who received, who read, timestamps). Useful for building a message info panel.

---

## 5c. Text formatters

These are not React components — they are formatter classes that customize how text is rendered in message bubbles. Pass them via the `textFormatters` prop on `CometChatMessageList`.

| Formatter | Purpose |
|---|---|
| `CometChatTextFormatter` | Base class for custom formatters |
| `CometChatUrlsFormatter` | Auto-links URLs in messages |
| `CometChatMentionsFormatter` | Renders @mentions with styling + click handlers |
| `CometChatTextHighlightFormatter` | Highlights search terms in messages |
| `CometChatRichTextFormatter` | Renders rich text (bold, italic, etc.) |
| `CometChatMarkdownFormatter` | Renders markdown syntax in messages |

All imported from `@cometchat/chat-uikit-react`. To customize text rendering, create a class extending `CometChatTextFormatter` and pass it in the `textFormatters` array.

---

## 6. Infrastructure

These are not visual components -- they handle initialization, login state, and configuration.

### CometChatUIKit

The main entry point for initialization and authentication. This is a static class, not a React component.

**Key methods:**
| Method | Description |
|---|---|
| `CometChatUIKit.init(settings)` | Initialize the SDK. Returns a Promise. Must be called once before any component renders. |
| `CometChatUIKit.login(uid)` | Log in with a user ID (dev mode). Returns `Promise<CometChat.User>`. Safe to call after a prior login completes (no-op), but **not concurrently** — two overlapping calls throw *"Please wait until the previous login request ends."* Use `cometchat-core`'s `ensureLoggedIn` helper to dedupe. |
| `CometChatUIKit.loginWithAuthToken(token)` | Log in with an auth token (production). Returns `Promise<CometChat.User>`. |
| `CometChatUIKit.getLoggedinUser()` | Get the currently logged-in user. Returns `Promise<CometChat.User \| null>`. |
| `CometChatUIKit.logout()` | Log out the current user. Returns a Promise. |
| `CometChatUIKit.createUser(user)` | Create a CometChat user (requires Auth Key). For server-side user management, see `cometchat-production`. |
| `CometChatUIKit.updateUser(user)` | Update a CometChat user (requires Auth Key). |
| `CometChatUIKit.isInitialized()` | Returns `boolean` — whether `init()` has been called. |

**Usage** (bare-API illustration — in real code, wrap `login` in an
in-flight guard so React StrictMode doesn't fire it twice; see
`cometchat-core` § 2 for the `ensureLoggedIn` helper):
```typescript
import { CometChatUIKit } from "@cometchat/chat-uikit-react";

await CometChatUIKit.init(settings);
await CometChatUIKit.login("cometchat-uid-1");
```

---

### CometChatUIKitLoginListener

Tracks the logged-in user synchronously. Unlike `CometChatUIKit.getLoggedinUser()` (which is async/Promise-based), this provides **synchronous** access to the current user — useful for guards and conditional rendering.

**Key methods:**
| Method | Description |
|---|---|
| `CometChatUIKitLoginListener.getLoggedInUser()` | Returns the currently logged-in `CometChat.User` synchronously, or `null` |

**When to use which:**
- `CometChatUIKit.getLoggedinUser()` — async, returns a Promise. Use in `useEffect` or async functions.
- `CometChatUIKitLoginListener.getLoggedInUser()` — synchronous. Use for immediate checks (e.g., redirect if not logged in, guard a route).

---

### UIKitSettingsBuilder

Builder class for creating the settings object passed to `CometChatUIKit.init()`.

**Key methods:**
| Method | Description |
|---|---|
| `.setAppId(appId: string)` | Set the CometChat app ID (required) |
| `.setRegion(region: string)` | Set the region: `"us"`, `"eu"`, or `"in"` (required) |
| `.setAuthKey(authKey: string)` | Set the auth key (required for `login(uid)` in dev mode) |
| `.subscribePresenceForAllUsers()` | Enable presence (online/offline) for all users |
| `.subscribePresenceForFriends()` | Enable presence only for friends list |
| `.subscribePresenceForRoles(roles)` | Enable presence for specific user roles |
| `.setAutoEstablishSocketConnection(bool)` | Control WebSocket auto-connect (default: true) |
| `.setAdminHost(host)` | Override admin URL (dedicated deployments only) |
| `.setClientHost(host)` | Override client URL (dedicated deployments only) |
| `.build()` | Returns the settings object |

**Usage:**
```typescript
import { UIKitSettingsBuilder } from "@cometchat/chat-uikit-react";

const settings = new UIKitSettingsBuilder()
  .setAppId("your-app-id")
  .setRegion("us")
  .setAuthKey("your-auth-key")
  .subscribePresenceForAllUsers()
  .build();
```

---

## Composition patterns

These are the standard ways to combine CometChat components into complete
experiences. Use these as starting points, then customize with props.

> **Composer note:** Both `CometChatMessageComposer` and
> `CometChatCompactMessageComposer` exist. The compact variant includes
> rich text editing by default. The sample app uses the compact variant
> everywhere. Use whichever fits — the props are identical.

### Multi-conversation (two-pane)

The most common pattern. A conversation list on the left, message view on the right.

**Key details from the v6 sample app:**
- Store the full `CometChat.Conversation` object (not just user/group) — you need it for `activeConversation` highlighting and conversation-level operations
- Pass `activeConversation` to `CometChatConversations` so the selected item is visually highlighted
- Derive user/group from the conversation at render time using `getConversationWith()`

```tsx
import { useState } from "react";
import {
  CometChatConversations,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

function MultiConversation() {
  const [activeConversation, setActiveConversation] = useState<CometChat.Conversation>();

  // Derive user/group from the active conversation
  const entity = activeConversation?.getConversationWith();
  const selectedUser = entity instanceof CometChat.User ? entity : undefined;
  const selectedGroup = entity instanceof CometChat.Group ? entity : undefined;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "360px", borderRight: "1px solid #eee" }}>
        <CometChatConversations
          activeConversation={activeConversation}
          onItemClick={(conv) => setActiveConversation(conv)}
        />
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

### Single thread

One chat window for a known user or group. No conversation list.

```tsx
import {
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

interface SingleThreadProps {
  user?: CometChat.User;
  group?: CometChat.Group;
}

function SingleThread({ user, group }: SingleThreadProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {user && <CometChatMessageHeader user={user} />}
      {group && <CometChatMessageHeader group={group} />}
      {user && <CometChatMessageList user={user} />}
      {group && <CometChatMessageList group={group} />}
      {user && <CometChatMessageComposer user={user} />}
      {group && <CometChatMessageComposer group={group} />}
    </div>
  );
}
```

To target a specific user, resolve them first:

```tsx
const [targetUser, setTargetUser] = useState<CometChat.User>();

useEffect(() => {
  CometChat.getUser("seller-uid-123").then(setTargetUser);
}, []);

if (!targetUser) return null;
return <SingleThread user={targetUser} />;
```

---

### Full messenger (tab-based)

A tab bar with Chats, Calls, Users, and Groups. Users can browse, start conversations, and make calls.

```tsx
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

function FullMessenger() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [activeConversation, setActiveConversation] = useState<CometChat.Conversation>();
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
      <div style={{ width: "360px", display: "flex", flexDirection: "column" }}>
        {/* Tab content */}
        <div style={{ flex: 1 }}>
          {activeTab === "chats" && (
            <CometChatConversations
              activeConversation={activeConversation}
              onItemClick={(conv) => {
                setActiveConversation(conv);
                const entity = conv.getConversationWith();
                if (entity instanceof CometChat.User) selectUser(entity);
                else if (entity instanceof CometChat.Group) selectGroup(entity);
              }}
            />
          )}
          {activeTab === "calls" && (
            <CometChatCallLogs
              onItemClick={(call) => {
                // Call log items show call details, not a message view.
                // Use the call's participants to start a new call or
                // navigate to the conversation.
              }}
            />
          )}
          {activeTab === "users" && (
            <CometChatUsers
              activeUser={selectedUser}
              onItemClick={selectUser}
            />
          )}
          {activeTab === "groups" && (
            <CometChatGroups
              activeGroup={selectedGroup}
              onItemClick={selectGroup}
            />
          )}
        </div>
        {/* Tab bar at the bottom */}
        <div style={{ display: "flex", borderTop: "1px solid #eee" }}>
          {(["chats", "calls", "users", "groups"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ flex: 1, padding: 12, fontWeight: activeTab === tab ? "bold" : "normal" }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
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

### Threading

Threading is NOT automatic. The kit's **default** is `hideReplyInThreadOption={false}` — so a "Reply in Thread" entry shows up in every message's action menu out of the box, **even when the integrator hasn't wired a thread panel**. A user who clicks it sees nothing happen. That's why every `<CometChatMessageList>` in the `cometchat-placement` patterns uses `hideReplyInThreadOption` by default.

**To enable threading** in an experience that has room for a thread panel (typically a two-pane messenger or route-based chat — not a compact drawer or widget):

1. Remove the `hideReplyInThreadOption` prop from the main `CometChatMessageList`.
2. Wire `onThreadRepliesClick` to capture the thread message (pattern below).
3. Render the thread panel as a side panel or overlay. The thread panel has its OWN `CometChatMessageList` + `CometChatMessageComposer` scoped via `parentMessageId`.

Full pattern:

```tsx
import { useState } from "react";
import {
  CometChatMessageList,
  CometChatMessageComposer,
  CometChatThreadHeader,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

// 1. In your main message view, capture the thread click:
<CometChatMessageList
  user={selectedUser}
  onThreadRepliesClick={(message: CometChat.BaseMessage) => {
    setThreadMessage(message);
    setShowThread(true);
  }}
/>

// 2. Render the thread panel as a side panel:
interface ThreadPanelProps {
  parentMessage: CometChat.BaseMessage;
  user?: CometChat.User;
  group?: CometChat.Group;
  onClose: () => void;
}

function ThreadPanel({ parentMessage, user, group, onClose }: ThreadPanelProps) {
  const parentId = parentMessage.getId();

  return (
    <div style={{ width: "400px", display: "flex", flexDirection: "column", borderLeft: "1px solid #eee" }}>
      <CometChatThreadHeader parentMessage={parentMessage} onClose={onClose} />
      {user && <CometChatMessageList user={user} parentMessageId={parentId} />}
      {group && <CometChatMessageList group={group} parentMessageId={parentId} />}
      {user && <CometChatMessageComposer user={user} parentMessageId={parentId} />}
      {group && <CometChatMessageComposer group={group} parentMessageId={parentId} />}
    </div>
  );
}
```

**Key details:**
- `onThreadRepliesClick` receives the full `CometChat.BaseMessage` (not just an ID)
- `CometChatThreadHeader` shows the parent message content + close button
- The scoped `CometChatMessageList` with `parentMessageId` shows only thread replies
- The scoped `CometChatMessageComposer` with `parentMessageId` sends replies to the thread

---

### Search integration

Search overlays **alongside** the conversation list — it does NOT replace it. The conversations list stays mounted; search appears as a sibling panel.

**Global search (across all conversations):**

```tsx
import { useState } from "react";
import { CometChatConversations, CometChatSearch } from "@cometchat/chat-uikit-react";

function ConversationsWithSearch({ onSelectConversation }) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      {/* Conversations always stay mounted */}
      <CometChatConversations
        showSearchBar={true}
        onSearchBarClicked={() => setShowSearch(true)}
        activeConversation={activeConversation}
        onItemClick={onSelectConversation}
      />

      {/* Search overlays on top when active */}
      {showSearch && (
        <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "#fff" }}>
          <CometChatSearch
            onConversationClicked={(conv) => {
              setShowSearch(false);
              onSelectConversation(conv);
            }}
            onMessageClicked={(msg) => {
              setShowSearch(false);
              // navigate to the message's conversation
            }}
          />
        </div>
      )}
    </div>
  );
}
```

**In-conversation search (within the active chat):**

```tsx
// Add search button to the message header:
<CometChatMessageHeader
  user={selectedUser}
  showSearchOption={true}
  onSearchOptionClicked={() => setShowMessageSearch(true)}
/>

// Show CometChatSearch scoped to the current user/group:
{showMessageSearch && (
  <CometChatSearch
    uid={selectedUser?.getUid()}
    guid={selectedGroup?.getGuid()}
    onMessageClicked={(msg) => {
      setShowMessageSearch(false);
      // scroll to the message in the message list
    }}
  />
)}
```

---

### Details panel

User and group detail panels are **custom-built** — there is no pre-built `CometChatUserDetails` or `CometChatGroupDetails` export in the UI Kit. The v6 sample app has reference implementations at `sample-app/src/components/CometChatDetails/`.

**For user details:** build a custom component using `CometChatAvatar` + user info + action buttons (block/unblock). Fetch the pattern from the sample app's `CometChatUserDetails.tsx`.

**For group details:** build a custom component and use these real UI Kit components inside it:

```tsx
// Open details from the message header:
<CometChatMessageHeader
  user={selectedUser}
  group={selectedGroup}
  onItemClick={() => setShowDetails(true)}
/>

// Group details panel uses real kit components:
{showDetails && selectedGroup && (
  <div style={{ width: "320px", borderLeft: "1px solid #eee" }}>
    {/* CometChatGroupMembers is a real kit component */}
    <CometChatGroupMembers
      group={selectedGroup}
      onItemClick={(member) => {
        // Switch to 1:1 chat with this member
      }}
    />
    {/* CometChatBannedMembers is a real kit component */}
  </div>
)}
```

**Important:** `CometChatGroupMembers` requires the `group` prop (it's the only required prop). The component handles member listing, search, scope changes, kick, and ban actions internally.

---

### Calls integration

Add voice/video calling to your message view, plus incoming call handling at the app root.

```tsx
// 1. Add call buttons to the message header:
<CometChatMessageHeader
  user={selectedUser}
  auxiliaryButtonView={<CometChatCallButtons user={selectedUser} />}
/>

// 2. Mount incoming call handler at the app root (outside any route):
function App() {
  return (
    <>
      <CometChatIncomingCall />
      <Routes>
        {/* your routes */}
      </Routes>
    </>
  );
}
```

`CometChatIncomingCall` must be mounted at the top level so it can show the incoming call overlay regardless of which page the user is on. `CometChatOutgoingCall` and `CometChatOngoingCall` are automatically rendered by the call flow.
