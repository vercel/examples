import {
  METADATA_HEADER_INTERNAL,
  SIGNED_URL_ACCEPT_HEADER,
  decodeMetadata,
  encodeMetadata,
  isNodeError
} from "./chunk-IAHPN3L2.js";

// src/server.ts
import { createHmac } from "node:crypto";
import { createReadStream, promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { platform } from "node:process";
import { HTTPServer } from "@netlify/dev-utils";
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
    this.tokenHash = createHmac("sha256", Math.random.toString()).update(token ?? Math.random.toString()).digest("hex");
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
      await fs.rm(metadataPath, { force: true, recursive: true });
    } catch {
    }
    try {
      await fs.rm(dataPath, { force: true, recursive: true });
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
      const rawData = await fs.readFile(metadataPath, "utf8");
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
      const fileStream = createReadStream(dataPath);
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
      const rawData = await fs.readFile(metadataPath, "utf8");
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
      const allStores = await fs.readdir(rootPath);
      const filteredStores = allStores.map((store) => platform === "win32" ? decodeURIComponent(store) : store).filter((store) => store.startsWith(prefix));
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
      const tempPath = join(tmpdir(), Math.random().toString());
      const body = await req.arrayBuffer();
      await fs.writeFile(tempPath, Buffer.from(body));
      await fs.mkdir(dirname(dataPath), { recursive: true });
      await fs.rename(tempPath, dataPath);
      if (metadata) {
        await fs.mkdir(dirname(metadataPath), { recursive: true });
        await fs.writeFile(metadataPath, JSON.stringify(metadata));
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
    const rootPath = resolve(this.directory, "entries", siteID);
    if (!rawStoreName) {
      return { rootPath };
    }
    const storeName = platform === "win32" ? encodeURIComponent(rawStoreName) : rawStoreName;
    const storePath = resolve(rootPath, storeName);
    const dataPath = resolve(storePath, ...key);
    const metadataPath = resolve(this.directory, "metadata", siteID, storeName, ...key);
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
    const entries = await fs.readdir(path);
    for (const entry of entries) {
      const entryPath = join(path, entry);
      const stat = await fs.stat(entryPath);
      let key = relative(rootPath, entryPath);
      if (sep !== "/") {
        key = key.split(sep).join("/");
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
    await fs.mkdir(this.directory, { recursive: true });
    const server = new HTTPServer((req) => this.handleRequest(req));
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
export {
  BlobsServer,
  Operation
};
