import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { useAccount, useNetwork } from 'wagmi'
import Moralis from 'moralis'
import { ConnectWallet } from './ConnectWallet'
import { SwitchNetwork } from './SwitchNetwork'
import { UploadNft } from './UploadNft'
import { Button, LoadingDots, Text } from '@vercel/examples-ui'
import { NETWORK_ID } from '../helpers/constant.helpers'
import { NftImage } from './NftImage'

type props = {
  open: boolean
  setOpen: (open: boolean) => void
}

enum MintState {
  Connect,
  ConfirmNetwork,
  Upload,
  ConfirmMint,
  Loading,
}

export const MintModal: React.VFC<props> = ({ open, setOpen }) => {
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

  const handleReset = () => {
    setLoading(false)
    setAsset(null)
    setOpen(false)
  }

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

        handleReset()
      }, 1000)
    } catch (e) {
      console.error(e)
    }
  }

  const onUploadComplete = async (asset: Moralis.File) => {
    setAsset(asset)
    setState(MintState.ConfirmMint)
  }

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setOpen}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-96 text-center sm:block sm:p-0 ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle  sm:p-6 min-h-[40vh] min-w-[50vw]">
                {state === MintState.Connect && <ConnectWallet />}

                {state === MintState.ConfirmNetwork && <SwitchNetwork />}

                {state === MintState.Upload && (
                  <UploadNft onDone={onUploadComplete} />
                )}

                {state === MintState.ConfirmMint && (
                  <>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Confirm your mint
                    </h3>
                    <Text className="max-w-xl mt-6 text-sm text-gray-500">
                      Your image will be minted as an ERC721 Token.
                    </Text>
                    <NftImage
                      src={String(asset?._url)}
                      width={400}
                      height={400}
                      alt="Your recently uploaded NFT"
                    />
                    <section className="mt-8 flex justify-center">
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
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
