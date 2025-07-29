interface KVAuthAPIToken {
    /**
     * API Token generated from the [User Profile 'API Tokens' page](https://dash.cloudflare.com/profile/api-tokens)
     * of the Cloudflare console.
     * @see https://api.cloudflare.com/#getting-started-requests
     */
    apiToken: string;
}
interface KVAuthServiceKey {
    /**
     * A special Cloudflare API key good for a restricted set of endpoints.
     * Always begins with "v1.0-", may vary in length.
     * May be used to authenticate in place of `apiToken` or `apiKey` and `email`.
     * @see https://api.cloudflare.com/#getting-started-requests
     */
    userServiceKey: string;
}
interface KVAuthEmailKey {
    /**
     * Email address associated with your account.
     * Should be used along with `apiKey` to authenticate in place of `apiToken`.
     */
    email: string;
    /**
     * API key generated on the "My Account" page of the Cloudflare console.
     * Should be used along with `email` to authenticate in place of `apiToken`.
     * @see https://api.cloudflare.com/#getting-started-requests
     */
    apiKey: string;
}
export type KVHTTPOptions = {
    /**
     * Cloudflare account ID (required)
     */
    accountId: string;
    /**
     * The ID of the KV namespace to target (required)
     */
    namespaceId: string;
    /**
     * The URL of the Cloudflare API.
     * @default https://api.cloudflare.com
     */
    apiURL?: string;
    /**
     * Adds prefix to all stored keys
     */
    base?: string;
    /**
     * The minimum time-to-live (ttl) for setItem in seconds.
     * The default is 60 seconds as per Cloudflare's [documentation](https://developers.cloudflare.com/kv/api/write-key-value-pairs/).
     */
    minTTL?: number;
} & (KVAuthServiceKey | KVAuthAPIToken | KVAuthEmailKey);
declare const _default: (opts: KVHTTPOptions) => import("..").Driver<KVHTTPOptions, never>;
export default _default;
