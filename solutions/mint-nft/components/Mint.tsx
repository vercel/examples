import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAccount, useNetwork } from 'wagmi'
import Moralis from 'moralis'
import { ConnectWallet } from './ConnectWallet'
import { SwitchNetwork } from './SwitchNetwork'
import { UploadNft } from './UploadNft'
import { Button, LoadingDots, Text } from '@vercel/examples-ui'
import { NETWORK_ID } from '../helpers/constant.helpers'
import Image from 'next/image'

enum MintState {
  Connect,
  ConfirmNetwork,
  Upload,
  ConfirmMint,
  Loading,
}

export const Mint: React.VFC = () => {
  const router = useRouter()
  const [state, setState] = useState<MintState>(MintState.Connect)

  const [loading, setLoading] = useState(false)

  const [asset, setAsset] = useState<Moralis.File | null>(null)
  const [{ data: accountData }] = useAccount()
  const [{ data: networkData }] = useNetwork()

  useEffect(() => {
    if (accountData?.address) {
      setState(MintState.ConfirmNetwork)
    } else {
      setState(MintState.Connect)
    }
  }, [accountData?.address])

  useEffect(() => {
    if (networkData?.chain?.id === NETWORK_ID) {
      setState(MintState.Upload)
    }
  }, [networkData.chain?.id])

  const handleMint = async () => {
    try {
      setLoading(true)
      await Moralis.enableWeb3()

      const metadata = {
        name: 'My own NFT by Vercel',
        description: 'NFTs minted using Vercel and Next.js',
        //@ts-ignore
        image: `/ipfs/${asset!.hash()}`,
      }

      const jsonFile = new Moralis.File('metadata.json', {
        base64: btoa(JSON.stringify(metadata)),
      })
      await jsonFile.saveIPFS()

      //@ts-ignore
      const metadataHash = jsonFile.hash()

      const { data } = await Moralis.Plugins.rarible.lazyMint({
        chain: 'rinkeby',
        userAddress: accountData?.address,
        tokenType: 'ERC721',
        tokenUri: `ipfs://${metadataHash}`,
        supply: 1,
        royaltiesAmount: 1,
      })
      setTimeout(() => {
        router.push(
          `https://rinkeby.rarible.com/token/${data.result.tokenAddress}:${data.result.tokenId}`
        )
      }, 1000)
    } catch (e) {
      console.error(e)
    }
  }

  const onUploadComplete = async (asset: Moralis.File) => {
    setAsset(asset)
    setState(MintState.ConfirmMint)
    setLoading(false)
  }

  return (
    <div className="inline-block align-bottom text-left overflow-hidden  transform transition-all sm:my-8 sm:align-middle  ">
      {state === MintState.Connect && <ConnectWallet />}

      {state === MintState.ConfirmNetwork && <SwitchNetwork />}

      {state === MintState.Upload && <UploadNft onDone={onUploadComplete} />}

      {state === MintState.ConfirmMint && (
        <>
          <Text variant="h2">Confirm your mint</Text>
          <Text className="mt-6">
            Your image will be minted as an ERC721 Token. It can happen that
            images stored on IPFS as it is a distributed file hosting system
            that can fail. This is still the prefered method of choice to host
            in the NFT community as it is decentralized.{' '}
            <span className="underline italic">
              This process might take up to 1 minute to complete
            </span>
          </Text>
          <section className="relative w-full pb-[20%] h-48 pb-6 mt-12">
            <Image
              className="rounded-xl"
              src={String(asset?._url)}
              alt="The image that will be minted as an NFT"
              layout="fill"
              objectFit="contain"
            />
          </section>

          <section className="flex justify-center mt-6">
            <Button
              size="lg"
              variant="black"
              onClick={handleMint}
              disabled={!accountData || !asset || loading}
            >
              {loading ? <LoadingDots /> : 'Mint'}
            </Button>
          </section>
        </>
      )}
    </div>
  )
}
