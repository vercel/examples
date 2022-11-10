import Moralis from 'moralis';
import type { NextApiRequest, NextApiResponse } from 'next';

const config = {
  domain: process.env.APP_DOMAIN || 'ethereum.boilerplate',
  statement: 'Please sign this message to confirm your identity.',
  uri: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  timeout: 60,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, chain, network } = req.body;

  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  try {
    const message = await Moralis.Auth.requestMessage({
      address,
      chain,
      network,
      ...config,
    });

    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error });
    console.error(error);
  }
}