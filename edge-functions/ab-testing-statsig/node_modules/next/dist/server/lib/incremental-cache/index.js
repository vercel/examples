"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _fileSystemCache = _interopRequireDefault(require("./file-system-cache"));
var _path = _interopRequireDefault(require("../../../shared/lib/isomorphic/path"));
var _normalizePagePath = require("../../../shared/lib/page-path/normalize-page-path");
var _fetchCache = _interopRequireDefault(require("./fetch-cache"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function toRoute(pathname) {
    return pathname.replace(/\/$/, "").replace(/\/index$/, "") || "/";
}
class CacheHandler {
    // eslint-disable-next-line
    constructor(_ctx){}
    async get(_key, _fetchCache) {
        return {};
    }
    async set(_key, _data, _fetchCache) {}
}
exports.CacheHandler = CacheHandler;
class IncrementalCache {
    constructor({ fs , dev , appDir , flushToDisk , fetchCache , minimalMode , serverDistDir , requestHeaders , maxMemoryCacheSize , getPrerenderManifest , incrementalCacheHandlerPath  }){
        let cacheHandlerMod = _fileSystemCache.default;
        if (process.env.NEXT_RUNTIME !== "edge" && incrementalCacheHandlerPath) {
            cacheHandlerMod = require(incrementalCacheHandlerPath);
            cacheHandlerMod = cacheHandlerMod.default || cacheHandlerMod;
        }
        if (minimalMode && fetchCache) {
            cacheHandlerMod = _fetchCache.default;
        }
        if (process.env.__NEXT_TEST_MAX_ISR_CACHE) {
            // Allow cache size to be overridden for testing purposes
            maxMemoryCacheSize = parseInt(process.env.__NEXT_TEST_MAX_ISR_CACHE, 10);
        }
        this.dev = dev;
        this.minimalMode = minimalMode;
        this.requestHeaders = requestHeaders;
        this.prerenderManifest = getPrerenderManifest();
        this.cacheHandler = new cacheHandlerMod({
            dev,
            fs,
            flushToDisk,
            serverDistDir,
            maxMemoryCacheSize,
            _appDir: !!appDir,
            _requestHeaders: requestHeaders
        });
    }
    calculateRevalidate(pathname, fromTime) {
        // in development we don't have a prerender-manifest
        // and default to always revalidating to allow easier debugging
        if (this.dev) return new Date().getTime() - 1000;
        // if an entry isn't present in routes we fallback to a default
        // of revalidating after 1 second
        const { initialRevalidateSeconds  } = this.prerenderManifest.routes[toRoute(pathname)] || {
            initialRevalidateSeconds: 1
        };
        const revalidateAfter = typeof initialRevalidateSeconds === "number" ? initialRevalidateSeconds * 1000 + fromTime : initialRevalidateSeconds;
        return revalidateAfter;
    }
    _getPathname(pathname, fetchCache) {
        return fetchCache ? pathname : (0, _normalizePagePath).normalizePagePath(pathname);
    }
    // x-ref: https://github.com/facebook/react/blob/2655c9354d8e1c54ba888444220f63e836925caa/packages/react/src/ReactFetch.js#L23
    async fetchCacheKey(url, init = {}) {
        const cacheString = JSON.stringify([
            url,
            init.method,
            init.headers,
            init.mode,
            init.redirect,
            init.credentials,
            init.referrer,
            init.referrerPolicy,
            init.integrity,
            init.next,
            init.cache, 
        ]);
        let cacheKey;
        if (process.env.NEXT_RUNTIME === "edge") {
            function bufferToHex(buffer) {
                return Array.prototype.map.call(new Uint8Array(buffer), (b)=>b.toString(16).padStart(2, "0")).join("");
            }
            const buffer1 = new TextEncoder().encode(cacheString);
            cacheKey = bufferToHex(await crypto.subtle.digest("SHA-256", buffer1));
        } else {
            const crypto = require("crypto");
            cacheKey = crypto.createHash("sha256").update(cacheString).digest("hex");
        }
        return cacheKey;
    }
    // get data from cache if available
    async get(pathname, fetchCache) {
        var ref, ref1;
        // we don't leverage the prerender cache in dev mode
        // so that getStaticProps is always called for easier debugging
        if (this.dev) return null;
        pathname = this._getPathname(pathname, fetchCache);
        let entry = null;
        const cacheData = await this.cacheHandler.get(pathname, fetchCache);
        if ((cacheData == null ? void 0 : (ref = cacheData.value) == null ? void 0 : ref.kind) === "FETCH") {
            const data = cacheData.value.data;
            const age = Math.round((Date.now() - (cacheData.lastModified || 0)) / 1000);
            const revalidate = cacheData.value.revalidate;
            return {
                isStale: age > revalidate,
                value: {
                    kind: "FETCH",
                    data,
                    age,
                    revalidate,
                    isStale: age > revalidate
                },
                revalidateAfter: (cacheData.lastModified || Date.now()) + revalidate * 1000
            };
        }
        const curRevalidate = (ref1 = this.prerenderManifest.routes[toRoute(pathname)]) == null ? void 0 : ref1.initialRevalidateSeconds;
        const revalidateAfter = this.calculateRevalidate(pathname, (cacheData == null ? void 0 : cacheData.lastModified) || Date.now());
        const isStale = revalidateAfter !== false && revalidateAfter < Date.now() ? true : undefined;
        if (cacheData) {
            entry = {
                isStale,
                curRevalidate,
                revalidateAfter,
                value: cacheData.value
            };
        }
        if (!cacheData && this.prerenderManifest.notFoundRoutes.includes(pathname)) {
            // for the first hit after starting the server the cache
            // may not have a way to save notFound: true so if
            // the prerender-manifest marks this as notFound then we
            // return that entry and trigger a cache set to give it a
            // chance to update in-memory entries
            entry = {
                isStale,
                value: null,
                curRevalidate,
                revalidateAfter
            };
            this.set(pathname, entry.value, curRevalidate, fetchCache);
        }
        return entry;
    }
    // populate the incremental cache with new data
    async set(pathname, data, revalidateSeconds, fetchCache) {
        if (this.dev) return;
        pathname = this._getPathname(pathname, fetchCache);
        try {
            // we use the prerender manifest memory instance
            // to store revalidate timings for calculating
            // revalidateAfter values so we update this on set
            if (typeof revalidateSeconds !== "undefined" && !fetchCache) {
                this.prerenderManifest.routes[pathname] = {
                    dataRoute: _path.default.posix.join("/_next/data", `${(0, _normalizePagePath).normalizePagePath(pathname)}.json`),
                    srcRoute: null,
                    initialRevalidateSeconds: revalidateSeconds
                };
            }
            await this.cacheHandler.set(pathname, data, fetchCache);
        } catch (error) {
            console.warn("Failed to update prerender cache for", pathname, error);
        }
    }
}
exports.IncrementalCache = IncrementalCache;

//# sourceMappingURL=index.js.map