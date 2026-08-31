import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DripSDK, ethers } from 'dripverse'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const drip = new DripSDK(
  process.env.NEXT_PUBLIC_DRIPVERSE_PROJECT_KEY as string
)

export const switchToPolygonTestnet = async () => {
  return new Promise((resolve, reject) => {
    if (window.ethereum) {
      // Check if current chain is the required chain
      if (window.ethereum.networkVersion !== '80001') {
        const hexParsedChainId = parseChainId(80001)

        window.ethereum
          .request({
            method: 'wallet_switchEthereumChain',
            params: [
              {
                chainId: hexParsedChainId,
              },
            ],
          })
          .then(() => resolve({}))
          .catch((err: any) => {
            // This error code indicates that the chain has not been added to MetaMask
            if (err.code === 4902) {
              // Add chain to Metamask

              window.ethereum
                .request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainName: name,
                      chainId: hexParsedChainId,
                      nativeCurrency: {
                        name: 'matic',
                        decimals: 18,
                        symbol: 'MATIC',
                      },
                      rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
                      blockExplorerUrls: ['https://mumbai.polygonscan.com'],
                    },
                  ],
                })
                .then(() => resolve({}))
                .catch((err: any) => reject(err))
            }
          })
      }
      resolve({})
    } else {
      console.log('Please intall Metamask') // eslint-disable-line no-console
      reject()
    }
  })
}

const parseChainId = (chainId: number) => {
  const hexChainId = ethers.utils.hexlify(chainId)
  // Trim any leading 0s
  return '0x' + hexChainId.split('0x')[1].replace(/^0+/, '')
}
