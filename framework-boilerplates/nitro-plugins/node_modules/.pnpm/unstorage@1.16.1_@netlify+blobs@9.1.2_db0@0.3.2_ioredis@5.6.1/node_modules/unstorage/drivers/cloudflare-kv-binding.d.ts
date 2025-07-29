export interface KVOptions {
    binding?: string | KVNamespace;
    /** Adds prefix to all stored keys */
    base?: string;
    /**
     * The minimum time-to-live (ttl) for setItem in seconds.
     * The default is 60 seconds as per Cloudflare's [documentation](https://developers.cloudflare.com/kv/api/write-key-value-pairs/).
     */
    minTTL?: number;
}
declare const _default: (opts: KVOptions) => import("..").Driver<KVOptions, KVNamespace<string>>;
export default _default;
