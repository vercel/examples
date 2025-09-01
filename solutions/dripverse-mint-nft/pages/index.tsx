import FileUploader from '@/components/FileUploader'
import { useIpfsImageUpload } from '@/hooks/useIpfsUpload'
import { drip, switchToPolygonTestnet } from '@/lib/utils'
import {
  Layout,
  Text,
  Page,
  Code,
  Link,
  Button,
  Input,
} from '@vercel/examples-ui'
import { ethers } from 'dripverse'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

function Home() {
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isMinting, setIsMinting] = useState(false)
  const [mintResponse, setMintResponse] = useState<any>(null)
  const [isMaticTestnet, setIsMaticTestnet] = useState(false)
  const [image, setImage] = useState<any>()

  const {
    mutate: uploadFile,
    isLoading: isUploading,
    data: imageHash,
    isSuccess: isUploadSuccess,
  } = useIpfsImageUpload()

  useEffect(() => {
    const { ethereum } = window as any

    if (!ethereum) {
      return
    }

    setIsMaticTestnet(ethereum.chainId === '0x13881')

    ethereum.on('chainChanged', (chainId: string) => {
      setIsMaticTestnet(chainId === '0x13881')
    })
  }, [])

  useEffect(() => {
    if (isMinting) {
      return
    }
    if (isUploadSuccess) {
      const mint = async () => {
        setIsMinting(true)
        try {
          let contract: ethers.Contract | null = null

          contract = await drip.contractClient({
            contractId: "9"
          })

          if (!contract) {
            toast.error('Failed to fetch contract', {
              id: 'mint-error',
            })
            setIsMinting(false)
            return
          }

          const walletProvider = new ethers.providers.Web3Provider(
            window.ethereum,
            'any'
          )

          if (!walletProvider) {
            toast.error('Failed to fetch provider', {
              id: 'mint-error',
            })
            setIsMinting(false)
            return
          }

          const ethersSigner = walletProvider.getSigner()

          const contractSigner = contract.connect(ethersSigner)

          const imageLink = `https://${imageHash}.ipfs.nftstorage.link/${image.path}`

          const mintData = {
            name,
            description,
            asset: imageLink,
            networkId: 1,
            userAccount: address,
          }

          let response: any

          response = await drip.mint(mintData, imageHash, contractSigner)

          if (!response) {
            toast.error('Failed to mint', {
              id: 'mint-error',
            })
          } else {
            toast.success('Minted successfully', {
              id: 'mint-success',
            })
            setName('')
            setDescription('')
            setImage(null)

            setMintResponse(response)
          }

          setIsMinting(false)
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err)
          setIsMinting(false)
          toast.error('Minting Failed', {
            id: 'mintFailed',
          })
        }
      }
      mint()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploadSuccess])

  const handleConnect = async () => {
    const { ethereum } = window as any

    if (!ethereum) {
      alert('Please install MetaMask to use this dApp!')
      return
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setAddress(accounts[0])
  }

  const handleSubmit = () => {
    if (isMinting || isUploading) {
      return
    }

    // Uploading image to IPFS
    if (image) {
      const formData = new FormData()
      formData.append('file', image)

      uploadFile(formData)
    }
  }

  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">Mint NFTs using DripVerse SDK</Text>
        <Text>
          This example shows how to mint NFTs using DripVerse SDK with minimal
          code. Visit{' '}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://dripverse.org"
          >
            DripVerse
          </Link>{' '}
          to learn more.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Deployment</Text>
        <Text>
          Deploy your own version of this example by following the{' '}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/vercel/examples/blob/main/solutions/dripverse-mint-nft/README.md"
          >
            README.md
          </Link>
          . Or clone and deploy to Vercel directly using the button on top
          right. You can get the required environment variables from the{' '}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/vercel/examples/blob/main/solutions/dripverse-mint-nft/.env.example"
          >
            .env.example
          </Link>{' '}
          file.
        </Text>
      </section>

      <section>
        <Text variant="h2">Connect your wallet</Text>
        {address ? (
          <Text className="mt-4">
            Your wallet address is <Code>{address}</Code>
          </Text>
        ) : (
          <>
            <Text className="mt-2">
              Connect your Metamask wallet to mint NFTs.
            </Text>
            <Button className="mt-4" onClick={handleConnect}>
              Connect
            </Button>
          </>
        )}

        {address && !isMaticTestnet && (
          <>
            <Text className="mt-4">
              Please switch to Matic Testnet to run this example.
            </Text>

            <Button
              className="mt-4"
              onClick={async () => {
                await switchToPolygonTestnet()
              }}
            >
              Switch to Matic Testnet
            </Button>
          </>
        )}
      </section>

      {address && isMaticTestnet && (
        <section className="flex flex-col gap-3">
          <Text variant="h2">Mint NFT</Text>

          <div>
            <FileUploader image={image} setImage={setImage} />
          </div>

          <div className="flex flex-col gap-3">
            <Text className="mt-2">Name of the NFT</Text>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-3">
            <Text className="mt-2">Description</Text>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button
            className="mt-4"
            disabled={!name || !description || !image}
            loading={isUploading || isMinting}
            onClick={handleSubmit}
          >
            {mintResponse ? 'Minted' : 'Mint'}
          </Button>

          {mintResponse && (
            <div className="flex flex-col gap-3 mt-5">
              <Text variant="h2" className="text-center text-green-600">
                Minted successfully!
              </Text>
              <Text className="mt-2">Transaction Hash</Text>
              <Code>{mintResponse?.transactionHash}</Code>
              <Text className="mt-2">Token ID</Text>
              <Code>{mintResponse?.tokenId}</Code>
              <Text className="mt-2">Check out your NFT on DripVerse</Text>
              <Link
                href={`https://dripverse.org/nft/${mintResponse?.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>View on DripVerse</Button>
              </Link>
            </div>
          )}
        </section>
      )}
    </Page>
  )
}

Home.Layout = Layout

export default Home
