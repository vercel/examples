type SupportedNetworks = 1 | 4

// this example would work on ethereum mainnet but Rinkeby is used to showcase. For main network change to 1
export const NETWORK_ID = 4

export const ChainLabelMap: Record<SupportedNetworks, string> = {
  1: 'Ethereum',
  4: 'Rinkeby',
}

export const currentChainLabel = ChainLabelMap[NETWORK_ID]
