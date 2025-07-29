import type { Nitro, PublicAssetDir } from "nitropack/types";
export declare function writeRedirects(nitro: Nitro): Promise<void>;
export declare function writeHeaders(nitro: Nitro): Promise<void>;
export declare function getStaticPaths(publicAssets: PublicAssetDir[], baseURL: string): string[];
export declare function generateNetlifyFunction(nitro: Nitro): string;
export declare function getGeneratorString(nitro: Nitro): string;
