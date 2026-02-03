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

const STATUS_PROGRESS: Record<SandboxCreationStatus, number> = {
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
  'Words mean more than what is set down on paper. ' +
    'It takes the human voice to infuse them with meaning.',
  'A voice is a human gift; it should be cherished and used, ' +
    'to utter fully human speech.',
  'The most important things are the hardest to say, ' +
    'because words diminish them.',
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

const STORAGE_KEY = 'vercel_sandbox_session';

export function useSandboxCreation() {
  const [status, setStatus] = useState<SandboxCreationStatus>('idle');
  const [sandbox, setSandbox] = useState<SandboxInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [quote, setQuote] = useState('');
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isCheckingExisting, setIsCheckingExisting] = useState(true);

  useEffect(() => {
    const checkExisting = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          setIsCheckingExisting(false);
          return;
        }

        const { sandboxId, timestamp } = JSON.parse(stored);
        if (Date.now() - timestamp > 600000) {
          localStorage.removeItem(STORAGE_KEY);
          setIsCheckingExisting(false);
          return;
        }

        const res = await fetch(`/api/sandbox/status?sandboxId=${sandboxId}`);
        if (!res.ok) {
          localStorage.removeItem(STORAGE_KEY);
          setIsCheckingExisting(false);
          return;
        }

        const data = await res.json();
        if (data.sandbox?.status === 'ready' || data.sandbox?.status === 'running') {
          console.log('[useSandboxCreation] Resuming sandbox:', sandboxId);
          setSandbox(data.sandbox);
          setStatus('ready');
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (err) {
        console.error('[useSandboxCreation] Error checking existing:', err);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsCheckingExisting(false);
      }
    };

    checkExisting();
  }, []);

  useEffect(() => {
    const target = STATUS_PROGRESS[status];

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((current) => {
        if (current < target) {
          const diff = target - current;
          const increment = Math.max(0.3, diff / 30);
          return Math.min(current + increment, target);
        }
        return current;
      });
    }, 50);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [status]);

  useEffect(() => {
    if (status !== 'idle' && status !== 'ready' && status !== 'error') {
      setQuote(VOICE_QUOTES[Math.floor(Math.random() * VOICE_QUOTES.length)]);

      const interval = setInterval(() => {
        setQuote(VOICE_QUOTES[Math.floor(Math.random() * VOICE_QUOTES.length)]);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [status]);

  const createSandbox = useCallback(async () => {
    if (status !== 'idle') {
      console.warn('[useSandboxCreation] Already creating, ignoring');
      return sandbox;
    }

    setStatus('creating');
    setError(null);

    try {
      const createRes = await fetch('/api/sandbox/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: {} }),
      });

      if (!createRes.ok) {
        throw new Error(`Failed to create sandbox: ${createRes.statusText}`);
      }

      const createData = await createRes.json();
      if (!createData.success) {
        throw new Error(createData.error || 'Failed to create sandbox');
      }

      const sandboxId = createData.sandbox.id;
      let attempts = 0;
      let currentStatus: SandboxCreationStatus = 'creating';

      while (attempts < 60) {
        const statusRes = await fetch(
          `/api/sandbox/status?sandboxId=${sandboxId}`
        );

        if (!statusRes.ok) {
          throw new Error(`Failed to check status: ${statusRes.statusText}`);
        }

        const statusData = await statusRes.json();
        const current = statusData.sandbox;

        if (current.progressMessage) {
          setProgressMessage(current.progressMessage);
        }

        let newStatus: SandboxCreationStatus = currentStatus;

        switch (current.status) {
          case 'creating':
            newStatus = 'creating';
            break;
          case 'installing':
            if (current.progressMessage?.includes('Cloning')) {
              newStatus = 'creating';
            } else if (current.progressMessage?.includes('Downloading')) {
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
            setSandbox(current);
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
              sandboxId: current.id,
              timestamp: Date.now(),
            }));
            return current;
          case 'failed':
            throw new Error(current.error || 'Sandbox creation failed');
        }

        if (newStatus !== currentStatus) {
          currentStatus = newStatus;
          setStatus(newStatus);
        }

        attempts++;
        await new Promise((r) => setTimeout(r, 1000));
      }

      throw new Error('Sandbox creation timed out');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      setStatus('error');
      return null;
    }
  }, [status, sandbox]);

  const cleanup = useCallback(async () => {
    if (!sandbox?.id) {
      console.log('[useSandboxCreation] No sandbox to clean up');
      return;
    }

    console.log('[useSandboxCreation] Cleaning up:', sandbox.id);

    try {
      const res = await fetch('/api/sandbox/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sandboxId: sandbox.id }),
      });

      if (!res.ok) {
        console.error('[useSandboxCreation] Failed to stop:', res.statusText);
      }
    } catch (err) {
      console.error('[useSandboxCreation] Error stopping:', err);
    }

    localStorage.removeItem(STORAGE_KEY);
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
    localStorage.removeItem(STORAGE_KEY);
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
