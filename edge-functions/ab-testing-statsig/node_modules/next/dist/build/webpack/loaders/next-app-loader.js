"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _webpackConfig = require("../../webpack-config");
var _getModuleBuildInfo = require("./get-module-build-info");
var _path = require("path");
var _verifyRootLayout = require("../../../lib/verifyRootLayout");
var Log = _interopRequireWildcard(require("../../../build/output/log"));
var _constants = require("../../../lib/constants");
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
const FILE_TYPES = {
    layout: "layout",
    template: "template",
    error: "error",
    loading: "loading",
    head: "head",
    "not-found": "not-found"
};
const PAGE_SEGMENT = "page$";
async function createTreeCodeFromPath({ pagePath , resolve , resolveParallelSegments  }) {
    const splittedPath = pagePath.split(/[\\/]/);
    const appDirPrefix = splittedPath[0];
    const pages = [];
    let rootLayout;
    async function createSubtreePropsFromSegmentPath(segments) {
        const segmentPath = segments.join("/");
        // Existing tree are the children of the current segment
        const props = {};
        // We need to resolve all parallel routes in this level.
        const parallelSegments = [];
        if (segments.length === 0) {
            parallelSegments.push([
                "children",
                ""
            ]);
        } else {
            parallelSegments.push(...resolveParallelSegments(segmentPath));
        }
        for (const [parallelKey, parallelSegment] of parallelSegments){
            if (parallelSegment === PAGE_SEGMENT) {
                const matchedPagePath = `${appDirPrefix}${segmentPath}/page`;
                const resolvedPagePath = await resolve(matchedPagePath);
                if (resolvedPagePath) pages.push(resolvedPagePath);
                // Use '' for segment as it's the page. There can't be a segment called '' so this is the safest way to add it.
                props[parallelKey] = `['', {}, {
          page: [() => import(/* webpackMode: "eager" */ ${JSON.stringify(resolvedPagePath)}), ${JSON.stringify(resolvedPagePath)}]}]`;
                continue;
            }
            const parallelSegmentPath = segmentPath + "/" + parallelSegment;
            const subtree = await createSubtreePropsFromSegmentPath([
                ...segments,
                parallelSegment, 
            ]);
            // `page` is not included here as it's added above.
            const filePaths = await Promise.all(Object.values(FILE_TYPES).map(async (file)=>{
                return [
                    file,
                    await resolve(`${appDirPrefix}${parallelSegmentPath}/${file}`), 
                ];
            }));
            if (!rootLayout) {
                var ref;
                rootLayout = (ref = filePaths.find(([type, path])=>type === "layout" && !!path)) == null ? void 0 : ref[1];
            }
            props[parallelKey] = `[
        '${parallelSegment}',
        ${subtree},
        {
          ${filePaths.filter(([, filePath])=>filePath !== undefined).map(([file, filePath])=>{
                if (filePath === undefined) {
                    return "";
                }
                return `'${file}': [() => import(/* webpackMode: "eager" */ ${JSON.stringify(filePath)}), ${JSON.stringify(filePath)}],`;
            }).join("\n")}
        }
      ]`;
        }
        return `{
      ${Object.entries(props).map(([key, value])=>`${key}: ${value}`).join(",\n")}
    }`;
    }
    const tree = await createSubtreePropsFromSegmentPath([]);
    return [
        `const tree = ${tree}.children;`,
        pages,
        rootLayout
    ];
}
function createAbsolutePath(appDir, pathToTurnAbsolute) {
    return pathToTurnAbsolute// Replace all POSIX path separators with the current OS path separator
    .replace(/\//g, _path.sep).replace(/^private-next-app-dir/, appDir);
}
const nextAppLoader = async function nextAppLoader() {
    const { name , appDir , appPaths , pagePath , pageExtensions , rootDir , tsconfigPath , isDev ,  } = this.getOptions() || {};
    const buildInfo = (0, _getModuleBuildInfo).getModuleBuildInfo(this._module);
    buildInfo.route = {
        page: name.replace(/^app/, ""),
        absolutePagePath: createAbsolutePath(appDir, pagePath)
    };
    const extensions = pageExtensions.map((extension)=>`.${extension}`);
    const resolveOptions = {
        ..._webpackConfig.NODE_RESOLVE_OPTIONS,
        extensions
    };
    const resolve = this.getResolve(resolveOptions);
    const normalizedAppPaths = typeof appPaths === "string" ? [
        appPaths
    ] : appPaths || [];
    const resolveParallelSegments = (pathname)=>{
        const matched = {};
        for (const path of normalizedAppPaths){
            if (path.startsWith(pathname + "/")) {
                const rest = path.slice(pathname.length + 1).split("/");
                let matchedSegment = rest[0];
                // It is the actual page, mark it sepcially.
                if (rest.length === 1 && matchedSegment === "page") {
                    matchedSegment = PAGE_SEGMENT;
                }
                const matchedKey = matchedSegment.startsWith("@") ? matchedSegment.slice(1) : "children";
                matched[matchedKey] = matchedSegment;
            }
        }
        return Object.entries(matched);
    };
    const resolver = async (pathname)=>{
        try {
            const resolved = await resolve(this.rootContext, pathname);
            this.addDependency(resolved);
            return resolved;
        } catch (err) {
            const absolutePath = createAbsolutePath(appDir, pathname);
            for (const ext of extensions){
                const absolutePathWithExtension = `${absolutePath}${ext}`;
                this.addMissingDependency(absolutePathWithExtension);
            }
            if (err.message.includes("Can't resolve")) {
                return undefined;
            }
            throw err;
        }
    };
    const [treeCode, pages, rootLayout] = await createTreeCodeFromPath({
        pagePath,
        resolve: resolver,
        resolveParallelSegments
    });
    if (!rootLayout) {
        const errorMessage = `${_chalk.default.bold(pagePath.replace(`${_constants.APP_DIR_ALIAS}/`, ""))} doesn't have a root layout. To fix this error, make sure every page has a root layout.`;
        if (!isDev) {
            // If we're building and missing a root layout, exit the build
            Log.error(errorMessage);
            process.exit(1);
        } else {
            // In dev we'll try to create a root layout
            const createdRootLayout = await (0, _verifyRootLayout).verifyRootLayout({
                appDir: appDir,
                dir: rootDir,
                tsconfigPath: tsconfigPath,
                pagePath,
                pageExtensions
            });
            if (!createdRootLayout) {
                throw new Error(errorMessage);
            }
        }
    }
    const result = `
    export ${treeCode}
    export const pages = ${JSON.stringify(pages)}

    export { default as AppRouter } from 'next/dist/client/components/app-router'
    export { default as LayoutRouter } from 'next/dist/client/components/layout-router'
    export { default as RenderFromTemplateContext } from 'next/dist/client/components/render-from-template-context'

    export { staticGenerationAsyncStorage } from 'next/dist/client/components/static-generation-async-storage'
    export { requestAsyncStorage } from 'next/dist/client/components/request-async-storage'

    export * as serverHooks from 'next/dist/client/components/hooks-server-context'

    export { renderToReadableStream } from 'next/dist/compiled/react-server-dom-webpack/server.browser'
    export const __next_app_webpack_require__ = __webpack_require__
  `;
    return result;
};
var _default = nextAppLoader;
exports.default = _default;

//# sourceMappingURL=next-app-loader.js.map