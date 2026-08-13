# CometChat React UI Kit v6 — Component Catalog

> **Validated against:** `@cometchat/chat-uikit-react@6.x` (April 2026)
> **Drift test:** `packages/cli/test/component-catalog.test.ts` fails
> if any component in this catalog no longer exists in the installed
> package, or if the installed package exports components not listed here.

**Read this file BEFORE writing any code.** If the user's request maps
to an entry in this catalog, use it. Don't hand-roll, don't query the
docs MCP, just use the component listed here.

---

## A. Exported components from `@cometchat/chat-uikit-react`

### Core — the building blocks of a chat integration

| Component | What it renders | Key props / notes |
|---|---|---|
| `CometChatConversations` | Conversation list (left panel) | `showSearchBar`, `onSearchBarClicked`, `onItemClick`, `conversationsRequestBuilder`, `headerView`, `emptyStateView`, `activeConversation` |
| `CometChatMessageList` | Message thread (the main chat area) | `user` / `group`, `parentMessageId` (for threads), `messagesRequestBuilder`, `onThreadRepliesClick`, `templates` (custom bubbles), `emptyStateView`, `goToMessageId` (scroll to a message), `textFormatters` (e.g. `CometChatTextHighlightFormatter` for search highlighting), `startFromUnreadMessages`, `showMarkAsUnreadOption` |
| `CometChatMessageComposer` | Message input + send button | `user` / `group`, `parentMessageId` (for threads), `text`, `onSendButtonClick`, `headerView`, `secondaryButtonView` |
| `CometChatCompactMessageComposer` | Rich-text-enabled message composer | Same props as `CometChatMessageComposer` but includes rich text editing |
| `CometChatMessageHeader` | Header bar above message list | `user` / `group`, `onItemClick` (opens details panel), `onBack`, `auxiliaryButtonView` (custom buttons e.g. CometChatCallButtons), `showSearchOption`, `onSearchOptionClicked` |
| `CometChatUsers` | Users list | `usersRequestBuilder`, `onItemClick`, `selectionMode`, `showSearchBar` |
| `CometChatGroups` | Groups list | `groupsRequestBuilder`, `onItemClick`, `selectionMode`, `showSearchBar` |
| `CometChatGroupMembers` | Members list for a group | `group`, `onItemClick`, `selectionMode` |
| `CometChatSearch` | Advanced dual-scope search (conversations + messages with filter chips) | `onConversationClicked`, `onMessageClicked`, `onBack`, `searchIn`, `searchFilters` |
| `CometChatSearchBar` | Standalone search input (the bar itself, no results) | `onSearch`, `text`, `placeholderText` |
| `CometChatThreadHeader` | Thread header with parent message preview + reply count | `parentMessage`, `onClose` |

### Calls

| Component | What it renders |
|---|---|
| `CometChatCallButtons` | Voice + video call buttons (placed inside message header or standalone) |
| `CometChatIncomingCall` | Incoming call notification banner with accept/reject |
| `CometChatOutgoingCall` | Outgoing call screen with ringing indicator |
| `CometChatOngoingCall` | Active call view (video/audio, controls) |
| `CometChatCallLogs` | List of past calls with duration, type, timestamp |

### Reactions / Interactions

| Component | What it renders |
|---|---|
| `CometChatReactions` | Emoji reaction strip below a message bubble |
| `CometChatReactionList` | Full reaction list with who-reacted |
| `CometChatReactionInfo` | Tooltip/popover showing reaction details |
| `CometChatEmojiKeyboard` | Emoji picker grid |

### Message bubbles (used inside `CometChatMessageList` via `templates`)

| Bubble component | Content type |
|---|---|
| `CometChatTextBubble` | Text message |
| `CometChatImageBubble` | Image attachment |
| `CometChatVideoBubble` | Video attachment |
| `CometChatAudioBubble` | Audio attachment |
| `CometChatFileBubble` | Generic file attachment |
| `CometChatDocumentBubble` | Collaborative document |
| `CometChatCallBubble` | Call event message (missed, answered, etc.) |
| `CometChatActionBubble` | Action message (user joined, left, etc.) |
| `CometChatDeleteBubble` | Deleted message placeholder |
| `CometChatStreamMessageBubble` | Streaming / AI-generated message in progress |
| `CometChatAIAssistantMessageBubble` | AI assistant response bubble |

### AI features

| Component | What it renders |
|---|---|
| `CometChatAIAssistantChat` | AI assistant chat panel |
| `CometChatAIAssistantChatHistory` | Previous AI assistant conversations |
| `CometChatAIAssistantTools` | AI tool selection / function calling UI |

### Primitives / building blocks

| Component | What it renders |
|---|---|
| `CometChatAvatar` | User / group avatar (image + fallback initials) |
| `CometChatListItem` | Single row in any list (avatar + title + subtitle + tail) |
| `CometChatList` | Base scrollable list with loading/empty/error states |
| `CometChatDate` | Formatted date/time label |
| `CometChatButton` | Styled button |
| `CometChatCheckbox` | Checkbox input |
| `CometChatRadioButton` | Radio input |
| `CometChatDropDown` | Dropdown selector |

### Overlays / dialogs

| Component | What it renders |
|---|---|
| `CometChatActionSheet` | Bottom sheet with action list |
| `CometChatActions` | Inline action buttons |
| `CometChatActionsIcon` | Icon-triggered action menu |
| `CometChatActionsView` | View-slot for custom actions |
| `CometChatContextMenu` | Right-click / long-press context menu |
| `CometChatPopover` | Popover container |
| `CometChatConfirmDialog` | Confirmation dialog (OK / Cancel) |
| `CometChatFlagMessageDialog` | Report/flag message dialog |
| `CometChatToast` | Toast notification |
| `CometChatErrorView` | Error state view |
| `CometChatFullScreenViewer` | Full-screen media viewer (images, videos) |

### Group management

| Component | What it renders |
|---|---|
| `CometChatChangeScope` | Change a member's role (admin, moderator, member) |
| `CometChatUserMemberWrapper` | Wrapper for user+member context |

### Composer add-ons

| Component | What it renders |
|---|---|
| `CometChatEditPreview` | Edit-message preview above composer |
| `CometChatMessagePreview` | Reply-to-message preview above composer |
| `CometChatMediaRecorder` | Voice message recorder |
| `CometChatMessageInformation` | Message info (delivery, read receipts per-recipient) |

### Infrastructure (not rendered directly, but configured)

| Export | Purpose |
|---|---|
| `CometChatUIKit` | Initialization singleton: `CometChatUIKit.init()`, `.login()`, `.logout()` |
| `CometChatUIKitLoginListener` | Login state listener: `.getLoggedInUser()` |
| `CometChatUIKitCalls` | Calls plugin initialization |
| `CometChatLocalize` | i18n: `CometChatLocalize.setLanguage("fr")` |
| `CometChatFrameProvider` / `CometChatFrameContext` | React context for theme/locale propagation |

### Event emitters (subscribe to real-time updates)

| Export | Events for |
|---|---|
| `CometChatMessageEvents` | `ccMessageSent`, `ccMessageEdited`, `ccMessageDeleted`, `ccMessageRead` |
| `CometChatConversationEvents` | `ccConversationDeleted` |
| `CometChatGroupEvents` | `ccGroupMemberAdded`, `ccGroupMemberBanned`, `ccGroupLeft`, `ccOwnershipChanged` |
| `CometChatUserEvents` | `ccUserBlocked`, `ccUserUnblocked` |
| `CometChatCallEvents` | `ccCallAccepted`, `ccCallRejected`, `ccCallEnded`, `ccOutgoingCall` |
| `CometChatUIEvents` | UI-level events: `ccToggleBottomSheet`, `ccShowPanel`, etc. |

### Formatters (text processing for the composer + message list)

| Export | Purpose |
|---|---|
| `CometChatTextFormatter` | Base formatter class |
| `CometChatMarkdownFormatter` | Markdown → rich text |
| `CometChatMentionsFormatter` | @mention detection + popover |
| `CometChatRichTextFormatter` | Rich text rendering |
| `CometChatTextHighlightFormatter` | Keyword highlighting in search |
| `CometChatUrlsFormatter` | URL → clickable link |

### Config / template classes (not components, but used to configure them)

| Export | Purpose |
|---|---|
| `CometChatMessageTemplate` | Defines how a message type is rendered in the list |
| `CometChatMessageComposerAction` | Defines an action button in the composer |
| `CometChatMessageOption` | Defines a message-level option (reply, edit, delete, etc.) |
| `CometChatOption` | Generic option config |
| `CometChatSearchFilter` / `CometChatSearchScope` | Search filter + scope config for `CometChatSearch` |
| `CometChatUIKitConstants` / `CometChatUtilityConstants` | Constant enums (message types, categories, etc.) |

---

## B. Reference implementations in the v6 sample app

> **URL:** https://github.com/cometchat/cometchat-uikit-react/tree/v6/sample-app/src/components
> **CSS:** `sample-app/src/styles/<ComponentName>/`
> **CRITICAL:** the docs MCP does NOT index the sample app. Fetch from GitHub.

| Sample app component | What it implements | Files |
|---|---|---|
| `CometChatDetails/CometChatUserDetails.tsx` | User details panel (avatar, name, status, action items) | + `styles/CometChatDetails/CometChatUserDetails.css` |
| `CometChatDetails/CometChatThreadedMessages.tsx` | Threaded messages layout (header + nested message list + composer) | + `styles/CometChatDetails/CometChatThreadedMessages.css` |
| `CometChatHome/CometChatHome.tsx` | Top-level three-column layout assembling conversations + messages + side panels (details, threads) | + `styles/CometChatHome/CometChatHome.css` |
| `CometChatSelector/` | Left-panel selector (Chats / Calls / Users / Groups tabs) | + `styles/CometChatSelector/` |
| `CometChatMessages/` | Right-panel messages wrapper (header + list + composer) | + `styles/CometChatMessages/` |
| `CometChatSearchView/` | Full search view with filter chips | + `styles/CometChatSearchView/` |
| `CometChatCreateGroup/` | Create new group dialog (name, type, description, members) | + `styles/CometChatCreateGroup/` |
| `CometChatAddMembers/` | Add members to an existing group | + `styles/CometChatAddMembers/` |
| `CometChatBannedMembers/` | View/unban banned members of a group | + `styles/CometChatBannedMembers/` |
| `CometChatTransferOwnership/` | Transfer group ownership to another member | + `styles/CometChatTransferOwnership/` |
| `CometChatJoinGroup/` | Join a group with password prompt | + `styles/CometChatJoinGroup/` |
| `CometChatLogin/` | Login screen (UID input + submit) | + `styles/CometChatLogin/` |
| `CometChatCallLog/` | Call logs wrapper | + `styles/CometChatCallLog/` |
| `CometChatAlertPopup/` | Generic alert/confirmation modal | + `styles/CometChatAlertPopup/` |

---

## C. Task → component lookup

| User asks for | Use this (tier) | Notes |
|---|---|---|
| "conversation list" / "chat list" | `CometChatConversations` (A) | Already mounted in experience 1 template |
| "search conversations" / "add search bar" / "conversation search" | `showSearchBar={true}` + `onSearchBarClicked` on `CometChatConversations` (prop), swap in `<CometChatSearch>` when clicked | Always wire both props + the `CometChatSearch` swap for full dual-scope search. `showSearchBar` alone is only a basic name filter — not real search. |
| "message list" / "chat thread" | `CometChatMessageList` (A) | Already mounted in experience 1 template |
| "message input" / "composer" | `CometChatMessageComposer` (A) | Already mounted in experience 1 template |
| "rich text editing" | `CometChatCompactMessageComposer` (A) | Or use `apply-feature rich-text-formatting` CLI command |
| "header bar" / "conversation header" | `CometChatMessageHeader` (A) | Already mounted in experience 1 template |
| "user details panel" | `CometChatDetails/CometChatUserDetails.tsx` (B) | Wire via `onItemClick` on `CometChatMessageHeader` |
| "group details panel" | Group details inline in `CometChatHome.tsx` SideComponentGroup (B) | Wire via `onItemClick` on `CometChatMessageHeader` |
| "threaded replies" / "reply in thread" | `CometChatThreadHeader` (A) + `CometChatMessageList` with `parentMessageId` + `CometChatMessageComposer` with `parentMessageId` | Wire via `onThreadRepliesClick` on `CometChatMessageList` |
| "thread layout" (full panel) | `CometChatDetails/CometChatThreadedMessages.tsx` (B) | The sample app's threaded messages wrapper |
| "group members list" | `CometChatGroupMembers` (A) | Already exported |
| "add members to group" | `CometChatAddMembers/` (B) | Sample app pattern |
| "banned members" | `CometChatBannedMembers/` (B) | Sample app pattern; also uses `CometChatBannedMembers` (A) internally |
| "transfer group ownership" | `CometChatTransferOwnership/` (B) | Sample app pattern; also uses `CometChatTransferOwnership` (A) internally |
| "create group" | `CometChatCreateGroup/` (B) | Sample app pattern |
| "join group" | `CometChatJoinGroup/` (B) | Sample app pattern |
| "users list" / "browse users" | `CometChatUsers` (A) | With `usersRequestBuilder` for filtering |
| "groups list" / "browse groups" | `CometChatGroups` (A) | With `groupsRequestBuilder` for filtering |
| "voice / video call buttons" | `CometChatCallButtons` (A) | Place inside `CometChatMessageHeader`'s `auxiliaryButtonView` prop, or standalone |
| "incoming call notification" | `CometChatIncomingCall` (A) | Render at app root, always-mounted |
| "outgoing call screen" | `CometChatOutgoingCall` (A) | Triggered by `CometChatCallButtons` |
| "ongoing call / active call" | `CometChatOngoingCall` (A) | Full-screen call view |
| "call history" / "call logs" | `CometChatCallLogs` (A) + `CometChatCallLog/` (B) | |
| "emoji picker" | `CometChatEmojiKeyboard` (A) | Usually auto-rendered by `CometChatMessageComposer` |
| "reactions on messages" | `CometChatReactions` (A) | Already auto-rendered in `CometChatMessageList` — check `disableReactions` if missing |
| "message info" / "delivery receipts" | `CometChatMessageInformation` (A) | Triggered from message options menu |
| "filter conversations" | `conversationsRequestBuilder` prop on `CometChatConversations` (prop) | |
| "filter messages" | `messagesRequestBuilder` prop on `CometChatMessageList` (prop) | |
| "custom empty state" | `emptyStateView` prop on any list component (prop) | |
| "custom error state" | `errorStateView` prop on any list component (prop) | |
| "custom header above the list" | `headerView` prop on list components (prop) | |
| "custom message bubble" | `templates` prop on `CometChatMessageList` (prop) | NOT a custom bubble component — use `CometChatMessageTemplate` |
| "click handler on item / message" | `onItemClick` / `onMessageClick` / `onBack` / `onSearchBarClicked` (prop) | |
| "hide / disable a feature" | `disable*` boolean props on the relevant component (prop) | e.g. `disableReactions`, `disableTyping`, `disableMentions` |
| "mentions in composer" | `CometChatMentionsFormatter` (A) | Already wired into `CometChatMessageComposer` by default |
| "AI smart replies" / "AI assistant" | `CometChatAIAssistantChat` (A) | Requires dashboard toggle + extension |
| "top-level layout" / "home screen" | `CometChatHome/CometChatHome.tsx` (B) | The canonical three-column layout |
| "login screen" | `CometChatLogin/` (B) | Sample app pattern |
| "avatar" | `CometChatAvatar` (A) | Used inside many components; also usable standalone |
| "flag / report message" | `CometChatFlagMessageDialog` (A) | |
| "confirm dialog" / "are you sure" | `CometChatConfirmDialog` (A) | |
| "full-screen image / video viewer" | `CometChatFullScreenViewer` (A) | |
| "voice message recorder" | `CometChatMediaRecorder` (A) | |
