type SupportedNetworks = 1 | 5

// this example would work on ethereum mainnet but Goerli is used to showcase. For main network change to "0x1"
export const NETWORK_ID = 5

export const ChainLabelMap: Record<SupportedNetworks, string> = {
  1: 'Ethereum',
  5: 'Goerli',
}

export const currentChainLabel = ChainLabelMap[NETWORK_ID]
