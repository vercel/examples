"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server.ts
var server_exports = {};
__export(server_exports, {
  BlobsServer: () => BlobsServer,
  Operation: () => Operation
});
module.exports = __toCommonJS(server_exports);
var import_node_crypto = require("crypto");
var import_node_fs = require("fs");
var import_node_os = require("os");
var import_node_path = require("path");
var import_node_process = require("process");
var import_dev_utils = require("@netlify/dev-utils");

// src/environment.ts
var import_runtime_utils = require("@netlify/runtime-utils");
var getEnvironment = () => {
  const { Deno, Netlify, process } = globalThis;
  return Netlify?.env ?? Deno?.env ?? {
    delete: (key) => delete process?.env[key],
    get: (key) => process?.env[key],
    has: (key) => Boolean(process?.env[key]),
    set: (key, value) => {
      if (process?.env) {
        process.env[key] = value;
      }
    },
    toObject: () => process?.env ?? {}
  };
};

// src/metadata.ts
var import_runtime_utils2 = require("@netlify/runtime-utils");
var BASE64_PREFIX = "b64;";
var METADATA_HEADER_INTERNAL = "x-amz-meta-user";
var METADATA_HEADER_EXTERNAL = "netlify-blobs-metadata";
var METADATA_MAX_SIZE = 2 * 1024;
var encodeMetadata = (metadata) => {
  if (!metadata) {
    return null;
  }
  const encodedObject = (0, import_runtime_utils2.base64Encode)(JSON.stringify(metadata));
  const payload = `b64;${encodedObject}`;
  if (METADATA_HEADER_EXTERNAL.length + payload.length > METADATA_MAX_SIZE) {
    throw new Error("Metadata object exceeds the maximum size");
  }
  return payload;
};
var decodeMetadata = (header) => {
  if (!header || !header.startsWith(BASE64_PREFIX)) {
    return {};
  }
  const encodedData = header.slice(BASE64_PREFIX.length);
  const decodedData = (0, import_runtime_utils2.base64Decode)(encodedData);
  const metadata = JSON.parse(decodedData);
  return metadata;
};

// src/retry.ts
var DEFAULT_RETRY_DELAY = getEnvironment().get("NODE_ENV") === "test" ? 1 : 5e3;

// src/util.ts
var isNodeError = (error) => error instanceof Error;

// src/client.ts
var SIGNED_URL_ACCEPT_HEADER = "application/json;type=signed-url";

// src/server.ts
var API_URL_PATH = /\/api\/v1\/blobs\/(?<site_id>[^/]+)\/(?<store_name>[^/]+)\/?(?<key>[^?]*)/;
var LEGACY_API_URL_PATH = /\/api\/v1\/sites\/(?<site_id>[^/]+)\/blobs\/?(?<key>[^?]*)/;
var LEGACY_DEFAULT_STORE = "production";
var REGION_PREFIX = "region:";
var Operation = /* @__PURE__ */ ((Operation2) => {
  Operation2["DELETE"] = "delete";
  Operation2["GET"] = "get";
  Operation2["GET_METADATA"] = "getMetadata";
  Operation2["LIST"] = "list";
  Operation2["SET"] = "set";
  return Operation2;
})(Operation || {});
var BlobsServer = class _BlobsServer {
  constructor({ debug, directory, logger, onRequest, port, token }) {
    this.address = "";
    this.port = port;
    this.debug = debug === true;
    this.directory = directory;
    this.logger = logger ?? console.log;
    this.onRequest = onRequest;
    this.token = token;
    this.tokenHash = (0, import_node_crypto.createHmac)("sha256", Math.random.toString()).update(token ?? Math.random.toString()).digest("hex");
  }
  dispatchOnRequestEvent(type, input) {
    if (!this.onRequest) {
      return;
    }
    const url = new URL(input);
    this.onRequest({ type, url: url.pathname + url.search });
  }
  async delete(req) {
    const apiMatch = this.parseAPIRequest(req);
    if (apiMatch?.useSignedURL) {
      return Response.json({ url: apiMatch.url.toString() });
    }
    const url = new URL(apiMatch?.url ?? req.url ?? "", this.address);
    const { dataPath, key, metadataPath } = this.getLocalPaths(url);
    if (!dataPath || !key) {
      return new Response(null, { status: 400 });
    }
    try {
      await import_node_fs.promises.rm(metadataPath, { force: true, recursive: true });
    } catch {
    }
    try {
      await import_node_fs.promises.rm(dataPath, { force: true, recursive: true });
    } catch (error) {
      if (!isNodeError(error) || error.code !== "ENOENT") {
        return new Response(null, { status: 500 });
      }
    }
    return new Response(null, { status: 204 });
  }
  async get(req) {
    const apiMatch = this.parseAPIRequest(req);
    const url = apiMatch?.url ?? new URL(req.url ?? "", this.address);
    if (apiMatch?.key && apiMatch?.useSignedURL) {
      return Response.json({ url: apiMatch.url.toString() });
    }
    const { dataPath, key, metadataPath, rootPath } = this.getLocalPaths(apiMatch?.url ?? url);
    if (!rootPath) {
      return new Response(null, { status: 400 });
    }
    if (!dataPath || !metadataPath) {
      return this.listStores(rootPath, url.searchParams.get("prefix") ?? "");
    }
    if (!key) {
      return this.listBlobs({ dataPath, metadataPath, rootPath, req, url });
    }
    this.dispatchOnRequestEvent("get" /* GET */, url);
    const headers = {};
    try {
      const rawData = await import_node_fs.promises.readFile(metadataPath, "utf8");
      const metadata = JSON.parse(rawData);
      const encodedMetadata = encodeMetadata(metadata);
      if (encodedMetadata) {
        headers[METADATA_HEADER_INTERNAL] = encodedMetadata;
      }
    } catch (error) {
      if (!isNodeError(error) || error.code !== "ENOENT") {
        this.logDebug("Could not read metadata file:", error);
      }
    }
    try {
      const fileStream = (0, import_node_fs.createReadStream)(dataPath);
      const chunks = [];
      for await (const chunk of fileStream) {
        chunks.push(Buffer.from(chunk));
      }
      const buffer = Buffer.concat(chunks);
      return new Response(buffer, { headers });
    } catch (error) {
      if (isNodeError(error) && (error.code === "EISDIR" || error.code === "ENOENT")) {
        return new Response(null, { status: 404 });
      }
      return new Response(null, { status: 500 });
    }
  }
  async head(req) {
    const url = this.parseAPIRequest(req)?.url ?? new URL(req.url ?? "", this.address);
    const { dataPath, key, metadataPath } = this.getLocalPaths(url);
    if (!dataPath || !metadataPath || !key) {
      return new Response(null, { status: 400 });
    }
    try {
      const rawData = await import_node_fs.promises.readFile(metadataPath, "utf8");
      const metadata = JSON.parse(rawData);
      const encodedMetadata = encodeMetadata(metadata);
      return new Response(null, {
        headers: {
          [METADATA_HEADER_INTERNAL]: encodedMetadata ?? ""
        }
      });
    } catch (error) {
      if (isNodeError(error) && (error.code === "ENOENT" || error.code === "ISDIR")) {
        return new Response(null, { status: 404 });
      }
      this.logDebug("Could not read metadata file:", error);
      return new Response(null, { status: 500 });
    }
  }
  async listBlobs(options) {
    const { dataPath, rootPath, req, url } = options;
    const directories = url.searchParams.get("directories") === "true";
    const prefix = url.searchParams.get("prefix") ?? "";
    const result = {
      blobs: [],
      directories: []
    };
    this.dispatchOnRequestEvent("list" /* LIST */, url);
    try {
      await _BlobsServer.walk({ directories, path: dataPath, prefix, rootPath, result });
    } catch (error) {
      if (!isNodeError(error) || error.code !== "ENOENT") {
        this.logDebug("Could not perform list:", error);
        return new Response(null, { status: 500 });
      }
    }
    return Response.json(result);
  }
  async listStores(rootPath, prefix) {
    try {
      const allStores = await import_node_fs.promises.readdir(rootPath);
      const filteredStores = allStores.map((store) => import_node_process.platform === "win32" ? decodeURIComponent(store) : store).filter((store) => store.startsWith(prefix));
      return Response.json({ stores: filteredStores });
    } catch (error) {
      this.logDebug("Could not list stores:", error);
      return new Response(null, { status: 500 });
    }
  }
  logDebug(...message) {
    if (!this.debug) {
      return;
    }
    this.logger("[Netlify Blobs server]", ...message);
  }
  async put(req) {
    const apiMatch = this.parseAPIRequest(req);
    if (apiMatch) {
      return Response.json({ url: apiMatch.url.toString() });
    }
    const url = new URL(req.url ?? "", this.address);
    const { dataPath, key, metadataPath } = this.getLocalPaths(url);
    if (!dataPath || !key || !metadataPath) {
      return new Response(null, { status: 400 });
    }
    const metadataHeader = req.headers.get(METADATA_HEADER_INTERNAL);
    const metadata = decodeMetadata(metadataHeader);
    try {
      const tempPath = (0, import_node_path.join)((0, import_node_os.tmpdir)(), Math.random().toString());
      const body = await req.arrayBuffer();
      await import_node_fs.promises.writeFile(tempPath, Buffer.from(body));
      await import_node_fs.promises.mkdir((0, import_node_path.dirname)(dataPath), { recursive: true });
      await import_node_fs.promises.rename(tempPath, dataPath);
      if (metadata) {
        await import_node_fs.promises.mkdir((0, import_node_path.dirname)(metadataPath), { recursive: true });
        await import_node_fs.promises.writeFile(metadataPath, JSON.stringify(metadata));
      }
      return new Response(null, { status: 200 });
    } catch (error) {
      this.logDebug("Error when writing data:", error);
      return new Response(null, { status: 500 });
    }
  }
  /**
   * Parses the URL and returns the filesystem paths where entries and metadata
   * should be stored.
   */
  getLocalPaths(url) {
    if (!url) {
      return {};
    }
    let parts = url.pathname.split("/").slice(1);
    if (parts[0].startsWith(REGION_PREFIX)) {
      parts = parts.slice(1);
    }
    const [siteID, rawStoreName, ...key] = parts;
    if (!siteID) {
      return {};
    }
    const rootPath = (0, import_node_path.resolve)(this.directory, "entries", siteID);
    if (!rawStoreName) {
      return { rootPath };
    }
    const storeName = import_node_process.platform === "win32" ? encodeURIComponent(rawStoreName) : rawStoreName;
    const storePath = (0, import_node_path.resolve)(rootPath, storeName);
    const dataPath = (0, import_node_path.resolve)(storePath, ...key);
    const metadataPath = (0, import_node_path.resolve)(this.directory, "metadata", siteID, storeName, ...key);
    return { dataPath, key: key.join("/"), metadataPath, rootPath: storePath };
  }
  async handleRequest(req) {
    if (!req.url || !this.validateAccess(req)) {
      return new Response(null, { status: 403 });
    }
    switch (req.method?.toLowerCase()) {
      case "delete" /* DELETE */: {
        this.dispatchOnRequestEvent("delete" /* DELETE */, req.url);
        return this.delete(req);
      }
      case "get" /* GET */: {
        return this.get(req);
      }
      case "put" /* PUT */: {
        this.dispatchOnRequestEvent("set" /* SET */, req.url);
        return this.put(req);
      }
      case "head" /* HEAD */: {
        this.dispatchOnRequestEvent("getMetadata" /* GET_METADATA */, req.url);
        return this.head(req);
      }
      default:
        return new Response(null, { status: 405 });
    }
  }
  /**
   * Tries to parse a URL as being an API request and returns the different
   * components, such as the store name, site ID, key, and signed URL.
   */
  parseAPIRequest(req) {
    if (!req.url) {
      return null;
    }
    const apiURLMatch = req.url.match(API_URL_PATH);
    if (apiURLMatch) {
      const key = apiURLMatch.groups?.key;
      const siteID = apiURLMatch.groups?.site_id;
      const storeName = apiURLMatch.groups?.store_name;
      const urlPath = [siteID, storeName, key].filter(Boolean);
      const url = new URL(`/${urlPath.join("/")}?signature=${this.tokenHash}`, this.address);
      return {
        key,
        siteID,
        storeName,
        url,
        useSignedURL: req.headers.get("accept") === SIGNED_URL_ACCEPT_HEADER
      };
    }
    const legacyAPIURLMatch = req.url.match(LEGACY_API_URL_PATH);
    if (legacyAPIURLMatch) {
      const fullURL = new URL(req.url, this.address);
      const storeName = fullURL.searchParams.get("context") ?? LEGACY_DEFAULT_STORE;
      const key = legacyAPIURLMatch.groups?.key;
      const siteID = legacyAPIURLMatch.groups?.site_id;
      const urlPath = [siteID, storeName, key].filter(Boolean);
      const url = new URL(`/${urlPath.join("/")}?signature=${this.tokenHash}`, this.address);
      return {
        key,
        siteID,
        storeName,
        url,
        useSignedURL: true
      };
    }
    return null;
  }
  validateAccess(req) {
    if (!this.token) {
      return true;
    }
    const authorization = req.headers.get("authorization") || "";
    if (authorization.toLowerCase().startsWith("bearer ") && authorization.slice("bearer ".length) === this.token) {
      return true;
    }
    if (!req.url) {
      return false;
    }
    const url = new URL(req.url, this.address);
    const signature = url.searchParams.get("signature");
    if (signature === this.tokenHash) {
      return true;
    }
    return false;
  }
  /**
   * Traverses a path and collects both blobs and directories into a `result`
   * object, taking into account the `directories` and `prefix` parameters.
   */
  static async walk(options) {
    const { directories, path, prefix, result, rootPath } = options;
    const entries = await import_node_fs.promises.readdir(path);
    for (const entry of entries) {
      const entryPath = (0, import_node_path.join)(path, entry);
      const stat = await import_node_fs.promises.stat(entryPath);
      let key = (0, import_node_path.relative)(rootPath, entryPath);
      if (import_node_path.sep !== "/") {
        key = key.split(import_node_path.sep).join("/");
      }
      const mask = key.slice(0, prefix.length);
      const isMatch = prefix.startsWith(mask);
      if (!isMatch) {
        continue;
      }
      if (!stat.isDirectory()) {
        const etag = Math.random().toString().slice(2);
        result.blobs?.push({
          etag,
          key,
          last_modified: stat.mtime.toISOString(),
          size: stat.size
        });
        continue;
      }
      if (directories && key.startsWith(prefix)) {
        result.directories?.push(key);
        continue;
      }
      await _BlobsServer.walk({ directories, path: entryPath, prefix, rootPath, result });
    }
  }
  async start() {
    await import_node_fs.promises.mkdir(this.directory, { recursive: true });
    const server = new import_dev_utils.HTTPServer((req) => this.handleRequest(req));
    const address = await server.start(this.port ?? 0);
    const port = Number.parseInt(new URL(address).port);
    this.address = address;
    this.server = server;
    return {
      address,
      family: "ipv4",
      port
    };
  }
  async stop() {
    return this.server?.stop();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlobsServer,
  Operation
});
