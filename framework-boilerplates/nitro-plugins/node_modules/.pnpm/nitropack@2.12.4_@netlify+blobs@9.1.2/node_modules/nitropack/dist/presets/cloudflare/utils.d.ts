import type { Nitro } from "nitropack/types";
export declare function writeCFRoutes(nitro: Nitro): Promise<void>;
export declare function writeCFHeaders(nitro: Nitro): Promise<void>;
export declare function writeCFPagesRedirects(nitro: Nitro): Promise<void>;
export declare function enableNodeCompat(nitro: Nitro): Promise<void>;
export declare function writeWranglerConfig(nitro: Nitro, cfTarget: "pages" | "module"): Promise<void>;
