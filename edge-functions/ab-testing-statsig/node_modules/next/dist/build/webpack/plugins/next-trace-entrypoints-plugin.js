"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
var _profilingPlugin = require("./profiling-plugin");
var _isError = _interopRequireDefault(require("../../../lib/is-error"));
var _nft = require("next/dist/compiled/@vercel/nft");
var _constants = require("../../../shared/lib/constants");
var _webpack = require("next/dist/compiled/webpack/webpack");
var _webpackConfig = require("../../webpack-config");
var _swc = require("../../swc");
var _micromatch = require("next/dist/compiled/micromatch");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const PLUGIN_NAME = "TraceEntryPointsPlugin";
const TRACE_IGNORES = [
    "**/*/next/dist/server/next.js",
    "**/*/next/dist/bin/next", 
];
const NOT_TRACEABLE = [
    ".wasm",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".avif",
    ".ico",
    ".bmp",
    ".svg", 
];
const TURBO_TRACE_DEFAULT_MAX_FILES = 128;
function getModuleFromDependency(compilation, dep) {
    return compilation.moduleGraph.getModule(dep);
}
function getFilesMapFromReasons(fileList, reasons, ignoreFn) {
    // this uses the reasons tree to collect files specific to a
    // certain parent allowing us to not have to trace each parent
    // separately
    const parentFilesMap = new Map();
    function propagateToParents(parents, file, seen = new Set()) {
        for (const parent of parents || []){
            if (!seen.has(parent)) {
                seen.add(parent);
                let parentFiles = parentFilesMap.get(parent);
                if (!parentFiles) {
                    parentFiles = new Set();
                    parentFilesMap.set(parent, parentFiles);
                }
                if (!(ignoreFn == null ? void 0 : ignoreFn(file, parent))) {
                    parentFiles.add(file);
                }
                const parentReason = reasons.get(parent);
                if (parentReason == null ? void 0 : parentReason.parents) {
                    propagateToParents(parentReason.parents, file, seen);
                }
            }
        }
    }
    for (const file1 of fileList){
        const reason = reasons.get(file1);
        const isInitial = (reason == null ? void 0 : reason.type.length) === 1 && reason.type.includes("initial");
        if (!reason || !reason.parents || isInitial && reason.parents.size === 0) {
            continue;
        }
        propagateToParents(reason.parents, file1);
    }
    return parentFilesMap;
}
class TraceEntryPointsPlugin {
    chunksToTrace = [];
    constructor({ appDir , appDirEnabled , traceIgnores , esmExternals , outputFileTracingRoot , turbotrace  }){
        this.appDir = appDir;
        this.entryTraces = new Map();
        this.esmExternals = esmExternals;
        this.appDirEnabled = appDirEnabled;
        this.traceIgnores = traceIgnores || [];
        this.tracingRoot = outputFileTracingRoot || appDir;
        this.turbotrace = turbotrace;
    }
    // Here we output all traced assets and webpack chunks to a
    // ${page}.js.nft.json file
    async createTraceAssets(compilation, assets, span, readlink, stat) {
        const outputPath = compilation.outputOptions.path;
        await span.traceChild("create-trace-assets").traceAsyncFn(async ()=>{
            const entryFilesMap = new Map();
            const chunksToTrace = new Set();
            const isTraceable = (file)=>!NOT_TRACEABLE.some((suffix)=>{
                    return file.endsWith(suffix);
                });
            for (const entrypoint of compilation.entrypoints.values()){
                const entryFiles = new Set();
                for (const chunk of entrypoint.getEntrypointChunk().getAllReferencedChunks()){
                    for (const file of chunk.files){
                        if (isTraceable(file)) {
                            const filePath = _path.default.join(outputPath, file);
                            chunksToTrace.add(filePath);
                            entryFiles.add(filePath);
                        }
                    }
                    for (const file2 of chunk.auxiliaryFiles){
                        if (isTraceable(file2)) {
                            const filePath = _path.default.join(outputPath, file2);
                            chunksToTrace.add(filePath);
                            entryFiles.add(filePath);
                        }
                    }
                }
                entryFilesMap.set(entrypoint, entryFiles);
            }
            // startTrace existed and callable
            if (this.turbotrace) {
                let binding = await (0, _swc).loadBindings();
                if (!(binding == null ? void 0 : binding.isWasm) && typeof binding.turbo.startTrace === "function") {
                    this.chunksToTrace = [
                        ...chunksToTrace
                    ];
                    return;
                }
            }
            const ignores = [
                ...TRACE_IGNORES,
                ...this.traceIgnores
            ];
            const ignoreFn = (path)=>{
                return (0, _micromatch).isMatch(path, ignores, {
                    contains: true,
                    dot: true
                });
            };
            const result = await (0, _nft).nodeFileTrace([
                ...chunksToTrace
            ], {
                base: this.tracingRoot,
                processCwd: this.appDir,
                readFile: async (path)=>{
                    if (chunksToTrace.has(path)) {
                        var ref;
                        const source = (ref = assets[_path.default.relative(outputPath, path).replace(/\\/g, "/")]) == null ? void 0 : ref.source == null ? void 0 : ref.source();
                        if (source) return source;
                    }
                    try {
                        return await new Promise((resolve, reject)=>{
                            compilation.inputFileSystem.readFile(path, (err, data)=>{
                                if (err) return reject(err);
                                resolve(data);
                            });
                        });
                    } catch (e) {
                        if ((0, _isError).default(e) && (e.code === "ENOENT" || e.code === "EISDIR")) {
                            return null;
                        }
                        throw e;
                    }
                },
                readlink,
                stat,
                ignore: ignoreFn,
                mixedModules: true
            });
            const reasons = result.reasons;
            const fileList = result.fileList;
            result.esmFileList.forEach((file)=>fileList.add(file));
            const parentFilesMap = getFilesMapFromReasons(fileList, reasons);
            for (const [entrypoint1, entryFiles] of entryFilesMap){
                const traceOutputName = `../${entrypoint1.name}.js.nft.json`;
                const traceOutputPath = _path.default.dirname(_path.default.join(outputPath, traceOutputName));
                const allEntryFiles = new Set();
                entryFiles.forEach((file)=>{
                    var ref;
                    (ref = parentFilesMap.get(_path.default.relative(this.tracingRoot, file))) == null ? void 0 : ref.forEach((child)=>{
                        allEntryFiles.add(_path.default.join(this.tracingRoot, child));
                    });
                });
                // don't include the entry itself in the trace
                entryFiles.delete(_path.default.join(outputPath, `../${entrypoint1.name}.js`));
                assets[traceOutputName] = new _webpack.sources.RawSource(JSON.stringify({
                    version: _constants.TRACE_OUTPUT_VERSION,
                    files: [
                        ...new Set([
                            ...entryFiles,
                            ...allEntryFiles,
                            ...this.entryTraces.get(entrypoint1.name) || [], 
                        ]), 
                    ].map((file)=>{
                        return _path.default.relative(traceOutputPath, file).replace(/\\/g, "/");
                    })
                }));
            }
        });
    }
    tapfinishModules(compilation, traceEntrypointsPluginSpan, doResolve, readlink, stat) {
        compilation.hooks.finishModules.tapAsync(PLUGIN_NAME, async (_stats, callback)=>{
            const finishModulesSpan = traceEntrypointsPluginSpan.traceChild("finish-modules");
            await finishModulesSpan.traceAsyncFn(async ()=>{
                // we create entry -> module maps so that we can
                // look them up faster instead of having to iterate
                // over the compilation modules list
                const entryNameMap = new Map();
                const entryModMap = new Map();
                const additionalEntries = new Map();
                const depModMap = new Map();
                finishModulesSpan.traceChild("get-entries").traceFn(()=>{
                    compilation.entries.forEach((entry, name)=>{
                        const normalizedName = name == null ? void 0 : name.replace(/\\/g, "/");
                        const isPage = normalizedName.startsWith("pages/");
                        const isApp = this.appDirEnabled && normalizedName.startsWith("app/");
                        if (isApp || isPage) {
                            for (const dep of entry.dependencies){
                                if (!dep) continue;
                                const entryMod = getModuleFromDependency(compilation, dep);
                                // since app entries are wrapped in next-app-loader
                                // we need to pull the original pagePath for
                                // referencing during tracing
                                if (isApp && entryMod.request) {
                                    var ref;
                                    const loaderQueryIdx = entryMod.request.indexOf("?");
                                    const loaderQuery = new URLSearchParams(entryMod.request.substring(loaderQueryIdx));
                                    const resource = ((ref = loaderQuery.get("pagePath")) == null ? void 0 : ref.replace("private-next-app-dir", _path.default.join(this.appDir, "app"))) || "";
                                    entryModMap.set(resource, entryMod);
                                    entryNameMap.set(resource, name);
                                }
                                if (entryMod && entryMod.resource) {
                                    const normalizedResource = entryMod.resource.replace(/\\/g, "/");
                                    if (normalizedResource.includes("pages/")) {
                                        entryNameMap.set(entryMod.resource, name);
                                        entryModMap.set(entryMod.resource, entryMod);
                                    } else {
                                        let curMap = additionalEntries.get(name);
                                        if (!curMap) {
                                            curMap = new Map();
                                            additionalEntries.set(name, curMap);
                                        }
                                        depModMap.set(entryMod.resource, entryMod);
                                        curMap.set(entryMod.resource, entryMod);
                                    }
                                }
                            }
                        }
                    });
                });
                const readFile = async (path)=>{
                    const mod = depModMap.get(path) || entryModMap.get(path);
                    // map the transpiled source when available to avoid
                    // parse errors in node-file-trace
                    const source = mod == null ? void 0 : mod.originalSource == null ? void 0 : mod.originalSource();
                    if (source) {
                        return source.buffer();
                    }
                    // we don't want to analyze non-transpiled
                    // files here, that is done against webpack output
                    return "";
                };
                const entryPaths = Array.from(entryModMap.keys());
                const collectDependencies = (mod)=>{
                    if (!mod || !mod.dependencies) return;
                    for (const dep of mod.dependencies){
                        const depMod = getModuleFromDependency(compilation, dep);
                        if ((depMod == null ? void 0 : depMod.resource) && !depModMap.get(depMod.resource)) {
                            depModMap.set(depMod.resource, depMod);
                            collectDependencies(depMod);
                        }
                    }
                };
                const entriesToTrace = [
                    ...entryPaths
                ];
                entryPaths.forEach((entry)=>{
                    collectDependencies(entryModMap.get(entry));
                    const entryName = entryNameMap.get(entry);
                    const curExtraEntries = additionalEntries.get(entryName);
                    if (curExtraEntries) {
                        entriesToTrace.push(...curExtraEntries.keys());
                    }
                });
                // startTrace existed and callable
                if (this.turbotrace) {
                    let binding = await (0, _swc).loadBindings();
                    if (!(binding == null ? void 0 : binding.isWasm) && typeof binding.turbo.startTrace === "function") {
                        await finishModulesSpan.traceChild("turbo-trace", {
                            traceEntryCount: entriesToTrace.length + ""
                        }).traceAsyncFn(async ()=>{
                            var ref, ref1;
                            const contextDirectory = ((ref = this.turbotrace) == null ? void 0 : ref.contextDirectory) ?? this.tracingRoot;
                            const maxFiles = ((ref1 = this.turbotrace) == null ? void 0 : ref1.maxFiles) ?? TURBO_TRACE_DEFAULT_MAX_FILES;
                            let chunks = [
                                ...entriesToTrace
                            ];
                            let restChunks = chunks.length > maxFiles ? chunks.splice(maxFiles) : [];
                            let filesTracedInEntries = [];
                            while(chunks.length){
                                var ref2, ref3, ref4;
                                filesTracedInEntries = filesTracedInEntries.concat(await binding.turbo.startTrace({
                                    action: "print",
                                    input: chunks,
                                    contextDirectory,
                                    processCwd: ((ref2 = this.turbotrace) == null ? void 0 : ref2.processCwd) ?? this.appDir,
                                    logLevel: (ref3 = this.turbotrace) == null ? void 0 : ref3.logLevel,
                                    showAll: (ref4 = this.turbotrace) == null ? void 0 : ref4.logAll
                                }));
                                chunks = restChunks;
                                if (restChunks.length) {
                                    restChunks = chunks.length > maxFiles ? chunks.splice(maxFiles) : [];
                                }
                            }
                            // only trace the assets under the appDir
                            // exclude files from node_modules, entries and processed by webpack
                            const filesTracedFromEntries = filesTracedInEntries.map((f)=>_path.default.join(contextDirectory, f)).filter((f)=>!f.includes("/node_modules/") && f.startsWith(this.appDir) && !entriesToTrace.includes(f) && !depModMap.has(f));
                            if (!filesTracedFromEntries.length) {
                                return;
                            }
                            // The turbo trace doesn't provide the traced file type and reason at present
                            // let's write the traced files into the first [entry].nft.json
                            const [[, entryName]] = Array.from(entryNameMap.entries()).filter(([k])=>k.startsWith(this.appDir));
                            const outputPath = compilation.outputOptions.path;
                            const traceOutputPath = _path.default.join(outputPath, `../${entryName}.js.nft.json`);
                            const traceOutputDir = _path.default.dirname(traceOutputPath);
                            this.turbotraceOutputPath = traceOutputPath;
                            this.turbotraceFiles = filesTracedFromEntries.map((file)=>_path.default.relative(traceOutputDir, file));
                        });
                        return;
                    }
                }
                let fileList;
                let reasons;
                const ignores = [
                    ...TRACE_IGNORES,
                    ...this.traceIgnores,
                    "**/node_modules/**", 
                ];
                const ignoreFn = (path)=>{
                    return (0, _micromatch).isMatch(path, ignores, {
                        contains: true,
                        dot: true
                    });
                };
                await finishModulesSpan.traceChild("node-file-trace", {
                    traceEntryCount: entriesToTrace.length + ""
                }).traceAsyncFn(async ()=>{
                    const result = await (0, _nft).nodeFileTrace(entriesToTrace, {
                        base: this.tracingRoot,
                        processCwd: this.appDir,
                        readFile,
                        readlink,
                        stat,
                        resolve: doResolve ? async (id, parent, job, isCjs)=>{
                            return doResolve(id, parent, job, !isCjs);
                        } : undefined,
                        ignore: ignoreFn,
                        mixedModules: true
                    });
                    // @ts-ignore
                    fileList = result.fileList;
                    result.esmFileList.forEach((file)=>fileList.add(file));
                    reasons = result.reasons;
                });
                await finishModulesSpan.traceChild("collect-traced-files").traceAsyncFn(()=>{
                    const parentFilesMap = getFilesMapFromReasons(fileList, reasons, (file)=>{
                        var ref;
                        // if a file was imported and a loader handled it
                        // we don't include it in the trace e.g.
                        // static image imports, CSS imports
                        file = _path.default.join(this.tracingRoot, file);
                        const depMod = depModMap.get(file);
                        const isAsset = (ref = reasons.get(_path.default.relative(this.tracingRoot, file))) == null ? void 0 : ref.type.includes("asset");
                        return !isAsset && Array.isArray(depMod == null ? void 0 : depMod.loaders) && depMod.loaders.length > 0;
                    });
                    entryPaths.forEach((entry)=>{
                        var ref;
                        const entryName = entryNameMap.get(entry);
                        const normalizedEntry = _path.default.relative(this.tracingRoot, entry);
                        const curExtraEntries = additionalEntries.get(entryName);
                        const finalDeps = new Set();
                        (ref = parentFilesMap.get(normalizedEntry)) == null ? void 0 : ref.forEach((dep)=>{
                            finalDeps.add(_path.default.join(this.tracingRoot, dep));
                        });
                        if (curExtraEntries) {
                            for (const extraEntry of curExtraEntries.keys()){
                                var ref5;
                                const normalizedExtraEntry = _path.default.relative(this.tracingRoot, extraEntry);
                                finalDeps.add(extraEntry);
                                (ref5 = parentFilesMap.get(normalizedExtraEntry)) == null ? void 0 : ref5.forEach((dep)=>{
                                    finalDeps.add(_path.default.join(this.tracingRoot, dep));
                                });
                            }
                        }
                        this.entryTraces.set(entryName, finalDeps);
                    });
                });
            }).then(()=>callback(), (err)=>callback(err));
        });
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation)=>{
            const readlink = async (path)=>{
                try {
                    return await new Promise((resolve, reject)=>{
                        compilation.inputFileSystem.readlink(path, (err, link)=>{
                            if (err) return reject(err);
                            resolve(link);
                        });
                    });
                } catch (e) {
                    if ((0, _isError).default(e) && (e.code === "EINVAL" || e.code === "ENOENT" || e.code === "UNKNOWN")) {
                        return null;
                    }
                    throw e;
                }
            };
            const stat = async (path)=>{
                try {
                    return await new Promise((resolve, reject)=>{
                        compilation.inputFileSystem.stat(path, (err, stats)=>{
                            if (err) return reject(err);
                            resolve(stats);
                        });
                    });
                } catch (e) {
                    if ((0, _isError).default(e) && (e.code === "ENOENT" || e.code === "ENOTDIR")) {
                        return null;
                    }
                    throw e;
                }
            };
            const compilationSpan = _profilingPlugin.spans.get(compilation) || _profilingPlugin.spans.get(compiler);
            const traceEntrypointsPluginSpan = compilationSpan.traceChild("next-trace-entrypoint-plugin");
            traceEntrypointsPluginSpan.traceFn(()=>{
                compilation.hooks.processAssets.tapAsync({
                    name: PLUGIN_NAME,
                    stage: _webpack.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
                }, (assets, callback)=>{
                    this.createTraceAssets(compilation, assets, traceEntrypointsPluginSpan, readlink, stat).then(()=>callback()).catch((err)=>callback(err));
                });
                let resolver = compilation.resolverFactory.get("normal");
                function getPkgName(name) {
                    const segments = name.split("/");
                    if (name[0] === "@" && segments.length > 1) return segments.length > 1 ? segments.slice(0, 2).join("/") : null;
                    return segments.length ? segments[0] : null;
                }
                const getResolve = (options)=>{
                    const curResolver = resolver.withOptions(options);
                    return (parent, request, job)=>{
                        return new Promise((resolve, reject)=>{
                            const context = _path.default.dirname(parent);
                            curResolver.resolve({}, context, request, {
                                fileDependencies: compilation.fileDependencies,
                                missingDependencies: compilation.missingDependencies,
                                contextDependencies: compilation.contextDependencies
                            }, async (err, result, resContext)=>{
                                if (err) return reject(err);
                                if (!result) {
                                    return reject(new Error("module not found"));
                                }
                                // webpack resolver doesn't strip loader query info
                                // from the result so use path instead
                                if (result.includes("?") || result.includes("!")) {
                                    result = (resContext == null ? void 0 : resContext.path) || result;
                                }
                                try {
                                    // we need to collect all parent package.json's used
                                    // as webpack's resolve doesn't expose this and parent
                                    // package.json could be needed for resolving e.g. stylis
                                    // stylis/package.json -> stylis/dist/umd/package.json
                                    if (result.includes("node_modules")) {
                                        let requestPath = result.replace(/\\/g, "/").replace(/\0/g, "");
                                        if (!_path.default.isAbsolute(request) && request.includes("/") && (resContext == null ? void 0 : resContext.descriptionFileRoot)) {
                                            var ref;
                                            requestPath = (resContext.descriptionFileRoot + request.slice(((ref = getPkgName(request)) == null ? void 0 : ref.length) || 0) + _path.default.sep + "package.json").replace(/\\/g, "/").replace(/\0/g, "");
                                        }
                                        const rootSeparatorIndex = requestPath.indexOf("/");
                                        let separatorIndex;
                                        while((separatorIndex = requestPath.lastIndexOf("/")) > rootSeparatorIndex){
                                            requestPath = requestPath.slice(0, separatorIndex);
                                            const curPackageJsonPath = `${requestPath}/package.json`;
                                            if (await job.isFile(curPackageJsonPath)) {
                                                await job.emitFile(await job.realpath(curPackageJsonPath), "resolve", parent);
                                            }
                                        }
                                    }
                                } catch (_err) {
                                // we failed to resolve the package.json boundary,
                                // we don't block emitting the initial asset from this
                                }
                                resolve([
                                    result,
                                    options.dependencyType === "esm"
                                ]);
                            });
                        });
                    };
                };
                const CJS_RESOLVE_OPTIONS = {
                    ..._webpackConfig.NODE_RESOLVE_OPTIONS,
                    fullySpecified: undefined,
                    modules: undefined,
                    extensions: undefined
                };
                const BASE_CJS_RESOLVE_OPTIONS = {
                    ...CJS_RESOLVE_OPTIONS,
                    alias: false
                };
                const ESM_RESOLVE_OPTIONS = {
                    ..._webpackConfig.NODE_ESM_RESOLVE_OPTIONS,
                    fullySpecified: undefined,
                    modules: undefined,
                    extensions: undefined
                };
                const BASE_ESM_RESOLVE_OPTIONS = {
                    ...ESM_RESOLVE_OPTIONS,
                    alias: false
                };
                const doResolve = async (request, parent, job, isEsmRequested)=>{
                    const context = _path.default.dirname(parent);
                    // When in esm externals mode, and using import, we resolve with
                    // ESM resolving options.
                    const { res  } = await (0, _webpackConfig).resolveExternal(this.appDir, this.esmExternals, context, request, isEsmRequested, !!this.appDirEnabled, (options)=>(_, resRequest)=>{
                            return getResolve(options)(parent, resRequest, job);
                        }, undefined, undefined, ESM_RESOLVE_OPTIONS, CJS_RESOLVE_OPTIONS, BASE_ESM_RESOLVE_OPTIONS, BASE_CJS_RESOLVE_OPTIONS);
                    if (!res) {
                        throw new Error(`failed to resolve ${request} from ${parent}`);
                    }
                    return res.replace(/\0/g, "");
                };
                this.tapfinishModules(compilation, traceEntrypointsPluginSpan, doResolve, readlink, stat);
            });
        });
        if (this.turbotrace) {
            compiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, async (compilation)=>{
                const compilationSpan = _profilingPlugin.spans.get(compilation) || _profilingPlugin.spans.get(compiler);
                const traceEntrypointsPluginSpan = compilationSpan.traceChild("next-trace-entrypoint-plugin");
                const turbotraceAfterEmitSpan = traceEntrypointsPluginSpan.traceChild("after-emit-turbo-trace");
                await turbotraceAfterEmitSpan.traceAsyncFn(async ()=>{
                    let binding = await (0, _swc).loadBindings();
                    if (!(binding == null ? void 0 : binding.isWasm) && typeof binding.turbo.startTrace === "function") {
                        var ref;
                        const maxFiles = ((ref = this.turbotrace) == null ? void 0 : ref.maxFiles) ?? TURBO_TRACE_DEFAULT_MAX_FILES;
                        let chunks = [
                            ...this.chunksToTrace
                        ];
                        let restChunks = chunks.length > maxFiles ? chunks.splice(maxFiles) : [];
                        while(chunks.length){
                            var ref6, ref7, ref8, ref9;
                            await binding.turbo.startTrace({
                                action: "annotate",
                                input: chunks,
                                contextDirectory: ((ref6 = this.turbotrace) == null ? void 0 : ref6.contextDirectory) ?? this.tracingRoot,
                                processCwd: ((ref7 = this.turbotrace) == null ? void 0 : ref7.processCwd) ?? this.appDir,
                                showAll: (ref8 = this.turbotrace) == null ? void 0 : ref8.logAll,
                                logLevel: (ref9 = this.turbotrace) == null ? void 0 : ref9.logLevel
                            });
                            chunks = restChunks;
                            if (restChunks.length) {
                                restChunks = chunks.length > maxFiles ? chunks.splice(maxFiles) : [];
                            }
                        }
                        if (this.turbotraceOutputPath && this.turbotraceFiles) {
                            const existedNftFile = await _fs.default.promises.readFile(this.turbotraceOutputPath, "utf8").then((content)=>JSON.parse(content)).catch(()=>({
                                    version: _constants.TRACE_OUTPUT_VERSION,
                                    files: []
                                }));
                            console.log(this.turbotraceOutputPath, this.turbotraceFiles);
                            existedNftFile.files.push(...this.turbotraceFiles);
                            const filesSet = new Set(existedNftFile.files);
                            existedNftFile.files = [
                                ...filesSet
                            ];
                            _fs.default.promises.writeFile(this.turbotraceOutputPath, JSON.stringify(existedNftFile));
                        }
                    }
                });
            });
        }
    }
}
exports.TraceEntryPointsPlugin = TraceEntryPointsPlugin;

//# sourceMappingURL=next-trace-entrypoints-plugin.js.map