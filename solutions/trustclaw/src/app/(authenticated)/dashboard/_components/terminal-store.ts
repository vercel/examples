import { create } from 'zustand'

interface TerminalState {
  terminalOpen: boolean
  setTerminalOpen: (open: boolean) => void
}

export const useTerminalStore = create<TerminalState>((set) => ({
  terminalOpen: true,
  setTerminalOpen: (terminalOpen) => set({ terminalOpen }),
}))
