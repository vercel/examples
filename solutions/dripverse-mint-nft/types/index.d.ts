// Declaring global window.ethereum object
declare global {
  interface Window {
    ethereum: {
      removeListener<T>(event: string, cb: (params: T) => void): void
      request<T>(params: {
        method: string
        params?: any[] | undefined
      }): Promise<T>
      on<T>(event: string, cb: (params: T) => void): void
      selectedAddress: string | null
      isMetaMask: boolean
      networkVersion: string
    }
  }
}

// Adding export statement in order to make the global variable accessible in all files
export {}
