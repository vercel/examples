import type { NextConfig } from "next";
import { withMicrofrontends } from "@vercel/microfrontends/next/config";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withMicrofrontends(nextConfig);
