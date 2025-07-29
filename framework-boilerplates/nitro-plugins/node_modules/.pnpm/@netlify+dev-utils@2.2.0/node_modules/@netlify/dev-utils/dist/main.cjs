"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  EventInspector: () => EventInspector,
  Fixture: () => Fixture,
  HTTPServer: () => HTTPServer,
  LocalState: () => LocalState,
  MockFetch: () => MockFetch,
  ensureNetlifyIgnore: () => ensureNetlifyIgnore,
  getAPIToken: () => getAPIToken,
  globalConfig: () => global_config_exports,
  headers: () => headers,
  memoize: () => memoize,
  shouldBase64Encode: () => shouldBase64Encode,
  toMultiValueHeaders: () => toMultiValueHeaders,
  watchDebounced: () => watchDebounced
});
module.exports = __toCommonJS(main_exports);

// src/lib/global-config.ts
var global_config_exports = {};
__export(global_config_exports, {
  GlobalConfigStore: () => GlobalConfigStore,
  default: () => global_config_default,
  resetConfigCache: () => resetConfigCache
});
var import_promises = __toESM(require("fs/promises"), 1);
var import_node_fs = __toESM(require("fs"), 1);
var import_node_path = __toESM(require("path"), 1);
var dot = __toESM(require("dot-prop"), 1);
var import_uuid = require("uuid");
var import_write_file_atomic = require("write-file-atomic");

// src/lib/paths.ts
var import_os = __toESM(require("os"), 1);
var import_path = __toESM(require("path"), 1);
var import_env_paths = __toESM(require("env-paths"), 1);
var OSBasedPaths = (0, import_env_paths.default)("netlify", { suffix: "" });
var NETLIFY_HOME = ".netlify";
var getLegacyPathInHome = (paths) => import_path.default.join(import_os.default.homedir(), NETLIFY_HOME, ...paths);
var getPathInHome = (paths) => import_path.default.join(OSBasedPaths.config, ...paths);
var getPathInProject = (paths) => import_path.default.join(NETLIFY_HOME, ...paths);

// src/lib/global-config.ts
var GlobalConfigStore = class {
  #storagePath;
  constructor(options = {}) {
    this.#storagePath = getPathInHome(["config.json"]);
    if (options.defaults) {
      const config = this.getConfig();
      this.writeConfig({ ...options.defaults, ...config });
    }
  }
  get all() {
    return this.getConfig();
  }
  set(key, value) {
    const config = this.getConfig();
    const updatedConfig = dot.setProperty(config, key, value);
    this.writeConfig(updatedConfig);
  }
  get(key) {
    return dot.getProperty(this.getConfig(), key);
  }
  getConfig() {
    let raw;
    try {
      raw = import_node_fs.default.readFileSync(this.#storagePath, "utf8");
    } catch (err) {
      if (err instanceof Error && "code" in err) {
        if (err.code === "ENOENT") {
          return {};
        }
      }
      throw err;
    }
    try {
      return JSON.parse(raw);
    } catch {
      (0, import_write_file_atomic.sync)(this.#storagePath, "", { mode: 384 });
      return {};
    }
  }
  writeConfig(value) {
    import_node_fs.default.mkdirSync(import_node_path.default.dirname(this.#storagePath), { mode: 448, recursive: true });
    (0, import_write_file_atomic.sync)(this.#storagePath, JSON.stringify(value, void 0, "	"), { mode: 384 });
  }
};
var globalConfigDefaults = {
  /* disable stats from being sent to Netlify */
  telemetryDisabled: false,
  /* cliId */
  cliId: (0, import_uuid.v4)()
};
var configStore;
var getGlobalConfigStore = async () => {
  if (!configStore) {
    const legacyPath = getLegacyPathInHome(["config.json"]);
    let legacyConfig;
    try {
      legacyConfig = JSON.parse(await import_promises.default.readFile(legacyPath, "utf8"));
    } catch {
    }
    const defaults = { ...globalConfigDefaults, ...legacyConfig };
    configStore = new GlobalConfigStore({ defaults });
  }
  return configStore;
};
var global_config_default = getGlobalConfigStore;
var resetConfigCache = () => {
  configStore = void 0;
};

// src/lib/api-token.ts
var getAPIToken = async () => {
  const globalConfig = await global_config_default();
  const userId = globalConfig.get("userId");
  const token = globalConfig.get(`users.${userId}.auth.token`);
  return token;
};

// src/lib/base64.ts
var exceptionsList = /* @__PURE__ */ new Set([
  "application/csp-report",
  "application/graphql",
  "application/json",
  "application/javascript",
  "application/x-www-form-urlencoded",
  "application/x-ndjson",
  "application/xml"
]);
var shouldBase64Encode = (contentType) => {
  if (!contentType) {
    return true;
  }
  const [contentTypeSegment] = contentType.split(";");
  contentType = contentTypeSegment;
  contentType = contentType.toLowerCase();
  if (contentType.startsWith("text/")) {
    return false;
  }
  if (contentType.endsWith("+json") || contentType.endsWith("+xml")) {
    return false;
  }
  if (exceptionsList.has(contentType)) {
    return false;
  }
  return true;
};

// src/lib/gitignore.ts
var import_promises2 = require("fs/promises");
var import_path2 = __toESM(require("path"), 1);
var import_parse_gitignore = __toESM(require("parse-gitignore"), 1);
var hasGitIgnore = async function(dir) {
  const gitIgnorePath = import_path2.default.join(dir, ".gitignore");
  try {
    const ignoreStats = await (0, import_promises2.stat)(gitIgnorePath);
    return ignoreStats.isFile();
  } catch {
    return false;
  }
};
var ensureNetlifyIgnore = async (dir, logger) => {
  const gitIgnorePath = import_path2.default.join(dir, ".gitignore");
  const ignoreContent = "# Local Netlify folder\n.netlify\n";
  if (!await hasGitIgnore(dir)) {
    await (0, import_promises2.writeFile)(gitIgnorePath, ignoreContent, "utf8");
    return false;
  }
  let gitIgnoreContents;
  let ignorePatterns;
  try {
    gitIgnoreContents = await (0, import_promises2.readFile)(gitIgnorePath, "utf8");
    ignorePatterns = import_parse_gitignore.default.parse(gitIgnoreContents);
  } catch {
  }
  if (!ignorePatterns || !ignorePatterns.patterns.some((pattern) => /(^|\/|\\)\.netlify($|\/|\\)/.test(pattern))) {
    logger?.log();
    logger?.log("Adding local .netlify folder to .gitignore file...");
    const newContents = `${gitIgnoreContents}
${ignoreContent}`;
    await (0, import_promises2.writeFile)(gitIgnorePath, newContents, "utf8");
  }
};

// src/lib/headers.ts
var headers = {
  BlobsInfo: "x-nf-blobs-info"
};
var toMultiValueHeaders = (headers2) => {
  const headersObj = {};
  for (const [name, value] of headers2.entries()) {
    if (name in headersObj) {
      headersObj[name].push(value);
    } else {
      headersObj[name] = [value];
    }
  }
  return headersObj;
};

// src/lib/local-state.ts
var import_fs = __toESM(require("fs"), 1);
var import_path3 = __toESM(require("path"), 1);
var import_process = __toESM(require("process"), 1);
var import_dot_prop = require("dot-prop");
var import_find_up = require("find-up");
var import_write_file_atomic2 = __toESM(require("write-file-atomic"), 1);
var STATE_PATH = getPathInProject(["state.json"]);
var permissionError = "You don't have access to this file.";
var findStatePath = (cwd) => {
  const statePath = (0, import_find_up.findUpSync)([STATE_PATH], { cwd });
  if (!statePath) {
    return import_path3.default.join(cwd, STATE_PATH);
  }
  return statePath;
};
var LocalState = class {
  path;
  constructor(cwd) {
    this.path = findStatePath(cwd);
  }
  get all() {
    try {
      return JSON.parse(import_fs.default.readFileSync(this.path));
    } catch (error) {
      if (error.code === "ENOENT" || error.code === "ENOTDIR") {
        return {};
      }
      if (error.code === "EACCES") {
        error.message = `${error.message}
${permissionError}
`;
      }
      if (error.name === "SyntaxError") {
        import_write_file_atomic2.default.sync(this.path, "");
        return {};
      }
      throw error;
    }
  }
  set all(val) {
    try {
      import_fs.default.mkdirSync(import_path3.default.dirname(this.path), { recursive: true });
      import_write_file_atomic2.default.sync(this.path, JSON.stringify(val, null, "	"));
    } catch (error) {
      if (error.code === "EACCES") {
        error.message = `${error.message}
${permissionError}
`;
      }
      throw error;
    }
  }
  get size() {
    return Object.keys(this.all || {}).length;
  }
  // @ts-expect-error TS(7006) FIXME: Parameter 'key' implicitly has an 'any' type.
  get(key) {
    if (key === "siteId" && import_process.default.env.NETLIFY_SITE_ID) {
      return import_process.default.env.NETLIFY_SITE_ID;
    }
    return (0, import_dot_prop.getProperty)(this.all, key);
  }
  // @ts-expect-error TS(7019) FIXME: Rest parameter 'args' implicitly has an 'any[]' ty... Remove this comment to see the full error message
  set(...args) {
    const [key, val] = args;
    const config = this.all;
    if (args.length === 1) {
      Object.entries(key).forEach(([keyPart, value]) => {
        (0, import_dot_prop.setProperty)(config, keyPart, value);
      });
    } else {
      (0, import_dot_prop.setProperty)(config, key, val);
    }
    this.all = config;
  }
  // @ts-expect-error TS(7006) FIXME: Parameter 'key' implicitly has an 'any' type.
  has(key) {
    return (0, import_dot_prop.hasProperty)(this.all, key);
  }
  // @ts-expect-error TS(7006) FIXME: Parameter 'key' implicitly has an 'any' type.
  delete(key) {
    const config = this.all;
    (0, import_dot_prop.deleteProperty)(config, key);
    this.all = config;
  }
  clear() {
    this.all = {};
  }
};

// src/lib/memoize.ts
var DEBOUNCE_INTERVAL = 300;
var memoize = ({ cache, cacheKey, command }) => {
  if (cache[cacheKey] === void 0) {
    cache[cacheKey] = {
      // eslint-disable-next-line promise/prefer-await-to-then
      task: command().finally(() => {
        const entry = cache[cacheKey];
        cache[cacheKey] = void 0;
        if (entry?.enqueued !== void 0) {
          memoize({ cache, cacheKey, command });
        }
      }),
      timestamp: Date.now()
    };
  } else if (Date.now() > cache[cacheKey].timestamp + DEBOUNCE_INTERVAL) {
    cache[cacheKey].enqueued = true;
  }
  return cache[cacheKey].task;
};

// src/server/http_server.ts
var import_node_http = __toESM(require("http"), 1);
var import_server = require("@whatwg-node/server");
var HTTPServer = class {
  handler;
  nodeServer;
  constructor(handler) {
    this.handler = handler;
  }
  async start(port = 0) {
    const adapter = (0, import_server.createServerAdapter)((request) => this.handler(request));
    const server = import_node_http.default.createServer(adapter);
    this.nodeServer = server;
    return new Promise((resolve, reject) => {
      server.listen(port, () => {
        const address = server.address();
        if (!address || typeof address === "string") {
          return reject(new Error("Server cannot be started on a pipe or Unix socket"));
        }
        resolve(`http://localhost:${address.port}`);
      });
    });
  }
  async stop() {
    const server = this.nodeServer;
    if (!server) {
      return;
    }
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          return reject(error);
        }
        resolve(null);
      });
    });
  }
};

// src/lib/watch-debounced.ts
var import_node_events = require("events");
var import_chokidar = __toESM(require("chokidar"), 1);
var import_decache = __toESM(require("decache"), 1);
var import_lodash = __toESM(require("lodash.debounce"), 1);
var DEBOUNCE_WAIT = 100;
var noOp = () => {
};
var watchDebounced = async (target, { depth, ignored = [], onAdd = noOp, onChange = noOp, onUnlink = noOp }) => {
  const baseIgnores = [/\/(node_modules|.git)\//];
  const watcher = import_chokidar.default.watch(target, {
    depth,
    ignored: [...baseIgnores, ...ignored],
    ignoreInitial: true
  });
  await (0, import_node_events.once)(watcher, "ready");
  let onChangeQueue = [];
  let onAddQueue = [];
  let onUnlinkQueue = [];
  const debouncedOnChange = (0, import_lodash.default)(() => {
    onChange(onChangeQueue);
    onChangeQueue = [];
  }, DEBOUNCE_WAIT);
  const debouncedOnAdd = (0, import_lodash.default)(() => {
    onAdd(onAddQueue);
    onAddQueue = [];
  }, DEBOUNCE_WAIT);
  const debouncedOnUnlink = (0, import_lodash.default)(() => {
    onUnlink(onUnlinkQueue);
    onUnlinkQueue = [];
  }, DEBOUNCE_WAIT);
  watcher.on("change", (path5) => {
    (0, import_decache.default)(path5);
    onChangeQueue.push(path5);
    debouncedOnChange();
  }).on("unlink", (path5) => {
    (0, import_decache.default)(path5);
    onUnlinkQueue.push(path5);
    debouncedOnUnlink();
  }).on("add", (path5) => {
    (0, import_decache.default)(path5);
    onAddQueue.push(path5);
    debouncedOnAdd();
  });
  return watcher;
};

// src/test/event_inspector.ts
var import_node_events2 = require("events");
var DEFAULT_TIMEOUT = 5e3;
var EventInspector = class extends import_node_events2.EventEmitter {
  debug;
  events;
  constructor({ debug } = {}) {
    super();
    this.debug = debug === true;
    this.events = [];
  }
  handleEvent(event) {
    this.events.push(event);
    this.emit("eventReceived", event);
  }
  waitFor(filter, timeoutMs = DEFAULT_TIMEOUT) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`\`waitFor\` timed out after ${timeoutMs} ms`));
      }, timeoutMs);
      this.on("eventReceived", (event) => {
        if (this.debug) {
          console.log("[EventInspector] Event received:", event);
        }
        if (filter(event)) {
          resolve(event);
        }
      });
    });
  }
};

// src/test/fetch.ts
var import_node_assert = __toESM(require("assert"), 1);
var import_node_stream = require("stream");
var MockFetch = class {
  originalFetch;
  requests;
  constructor() {
    this.originalFetch = globalThis.fetch;
    this.requests = [];
  }
  addExpectedRequest({
    body,
    headers: headers2 = {},
    method,
    response,
    url
  }) {
    this.requests.push({ body, fulfilled: false, headers: headers2, method, response, url });
    return this;
  }
  delete(options) {
    return this.addExpectedRequest({ ...options, method: "delete" });
  }
  get(options) {
    return this.addExpectedRequest({ ...options, method: "get" });
  }
  head(options) {
    return this.addExpectedRequest({ ...options, method: "head" });
  }
  post(options) {
    return this.addExpectedRequest({ ...options, method: "post" });
  }
  put(options) {
    return this.addExpectedRequest({ ...options, method: "put" });
  }
  get fetch() {
    return async (...args) => {
      const [reqOrURL, options] = args;
      const url = (reqOrURL instanceof Request ? reqOrURL.url : reqOrURL).toString();
      const method = options?.method ?? "get";
      const headers2 = options?.headers;
      const match = this.requests.find(
        (request) => request.method.toLowerCase() === method.toLowerCase() && request.url === url && !request.fulfilled
      );
      if (!match) {
        throw new Error(`Unexpected fetch call: ${method} ${url}`);
      }
      if (typeof match.headers === "function") {
        import_node_assert.default.doesNotThrow(() => match.headers(headers2));
      } else {
        for (const key in match.headers) {
          import_node_assert.default.equal(headers2[key], match.headers[key]);
        }
      }
      if (match.body !== void 0) {
        let requestBody = null;
        if (options?.body) {
          if (typeof options.body === "string") {
            requestBody = options.body;
          } else {
            requestBody = await readAsString(import_node_stream.Readable.fromWeb(options.body));
          }
        }
        if (typeof match.body === "string") {
          import_node_assert.default.equal(requestBody, match.body);
        } else if (typeof match.body === "function") {
          const bodyFn = match.body;
          import_node_assert.default.doesNotThrow(() => bodyFn(requestBody));
        } else if (match.body === null) {
          import_node_assert.default.equal(options?.body, void 0);
        }
      }
      match.fulfilled = true;
      if (match.response instanceof Error) {
        throw match.response;
      }
      if (typeof match.response === "function") {
        return match.response();
      }
      return match.response;
    };
  }
  get fulfilled() {
    return this.requests.every((request) => request.fulfilled);
  }
  inject() {
    globalThis.fetch = this.fetch;
    return this;
  }
  restore() {
    globalThis.fetch = this.originalFetch;
  }
};
var readAsString = (input) => new Promise((resolve, reject) => {
  let buffer = "";
  input.on("data", (chunk) => {
    buffer += chunk;
  });
  input.on("error", (error) => {
    reject(error);
  });
  input.on("end", () => {
    resolve(buffer);
  });
});

// src/test/fixture.ts
var import_node_child_process = require("child_process");
var import_node_fs2 = require("fs");
var import_node_path2 = require("path");
var import_node_util = require("util");
var import_tmp_promise = __toESM(require("tmp-promise"), 1);
var run = (0, import_node_util.promisify)(import_node_child_process.exec);
var Fixture = class {
  directory;
  files;
  npmDependencies;
  constructor() {
    this.files = {};
    this.npmDependencies = {};
  }
  ensureDirectory() {
    if (!this.directory) {
      throw new Error("Fixture hasn't been initialized. Did you call `create()`?");
    }
    return this.directory.path;
  }
  async installNpmDependencies() {
    if (Object.keys(this.npmDependencies).length === 0) {
      return;
    }
    const directory = this.ensureDirectory();
    const packageJSON = {
      name: "fixture",
      version: "0.0.0",
      dependencies: this.npmDependencies
    };
    const packageJSONPath = (0, import_node_path2.join)(directory, "package.json");
    await import_node_fs2.promises.writeFile(packageJSONPath, JSON.stringify(packageJSON, null, 2));
    await run("npm install", { cwd: directory });
  }
  async create() {
    if (!this.directory) {
      this.directory = await import_tmp_promise.default.dir({ unsafeCleanup: true });
      if (this.directory.path.startsWith("/var/")) {
        this.directory.path = this.directory.path.replace("/var/", "/private/var/");
      }
    }
    for (const relativePath in this.files) {
      const filePath = (0, import_node_path2.join)(this.directory.path, relativePath);
      await import_node_fs2.promises.mkdir((0, import_node_path2.dirname)(filePath), { recursive: true });
      await import_node_fs2.promises.writeFile(filePath, this.files[relativePath]);
    }
    await this.installNpmDependencies();
    return this.directory.path;
  }
  async deleteFile(path5) {
    const filePath = (0, import_node_path2.join)(this.ensureDirectory(), path5);
    try {
      await import_node_fs2.promises.rm(filePath, { force: true });
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }
  async destroy() {
    await import_node_fs2.promises.rm(this.directory.path, { force: true, recursive: true });
  }
  withFile(path5, contents) {
    this.files[path5] = contents;
    return this;
  }
  withStateFile(state) {
    this.files[".netlify/state.json"] = JSON.stringify(state);
    return this;
  }
  async writeFile(path5, contents) {
    const filePath = (0, import_node_path2.join)(this.ensureDirectory(), path5);
    await import_node_fs2.promises.writeFile(filePath, contents);
  }
  withPackages(packages) {
    this.npmDependencies = { ...this.npmDependencies, ...packages };
    return this;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EventInspector,
  Fixture,
  HTTPServer,
  LocalState,
  MockFetch,
  ensureNetlifyIgnore,
  getAPIToken,
  globalConfig,
  headers,
  memoize,
  shouldBase64Encode,
  toMultiValueHeaders,
  watchDebounced
});
