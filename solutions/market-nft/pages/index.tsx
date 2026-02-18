import { useWallet } from "@mintbase-js/react";
import { Layout, Text, Page } from "@vercel/examples-ui";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Card from "../components/card";
import Modal from "../components/modal";
import { useContracts } from "../hooks/useContract";

function Home() {
  const { connect, isConnected, activeAccountId, disconnect } = useWallet();
  const router = useRouter();

  const [errorTransactionModal, setErrorTransactionModal] = useState(false);
  const [successTransactionModal, setSuccessTransactionModal] = useState(false);

  const contracts = ["vercel.mintspace2.testnet"];

  const { nftsData } = useContracts(contracts);

  // handles transaction redirect after buying an nft
  useEffect(() => {
    console.log(router.query);
    if (router?.query?.errorMessage || router?.query?.errorCode) {
      setErrorTransactionModal(true);
    } else if (router?.query?.transactionHashes) {
      setSuccessTransactionModal(true);
    }
  }, [router.query]);

  return (
    <>
      <Page className="flex flex-col gap-12 bg-white">
        <section className="flex flex-col gap-6">
          <div className="flex justify-between">
            <Text variant="h1">market-nft example</Text>

            <button
              className="px-2 text-sm text-black hidden sm:block"
              onClick={isConnected ? disconnect : connect}
            >
              {!isConnected
                ? "Connect wallet"
                : `Disconnect ${activeAccountId}`}
            </button>
          </div>
          <button
            className="px-2 text-sm text-black sm:hidden text-center"
            onClick={isConnected ? disconnect : connect}
          >
            {!isConnected ? "Connect wallet" : `Disconnect ${activeAccountId}`}
          </button>
          <Text>
            This example shows how to use with a Next.js app and how to create
            an NFT marketplace for the NEAR Protocol. This tutorial demonstrates
            the integration of{" "}
            <a href="https://mintbase.xyz" className="font-bold text-red-500">
              Mintbase
            </a>{" "}
            Read{" "}
            <a href="https://docs.mintbase.xyz" className="text-indigo-500">
              our documentation
            </a>{" "}
            for more information on our tools.
          </Text>
        </section>

        <section className="flex flex-col gap-2">
          <Text className="flex gap-2 flex-wrap">
            Tokens for sale from smart contract{" "}
            <div className="flex gap-1 flex-wrap">
              {contracts.map((contractAddress) => {
                return (
                  <Link
                    key={contractAddress}
                    href={`https://testnet.mintbase.xyz/contract/${contractAddress}`}
                  >
                    <span className="px-2 py-1 text-xs font-bold bg-black text-white rounded">
                      {contractAddress}
                    </span>
                  </Link>
                );
              })}
            </div>
          </Text>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {nftsData?.map((token) => {
              return (
                <Card
                  key={token?.metadata_id}
                  metadataId={token?.metadata_id}
                />
              );
            })}
          </div>
        </section>
      </Page>
      <Modal
        title="Transaction succeeded"
        subtitle="Your transaction was successful."
        button={
          <button
            className="bg-black text-white w-full rounded mt-4 py-1 px-2 text-sm truncate transform 
          transition duration-500 hover:scale-105 hover:-translate-y-0.5"
            onClick={() => {
              setSuccessTransactionModal(false);
              router.push("/");
            }}
          >
            Close
          </button>
        }
        hideClose
        showModal={successTransactionModal}
        setShowModal={setSuccessTransactionModal}
      />

      <Modal
        title="Transaction failed"
        subtitle="Your transaction was not successful."
        button={
          <button
            className="bg-black text-white w-full rounded mt-4 py-1 px-2 text-sm truncate transform 
          transition duration-500 hover:scale-105 hover:-translate-y-0.5"
            onClick={() => {
              setErrorTransactionModal(false);
              router.push("/");
            }}
          >
            Close
          </button>
        }
        hideClose
        showModal={errorTransactionModal}
        setShowModal={setErrorTransactionModal}
      />
    </>
  );
}

Home.Layout = Layout;

export default Home;
