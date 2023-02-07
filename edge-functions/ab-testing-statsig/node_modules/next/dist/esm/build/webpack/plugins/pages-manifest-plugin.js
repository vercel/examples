import { webpack, sources } from "next/dist/compiled/webpack/webpack";
import { PAGES_MANIFEST, APP_PATHS_MANIFEST } from "../../../shared/lib/constants";
import getRouteFromEntrypoint from "../../../server/get-route-from-entrypoint";
import { normalizePathSep } from "../../../shared/lib/page-path/normalize-path-sep";
let edgeServerPages = {};
let nodeServerPages = {};
let edgeServerAppPaths = {};
let nodeServerAppPaths = {};
// This plugin creates a pages-manifest.json from page entrypoints.
// This is used for mapping paths like `/` to `.next/server/static/<buildid>/pages/index.js` when doing SSR
// It's also used by next export to provide defaultPathMap
export default class PagesManifestPlugin {
    constructor({ dev , isEdgeRuntime , appDirEnabled  }){
        this.dev = dev;
        this.isEdgeRuntime = isEdgeRuntime;
        this.appDirEnabled = appDirEnabled;
    }
    createAssets(compilation, assets) {
        const entrypoints = compilation.entrypoints;
        const pages = {};
        const appPaths = {};
        for (const entrypoint of entrypoints.values()){
            const pagePath = getRouteFromEntrypoint(entrypoint.name, this.appDirEnabled);
            if (!pagePath) {
                continue;
            }
            const files = entrypoint.getFiles().filter((file)=>!file.includes("webpack-runtime") && !file.includes("webpack-api-runtime") && file.endsWith(".js"));
            // Skip entries which are empty
            if (!files.length) {
                continue;
            }
            // Write filename, replace any backslashes in path (on windows) with forwardslashes for cross-platform consistency.
            let file1 = files[files.length - 1];
            if (!this.dev) {
                if (!this.isEdgeRuntime) {
                    file1 = file1.slice(3);
                }
            }
            file1 = normalizePathSep(file1);
            if (entrypoint.name.startsWith("app/")) {
                appPaths[pagePath] = file1;
            } else {
                pages[pagePath] = file1;
            }
        }
        // This plugin is used by both the Node server and Edge server compilers,
        // we need to merge both pages to generate the full manifest.
        if (this.isEdgeRuntime) {
            edgeServerPages = pages;
            edgeServerAppPaths = appPaths;
        } else {
            nodeServerPages = pages;
            nodeServerAppPaths = appPaths;
        }
        assets[`${!this.dev && !this.isEdgeRuntime ? "../" : ""}` + PAGES_MANIFEST] = new sources.RawSource(JSON.stringify({
            ...edgeServerPages,
            ...nodeServerPages
        }, null, 2));
        if (this.appDirEnabled) {
            assets[`${!this.dev && !this.isEdgeRuntime ? "../" : ""}` + APP_PATHS_MANIFEST] = new sources.RawSource(JSON.stringify({
                ...edgeServerAppPaths,
                ...nodeServerAppPaths
            }, null, 2));
        }
    }
    apply(compiler) {
        compiler.hooks.make.tap("NextJsPagesManifest", (compilation)=>{
            compilation.hooks.processAssets.tap({
                name: "NextJsPagesManifest",
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
            }, (assets)=>{
                this.createAssets(compilation, assets);
            });
        });
    }
};

//# sourceMappingURL=pages-manifest-plugin.js.map