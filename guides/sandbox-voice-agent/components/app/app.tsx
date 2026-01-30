'use client';

import { useCallback, useMemo, useState } from 'react';
import { TokenSource } from 'livekit-client';
import {
  RoomAudioRenderer,
  SessionProvider,
  StartAudio,
  useSession,
} from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { ViewController } from '@/components/app/view-controller';
import { Toaster } from '@/components/livekit/toaster';
import { useAgentErrors } from '@/hooks/useAgentErrors';
import { useDebugMode } from '@/hooks/useDebug';
import { getSandboxTokenSource, getVercelSandboxTokenSource } from '@/lib/utils';

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';

function AppSetup() {
  useDebugMode({ enabled: IN_DEVELOPMENT });
  useAgentErrors();

  return null;
}

interface AppProps {
  appConfig: AppConfig;
}

export function App({ appConfig }: AppProps) {
  const [vercelSandboxInfo, setVercelSandboxInfo] = useState<{
    sandboxId: string;
    roomName: string;
  } | null>(null);

  // Create token source based on configuration
  const tokenSource = useMemo(() => {
    // If Vercel Sandbox is enabled and we have sandbox info, use custom token source
    if (appConfig.useVercelSandbox && vercelSandboxInfo) {
      return getVercelSandboxTokenSource(vercelSandboxInfo.sandboxId, vercelSandboxInfo.roomName);
    }

    // LiveKit Cloud Sandbox mode
    if (typeof process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT === 'string') {
      return getSandboxTokenSource(appConfig);
    }

    // Standard mode
    return TokenSource.endpoint('/api/connection-details');
  }, [appConfig, vercelSandboxInfo]);

  const session = useSession(
    tokenSource,
    appConfig.agentName ? { agentName: appConfig.agentName } : undefined
  );

  // Callback to set Vercel Sandbox info from child components
  const handleVercelSandboxReady = useCallback((sandboxId: string, roomName: string) => {
    setVercelSandboxInfo({ sandboxId, roomName });
  }, []);

  return (
    <SessionProvider session={session}>
      <AppSetup />
      <main className="grid h-svh grid-cols-1 place-content-center">
        <ViewController appConfig={appConfig} onVercelSandboxReady={handleVercelSandboxReady} />
      </main>
      <StartAudio label="Start Audio" />
      <RoomAudioRenderer />
      <Toaster />
    </SessionProvider>
  );
}
