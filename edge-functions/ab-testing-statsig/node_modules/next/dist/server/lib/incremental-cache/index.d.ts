import type { CacheFs } from '../../../shared/lib/utils';
import { PrerenderManifest } from '../../../build';
import { IncrementalCacheValue, IncrementalCacheEntry } from '../../response-cache';
export interface CacheHandlerContext {
    fs: CacheFs;
    dev?: boolean;
    flushToDisk?: boolean;
    serverDistDir: string;
    maxMemoryCacheSize?: number;
    _appDir: boolean;
    _requestHeaders: IncrementalCache['requestHeaders'];
}
export interface CacheHandlerValue {
    lastModified?: number;
    value: IncrementalCacheValue | null;
}
export declare class CacheHandler {
    constructor(_ctx: CacheHandlerContext);
    get(_key: string, _fetchCache?: boolean): Promise<CacheHandlerValue | null>;
    set(_key: string, _data: IncrementalCacheValue | null, _fetchCache?: boolean): Promise<void>;
}
export declare class IncrementalCache {
    dev?: boolean;
    cacheHandler: CacheHandler;
    prerenderManifest: PrerenderManifest;
    requestHeaders: Record<string, undefined | string | string[]>;
    minimalMode?: boolean;
    constructor({ fs, dev, appDir, flushToDisk, fetchCache, minimalMode, serverDistDir, requestHeaders, maxMemoryCacheSize, getPrerenderManifest, incrementalCacheHandlerPath, }: {
        fs: CacheFs;
        dev: boolean;
        appDir?: boolean;
        fetchCache?: boolean;
        minimalMode?: boolean;
        serverDistDir: string;
        flushToDisk?: boolean;
        requestHeaders: IncrementalCache['requestHeaders'];
        maxMemoryCacheSize?: number;
        incrementalCacheHandlerPath?: string;
        getPrerenderManifest: () => PrerenderManifest;
    });
    private calculateRevalidate;
    _getPathname(pathname: string, fetchCache?: boolean): string;
    fetchCacheKey(url: string, init?: RequestInit): Promise<string>;
    get(pathname: string, fetchCache?: boolean): Promise<IncrementalCacheEntry | null>;
    set(pathname: string, data: IncrementalCacheValue | null, revalidateSeconds?: number | false, fetchCache?: boolean): Promise<void>;
}
