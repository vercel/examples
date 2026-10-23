import { FinalExecutionOutcome } from "@mintbase-js/auth";
import { useWallet } from "@mintbase-js/react";
import { buy, execute } from "@mintbase-js/sdk";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMetadata } from "../hooks/useMetadata";
import { yoctoToNear } from "../utils/numbers";
import Modal from "./modal";

const Card = ({ metadataId }: { metadataId: string }) => {
  const { selector, isConnected, connect } = useWallet();
  const [connectModal, showConnectModal] = useState(false);

  const {
    title,
    description,
    coverImage,
    minter,
    price,
    nftContractId,
    tokenId,
    marketId,
    isLoading,
  } = useMetadata({
    metadataId,
  });

  const placeholderImg = "/assets/mintbase-symbol-250x250.png";

  const handleBuy = async () => {
    const wallet = await selector.wallet();

    (await execute(
      { wallet },
      {
        ...buy({
          contractAddress: nftContractId,
          tokenId: tokenId ?? "0",
          marketId,
          price: (price ?? "0") || "0",
          referrerId: process.env.NEXT_PUBLIC_AFFILIATE_ACCOUNT || undefined,
        }),
      }
    )) as FinalExecutionOutcome;
  };

  return (
    <>
      <Link
        href={`https://testnet.mintbase.xyz/meta/${metadataId}`}
        target="_blank"
        rel="noreferrer"
      >
        <div className="my-10 p-5 rounded-md shadow-xl border border-1">
          <div className="h-48 relative">
            <Image
              src={coverImage ?? placeholderImg}
              loader={() => coverImage ?? placeholderImg}
              alt={title ?? "nft"}
              objectFit="cover"
              fill
            />
          </div>
          <h2 className="text-md font-bold mt-3 truncate">
            {isLoading ? "Title" : title}
          </h2>
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-400 text-sm truncate">
              {isLoading ? "Description" : description}
            </p>
          </div>
          <p className="bg-gray-600 h-[0.5px] w-full my-2"></p>
          <div className="flex items-center">
            <Image
              placeholder="blur"
              blurDataURL={placeholderImg}
              src={`https://avatar.vercel.sh/${minter}`}
              alt={minter ?? ""}
              className="h-8 w-8 border border-white rounded-full mr-2"
              width="288"
              height="96"
            />
            <div className="text-gray-400 text-[12px]">
              <p>Minted by </p>
              <Link
                href={`https://nearblocks.io/address/${minter}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold hover:text-black truncate"
              >
                {minter}
              </Link>
            </div>
          </div>
          <button
            className="bg-black text-white w-full rounded mt-4 py-1 px-2 text-sm truncate transform 
        transition duration-500 hover:scale-105 hover:-translate-y-0.5"
            onClick={(event) => {
              event.preventDefault();
              if (!isConnected) {
                showConnectModal(true);
                return;
              }
              handleBuy();
            }}
          >
            Buy for <span className="font-bold">{yoctoToNear(price!)} N</span>
          </button>
        </div>
      </Link>
      <Modal
        title="Connect your wallet"
        subtitle="Please connect your wallet to purchase the NFT."
        button={
          <button
            className="mt-8 p-2 bg-black text-white rounded w-full transform transition duration-500 hover:scale-105 hover:-translate-y-0.5"
            onClick={connect}
          >
            Connect
          </button>
        }
        showModal={connectModal}
        setShowModal={showConnectModal}
      />
    </>
  );
};

export default Card;
