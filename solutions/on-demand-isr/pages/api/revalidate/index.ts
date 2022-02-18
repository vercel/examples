import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  await res.unstable_revalidate("/");

  return res.json({ revalidated: true });
}
