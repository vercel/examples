import { notImplemented, notImplementedClass } from "../_internal/utils.mjs";
export const _cache = Object.create(null);
export const _extensions = {
	".js": /* @__PURE__ */ notImplemented("module.require.extensions['.js']"),
	".json": /* @__PURE__ */ notImplemented("module.require.extensions['.json']"),
	".node": /* @__PURE__ */ notImplemented("module.require.extensions['.node']")
};
export const createRequire = function(_filename) {
	return Object.assign(/* @__PURE__ */ notImplemented("module.require"), {
		resolve: Object.assign(/* @__PURE__ */ notImplemented("module.require.resolve"), { paths: /* @__PURE__ */ notImplemented("module.require.resolve.paths") }),
		cache: Object.create(null),
		extensions: _extensions,
		main: undefined
	});
};
export const getCompileCacheDir = function() {
	return undefined;
};
export const enableCompileCache = function(_cacheDir) {
	return {
		status: 0,
		message: "not implemented"
	};
};
export const constants = Object.freeze({ compileCacheStatus: Object.freeze({
	FAILED: 0,
	ENABLED: 1,
	ALREADY_ENABLED: 2,
	DISABLED: 3
}) });
// prettier-ignore
export const builtinModules = [
	"_http_agent",
	"_http_client",
	"_http_common",
	"_http_incoming",
	"_http_outgoing",
	"_http_server",
	"_stream_duplex",
	"_stream_passthrough",
	"_stream_readable",
	"_stream_transform",
	"_stream_wrap",
	"_stream_writable",
	"_tls_common",
	"_tls_wrap",
	"assert",
	"assert/strict",
	"async_hooks",
	"buffer",
	"child_process",
	"cluster",
	"console",
	"constants",
	"crypto",
	"dgram",
	"diagnostics_channel",
	"dns",
	"dns/promises",
	"domain",
	"events",
	"fs",
	"fs/promises",
	"http",
	"http2",
	"https",
	"inspector",
	"inspector/promises",
	"module",
	"net",
	"os",
	"path",
	"path/posix",
	"path/win32",
	"perf_hooks",
	"process",
	"punycode",
	"querystring",
	"readline",
	"readline/promises",
	"repl",
	"stream",
	"stream/consumers",
	"stream/promises",
	"stream/web",
	"string_decoder",
	"sys",
	"timers",
	"timers/promises",
	"tls",
	"trace_events",
	"tty",
	"url",
	"util",
	"util/types",
	"v8",
	"vm",
	"wasi",
	"worker_threads",
	"zlib"
];
export const isBuiltin = function(id) {
	return id.startsWith("node:") || builtinModules.includes(id);
};
export const runMain = /* @__PURE__ */ notImplemented("module.runMain");
export const register = /* @__PURE__ */ notImplemented("module.register");
export const syncBuiltinESMExports = function() {
	return [];
};
export const findSourceMap = function(path, error) {
	return undefined;
};
export const flushCompileCache = function flushCompileCache() {
	/* silent noop */
};
export const wrap = function(source) {
	return `(function (exports, require, module, __filename, __dirname) { ${source}\n});`;
};
export const wrapper = ["(function (exports, require, module, __filename, __dirname) { ", "\n});"];
export const stripTypeScriptTypes = /* @__PURE__ */ notImplemented("module.stripTypeScriptTypes");
export const SourceMap = /* @__PURE__ */ notImplementedClass("module.SourceMap");
export const _debug = console.debug;
export const _findPath = /* @__PURE__ */ notImplemented("module._findPath");
export const _initPaths = /* @__PURE__ */ notImplemented("module._initPaths");
export const _load = /* @__PURE__ */ notImplemented("module._load");
export const _nodeModulePaths = /* @__PURE__ */ notImplemented("module._nodeModulePaths");
export const _preloadModules = /* @__PURE__ */ notImplemented("module._preloadModules");
export const _resolveFilename = /* @__PURE__ */ notImplemented("module._resolveFilename");
export const _resolveLookupPaths = /* @__PURE__ */ notImplemented("module._resolveLookupPaths");
export const _stat = /* @__PURE__ */ notImplemented("module._stat");
export const _readPackage = /* @__PURE__ */ notImplemented("module._readPackage");
export const findPackageJSON = /* @__PURE__ */ notImplemented("module.findPackageJSON");
export const getSourceMapsSupport = /* @__PURE__ */ notImplemented("module.getSourceMapsSupport");
export const setSourceMapsSupport = /* @__PURE__ */ notImplemented("module.setSourceMapsSupport");
export const _pathCache = Object.create(null);
export const globalPaths = ["node_modules"];
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
export const Module = {
	get Module() {
		return Module;
	},
	SourceMap,
	_cache,
	_extensions,
	_debug,
	_pathCache,
	_findPath,
	_initPaths,
	_load,
	_nodeModulePaths,
	_preloadModules,
	_resolveFilename,
	_resolveLookupPaths,
	_stat,
	_readPackage,
	builtinModules,
	constants,
	createRequire,
	enableCompileCache,
	findSourceMap,
	getCompileCacheDir,
	globalPaths,
	isBuiltin,
	register,
	runMain,
	syncBuiltinESMExports,
	wrap,
	wrapper,
	flushCompileCache,
	stripTypeScriptTypes,
	findPackageJSON,
	getSourceMapsSupport,
	setSourceMapsSupport
};
export default Module;
