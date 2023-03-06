import Moralis from 'moralis';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { uploadArray } = req.body;

    if (!Moralis.Core.isStarted) {
        await Moralis.start({ apiKey: process.env.MORALIS_API_KEY, logLevel: "verbose" });
    }

    try {
        const response = await Moralis.EvmApi.ipfs.uploadFolder({
            abi: uploadArray
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error });
        // console.error(error);
    }
};