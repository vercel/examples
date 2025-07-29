import type { Nitro } from "nitropack/types";
export declare function generateFunctionFiles(nitro: Nitro): Promise<void>;
export declare function generateEdgeFunctionFiles(nitro: Nitro): Promise<void>;
export declare function generateStaticFiles(nitro: Nitro): Promise<void>;
export declare function deprecateSWR(nitro: Nitro): void;
