import consola, { consola as consola$1 } from 'consola';
import { createHooks, createDebugger } from 'hookable';
import { runtimeDir, pkgDir } from 'nitropack/runtime/meta';
export { runtimeDependencies as nitroRuntimeDependencies } from 'nitropack/runtime/meta';
import { resolve, join as join$1, relative, normalize, isAbsolute, dirname } from 'pathe';
import { createUnimport, toExports } from 'unimport';
import { watchConfig, loadConfig } from 'c12';
import { resolveCompatibilityDatesFromEnv, formatDate, resolveCompatibilityDates, formatCompatibilityDate } from 'compatx';
import { klona } from 'klona/full';
import { isDebug, isTest, nodeMajorVersion, provider, isCI } from 'std-env';
import { existsSync, promises } from 'node:fs';
import defu$1, { defu } from 'defu';
import { withLeadingSlash, withoutTrailingSlash, withTrailingSlash, withBase, parseURL, joinURL, withoutBase } from 'ufo';
import { colors } from 'consola/utils';
import { join, resolve as resolve$1, dirname as dirname$1 } from 'node:path';
import escapeRE from 'escape-string-regexp';
import { resolveModuleExportNames, parseNodeModulePath, lookupNodeModuleSubpath } from 'mlly';
import { resolveNitroPath, isDirectory, writeFile, prettyPath } from 'nitropack/kit';
export { defineNitroPreset } from 'nitropack/kit';
import { findWorkspaceDir } from 'pkg-types';
import { createJiti } from 'jiti';
import { globby } from 'globby';
import fsp, { readFile, rm, writeFile as writeFile$1 } from 'node:fs/promises';
import { ofetch } from 'ofetch';
import { klona as klona$1 } from 'klona';
import { createStorage as createStorage$1, builtinDrivers } from 'unstorage';
import { pathToFileURL } from 'node:url';
import mime from 'mime';
import { toRouteMatcher, createRouter } from 'radix3';
import { getRollupConfig } from 'nitropack/rollup';
import { watch } from 'chokidar';
import { debounce } from 'perfect-debounce';
import * as rollup from 'rollup';
import { upperFirst } from 'scule';
import { genTypeImport } from 'knitwork';
import { resolveModulePath } from 'exsolve';
import { resolveAlias } from 'pathe/utils';
import { generateTypes, resolveSchema } from 'untyped';
import { version } from 'nitropack/meta';
import { gzipSize } from 'gzip-size';
import prettyBytes from 'pretty-bytes';
import { getProperty } from 'dot-prop';
import zlib from 'node:zlib';
import { walk, parse } from 'ultrahtml';
import { createError, getRequestURL, getRequestHeader, getResponseHeader, getRequestHeaders, setResponseHeaders, setResponseStatus, send, eventHandler, getRequestIP, toNodeListener, createApp, fromNodeMiddleware } from 'h3';
import { Worker } from 'node:worker_threads';
import { createProxyServer } from 'httpxy';
import { ErrorParser } from 'youch-core';
import { Youch } from 'youch';
import { SourceMapConsumer } from 'source-map';
import serveStatic from 'serve-static';
import { listen } from 'listhen';
import { servePlaceholder } from 'serve-placeholder';

const NitroDefaults = {
  // General
  debug: isDebug,
  timing: isDebug,
  logLevel: isTest ? 1 : 3,
  runtimeConfig: { app: {}, nitro: {} },
  appConfig: {},
  appConfigFiles: [],
  // Dirs
  scanDirs: [],
  buildDir: ".nitro",
  output: {
    dir: "{{ rootDir }}/.output",
    serverDir: "{{ output.dir }}/server",
    publicDir: "{{ output.dir }}/public"
  },
  // Features
  experimental: {},
  future: {},
  storage: {},
  devStorage: {},
  bundledStorage: [],
  publicAssets: [],
  serverAssets: [],
  plugins: [],
  tasks: {},
  scheduledTasks: {},
  imports: {
    exclude: [],
    dirs: [],
    presets: [],
    virtualImports: ["#imports"]
  },
  virtual: {},
  compressPublicAssets: false,
  ignore: [],
  // Dev
  dev: false,
  devServer: { watch: [] },
  watchOptions: { ignoreInitial: true },
  devProxy: {},
  // Logging
  logging: {
    compressedSizes: true,
    buildSuccess: true
  },
  // Routing
  baseURL: process.env.NITRO_APP_BASE_URL || "/",
  handlers: [],
  devHandlers: [],
  errorHandler: void 0,
  routeRules: {},
  prerender: {
    autoSubfolderIndex: true,
    concurrency: 1,
    interval: 0,
    retry: 3,
    retryDelay: 500,
    failOnError: false,
    crawlLinks: false,
    ignore: [],
    routes: []
  },
  // Rollup
  analyze: false,
  moduleSideEffects: [
    "unenv/polyfill/",
    "node-fetch-native/polyfill",
    "node-fetch-native/dist/polyfill",
    resolve(runtimeDir, "polyfill/")
  ],
  replace: {},
  node: true,
  sourceMap: true,
  esbuild: {
    options: {
      jsxFactory: "h",
      jsxFragment: "Fragment"
    }
  },
  // Advanced
  typescript: {
    strict: false,
    generateTsConfig: true,
    generateRuntimeConfigTypes: true,
    tsconfigPath: "types/tsconfig.json",
    internalPaths: false,
    tsConfig: {}
  },
  nodeModulesDirs: [],
  hooks: {},
  commands: {},
  // Framework
  framework: {
    name: "nitro",
    version: ""
  }
};

async function resolveAssetsOptions(options) {
  for (const publicAsset of options.publicAssets) {
    publicAsset.dir = resolve(options.srcDir, publicAsset.dir);
    publicAsset.baseURL = withLeadingSlash(
      withoutTrailingSlash(publicAsset.baseURL || "/")
    );
  }
  for (const dir of options.scanDirs) {
    const publicDir = resolve(dir, "public");
    if (!existsSync(publicDir)) {
      continue;
    }
    if (options.publicAssets.some((asset) => asset.dir === publicDir)) {
      continue;
    }
    options.publicAssets.push({ dir: publicDir });
  }
  for (const serverAsset of options.serverAssets) {
    serverAsset.dir = resolve(options.srcDir, serverAsset.dir);
  }
  options.serverAssets.push({
    baseName: "server",
    dir: resolve(options.srcDir, "assets")
  });
  for (const asset of options.publicAssets) {
    asset.baseURL = asset.baseURL || "/";
    const isTopLevel = asset.baseURL === "/";
    asset.fallthrough = asset.fallthrough ?? isTopLevel;
    const routeRule = options.routeRules[asset.baseURL + "/**"];
    asset.maxAge = routeRule?.cache?.maxAge ?? asset.maxAge ?? 0;
    if (asset.maxAge && !asset.fallthrough) {
      options.routeRules[asset.baseURL + "/**"] = defu(routeRule, {
        headers: {
          "cache-control": `public, max-age=${asset.maxAge}, immutable`
        }
      });
    }
  }
}

const fallbackCompatibilityDate = "2024-04-03";
let _fallbackInfoShown = false;
async function resolveCompatibilityOptions(options) {
  options.compatibilityDate = resolveCompatibilityDatesFromEnv(
    options.compatibilityDate
  );
  if (!options.compatibilityDate.default) {
    const consola$1 = consola.withTag("nitro");
    if (!_fallbackInfoShown && !isTest && options.preset !== "nitro-prerender") {
      consola$1.warn(
        [
          /* WARN */
          `Please add \`compatibilityDate: '${formatDate("latest")}'\` to the config file. Using \`${fallbackCompatibilityDate}\` as fallback.`,
          `       More info: ${colors.underline("https://nitro.build/deploy#compatibility-date")}`
        ].join("\n")
      );
      _fallbackInfoShown = true;
    }
  }
}

async function resolveDatabaseOptions(options) {
  if (options.experimental.database && options.imports) {
    options.imports.presets.push({
      from: "nitropack/runtime/internal/database",
      imports: ["useDatabase"]
    });
    if (options.dev && !options.database && !options.devDatabase) {
      options.devDatabase = {
        default: {
          connector: "sqlite",
          options: {
            cwd: options.rootDir
          }
        }
      };
    } else if (options.node && !options.database) {
      options.database = {
        default: {
          connector: "sqlite",
          options: {}
        }
      };
    }
  }
}

async function resolveExportConditionsOptions(options) {
  options.exportConditions = _resolveExportConditions(
    options.exportConditions || [],
    { dev: options.dev, node: options.node, wasm: options.experimental.wasm }
  );
}
function _resolveExportConditions(conditions, opts) {
  const resolvedConditions = [];
  resolvedConditions.push(opts.dev ? "development" : "production");
  resolvedConditions.push(...conditions);
  if (opts.node) {
    resolvedConditions.push("node");
  } else {
    resolvedConditions.push(
      "wintercg",
      "worker",
      "web",
      "browser",
      "workerd",
      "edge-light",
      "netlify",
      "edge-routine",
      "deno"
    );
  }
  if (opts.wasm) {
    resolvedConditions.push("wasm", "unwasm");
  }
  resolvedConditions.push("import", "default");
  return resolvedConditions.filter(
    (c, i) => resolvedConditions.indexOf(c) === i
  );
}

async function resolveFetchOptions(options) {
  if (options.experimental.nodeFetchCompat === void 0) {
    options.experimental.nodeFetchCompat = (nodeMajorVersion || 0) < 18;
    if (options.experimental.nodeFetchCompat && provider !== "stackblitz") {
      consola.warn(
        "Node fetch compatibility is enabled. Please consider upgrading to Node.js >= 18."
      );
    }
  }
  if (!options.experimental.nodeFetchCompat) {
    options.alias = {
      "node-fetch-native/polyfill": join(runtimeDir, "internal/empty"),
      "node-fetch-native/native": "node-fetch-native/native",
      "node-fetch-native": "node-fetch-native/native",
      ...options.alias
    };
  }
}

async function resolveImportsOptions(options) {
  if (options.imports === false) {
    return;
  }
  options.imports.presets ??= [];
  options.imports.presets.push(...getNitroImportsPreset());
  const h3Exports = await resolveModuleExportNames("h3", {
    url: import.meta.url
  });
  options.imports.presets ??= [];
  options.imports.presets.push({
    from: "h3",
    imports: h3Exports.filter((n) => !/^[A-Z]/.test(n) && n !== "use")
  });
  options.imports.dirs ??= [];
  options.imports.dirs.push(
    ...options.scanDirs.map((dir) => join$1(dir, "utils/**/*"))
  );
  if (Array.isArray(options.imports.exclude) && options.imports.exclude.length === 0) {
    options.imports.exclude.push(/[/\\]\.git[/\\]/);
    options.imports.exclude.push(options.buildDir);
    const scanDirsInNodeModules = options.scanDirs.map((dir) => dir.match(/(?<=\/)node_modules\/(.+)$/)?.[1]).filter(Boolean);
    options.imports.exclude.push(
      scanDirsInNodeModules.length > 0 ? new RegExp(
        `node_modules\\/(?!${scanDirsInNodeModules.map((dir) => escapeRE(dir)).join("|")})`
      ) : /[/\\]node_modules[/\\]/
    );
  }
}
function getNitroImportsPreset() {
  return [
    {
      from: "nitropack/runtime/internal/app",
      imports: ["useNitroApp"]
    },
    {
      from: "nitropack/runtime/internal/config",
      imports: ["useRuntimeConfig", "useAppConfig"]
    },
    {
      from: "nitropack/runtime/internal/plugin",
      imports: ["defineNitroPlugin", "nitroPlugin"]
    },
    {
      from: "nitropack/runtime/internal/cache",
      imports: [
        "defineCachedFunction",
        "defineCachedEventHandler",
        "cachedFunction",
        "cachedEventHandler"
      ]
    },
    {
      from: "nitropack/runtime/internal/storage",
      imports: ["useStorage"]
    },
    {
      from: "nitropack/runtime/internal/renderer",
      imports: ["defineRenderHandler"]
    },
    {
      from: "nitropack/runtime/internal/meta",
      imports: ["defineRouteMeta"]
    },
    {
      from: "nitropack/runtime/internal/route-rules",
      imports: ["getRouteRules"]
    },
    {
      from: "nitropack/runtime/internal/context",
      imports: ["useEvent"]
    },
    {
      from: "nitropack/runtime/internal/task",
      imports: ["defineTask", "runTask"]
    },
    {
      from: "nitropack/runtime/internal/error/utils",
      imports: ["defineNitroErrorHandler"]
    }
  ];
}

async function resolveOpenAPIOptions(options) {
  if (!options.experimental.openAPI) {
    return;
  }
  if (!options.dev && !options.openAPI?.production) {
    return;
  }
  const shouldPrerender = !options.dev && options.openAPI?.production === "prerender";
  const handlersEnv = shouldPrerender ? "prerender" : "";
  const prerenderRoutes = [];
  const jsonRoute = options.openAPI?.route || "/_openapi.json";
  prerenderRoutes.push(jsonRoute);
  options.handlers.push({
    route: jsonRoute,
    env: handlersEnv,
    handler: join$1(runtimeDir, "internal/routes/openapi")
  });
  if (options.openAPI?.ui?.scalar !== false) {
    const scalarRoute = options.openAPI?.ui?.scalar?.route || "/_scalar";
    prerenderRoutes.push(scalarRoute);
    options.handlers.push({
      route: options.openAPI?.ui?.scalar?.route || "/_scalar",
      env: handlersEnv,
      handler: join$1(runtimeDir, "internal/routes/scalar")
    });
  }
  if (options.openAPI?.ui?.swagger !== false) {
    const swaggerRoute = options.openAPI?.ui?.swagger?.route || "/_swagger";
    prerenderRoutes.push(swaggerRoute);
    options.handlers.push({
      route: swaggerRoute,
      env: handlersEnv,
      handler: join$1(runtimeDir, "internal/routes/swagger")
    });
  }
  if (shouldPrerender) {
    options.prerender ??= {};
    options.prerender.routes ??= [];
    options.prerender.routes.push(...prerenderRoutes);
  }
}

async function resolvePathOptions(options) {
  options.rootDir = resolve(options.rootDir || ".");
  options.workspaceDir ||= await findWorkspaceDir(options.rootDir).catch(
    () => options.rootDir
  );
  for (const key of ["srcDir", "buildDir"]) {
    options[key] = resolve(options.rootDir, options[key] || ".");
  }
  options.alias = {
    ...options.alias,
    "~/": join$1(options.srcDir, "/"),
    "@/": join$1(options.srcDir, "/"),
    "~~/": join$1(options.rootDir, "/"),
    "@@/": join$1(options.rootDir, "/")
  };
  if (!options.static && !options.entry) {
    throw new Error(
      `Nitro entry is missing! Is "${options.preset}" preset correct?`
    );
  }
  if (options.entry) {
    options.entry = resolveNitroPath(options.entry, options);
  }
  options.output.dir = resolveNitroPath(
    options.output.dir || NitroDefaults.output.dir,
    options,
    options.rootDir
  );
  options.output.publicDir = resolveNitroPath(
    options.output.publicDir || NitroDefaults.output.publicDir,
    options,
    options.rootDir
  );
  options.output.serverDir = resolveNitroPath(
    options.output.serverDir || NitroDefaults.output.serverDir,
    options,
    options.rootDir
  );
  options.nodeModulesDirs.push(resolve(options.workspaceDir, "node_modules"));
  options.nodeModulesDirs.push(resolve(options.rootDir, "node_modules"));
  options.nodeModulesDirs.push(resolve(pkgDir, "node_modules"));
  options.nodeModulesDirs.push(resolve(pkgDir, ".."));
  options.nodeModulesDirs = [
    ...new Set(
      // Adding trailing slash to optimize resolve performance (path is explicitly a dir)
      options.nodeModulesDirs.map((dir) => resolve(options.rootDir, dir) + "/")
    )
  ];
  options.plugins = options.plugins.map((p) => resolveNitroPath(p, options));
  options.scanDirs.unshift(options.srcDir);
  options.scanDirs = options.scanDirs.map(
    (dir) => resolve(options.srcDir, dir)
  );
  options.scanDirs = [...new Set(options.scanDirs)];
  options.appConfigFiles ??= [];
  options.appConfigFiles = options.appConfigFiles.map((file) => _tryResolve(resolveNitroPath(file, options))).filter(Boolean);
  for (const dir of options.scanDirs) {
    const configFile = _tryResolve("app.config", dir);
    if (configFile && !options.appConfigFiles.includes(configFile)) {
      options.appConfigFiles.push(configFile);
    }
  }
}
function _tryResolve(path, base = ".", extensions = ["", ".js", ".ts", ".mjs", ".cjs", ".json"]) {
  path = resolve(base, path);
  if (existsSync(path)) {
    return path;
  }
  for (const ext of extensions) {
    const p = path + ext;
    if (existsSync(p)) {
      return p;
    }
  }
}

async function resolveRouteRulesOptions(options) {
  options.routeRules = defu(options.routeRules, options.routes || {});
  options.routeRules = normalizeRouteRules(options);
}
function normalizeRouteRules(config) {
  const normalizedRules = {};
  for (let path in config.routeRules) {
    const routeConfig = config.routeRules[path];
    path = withLeadingSlash(path);
    const routeRules = {
      ...routeConfig,
      redirect: void 0,
      proxy: void 0
    };
    if (routeConfig.redirect) {
      routeRules.redirect = {
        // @ts-ignore
        to: "/",
        statusCode: 307,
        ...typeof routeConfig.redirect === "string" ? { to: routeConfig.redirect } : routeConfig.redirect
      };
      if (path.endsWith("/**")) {
        routeRules.redirect._redirectStripBase = path.slice(0, -3);
      }
    }
    if (routeConfig.proxy) {
      routeRules.proxy = typeof routeConfig.proxy === "string" ? { to: routeConfig.proxy } : routeConfig.proxy;
      if (path.endsWith("/**")) {
        routeRules.proxy._proxyStripBase = path.slice(0, -3);
      }
    }
    if (routeConfig.cors) {
      routeRules.headers = {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "*",
        "access-control-allow-headers": "*",
        "access-control-max-age": "0",
        ...routeRules.headers
      };
    }
    if (routeConfig.swr) {
      routeRules.cache = routeRules.cache || {};
      routeRules.cache.swr = true;
      if (typeof routeConfig.swr === "number") {
        routeRules.cache.maxAge = routeConfig.swr;
      }
    }
    if (routeConfig.cache === false) {
      routeRules.cache = false;
    }
    normalizedRules[path] = routeRules;
  }
  return normalizedRules;
}

async function resolveRuntimeConfigOptions(options) {
  options.runtimeConfig = normalizeRuntimeConfig(options);
}
function normalizeRuntimeConfig(config) {
  provideFallbackValues(config.runtimeConfig || {});
  const runtimeConfig = defu$1(
    config.runtimeConfig,
    {
      app: {
        baseURL: config.baseURL
      },
      nitro: {
        envExpansion: config.experimental?.envExpansion,
        openAPI: config.openAPI
      }
    }
  );
  runtimeConfig.nitro.routeRules = config.routeRules;
  checkSerializableRuntimeConfig(runtimeConfig);
  return runtimeConfig;
}
function provideFallbackValues(obj) {
  for (const key in obj) {
    if (obj[key] === void 0 || obj[key] === null) {
      obj[key] = "";
    } else if (typeof obj[key] === "object") {
      provideFallbackValues(obj[key]);
    }
  }
}
function checkSerializableRuntimeConfig(obj, path = []) {
  if (isPrimitiveValue(obj)) {
    return;
  }
  for (const key in obj) {
    const value = obj[key];
    if (value === null || value === void 0 || isPrimitiveValue(value)) {
      continue;
    }
    if (Array.isArray(value)) {
      for (const [index, item] of value.entries())
        checkSerializableRuntimeConfig(item, [...path, `${key}[${index}]`]);
    } else if (typeof value === "object" && value.constructor === Object && (!value.constructor?.name || value.constructor.name === "Object")) {
      checkSerializableRuntimeConfig(value, [...path, key]);
    } else {
      console.warn(
        `Runtime config option \`${[...path, key].join(".")}\` may not be able to be serialized.`
      );
    }
  }
}
function isPrimitiveValue(value) {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

async function resolveStorageOptions(options) {
  const fsMounts = {
    root: resolve(options.rootDir),
    src: resolve(options.srcDir),
    build: resolve(options.buildDir),
    cache: resolve(options.buildDir, "cache")
  };
  for (const p in fsMounts) {
    options.devStorage[p] = options.devStorage[p] || {
      driver: "fs",
      readOnly: p === "root" || p === "src",
      base: fsMounts[p]
    };
  }
  if (options.dev && options.storage.data === void 0 && options.devStorage.data === void 0) {
    options.devStorage.data = {
      driver: "fs",
      base: resolve(options.rootDir, ".data/kv")
    };
  } else if (options.node && options.storage.data === void 0) {
    options.storage.data = {
      driver: "fsLite",
      base: "./.data/kv"
    };
  }
}

async function resolveURLOptions(options) {
  options.baseURL = withLeadingSlash(withTrailingSlash(options.baseURL));
}

async function resolveErrorOptions(options) {
  if (!options.errorHandler) {
    options.errorHandler = [];
  } else if (!Array.isArray(options.errorHandler)) {
    options.errorHandler = [options.errorHandler];
  }
  options.errorHandler.push(
    join$1(runtimeDir, `internal/error/${options.dev ? "dev" : "prod"}`)
  );
}

const common = {
  meta: {
    name: "nitro-common",
    url: import.meta.url
  },
  alias: {
    "node-mock-http/_polyfill/events": "node:events",
    "node-mock-http/_polyfill/buffer": "node:buffer",
    "buffer/": "node:buffer",
    "buffer/index": "node:buffer",
    "buffer/index.js": "node:buffer",
    "string_decoder/": "node:string_decoder",
    "process/": "node:process"
  }
};
const nodeless = {
  meta: {
    name: "nitro-nodeless",
    url: import.meta.url
  },
  inject: {
    global: "unenv/polyfill/globalthis",
    process: "node:process",
    Buffer: ["node:buffer", "Buffer"],
    clearImmediate: ["node:timers", "clearImmediate"],
    setImmediate: ["node:timers", "setImmediate"],
    performance: "unenv/polyfill/performance",
    PerformanceObserver: ["node:perf_hooks", "PerformanceObserver"],
    BroadcastChannel: ["node:worker_threads", "BroadcastChannel"]
  },
  polyfill: [
    "unenv/polyfill/globalthis-global",
    "unenv/polyfill/process",
    "unenv/polyfill/buffer",
    "unenv/polyfill/timers"
  ]
};
async function resolveUnenv(options) {
  options.unenv ??= [];
  if (!Array.isArray(options.unenv)) {
    options.unenv = [options.unenv];
  }
  options.unenv = options.unenv.filter(Boolean);
  if (!options.node) {
    options.unenv.unshift(nodeless);
  }
  options.unenv.unshift(common);
}

const configResolvers = [
  resolveCompatibilityOptions,
  resolvePathOptions,
  resolveImportsOptions,
  resolveRouteRulesOptions,
  resolveDatabaseOptions,
  resolveFetchOptions,
  resolveExportConditionsOptions,
  resolveRuntimeConfigOptions,
  resolveOpenAPIOptions,
  resolveURLOptions,
  resolveAssetsOptions,
  resolveStorageOptions,
  resolveErrorOptions,
  resolveUnenv
];
async function loadOptions(configOverrides = {}, opts = {}) {
  const options = await _loadUserConfig(configOverrides, opts);
  for (const resolver of configResolvers) {
    await resolver(options);
  }
  return options;
}
async function _loadUserConfig(configOverrides = {}, opts = {}) {
  configOverrides = klona(configOverrides);
  globalThis.defineNitroConfig = globalThis.defineNitroConfig || ((c) => c);
  let compatibilityDate = configOverrides.compatibilityDate || opts.compatibilityDate || (process.env.NITRO_COMPATIBILITY_DATE || process.env.SERVER_COMPATIBILITY_DATE || process.env.COMPATIBILITY_DATE);
  const { resolvePreset } = await import('nitropack/presets');
  let preset = configOverrides.preset || process.env.NITRO_PRESET || process.env.SERVER_PRESET;
  const loadedConfig = await (opts.watch ? watchConfig : loadConfig)({
    name: "nitro",
    cwd: configOverrides.rootDir,
    dotenv: opts.dotenv ?? configOverrides.dev,
    extend: { extendKey: ["extends", "preset"] },
    defaults: NitroDefaults,
    jitiOptions: {
      alias: {
        nitropack: "nitropack/config",
        "nitropack/config": "nitropack/config"
      }
    },
    async overrides({ rawConfigs }) {
      const getConf = (key) => configOverrides[key] ?? rawConfigs.main?.[key] ?? rawConfigs.rc?.[key] ?? rawConfigs.packageJson?.[key];
      if (!compatibilityDate) {
        compatibilityDate = getConf("compatibilityDate");
      }
      const framework = getConf("framework");
      const isCustomFramework = framework?.name && framework.name !== "nitro";
      if (!preset) {
        preset = getConf("preset");
      }
      if (configOverrides.dev) {
        preset = preset && preset !== "nitro-dev" ? await resolvePreset(preset, {
          static: getConf("static"),
          dev: true,
          compatibilityDate: compatibilityDate || fallbackCompatibilityDate
        }).then((p) => p?._meta?.name || "nitro-dev").catch(() => "nitro-dev") : "nitro-dev";
      } else if (!preset) {
        preset = await resolvePreset("", {
          static: getConf("static"),
          dev: false,
          compatibilityDate: compatibilityDate || fallbackCompatibilityDate
        }).then((p) => p?._meta?.name);
      }
      return {
        ...configOverrides,
        preset,
        typescript: {
          generateRuntimeConfigTypes: !isCustomFramework,
          ...getConf("typescript"),
          ...configOverrides.typescript
        }
      };
    },
    async resolve(id) {
      const preset2 = await resolvePreset(id, {
        static: configOverrides.static,
        compatibilityDate: compatibilityDate || fallbackCompatibilityDate,
        dev: configOverrides.dev
      });
      if (preset2) {
        return {
          config: klona(preset2)
        };
      }
    },
    ...opts.c12
  });
  const options = klona(loadedConfig.config);
  options._config = configOverrides;
  options._c12 = loadedConfig;
  const _presetName = (loadedConfig.layers || []).find((l) => l.config?._meta?.name)?.config?._meta?.name || preset;
  options.preset = _presetName;
  options.compatibilityDate = resolveCompatibilityDates(
    compatibilityDate,
    options.compatibilityDate
  );
  if (options.dev && options.preset !== "nitro-dev") {
    consola.info(`Using \`${options.preset}\` emulation in development mode.`);
  }
  return options;
}

async function updateNitroConfig(nitro, config) {
  nitro.options.routeRules = normalizeRouteRules(
    config.routeRules ? config : nitro.options
  );
  nitro.options.runtimeConfig = normalizeRuntimeConfig(
    config.runtimeConfig ? config : nitro.options
  );
  await nitro.hooks.callHook("rollup:reload");
  consola.success("Nitro config hot reloaded!");
}

async function installModules(nitro) {
  const _modules = [...nitro.options.modules || []];
  const modules = await Promise.all(
    _modules.map((mod) => _resolveNitroModule(mod, nitro.options))
  );
  const _installedURLs = /* @__PURE__ */ new Set();
  for (const mod of modules) {
    if (mod._url) {
      if (_installedURLs.has(mod._url)) {
        continue;
      }
      _installedURLs.add(mod._url);
    }
    await mod.setup(nitro);
  }
}
async function _resolveNitroModule(mod, nitroOptions) {
  let _url;
  if (typeof mod === "string") {
    globalThis.defineNitroModule = // @ts-ignore
    globalThis.defineNitroModule || ((mod2) => mod2);
    const jiti = createJiti(nitroOptions.rootDir, {
      alias: nitroOptions.alias
    });
    const _modPath = jiti.esmResolve(mod);
    _url = _modPath;
    mod = await jiti.import(_modPath, { default: true });
  }
  if (typeof mod === "function") {
    mod = { setup: mod };
  }
  if (!mod.setup) {
    mod.setup = () => {
    };
  }
  return {
    _url,
    ...mod
  };
}

const GLOB_SCAN_PATTERN = "**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}";
const suffixRegex = /(\.(?<method>connect|delete|get|head|options|patch|post|put|trace))?(\.(?<env>dev|prod|prerender))?$/;
async function scanAndSyncOptions(nitro) {
  const scannedPlugins = await scanPlugins(nitro);
  for (const plugin of scannedPlugins) {
    if (!nitro.options.plugins.includes(plugin)) {
      nitro.options.plugins.push(plugin);
    }
  }
  if (nitro.options.experimental.tasks) {
    const scannedTasks = await scanTasks(nitro);
    for (const scannedTask of scannedTasks) {
      if (scannedTask.name in nitro.options.tasks) {
        if (!nitro.options.tasks[scannedTask.name].handler) {
          nitro.options.tasks[scannedTask.name].handler = scannedTask.handler;
        }
      } else {
        nitro.options.tasks[scannedTask.name] = {
          handler: scannedTask.handler,
          description: ""
        };
      }
    }
  }
  const scannedModules = await scanModules(nitro);
  nitro.options.modules = nitro.options.modules || [];
  for (const modPath of scannedModules) {
    if (!nitro.options.modules.includes(modPath)) {
      nitro.options.modules.push(modPath);
    }
  }
}
async function scanHandlers(nitro) {
  const middleware = await scanMiddleware(nitro);
  const handlers = await Promise.all([
    scanServerRoutes(
      nitro,
      nitro.options.apiDir || "api",
      nitro.options.apiBaseURL || "/api"
    ),
    scanServerRoutes(nitro, nitro.options.routesDir || "routes")
  ]).then((r) => r.flat());
  nitro.scannedHandlers = [
    ...middleware,
    ...handlers.filter((h, index, array) => {
      return array.findIndex(
        (h2) => h.route === h2.route && h.method === h2.method && h.env === h2.env
      ) === index;
    })
  ];
  return handlers;
}
async function scanMiddleware(nitro) {
  const files = await scanFiles(nitro, "middleware");
  return files.map((file) => {
    return {
      middleware: true,
      handler: file.fullPath
    };
  });
}
async function scanServerRoutes(nitro, dir, prefix = "/") {
  const files = await scanFiles(nitro, dir);
  return files.map((file) => {
    let route = file.path.replace(/\.[A-Za-z]+$/, "").replace(/\(([^(/\\]+)\)[/\\]/g, "").replace(/\[\.{3}]/g, "**").replace(/\[\.{3}(\w+)]/g, "**:$1").replace(/\[([^/\]]+)]/g, ":$1");
    route = withLeadingSlash(withoutTrailingSlash(withBase(route, prefix)));
    const suffixMatch = route.match(suffixRegex);
    let method;
    let env;
    if (suffixMatch?.index && suffixMatch?.index >= 0) {
      route = route.slice(0, suffixMatch.index);
      method = suffixMatch.groups?.method;
      env = suffixMatch.groups?.env;
    }
    route = route.replace(/\/index$/, "") || "/";
    return {
      handler: file.fullPath,
      lazy: true,
      middleware: false,
      route,
      method,
      env
    };
  });
}
async function scanPlugins(nitro) {
  const files = await scanFiles(nitro, "plugins");
  return files.map((f) => f.fullPath);
}
async function scanTasks(nitro) {
  const files = await scanFiles(nitro, "tasks");
  return files.map((f) => {
    const name = f.path.replace(/\/index$/, "").replace(/\.[A-Za-z]+$/, "").replace(/\//g, ":");
    return { name, handler: f.fullPath };
  });
}
async function scanModules(nitro) {
  const files = await scanFiles(nitro, "modules");
  return files.map((f) => f.fullPath);
}
async function scanFiles(nitro, name) {
  const files = await Promise.all(
    nitro.options.scanDirs.map((dir) => scanDir(nitro, dir, name))
  ).then((r) => r.flat());
  return files;
}
async function scanDir(nitro, dir, name) {
  const fileNames = await globby(join$1(name, GLOB_SCAN_PATTERN), {
    cwd: dir,
    dot: true,
    ignore: nitro.options.ignore,
    absolute: true
  }).catch((error) => {
    if (error?.code === "ENOTDIR") {
      nitro.logger.warn(
        `Ignoring \`${join$1(dir, name)}\`. It must be a directory.`
      );
      return [];
    }
    throw error;
  });
  return fileNames.map((fullPath) => {
    return {
      fullPath,
      path: relative(join$1(dir, name), fullPath)
    };
  }).sort((a, b) => a.path.localeCompare(b.path));
}

async function runTask(taskEvent, opts) {
  const ctx = await _getTasksContext(opts);
  const result = await ctx.devFetch(`/_nitro/tasks/${taskEvent.name}`, {
    method: "POST",
    body: taskEvent
  });
  return result;
}
async function listTasks(opts) {
  const ctx = await _getTasksContext(opts);
  const res = await ctx.devFetch("/_nitro/tasks");
  return res.tasks;
}
function addNitroTasksVirtualFile(nitro) {
  nitro.options.virtual["#nitro-internal-virtual/tasks"] = () => {
    const _scheduledTasks = Object.entries(nitro.options.scheduledTasks || {}).map(([cron, _tasks]) => {
      const tasks = (Array.isArray(_tasks) ? _tasks : [_tasks]).filter(
        (name) => {
          if (!nitro.options.tasks[name]) {
            nitro.logger.warn(`Scheduled task \`${name}\` is not defined!`);
            return false;
          }
          return true;
        }
      );
      return { cron, tasks };
    }).filter((e) => e.tasks.length > 0);
    const scheduledTasks = _scheduledTasks.length > 0 ? _scheduledTasks : false;
    return (
      /* js */
      `
export const scheduledTasks = ${JSON.stringify(scheduledTasks)};

export const tasks = {
  ${Object.entries(nitro.options.tasks).map(
        ([name, task]) => `"${name}": {
          meta: {
            description: ${JSON.stringify(task.description)},
          },
          resolve: ${task.handler ? `() => import("${normalize(
          task.handler
        )}").then(r => r.default || r)` : "undefined"},
        }`
      ).join(",\n")}
};`
    );
  };
}
const _devHint = `(is dev server running?)`;
async function _getTasksContext(opts) {
  const cwd = resolve(process.cwd(), opts?.cwd || ".");
  const outDir = resolve(cwd, opts?.buildDir || ".nitro");
  const buildInfoPath = resolve(outDir, "nitro.json");
  if (!existsSync(buildInfoPath)) {
    throw new Error(`Missing info file: \`${buildInfoPath}\` ${_devHint}`);
  }
  const buildInfo = JSON.parse(
    await readFile(buildInfoPath, "utf8")
  );
  if (!buildInfo.dev?.pid || !buildInfo.dev?.workerAddress) {
    throw new Error(
      `Missing dev server info in: \`${buildInfoPath}\` ${_devHint}`
    );
  }
  if (!_pidIsRunning(buildInfo.dev.pid)) {
    throw new Error(`Dev server is not running (pid: ${buildInfo.dev.pid})`);
  }
  const devFetch = ofetch.create({
    baseURL: `http://${buildInfo.dev.workerAddress.host || "localhost"}:${buildInfo.dev.workerAddress.port || "3000"}`,
    // @ts-expect-error
    socketPath: buildInfo.dev.workerAddress.socketPath
  });
  return {
    buildInfo,
    devFetch
  };
}
function _pidIsRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function createStorage(nitro) {
  const storage = createStorage$1();
  const mounts = klona$1({
    ...nitro.options.storage,
    ...nitro.options.devStorage
  });
  for (const [path, opts] of Object.entries(mounts)) {
    if (opts.driver) {
      const driver = await import(builtinDrivers[opts.driver] || opts.driver).then((r) => r.default || r);
      storage.mount(path, driver(opts));
    } else {
      nitro.logger.warn(`No \`driver\` set for storage mount point "${path}".`);
    }
  }
  return storage;
}
async function snapshotStorage(nitro) {
  const data = {};
  const allKeys = [
    ...new Set(
      await Promise.all(
        nitro.options.bundledStorage.map((base) => nitro.storage.getKeys(base))
      ).then((r) => r.flat())
    )
  ];
  await Promise.all(
    allKeys.map(async (key) => {
      data[key] = await nitro.storage.getItem(key);
    })
  );
  return data;
}

async function createNitro(config = {}, opts = {}) {
  const options = await loadOptions(config, opts);
  const nitro = {
    options,
    hooks: createHooks(),
    vfs: {},
    logger: consola$1.withTag("nitro"),
    scannedHandlers: [],
    close: () => nitro.hooks.callHook("close"),
    storage: void 0,
    async updateConfig(config2) {
      updateNitroConfig(nitro, config2);
    }
  };
  await scanAndSyncOptions(nitro);
  nitro.storage = await createStorage(nitro);
  nitro.hooks.hook("close", async () => {
    await nitro.storage.dispose();
  });
  if (nitro.options.debug) {
    createDebugger(nitro.hooks, { tag: "nitro" });
    nitro.options.plugins.push(join$1(runtimeDir, "internal/debug"));
  }
  if (nitro.options.timing) {
    nitro.options.plugins.push(join$1(runtimeDir, "internal/timing"));
  }
  if (nitro.options.logLevel !== void 0) {
    nitro.logger.level = nitro.options.logLevel;
  }
  nitro.hooks.addHooks(nitro.options.hooks);
  addNitroTasksVirtualFile(nitro);
  await installModules(nitro);
  if (nitro.options.imports) {
    nitro.unimport = createUnimport(nitro.options.imports);
    await nitro.unimport.init();
    nitro.options.virtual["#imports"] = () => nitro.unimport?.toExports() || "";
    nitro.options.virtual["#nitro"] = 'export * from "#imports"';
  }
  await scanHandlers(nitro);
  return nitro;
}

function nitroServerName(nitro) {
  return nitro.options.framework.name === "nitro" ? "Nitro Server" : `${upperFirst(nitro.options.framework.name)} Nitro server`;
}

function formatRollupError(_error) {
  try {
    const logs = [_error.toString()];
    const errors = _error?.errors || [_error];
    for (const error of errors) {
      const id = error.path || error.id || _error.id;
      let path = isAbsolute(id) ? relative(process.cwd(), id) : id;
      const location = error.loc || error.location;
      if (location) {
        path += `:${location.line}:${location.column}`;
      }
      const text = error.text || error.frame;
      logs.push(
        `Rollup error while processing \`${path}\`` + text ? "\n\n" + text : ""
      );
    }
    return logs.join("\n");
  } catch {
    return _error?.toString();
  }
}

async function writeTypes(nitro) {
  const types = {
    routes: {}
  };
  const typesDir = resolve(nitro.options.buildDir, "types");
  const middleware = [...nitro.scannedHandlers, ...nitro.options.handlers];
  for (const mw of middleware) {
    if (typeof mw.handler !== "string" || !mw.route) {
      continue;
    }
    const relativePath = relative(
      typesDir,
      resolveNitroPath(mw.handler, nitro.options)
    ).replace(/\.(js|mjs|cjs|ts|mts|cts|tsx|jsx)$/, "");
    const method = mw.method || "default";
    types.routes[mw.route] ??= {};
    types.routes[mw.route][method] ??= [];
    types.routes[mw.route][method].push(
      `Simplify<Serialize<Awaited<ReturnType<typeof import('${relativePath}').default>>>>`
    );
  }
  let autoImportedTypes = [];
  let autoImportExports = "";
  if (nitro.unimport) {
    await nitro.unimport.init();
    const allImports = await nitro.unimport.getImports();
    autoImportExports = toExports(allImports).replace(
      /#internal\/nitro/g,
      relative(typesDir, runtimeDir)
    );
    const resolvedImportPathMap = /* @__PURE__ */ new Map();
    for (const i of allImports) {
      if (resolvedImportPathMap.has(i.from)) {
        continue;
      }
      let path = resolveAlias(i.from, nitro.options.alias);
      if (!isAbsolute(path)) {
        const resolvedPath = resolveModulePath(i.from, {
          try: true,
          from: nitro.options.nodeModulesDirs,
          conditions: ["type", "node", "import"],
          suffixes: ["", "/index"],
          extensions: [".mjs", ".cjs", ".js", ".mts", ".cts", ".ts"]
        });
        if (resolvedPath) {
          const { dir, name } = parseNodeModulePath(resolvedPath);
          if (!dir || !name) {
            path = resolvedPath;
          } else {
            const subpath = await lookupNodeModuleSubpath(resolvedPath);
            path = join$1(dir, name, subpath || "");
          }
        }
      }
      if (existsSync(path) && !await isDirectory(path)) {
        path = path.replace(/\.[a-z]+$/, "");
      }
      if (isAbsolute(path)) {
        path = relative(typesDir, path);
      }
      resolvedImportPathMap.set(i.from, path);
    }
    autoImportedTypes = [
      nitro.options.imports && nitro.options.imports.autoImport !== false ? (await nitro.unimport.generateTypeDeclarations({
        exportHelper: false,
        resolvePath: (i) => resolvedImportPathMap.get(i.from) ?? i.from
      })).trim() : ""
    ];
  }
  const generateRoutes = () => [
    "// Generated by nitro",
    'import type { Serialize, Simplify } from "nitropack/types";',
    'declare module "nitropack/types" {',
    "  type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T",
    "  interface InternalApi {",
    ...Object.entries(types.routes).map(
      ([path, methods]) => [
        `    '${path}': {`,
        ...Object.entries(methods).map(
          ([method, types2]) => `      '${method}': ${types2.join(" | ")}`
        ),
        "    }"
      ].join("\n")
    ),
    "  }",
    "}",
    // Makes this a module for augmentation purposes
    "export {}"
  ];
  const config = [
    "// Generated by nitro",
    `
// App Config
import type { Defu } from 'defu'

${nitro.options.appConfigFiles.map(
      (file, index) => genTypeImport(relative(typesDir, file).replace(/\.\w+$/, ""), [
        { name: "default", as: `appConfig${index}` }
      ])
    ).join("\n")}

type UserAppConfig = Defu<{}, [${nitro.options.appConfigFiles.map((_, index) => `typeof appConfig${index}`).join(", ")}]>

declare module "nitropack/types" {
  interface AppConfig extends UserAppConfig {}`,
    nitro.options.typescript.generateRuntimeConfigTypes ? generateTypes(
      await resolveSchema(
        Object.fromEntries(
          Object.entries(nitro.options.runtimeConfig).filter(
            ([key]) => !["app", "nitro"].includes(key)
          )
        )
      ),
      {
        interfaceName: "NitroRuntimeConfig",
        addExport: false,
        addDefaults: false,
        allowExtraKeys: false,
        indentation: 2
      }
    ) : "",
    `}`,
    // Makes this a module for augmentation purposes
    "export {}"
  ];
  const declarations = [
    // local nitropack augmentations
    '/// <reference path="./nitro-routes.d.ts" />',
    '/// <reference path="./nitro-config.d.ts" />',
    // global server auto-imports
    '/// <reference path="./nitro-imports.d.ts" />'
  ];
  const buildFiles = [];
  buildFiles.push({
    path: join$1(typesDir, "nitro-routes.d.ts"),
    contents: () => generateRoutes().join("\n")
  });
  buildFiles.push({
    path: join$1(typesDir, "nitro-config.d.ts"),
    contents: config.join("\n")
  });
  buildFiles.push({
    path: join$1(typesDir, "nitro-imports.d.ts"),
    contents: [...autoImportedTypes, autoImportExports || "export {}"].join(
      "\n"
    )
  });
  buildFiles.push({
    path: join$1(typesDir, "nitro.d.ts"),
    contents: declarations.join("\n")
  });
  if (nitro.options.typescript.generateTsConfig) {
    const tsConfigPath = resolve(
      nitro.options.buildDir,
      nitro.options.typescript.tsconfigPath
    );
    const tsconfigDir = dirname(tsConfigPath);
    const tsConfig = defu(nitro.options.typescript.tsConfig, {
      compilerOptions: {
        forceConsistentCasingInFileNames: true,
        strict: nitro.options.typescript.strict,
        noEmit: true,
        skipLibCheck: true,
        target: "ESNext",
        module: "ESNext",
        moduleResolution: nitro.options.experimental.typescriptBundlerResolution === false ? "Node" : "Bundler",
        allowJs: true,
        resolveJsonModule: true,
        jsx: "preserve",
        allowSyntheticDefaultImports: true,
        jsxFactory: "h",
        jsxFragmentFactory: "Fragment",
        paths: {
          "#imports": [
            relativeWithDot(tsconfigDir, join$1(typesDir, "nitro-imports"))
          ],
          "~/*": [
            relativeWithDot(
              tsconfigDir,
              join$1(nitro.options.alias["~"] || nitro.options.srcDir, "*")
            )
          ],
          "@/*": [
            relativeWithDot(
              tsconfigDir,
              join$1(nitro.options.alias["@"] || nitro.options.srcDir, "*")
            )
          ],
          "~~/*": [
            relativeWithDot(
              tsconfigDir,
              join$1(nitro.options.alias["~~"] || nitro.options.rootDir, "*")
            )
          ],
          "@@/*": [
            relativeWithDot(
              tsconfigDir,
              join$1(nitro.options.alias["@@"] || nitro.options.rootDir, "*")
            )
          ],
          ...nitro.options.typescript.internalPaths ? {
            "nitropack/runtime": [
              relativeWithDot(tsconfigDir, join$1(runtimeDir, "index"))
            ],
            "#internal/nitro": [
              relativeWithDot(tsconfigDir, join$1(runtimeDir, "index"))
            ],
            "nitropack/runtime/*": [
              relativeWithDot(tsconfigDir, join$1(runtimeDir, "*"))
            ],
            "#internal/nitro/*": [
              relativeWithDot(tsconfigDir, join$1(runtimeDir, "*"))
            ]
          } : {}
        }
      },
      include: [
        relativeWithDot(tsconfigDir, join$1(typesDir, "nitro.d.ts")).replace(
          /^(?=[^.])/,
          "./"
        ),
        join$1(relativeWithDot(tsconfigDir, nitro.options.rootDir), "**/*"),
        ...nitro.options.srcDir === nitro.options.rootDir ? [] : [join$1(relativeWithDot(tsconfigDir, nitro.options.srcDir), "**/*")]
      ]
    });
    for (const alias in tsConfig.compilerOptions.paths) {
      const paths = await Promise.all(
        tsConfig.compilerOptions.paths[alias].map(async (path) => {
          if (!isAbsolute(path)) {
            return path;
          }
          const stats = await promises.stat(path).catch(
            () => null
            /* file does not exist */
          );
          return relativeWithDot(
            tsconfigDir,
            stats?.isFile() ? path.replace(/(?<=\w)\.\w+$/g, "") : path
          );
        })
      );
      tsConfig.compilerOptions.paths[alias] = [...new Set(paths)];
    }
    tsConfig.include = [
      ...new Set(
        tsConfig.include.map(
          (p) => isAbsolute(p) ? relativeWithDot(tsconfigDir, p) : p
        )
      )
    ];
    if (tsConfig.exclude) {
      tsConfig.exclude = [
        ...new Set(
          tsConfig.exclude.map(
            (p) => isAbsolute(p) ? relativeWithDot(tsconfigDir, p) : p
          )
        )
      ];
    }
    types.tsConfig = tsConfig;
    buildFiles.push({
      path: tsConfigPath,
      contents: () => JSON.stringify(tsConfig, null, 2)
    });
  }
  await nitro.hooks.callHook("types:extend", types);
  await Promise.all(
    buildFiles.map(async (file) => {
      await writeFile(
        resolve(nitro.options.buildDir, file.path),
        typeof file.contents === "string" ? file.contents : file.contents()
      );
    })
  );
}
const RELATIVE_RE = /^\.{1,2}\//;
function relativeWithDot(from, to) {
  const rel = relative(from, to);
  return RELATIVE_RE.test(rel) ? rel : "./" + rel;
}

async function watchDev(nitro, rollupConfig) {
  let rollupWatcher;
  async function load() {
    if (rollupWatcher) {
      await rollupWatcher.close();
    }
    await scanHandlers(nitro);
    rollupWatcher = startRollupWatcher(nitro, rollupConfig);
    await writeTypes(nitro);
  }
  const reload = debounce(load);
  const watchPatterns = nitro.options.scanDirs.flatMap((dir) => [
    join$1(dir, nitro.options.apiDir || "api"),
    join$1(dir, nitro.options.routesDir || "routes"),
    join$1(dir, "middleware"),
    join$1(dir, "plugins"),
    join$1(dir, "modules")
  ]);
  const watchReloadEvents = /* @__PURE__ */ new Set(["add", "addDir", "unlink", "unlinkDir"]);
  const reloadWatcher = watch(watchPatterns, { ignoreInitial: true }).on(
    "all",
    (event) => {
      if (watchReloadEvents.has(event)) {
        reload();
      }
    }
  );
  nitro.hooks.hook("close", () => {
    rollupWatcher.close();
    reloadWatcher.close();
  });
  nitro.hooks.hook("rollup:reload", () => reload());
  await load();
}
function startRollupWatcher(nitro, rollupConfig) {
  const watcher = rollup.watch(
    defu$1(rollupConfig, {
      watch: {
        chokidar: nitro.options.watchOptions
      }
    })
  );
  let start;
  watcher.on("event", (event) => {
    switch (event.code) {
      case "START": {
        start = Date.now();
        nitro.hooks.callHook("dev:start");
        break;
      }
      case "BUNDLE_END": {
        nitro.hooks.callHook("compiled", nitro);
        if (nitro.options.logging.buildSuccess) {
          nitro.logger.success(
            `${nitroServerName(nitro)} built`,
            start ? `in ${Date.now() - start}ms` : ""
          );
        }
        nitro.hooks.callHook("dev:reload");
        break;
      }
      case "ERROR": {
        nitro.logger.error(formatRollupError(event.error));
        nitro.hooks.callHook("dev:error", event.error);
      }
    }
  });
  return watcher;
}

const presetsWithConfig = ["awsAmplify", "awsLambda", "azure", "cloudflare", "firebase", "netlify", "vercel"];

async function runParallel(inputs, cb, opts) {
  const tasks = /* @__PURE__ */ new Set();
  function queueNext() {
    const route = inputs.values().next().value;
    if (!route) {
      return;
    }
    inputs.delete(route);
    const task = (opts.interval ? new Promise((resolve) => setTimeout(resolve, opts.interval)) : Promise.resolve()).then(() => cb(route)).catch((error) => {
      console.error(error);
    });
    tasks.add(task);
    return task.then(() => {
      tasks.delete(task);
      if (inputs.size > 0) {
        return refillQueue();
      }
    });
  }
  function refillQueue() {
    const workers = Math.min(opts.concurrency - tasks.size, inputs.size);
    return Promise.all(Array.from({ length: workers }, () => queueNext()));
  }
  await refillQueue();
}

async function generateFSTree(dir, options = {}) {
  if (isTest) {
    return;
  }
  const files = await globby("**/*.*", { cwd: dir, ignore: ["*.map"] });
  const items = [];
  await runParallel(
    new Set(files),
    async (file) => {
      const path = resolve(dir, file);
      const src = await promises.readFile(path);
      const size = src.byteLength;
      const gzip = options.compressedSizes ? await gzipSize(src) : 0;
      items.push({ file, path, size, gzip });
    },
    { concurrency: 10 }
  );
  items.sort((a, b) => a.path.localeCompare(b.path));
  let totalSize = 0;
  let totalGzip = 0;
  let totalNodeModulesSize = 0;
  let totalNodeModulesGzip = 0;
  let treeText = "";
  for (const [index, item] of items.entries()) {
    dirname(item.file);
    const rpath = relative(process.cwd(), item.path);
    const treeChar = index === items.length - 1 ? "\u2514\u2500" : "\u251C\u2500";
    const isNodeModules = item.file.includes("node_modules");
    if (isNodeModules) {
      totalNodeModulesSize += item.size;
      totalNodeModulesGzip += item.gzip;
      continue;
    }
    treeText += colors.gray(
      `  ${treeChar} ${rpath} (${prettyBytes(item.size)})`
    );
    if (options.compressedSizes) {
      treeText += colors.gray(` (${prettyBytes(item.gzip)} gzip)`);
    }
    treeText += "\n";
    totalSize += item.size;
    totalGzip += item.gzip;
  }
  treeText += `${colors.cyan("\u03A3 Total size:")} ${prettyBytes(
    totalSize + totalNodeModulesSize
  )}`;
  if (options.compressedSizes) {
    treeText += ` (${prettyBytes(totalGzip + totalNodeModulesGzip)} gzip)`;
  }
  treeText += "\n";
  return treeText;
}

async function buildProduction(nitro, rollupConfig) {
  await scanHandlers(nitro);
  await writeTypes(nitro);
  await _snapshot(nitro);
  if (!nitro.options.static) {
    nitro.logger.info(
      `Building ${nitroServerName(nitro)} (preset: \`${nitro.options.preset}\`, compatibility date: \`${formatCompatibilityDate(nitro.options.compatibilityDate)}\`)`
    );
    const build = await rollup.rollup(rollupConfig).catch((error) => {
      nitro.logger.error(formatRollupError(error));
      throw error;
    });
    await build.write(rollupConfig.output);
  }
  const buildInfoPath = resolve(nitro.options.output.dir, "nitro.json");
  const buildInfo = {
    date: (/* @__PURE__ */ new Date()).toJSON(),
    preset: nitro.options.preset,
    framework: nitro.options.framework,
    versions: {
      nitro: version
    },
    commands: {
      preview: resolveTmplPath(
        nitro.options.commands.preview,
        nitro,
        nitro.options.output.dir
      ),
      deploy: resolveTmplPath(
        nitro.options.commands.deploy,
        nitro,
        nitro.options.output.dir
      )
    },
    config: {
      ...Object.fromEntries(
        presetsWithConfig.map((key) => [key, nitro.options[key]])
      )
    }
  };
  await writeFile(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  if (!nitro.options.static) {
    if (nitro.options.logging.buildSuccess) {
      nitro.logger.success(`${nitroServerName(nitro)} built`);
    }
    if (nitro.options.logLevel > 1) {
      process.stdout.write(
        await generateFSTree(nitro.options.output.serverDir, {
          compressedSizes: nitro.options.logging.compressedSizes
        }) || ""
      );
    }
  }
  await nitro.hooks.callHook("compiled", nitro);
  if (nitro.options.commands?.preview) {
    nitro.logger.success(
      `You can preview this build using \`${resolveTmplPath(
        nitro.options.commands.preview,
        nitro,
        process.cwd()
      )}\``
    );
  }
  if (nitro.options.commands?.deploy) {
    nitro.logger.success(
      `You can deploy this build using \`${resolveTmplPath(
        nitro.options.commands.deploy,
        nitro,
        process.cwd()
      )}\``
    );
  }
}
async function _snapshot(nitro) {
  if (nitro.options.bundledStorage.length === 0 || nitro.options.preset === "nitro-prerender") {
    return;
  }
  const storageDir = resolve(nitro.options.buildDir, "snapshot");
  nitro.options.serverAssets.push({
    baseName: "nitro:bundled",
    dir: storageDir
  });
  const data = await snapshotStorage(nitro);
  await Promise.all(
    Object.entries(data).map(async ([path, contents]) => {
      if (typeof contents !== "string") {
        contents = JSON.stringify(contents);
      }
      const fsPath = join$1(storageDir, path.replace(/:/g, "/"));
      await promises.mkdir(dirname(fsPath), { recursive: true });
      await promises.writeFile(fsPath, contents, "utf8");
    })
  );
}
function resolveTmplPath(input, nitro, relativeTo) {
  if (!input || !input.includes("{{")) {
    return input;
  }
  return input.replace(/{{ ?([\w.]+) ?}}/g, (_, match) => {
    let val = getProperty(
      nitro.options,
      match
    );
    if (val) {
      val = relative(relativeTo, val) || ".";
    } else {
      nitro.logger.warn(
        `cannot resolve template param '${match}' in ${input.slice(0, 20)}`
      );
    }
    return val || `${match}`;
  });
}

async function build(nitro) {
  await nitro.hooks.callHook("build:before", nitro);
  const rollupConfig = getRollupConfig(nitro);
  await nitro.hooks.callHook("rollup:before", nitro, rollupConfig);
  return nitro.options.dev ? watchDev(nitro, rollupConfig) : buildProduction(nitro, rollupConfig);
}

async function compressPublicAssets(nitro) {
  const publicFiles = await globby("**", {
    cwd: nitro.options.output.publicDir,
    absolute: false,
    dot: true,
    ignore: ["**/*.gz", "**/*.br"]
  });
  await Promise.all(
    publicFiles.map(async (fileName) => {
      const filePath = resolve(nitro.options.output.publicDir, fileName);
      if (existsSync(filePath + ".gz") || existsSync(filePath + ".br")) {
        return;
      }
      const mimeType = mime.getType(fileName) || "text/plain";
      const fileContents = await fsp.readFile(filePath);
      if (fileContents.length < 1024 || fileName.endsWith(".map") || !isCompressibleMime(mimeType)) {
        return;
      }
      const { gzip, brotli } = nitro.options.compressPublicAssets || {};
      const encodings = [
        gzip !== false && "gzip",
        brotli !== false && "br"
      ].filter(Boolean);
      await Promise.all(
        encodings.map(async (encoding) => {
          const suffix = "." + (encoding === "gzip" ? "gz" : "br");
          const compressedPath = filePath + suffix;
          if (existsSync(compressedPath)) {
            return;
          }
          const gzipOptions = { level: zlib.constants.Z_BEST_COMPRESSION };
          const brotliOptions = {
            [zlib.constants.BROTLI_PARAM_MODE]: isTextMime(mimeType) ? zlib.constants.BROTLI_MODE_TEXT : zlib.constants.BROTLI_MODE_GENERIC,
            [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
            [zlib.constants.BROTLI_PARAM_SIZE_HINT]: fileContents.length
          };
          const compressedBuff = await new Promise(
            (resolve2, reject) => {
              const cb = (error, result) => error ? reject(error) : resolve2(result);
              if (encoding === "gzip") {
                zlib.gzip(fileContents, gzipOptions, cb);
              } else {
                zlib.brotliCompress(fileContents, brotliOptions, cb);
              }
            }
          );
          await fsp.writeFile(compressedPath, compressedBuff);
        })
      );
    })
  );
}
function isTextMime(mimeType) {
  return /text|javascript|json|xml/.test(mimeType);
}
const COMPRESSIBLE_MIMES_RE = /* @__PURE__ */ new Set([
  "application/dash+xml",
  "application/eot",
  "application/font",
  "application/font-sfnt",
  "application/javascript",
  "application/json",
  "application/opentype",
  "application/otf",
  "application/pdf",
  "application/pkcs7-mime",
  "application/protobuf",
  "application/rss+xml",
  "application/truetype",
  "application/ttf",
  "application/vnd.apple.mpegurl",
  "application/vnd.mapbox-vector-tile",
  "application/vnd.ms-fontobject",
  "application/wasm",
  "application/xhtml+xml",
  "application/xml",
  "application/x-font-opentype",
  "application/x-font-truetype",
  "application/x-font-ttf",
  "application/x-httpd-cgi",
  "application/x-javascript",
  "application/x-mpegurl",
  "application/x-opentype",
  "application/x-otf",
  "application/x-perl",
  "application/x-ttf",
  "font/eot",
  "font/opentype",
  "font/otf",
  "font/ttf",
  "image/svg+xml",
  "text/css",
  "text/csv",
  "text/html",
  "text/javascript",
  "text/js",
  "text/plain",
  "text/richtext",
  "text/tab-separated-values",
  "text/xml",
  "text/x-component",
  "text/x-java-source",
  "text/x-script",
  "vnd.apple.mpegurl"
]);
function isCompressibleMime(mimeType) {
  return COMPRESSIBLE_MIMES_RE.has(mimeType);
}

const allowedExtensions = /* @__PURE__ */ new Set(["", ".json"]);
const linkParents$1 = /* @__PURE__ */ new Map();
const HTML_ENTITIES = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
  "&apos;": "'",
  "&quot;": '"'
};
function escapeHtml(text) {
  return text.replace(
    /&(lt|gt|amp|apos|quot);/g,
    (ch) => HTML_ENTITIES[ch] || ch
  );
}
async function extractLinks(html, from, res, crawlLinks) {
  const links = [];
  const _links = [];
  if (crawlLinks) {
    await walk(parse(html), (node) => {
      if (!node.attributes?.href) {
        return;
      }
      const link = escapeHtml(node.attributes.href);
      if (!decodeURIComponent(link).startsWith("#") && allowedExtensions.has(getExtension(link))) {
        _links.push(link);
      }
    });
  }
  const header = res.headers.get("x-nitro-prerender") || "";
  _links.push(...header.split(",").map((i) => decodeURIComponent(i.trim())));
  for (const link of _links.filter(Boolean)) {
    const _link = parseURL(link);
    if (_link.protocol || _link.host) {
      continue;
    }
    if (!_link.pathname.startsWith("/")) {
      const fromURL = new URL(from, "http://localhost");
      _link.pathname = new URL(_link.pathname, fromURL).pathname;
    }
    links.push(_link.pathname + _link.search);
  }
  for (const link of links) {
    const _parents = linkParents$1.get(link);
    if (_parents) {
      _parents.add(from);
    } else {
      linkParents$1.set(link, /* @__PURE__ */ new Set([from]));
    }
  }
  return links;
}
const EXT_REGEX = /\.[\da-z]+$/;
function getExtension(link) {
  const pathname = parseURL(link).pathname;
  return (pathname.match(EXT_REGEX) || [])[0] || "";
}
function formatPrerenderRoute(route) {
  let str = `  \u251C\u2500 ${route.route} (${route.generateTimeMS}ms)`;
  if (route.error) {
    const parents = linkParents$1.get(route.route);
    const errorColor = colors[route.error.statusCode === 404 ? "yellow" : "red"];
    const errorLead = parents?.size ? "\u251C\u2500\u2500" : "\u2514\u2500\u2500";
    str += `
  \u2502 ${errorLead} ${errorColor(route.error.message)}`;
    if (parents?.size) {
      str += `
${[...parents.values()].map((link) => `  \u2502 \u2514\u2500\u2500 Linked from ${link}`).join("\n")}`;
    }
  }
  if (route.skip) {
    str += colors.gray(" (skipped)");
  }
  return colors.gray(str);
}
function matchesIgnorePattern(path, pattern) {
  if (typeof pattern === "string") {
    return path.startsWith(pattern);
  }
  if (typeof pattern === "function") {
    return pattern(path) === true;
  }
  if (pattern instanceof RegExp) {
    return pattern.test(path);
  }
  return false;
}

const NEGATION_RE = /^(!?)(.*)$/;
const PARENT_DIR_GLOB_RE = /!?\.\.\//;
async function scanUnprefixedPublicAssets(nitro) {
  const scannedPaths = [];
  for (const asset of nitro.options.publicAssets) {
    if (asset.baseURL && asset.baseURL !== "/" && !asset.fallthrough) {
      continue;
    }
    if (!await isDirectory(asset.dir)) {
      continue;
    }
    const includePatterns = getIncludePatterns(nitro, asset.dir);
    const publicAssets = await globby(includePatterns, {
      cwd: asset.dir,
      absolute: false,
      dot: true
    });
    scannedPaths.push(
      ...publicAssets.map((file) => join$1(asset.baseURL || "/", file))
    );
  }
  return scannedPaths;
}
async function copyPublicAssets(nitro) {
  if (nitro.options.noPublicDir) {
    return;
  }
  for (const asset of nitro.options.publicAssets) {
    const srcDir = asset.dir;
    const dstDir = join$1(nitro.options.output.publicDir, asset.baseURL);
    if (await isDirectory(srcDir)) {
      const includePatterns = getIncludePatterns(nitro, srcDir);
      const publicAssets = await globby(includePatterns, {
        cwd: srcDir,
        absolute: false,
        dot: true
      });
      await Promise.all(
        publicAssets.map(async (file) => {
          const src = join$1(srcDir, file);
          const dst = join$1(dstDir, file);
          if (!existsSync(dst)) {
            await promises.cp(src, dst);
          }
        })
      );
    }
  }
  if (nitro.options.compressPublicAssets) {
    await compressPublicAssets(nitro);
  }
  nitro.logger.success(
    "Generated public " + prettyPath(nitro.options.output.publicDir)
  );
}
function getIncludePatterns(nitro, srcDir) {
  return [
    "**",
    ...nitro.options.ignore.map((p) => {
      const [_, negation, pattern] = p.match(NEGATION_RE) || [];
      return (
        // Convert ignore to include patterns
        (negation ? "" : "!") + // Make non-glob patterns relative to publicAssetDir
        (pattern.startsWith("*") ? pattern : relative(srcDir, resolve(nitro.options.srcDir, pattern)))
      );
    })
  ].filter((p) => !PARENT_DIR_GLOB_RE.test(p));
}

const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
const linkParents = /* @__PURE__ */ new Map();
async function prerender(nitro) {
  if (nitro.options.noPublicDir) {
    nitro.logger.warn(
      "Skipping prerender since `noPublicDir` option is enabled."
    );
    return;
  }
  const routes = new Set(nitro.options.prerender.routes);
  const prerenderRulePaths = Object.entries(nitro.options.routeRules).filter(([path2, options]) => options.prerender && !path2.includes("*")).map((e) => e[0]);
  for (const route of prerenderRulePaths) {
    routes.add(route);
  }
  await nitro.hooks.callHook("prerender:routes", routes);
  if (routes.size === 0) {
    if (nitro.options.prerender.crawlLinks) {
      routes.add("/");
    } else {
      return;
    }
  }
  nitro.logger.info("Initializing prerenderer");
  nitro._prerenderedRoutes = [];
  nitro._prerenderMeta = nitro._prerenderMeta || {};
  const prerendererConfig = {
    ...nitro.options._config,
    static: false,
    rootDir: nitro.options.rootDir,
    logLevel: 0,
    preset: "nitro-prerender"
  };
  await nitro.hooks.callHook("prerender:config", prerendererConfig);
  const nitroRenderer = await createNitro(prerendererConfig);
  const prerenderStartTime = Date.now();
  await nitro.hooks.callHook("prerender:init", nitroRenderer);
  let path = relative(nitro.options.output.dir, nitro.options.output.publicDir);
  if (!path.startsWith(".")) {
    path = `./${path}`;
  }
  nitroRenderer.options.commands.preview = `npx serve ${path}`;
  nitroRenderer.options.output.dir = nitro.options.output.dir;
  await build(nitroRenderer);
  const serverFilename = typeof nitroRenderer.options.rollupConfig?.output?.entryFileNames === "string" ? nitroRenderer.options.rollupConfig.output.entryFileNames : "index.mjs";
  const serverEntrypoint = resolve(
    nitroRenderer.options.output.serverDir,
    serverFilename
  );
  const { closePrerenderer, localFetch } = await import(pathToFileURL(serverEntrypoint).href);
  const _routeRulesMatcher = toRouteMatcher(
    createRouter({ routes: nitro.options.routeRules })
  );
  const _getRouteRules = (path2) => defu({}, ..._routeRulesMatcher.matchAll(path2).reverse());
  const generatedRoutes = /* @__PURE__ */ new Set();
  const failedRoutes = /* @__PURE__ */ new Set();
  const skippedRoutes = /* @__PURE__ */ new Set();
  const displayedLengthWarns = /* @__PURE__ */ new Set();
  const publicAssetBases = nitro.options.publicAssets.filter(
    (a) => !!a.baseURL && a.baseURL !== "/" && !a.fallthrough
  ).map((a) => withTrailingSlash(a.baseURL));
  const scannedPublicAssets = nitro.options.prerender.ignoreUnprefixedPublicAssets ? new Set(await scanUnprefixedPublicAssets(nitro)) : /* @__PURE__ */ new Set();
  const canPrerender = (route = "/") => {
    if (generatedRoutes.has(route) || skippedRoutes.has(route)) {
      return false;
    }
    for (const pattern of nitro.options.prerender.ignore) {
      if (matchesIgnorePattern(route, pattern)) {
        return false;
      }
    }
    if (publicAssetBases.some((base) => route.startsWith(base))) {
      return false;
    }
    if (scannedPublicAssets.has(route)) {
      return false;
    }
    if (_getRouteRules(route).prerender === false) {
      return false;
    }
    return true;
  };
  const canWriteToDisk = (route) => {
    if (route.route.includes("?")) {
      return false;
    }
    const FS_MAX_SEGMENT = 255;
    const FS_MAX_PATH = 1024;
    const FS_MAX_PATH_PUBLIC_HTML = FS_MAX_PATH - (nitro.options.output.publicDir.length + 10);
    if ((route.route.length >= FS_MAX_PATH_PUBLIC_HTML || route.route.split("/").some((s) => s.length > FS_MAX_SEGMENT)) && !displayedLengthWarns.has(route)) {
      displayedLengthWarns.add(route);
      const _route = route.route.slice(0, 60) + "...";
      if (route.route.length >= FS_MAX_PATH_PUBLIC_HTML) {
        nitro.logger.warn(
          `Prerendering long route "${_route}" (${route.route.length}) can cause filesystem issues since it exceeds ${FS_MAX_PATH_PUBLIC_HTML}-character limit when writing to \`${nitro.options.output.publicDir}\`.`
        );
      } else {
        nitro.logger.warn(
          `Skipping prerender of the route "${_route}" since it exceeds the ${FS_MAX_SEGMENT}-character limit in one of the path segments and can cause filesystem issues.`
        );
        return false;
      }
    }
    return true;
  };
  const generateRoute = async (route) => {
    const start = Date.now();
    route = decodeURI(route);
    if (!canPrerender(route)) {
      skippedRoutes.add(route);
      return;
    }
    generatedRoutes.add(route);
    const _route = { route };
    const encodedRoute = encodeURI(route);
    const res = await localFetch(
      withBase(encodedRoute, nitro.options.baseURL),
      {
        headers: { "x-nitro-prerender": encodedRoute },
        retry: nitro.options.prerender.retry,
        retryDelay: nitro.options.prerender.retryDelay
      }
    );
    let dataBuff = Buffer.from(await res.arrayBuffer());
    Object.defineProperty(_route, "contents", {
      get: () => {
        return dataBuff ? dataBuff.toString("utf8") : void 0;
      },
      set(value) {
        if (dataBuff) {
          dataBuff = Buffer.from(value);
        }
      }
    });
    Object.defineProperty(_route, "data", {
      get: () => {
        return dataBuff ? dataBuff.buffer : void 0;
      },
      set(value) {
        if (dataBuff) {
          dataBuff = Buffer.from(value);
        }
      }
    });
    const redirectCodes = [301, 302, 303, 304, 307, 308];
    if (![200, ...redirectCodes].includes(res.status)) {
      _route.error = new Error(`[${res.status}] ${res.statusText}`);
      _route.error.statusCode = res.status;
      _route.error.statusMessage = res.statusText;
    }
    _route.generateTimeMS = Date.now() - start;
    const contentType = res.headers.get("content-type") || "";
    const isImplicitHTML = !route.endsWith(".html") && contentType.includes("html") && !JsonSigRx.test(dataBuff.subarray(0, 32).toString("utf8"));
    const routeWithIndex = route.endsWith("/") ? route + "index" : route;
    const htmlPath = route.endsWith("/") || nitro.options.prerender.autoSubfolderIndex ? joinURL(route, "index.html") : route + ".html";
    _route.fileName = withoutBase(
      isImplicitHTML ? htmlPath : routeWithIndex,
      nitro.options.baseURL
    );
    const inferredContentType = mime.getType(_route.fileName) || "text/plain";
    _route.contentType = contentType || inferredContentType;
    await nitro.hooks.callHook("prerender:generate", _route, nitro);
    if (_route.contentType !== inferredContentType) {
      nitro._prerenderMeta[_route.fileName] ||= {};
      nitro._prerenderMeta[_route.fileName].contentType = _route.contentType;
    }
    if (_route.error) {
      failedRoutes.add(_route);
    }
    if (_route.skip || _route.error) {
      await nitro.hooks.callHook("prerender:route", _route);
      nitro.logger.log(formatPrerenderRoute(_route));
      dataBuff = void 0;
      return _route;
    }
    if (canWriteToDisk(_route)) {
      const filePath = join$1(nitro.options.output.publicDir, _route.fileName);
      await writeFile(filePath, dataBuff);
      nitro._prerenderedRoutes.push(_route);
    } else {
      _route.skip = true;
    }
    if (!_route.error && (isImplicitHTML || route.endsWith(".html"))) {
      const extractedLinks = await extractLinks(
        dataBuff.toString("utf8"),
        route,
        res,
        nitro.options.prerender.crawlLinks
      );
      for (const _link of extractedLinks) {
        if (canPrerender(_link)) {
          routes.add(_link);
        }
      }
    }
    await nitro.hooks.callHook("prerender:route", _route);
    nitro.logger.log(formatPrerenderRoute(_route));
    dataBuff = void 0;
    return _route;
  };
  nitro.logger.info(
    nitro.options.prerender.crawlLinks ? `Prerendering ${routes.size} initial routes with crawler` : `Prerendering ${routes.size} routes`
  );
  await runParallel(routes, generateRoute, {
    concurrency: nitro.options.prerender.concurrency,
    interval: nitro.options.prerender.interval
  });
  await closePrerenderer();
  await nitro.hooks.callHook("prerender:done", {
    prerenderedRoutes: nitro._prerenderedRoutes,
    failedRoutes: [...failedRoutes]
  });
  if (nitro.options.prerender.failOnError && failedRoutes.size > 0) {
    nitro.logger.log("\nErrors prerendering:");
    for (const route of failedRoutes) {
      const parents = linkParents.get(route.route);
      parents?.size ? `
${[...parents.values()].map((link) => colors.gray(`  \u2502 \u2514\u2500\u2500 Linked from ${link}`)).join("\n")}` : "";
      nitro.logger.log(formatPrerenderRoute(route));
    }
    nitro.logger.log("");
    throw new Error("Exiting due to prerender errors.");
  }
  const prerenderTimeInMs = Date.now() - prerenderStartTime;
  nitro.logger.info(
    `Prerendered ${nitro._prerenderedRoutes.length} routes in ${prerenderTimeInMs / 1e3} seconds`
  );
  if (nitro.options.compressPublicAssets) {
    await compressPublicAssets(nitro);
  }
}

function createHTTPProxy(defaults = {}) {
  const proxy = createProxyServer(defaults);
  proxy.on("proxyReq", (proxyReq, req) => {
    if (!proxyReq.hasHeader("x-forwarded-for")) {
      const address = req.socket.remoteAddress;
      if (address) {
        proxyReq.appendHeader("x-forwarded-for", address);
      }
    }
    if (!proxyReq.hasHeader("x-forwarded-port")) {
      const localPort = req?.socket?.localPort;
      if (localPort) {
        proxyReq.setHeader("x-forwarded-port", req.socket.localPort);
      }
    }
    if (!proxyReq.hasHeader("x-forwarded-Proto")) {
      const encrypted = req?.connection?.encrypted;
      proxyReq.setHeader("x-forwarded-proto", encrypted ? "https" : "http");
    }
  });
  const handleEvent = async (event, opts = {}) => {
    try {
      event._handled = true;
      await proxy.web(event.node.req, event.node.res, opts);
    } catch (error) {
      try {
        event.node.res.setHeader("refresh", "3");
      } catch {
      }
      throw createError({
        statusCode: 503,
        message: "Dev server is unavailable.",
        cause: error
      });
    }
  };
  return {
    proxy,
    handleEvent
  };
}

class NodeDevWorker {
  closed = false;
  #id;
  #workerDir;
  #hooks;
  #address;
  #proxy;
  #worker;
  constructor(id, workerDir, hooks = {}) {
    this.#id = id;
    this.#workerDir = workerDir;
    this.#hooks = hooks;
    this.#proxy = createHTTPProxy();
    this.#initWorker();
  }
  get ready() {
    return Boolean(
      !this.closed && this.#address && this.#proxy && this.#worker
    );
  }
  async handleEvent(event) {
    if (!this.#address || !this.#proxy) {
      throw createError({
        status: 503,
        statusText: "Dev worker is unavailable"
      });
    }
    await this.#proxy.handleEvent(event, { target: this.#address });
  }
  handleUpgrade(req, socket, head) {
    if (!this.ready) {
      return;
    }
    return this.#proxy.proxy.ws(
      req,
      socket,
      { target: this.#address, xfwd: true },
      head
    );
  }
  #initWorker() {
    const workerEntryPath = join$1(this.#workerDir, "index.mjs");
    if (!existsSync(workerEntryPath)) {
      this.close(`worker entry not found in "${workerEntryPath}".`);
      return;
    }
    const worker = new Worker(workerEntryPath, {
      env: {
        ...process.env,
        NITRO_DEV_WORKER_ID: String(this.#id)
      }
    });
    worker.once("exit", (code) => {
      worker._exitCode = code;
      this.close(`worker exited with code ${code}`);
    });
    worker.once("error", (error) => {
      this.close(error);
    });
    worker.on("message", (message) => {
      if (message?.address) {
        this.#address = message.address;
        this.#hooks.onReady?.(this, this.#address);
      }
    });
    this.#worker = worker;
  }
  async close(cause) {
    if (this.closed) {
      return;
    }
    this.closed = true;
    this.#hooks.onClose?.(this, cause);
    this.#hooks = {};
    const onError = (error) => consola.error(error);
    await this.#closeWorker().catch(onError);
    await this.#closeProxy().catch(onError);
    await this.#closeSocket().catch(onError);
  }
  async #closeProxy() {
    this.#proxy?.proxy?.close(() => {
    });
    this.#proxy = void 0;
  }
  async #closeSocket() {
    const socketPath = this.#address?.socketPath;
    if (socketPath && socketPath[0] !== "\0" && !socketPath.startsWith(String.raw`\\.\pipe`)) {
      await rm(socketPath).catch(() => {
      });
    }
    this.#address = void 0;
  }
  async #closeWorker() {
    if (!this.#worker) {
      return;
    }
    this.#worker.postMessage({ event: "shutdown" });
    if (!this.#worker._exitCode && !isTest && !isCI) {
      await new Promise((resolve) => {
        const gracefulShutdownTimeoutSec = Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 5;
        const timeout = setTimeout(() => {
          if (process.env.DEBUG) {
            consola.warn(`force closing dev worker...`);
          }
        }, gracefulShutdownTimeoutSec * 1e3);
        this.#worker?.on("message", (message) => {
          if (message.event === "exit") {
            clearTimeout(timeout);
            resolve();
          }
        });
      });
    }
    this.#worker.removeAllListeners();
    await this.#worker.terminate().catch((error) => {
      consola.error(error);
    });
    this.#worker = void 0;
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    const status = this.closed ? "closed" : this.ready ? "ready" : "pending";
    return `NodeDevWorker#${this.#id}(${status})`;
  }
}

function defineNitroErrorHandler(handler) {
  return handler;
}

const devErrorHandler = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = import.meta.baseURL || "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json || !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve$1(dirname$1(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

function createVFSHandler(nitro) {
  return eventHandler(async (event) => {
    const ip = getRequestIP(event, { xForwardedFor: false });
    const isLocalRequest = ip && /^::1$|^127\.\d+\.\d+\.\d+$/.test(ip);
    if (!isLocalRequest) {
      throw createError({
        message: `Forbidden IP: "${ip || "?"}"`,
        statusCode: 403
      });
    }
    const vfsEntries = {
      ...nitro.vfs,
      ...nitro.options.virtual
    };
    const url = event.path || "";
    const isJson = url.endsWith(".json") || getRequestHeader(event, "accept")?.includes("application/json");
    const id = decodeURIComponent(url.replace(/^(\.json)?\/?/, "") || "");
    if (id && !(id in vfsEntries)) {
      throw createError({ message: "File not found", statusCode: 404 });
    }
    let content = id ? vfsEntries[id] : void 0;
    if (typeof content === "function") {
      content = await content();
    }
    if (isJson) {
      return {
        rootDir: nitro.options.rootDir,
        entries: Object.keys(vfsEntries).map((id2) => ({
          id: id2,
          path: "/_vfs.json/" + encodeURIComponent(id2)
        })),
        current: id ? {
          id,
          content
        } : null
      };
    }
    const directories = { [nitro.options.rootDir]: {} };
    const fpaths = Object.keys(vfsEntries);
    for (const item of fpaths) {
      const segments = item.replace(nitro.options.rootDir, "").split("/").filter(Boolean);
      let currentDir = item.startsWith(nitro.options.rootDir) ? directories[nitro.options.rootDir] : directories;
      for (const segment of segments) {
        if (!currentDir[segment]) {
          currentDir[segment] = {};
        }
        currentDir = currentDir[segment];
      }
    }
    const generateHTML = (directory, path = []) => Object.entries(directory).map(([fname, value = {}]) => {
      const subpath = [...path, fname];
      const key = subpath.join("/");
      const encodedUrl = encodeURIComponent(key);
      const linkClass = url === `/${encodedUrl}` ? "bg-gray-700 text-white" : "hover:bg-gray-800 text-gray-200";
      return Object.keys(value).length === 0 ? `
            <li class="flex flex-nowrap">
              <a href="/_vfs/${encodedUrl}" class="w-full text-sm px-2 py-1 border-b border-gray-10 ${linkClass}">
                ${fname}
              </a>
            </li>
            ` : `
            <li>
              <details ${url.startsWith(`/${encodedUrl}`) ? "open" : ""}>
                <summary class="w-full text-sm px-2 py-1 border-b border-gray-10 hover:bg-gray-800 text-gray-200">
                  ${fname}
                </summary>
                <ul class="ml-4">
                  ${generateHTML(value, subpath)}
                </ul>
              </details>
            </li>
            `;
    }).join("");
    const rootDirectory = directories[nitro.options.rootDir];
    delete directories[nitro.options.rootDir];
    const items = generateHTML(rootDirectory, [nitro.options.rootDir]) + generateHTML(directories);
    const files = `
      <div class="h-full overflow-auto border-r border-gray:10">
        <p class="text-white text-bold text-center py-1 opacity-50">Virtual Files</p>
        <ul class="flex flex-col">${items}</ul>
      </div>
      `;
    const file = id ? editorTemplate({
      readOnly: true,
      language: id.endsWith("html") ? "html" : "javascript",
      theme: "vs-dark",
      value: content,
      wordWrap: "wordWrapColumn",
      wordWrapColumn: 80
    }) : `
        <div class="w-full h-full flex opacity-50">
          <h1 class="text-white m-auto">Select a virtual file to inspect</h1>
        </div>
      `;
    return (
      /* html */
      `
<!doctype html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css" />
  <link rel="stylesheet" data-name="vs/editor/editor.main" href="${vsUrl}/editor/editor.main.min.css">
  <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"><\/script>
  <style>
    html {
      background: #1E1E1E;
      color: white;
    }
    [un-cloak] {
      display: none;
    }
  </style>
</head>
<body class="bg-[#1E1E1E]">
  <div un-cloak class="h-screen grid grid-cols-[300px_1fr]">
    ${files}
    ${file}
  </div>
</body>
</html>`
    );
  });
}
const monacoVersion = "0.30.0";
const monacoUrl = `https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${monacoVersion}/min`;
const vsUrl = `${monacoUrl}/vs`;
const editorTemplate = (options) => `
<div id="editor" class="min-h-screen w-full h-full"></div>
<script src="${vsUrl}/loader.min.js"><\/script>
<script>
  require.config({ paths: { vs: '${vsUrl}' } })

  const proxy = URL.createObjectURL(new Blob([\`
    self.MonacoEnvironment = { baseUrl: '${monacoUrl}' }
    importScripts('${vsUrl}/base/worker/workerMain.min.js')
  \`], { type: 'text/javascript' }))
  window.MonacoEnvironment = { getWorkerUrl: () => proxy }

  setTimeout(() => {
    require(['vs/editor/editor.main'], function () {
      monaco.editor.create(document.getElementById('editor'), ${JSON.stringify(
  options
)})
    })
  }, 0);
<\/script>
`;

function createDevServer(nitro) {
  const devServer = new DevServer(nitro);
  return {
    reload: () => devServer.reload(),
    listen: (port, opts) => devServer.listen(port, opts),
    close: () => devServer.close(),
    upgrade: (req, socket, head) => devServer.handleUpgrade(req, socket, head),
    get app() {
      return devServer.app;
    },
    get watcher() {
      return devServer.watcher;
    }
  };
}
let workerIdCtr = 0;
class DevServer {
  nitro;
  workerDir;
  app;
  listeners = [];
  reloadPromise;
  watcher;
  workers = [];
  workerError;
  building = true;
  buildError;
  constructor(nitro) {
    this.nitro = nitro;
    this.workerDir = resolve(
      nitro.options.output.dir,
      nitro.options.output.serverDir
    );
    this.app = this.createApp();
    nitro.hooks.hook("close", () => this.close());
    nitro.hooks.hook("dev:start", () => {
      this.building = true;
      this.buildError = void 0;
    });
    nitro.hooks.hook("dev:reload", () => {
      this.buildError = void 0;
      this.building = false;
      this.reload();
    });
    nitro.hooks.hook("dev:error", (cause) => {
      this.buildError = cause;
      this.building = false;
      for (const worker of this.workers) {
        worker.close();
      }
    });
    if (nitro.options.devServer.watch.length > 0) {
      const debouncedReload = debounce(() => this.reload());
      this.watcher = watch(
        nitro.options.devServer.watch,
        nitro.options.watchOptions
      );
      this.watcher.on("add", debouncedReload).on("change", debouncedReload);
    }
  }
  async listen(port, opts) {
    const listener = await listen(toNodeListener(this.app), { port, ...opts });
    this.listeners.push(listener);
    listener.server.on(
      "upgrade",
      (req, sock, head) => this.handleUpgrade(req, sock, head)
    );
    return listener;
  }
  async close() {
    await Promise.all(
      [
        Promise.all(this.listeners.map((l) => l.close())).then(() => {
          this.listeners = [];
        }),
        Promise.all(this.workers.map((w) => w.close())).then(() => {
          this.workers = [];
        }),
        Promise.resolve(this.watcher?.close()).then(() => {
          this.watcher = void 0;
        })
      ].map(
        (p) => p.catch((error) => {
          consola.error(error);
        })
      )
    );
  }
  reload() {
    for (const worker2 of this.workers) {
      worker2.close();
    }
    const worker = new NodeDevWorker(++workerIdCtr, this.workerDir, {
      onClose: (worker2, cause) => {
        this.workerError = cause;
        const index = this.workers.indexOf(worker2);
        if (index !== -1) {
          this.workers.splice(index, 1);
        }
      },
      onReady: (worker2, addr) => {
        this.writeBuildInfo(worker2, addr);
      }
    });
    if (!worker.closed) {
      this.workers.unshift(worker);
    }
  }
  async getWorker() {
    let retry = 0;
    const maxRetries = isTest || isCI ? 100 : 10;
    while (this.building || ++retry < maxRetries) {
      if ((this.workers.length === 0 || this.buildError) && !this.building) {
        return;
      }
      const activeWorker = this.workers.find((w) => w.ready);
      if (activeWorker) {
        return activeWorker;
      }
      await new Promise((resolve2) => setTimeout(resolve2, 600));
    }
  }
  writeBuildInfo(_worker, addr) {
    const buildInfoPath = resolve(this.nitro.options.buildDir, "nitro.json");
    const buildInfo = {
      date: (/* @__PURE__ */ new Date()).toJSON(),
      preset: this.nitro.options.preset,
      framework: this.nitro.options.framework,
      versions: {
        nitro: version
      },
      dev: {
        pid: process.pid,
        workerAddress: addr
      }
    };
    writeFile$1(buildInfoPath, JSON.stringify(buildInfo, null, 2)).catch(
      (error) => {
        consola.error(error);
      }
    );
  }
  createApp() {
    const app = createApp({
      onError: async (error, event) => {
        const errorHandler = this.nitro.options.devErrorHandler || devErrorHandler;
        await loadStackTrace(error).catch(() => {
        });
        return errorHandler(error, event, {
          defaultHandler: defaultHandler
        });
      }
    });
    for (const handler of this.nitro.options.devHandlers) {
      app.use(handler.route || "/", handler.handler);
    }
    app.use("/_vfs", createVFSHandler(this.nitro));
    for (const asset of this.nitro.options.publicAssets) {
      const url = joinURL(
        this.nitro.options.runtimeConfig.app.baseURL,
        asset.baseURL || "/"
      );
      app.use(
        url,
        fromNodeMiddleware(
          serveStatic(asset.dir, {
            dotfiles: "allow"
          })
        )
      );
      if (!asset.fallthrough) {
        app.use(url, fromNodeMiddleware(servePlaceholder()));
      }
    }
    const routes = Object.keys(this.nitro.options.devProxy).sort().reverse();
    for (const route of routes) {
      let opts = this.nitro.options.devProxy[route];
      if (typeof opts === "string") {
        opts = { target: opts };
      }
      const proxy = createHTTPProxy(opts);
      app.use(
        route,
        eventHandler((event) => proxy.handleEvent(event))
      );
    }
    app.use(
      eventHandler(async (event) => {
        const worker = await this.getWorker();
        if (!worker) {
          return this.#generateError();
        }
        return worker.handleEvent(event);
      })
    );
    return app;
  }
  async handleUpgrade(req, socket, head) {
    const worker = await this.getWorker();
    if (!worker) {
      throw createError({
        statusCode: 503,
        message: "No worker available."
      });
    }
    return worker.handleUpgrade(req, socket, head);
  }
  #generateError() {
    const error = this.buildError || this.workerError;
    if (error) {
      try {
        error.unhandled = false;
        let id = error.id || error.path;
        if (id) {
          const cause = error.errors?.[0];
          const loc = error.location || error.loc || cause?.location || cause?.loc;
          if (loc) {
            id += `:${loc.line}:${loc.column}`;
          }
          error.stack = (error.stack || "").replace(
            /(^\s*at\s+.+)/m,
            `    at ${id}
$1`
          );
        }
      } catch {
      }
      return createError(error);
    }
    return new Response(
      JSON.stringify(
        {
          error: "Dev server is unavailable.",
          hint: "Please reload the page and check the console for errors if the issue persists."
        },
        null,
        2
      ),
      {
        status: 503,
        statusText: "Dev server is unavailable",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          Refresh: "3"
        }
      }
    );
  }
}

async function prepare(nitro) {
  await prepareDir(nitro.options.output.dir);
  if (!nitro.options.noPublicDir) {
    await prepareDir(nitro.options.output.publicDir);
  }
  if (!nitro.options.static) {
    await prepareDir(nitro.options.output.serverDir);
  }
}
async function prepareDir(dir) {
  await fsp.rm(dir, { recursive: true, force: true });
  await fsp.mkdir(dir, { recursive: true });
}

function defineNitroConfig(config) {
  return config;
}

export { GLOB_SCAN_PATTERN, build, copyPublicAssets, createDevServer, createNitro, defineNitroConfig, listTasks, loadOptions, prepare, prerender, runTask, scanHandlers, scanMiddleware, scanModules, scanPlugins, scanServerRoutes, scanTasks, writeTypes };
