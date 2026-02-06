export interface AppConfig {
  pageTitle: string;
  pageDescription: string;
  companyName: string;

  supportsChatInput: boolean;
  supportsVideoInput: boolean;
  supportsScreenShare: boolean;
  isPreConnectBufferEnabled: boolean;

  logo: string;
  startButtonText: string;
  accent?: string;
  logoDark?: string;
  accentDark?: string;

  // for LiveKit Cloud Sandbox (different from Vercel Sandbox)
  sandboxId?: string;
  agentName?: string;

  // Vercel Sandbox Configuration (On-Demand Agent Hosting)
  useVercelSandbox?: boolean;
  sandboxAgentRepo?: string;
  sandboxRuntime?: 'python3.13' | 'node24' | 'node22';
  sandboxLoadingText?: string;
}

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'Vercel',
  pageTitle: 'On-Demand Voice Agent',
  pageDescription: 'A voice agent with on-demand sandbox hosting',

  supportsChatInput: true,
  supportsVideoInput: true,
  supportsScreenShare: true,
  isPreConnectBufferEnabled: true,

  logo: '/lk-logo.svg',
  accent: '#000000',
  logoDark: '/lk-logo-dark.svg',
  accentDark: '#ffffff',
  startButtonText: 'Start call',

  // for LiveKit Cloud Sandbox (different from Vercel Sandbox)
  sandboxId: undefined,
  agentName: undefined,

  // Vercel Sandbox Configuration
  useVercelSandbox: process.env.NEXT_PUBLIC_USE_SANDBOX === 'true',
  sandboxAgentRepo:
    process.env.AGENT_REPO_URL || 'https://github.com/livekit-examples/agent-starter-python.git',
  sandboxRuntime: (process.env.AGENT_RUNTIME as 'python3.13' | 'node24' | 'node22') || 'python3.13',
  sandboxLoadingText: 'Preparing your voice agent...',
};
