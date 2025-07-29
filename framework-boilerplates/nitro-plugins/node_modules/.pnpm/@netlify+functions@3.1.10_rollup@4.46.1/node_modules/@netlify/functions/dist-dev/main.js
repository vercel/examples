// dev/main.ts
import { Buffer as Buffer2 } from "node:buffer";

// dev/registry.ts
import { stat } from "node:fs/promises";
import { createRequire as createRequire2 } from "node:module";
import { basename as basename2, extname as extname2, isAbsolute, join, resolve } from "node:path";
import { env } from "node:process";
import { watchDebounced } from "@netlify/dev-utils";
import { listFunctions } from "@netlify/zip-it-and-ship-it";
import extractZip from "extract-zip";

// dev/function.ts
import { basename, extname } from "node:path";
import { version as nodeVersion } from "node:process";
import { headers as netlifyHeaders } from "@netlify/dev-utils";
import CronParser from "cron-parser";
import semver from "semver";
var BACKGROUND_FUNCTION_SUFFIX = "-background";
var TYPESCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".cts", ".mts", ".ts"]);
var V2_MIN_NODE_VERSION = "18.14.0";
var difference = (setA, setB) => new Set([...setA].filter((item) => !setB.has(item)));
var getNextRun = function(schedule) {
  const cron = CronParser.parseExpression(schedule, {
    tz: "Etc/UTC"
  });
  return cron.next().toDate();
};
var getBlobsEventProperty = (context) => ({
  primary_region: context.primaryRegion,
  url: context.edgeURL,
  url_uncached: context.edgeURL,
  token: context.token
});
var NetlifyFunction = class {
  name;
  mainFile;
  displayName;
  schedule;
  runtime;
  blobsContext;
  config;
  directory;
  projectRoot;
  settings;
  targetDirectory;
  timeoutBackground;
  timeoutSynchronous;
  // Determines whether this is a background function based on the function
  // name.
  isBackground;
  buildQueue;
  buildData;
  buildError = null;
  // List of the function's source files. This starts out as an empty set
  // and will get populated on every build.
  srcFiles = /* @__PURE__ */ new Set();
  excludedRoutes;
  routes;
  constructor({
    blobsContext,
    config,
    directory,
    displayName,
    excludedRoutes,
    mainFile,
    name,
    projectRoot,
    routes,
    runtime,
    settings,
    targetDirectory,
    timeoutBackground,
    timeoutSynchronous
  }) {
    this.blobsContext = blobsContext;
    this.config = config;
    this.directory = directory;
    this.excludedRoutes = excludedRoutes;
    this.mainFile = mainFile;
    this.name = name;
    this.displayName = displayName ?? name;
    this.projectRoot = projectRoot;
    this.routes = routes;
    this.runtime = runtime;
    this.targetDirectory = targetDirectory;
    this.timeoutBackground = timeoutBackground;
    this.timeoutSynchronous = timeoutSynchronous;
    this.settings = settings;
    this.isBackground = name.endsWith(BACKGROUND_FUNCTION_SUFFIX);
    const functionConfig = config.functions && config.functions[name];
    this.schedule = functionConfig && functionConfig.schedule;
    this.srcFiles = /* @__PURE__ */ new Set();
  }
  get filename() {
    if (!this.buildData?.mainFile) {
      return null;
    }
    return basename(this.buildData.mainFile);
  }
  getRecommendedExtension() {
    if (this.buildData?.runtimeAPIVersion !== 2) {
      return;
    }
    const extension = this.buildData?.mainFile ? extname(this.buildData.mainFile) : void 0;
    const moduleFormat = this.buildData?.outputModuleFormat;
    if (moduleFormat === "esm") {
      return;
    }
    if (extension === ".ts") {
      return ".mts";
    }
    if (extension === ".js") {
      return ".mjs";
    }
  }
  hasValidName() {
    return /^[A-Za-z0-9_-]+$/.test(this.name);
  }
  async isScheduled() {
    await this.buildQueue;
    return Boolean(this.schedule);
  }
  isSupported() {
    return !(this.buildData?.runtimeAPIVersion === 2 && semver.lt(nodeVersion, V2_MIN_NODE_VERSION));
  }
  isTypeScript() {
    if (this.filename === null) {
      return false;
    }
    return TYPESCRIPT_EXTENSIONS.has(extname(this.filename));
  }
  async getNextRun() {
    if (!await this.isScheduled()) {
      return null;
    }
    return getNextRun(this.schedule);
  }
  // The `build` method transforms source files into invocable functions. Its
  // return value is an object with:
  //
  // - `srcFilesDiff`: Files that were added and removed since the last time
  //    the function was built.
  async build({ cache }) {
    this.buildQueue = this.runtime.getBuildFunction({
      config: this.config,
      directory: this.directory,
      func: this,
      projectRoot: this.projectRoot,
      targetDirectory: this.targetDirectory
    }).then((buildFunction2) => buildFunction2({ cache }));
    try {
      const buildData = await this.buildQueue;
      if (buildData === void 0) {
        throw new Error(`Could not build function ${this.name}`);
      }
      const { includedFiles = [], routes, schedule, srcFiles } = buildData;
      const srcFilesSet = new Set(srcFiles);
      const srcFilesDiff = this.getSrcFilesDiff(srcFilesSet);
      this.buildData = buildData;
      this.buildError = null;
      this.routes = routes;
      this.srcFiles = srcFilesSet;
      this.schedule = schedule || this.schedule;
      if (!this.isSupported()) {
        throw new Error(
          `Function requires Node.js version ${V2_MIN_NODE_VERSION} or above, but ${nodeVersion.slice(
            1
          )} is installed. Refer to https://ntl.fyi/functions-runtime for information on how to update.`
        );
      }
      return { includedFiles, srcFilesDiff };
    } catch (error) {
      if (error instanceof Error) {
        this.buildError = error;
      }
      return { error };
    }
  }
  async getBuildData() {
    await this.buildQueue;
    return this.buildData;
  }
  // Compares a new set of source files against a previous one, returning an
  // object with two Sets, one with added and the other with deleted files.
  getSrcFilesDiff(newSrcFiles) {
    const added = difference(newSrcFiles, this.srcFiles);
    const deleted = difference(this.srcFiles, newSrcFiles);
    return {
      added,
      deleted
    };
  }
  // Invokes the function and returns its response object.
  async invoke({ buildCache = {}, clientContext = {}, request, route }) {
    if (!this.buildQueue) {
      this.build({ cache: buildCache });
    }
    await this.buildQueue;
    if (this.buildError) {
      throw this.buildError;
    }
    const timeout = this.isBackground ? this.timeoutBackground : this.timeoutSynchronous;
    const environment = {};
    if (this.blobsContext) {
      const payload = JSON.stringify(getBlobsEventProperty(this.blobsContext));
      request.headers.set(netlifyHeaders.BlobsInfo, Buffer.from(payload).toString("base64"));
    }
    return await this.runtime.invokeFunction({
      context: clientContext,
      environment,
      func: this,
      request,
      route,
      timeout
    });
  }
  /**
   * Matches all routes agains the incoming request. If a match is found, then the matched route is returned.
   * @returns matched route
   */
  async matchURLPath(rawPath, method) {
    let path2 = rawPath !== "/" && rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath;
    path2 = path2.toLowerCase();
    const { excludedRoutes = [], routes = [] } = this;
    const matchingRoute = routes.find((route) => {
      if (route.methods && route.methods.length !== 0 && !route.methods.includes(method)) {
        return false;
      }
      if ("literal" in route && route.literal !== void 0) {
        return path2 === route.literal;
      }
      if ("expression" in route && route.expression !== void 0) {
        const regex = new RegExp(route.expression);
        return regex.test(path2);
      }
      return false;
    });
    if (!matchingRoute) {
      return;
    }
    const isExcluded = excludedRoutes.some((excludedRoute) => {
      if ("literal" in excludedRoute && excludedRoute.literal !== void 0) {
        return path2 === excludedRoute.literal;
      }
      if ("expression" in excludedRoute && excludedRoute.expression !== void 0) {
        const regex = new RegExp(excludedRoute.expression);
        return regex.test(path2);
      }
      return false;
    });
    if (isExcluded) {
      return;
    }
    return matchingRoute;
  }
  get runtimeAPIVersion() {
    return this.buildData?.runtimeAPIVersion ?? 1;
  }
  setRoutes(routes) {
    if (this.buildData) {
      this.buildData.routes = routes;
    }
  }
  get url() {
    const port = this.settings.port || this.settings.functionsPort;
    const protocol = this.settings.https ? "https" : "http";
    const url = new URL(`/.netlify/functions/${this.name}`, `${protocol}://localhost:${port}`);
    return url.href;
  }
};

// dev/runtimes/nodejs/index.ts
import { createConnection } from "node:net";
import { pathToFileURL } from "node:url";
import { Worker } from "node:worker_threads";
import lambdaLocal from "lambda-local";

// dev/runtimes/nodejs/builder.ts
import { writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { memoize } from "@netlify/dev-utils";
import { zipFunction, listFunction } from "@netlify/zip-it-and-ship-it";
import decache from "decache";
import { readPackageUp } from "read-package-up";
import sourceMapSupport from "source-map-support";

// dev/runtimes/nodejs/config.ts
var normalizeFunctionsConfig = ({
  functionsConfig = {},
  projectRoot,
  siteEnv = {}
}) => Object.entries(functionsConfig).reduce(
  (result, [pattern, config]) => ({
    ...result,
    [pattern]: {
      externalNodeModules: config.external_node_modules,
      includedFiles: config.included_files,
      includedFilesBasePath: projectRoot,
      ignoredNodeModules: config.ignored_node_modules,
      nodeBundler: config.node_bundler === "esbuild" ? "esbuild_zisi" : config.node_bundler,
      nodeVersion: siteEnv.AWS_LAMBDA_JS_RUNTIME,
      processDynamicNodeImports: true,
      schedule: config.schedule,
      zipGo: true
    }
  }),
  {}
);

// dev/runtimes/nodejs/builder.ts
var require2 = createRequire(import.meta.url);
var serveFunctionsFolder = path.join(".netlify", "functions-serve");
var addFunctionsConfigDefaults = (config) => ({
  ...config,
  "*": {
    nodeSourcemap: true,
    ...config["*"]
  }
});
var buildFunction = async ({
  cache,
  config,
  directory,
  featureFlags,
  func,
  hasTypeModule,
  projectRoot,
  targetDirectory
}) => {
  const zipOptions = {
    archiveFormat: "none",
    basePath: projectRoot,
    config,
    featureFlags: { ...featureFlags, zisi_functions_api_v2: true }
  };
  const functionDirectory = path.dirname(func.mainFile);
  const entryPath = functionDirectory === directory ? func.mainFile : functionDirectory;
  const buildResult = await memoize({
    cache,
    cacheKey: `zisi-${entryPath}`,
    command: () => zipFunction(entryPath, targetDirectory, zipOptions)
  });
  if (!buildResult) {
    return;
  }
  const {
    entryFilename,
    excludedRoutes,
    includedFiles,
    inputs,
    mainFile,
    outputModuleFormat,
    path: functionPath,
    routes,
    runtimeAPIVersion,
    schedule
  } = buildResult;
  const srcFiles = (inputs ?? []).filter((inputPath) => !inputPath.includes(`${path.sep}node_modules${path.sep}`));
  const buildPath = path.join(functionPath, entryFilename);
  if (hasTypeModule) {
    await writeFile(
      path.join(functionPath, `package.json`),
      JSON.stringify({
        type: "commonjs"
      })
    );
  }
  clearFunctionsCache(targetDirectory);
  return {
    buildPath,
    excludedRoutes,
    includedFiles,
    outputModuleFormat,
    mainFile,
    routes,
    runtimeAPIVersion,
    srcFiles,
    schedule,
    targetDirectory
  };
};
var parseFunctionForMetadata = async ({ config, mainFile, projectRoot }) => await listFunction(mainFile, {
  config: netlifyConfigToZisiConfig(config.functions, projectRoot),
  featureFlags: { zisi_functions_api_v2: true },
  parseISC: true
});
var clearFunctionsCache = (functionsPath) => {
  Object.keys(require2.cache).filter((key) => key.startsWith(functionsPath)).forEach(decache);
};
var netlifyConfigToZisiConfig = (functionsConfig, projectRoot) => addFunctionsConfigDefaults(normalizeFunctionsConfig({ functionsConfig, projectRoot }));
var getNoopBuilder = async ({ directory, func, metadata }) => {
  const functionDirectory = path.dirname(func.mainFile);
  const srcFiles = functionDirectory === directory ? [func.mainFile] : [functionDirectory];
  const build = async () => ({
    buildPath: "",
    excludedRoutes: [],
    includedFiles: [],
    mainFile: func.mainFile,
    outputModuleFormat: "cjs",
    routes: [],
    runtimeAPIVersion: func.runtimeAPIVersion,
    schedule: metadata.schedule,
    srcFiles
  });
  return {
    build,
    builderName: ""
  };
};
var getZISIBuilder = async ({
  config,
  directory,
  func,
  metadata,
  projectRoot,
  targetDirectory
}) => {
  const functionsConfig = netlifyConfigToZisiConfig(config.functions, projectRoot);
  const packageJson = await readPackageUp({ cwd: path.dirname(func.mainFile) });
  const hasTypeModule = Boolean(packageJson && packageJson.packageJson.type === "module");
  const featureFlags = {};
  if (metadata.runtimeAPIVersion === 2) {
    featureFlags.zisi_pure_esm = true;
    featureFlags.zisi_pure_esm_mjs = true;
  } else {
    const mustTranspile = [".mjs", ".ts", ".mts", ".cts"].includes(path.extname(func.mainFile));
    const mustUseEsbuild = hasTypeModule || mustTranspile;
    if (mustUseEsbuild && !functionsConfig["*"].nodeBundler) {
      functionsConfig["*"].nodeBundler = "esbuild";
    }
    const { nodeBundler } = functionsConfig["*"];
    const isUsingEsbuild = nodeBundler === "esbuild_zisi" || nodeBundler === "esbuild";
    if (!isUsingEsbuild) {
      return null;
    }
  }
  sourceMapSupport.install();
  return {
    build: ({ cache = {} }) => buildFunction({
      cache,
      config: functionsConfig,
      directory,
      func,
      projectRoot,
      targetDirectory,
      hasTypeModule,
      featureFlags
    }),
    builderName: "zip-it-and-ship-it"
  };
};

// dev/runtimes/nodejs/lambda.ts
import { shouldBase64Encode } from "@netlify/dev-utils";
var headersObjectFromWebHeaders = (webHeaders) => {
  const headers = {};
  const multiValueHeaders = {};
  webHeaders.forEach((value, key) => {
    headers[key] = value;
    multiValueHeaders[key] = value.split(",").map((value2) => value2.trim());
  });
  return {
    headers,
    multiValueHeaders
  };
};
var webHeadersFromHeadersObject = (headersObject) => {
  const headers = new Headers();
  Object.entries(headersObject ?? {}).forEach(([name, value]) => {
    if (value !== void 0) {
      headers.set(name.toLowerCase(), value.toString());
    }
  });
  return headers;
};
var lambdaEventFromWebRequest = async (request, route) => {
  const url = new URL(request.url);
  const queryStringParameters = {};
  const multiValueQueryStringParameters = {};
  url.searchParams.forEach((value, key) => {
    queryStringParameters[key] = queryStringParameters[key] ? `${queryStringParameters[key]},${value}` : value;
    multiValueQueryStringParameters[key] = [...multiValueQueryStringParameters[key], value];
  });
  const { headers, multiValueHeaders } = headersObjectFromWebHeaders(request.headers);
  const body = await request.text() || null;
  return {
    rawUrl: url.toString(),
    rawQuery: url.search,
    path: url.pathname,
    httpMethod: request.method,
    headers,
    multiValueHeaders,
    queryStringParameters,
    multiValueQueryStringParameters,
    body,
    isBase64Encoded: shouldBase64Encode(request.headers.get("content-type") ?? ""),
    route
  };
};
var webResponseFromLambdaResponse = async (lambdaResponse) => {
  return new Response(lambdaResponse.body, {
    headers: webHeadersFromHeadersObject(lambdaResponse.headers),
    status: lambdaResponse.statusCode
  });
};

// dev/runtimes/nodejs/index.ts
var BLOBS_CONTEXT_VARIABLE = "NETLIFY_BLOBS_CONTEXT";
lambdaLocal.getLogger().level = "alert";
var nodeJSRuntime = {
  getBuildFunction: async ({ config, directory, func, projectRoot, targetDirectory }) => {
    const metadata = await parseFunctionForMetadata({ mainFile: func.mainFile, config, projectRoot });
    const zisiBuilder = await getZISIBuilder({ config, directory, func, metadata, projectRoot, targetDirectory });
    if (zisiBuilder) {
      return zisiBuilder.build;
    }
    const noopBuilder = await getNoopBuilder({ config, directory, func, metadata, projectRoot, targetDirectory });
    return noopBuilder.build;
  },
  invokeFunction: async ({ context, environment, func, request, route, timeout }) => {
    const event = await lambdaEventFromWebRequest(request, route);
    const buildData = await func.getBuildData();
    if (buildData?.runtimeAPIVersion !== 2) {
      const lambdaResponse2 = await invokeFunctionDirectly({ context, event, func, timeout });
      return webResponseFromLambdaResponse(lambdaResponse2);
    }
    const workerData = {
      clientContext: JSON.stringify(context),
      environment,
      event,
      // If a function builder has defined a `buildPath` property, we use it.
      // Otherwise, we'll invoke the function's main file.
      // Because we use import() we have to use file:// URLs for Windows.
      entryFilePath: pathToFileURL(buildData?.buildPath ?? func.mainFile).href,
      timeoutMs: timeout * 1e3
    };
    const worker = new Worker(workerURL, { workerData });
    const lambdaResponse = await new Promise((resolve2, reject) => {
      worker.on("message", (result) => {
        if (result?.streamPort) {
          const client = createConnection(
            {
              port: result.streamPort,
              host: "localhost"
            },
            () => {
              result.body = client;
              resolve2(result);
            }
          );
          client.on("error", reject);
        } else {
          resolve2(result);
        }
      });
      worker.on("error", reject);
    });
    return webResponseFromLambdaResponse(lambdaResponse);
  }
};
var workerURL = new URL("worker.js", import.meta.url);
var invokeFunctionDirectly = async ({
  context,
  event,
  func,
  timeout
}) => {
  const buildData = await func.getBuildData();
  const lambdaPath = buildData?.buildPath ?? func.mainFile;
  const result = await lambdaLocal.execute({
    clientContext: JSON.stringify(context),
    environment: {
      // We've set the Blobs context on the parent process, which means it will
      // be available to the Lambda. This would be inconsistent with production
      // where only V2 functions get the context injected. To fix it, unset the
      // context variable before invoking the function.
      // This has the side-effect of also removing the variable from `process.env`.
      [BLOBS_CONTEXT_VARIABLE]: void 0
    },
    event,
    lambdaPath,
    timeoutMs: timeout * 1e3,
    verboseLevel: 3,
    esm: lambdaPath.endsWith(".mjs")
  });
  return result;
};

// dev/runtimes/index.ts
var runtimes = {
  js: nodeJSRuntime
};

// dev/registry.ts
var DEFAULT_FUNCTION_URL_EXPRESSION = /^\/.netlify\/(functions|builders)\/([^/]+).*/;
var TYPES_PACKAGE = "@netlify/functions";
var FunctionsRegistry = class {
  /**
   * Context object for Netlify Blobs
   */
  blobsContext;
  /**
   * The functions held by the registry
   */
  functions = /* @__PURE__ */ new Map();
  /**
   * File watchers for function files. Maps function names to objects built
   * by the `watchDebounced` utility.
   */
  functionWatchers = /* @__PURE__ */ new Map();
  /**
   * Keeps track of whether we've checked whether `TYPES_PACKAGE` is
   * installed.
   */
  hasCheckedTypesPackage = false;
  buildCache;
  config;
  debug;
  destPath;
  directoryWatchers;
  handleEvent;
  frameworksAPIFunctionsPath;
  internalFunctionsPath;
  manifest;
  projectRoot;
  timeouts;
  settings;
  watch;
  constructor({
    blobsContext,
    config,
    debug = false,
    destPath,
    eventHandler,
    frameworksAPIFunctionsPath,
    internalFunctionsPath,
    manifest,
    projectRoot,
    settings,
    timeouts,
    watch
  }) {
    this.blobsContext = blobsContext;
    this.config = config;
    this.debug = debug;
    this.destPath = destPath;
    this.frameworksAPIFunctionsPath = frameworksAPIFunctionsPath;
    this.handleEvent = eventHandler ?? (() => {
    });
    this.internalFunctionsPath = internalFunctionsPath;
    this.projectRoot = projectRoot;
    this.timeouts = timeouts;
    this.settings = settings;
    this.watch = watch === true;
    this.buildCache = {};
    this.directoryWatchers = /* @__PURE__ */ new Map();
    this.manifest = manifest;
  }
  async checkTypesPackage() {
    if (this.hasCheckedTypesPackage) {
      return;
    }
    this.hasCheckedTypesPackage = true;
    const require3 = createRequire2(this.projectRoot);
    try {
      require3.resolve(TYPES_PACKAGE, { paths: [this.projectRoot] });
    } catch (error) {
      if (error?.code === "MODULE_NOT_FOUND") {
        this.handleEvent({ name: "FunctionMissingTypesPackageEvent" });
      }
    }
  }
  /**
   * Builds a function and sets up the appropriate file watchers so that any
   * changes will trigger another build.
   */
  async buildFunctionAndWatchFiles(func, firstLoad = false) {
    if (!firstLoad) {
      this.handleEvent({ function: func, name: "FunctionReloadingEvent" });
    }
    const { error: buildError, includedFiles, srcFilesDiff } = await func.build({ cache: this.buildCache });
    if (buildError) {
      this.handleEvent({ function: func, name: "FunctionBuildErrorEvent" });
    } else {
      this.handleEvent({ firstLoad, function: func, name: "FunctionLoadedEvent" });
    }
    if (func.isTypeScript()) {
      this.checkTypesPackage();
    }
    if (!srcFilesDiff) {
      return;
    }
    if (!this.watch) {
      return;
    }
    const watcher = this.functionWatchers.get(func.name);
    if (watcher) {
      srcFilesDiff.deleted.forEach((path2) => {
        watcher.unwatch(path2);
      });
      srcFilesDiff.added.forEach((path2) => {
        watcher.add(path2);
      });
      return;
    }
    if (srcFilesDiff.added.size !== 0) {
      const filesToWatch = [...srcFilesDiff.added, ...includedFiles];
      const newWatcher = await watchDebounced(filesToWatch, {
        onChange: () => {
          this.buildFunctionAndWatchFiles(func, false);
        }
      });
      this.functionWatchers.set(func.name, newWatcher);
    }
  }
  set eventHandler(handler) {
    this.handleEvent = handler;
  }
  /**
   * Returns a function by name.
   */
  get(name) {
    return this.functions.get(name);
  }
  /**
   * Looks for the first function that matches a given URL path. If a match is
   * found, returns an object with the function and the route. If the URL path
   * matches the default functions URL (i.e. can only be for a function) but no
   * function with the given name exists, returns an object with the function
   * and the route set to `null`. Otherwise, `undefined` is returned,
   */
  async getFunctionForURLPath(urlPath, method) {
    const url = new URL(`http://localhost${urlPath}`);
    const defaultURLMatch = url.pathname.match(DEFAULT_FUNCTION_URL_EXPRESSION);
    if (defaultURLMatch) {
      const func = this.get(defaultURLMatch[2]);
      if (!func) {
        return { func: null, route: null };
      }
      const { routes = [] } = func;
      if (routes.length !== 0) {
        this.handleEvent({
          function: func,
          name: "FunctionNotInvokableOnPathEvent",
          urlPath
        });
        return;
      }
      return { func, route: null };
    }
    for (const func of this.functions.values()) {
      const route = await func.matchURLPath(url.pathname, method);
      if (route) {
        return { func, route };
      }
    }
  }
  isInternalFunction(func) {
    if (this.internalFunctionsPath && func.mainFile.includes(this.internalFunctionsPath)) {
      return true;
    }
    if (this.frameworksAPIFunctionsPath && func.mainFile.includes(this.frameworksAPIFunctionsPath)) {
      return true;
    }
    return false;
  }
  /**
   * Adds a function to the registry
   */
  async registerFunction(name, func, isReload = false) {
    this.handleEvent({ function: func, name: "FunctionRegisteredEvent" });
    if (extname2(func.mainFile) === ".zip") {
      const unzippedDirectory = await this.unzipFunction(func);
      const manifestEntry = (this.manifest?.functions || []).find((manifestFunc) => manifestFunc.name === func.name);
      if (!manifestEntry) {
        return;
      }
      if (this.debug) {
        this.handleEvent({ function: func, name: "FunctionExtractedEvent" });
      }
      func.setRoutes(manifestEntry?.routes);
      try {
        const v2EntryPointPath = join(unzippedDirectory, "___netlify-entry-point.mjs");
        await stat(v2EntryPointPath);
        func.mainFile = v2EntryPointPath;
      } catch {
        func.mainFile = join(unzippedDirectory, basename2(manifestEntry.mainFile));
      }
    } else if (this.watch) {
      this.buildFunctionAndWatchFiles(func, !isReload);
    }
    this.functions.set(name, func);
  }
  /**
   * A proxy to zip-it-and-ship-it's `listFunctions` method. It exists just so
   * that we can mock it in tests.
   */
  // eslint-disable-next-line class-methods-use-this
  async listFunctions(...args) {
    return await listFunctions(...args);
  }
  /**
   * Takes a list of directories and scans for functions. It keeps tracks of
   * any functions in those directories that we've previously seen, and takes
   * care of registering and unregistering functions as they come and go.
   */
  async scan(relativeDirs) {
    const directories = relativeDirs.filter((dir) => Boolean(dir)).map((dir) => isAbsolute(dir) ? dir : join(this.projectRoot, dir));
    if (directories.length === 0) {
      return;
    }
    const functions = await this.listFunctions(directories, {
      featureFlags: {
        buildRustSource: env.NETLIFY_EXPERIMENTAL_BUILD_RUST_SOURCE === "true"
      },
      configFileDirectories: [this.internalFunctionsPath].filter(Boolean),
      config: this.config.functions,
      parseISC: true
    });
    const ignoredFunctions = new Set(
      functions.filter(
        (func) => this.isInternalFunction(func) && this.functions.has(func.name) && !this.isInternalFunction(this.functions.get(func.name))
      ).map((func) => func.name)
    );
    const deletedFunctions = [...this.functions.values()].filter((oldFunc) => {
      const isFound = functions.some(
        (newFunc) => ignoredFunctions.has(newFunc.name) || newFunc.name === oldFunc.name && newFunc.mainFile === oldFunc.mainFile
      );
      return !isFound;
    });
    await Promise.all(deletedFunctions.map((func) => this.unregisterFunction(func)));
    const deletedFunctionNames = new Set(deletedFunctions.map((func) => func.name));
    const addedFunctions = await Promise.all(
      // zip-it-and-ship-it returns an array sorted based on which extension should have precedence,
      // where the last ones precede the previous ones. This is why
      // we reverse the array so we get the right functions precedence in the CLI.
      functions.reverse().map(async ({ displayName, excludedRoutes, mainFile, name, routes, runtime: runtimeName }) => {
        if (ignoredFunctions.has(name)) {
          return;
        }
        const runtime = runtimes[runtimeName];
        if (runtime === void 0) {
          return;
        }
        if (this.functions.has(name)) {
          return;
        }
        const directory = directories.find((directory2) => mainFile.startsWith(directory2));
        if (directory === void 0) {
          return;
        }
        const func = new NetlifyFunction({
          blobsContext: this.blobsContext,
          config: this.config,
          directory,
          displayName,
          excludedRoutes,
          mainFile,
          name,
          projectRoot: this.projectRoot,
          routes,
          runtime,
          settings: this.settings,
          targetDirectory: this.destPath,
          timeoutBackground: this.timeouts.backgroundFunctions,
          timeoutSynchronous: this.timeouts.syncFunctions
        });
        const isReload = deletedFunctionNames.has(name);
        await this.registerFunction(name, func, isReload);
        return func;
      })
    );
    const addedFunctionNames = new Set(addedFunctions.filter(Boolean).map((func) => func?.name));
    deletedFunctions.forEach(async (func) => {
      if (addedFunctionNames.has(func.name)) {
        return;
      }
      this.handleEvent({ function: func, name: "FunctionRemovedEvent" });
    });
    if (this.watch) {
      await Promise.all(directories.map((path2) => this.setupDirectoryWatcher(path2)));
    }
  }
  /**
   * Creates a watcher that looks at files being added or removed from a
   * functions directory. It doesn't care about files being changed, because
   * those will be handled by each functions' watcher.
   */
  async setupDirectoryWatcher(directory) {
    if (this.directoryWatchers.has(directory)) {
      return;
    }
    const watcher = await watchDebounced(directory, {
      depth: 1,
      onAdd: () => {
        this.scan([directory]);
      },
      onUnlink: () => {
        this.scan([directory]);
      }
    });
    this.directoryWatchers.set(directory, watcher);
  }
  /**
   * Removes a function from the registry and closes its file watchers.
   */
  async unregisterFunction(func) {
    const { name } = func;
    this.functions.delete(name);
    const watcher = this.functionWatchers.get(name);
    if (watcher) {
      await watcher.close();
    }
    this.functionWatchers.delete(name);
  }
  /**
   * Takes a zipped function and extracts its contents to an internal directory.
   */
  async unzipFunction(func) {
    const targetDirectory = resolve(this.projectRoot, this.destPath, ".unzipped", func.name);
    await extractZip(func.mainFile, { dir: targetDirectory });
    return targetDirectory;
  }
};

// dev/server/client-context.ts
import { jwtDecode } from "jwt-decode";
var buildClientContext = (headers) => {
  if (!headers.authorization) return;
  const parts = headers.authorization.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return;
  const identity = {
    url: "https://netlify-dev-locally-emulated-identity.netlify.app/.netlify/identity",
    // {
    //   "source": "netlify dev",
    //   "testData": "NETLIFY_DEV_LOCALLY_EMULATED_IDENTITY"
    // }
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzb3VyY2UiOiJuZXRsaWZ5IGRldiIsInRlc3REYXRhIjoiTkVUTElGWV9ERVZfTE9DQUxMWV9FTVVMQVRFRF9JREVOVElUWSJ9.2eSDqUOZAOBsx39FHFePjYj12k0LrxldvGnlvDu3GMI"
  };
  try {
    const user = jwtDecode(parts[1]);
    const netlifyContext = JSON.stringify({
      identity,
      user
    });
    return {
      identity,
      user,
      custom: {
        netlify: Buffer.from(netlifyContext).toString("base64")
      }
    };
  } catch {
  }
};

// dev/main.ts
var CLOCKWORK_USERAGENT = "Netlify Clockwork";
var UNLINKED_SITE_MOCK_ID = "unlinked";
var mockLocation = {
  city: "San Francisco",
  country: { code: "US", name: "United States" },
  subdivision: { code: "CA", name: "California" },
  longitude: 0,
  latitude: 0,
  timezone: "UTC"
};
var FunctionsHandler = class {
  accountID;
  buildCache;
  registry;
  scan;
  siteID;
  constructor({ accountId, siteId, userFunctionsPath, ...registryOptions }) {
    const registry = new FunctionsRegistry(registryOptions);
    this.accountID = accountId;
    this.buildCache = {};
    this.registry = registry;
    this.scan = registry.scan([userFunctionsPath]);
    this.siteID = siteId;
  }
  async invoke(request, route, func) {
    let remoteAddress = request.headers.get("x-forwarded-for") || "";
    remoteAddress = remoteAddress.split(remoteAddress.includes(".") ? ":" : ",").pop()?.trim() ?? "";
    request.headers.set("x-nf-client-connection-ip", remoteAddress);
    if (this.accountID) {
      request.headers.set("x-nf-account-id", this.accountID);
    }
    request.headers.set("x-nf-site-id", this.siteID ?? UNLINKED_SITE_MOCK_ID);
    request.headers.set("x-nf-geo", Buffer2.from(JSON.stringify(mockLocation)).toString("base64"));
    const { headers: headersObject } = headersObjectFromWebHeaders(request.headers);
    const clientContext = buildClientContext(headersObject) || {};
    if (func.isBackground) {
      await func.invoke({
        buildCache: this.buildCache,
        request,
        route
      });
      return new Response(null, { status: 202 });
    }
    if (await func.isScheduled()) {
      const newRequest = new Request(request, {
        ...request,
        method: "POST"
      });
      newRequest.headers.set("user-agent", CLOCKWORK_USERAGENT);
      newRequest.headers.set("x-nf-event", "schedule");
      return await func.invoke({
        buildCache: this.buildCache,
        clientContext,
        request: newRequest,
        route
      });
    }
    return await func.invoke({
      buildCache: this.buildCache,
      clientContext,
      request,
      route
    });
  }
  async match(request) {
    await this.scan;
    const url = new URL(request.url);
    const match = await this.registry.getFunctionForURLPath(url.pathname, request.method);
    if (!match) {
      return;
    }
    const functionName = match?.func?.name;
    if (!functionName) {
      return;
    }
    const matchingRoute = match.route?.pattern;
    const func = this.registry.get(functionName);
    if (func === void 0) {
      return {
        handle: async () => new Response("Function not found...", {
          status: 404
        }),
        preferStatic: false
      };
    }
    if (!func.hasValidName()) {
      return {
        handle: async () => new Response("Function name should consist only of alphanumeric characters, hyphen & underscores.", {
          status: 400
        }),
        preferStatic: false
      };
    }
    return {
      handle: (request2) => this.invoke(request2, matchingRoute, func),
      preferStatic: match.route?.prefer_static ?? false
    };
  }
};
export {
  FunctionsHandler
};
