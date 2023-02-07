"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exportPage;
require("../server/node-polyfill-fetch");
var _requireHook = require("../build/webpack/require-hook");
var _path = require("path");
var _fs = _interopRequireWildcard(require("fs"));
var _amphtmlValidator = _interopRequireDefault(require("next/dist/compiled/amphtml-validator"));
var _loadComponents = require("../server/load-components");
var _isDynamic = require("../shared/lib/router/utils/is-dynamic");
var _routeMatcher = require("../shared/lib/router/utils/route-matcher");
var _routeRegex = require("../shared/lib/router/utils/route-regex");
var _normalizePagePath = require("../shared/lib/page-path/normalize-page-path");
var _constants = require("../lib/constants");
var _require = require("../server/require");
var _normalizeLocalePath = require("../shared/lib/i18n/normalize-locale-path");
var _trace = require("../trace");
var _ampMode = require("../shared/lib/amp-mode");
var _config = require("../server/config");
var _renderResult = _interopRequireDefault(require("../server/render-result"));
var _isError = _interopRequireDefault(require("../lib/is-error"));
var _requestMeta = require("../server/request-meta");
var _appPaths = require("../shared/lib/router/utils/app-paths");
var _redirect = require("../client/components/redirect");
var _hooksServerContext = require("../client/components/hooks-server-context");
var _notFound = require("../client/components/not-found");
var _noSsrError = require("../shared/lib/no-ssr-error");
var _incrementalCache = require("../server/lib/incremental-cache");
async function exportPage({ parentSpanId , path , pathMap , distDir , outDir , pagesDataDir , renderOpts , buildExport , serverRuntimeConfig , subFolders , optimizeFonts , optimizeCss , disableOptimizedLoading , httpAgentOptions , serverComponents , enableUndici  }) {
    (0, _config).setHttpClientAndAgentOptions({
        httpAgentOptions,
        experimental: {
            enableUndici
        }
    });
    const exportPageSpan = (0, _trace).trace("export-page-worker", parentSpanId);
    return exportPageSpan.traceAsyncFn(async ()=>{
        const start = Date.now();
        let results = {
            ampValidations: []
        };
        try {
            var ref4, ref1, ref2;
            const { query: originalQuery = {}  } = pathMap;
            const { page  } = pathMap;
            const isAppDir = pathMap._isAppDir;
            const isDynamicError = pathMap._isDynamicError;
            const filePath = (0, _normalizePagePath).normalizePagePath(path);
            const isDynamic = (0, _isDynamic).isDynamicRoute(page);
            const ampPath = `${filePath}.amp`;
            let renderAmpPath = ampPath;
            let query = {
                ...originalQuery
            };
            let params;
            if (isAppDir) {
                outDir = (0, _path).join(distDir, "server/app");
            }
            let updatedPath = query.__nextSsgPath || path;
            let locale = query.__nextLocale || renderOpts.locale;
            delete query.__nextLocale;
            delete query.__nextSsgPath;
            if (renderOpts.locale) {
                const localePathResult = (0, _normalizeLocalePath).normalizeLocalePath(path, renderOpts.locales);
                if (localePathResult.detectedLocale) {
                    updatedPath = localePathResult.pathname;
                    locale = localePathResult.detectedLocale;
                    if (locale === renderOpts.defaultLocale) {
                        renderAmpPath = `${(0, _normalizePagePath).normalizePagePath(updatedPath)}.amp`;
                    }
                }
            }
            // We need to show a warning if they try to provide query values
            // for an auto-exported page since they won't be available
            const hasOrigQueryValues = Object.keys(originalQuery).length > 0;
            const queryWithAutoExportWarn = ()=>{
                if (hasOrigQueryValues) {
                    throw new Error(`\nError: you provided query values for ${path} which is an auto-exported page. These can not be applied since the page can no longer be re-rendered on the server. To disable auto-export for this page add \`getInitialProps\`\n`);
                }
            };
            // Check if the page is a specified dynamic route
            const nonLocalizedPath = (0, _normalizeLocalePath).normalizeLocalePath(path, renderOpts.locales).pathname;
            if (isDynamic && page !== nonLocalizedPath) {
                const normalizedPage = isAppDir ? (0, _appPaths).normalizeAppPath(page) : page;
                params = (0, _routeMatcher).getRouteMatcher((0, _routeRegex).getRouteRegex(normalizedPage))(updatedPath) || undefined;
                if (params) {
                    query = {
                        ...query,
                        ...params
                    };
                } else {
                    throw new Error(`The provided export path '${updatedPath}' doesn't match the '${page}' page.\nRead more: https://nextjs.org/docs/messages/export-path-mismatch`);
                }
            }
            const headerMocks = {
                headers: {},
                getHeader: ()=>({}),
                setHeader: ()=>{},
                hasHeader: ()=>false,
                removeHeader: ()=>{},
                getHeaderNames: ()=>[]
            };
            const req = {
                url: updatedPath,
                ...headerMocks
            };
            const res = {
                ...headerMocks
            };
            if (updatedPath === "/500" && page === "/_error") {
                res.statusCode = 500;
            }
            if (renderOpts.trailingSlash && !((ref4 = req.url) == null ? void 0 : ref4.endsWith("/"))) {
                req.url += "/";
            }
            if (locale && buildExport && renderOpts.domainLocales && renderOpts.domainLocales.some((dl)=>{
                var ref;
                return dl.defaultLocale === locale || ((ref = dl.locales) == null ? void 0 : ref.includes(locale || ""));
            })) {
                (0, _requestMeta).addRequestMeta(req, "__nextIsLocaleDomain", true);
            }
            envConfig.setConfig({
                serverRuntimeConfig,
                publicRuntimeConfig: renderOpts.runtimeConfig
            });
            const getHtmlFilename = (_path1)=>subFolders ? `${_path1}${_path.sep}index.html` : `${_path1}.html`;
            let htmlFilename = getHtmlFilename(filePath);
            // dynamic routes can provide invalid extensions e.g. /blog/[...slug] returns an
            // extension of `.slug]`
            const pageExt = isDynamic ? "" : (0, _path).extname(page);
            const pathExt = isDynamic ? "" : (0, _path).extname(path);
            // force output 404.html for backwards compat
            if (path === "/404.html") {
                htmlFilename = path;
            } else if (pageExt !== pathExt && pathExt !== "") {
                const isBuiltinPaths = [
                    "/500",
                    "/404"
                ].some((p)=>p === path || p === path + ".html");
                // If the ssg path has .html extension, and it's not builtin paths, use it directly
                // Otherwise, use that as the filename instead
                const isHtmlExtPath = !isBuiltinPaths && path.endsWith(".html");
                htmlFilename = isHtmlExtPath ? getHtmlFilename(path) : path;
            } else if (path === "/") {
                // If the path is the root, just use index.html
                htmlFilename = "index.html";
            }
            const baseDir = (0, _path).join(outDir, (0, _path).dirname(htmlFilename));
            let htmlFilepath = (0, _path).join(outDir, htmlFilename);
            await _fs.promises.mkdir(baseDir, {
                recursive: true
            });
            let renderResult;
            let curRenderOpts = {};
            const { renderToHTML  } = require("../server/render");
            let renderMethod = renderToHTML;
            let inAmpMode = false, hybridAmp = false;
            const renderedDuringBuild = (getStaticProps)=>{
                return !buildExport && getStaticProps && !(0, _isDynamic).isDynamicRoute(path);
            };
            const components = await (0, _loadComponents).loadComponents({
                distDir,
                pathname: page,
                hasServerComponents: !!serverComponents,
                isAppPath: isAppDir
            });
            curRenderOpts = {
                ...components,
                ...renderOpts,
                ampPath: renderAmpPath,
                params,
                optimizeFonts,
                optimizeCss,
                disableOptimizedLoading,
                fontManifest: optimizeFonts ? (0, _require).requireFontManifest(distDir) : null,
                locale: locale,
                supportsDynamicHTML: false
            };
            // during build we attempt rendering app dir paths
            // and bail when dynamic dependencies are detected
            // only fully static paths are fully generated here
            if (isAppDir) {
                curRenderOpts.incrementalCache = new _incrementalCache.IncrementalCache({
                    dev: false,
                    requestHeaders: {},
                    flushToDisk: true,
                    maxMemoryCacheSize: 50 * 1024 * 1024,
                    getPrerenderManifest: ()=>({
                            version: 3,
                            routes: {},
                            dynamicRoutes: {},
                            preview: {
                                previewModeEncryptionKey: "",
                                previewModeId: "",
                                previewModeSigningKey: ""
                            },
                            notFoundRoutes: []
                        }),
                    fs: {
                        readFile: (f)=>_fs.default.promises.readFile(f, "utf8"),
                        readFileSync: (f)=>_fs.default.readFileSync(f, "utf8"),
                        writeFile: (f, d)=>_fs.default.promises.writeFile(f, d, "utf8"),
                        mkdir: (dir)=>_fs.default.promises.mkdir(dir, {
                                recursive: true
                            }),
                        stat: (f)=>_fs.default.promises.stat(f)
                    },
                    serverDistDir: (0, _path).join(distDir, "server")
                });
                const { renderToHTMLOrFlight  } = require("../server/app-render");
                try {
                    (_curRenderOpts = curRenderOpts).params || (_curRenderOpts.params = {});
                    const result = await renderToHTMLOrFlight(req, res, page, query, curRenderOpts);
                    const html = result == null ? void 0 : result.toUnchunkedString();
                    const flightData = curRenderOpts.pageData;
                    const revalidate = curRenderOpts.revalidate;
                    results.fromBuildExportRevalidate = revalidate;
                    if (revalidate !== 0) {
                        await _fs.promises.writeFile(htmlFilepath, html ?? "", "utf8");
                        await _fs.promises.writeFile(htmlFilepath.replace(/\.html$/, ".rsc"), flightData);
                    } else if (isDynamicError) {
                        throw new Error(`Page with dynamic = "error" encountered dynamic data method ${path}.`);
                    }
                } catch (err) {
                    var ref3;
                    if (err.digest !== _hooksServerContext.DYNAMIC_ERROR_CODE && err.digest !== _notFound.NOT_FOUND_ERROR_CODE && err.digest !== _noSsrError.NEXT_DYNAMIC_NO_SSR_CODE && !((ref3 = err.digest) == null ? void 0 : ref3.startsWith(_redirect.REDIRECT_ERROR_CODE))) {
                        throw err;
                    }
                }
                return {
                    ...results,
                    duration: Date.now() - start
                };
            }
            const ampState = {
                ampFirst: ((ref1 = components.pageConfig) == null ? void 0 : ref1.amp) === true,
                hasQuery: Boolean(query.amp),
                hybrid: ((ref2 = components.pageConfig) == null ? void 0 : ref2.amp) === "hybrid"
            };
            inAmpMode = (0, _ampMode).isInAmpMode(ampState);
            hybridAmp = ampState.hybrid;
            if (components.getServerSideProps) {
                throw new Error(`Error for page ${page}: ${_constants.SERVER_PROPS_EXPORT_ERROR}`);
            }
            // for non-dynamic SSG pages we should have already
            // prerendered the file
            if (renderedDuringBuild(components.getStaticProps)) {
                return {
                    ...results,
                    duration: Date.now() - start
                };
            }
            // TODO: de-dupe the logic here between serverless and server mode
            if (components.getStaticProps && !htmlFilepath.endsWith(".html")) {
                // make sure it ends with .html if the name contains a dot
                htmlFilepath += ".html";
                htmlFilename += ".html";
            }
            if (typeof components.Component === "string") {
                renderResult = _renderResult.default.fromStatic(components.Component);
                queryWithAutoExportWarn();
            } else {
                /**
         * This sets environment variable to be used at the time of static export by head.tsx.
         * Using this from process.env allows targeting both serverless and SSR by calling
         * `process.env.__NEXT_OPTIMIZE_FONTS`.
         * TODO(prateekbh@): Remove this when experimental.optimizeFonts are being cleaned up.
         */ if (optimizeFonts) {
                    process.env.__NEXT_OPTIMIZE_FONTS = JSON.stringify(optimizeFonts);
                }
                if (optimizeCss) {
                    process.env.__NEXT_OPTIMIZE_CSS = JSON.stringify(true);
                }
                try {
                    renderResult = await renderMethod(req, res, page, query, // @ts-ignore
                    curRenderOpts);
                } catch (err) {
                    if (err.digest !== _noSsrError.NEXT_DYNAMIC_NO_SSR_CODE) {
                        throw err;
                    }
                }
            }
            results.ssgNotFound = curRenderOpts.isNotFound;
            const validateAmp = async (rawAmpHtml, ampPageName, validatorPath)=>{
                const validator = await _amphtmlValidator.default.getInstance(validatorPath);
                const result = validator.validateString(rawAmpHtml);
                const errors = result.errors.filter((e)=>e.severity === "ERROR");
                const warnings = result.errors.filter((e)=>e.severity !== "ERROR");
                if (warnings.length || errors.length) {
                    results.ampValidations.push({
                        page: ampPageName,
                        result: {
                            errors,
                            warnings
                        }
                    });
                }
            };
            const html = renderResult ? renderResult.toUnchunkedString() : "";
            if (inAmpMode && !curRenderOpts.ampSkipValidation) {
                if (!results.ssgNotFound) {
                    await validateAmp(html, path, curRenderOpts.ampValidatorPath);
                }
            } else if (hybridAmp) {
                // we need to render the AMP version
                let ampHtmlFilename = `${ampPath}${_path.sep}index.html`;
                if (!subFolders) {
                    ampHtmlFilename = `${ampPath}.html`;
                }
                const ampBaseDir = (0, _path).join(outDir, (0, _path).dirname(ampHtmlFilename));
                const ampHtmlFilepath = (0, _path).join(outDir, ampHtmlFilename);
                try {
                    await _fs.promises.access(ampHtmlFilepath);
                } catch (_) {
                    let ampRenderResult;
                    // make sure it doesn't exist from manual mapping
                    try {
                        ampRenderResult = await renderMethod(req, res, page, // @ts-ignore
                        {
                            ...query,
                            amp: "1"
                        }, curRenderOpts);
                    } catch (err) {
                        if (err.digest !== _noSsrError.NEXT_DYNAMIC_NO_SSR_CODE) {
                            throw err;
                        }
                    }
                    const ampHtml = ampRenderResult ? ampRenderResult.toUnchunkedString() : "";
                    if (!curRenderOpts.ampSkipValidation) {
                        await validateAmp(ampHtml, page + "?amp=1");
                    }
                    await _fs.promises.mkdir(ampBaseDir, {
                        recursive: true
                    });
                    await _fs.promises.writeFile(ampHtmlFilepath, ampHtml, "utf8");
                }
            }
            if (curRenderOpts.pageData) {
                const dataFile = (0, _path).join(pagesDataDir, htmlFilename.replace(/\.html$/, ".json"));
                await _fs.promises.mkdir((0, _path).dirname(dataFile), {
                    recursive: true
                });
                await _fs.promises.writeFile(dataFile, JSON.stringify(curRenderOpts.pageData), "utf8");
                if (hybridAmp) {
                    await _fs.promises.writeFile(dataFile.replace(/\.json$/, ".amp.json"), JSON.stringify(curRenderOpts.pageData), "utf8");
                }
            }
            results.fromBuildExportRevalidate = curRenderOpts.revalidate;
            if (!results.ssgNotFound) {
                // don't attempt writing to disk if getStaticProps returned not found
                await _fs.promises.writeFile(htmlFilepath, html, "utf8");
            }
        } catch (error) {
            console.error(`\nError occurred prerendering page "${path}". Read more: https://nextjs.org/docs/messages/prerender-error\n` + ((0, _isError).default(error) && error.stack ? error.stack : error));
            results.error = true;
        }
        return {
            ...results,
            duration: Date.now() - start
        };
    });
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();
    _getRequireWildcardCache = function() {
        return cache;
    };
    return cache;
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
var _curRenderOpts;
// `NEXT_PREBUNDLED_REACT` env var is inherited from parent process,
// then override react packages here for export worker.
if (process.env.NEXT_PREBUNDLED_REACT) {
    require("../build/webpack/require-hook").overrideBuiltInReactPackages();
}
(0, _requireHook).loadRequireHook();
const envConfig = require("../shared/lib/runtime-config");
globalThis.__NEXT_DATA__ = {
    nextExport: true
};
// expose AsyncLocalStorage on globalThis for react usage
const { AsyncLocalStorage  } = require("async_hooks");
globalThis.AsyncLocalStorage = AsyncLocalStorage;

//# sourceMappingURL=worker.js.map