type SupportedNetworks = "0x1" | "0x4"

// this example would work on ethereum mainnet but Rinkeby is used to showcase. For main network change to "0x1"
export const NETWORK_ID = "0x4"

export const ChainLabelMap: Record<SupportedNetworks, string> = {
  "0x1": 'Ethereum',
  "0x4": 'Rinkeby',
}

export const currentChainLabel = ChainLabelMap[NETWORK_ID]
