import type { CacheHandler, CacheHandlerContext, CacheHandlerValue } from './';
export default class FetchCache implements CacheHandler {
    private headers;
    private cacheEndpoint;
    private debug;
    constructor(ctx: CacheHandlerContext);
    get(key: string, fetchCache?: boolean): Promise<CacheHandlerValue | null>;
    set(key: string, data: CacheHandlerValue['value'], fetchCache?: boolean): Promise<void>;
}
