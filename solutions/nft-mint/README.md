# Minting NFTs with Next.js

This example shows how to build an NFT minting platform using Next.js This example contains the following:

- NFT collections infinite scroll to explore different Arts
- Connecting and disconnecting a Metamask Wallet
- Client side Image resizing and validation to keep things family friendly.
- Soft Minting NFTs using Rarible's and Moralis' SDKs

## Deployed Live on Vercel

https://nft-mint-guivercel-vercel-solutions-vtest314.vercel.app/

## Getting Started

1. Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/solutions/nft-mint nft-mint
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/solutions/nft-mint nft-mint
```

2. Register and deploy a [Moralis Server](https://admin.moralis.io/register).
3. Install the [Rarible Plugin on your Moralis server](https://moralis.io/plugins/rarible-nft-tools/). You will mneed the information about [Moralis Speedy Nodes](https://docs.moralis.io/speedy-nodes/connecting-to-rpc-nodes/connect-to-eth-node) to deploy the plugin to your Server. Make sure you pick the Ethereum Network of your choice.
4. Fill your environment variables with the Moralis server values. These values can safely be public:

```
NEXT_PUBLIC_SERVER_URL=<server url goes here>
NEXT_PUBLIC_APP_ID=<Moralis app id goes here>
```

## Built with Open source projects:

- [NFSW JS](https://nsfwjs.com/) for Image validation
- [Tailwindcss](https://tailwindcss.com/) for styling
- [WAGMI hooks](https://github.com/tmm/wagmi) for easy connection to Metamask
