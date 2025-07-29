import Redis, { Cluster, type ClusterNode, type ClusterOptions, type RedisOptions as _RedisOptions } from "ioredis";
export interface RedisOptions extends _RedisOptions {
    /**
     * Optional prefix to use for all keys. Can be used for namespacing.
     */
    base?: string;
    /**
     * Url to use for connecting to redis. Takes precedence over `host` option. Has the format `redis://<REDIS_USER>:<REDIS_PASSWORD>@<REDIS_HOST>:<REDIS_PORT>`
     */
    url?: string;
    /**
     * List of redis nodes to use for cluster mode. Takes precedence over `url` and `host` options.
     */
    cluster?: ClusterNode[];
    /**
     * Options to use for cluster mode.
     */
    clusterOptions?: ClusterOptions;
    /**
     * Default TTL for all items in seconds.
     */
    ttl?: number;
    /**
     * How many keys to scan at once.
     *
     * [redis documentation](https://redis.io/docs/latest/commands/scan/#the-count-option)
     */
    scanCount?: number;
    /**
     * Whether to initialize the redis instance immediately.
     * Otherwise, it will be initialized on the first read/write call.
     * @default false
     */
    preConnect?: boolean;
}
declare const _default: (opts: RedisOptions) => import("..").Driver<RedisOptions, Redis | Cluster>;
export default _default;
