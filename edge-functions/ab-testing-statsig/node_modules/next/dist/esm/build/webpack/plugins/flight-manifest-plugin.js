/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ import { webpack, sources } from "next/dist/compiled/webpack/webpack";
import { FLIGHT_MANIFEST } from "../../../shared/lib/constants";
import { relative } from "path";
import { isClientComponentModule, regexCSS } from "../loaders/utils";
import { edgeServerModuleIds, serverModuleIds } from "./flight-client-entry-plugin";
import { traverseModules } from "../utils";
const PLUGIN_NAME = "FlightManifestPlugin";
// Collect modules from server/edge compiler in client layer,
// and detect if it's been used, and mark it as `async: true` for react.
// So that react could unwrap the async module from promise and render module itself.
export const ASYNC_CLIENT_MODULES = new Set();
export class FlightManifestPlugin {
    dev = false;
    constructor(options){
        this.dev = options.dev;
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory  })=>{
            compilation.dependencyFactories.set(webpack.dependencies.ModuleDependency, normalModuleFactory);
            compilation.dependencyTemplates.set(webpack.dependencies.ModuleDependency, new webpack.dependencies.NullDependency.Template());
        });
        compiler.hooks.make.tap(PLUGIN_NAME, (compilation)=>{
            compilation.hooks.processAssets.tap({
                name: PLUGIN_NAME,
                // Have to be in the optimize stage to run after updating the CSS
                // asset hash via extract mini css plugin.
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_HASH
            }, (assets)=>this.createAsset(assets, compilation, compiler.context));
        });
    }
    createAsset(assets, compilation, context) {
        const manifest = {
            __ssr_module_mapping__: {},
            __edge_ssr_module_mapping__: {}
        };
        const dev = this.dev;
        const clientRequestsSet = new Set();
        // Collect client requests
        function collectClientRequest(mod) {
            if (mod.resource === "" && mod.buildInfo.rsc) {
                const { requests =[]  } = mod.buildInfo.rsc;
                requests.forEach((r)=>{
                    clientRequestsSet.add(r);
                });
            }
        }
        traverseModules(compilation, (mod)=>collectClientRequest(mod));
        compilation.chunkGroups.forEach((chunkGroup)=>{
            const cssResourcesInChunkGroup = new Set();
            let entryFilepath = "";
            function recordModule(chunk, id, mod) {
                var ref;
                const isCSSModule = regexCSS.test(mod.resource) || mod.type === "css/mini-extract" || !!mod.loaders && (dev ? mod.loaders.some((item)=>item.loader.includes("next-style-loader/index.js")) : mod.loaders.some((item)=>item.loader.includes("mini-css-extract-plugin/loader.js")));
                const resource = mod.type === "css/mini-extract" ? mod._identifier.slice(mod._identifier.lastIndexOf("!") + 1) : mod.resource;
                if (!resource) {
                    return;
                }
                const moduleExports = manifest[resource] || {};
                const moduleIdMapping = manifest.__ssr_module_mapping__;
                const edgeModuleIdMapping = manifest.__edge_ssr_module_mapping__;
                // Note that this isn't that reliable as webpack is still possible to assign
                // additional queries to make sure there's no conflict even using the `named`
                // module ID strategy.
                let ssrNamedModuleId = relative(context, ((ref = mod.resourceResolveData) == null ? void 0 : ref.path) || resource);
                if (!ssrNamedModuleId.startsWith(".")) ssrNamedModuleId = `./${ssrNamedModuleId.replace(/\\/g, "/")}`;
                if (isCSSModule) {
                    const chunks = [
                        ...chunk.files
                    ].filter((f)=>f.endsWith(".css"));
                    if (!manifest[resource]) {
                        manifest[resource] = {
                            default: {
                                id,
                                name: "default",
                                chunks
                            }
                        };
                    } else {
                        // It is possible that there are multiple modules with the same resource,
                        // e.g. extracted by mini-css-extract-plugin. In that case we need to
                        // merge the chunks.
                        manifest[resource].default.chunks = [
                            ...new Set([
                                ...manifest[resource].default.chunks,
                                ...chunks
                            ]), 
                        ];
                    }
                    if (chunkGroup.name) {
                        cssResourcesInChunkGroup.add(resource);
                    }
                    return;
                }
                // Only apply following logic to client module requests from client entry,
                // or if the module is marked as client module.
                if (!clientRequestsSet.has(resource) && !isClientComponentModule(mod)) {
                    return;
                }
                if (/[\\/](page|layout)\.(ts|js)x?$/.test(resource)) {
                    entryFilepath = resource;
                }
                const exportsInfo = compilation.moduleGraph.getExportsInfo(mod);
                const isAsyncModule = ASYNC_CLIENT_MODULES.has(mod.resource);
                const cjsExports = [
                    ...new Set([
                        ...mod.dependencies.map((dep)=>{
                            // Match CommonJsSelfReferenceDependency
                            if (dep.type === "cjs self exports reference") {
                                // @ts-expect-error: TODO: Fix Dependency type
                                if (dep.base === "module.exports") {
                                    return "default";
                                }
                                // `exports.foo = ...`, `exports.default = ...`
                                // @ts-expect-error: TODO: Fix Dependency type
                                if (dep.base === "exports") {
                                    // @ts-expect-error: TODO: Fix Dependency type
                                    return dep.names.filter((name)=>name !== "__esModule");
                                }
                            }
                            return null;
                        }), 
                    ]), 
                ];
                function getAppPathRequiredChunks() {
                    return chunkGroup.chunks.map((requiredChunk)=>{
                        return requiredChunk.id + ":" + (requiredChunk.name || requiredChunk.id) + (dev ? "" : "-" + requiredChunk.hash);
                    });
                }
                const moduleExportedKeys = [
                    "",
                    "*"
                ].concat([
                    ...exportsInfo.exports
                ].filter((exportInfo)=>exportInfo.provided).map((exportInfo)=>exportInfo.name), ...cjsExports).filter((name)=>name !== null);
                moduleExportedKeys.forEach((name)=>{
                    // If the chunk is from `app/` chunkGroup, use it first.
                    // This make sure not to load the overlapped chunk from `pages/` chunkGroup
                    if (!moduleExports[name] || chunkGroup.name && /^app[\\/]/.test(chunkGroup.name)) {
                        const requiredChunks = getAppPathRequiredChunks();
                        moduleExports[name] = {
                            id,
                            name,
                            chunks: requiredChunks,
                            // E.g.
                            // page (server) -> local module (client) -> package (esm)
                            // The esm package will bubble up to make the entire chain till the client entry as async module.
                            async: isAsyncModule
                        };
                    }
                    if (serverModuleIds.has(ssrNamedModuleId)) {
                        moduleIdMapping[id] = moduleIdMapping[id] || {};
                        moduleIdMapping[id][name] = {
                            ...moduleExports[name],
                            id: serverModuleIds.get(ssrNamedModuleId)
                        };
                    }
                    if (edgeServerModuleIds.has(ssrNamedModuleId)) {
                        edgeModuleIdMapping[id] = edgeModuleIdMapping[id] || {};
                        edgeModuleIdMapping[id][name] = {
                            ...moduleExports[name],
                            id: edgeServerModuleIds.get(ssrNamedModuleId)
                        };
                    }
                });
                manifest[resource] = moduleExports;
                // The client compiler will always use the CJS Next.js build, so here we
                // also add the mapping for the ESM build (Edge runtime) to consume.
                if (/\/next\/dist\//.test(resource)) {
                    manifest[resource.replace(/\/next\/dist\//, "/next/dist/esm/")] = moduleExports;
                }
                manifest.__ssr_module_mapping__ = moduleIdMapping;
                manifest.__edge_ssr_module_mapping__ = edgeModuleIdMapping;
            }
            chunkGroup.chunks.forEach((chunk)=>{
                const chunkModules = compilation.chunkGraph.getChunkModulesIterable(chunk);
                for (const mod of chunkModules){
                    const modId = compilation.chunkGraph.getModuleId(mod) + "";
                    recordModule(chunk, modId, mod);
                    // If this is a concatenation, register each child to the parent ID.
                    // TODO: remove any
                    const anyModule = mod;
                    if (anyModule.modules) {
                        anyModule.modules.forEach((concatenatedMod)=>{
                            recordModule(chunk, modId, concatenatedMod);
                        });
                    }
                }
            });
            const clientCSSManifest = manifest.__client_css_manifest__ || {};
            if (entryFilepath) {
                clientCSSManifest[entryFilepath] = Array.from(cssResourcesInChunkGroup);
            }
            manifest.__client_css_manifest__ = clientCSSManifest;
        });
        const file = "server/" + FLIGHT_MANIFEST;
        const json = JSON.stringify(manifest);
        ASYNC_CLIENT_MODULES.clear();
        assets[file + ".js"] = new sources.RawSource("self.__RSC_MANIFEST=" + json);
        assets[file + ".json"] = new sources.RawSource(json);
    }
}

//# sourceMappingURL=flight-manifest-plugin.js.map