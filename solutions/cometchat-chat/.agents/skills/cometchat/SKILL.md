---
name: cometchat
description: Entry-point for CometChat integration in any React project — web (React/Next.js/React Router/Astro) and React Native (Expo/bare). Detects the framework, gathers requirements through an interactive conversation, and writes production-quality integration code.
license: "MIT"
allowed-tools: "executeBash, readFile, fileSearch, listDirectory, AskUserQuestion"
metadata:
  author: "CometChat"
  version: "3.0.0"
  tags: "cometchat dispatcher entry react nextjs react-router astro expo react-native chat"
---

## Use this skill when

The user wants to add CometChat to any kind of project. Trigger phrases:

- `/cometchat`
- "add cometchat", "integrate cometchat", "add chat to my app"
- "add messaging", "add chat ui", "add in-app chat"

This is the **entry point for every framework**. Do NOT invoke
framework-specific skills directly — this dispatcher detects the
framework first and routes to the right ones.

**Supported frameworks:**

| Family | Frameworks |
|---|---|
| **Web** | React (Vite/CRA), Next.js, React Router v6/v7, Astro |
| **React Native** | Expo (managed + Expo Router), bare RN CLI |

The web family loads `@cometchat/chat-uikit-react` + `@cometchat/chat-sdk-javascript`. The RN family loads `@cometchat/chat-uikit-react-native` + `@cometchat/chat-sdk-react-native`. The dispatcher decides which set after Step 1's detection.

## How v3 works

v3 skills are **interactive and conversational**. You don't just detect
the framework and dump code. You have a conversation with the developer
to understand their project, their use case, and exactly where chat
should go — THEN you write code that fits.

Pattern skills (loaded from your context, not via `Skill()`):
- `cometchat-core` (web) / `cometchat-native-core` (RN) — init, login, provider chain, env vars, anti-patterns
- `cometchat-components` (web) / `cometchat-native-components` (RN) — component catalog, props, composition
- `cometchat-placement` (web) / `cometchat-native-placement` (RN) — WHERE to put chat
- One per-framework skill (`cometchat-{react,nextjs,react-router,astro}-patterns` or `cometchat-native-{expo,bare}-patterns`) — framework-specific details

**Key principle: ask, don't assume.** Every piece of information you need
from the user should be asked explicitly. Don't guess the route path,
don't guess where the trigger button goes, don't guess the auth system.

## Steps

### Step 1 — Detect framework + map the project

First, check if `.cometchat/config.json` exists:
```bash
npx @cometchat/skills-cli config show --json
```

If config exists with previous answers, tell the user:
> "I see you've set up CometChat before. Using your saved config:
> Framework: {framework}, App: {appId}, Intent: {intent}.
> Want to continue with these, or start fresh?"

If no config, run detection:
```bash
npx @cometchat/skills-cli detect --json
```

The JSON output includes `framework` (one of `reactjs`, `nextjs`, `react-router`, `astro`, `expo`, `react-native`, or `null`), framework-specific fields (`router`, `expo_mode`, `react_native_version`, `env_prefix`), and a `compatibility.supported` flag. If `supported` is `false`, stop and surface the warnings.

**Then read the project yourself — this is critical.**

**For web frameworks (`reactjs`, `nextjs`, `react-router`, `astro`):**
- `package.json` — name, dependencies, scripts
- The source directory structure — list all directories under `src/` or `app/`
- Find the router: `createBrowserRouter`, `app/` directory, `pages/`, `react-router.config.ts`, `astro.config.*`
- Find the layout: `App.tsx`, `layout.tsx`, `root.tsx`, `Layout.astro`
- Find the nav: components with "nav", "header", "sidebar" in name
- Find existing pages/routes: list them so you can reference them later

**For React Native (`expo`, `react-native`):**
- `package.json` — name, RN version, all dependencies, scripts
- Entry file — `index.js` or `App.{tsx,jsx}` or `app/_layout.tsx` (Expo Router)
- Navigation — look for `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`, or `expo-router`
- Existing screens — list all files under `screens/`, `src/screens/`, `app/`, or wherever routes live
- Existing nav structure — read the root navigator to see stack vs tab vs drawer layout

Store this mental map — you'll use it throughout the conversation.

**Compatibility baselines (the CLI enforces these):**
- Web: react@<18 → upgrade required; nextjs@<13 → warning; astro@<4 → warning
- RN: react-native@<0.70 → upgrade required; expo@<49 → upgrade required

#### Pattern skills not installed?

The dispatcher routes to either web pattern skills (`cometchat-{core,components,placement,*-patterns}`) or RN pattern skills (`cometchat-native-{core,components,placement,*-patterns}`) based on the detected framework. If the matching set isn't loaded in your context — i.e. the user installed only one of `@cometchat/skills` (web) or `@cometchat/skills-native` (RN) and the framework doesn't match — stop and tell them which package to install:

**If `framework` is `expo` or `react-native` AND `cometchat-native-core` is NOT loaded:**
> "This is a React Native / Expo project, but the React Native pattern
> skills aren't installed in this workspace. Install them with:
> ```
> npx @cometchat/skills-native add
> ```
> then run `/cometchat` again."

**If `framework` is `reactjs`, `nextjs`, `react-router`, or `astro` AND `cometchat-core` is NOT loaded:**
> "This is a {framework} project, but the web pattern skills aren't
> installed in this workspace. Install them with:
> ```
> npx @cometchat/skills add
> ```
> then run `/cometchat` again."

To check, attempt to read `cometchat-core/SKILL.md` (web) or `cometchat-native-core/SKILL.md` (RN) from your loaded skills context. If the read fails, the package isn't installed.

Do NOT attempt to write web UI Kit code into an RN project (CSS imports + `<a href>` + `document.*` will fail at runtime) or RN UI Kit code into a web project (`react-native-gesture-handler`, `@gorhom/bottom-sheet`, native bubble components have no browser equivalents).

### Step 2 — Set up credentials (onboarding)

**CRITICAL: All onboarding happens via CLI commands. NEVER send the user
to a browser or dashboard for credential copy-pasting. The CLI handles
signup, login, app creation, and credential writing — all from the
terminal — for every framework.**

If config has `appId` set, verify credentials are in `.env` and skip to Step 3.

Otherwise check:
```bash
npx @cometchat/skills-cli auth status --json
```

If `status` is `"logged-in"`, skip to **Step 2c** (app selection).

If `status` is `"logged-out"`, ask:

Use `AskUserQuestion`:
- **question:** "Let's set up CometChat. Do you have an account?"
- **header:** "Account"
- **multiSelect:** false
- **options:**
  1. label: "Create a new account", description: "Free signup — I'll handle it right here, no browser needed."
  2. label: "Sign in to existing account", description: "Log in and pick one of your apps."
  3. label: "I'll paste credentials myself", description: "I already have my App ID, Region, and Auth Key."

Option 1 → **Step 2b**. Option 2 → **Step 2a**. Option 3 → **Step 2d**.

#### Step 2a — Sign in (existing account, browser flow)

```bash
npx @cometchat/skills-cli auth login
```

This command:
1. Generates a short-lived session via the CLI auth API.
2. Opens `https://app.cometchat.com/login?sessionId=<hex>` in the user's default browser.
3. Polls the auth API every 5 seconds for up to 15 minutes.
4. When the user finishes signing in, the dashboard marks the session authenticated. The next poll receives the bearer token and stores it in the OS keychain.
5. Prints `✓ Logged in as <email> (backend: keychain-macos).`

Let the CLI block — do NOT background it, do NOT race it with other prompts.

Terminal error handling (surface verbatim, stop, do not retry silently):
- `ACCESS_DENIED` — user clicked Deny in the dashboard.
- `EXPIRED` — 15-minute window elapsed.
- `TIMEOUT` — max polls exhausted before user authorized.
- `ABORTED` — user Ctrl-C'd the CLI.
- `NETWORK` — couldn't reach the auth host.
- `ALREADY_AUTHENTICATED` — this session was already consumed. Re-run `auth login` to mint a fresh session.

After success, verify via `auth status --json` and proceed to **Step 2c**.

#### Step 2b — Sign up (new account, browser flow)

```bash
npx @cometchat/skills-cli auth signup
```

Same polling flow as Step 2a, but the CLI opens the signup URL. The browser handles email, name, password, verification email, role, industry. The CLI never sees any of those values.

No role / name / verification-code questions in the chat. The dashboard owns that flow now; skipping it keeps the user's password and verification code out of the transcript.

Error codes match Step 2a. After success, verify via `auth status --json` and proceed to **Step 2c**.

#### Step 2c — Pick or create an app

**Run this immediately — do NOT ask the user to go to any dashboard:**
```bash
npx @cometchat/skills-cli provision list --json
```

**If the user has existing apps**, show them and ask which to use:
> "I found these CometChat apps on your account:
> 1. my-marketplace-chat (us) — Developer plan
> 2. test-app (eu) — Developer plan
>
> Which one should I use, or should I create a new one?"

**For an existing app**, fetch credentials and wire everything in one call. Pass `--framework` from Step 1 detection (one of `reactjs`, `nextjs`, `react-router`, `astro`, `expo`, `react-native`):
```bash
npx @cometchat/skills-cli provision setup \
  --app-id "<selected-appId>" --framework "<framework>" --json
```

This creates/updates the env file with the correct prefix AND writes `.cometchat/config.json` in one step. Output is compact: `{ appId, region, framework, envFile, configPath }` — no authKey echoed back.

**If no apps exist** (or user wants new), collect:
1. App name — suggest `<project-name>-chat` from package.json `name`
2. Region — `AskUserQuestion`:
   - **question:** "Which region for your CometChat app?"
   - **header:** "Region"
   - **options:** US (recommended), EU, India

   **Region key mapping** (CLI expects lowercase):
   | Label | `--region` value |
   |---|---|
   | US | `us` |
   | EU | `eu` |
   | India | `in` |
3. Industry — `AskUserQuestion`:
   - **options:** SaaS / Business, Marketplace, Social / Community, Other (or finer-grained from the table below)

**Industry key mapping:**

| Label | `--industry` value |
|---|---|
| SaaS / Business | `saas_businesses` |
| Marketplace | `online_marketplaces` |
| Social / Community | `community_and_social` |
| Healthcare | `healthcare` |
| Dating | `dating` |
| Education | `online_education` |
| Events / Streaming | `events_and_streaming` |
| Sports / Gaming | `sports_and_gaming` |
| Team Communication | `team_comms_and_workflows` |
| On-demand Services | `on_demand_services` |
| Other | `other` |

**Confirm before creating, then:**
```bash
npx @cometchat/skills-cli provision setup \
  --name "<name>" --region "<region>" --industry "<industry_key>" \
  --framework "<framework>" --json
```

The authKey is written to the env file but is NOT echoed to stdout, so credentials don't appear multiple times in the transcript.

Tell the user: "Your CometChat account and app are ready. Credentials saved to `<envFile>`. Let's set up the integration."

#### Step 2d — Paste keys manually

Tell the user which env vars to set based on the detected framework:

| Framework | Env file | Variables |
|---|---|---|
| reactjs (Vite) | `.env` | `VITE_COMETCHAT_APP_ID`, `VITE_COMETCHAT_REGION`, `VITE_COMETCHAT_AUTH_KEY` |
| nextjs | `.env.local` | `NEXT_PUBLIC_COMETCHAT_APP_ID`, `NEXT_PUBLIC_COMETCHAT_REGION`, `NEXT_PUBLIC_COMETCHAT_AUTH_KEY` |
| react-router | `.env` | `VITE_COMETCHAT_APP_ID`, `VITE_COMETCHAT_REGION`, `VITE_COMETCHAT_AUTH_KEY` |
| astro | `.env` | `PUBLIC_COMETCHAT_APP_ID`, `PUBLIC_COMETCHAT_REGION`, `PUBLIC_COMETCHAT_AUTH_KEY` |
| expo (managed + Expo Router) | `.env` | `EXPO_PUBLIC_COMETCHAT_APP_ID`, `EXPO_PUBLIC_COMETCHAT_REGION`, `EXPO_PUBLIC_COMETCHAT_AUTH_KEY` |
| react-native (bare CLI) | `.env` | `COMETCHAT_APP_ID`, `COMETCHAT_REGION`, `COMETCHAT_AUTH_KEY` (paired with `react-native-dotenv`) |

> "Grab your credentials from https://app.cometchat.com → Your App →
> API & Auth Keys. Create the env file above and tell me when done."

**Bare RN extra step.** Bare RN doesn't ship a public-env-prefix convention — pair the env file with `react-native-dotenv`:
```bash
npm install --save-dev react-native-dotenv
```
and add the plugin to `babel.config.js`:
```js
module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [["module:react-native-dotenv"]],
};
```
Then `import { COMETCHAT_APP_ID, COMETCHAT_REGION, COMETCHAT_AUTH_KEY } from "@env";` in the provider.

After they confirm, verify:
```bash
npx @cometchat/skills-cli config init --json
```

#### Never log the Auth Key

After writing credentials, don't echo the Auth Key back in the transcript. Confirm as `✓ Wrote <PREFIX>COMETCHAT_AUTH_KEY (hidden)`.

### Step 3 — Interactive requirements gathering

This is the core of v3. A multi-step conversation that gathers everything you need before writing a single line of code.

#### 3a. "What are you building?"

If config has `intent` set, confirm it and move on.

Otherwise, use `AskUserQuestion`:
- **question:** "What kind of app are you building?"
- **header:** "Your app"
- **multiSelect:** false
- **options:**
  1. label: "Messaging app", description: "Chat is the main feature — like Slack, Discord, WhatsApp, or Telegram."
  2. label: "Marketplace or platform", description: "Buyers and sellers communicate — like Airbnb, eBay, OfferUp, or Depop."
  3. label: "SaaS or productivity", description: "Team chat or support chat inside a product — like Notion, Intercom, or Linear."
  4. label: "Social or community", description: "User profiles with messaging — like a dating app or community forum."
  5. label: "Support or helpdesk", description: "Customer-to-agent communication."
  6. label: "Just exploring", description: "Quick demo — fastest path to see chat working."

**If "Just exploring":** skip the rest of Step 3 and scaffold the minimal integration in Step 5 — one route/screen showing `<CometChatConversations />` with `cometchat-uid-1` pre-logged-in.

#### 3b. Show what you recommend and why

The recommendation table differs by family because the placement vocabulary is different (web has routes/drawers/widgets; RN has screens/tabs/sheets):

**Web family (reactjs, nextjs, react-router, astro):**

| Intent | What you'll set up |
|---|---|
| **Messaging app** | A dedicated messages page at a route you choose. Two-pane: conversation list + active chat. |
| **Marketplace** | A "Chat with seller" drawer on your product page + an inbox page at /messages. |
| **SaaS / dashboard** | A chat modal triggered from your navbar + a full messages page. |
| **Social / community** | A full messenger page with tabs: Chats, Calls, Users, Groups. |
| **Support** | A floating widget bubble in the bottom-right corner. |

**React Native family (expo, react-native):**

| Intent | What you'll set up |
|---|---|
| **Messaging app** | A dedicated "Messages" bottom tab. Conversations list → tap a conversation → message thread. |
| **Marketplace** | A "Chat with seller" button on the product screen that opens a modal with the message thread. Plus an "Inbox" stack screen for all conversations. |
| **SaaS / productivity** | A "Chat" stack screen accessible from the nav or a header button. Optionally a bottom sheet for quick replies. |
| **Social / community** | A "Messages" bottom tab with conversations list + message thread. Plus a "Message" button on user profile screens that opens a modal. |
| **Support** | A modal triggered from a "Help" or "Support" button in the header or settings. |

When explaining, reference the ASCII diagrams from `cometchat-placement` (web) or `cometchat-native-placement` (RN) so the user can visualize.

Ask: "Does this sound right, or do you want a different approach?" Let them override.

#### 3c. Ask where things should go

**Show the user their actual project structure** — list the pages/routes/screens you found in Step 1. Then ask placement-specific questions appropriate to the family.

**Web — Route placement (messaging, social):**
> "I found these pages in your project:
>   - /  (home)
>   - /about
>   - /products
>   - /profile
>
> Where should the messages page live?"

Default: `/messages`. Let user type a custom path.

**Web — Drawer placement (marketplace):**
> "Which page should have the 'Chat' button that opens the drawer?
> I found these pages: ..."

Read the picked page. Look for existing buttons, actions, or interactive elements. Ask whether to wire to the existing button or add a new one.

**Web — Modal placement (SaaS):**
> "Where should the 'Open chat' button go? I found these components
> that look like navigation: ..."

**Web — Widget placement (support):**
> "Should the widget appear on all pages, or only specific ones?"

**RN — Bottom tab placement (messaging, social):**
> "I found these bottom tabs in your navigator at App.tsx:
>   - Home
>   - Profile
>   - Settings
>
> Where should the 'Messages' tab go? (At the end, or pick a position.)"

**RN — Stack screen placement (saas, marketplace inbox):**
> "I found these stack screens in your root navigator: ...
>
> What should I call the chat screen? Default: MessagesScreen."

**RN — Modal placement (marketplace, support):**
> "Which screen should have the 'Chat' button that opens the modal?
> I found these screens: ..."

Read the picked screen. Look for existing buttons. Ask whether to wire to it or add a new one.

**RN — BottomSheet placement (quick reply, support):**
> "Bottom sheets slide up from below. Should the sheet be:
>   1. Draggable (user can dismiss by swiping down) — uses @gorhom/bottom-sheet
>   2. Fixed overlay — uses CometChat's built-in CometChatBottomSheet
>
> Which one?"

**Combinations** (marketplace = drawer/modal + inbox): ask both questions in sequence — they're separate components wired into separate places.

**Expo Router projects** — adapt screen names to file paths:
- Stack screen → `app/messages.tsx` (or the path the user picks)
- Bottom tab → file under `app/(tabs)/messages.tsx` + update `app/(tabs)/_layout.tsx`
- Modal → `app/(modals)/chat.tsx` with `presentation: "modal"` in the parent `_layout.tsx`

#### 3d. Detect and ask about authentication

Read the project's `package.json` and source files. Look for auth.

**Web auth libraries:**
- `next-auth` / `@auth/core` → NextAuth
- `@clerk/nextjs` / `@clerk/clerk-react` → Clerk
- `@supabase/supabase-js` + auth usage → Supabase Auth
- `firebase` / `firebase/auth` → Firebase Auth
- `passport` → Passport.js
- `jsonwebtoken` / `jose` → Custom JWT

**RN auth libraries:**
- `firebase` / `@react-native-firebase/auth` → Firebase Auth
- `@clerk/clerk-expo` / `@clerk/clerk-react-native` → Clerk
- `@supabase/supabase-js` + auth usage → Supabase Auth
- `react-native-auth0` → Auth0
- `aws-amplify` + auth module → AWS Cognito
- `@react-native-google-signin/google-signin` → Google Sign-In (usually paired with something above)
- `expo-auth-session` / `expo-secure-store` → Expo Auth Session (custom)

**None detected** → no auth.

Report what you found and ask:

If auth detected:
> "I see you're using [NextAuth / Firebase Auth / etc.]. Here's how
> CometChat will work with it:
>
> - **Development (now):** I'll use CometChat's Auth Key for quick
>   testing with pre-seeded users (cometchat-uid-1 through uid-5).
> - **Production (later):** Your server will mint per-user auth tokens
>   via the CometChat REST API. I can set this up now or later
>   (see `cometchat-production` / `cometchat-native-production`).
>
> Start with dev mode for now? You can upgrade to production auth
> anytime by choosing 'Set up production auth' from the menu."

If no auth detected:
> "I don't see an authentication system in your project yet. For now,
> I'll set up CometChat with a hardcoded test user (cometchat-uid-1).
>
> When you add auth later, run `/cometchat` again and choose
> 'Set up production auth' to connect them."

#### 3e. Ask about user mapping (if auth detected)

If the user has auth AND wants to set up production mode now:

> "How should your app's users map to CometChat users?
>
> 1. Use your existing user ID as the CometChat UID (simplest)
> 2. Generate a separate CometChat UID and store it alongside your user record
> 3. Let me just set up dev mode for now"

If they share an example, validate it's CometChat-compatible (alphanumeric, underscores, hyphens — no spaces or special chars; max 100 chars). Firebase UIDs, Clerk user IDs, Supabase UUIDs, and Auth0 `sub` claims are all CometChat-compatible by default.

#### 3f. Confirm the plan

**This is critical. Show EXACTLY what you'll do before doing it.** The plan format differs by framework.

**Web example (Next.js, marketplace):**
> "Here's what I'll create:
>
> **New files:**
> - `app/providers/CometChatProvider.tsx`
> - `app/messages/page.tsx`
> - `app/components/ChatDrawer.tsx`
> - `.env.local`
>
> **Files I'll modify:**
> - `app/products/[id]/page.tsx` — add ChatDrawer trigger
> - `app/layout.tsx` — wrap with CometChatProvider
> - `app/components/Navbar.tsx` — add 'Messages' link
>
> **Dependencies:** @cometchat/chat-sdk-javascript, @cometchat/chat-uikit-react
>
> **Auth mode:** Development (Auth Key).
> Proceed? [y/n]"

**RN example (Expo Router, messaging):**
> "Here's what I'll create:
>
> **New files:**
> - `providers/CometChatProvider.tsx`
> - `app/(tabs)/messages.tsx`
> - `.env`
>
> **Files I'll modify:**
> - `app/_layout.tsx` — wrap with the four-wrapper chain
> - `app/(tabs)/_layout.tsx` — add the Messages tab
> - `index.js` — `import 'react-native-gesture-handler'` at line 1 (if missing)
>
> **Dependencies (via `npx expo install`):**
> @cometchat/chat-uikit-react-native, @cometchat/chat-sdk-react-native,
> react-native-gesture-handler, react-native-reanimated,
> react-native-safe-area-context, react-native-screens,
> @react-native-async-storage/async-storage, @react-native-community/netinfo,
> react-native-video, react-native-image-picker, react-native-document-picker,
> react-native-vector-icons, react-native-fs
>
> **Auth mode:** Development (Auth Key).
> Proceed? [y/n]"

**Bare RN variant** — same as Expo, except `npm install` instead of `npx expo install`, plus:
- Run `cd ios && pod install`
- Patch `ios/<Name>/Info.plist`, `android/app/src/main/AndroidManifest.xml` for permissions
- Add `ios/<Name>/PrivacyInfo.xcprivacy` (Apple Privacy Manifest)
- Patch `android/build.gradle` for the async-storage Maven repo (v3+)

Wait for explicit confirmation. If the user says no or wants changes, go back to the relevant question and re-ask.

### Step 4 — Reference pattern skills

**All skills are already loaded in your context** as `.claude/skills/` files. Do NOT use the `Skill()` tool. Read and follow them directly.

**For web frameworks:**
1. `cometchat-core` — initialization, provider, CSS, anti-patterns
2. `cometchat-components` — component catalog, composition patterns
3. Framework-specific:
   - `reactjs` → `cometchat-react-patterns`
   - `nextjs` → `cometchat-nextjs-patterns`
   - `react-router` → `cometchat-react-router-patterns`
   - `astro` → `cometchat-astro-patterns`
4. `cometchat-placement` — placement pattern for the chosen approach

**For React Native:**
1. `cometchat-native-core` — init, login, four-wrapper provider chain, env vars, anti-patterns
2. `cometchat-native-components` — component catalog
3. Framework-specific:
   - `expo` (managed + Expo Router) → `cometchat-native-expo-patterns`
   - `react-native` (bare CLI) → `cometchat-native-bare-patterns`
4. `cometchat-native-placement` — placement pattern (stack/tab/modal/bottom-sheet/embed)

### Step 5 — Write the integration

Execute the confirmed plan. The order of operations is the same for every framework, but the file names + provider shape differ.

**Web — common steps:**

1. **CometChatProvider** — follow the framework skill's provider pattern. Use the correct env var prefix. Module-level `initialized` guard. Mount at the level agreed in Step 3f.
2. **Chat component(s)** — follow the placement skill's pattern.
3. **Wire into existing project** — READ each file before modifying. Add the route, nav link, drawer/modal trigger.
4. **CSS import** — add once at the root level per framework conventions.
5. **Environment variables** — write the env file with the correct prefix.
6. **Install dependencies:**
   ```bash
   npm install @cometchat/chat-sdk-javascript @cometchat/chat-uikit-react
   ```

**React Native — common steps:**

1. **Entry file** (`index.js` / `App.tsx` / `app/_layout.tsx`) — verify `import "react-native-gesture-handler";` is **line 1**. Not line 2, not after another import. Non-negotiable.
2. **CometChatProvider** — follow `cometchat-native-core` § 6. Module-level `initialized` guard. Module-level `loginInFlight` promise for login concurrency.
3. **Four-wrapper chain** — wrap the app's root in this exact order:
   ```tsx
   <GestureHandlerRootView style={{ flex: 1 }}>
     <SafeAreaProvider>
       <CometChatThemeProvider>
         <CometChatProvider>
           {/* navigator / Expo Router <Stack> */}
         </CometChatProvider>
       </CometChatThemeProvider>
     </SafeAreaProvider>
   </GestureHandlerRootView>
   ```
4. **Chat screen(s)** — follow `cometchat-native-placement`'s pattern.
5. **Every `<CometChatMessageList>` MUST pass `hideReplyInThreadOption={true}`** (see hard rules).
6. **Wire into existing project** — READ each file before modifying.
7. **Environment variables** — write `.env` with the correct prefix (`EXPO_PUBLIC_` for Expo, bare for `react-native`).
8. **Install dependencies:**

   **Expo managed:**
   ```bash
   npx expo install @cometchat/chat-uikit-react-native @cometchat/chat-sdk-react-native \
     react-native-gesture-handler react-native-reanimated react-native-safe-area-context \
     react-native-screens @react-native-async-storage/async-storage \
     @react-native-community/netinfo react-native-video react-native-image-picker \
     react-native-document-picker react-native-vector-icons react-native-fs
   ```

   **Bare RN:**
   ```bash
   npm install @cometchat/chat-uikit-react-native @cometchat/chat-sdk-react-native \
     react-native-gesture-handler react-native-reanimated react-native-safe-area-context \
     react-native-screens @react-native-async-storage/async-storage \
     @react-native-community/netinfo react-native-video react-native-image-picker \
     react-native-document-picker react-native-vector-icons react-native-fs
   cd ios && pod install && cd ..
   ```

   **Reanimated plugin (both):** verify `react-native-reanimated/plugin` is the LAST entry in `babel.config.js` `plugins` array. Metro cache is sensitive to plugin order.

9. **Native config (bare RN only):**
   - `ios/<Name>/Info.plist` — add `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`, `NSMicrophoneUsageDescription`
   - `android/app/src/main/AndroidManifest.xml` — add `CAMERA`, `RECORD_AUDIO`, `READ_MEDIA_IMAGES`, `READ_EXTERNAL_STORAGE` permissions
   - `ios/<Name>/PrivacyInfo.xcprivacy` — add the 4 required API codes (C617.1, CA92.1, 35F9.1, E174.1). See `cometchat-native-bare-patterns`.
   - `android/build.gradle` — async-storage Maven repo if v3+

   **Expo managed** — all of this goes in `app.json` under `plugins` and `ios.infoPlist` / `android.permissions`. See `cometchat-native-expo-patterns`.

#### Step 5 — common to ALL frameworks

After the framework-specific work above, every integration ends the same way:

10. **Update config.json** — save all the choices in one call:
    ```bash
    npx @cometchat/skills-cli config save \
      --intent "<intent>" \
      --placement "<type>" \
      --placement-path "<path>" \
      --auth-mode "<mode>" --json
    ```
    Pass only the fields you have — `config save` accepts any subset.

11. **Record state so Phase B commands work — DO NOT SKIP.** Every Phase B command (`info`, `status`, `doctor`, `verify`, `uninstall`, `apply-theme`, `apply-feature`, `add-widget`, `add-user-mgmt`, `production-auth`) reads `.cometchat/state.json` to know what the integration looks like. Without this step, every one of them reports "not integrated in this project" even though the code is there.

    Pass every file you wrote (owned) and every existing file you patched:
    ```bash
    npx @cometchat/skills-cli state record \
      --framework "<framework>" \
      --placement "<type>" \
      --placement-path "<path>" \
      --auth-mode "<mode>" \
      --files-owned "<comma-list of new files>" \
      --files-patched "<comma-list of path:patch_id pairs>" \
      --json
    ```

    - `--files-owned` — comma-separated list of every NEW file you wrote (provider, drawer, inbox page, screen). The CLI computes SHA-256 checksums for each so it can detect drift later.
    - `--files-patched` — comma-separated `path:patch_id` pairs for every EXISTING file you modified. `patch_id` can be any stable label — `v3/<filename>` is a reasonable default.

    If this call errors (CLI flag mismatch, missing `--framework`, etc.), surface the error and retry. A completed Phase A with a missing state.json is worse than a visible error — the user discovers the breakage later when they try to add a feature or run diagnostics.

**Exception — "Just exploring" / demo mode (web only):**
```bash
npx @cometchat/skills-cli apply --experience 1 --framework <detected>
npx @cometchat/skills-cli verify --json
npx @cometchat/skills-cli install
```

For RN demo mode, scaffold the minimal integration directly — there's no `apply` template path for RN.

### Step 6 — Verify + show result

Run a TypeScript check to verify the code compiles:
```bash
npx tsc --noEmit
```

**Do NOT run `npx @cometchat/skills-cli verify`** — it checks for CLI-generated `.cometchat/state.json` that's authored by `cometchat apply`, not by AI integration. Use `tsc` instead.

**RN extra: do not start Metro automatically** — let the user do that in their own terminal. Metro blocks the terminal and cannot be meaningfully observed from here.

Surface any common issues:

**Web:**
- `Module not found: @cometchat/chat-uikit-react` → install didn't complete
- CSS variable warnings → CSS import not at root or wrong path

**RN:**
- `Cannot find module '@cometchat/chat-uikit-react-native'` → install didn't complete
- `JSX element 'GestureHandlerRootView' has no corresponding closing tag` → wrapper chain partially applied
- `Property 'hideReplyInThreadOption' does not exist on type '...'` → v3 types installed; user needs v5 (`^5.0.0`)

Then:

**Web result message:**
> "CometChat is integrated! Here's what was set up:
>
> - <list of new + patched files> ✓
> - Provider + CSS wired ✓
> - Dependencies installed ✓
>
> Run `npm run dev` and open the app:
> - **Vite (reactjs)**: http://localhost:5173
> - **Next.js**: http://localhost:3000/chat
> - **React Router v7**: http://localhost:5173/chat
> - **Astro**: http://localhost:4321/chat"

**RN result message:**
> "CometChat is integrated! Here's what was set up:
>
> - <list of new + patched files> ✓
> - Provider + four-wrapper chain ✓
> - `import 'react-native-gesture-handler'` verified at line 1 ✓
> - Dependencies installed ✓
> - `hideReplyInThreadOption={true}` on MessageList ✓
>
> Next steps:
>
> **Expo managed:**
> 1. `npx expo start --clear`
> 2. Open the app in Expo Go (if no native modules) or a dev build
>
> **Bare RN:**
> 1. `npm start -- --reset-cache`
> 2. In another terminal: `npm run ios` or `npm run android`"

**Common ending — what you'll see on first load (every framework):**

> ---
>
> **Pre-seeded test data — chat works immediately, no dashboard setup needed:**
>
> Every CometChat app ships with **5 pre-created test users**
> (`cometchat-uid-1` through `cometchat-uid-5`), a **"Hello" test group**,
> and **sample messages between them**. Your integration is logged in
> as `cometchat-uid-1` by default, so on first load the conversation
> list is already populated — you'll see existing 1:1 threads and the
> test group with message history. Open any conversation and reply;
> round-trip is ~50ms. Receipts, typing indicators, presence, and
> reactions all work out of the box.
>
> **Want to see real-time delivery between two users?** Open the
> integration in two browser windows (or two simulators on RN), and
> temporarily change the login UID in your provider — `cometchat-uid-2`
> in one window, `cometchat-uid-1` in the other. Messages from one
> arrive live in the other without refresh.
>
> The dashboard at `https://app.cometchat.com` is useful later for
> creating real users, configuring extensions, and viewing analytics
> — but you don't need it to confirm the integration is working.
>
> What would you like to do next?"

### Step 7 — Iteration menu

Use `AskUserQuestion`. The option set differs by family — RN has two extra options (push notifications + testing) that don't apply to web.

**Web — 8 canonical options:**
- **question:** "What would you like to do next?"
- **header:** "Next step"
- **multiSelect:** false
- **options:**
  1. label: "Customize look and feel (themes)", description: "Pick a preset (slack, whatsapp, imessage, discord, notion) or set brand colors."
  2. label: "Add a feature", description: "Browse ~35 features — calls, reactions, polls, AI, and more."
  3. label: "Customize a component", description: "Custom bubbles, headers, composer actions, details views — I'll read the docs and write it."
  4. label: "Add a floating chat widget", description: "An overlay button + drawer on top of your existing app."
  5. label: "Set up production auth", description: "Replace the dev Auth Key with a server-side token endpoint. Read `cometchat-production` skill."
  6. label: "Set up user management", description: "Server endpoints for creating, updating, deleting CometChat users."
  7. label: "Run diagnostics", description: "Check for drift, missing env vars, broken imports."
  8. label: "I'm done", description: "Exit."

**RN — 10 canonical options:**
- **question:** "What would you like to do next?"
- **header:** "Next step"
- **multiSelect:** false
- **options:**
  1. label: "Customize look and feel (themes)", description: "Colors, typography, dark mode — edit CometChatThemeProvider."
  2. label: "Add a feature", description: "Calls, reactions, polls, extensions, AI agent — browse the catalog."
  3. label: "Customize a component", description: "Custom bubbles, headers, message composer actions, empty states."
  4. label: "Add another placement", description: "Add a modal chat, a bottom sheet, or another tab — without touching the existing integration."
  5. label: "Set up push notifications", description: "APNs + FCM setup, CometChat dashboard config, client registration, tap-to-deep-link. Required for production."
  6. label: "Set up production auth", description: "Replace the dev Auth Key with a server-minted auth token. Read `cometchat-native-production` skill."
  7. label: "Set up user management", description: "Server endpoints for creating, updating, deleting CometChat users."
  8. label: "Set up testing", description: "Jest + React Native Testing Library setup, mocks for the UI Kit / SDK, E2E with Detox or Maestro."
  9. label: "Troubleshoot an issue", description: "Metro cache, pod install, iOS privacy manifest, push notifications, native module linking."
  10. label: "I'm done", description: "Exit."

For **theme customization**: read the framework-appropriate theming skill and write the customization code.

For **adding features**: read the framework-appropriate features skill. Features fall into buckets (Default, Dashboard-toggle, Package-install, Component-swap). Ask which feature, then follow the right bucket's recipe.

For **component customization**: read the customization + components skills, then write the customization code directly. Ask the user what they want to customize, read the relevant component's props from the catalog, propose changes.

For **production auth**: read the framework-appropriate production skill. It's interactive — ask the user about their auth system and generate the server-side token endpoint for their backend.

For **push notifications (RN only)**: read `cometchat-native-push`. Structured 12-section walkthrough.

For **testing (RN only)**: read `cometchat-native-testing`. Ask the user whether they want unit tests (Jest + RNTL), E2E (Detox vs Maestro), or both.

For **troubleshooting (RN)**: read `cometchat-native-troubleshooting` and match the symptom to a triage table. (Web: option 7 "Run diagnostics" runs `cometchat doctor` against `.cometchat/state.json`.)

### Re-rendering the menu after each action

After every Phase B action completes, you **MUST** re-invoke `AskUserQuestion` with the **exact same option set** (web: 8 options, RN: 10) — same `question`, `header`, `multiSelect: false`, same labels and descriptions, verbatim. This gives the user arrow-key selection in their terminal.

**Do NOT:**
- Present the options as a prose bullet list — forces typed answers, worse UX.
- Invent new options based on what the user just did. The canonical set doesn't change between iterations.
- Skip the menu and ask freeform "What's next?" — always route through `AskUserQuestion`.
- Drop options or add new ones. The user expects the same choices every time, even if some are redundant with what they just did (they may want to do the same kind of action twice).

The iteration loop is the whole point of Phase B. Re-rendering the canonical menu via `AskUserQuestion` after every action is how the user controls the session.

## Hard rules

### Always (every framework)

- **Ask, don't assume.** Every integration decision should be confirmed.
- **Always run `detect` first.** Do not assume the framework.
- Always use `npx @cometchat/skills-cli` for CLI commands.
- NEVER replace existing project files unless the user chose demo mode.
- ALWAYS read existing files before modifying them.
- ALWAYS show the plan (Step 3f) and get confirmation before writing.
- **Every `<CometChatMessageList>` must pass `hideReplyInThreadOption={true}`** unless the user has explicitly opted into thread support and you've built the thread screen too. Without it, tapping a message shows a "Reply in Thread" action that leads to a broken (undefined) thread view.
- **NEVER build a custom search UI.** The UI Kit ships `<CometChatSearch>` — full dual-scope search across conversations + messages with built-in filter chips, pagination, and result highlighting. Any request involving "search", "find messages", "search conversations" MUST use the built-in component (and `showSearchBar` / `onSearchBarClicked` on `CometChatConversations` for web; `hideSearch={false}` for RN). Do NOT create custom search bars, hand-rolled result lists, or filter UIs.
- For component names and props, use the framework-appropriate `*-components` skill or docs MCP — never invent from training data.
- After writing code, record state in `.cometchat/state.json` (Step 5 step 11) so the iteration menu can detect the integration in a future session.
- **NEVER use the `Skill()` tool** to load CometChat skills. They're already in your context as `.claude/skills/` files. Just read and follow them directly.

### Web only

- **CSS import goes once at the root level** per framework conventions. The framework skill (cometchat-{react,nextjs,react-router,astro}-patterns) tells you exactly where.
- **For drawer / widget animations, animate `right` / `left`, NEVER `transform` / `translate-*`.** A `transform` on a CometChat-containing element creates a new containing block that re-anchors absolutely-positioned overlays (emoji picker, action sheet, reactions, thread panel) to the transformed element instead of the viewport. Tailwind utilities `translate-x-*`, `-translate-x-*`, `scale-*`, `rotate-*`, `transform-*` are also banned for this reason. See `cometchat-placement` § 10.

### React Native only

- **`import "react-native-gesture-handler"` must be line 1 of the entry file.** Not line 2. Not after another import. This is non-negotiable.
- **All four wrappers are required, in this order:** `GestureHandlerRootView → SafeAreaProvider → CometChatThemeProvider → CometChatProvider`. Omitting any of them breaks gestures, safe areas, theming, or login state — and it fails silently in dev.
- **Login API is `CometChatUIKit.login({ uid })` or `CometChatUIKit.login({ authToken })`** — same method, different object key. There is no `loginWithAuthToken`. Passing a bare string like `login("cometchat-uid-1")` silently fails on RN.

## Error handling

If the CLI's `--json` output includes `human_message` / `suggestion` fields, show those to the user. Then show the raw `error` in parentheses for debuggability. If `retryable: false`, do NOT offer a retry.

For RN: if a command errors (e.g., `pod install` fails, `npx expo install` fails), surface the raw error output and consult `cometchat-native-troubleshooting` for the relevant triage table before retrying. Don't loop silently.

If the user's project is bare RN with `ios/` and `android/` but no `package.json` scripts for `ios`/`android` (common when React Native was added incrementally to an existing native app), flag that and pause. Writing integration code won't help if the app can't build.

## Optional: docs MCP

For deeper component customization:
```
claude mcp add --transport http cometchat-docs https://www.cometchat.com/docs/mcp
```

Not required for integration or Phase B CLI flows.

## Skill routing reference

### Web family

| Skill | When to load |
|---|---|
| `cometchat-core` | Always — before any integration code |
| `cometchat-components` | Always — before writing component code |
| `cometchat-placement` | When integrating — for placement patterns |
| `cometchat-react-patterns` | framework = reactjs |
| `cometchat-nextjs-patterns` | framework = nextjs |
| `cometchat-react-router-patterns` | framework = react-router |
| `cometchat-astro-patterns` | framework = astro |
| `cometchat-theming` | When customizing themes |
| `cometchat-features` | When adding features |
| `cometchat-customization` | When writing custom formatters, events, request-builder filters |
| `cometchat-production` | When setting up production auth |
| `cometchat-troubleshooting` | When diagnosing problems |

### React Native family

| Skill | When to load |
|---|---|
| `cometchat-native-core` | Always — before any integration code |
| `cometchat-native-components` | Always — before writing component code |
| `cometchat-native-placement` | When integrating — for placement patterns |
| `cometchat-native-expo-patterns` | framework = expo (managed + Expo Router) |
| `cometchat-native-bare-patterns` | framework = react-native (bare CLI) |
| `cometchat-native-theming` | When customizing themes |
| `cometchat-native-features` | When adding features |
| `cometchat-native-customization` | When writing custom text formatters, events, request-builder filters, or DataSource decorators |
| `cometchat-native-production` | When setting up production auth or user management |
| `cometchat-native-push` | When setting up push notifications |
| `cometchat-native-testing` | When adding tests |
| `cometchat-native-troubleshooting` | When diagnosing problems |
