import path from "node:path";
import { fileURLToPath } from "node:url";
 
import withVercelToolbar from "@vercel/toolbar/plugins/next";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	cacheComponents: true,
	turbopack: {
		root: path.join(__dirname, ".."),
	},
};

export default withVercelToolbar()(nextConfig);
