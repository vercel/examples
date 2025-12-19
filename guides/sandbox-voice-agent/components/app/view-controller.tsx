'use client';

import { useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSessionContext } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { SessionView } from '@/components/app/session-view';
import { WelcomeView } from '@/components/app/welcome-view';

const MotionWelcomeView = motion.create(WelcomeView);
const MotionSessionView = motion.create(SessionView);

const VIEW_MOTION_PROPS = {
  variants: {
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: {
    duration: 0.5,
    ease: 'linear',
  },
};

interface ViewControllerProps {
  appConfig: AppConfig;
  onVercelSandboxReady?: (sandboxId: string, roomName: string) => void;
}

export function ViewController({ appConfig, onVercelSandboxReady }: ViewControllerProps) {
  const { isConnected, start } = useSessionContext();

  // Handle sandbox readiness
  const handleSandboxReady = useCallback(
    (sandboxId: string, roomName: string) => {
      // Notify parent component (App) about sandbox info
      if (onVercelSandboxReady) {
        onVercelSandboxReady(sandboxId, roomName);
      }
      // Start the session
      start();
    },
    [onVercelSandboxReady, start]
  );

  return (
    <AnimatePresence mode="wait">
      {/* Welcome view */}
      {!isConnected && (
        <MotionWelcomeView
          key="welcome"
          {...VIEW_MOTION_PROPS}
          startButtonText={appConfig.startButtonText}
          onStartCall={start}
          useVercelSandbox={appConfig.useVercelSandbox}
          onSandboxReady={handleSandboxReady}
        />
      )}
      {/* Session view */}
      {isConnected && (
        <MotionSessionView key="session-view" {...VIEW_MOTION_PROPS} appConfig={appConfig} />
      )}
    </AnimatePresence>
  );
}
