import { Fragment, useCallback, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { DropZone } from './DropZone'
import { useAccount, useConnect } from 'wagmi'
import Moralis from 'moralis'
import { NftImage } from './NftImage'
import Lottie from 'react-lottie-player'
import { ConnectWallet } from './ConnectWallet'
import { isImageSafe, resizeImage } from '../helpers/sanitize.helpers'
import { useMoralis } from 'react-moralis'

type props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export const MintModal: React.VFC<props> = ({ open, setOpen }) => {
  const notConnectedWarning = 'Please connect your wallet first'
  const imageNotSafeWarning = "Oops! We can't mint this!"
  const router = useRouter()
  const [loadingAnimationData, setLoadingAnimationData] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [imageWarning, setImageWarning] = useState('')

  const [asset, setAsset] = useState<Moralis.File | null>(null)
  const [{ data: connectData }, connect] = useConnect()
  const [{ data: accountData }] = useAccount({
    fetchEns: true,
  })

  console.log(accountData)

  const handleReset = () => {
    setLoading(false)
    setAsset(null)
    setOpen(false)
  }

  useEffect(() => {
    import('../lottie.animation.json').then(setLoadingAnimationData)
  }, [])

  useEffect(() => {
    if (accountData?.address && imageWarning === notConnectedWarning) {
      setImageWarning('')
    }
  }, [accountData?.address])

  const onDrop = useCallback(
    async (acceptedFiles) => {
      try {
        if (!accountData?.address) {
          setImageWarning('Please connect your wallet first')
          return
        }
        await connect(connectData.connectors[0])
        setLoading(true)
        setImageWarning('')

        const data = acceptedFiles[0]

        const imageSafety = await isImageSafe(data)

        if (Object.values(imageSafety).some((safe) => !safe)) {
          setImageWarning(imageNotSafeWarning)
          setLoading(false)
          return
        }

        const imageFile = new Moralis.File(data.name, data)

        await imageFile.saveIPFS()
        setLoading(false)
        setAsset(imageFile)
      } catch (e) {
        console.error(e)
      }
    },
    [accountData?.address]
  )

  const handleMint = async () => {
    try {
      setLoading(true)
      setImageWarning('')
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

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setOpen}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ">
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
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle  sm:p-6 h-[85vh] min-w-[50vw]">
                <ConnectWallet />

                {!asset && !loading && <DropZone onDrop={onDrop} />}

                {imageWarning.length > 0 && !loading && (
                  <aside
                    role="alert"
                    className="flex w-full justify-center mt-4 text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600"
                  >
                    {imageWarning}
                  </aside>
                )}

                {asset && !loading && (
                  <ul className="h-80 flex items-center justify-center">
                    <NftImage
                      height={300}
                      width={300}
                      href="/"
                      alt="your newly uploaded nft"
                      imageSrc={asset.url()}
                    />
                  </ul>
                )}

                {asset && loading && (
                  <div className="h-80 flex items-center justify-center flex-col">
                    Minting...
                    <Lottie
                      style={{ width: 300, height: 300 }}
                      animationData={loadingAnimationData}
                      play
                      loop
                    />
                  </div>
                )}

                {!asset && loading && (
                  <div className="h-80 flex items-center justify-center flex-col">
                    Uploading to IPFS...
                    <Lottie
                      style={{ width: 300, height: 300 }}
                      animationData={loadingAnimationData}
                      play
                      loop
                    />
                  </div>
                )}

                <section className="mt-8 flex justify-center">
                  <button
                    onClick={handleMint}
                    disabled={!accountData || !asset || loading}
                    className="cursor-pointer border-2 border-gray-500  inline-block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-gray-900 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 disabled:bg-slate-50disabled:border-slate-200 disabled:shadow-none
                  invalid:border-pink-500 invalid:text-pink-600 disabled:cursor-not-allowed
                  focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                  >
                    Mint now!
                  </button>
                </section>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
