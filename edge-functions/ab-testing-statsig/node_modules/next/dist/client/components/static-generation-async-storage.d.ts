/// <reference types="node" />
import type { AsyncLocalStorage } from 'async_hooks';
export interface StaticGenerationStore {
    inUse?: boolean;
    pathname?: string;
    revalidate?: number;
    fetchRevalidate?: number;
    isStaticGeneration?: boolean;
    forceStatic?: boolean;
    incrementalCache?: import('../../server/lib/incremental-cache').IncrementalCache;
    pendingRevalidates?: Promise<any>[];
    isRevalidate?: boolean;
}
export declare let staticGenerationAsyncStorage: AsyncLocalStorage<StaticGenerationStore> | StaticGenerationStore;
