export interface TraversalCache {
    localFiles: Set<string>;
    moduleNames: Set<string>;
    modulePaths: Set<string>;
}
export declare const getNewCache: () => TraversalCache;
