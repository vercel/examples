import type { DynamicMethods } from './types.js';
type APIOptions = {
    /** @example 'netlify/js-client' */
    userAgent?: string;
    /** @example 'https' */
    scheme?: string;
    /** @example 'api.netlify.com' */
    host?: string;
    /** @example '/api/v1' */
    pathPrefix?: string;
    accessToken?: string;
    /** @example 'HttpsProxyAgent' */
    agent?: string;
    /**
     * parameters you want available for every request.
     * Global params are only sent of the OpenAPI spec specifies the provided params.
     */
    globalParams?: Record<string, unknown>;
};
/**
 * The Netlify API client.
 * @see {@link https://open-api.netlify.com | Open API Reference}
 * @see {@link https://docs.netlify.com/api/get-started | Online Documentation}
 *
 * @example
 * ```ts
 * const client = new NetlifyAPI('YOUR_ACCESS_TOKEN')
 * const sites = await client.listSites()
 * ```
 */
export interface NetlifyAPI extends DynamicMethods {
}
export declare class NetlifyAPI {
    #private;
    defaultHeaders: Record<string, string>;
    /** The protocol is used like `https` */
    scheme: string;
    host: string;
    pathPrefix: string;
    agent?: string;
    globalParams: Record<string, unknown>;
    constructor(options?: APIOptions);
    constructor(accessToken: string | undefined, options?: APIOptions);
    /** Retrieves the access token */
    get accessToken(): string | undefined | null;
    set accessToken(token: string | undefined | null);
    get basePath(): string;
    getAccessToken(ticket: any, { poll, timeout }?: {
        poll?: number | undefined;
        timeout?: number | undefined;
    }): Promise<string | undefined>;
}
export declare const methods: any[];
export {};
