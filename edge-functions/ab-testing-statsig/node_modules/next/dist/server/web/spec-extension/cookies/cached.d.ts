/**
 * A simple caching behavior.
 * We cache the result based on the key `K`
 * which uses referential equality, to avoid re-computing
 * the result for the same key.
 */
export declare function cached<K, V>(generate: (key: K) => V): (key: K) => V;
