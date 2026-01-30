# Voice Agent with Vercel Sandbox

A Next.js application that creates on-demand voice AI agents using Vercel Sandbox. Each user session spawns an isolated Python agent environment with Vercel sandbox that handles real-time voice conversations through LiveKit cloud.

## How to Use

You can choose from one of the following two methods to use this repository:

## One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/guides/sandbox-voice-agent&project-name=sandbox-voice-agent&repository-name=sandbox-voice-agent&env=LIVEKIT_API_KEY,LIVEKIT_API_SECRET,LIVEKIT_URL,NEXT_PUBLIC_USE_SANDBOX,AGENT_REPO_URL,AGENT_RUNTIME,SANDBOX_TIMEOUT&envDefaults=%7B%22NEXT_PUBLIC_USE_SANDBOX%22%3A%22true%22%2C%22AGENT_REPO_URL%22%3A%22https%3A%2F%2Fgithub.com%2Flivekit-examples%2Fagent-starter-python.git%22%2C%22AGENT_RUNTIME%22%3A%22python3.13%22%2C%22SANDBOX_TIMEOUT%22%3A%22600000%22%7D)


### Clone and Deploy

You can clone just this directory using:

```bash
npx degit vercel/examples/guides/sandbox-voice-agent sandbox-voice-agent
cd sandbox-voice-agent
```

## How the application works

These steps describe the interaction flow between the user and the Live voice agent in Vercel sandbox:

1. A user clicks **Start call** in their browser
2. The Next.js frontend calls `/api/sandbox/create`
3. The Next.js backend initiates the creation of a Vercel sandbox
4. The sandbox clones the [Livekit python agent repository](https://github.com/livekit-examples/agent-starter-python), installs dependencies, and starts the agent
5. The agent connects to LiveKit Cloud and waits in the room
6. The frontend polls `/api/sandbox/status` for progress
7. When ready, the frontend connects the user to the LiveKit room
8. The user and agent communicate through LiveKit Cloud
9. After 10 minutes (configurable), the sandbox expires automatically


## Prerequisites

- Node.js 18+
- Vercel account with Sandbox API access
- LiveKit Cloud account ([sign up](https://cloud.livekit.io))


## Configure Environment Variables

For `VERCEL_OIDC_TOKEN` for Vercel sandbox creation, link your application from the terminal to a new project on Vercel:

```
pnpm install -g vercel
vercel link
vercel env pull
```

Update the created `.env.local` with the remaining environment variables from `.env.example`

For `LIVEKIT_API_KEY` , `LIVEKIT_API_SECRET` and `LIVEKIT_URL` , create a [Livekit cloud account](https://cloud.livekit.io/). Then, create a free project to get these values.


### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser and click **Start Call**

### 5. Deploy to Vercel

Click the button below to deploy your own instance:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/livekit-examples/agent-starter-react)

After deployment:

1. Add all environment variables from `.env.local` to your Vercel project settings
2. Ensure your Vercel account has Sandbox API access enabled
3. The app will automatically use Vercel's OIDC token in production


## Project Structure

```
sandbox-voice-agent/
├── app/
│   ├── api/
│   │   └── sandbox/
│   │       ├── create/route.ts      # Creates Vercel Sandboxes
│   │       ├── status/route.ts      # Polls sandbox status
│   │       └── stop/route.ts        # Stops sandboxes
│   ├── (app)/
│   └── layout.tsx
├── components/
│   ├── app/
│   │   ├── app.tsx                  # Main app component
│   │   ├── welcome-view.tsx         # Sandbox creation UI
│   │   ├── session-view.tsx         # Voice conversation UI
│   │   └── sandbox-loading.tsx      # Progress indicator
│   └── livekit/                     # LiveKit components
├── hooks/
│   └── useSandboxCreation.ts        # Sandbox lifecycle hook
├── lib/
│   ├── sandbox-manager.ts           # Server-side sandbox tracking
│   └── utils.ts
├── types/
│   └── sandbox.ts                   # TypeScript definitions
├── app-config.ts                    # App configuration
└── package.json
```

## License

This project is open source under the Apache 2.0 license.

## Resources

- [LiveKit Agents Documentation](https://docs.livekit.io/agents)
- [Vercel Sandbox Documentation](https://vercel.com/docs/sandbox)
- [LiveKit JavaScript SDK](https://github.com/livekit/client-sdk-js)
- [Agent Starter Python](https://github.com/livekit-examples/agent-starter-python)
