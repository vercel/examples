import RenderResult from "../render-result";
export * from "./types";
export default class ResponseCache {
    constructor(minimalMode){
        this.pendingResponses = new Map();
        this.minimalMode = minimalMode;
    }
    get(key, responseGenerator, context) {
        var ref3;
        const { incrementalCache  } = context;
        // ensure manual revalidate doesn't block normal requests
        const pendingResponseKey = key ? `${key}-${context.isManualRevalidate ? "1" : "0"}` : null;
        const pendingResponse = pendingResponseKey ? this.pendingResponses.get(pendingResponseKey) : null;
        if (pendingResponse) {
            return pendingResponse;
        }
        let resolver = ()=>{};
        let rejecter = ()=>{};
        const promise = new Promise((resolve, reject)=>{
            resolver = resolve;
            rejecter = reject;
        });
        if (pendingResponseKey) {
            this.pendingResponses.set(pendingResponseKey, promise);
        }
        let resolved = false;
        const resolve1 = (cacheEntry)=>{
            if (pendingResponseKey) {
                // Ensure all reads from the cache get the latest value.
                this.pendingResponses.set(pendingResponseKey, Promise.resolve(cacheEntry));
            }
            if (!resolved) {
                resolved = true;
                resolver(cacheEntry);
            }
        };
        // we keep the previous cache entry around to leverage
        // when the incremental cache is disabled in minimal mode
        if (pendingResponseKey && this.minimalMode && ((ref3 = this.previousCacheItem) == null ? void 0 : ref3.key) === pendingResponseKey && this.previousCacheItem.expiresAt > Date.now()) {
            resolve1(this.previousCacheItem.entry);
            this.pendingResponses.delete(pendingResponseKey);
            return promise;
        }
        (async ()=>{
            let cachedResponse = null;
            try {
                cachedResponse = key && !this.minimalMode ? await incrementalCache.get(key) : null;
                if (cachedResponse && !context.isManualRevalidate) {
                    var ref, ref1;
                    if (((ref = cachedResponse.value) == null ? void 0 : ref.kind) === "FETCH") {
                        throw new Error(`invariant: unexpected cachedResponse of kind fetch in response cache`);
                    }
                    resolve1({
                        isStale: cachedResponse.isStale,
                        revalidate: cachedResponse.curRevalidate,
                        value: ((ref1 = cachedResponse.value) == null ? void 0 : ref1.kind) === "PAGE" ? {
                            kind: "PAGE",
                            html: RenderResult.fromStatic(cachedResponse.value.html),
                            pageData: cachedResponse.value.pageData
                        } : cachedResponse.value
                    });
                    if (!cachedResponse.isStale || context.isPrefetch) {
                        // The cached value is still valid, so we don't need
                        // to update it yet.
                        return;
                    }
                }
                const cacheEntry = await responseGenerator(resolved, !!cachedResponse);
                const resolveValue = cacheEntry === null ? null : {
                    ...cacheEntry,
                    isMiss: !cachedResponse
                };
                // for manual revalidate wait to resolve until cache is set
                if (!context.isManualRevalidate) {
                    resolve1(resolveValue);
                }
                if (key && cacheEntry && typeof cacheEntry.revalidate !== "undefined") {
                    if (this.minimalMode) {
                        this.previousCacheItem = {
                            key: pendingResponseKey || key,
                            entry: cacheEntry,
                            expiresAt: Date.now() + 1000
                        };
                    } else {
                        var ref2;
                        await incrementalCache.set(key, ((ref2 = cacheEntry.value) == null ? void 0 : ref2.kind) === "PAGE" ? {
                            kind: "PAGE",
                            html: cacheEntry.value.html.toUnchunkedString(),
                            pageData: cacheEntry.value.pageData
                        } : cacheEntry.value, cacheEntry.revalidate);
                    }
                } else {
                    this.previousCacheItem = undefined;
                }
                if (context.isManualRevalidate) {
                    resolve1(resolveValue);
                }
            } catch (err) {
                // when a getStaticProps path is erroring we automatically re-set the
                // existing cache under a new expiration to prevent non-stop retrying
                if (cachedResponse && key) {
                    await incrementalCache.set(key, cachedResponse.value, Math.min(Math.max(cachedResponse.revalidate || 3, 3), 30));
                }
                // while revalidating in the background we can't reject as
                // we already resolved the cache entry so log the error here
                if (resolved) {
                    console.error(err);
                } else {
                    rejecter(err);
                }
            } finally{
                if (pendingResponseKey) {
                    this.pendingResponses.delete(pendingResponseKey);
                }
            }
        })();
        return promise;
    }
};

//# sourceMappingURL=index.js.map