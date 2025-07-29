import type { Nitro, PublicAssetDir } from "nitropack/types";
export declare function generateCatchAllRedirects(publicAssets: PublicAssetDir[], catchAllPath?: string): string;
export declare function writeRedirects(nitro: Nitro, catchAllPath?: string): Promise<void>;
export declare function writeHeaders(nitro: Nitro): Promise<void>;
export declare function getStaticPaths(publicAssets: PublicAssetDir[]): string[];
export declare function deprecateSWR(nitro: Nitro): void;
