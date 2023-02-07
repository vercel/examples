import { promises } from "fs";
import { join } from "path";
import { FONT_MANIFEST, PAGES_MANIFEST, SERVER_DIRECTORY, APP_PATHS_MANIFEST } from "../shared/lib/constants";
import { normalizeLocalePath } from "../shared/lib/i18n/normalize-locale-path";
import { normalizePagePath } from "../shared/lib/page-path/normalize-page-path";
import { denormalizePagePath } from "../shared/lib/page-path/denormalize-page-path";
import { PageNotFoundError, MissingStaticPage } from "../shared/lib/utils";
import LRUCache from "next/dist/compiled/lru-cache";
const pagePathCache = process.env.NODE_ENV === "development" ? {
    get: (_key)=>{
        return null;
    },
    set: ()=>{},
    has: ()=>false
} : new LRUCache({
    max: 1000
});
export function getMaybePagePath(page, distDir, locales, appDirEnabled) {
    const cacheKey = `${page}:${locales}`;
    if (pagePathCache.has(cacheKey)) {
        return pagePathCache.get(cacheKey);
    }
    const serverBuildPath = join(distDir, SERVER_DIRECTORY);
    let appPathsManifest;
    if (appDirEnabled) {
        appPathsManifest = require(join(serverBuildPath, APP_PATHS_MANIFEST));
    }
    const pagesManifest = require(join(serverBuildPath, PAGES_MANIFEST));
    try {
        page = denormalizePagePath(normalizePagePath(page));
    } catch (err) {
        console.error(err);
        throw new PageNotFoundError(page);
    }
    const checkManifest = (manifest)=>{
        let curPath = manifest[page];
        if (!manifest[curPath] && locales) {
            const manifestNoLocales = {};
            for (const key of Object.keys(manifest)){
                manifestNoLocales[normalizeLocalePath(key, locales).pathname] = pagesManifest[key];
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
    const path = join(serverBuildPath, pagePath);
    pagePathCache.set(cacheKey, path);
    return path;
}
export function getPagePath(page, distDir, locales, appDirEnabled) {
    const pagePath = getMaybePagePath(page, distDir, locales, appDirEnabled);
    if (!pagePath) {
        throw new PageNotFoundError(page);
    }
    return pagePath;
}
export function requirePage(page, distDir, appDirEnabled) {
    const pagePath = getPagePath(page, distDir, undefined, appDirEnabled);
    if (pagePath.endsWith(".html")) {
        return promises.readFile(pagePath, "utf8").catch((err)=>{
            throw new MissingStaticPage(page, err.message);
        });
    }
    return require(pagePath);
}
export function requireFontManifest(distDir) {
    const serverBuildPath = join(distDir, SERVER_DIRECTORY);
    const fontManifest = require(join(serverBuildPath, FONT_MANIFEST));
    return fontManifest;
}

//# sourceMappingURL=require.js.map