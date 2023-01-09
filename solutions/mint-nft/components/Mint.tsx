import { useState, useEffect } from 'react';
import { ConnectWallet } from './ConnectWallet';
import { SwitchNetwork } from './SwitchNetwork';
import { UploadNft } from './UploadNft';
import { Button, LoadingDots, Text } from '@vercel/examples-ui';
import { useAccount, useNetwork } from 'wagmi';
import { useSession } from "next-auth/react"
import { NETWORK_ID } from '../helpers/constant.helpers';
import { useRouter } from 'next/router'
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import axios from 'axios';
import Image from 'next/image';
import NFTAbi from "../hardhat/artifacts/contracts/NFT.sol/NFT.json";
import NFTAddress from '../utils/constant';

enum MintState {
  Connect,
  ConfirmNetwork,
  Upload,
  ConfirmMint,
  Loading,
}

export const Mint: React.VFC = () => {
  const [state, setState] = useState<MintState>(MintState.Connect);
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [asset, setAsset] = useState<string | null>(null);
  const [tokenUri, setTokenUri] = useState<string | null>(null);
  const { status } = useSession();
  const router = useRouter();

  const { data, refetch } = useContractRead({
    address: NFTAddress,
    abi: NFTAbi.abi,
    functionName: 'totalSupply',
  })

  const { config } = usePrepareContractWrite({
    address: NFTAddress,
    abi: NFTAbi.abi,
    functionName: 'safeMint',
    args: [address, tokenUri],
    onSuccess: () => {
      try {
        const tokenId = (data as any)?.toString();
        setTimeout(() => {
          router.push(
            `https://testnets.opensea.io/assets/goerli/${NFTAddress}/${tokenId}`
          );
        }, 10000);
      }
      catch (e) {
        console.error(e);
      }
    }
  })
  const { writeAsync, isSuccess } = useContractWrite(config);

  useEffect(() => {
    if (!address || !isConnected || status !== "authenticated") {
      setState(MintState.Connect)
    } else if (chain?.id !== NETWORK_ID) {
      setState(MintState.ConfirmNetwork)
    } else {
      setState(MintState.Upload)
    }
  }, [address, chain?.id, isConnected, status])

  const handleMint = async () => {
    try {
      setLoading(true)

      const { data: dataRes } = await axios.post('/api/ipfs/upload-folder', {
        uploadArray: [
          {
            path: "metadata.json",
            // @ts-ignore
            content: {
              name: 'My own NFT by Vercel',
              description: 'NFTs minted using Vercel and Next.js',
              //@ts-ignore
              image: asset,
            }
          }
        ]
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTokenUri(dataRes?.[0]?.path);
      refetch();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  const onUploadComplete = async (asset: string) => {
    setAsset(asset)
    setState(MintState.ConfirmMint)
    setLoading(false)
  }

  useEffect(() => {
    if (tokenUri && !isSuccess) {
      writeAsync?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenUri, isSuccess])

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
              This process might take up to 1 minute to complete. Please refresh
              the OpenSea page if you didn&apos;t see your NFT.
            </span>
          </Text>
          <section className="relative w-full pb-[20%] h-48 pb-6 mt-12">
            <Image
              className="rounded-xl"
              src={asset ?? ""}
              alt="The image that will be minted as an NFT"
              fill
            />
          </section>

          <section className="flex justify-center mt-6">
            <Button
              size="lg"
              variant="black"
              onClick={handleMint}
              disabled={!asset || isLoading}
            >
              {isLoading ? <LoadingDots /> : 'Mint'}
            </Button>
          </section>
        </>
      )}
    </div>
  )
}
