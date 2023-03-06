import { MoralisNextApi } from "@moralisweb3/next";

export default MoralisNextApi({
    apiKey: process.env.MORALIS_API_KEY ?? "",
    logLevel: "verbose",
    authentication: {
        domain: process.env.APP_DOMAIN || 'mint.nft',
        statement: 'Authorize linking of your wallet to',
        uri: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        timeout: 60,
    }
});