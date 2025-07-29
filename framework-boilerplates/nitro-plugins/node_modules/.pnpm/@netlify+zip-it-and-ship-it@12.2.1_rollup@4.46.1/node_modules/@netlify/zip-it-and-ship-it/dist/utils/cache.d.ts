import type { Stats } from 'fs';
export type FileCache = Map<string, Promise<string>>;
export type LstatCache = Map<string, Promise<Stats>>;
export type ReaddirCache = Map<string, Promise<string[]>>;
interface NFTCache {
    fileCache: FileCache;
}
export declare class RuntimeCache {
    fileCache: FileCache;
    lstatCache: LstatCache;
    readdirCache: ReaddirCache;
    nftCache: NFTCache;
    constructor();
}
export {};
