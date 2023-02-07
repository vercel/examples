"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getMaybePagePath = getMaybePagePath;
exports.getPagePath = getPagePath;
exports.requirePage = requirePage;
exports.requireFontManifest = requireFontManifest;
var _fs = require("fs");
var _path = require("path");
var _constants = require("../shared/lib/constants");
var _normalizeLocalePath = require("../shared/lib/i18n/normalize-locale-path");
var _normalizePagePath = require("../shared/lib/page-path/normalize-page-path");
var _denormalizePagePath = require("../shared/lib/page-path/denormalize-page-path");
var _utils = require("../shared/lib/utils");
var _lruCache = _interopRequireDefault(require("next/dist/compiled/lru-cache"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const pagePathCache = process.env.NODE_ENV === "development" ? {
    get: (_key)=>{
        return null;
    },
    set: ()=>{},
    has: ()=>false
} : new _lruCache.default({
    max: 1000
});
function getMaybePagePath(page, distDir, locales, appDirEnabled) {
    const cacheKey = `${page}:${locales}`;
    if (pagePathCache.has(cacheKey)) {
        return pagePathCache.get(cacheKey);
    }
    const serverBuildPath = (0, _path).join(distDir, _constants.SERVER_DIRECTORY);
    let appPathsManifest;
    if (appDirEnabled) {
        appPathsManifest = require((0, _path).join(serverBuildPath, _constants.APP_PATHS_MANIFEST));
    }
    const pagesManifest = require((0, _path).join(serverBuildPath, _constants.PAGES_MANIFEST));
    try {
        page = (0, _denormalizePagePath).denormalizePagePath((0, _normalizePagePath).normalizePagePath(page));
    } catch (err) {
        console.error(err);
        throw new _utils.PageNotFoundError(page);
    }
    const checkManifest = (manifest)=>{
        let curPath = manifest[page];
        if (!manifest[curPath] && locales) {
            const manifestNoLocales = {};
            for (const key of Object.keys(manifest)){
                manifestNoLocales[(0, _normalizeLocalePath).normalizeLocalePath(key, locales).pathname] = pagesManifest[key];
            }
            curPath = manifestNoLocales[page];
        }
        return curPath;
    };
    let pagePath;
    if (appPathsManifest) {
        pagePath = checkManifest(appPathsManifest);
    }
    if (!pagePath) {
        pagePath = checkManifest(pagesManifest);
    }
    if (!pagePath) {
        pagePathCache.set(cacheKey, null);
        return null;
    }
    const path = (0, _path).join(serverBuildPath, pagePath);
    pagePathCache.set(cacheKey, path);
    return path;
}
function getPagePath(page, distDir, locales, appDirEnabled) {
    const pagePath = getMaybePagePath(page, distDir, locales, appDirEnabled);
    if (!pagePath) {
        throw new _utils.PageNotFoundError(page);
    }
    return pagePath;
}
function requirePage(page, distDir, appDirEnabled) {
    const pagePath = getPagePath(page, distDir, undefined, appDirEnabled);
    if (pagePath.endsWith(".html")) {
        return _fs.promises.readFile(pagePath, "utf8").catch((err)=>{
            throw new _utils.MissingStaticPage(page, err.message);
        });
    }
    return require(pagePath);
}
function requireFontManifest(distDir) {
    const serverBuildPath = (0, _path).join(distDir, _constants.SERVER_DIRECTORY);
    const fontManifest = require((0, _path).join(serverBuildPath, _constants.FONT_MANIFEST));
    return fontManifest;
}

//# sourceMappingURL=require.js.map