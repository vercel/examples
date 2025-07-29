var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/lib/global-config.ts
var global_config_exports = {};
__export(global_config_exports, {
  GlobalConfigStore: () => GlobalConfigStore,
  default: () => global_config_default,
  resetConfigCache: () => resetConfigCache
});
import fs from "node:fs/promises";
import fss from "node:fs";
import path2 from "node:path";
import * as dot from "dot-prop";
import { v4 as uuidv4 } from "uuid";
import { sync as writeFileAtomicSync } from "write-file-atomic";

// src/lib/paths.ts
import os from "os";
import path from "path";
import envPaths from "env-paths";
var OSBasedPaths = envPaths("netlify", { suffix: "" });
var NETLIFY_HOME = ".netlify";
var getLegacyPathInHome = (paths) => path.join(os.homedir(), NETLIFY_HOME, ...paths);
var getPathInHome = (paths) => path.join(OSBasedPaths.config, ...paths);
var getPathInProject = (paths) => path.join(NETLIFY_HOME, ...paths);

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
      raw = fss.readFileSync(this.#storagePath, "utf8");
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
      writeFileAtomicSync(this.#storagePath, "", { mode: 384 });
      return {};
    }
  }
  writeConfig(value) {
    fss.mkdirSync(path2.dirname(this.#storagePath), { mode: 448, recursive: true });
    writeFileAtomicSync(this.#storagePath, JSON.stringify(value, void 0, "	"), { mode: 384 });
  }
};
var globalConfigDefaults = {
  /* disable stats from being sent to Netlify */
  telemetryDisabled: false,
  /* cliId */
  cliId: uuidv4()
};
var configStore;
var getGlobalConfigStore = async () => {
  if (!configStore) {
    const legacyPath = getLegacyPathInHome(["config.json"]);
    let legacyConfig;
    try {
      legacyConfig = JSON.parse(await fs.readFile(legacyPath, "utf8"));
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
import { readFile, stat, writeFile } from "fs/promises";
import path3 from "path";
import parseIgnore from "parse-gitignore";
var hasGitIgnore = async function(dir) {
  const gitIgnorePath = path3.join(dir, ".gitignore");
  try {
    const ignoreStats = await stat(gitIgnorePath);
    return ignoreStats.isFile();
  } catch {
    return false;
  }
};
var ensureNetlifyIgnore = async (dir, logger) => {
  const gitIgnorePath = path3.join(dir, ".gitignore");
  const ignoreContent = "# Local Netlify folder\n.netlify\n";
  if (!await hasGitIgnore(dir)) {
    await writeFile(gitIgnorePath, ignoreContent, "utf8");
    return false;
  }
  let gitIgnoreContents;
  let ignorePatterns;
  try {
    gitIgnoreContents = await readFile(gitIgnorePath, "utf8");
    ignorePatterns = parseIgnore.parse(gitIgnoreContents);
  } catch {
  }
  if (!ignorePatterns || !ignorePatterns.patterns.some((pattern) => /(^|\/|\\)\.netlify($|\/|\\)/.test(pattern))) {
    logger?.log();
    logger?.log("Adding local .netlify folder to .gitignore file...");
    const newContents = `${gitIgnoreContents}
${ignoreContent}`;
    await writeFile(gitIgnorePath, newContents, "utf8");
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
import fs2 from "fs";
import path4 from "path";
import process from "process";
import { deleteProperty, getProperty as getProperty2, hasProperty, setProperty as setProperty2 } from "dot-prop";
import { findUpSync } from "find-up";
import writeFileAtomic from "write-file-atomic";
var STATE_PATH = getPathInProject(["state.json"]);
var permissionError = "You don't have access to this file.";
var findStatePath = (cwd) => {
  const statePath = findUpSync([STATE_PATH], { cwd });
  if (!statePath) {
    return path4.join(cwd, STATE_PATH);
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
      return JSON.parse(fs2.readFileSync(this.path));
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
        writeFileAtomic.sync(this.path, "");
        return {};
      }
      throw error;
    }
  }
  set all(val) {
    try {
      fs2.mkdirSync(path4.dirname(this.path), { recursive: true });
      writeFileAtomic.sync(this.path, JSON.stringify(val, null, "	"));
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
    if (key === "siteId" && process.env.NETLIFY_SITE_ID) {
      return process.env.NETLIFY_SITE_ID;
    }
    return getProperty2(this.all, key);
  }
  // @ts-expect-error TS(7019) FIXME: Rest parameter 'args' implicitly has an 'any[]' ty... Remove this comment to see the full error message
  set(...args) {
    const [key, val] = args;
    const config = this.all;
    if (args.length === 1) {
      Object.entries(key).forEach(([keyPart, value]) => {
        setProperty2(config, keyPart, value);
      });
    } else {
      setProperty2(config, key, val);
    }
    this.all = config;
  }
  // @ts-expect-error TS(7006) FIXME: Parameter 'key' implicitly has an 'any' type.
  has(key) {
    return hasProperty(this.all, key);
  }
  // @ts-expect-error TS(7006) FIXME: Parameter 'key' implicitly has an 'any' type.
  delete(key) {
    const config = this.all;
    deleteProperty(config, key);
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
import http from "node:http";
import { createServerAdapter } from "@whatwg-node/server";
var HTTPServer = class {
  handler;
  nodeServer;
  constructor(handler) {
    this.handler = handler;
  }
  async start(port = 0) {
    const adapter = createServerAdapter((request) => this.handler(request));
    const server = http.createServer(adapter);
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
import { once } from "node:events";
import chokidar from "chokidar";
import decache from "decache";
import debounce from "lodash.debounce";
var DEBOUNCE_WAIT = 100;
var noOp = () => {
};
var watchDebounced = async (target, { depth, ignored = [], onAdd = noOp, onChange = noOp, onUnlink = noOp }) => {
  const baseIgnores = [/\/(node_modules|.git)\//];
  const watcher = chokidar.watch(target, {
    depth,
    ignored: [...baseIgnores, ...ignored],
    ignoreInitial: true
  });
  await once(watcher, "ready");
  let onChangeQueue = [];
  let onAddQueue = [];
  let onUnlinkQueue = [];
  const debouncedOnChange = debounce(() => {
    onChange(onChangeQueue);
    onChangeQueue = [];
  }, DEBOUNCE_WAIT);
  const debouncedOnAdd = debounce(() => {
    onAdd(onAddQueue);
    onAddQueue = [];
  }, DEBOUNCE_WAIT);
  const debouncedOnUnlink = debounce(() => {
    onUnlink(onUnlinkQueue);
    onUnlinkQueue = [];
  }, DEBOUNCE_WAIT);
  watcher.on("change", (path5) => {
    decache(path5);
    onChangeQueue.push(path5);
    debouncedOnChange();
  }).on("unlink", (path5) => {
    decache(path5);
    onUnlinkQueue.push(path5);
    debouncedOnUnlink();
  }).on("add", (path5) => {
    decache(path5);
    onAddQueue.push(path5);
    debouncedOnAdd();
  });
  return watcher;
};

// src/test/event_inspector.ts
import { EventEmitter } from "node:events";
var DEFAULT_TIMEOUT = 5e3;
var EventInspector = class extends EventEmitter {
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
import assert from "node:assert";
import { Readable } from "node:stream";
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
        assert.doesNotThrow(() => match.headers(headers2));
      } else {
        for (const key in match.headers) {
          assert.equal(headers2[key], match.headers[key]);
        }
      }
      if (match.body !== void 0) {
        let requestBody = null;
        if (options?.body) {
          if (typeof options.body === "string") {
            requestBody = options.body;
          } else {
            requestBody = await readAsString(Readable.fromWeb(options.body));
          }
        }
        if (typeof match.body === "string") {
          assert.equal(requestBody, match.body);
        } else if (typeof match.body === "function") {
          const bodyFn = match.body;
          assert.doesNotThrow(() => bodyFn(requestBody));
        } else if (match.body === null) {
          assert.equal(options?.body, void 0);
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
import { exec } from "node:child_process";
import { promises as fs3 } from "node:fs";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import tmp from "tmp-promise";
var run = promisify(exec);
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
    const packageJSONPath = join(directory, "package.json");
    await fs3.writeFile(packageJSONPath, JSON.stringify(packageJSON, null, 2));
    await run("npm install", { cwd: directory });
  }
  async create() {
    if (!this.directory) {
      this.directory = await tmp.dir({ unsafeCleanup: true });
      if (this.directory.path.startsWith("/var/")) {
        this.directory.path = this.directory.path.replace("/var/", "/private/var/");
      }
    }
    for (const relativePath in this.files) {
      const filePath = join(this.directory.path, relativePath);
      await fs3.mkdir(dirname(filePath), { recursive: true });
      await fs3.writeFile(filePath, this.files[relativePath]);
    }
    await this.installNpmDependencies();
    return this.directory.path;
  }
  async deleteFile(path5) {
    const filePath = join(this.ensureDirectory(), path5);
    try {
      await fs3.rm(filePath, { force: true });
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }
  async destroy() {
    await fs3.rm(this.directory.path, { force: true, recursive: true });
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
    const filePath = join(this.ensureDirectory(), path5);
    await fs3.writeFile(filePath, contents);
  }
  withPackages(packages) {
    this.npmDependencies = { ...this.npmDependencies, ...packages };
    return this;
  }
};
export {
  EventInspector,
  Fixture,
  HTTPServer,
  LocalState,
  MockFetch,
  ensureNetlifyIgnore,
  getAPIToken,
  global_config_exports as globalConfig,
  headers,
  memoize,
  shouldBase64Encode,
  toMultiValueHeaders,
  watchDebounced
};
