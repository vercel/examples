'use client';

import { type ReactNode, createContext, useCallback, useContext, useState } from 'react';

interface VercelSandboxContextType {
  sandboxId: string | null;
  roomName: string | null;
  setSandboxInfo: (sandboxId: string, roomName: string) => void;
}

const VercelSandboxContext = createContext<VercelSandboxContextType | null>(null);

export function VercelSandboxProvider({ children }: { children: ReactNode }) {
  const [sandboxId, setSandboxId] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);

  const setSandboxInfo = useCallback((newSandboxId: string, newRoomName: string) => {
    setSandboxId(newSandboxId);
    setRoomName(newRoomName);
  }, []);

  return (
    <VercelSandboxContext.Provider value={{ sandboxId, roomName, setSandboxInfo }}>
      {children}
    </VercelSandboxContext.Provider>
  );
}

export function useVercelSandbox() {
  const context = useContext(VercelSandboxContext);
  if (!context) {
    throw new Error('useVercelSandbox must be used within VercelSandboxProvider');
  }
  return context;
}
