'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('node:fs');
var path = require('node:path');
var node_url = require('node:url');
var debug = require('debug');
var enhancedResolve = require('enhanced-resolve');
var require$$0 = require('crypto');
var getTsconfig = require('get-tsconfig');
var isCore = require('is-core-module');
var isGlob = require('is-glob');
var synckit = require('synckit');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var debug__default = /*#__PURE__*/_interopDefaultLegacy(debug);
var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var isCore__default = /*#__PURE__*/_interopDefaultLegacy(isCore);
var isGlob__default = /*#__PURE__*/_interopDefaultLegacy(isGlob);

/**
 * utilities for hashing config objects.
 * basically iteratively updates hash with a JSON-like format
 */
const createHash = require$$0__default["default"].createHash;
const stringify = JSON.stringify;
function hashify(value, hash) {
    if (!hash)
        hash = createHash('sha256');
    if (Array.isArray(value)) {
        hashArray(value, hash);
    } else if (value instanceof Object) {
        hashObject(value, hash);
    } else {
        hash.update(stringify(value) || 'undefined');
    }
    return hash;
}
function hashArray(array, hash) {
    if (!hash)
        hash = createHash('sha256');
    hash.update('[');
    for (let i = 0; i < array.length; i++) {
        hashify(array[i], hash);
        hash.update(',');
    }
    hash.update(']');
    return hash;
}
hashify.array = hashArray;
function hashObject(object, hash) {
    if (!hash)
        hash = createHash('sha256');
    hash.update('{');
    Object.keys(object).sort().forEach(key => {
        hash.update(stringify(key));
        hash.update(':');
        hashify(object[key], hash);
        hash.update(',');
    });
    hash.update('}');
    return hash;
}
hashify.object = hashObject;
var hashObject_1 = hashObject;

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const import_meta = {};
const IMPORTER_NAME = "eslint-import-resolver-typescript";
const log = debug__default["default"](IMPORTER_NAME);
const _dirname = typeof __dirname === "undefined" ? path__default["default"].dirname(node_url.fileURLToPath(import_meta.url)) : __dirname;
const globSync = synckit.createSyncFn(
  path__default["default"].resolve(_dirname, "worker.mjs")
);
const defaultConditionNames = [
  "types",
  "import",
  "esm2020",
  "es2020",
  "es2015",
  "require",
  "node",
  "node-addons",
  "browser",
  "default"
];
const defaultExtensions = [
  ".ts",
  ".tsx",
  ".d.ts",
  ".js",
  ".jsx",
  ".json",
  ".node"
];
const defaultExtensionAlias = {
  ".js": [
    ".ts",
    ".tsx",
    ".d.ts",
    ".js"
  ],
  ".jsx": [".tsx", ".d.ts", ".jsx"],
  ".cjs": [".cts", ".d.cts", ".cjs"],
  ".mjs": [".mts", ".d.mts", ".mjs"]
};
const defaultMainFields = [
  "types",
  "typings",
  "fesm2020",
  "fesm2015",
  "esm2020",
  "es2020",
  "module",
  "jsnext:main",
  "main"
];
const interfaceVersion = 2;
const fileSystem = fs__default["default"];
const JS_EXT_PATTERN = /\.(?:[cm]js|jsx?)$/;
const RELATIVE_PATH_PATTERN = /^\.{1,2}(?:\/.*)?$/;
let previousOptionsHash;
let optionsHash;
let cachedOptions;
let mappersCachedOptions;
let mappers;
let resolverCachedOptions;
let resolver;
const digestHashObject = (value) => hashObject_1(value != null ? value : {}).digest("hex");
function resolve(source, file, options) {
  var _a, _b, _c, _d;
  if (!cachedOptions || previousOptionsHash !== (optionsHash = digestHashObject(options))) {
    previousOptionsHash = optionsHash;
    cachedOptions = __spreadProps(__spreadValues({}, options), {
      conditionNames: (_a = options == null ? void 0 : options.conditionNames) != null ? _a : defaultConditionNames,
      extensions: (_b = options == null ? void 0 : options.extensions) != null ? _b : defaultExtensions,
      extensionAlias: (_c = options == null ? void 0 : options.extensionAlias) != null ? _c : defaultExtensionAlias,
      mainFields: (_d = options == null ? void 0 : options.mainFields) != null ? _d : defaultMainFields,
      fileSystem: new enhancedResolve.CachedInputFileSystem(fileSystem, 5 * 1e3),
      useSyncFileSystemCalls: true
    });
  }
  if (!resolver || resolverCachedOptions !== cachedOptions) {
    resolver = enhancedResolve.ResolverFactory.createResolver(cachedOptions);
    resolverCachedOptions = cachedOptions;
  }
  log("looking for:", source);
  source = removeQuerystring(source);
  if (isCore__default["default"](source)) {
    log("matched core:", source);
    return {
      found: true,
      path: null
    };
  }
  initMappers(cachedOptions);
  const mappedPath = getMappedPath(source, file, cachedOptions.extensions, true);
  if (mappedPath) {
    log("matched ts path:", mappedPath);
  }
  let foundNodePath;
  try {
    foundNodePath = resolver.resolveSync(
      {},
      path__default["default"].dirname(path__default["default"].resolve(file)),
      mappedPath != null ? mappedPath : source
    ) || null;
  } catch (e) {
    foundNodePath = null;
  }
  if ((JS_EXT_PATTERN.test(foundNodePath) || cachedOptions.alwaysTryTypes && !foundNodePath) && !/^@types[/\\]/.test(source) && !path__default["default"].isAbsolute(source) && !source.startsWith(".")) {
    const definitelyTyped = resolve(
      "@types" + path__default["default"].sep + mangleScopedPackage(source),
      file,
      options
    );
    if (definitelyTyped.found) {
      return definitelyTyped;
    }
  }
  if (foundNodePath) {
    log("matched node path:", foundNodePath);
    return {
      found: true,
      path: foundNodePath
    };
  }
  log("didn't find ", source);
  return {
    found: false
  };
}
function removeQuerystring(id) {
  const querystringIndex = id.lastIndexOf("?");
  if (querystringIndex >= 0) {
    return id.slice(0, querystringIndex);
  }
  return id;
}
const isFile = (path2) => {
  var _a;
  try {
    return !!(path2 && ((_a = fs__default["default"].statSync(path2, { throwIfNoEntry: false })) == null ? void 0 : _a.isFile()));
  } catch (e) {
    return false;
  }
};
const isModule = (modulePath) => {
  return !!modulePath && isFile(path__default["default"].resolve(modulePath, "package.json"));
};
function getMappedPath(source, file, extensions = defaultExtensions, retry) {
  const originalExtensions = extensions;
  extensions = ["", ...extensions];
  let paths = [];
  if (RELATIVE_PATH_PATTERN.test(source)) {
    const resolved = path__default["default"].resolve(path__default["default"].dirname(file), source);
    if (isFile(resolved)) {
      paths = [resolved];
    }
  } else {
    paths = mappers.map(
      (mapper) => mapper == null ? void 0 : mapper(source).map((item) => [
        ...extensions.map((ext) => `${item}${ext}`),
        ...originalExtensions.map((ext) => `${item}/index${ext}`)
      ])
    ).flat(2).filter((mappedPath) => isFile(mappedPath) || isModule(mappedPath));
  }
  if (retry && paths.length === 0) {
    const isJs = JS_EXT_PATTERN.test(source);
    if (isJs) {
      const jsExt = path__default["default"].extname(source);
      const tsExt = jsExt.replace("js", "ts");
      const basename = source.replace(JS_EXT_PATTERN, "");
      const resolved = getMappedPath(basename + tsExt, file) || getMappedPath(
        basename + ".d" + (tsExt === ".tsx" ? ".ts" : tsExt),
        file
      );
      if (resolved) {
        return resolved;
      }
    }
    for (const ext of extensions) {
      const resolved = (isJs ? null : getMappedPath(source + ext, file)) || getMappedPath(source + `/index${ext}`, file);
      if (resolved) {
        return resolved;
      }
    }
  }
  if (paths.length > 1) {
    log("found multiple matching ts paths:", paths);
  }
  return paths[0];
}
function initMappers(options) {
  if (mappers && mappersCachedOptions === options) {
    return;
  }
  const configPaths = typeof options.project === "string" ? [options.project] : Array.isArray(options.project) ? options.project : [process.cwd()];
  const ignore = ["!**/node_modules/**"];
  const projectPaths = [
    .../* @__PURE__ */ new Set([
      ...configPaths.filter((path2) => !isGlob__default["default"](path2)),
      ...globSync([...configPaths.filter((path2) => isGlob__default["default"](path2)), ...ignore])
    ])
  ];
  mappers = projectPaths.map((projectPath) => {
    let tsconfigResult;
    if (isFile(projectPath)) {
      const { dir, base } = path__default["default"].parse(projectPath);
      tsconfigResult = getTsconfig.getTsconfig(dir, base);
    } else {
      tsconfigResult = getTsconfig.getTsconfig(projectPath);
    }
    return tsconfigResult && getTsconfig.createPathsMatcher(tsconfigResult);
  });
  mappersCachedOptions = options;
}
function mangleScopedPackage(moduleName) {
  if (moduleName.startsWith("@")) {
    const replaceSlash = moduleName.replace(path__default["default"].sep, "__");
    if (replaceSlash !== moduleName) {
      return replaceSlash.slice(1);
    }
  }
  return moduleName;
}

exports.defaultConditionNames = defaultConditionNames;
exports.defaultExtensionAlias = defaultExtensionAlias;
exports.defaultExtensions = defaultExtensions;
exports.defaultMainFields = defaultMainFields;
exports.globSync = globSync;
exports.interfaceVersion = interfaceVersion;
exports.resolve = resolve;
