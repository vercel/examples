import { useCallback, useEffect, useRef, useState } from 'react';
import type { SandboxInfo } from '@/types/sandbox';

export type SandboxCreationStatus =
  | 'idle'
  | 'creating'
  | 'installing'
  | 'downloading'
  | 'starting'
  | 'ready'
  | 'error';

interface UseSandboxCreationResult {
  status: SandboxCreationStatus;
  sandbox: SandboxInfo | null;
  error: string | null;
  progress: number;
  progressMessage: string | null;
  quote: string;
  createSandbox: () => Promise<SandboxInfo | null>;
  reset: () => void;
  cleanup: () => Promise<void>;
  isCheckingExisting: boolean;
}

const STATUS_PROGRESS_MAP: Record<SandboxCreationStatus, number> = {
  idle: 0,
  creating: 20,
  installing: 50,
  downloading: 70,
  starting: 90,
  ready: 100,
  error: 0,
};

const VOICE_QUOTES = [
  'The human voice is the most perfect instrument of all.',
  'Voice is the mirror of the soul.',
  'In the beginning was the Word, and the Word was with AI.',
  'Your voice is your power. Let it be heard.',
  'The voice is a second face.',
  'Words mean more than what is set down on paper. It takes the human voice to infuse them with meaning.',
  'A voice is a human gift; it should be cherished and used, to utter fully human speech.',
  'The most important things are the hardest to say, because words diminish them.',
];

const STATUS_MESSAGES: Record<SandboxCreationStatus, string> = {
  idle: 'Ready to start',
  creating: 'Creating sandbox environment...',
  installing: 'Installing dependencies...',
  downloading: 'Downloading model files...',
  starting: 'Starting voice agent...',
  ready: 'Agent ready!',
  error: 'Failed to create sandbox',
};

const SANDBOX_STORAGE_KEY = 'vercel_sandbox_session';

export function useSandboxCreation(): UseSandboxCreationResult {
  const [status, setStatus] = useState<SandboxCreationStatus>('idle');
  const [sandbox, setSandbox] = useState<SandboxInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [quote, setQuote] = useState('');
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isCheckingExisting, setIsCheckingExisting] = useState(true);

  // Check for existing sandbox on mount
  useEffect(() => {
    const checkExistingSandbox = async () => {
      try {
        const stored = localStorage.getItem(SANDBOX_STORAGE_KEY);
        if (!stored) {
          setIsCheckingExisting(false);
          return;
        }

        const { sandboxId, timestamp } = JSON.parse(stored);
        const age = Date.now() - timestamp;

        // If sandbox session is older than 10 minutes, ignore it
        if (age > 600000) {
          localStorage.removeItem(SANDBOX_STORAGE_KEY);
          setIsCheckingExisting(false);
          return;
        }

        // Check if sandbox still exists and is ready
        const statusResponse = await fetch(`/api/sandbox/status?sandboxId=${sandboxId}`);
        if (!statusResponse.ok) {
          localStorage.removeItem(SANDBOX_STORAGE_KEY);
          setIsCheckingExisting(false);
          return;
        }

        const statusData = await statusResponse.json();
        if (statusData.success && statusData.sandbox) {
          const existingSandbox = statusData.sandbox;

          // Only resume if sandbox is ready or running
          if (
            existingSandbox.status === 'ready' ||
            existingSandbox.status === 'running'
          ) {
            console.log('[useSandboxCreation] Resuming existing sandbox:', sandboxId);
            setSandbox(existingSandbox);
            setStatus('ready');
          } else {
            // Sandbox exists but not ready, remove from storage
            localStorage.removeItem(SANDBOX_STORAGE_KEY);
          }
        } else {
          localStorage.removeItem(SANDBOX_STORAGE_KEY);
        }
      } catch (error) {
        console.error('[useSandboxCreation] Error checking existing sandbox:', error);
        localStorage.removeItem(SANDBOX_STORAGE_KEY);
      } finally {
        setIsCheckingExisting(false);
      }
    };

    checkExistingSandbox();
  }, []);

  // Smooth progress animation
  useEffect(() => {
    const targetProgress = STATUS_PROGRESS_MAP[status];

    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    // Animate progress towards target
    progressIntervalRef.current = setInterval(() => {
      setProgress((current) => {
        if (current < targetProgress) {
          const diff = targetProgress - current;
          const increment = Math.max(0.3, diff / 30); // Slower, smoother animation
          return Math.min(current + increment, targetProgress);
        }
        return current;
      });
    }, 50);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [status]);

  // Rotate quotes every 8 seconds
  useEffect(() => {
    if (status !== 'idle' && status !== 'ready' && status !== 'error') {
      // Set initial quote
      setQuote(VOICE_QUOTES[Math.floor(Math.random() * VOICE_QUOTES.length)]);

      const interval = setInterval(() => {
        setQuote(VOICE_QUOTES[Math.floor(Math.random() * VOICE_QUOTES.length)]);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [status]);

  const createSandbox = useCallback(async () => {
    // Prevent multiple simultaneous creation attempts
    if (status !== 'idle') {
      console.warn('[useSandboxCreation] Already creating/created, ignoring duplicate request');
      return sandbox;
    }

    setStatus('creating');
    setError(null);

    try {
      // Create sandbox
      const createResponse = await fetch('/api/sandbox/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            // Use defaults from environment variables
          },
        }),
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create sandbox: ${createResponse.statusText}`);
      }

      const createData = await createResponse.json();

      if (!createData.success) {
        throw new Error(createData.error || 'Failed to create sandbox');
      }

      // Poll for sandbox status
      const sandboxId = createData.sandbox.id;
      let attempts = 0;
      const maxAttempts = 60; // 60 seconds max
      const pollInterval = 1000; // 1 second
      let currentStatus: SandboxCreationStatus = 'creating';

      while (attempts < maxAttempts) {
        const statusResponse = await fetch(`/api/sandbox/status?sandboxId=${sandboxId}`);

        if (!statusResponse.ok) {
          throw new Error(`Failed to check sandbox status: ${statusResponse.statusText}`);
        }

        const statusData = await statusResponse.json();
        const currentSandbox = statusData.sandbox;

        // Update progress message from backend
        if (currentSandbox.progressMessage) {
          setProgressMessage(currentSandbox.progressMessage);
        }

        // Update status based on sandbox state with more granular steps
        let newStatus: SandboxCreationStatus = currentStatus;

        switch (currentSandbox.status) {
          case 'creating':
            newStatus = 'creating';
            break;
          case 'installing':
            // Use progress message to determine sub-stage within installing
            if (currentSandbox.progressMessage?.includes('Cloning repository')) {
              newStatus = 'creating';
            } else if (currentSandbox.progressMessage?.includes('Installing')) {
              newStatus = 'installing';
            } else if (currentSandbox.progressMessage?.includes('SSL certificates')) {
              newStatus = 'installing';
            } else if (currentSandbox.progressMessage?.includes('Downloading')) {
              newStatus = 'downloading';
            } else {
              newStatus = 'installing';
            }
            break;
          case 'starting':
            newStatus = 'starting';
            break;
          case 'ready':
            setStatus('ready');
            setSandbox(currentSandbox);
            // Store sandbox ID in localStorage for page reload recovery
            localStorage.setItem(
              SANDBOX_STORAGE_KEY,
              JSON.stringify({
                sandboxId: currentSandbox.id,
                timestamp: Date.now(),
              })
            );
            return currentSandbox;
          case 'failed':
            throw new Error(currentSandbox.error || 'Sandbox creation failed');
        }

        // Update status if it changed
        if (newStatus !== currentStatus) {
          currentStatus = newStatus;
          setStatus(newStatus);
        }

        attempts++;
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }

      throw new Error('Sandbox creation timed out');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setStatus('error');
      return null;
    }
  }, [status, sandbox]);

  const cleanup = useCallback(async () => {
    if (!sandbox?.id) {
      console.log('[useSandboxCreation] No sandbox to clean up');
      return;
    }

    console.log('[useSandboxCreation] Cleaning up sandbox:', sandbox.id);

    try {
      // Call stop API endpoint
      const response = await fetch('/api/sandbox/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sandboxId: sandbox.id,
        }),
      });

      if (!response.ok) {
        console.error('[useSandboxCreation] Failed to stop sandbox:', response.statusText);
      } else {
        console.log('[useSandboxCreation] Sandbox stopped successfully');
      }
    } catch (error) {
      console.error('[useSandboxCreation] Error stopping sandbox:', error);
    }

    // Clear local state and storage regardless of API result
    localStorage.removeItem(SANDBOX_STORAGE_KEY);
    setStatus('idle');
    setSandbox(null);
    setError(null);
    setProgressMessage(null);
    setProgress(0);
    setQuote('');
  }, [sandbox]);

  const reset = useCallback(() => {
    setStatus('idle');
    setSandbox(null);
    setError(null);
    setProgressMessage(null);
    setProgress(0);
    setQuote('');
    // Clear stored sandbox session
    localStorage.removeItem(SANDBOX_STORAGE_KEY);
  }, []);

  return {
    status,
    sandbox,
    error,
    progress: Math.round(progress),
    progressMessage,
    quote,
    createSandbox,
    reset,
    cleanup,
    isCheckingExisting,
  };
}

export { STATUS_MESSAGES };
