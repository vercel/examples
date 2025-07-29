// https://nodejs.org/api/module.html
import type nodeModule from "node:module";
export declare const _cache: unknown;
export declare const _extensions: {};
export declare const createRequire: unknown;
export declare const getCompileCacheDir: typeof nodeModule.getCompileCacheDir;
export declare const enableCompileCache: typeof nodeModule.enableCompileCache;
export declare const constants: typeof nodeModule.constants;
// prettier-ignore
export declare const builtinModules: typeof nodeModule.builtinModules;
export declare const isBuiltin: typeof nodeModule.isBuiltin;
export declare const runMain: typeof nodeModule.runMain;
export declare const register: typeof nodeModule.register;
export declare const syncBuiltinESMExports: typeof nodeModule.syncBuiltinESMExports;
export declare const findSourceMap: typeof nodeModule.findSourceMap;
export declare const flushCompileCache: typeof nodeModule.flushCompileCache;
export declare const wrap: typeof nodeModule.wrap;
export declare const wrapper: unknown;
export declare const stripTypeScriptTypes: typeof nodeModule.stripTypeScriptTypes;
export declare const SourceMap: typeof nodeModule.SourceMap;
export declare const _debug: unknown;
export declare const _findPath: unknown;
export declare const _initPaths: unknown;
export declare const _load: unknown;
export declare const _nodeModulePaths: unknown;
export declare const _preloadModules: unknown;
export declare const _resolveFilename: unknown;
export declare const _resolveLookupPaths: unknown;
export declare const _stat: unknown;
export declare const _readPackage: unknown;
export declare const findPackageJSON: unknown;
export declare const getSourceMapsSupport: unknown;
export declare const setSourceMapsSupport: unknown;
export declare const _pathCache: unknown;
export declare const globalPaths: unknown;
// export class _Module implements NodeJS.Module {
//   require: NodeJS.Require;
//   id: string;
//   filename: string;
//   exports = Object.create(null);
//   parent = undefined;
//   loaded = true;
//   children = [];
//   isPreloading: boolean = false;
//   path: string = "/";
//   paths: string[] = [];
//   constructor(id = "index.js") {
//     this.id = id;
//     this.filename = id;
//     this.require = createRequire(id);
//   }
// }
export declare const Module: {};
export default Module;
