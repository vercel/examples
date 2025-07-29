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

// src/main.ts
var main_exports = {};
__export(main_exports, {
  connectLambda: () => connectLambda,
  getDeployStore: () => getDeployStore,
  getStore: () => getStore,
  listStores: () => listStores,
  setEnvironmentContext: () => setEnvironmentContext
});
module.exports = __toCommonJS(main_exports);

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
var getEnvironmentContext = () => {
  const context = globalThis.netlifyBlobsContext || getEnvironment().get("NETLIFY_BLOBS_CONTEXT");
  if (typeof context !== "string" || !context) {
    return {};
  }
  const data = (0, import_runtime_utils.base64Decode)(context);
  try {
    return JSON.parse(data);
  } catch {
  }
  return {};
};
var setEnvironmentContext = (context) => {
  const encodedContext = (0, import_runtime_utils.base64Encode)(JSON.stringify(context));
  getEnvironment().set("NETLIFY_BLOBS_CONTEXT", encodedContext);
};
var MissingBlobsEnvironmentError = class extends Error {
  constructor(requiredProperties) {
    super(
      `The environment has not been configured to use Netlify Blobs. To use it manually, supply the following properties when creating a store: ${requiredProperties.join(
        ", "
      )}`
    );
    this.name = "MissingBlobsEnvironmentError";
  }
};

// src/lambda_compat.ts
var import_runtime_utils2 = require("@netlify/runtime-utils");
var connectLambda = (event) => {
  const rawData = (0, import_runtime_utils2.base64Decode)(event.blobs);
  const data = JSON.parse(rawData);
  const environmentContext = {
    deployID: event.headers["x-nf-deploy-id"],
    edgeURL: data.url,
    siteID: event.headers["x-nf-site-id"],
    token: data.token
  };
  setEnvironmentContext(environmentContext);
};

// src/consistency.ts
var BlobsConsistencyError = class extends Error {
  constructor() {
    super(
      `Netlify Blobs has failed to perform a read using strong consistency because the environment has not been configured with a 'uncachedEdgeURL' property`
    );
    this.name = "BlobsConsistencyError";
  }
};

// src/metadata.ts
var import_runtime_utils3 = require("@netlify/runtime-utils");
var BASE64_PREFIX = "b64;";
var METADATA_HEADER_INTERNAL = "x-amz-meta-user";
var METADATA_HEADER_EXTERNAL = "netlify-blobs-metadata";
var METADATA_MAX_SIZE = 2 * 1024;
var encodeMetadata = (metadata) => {
  if (!metadata) {
    return null;
  }
  const encodedObject = (0, import_runtime_utils3.base64Encode)(JSON.stringify(metadata));
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
  const decodedData = (0, import_runtime_utils3.base64Decode)(encodedData);
  const metadata = JSON.parse(decodedData);
  return metadata;
};
var getMetadataFromResponse = (response) => {
  if (!response.headers) {
    return {};
  }
  const value = response.headers.get(METADATA_HEADER_EXTERNAL) || response.headers.get(METADATA_HEADER_INTERNAL);
  try {
    return decodeMetadata(value);
  } catch {
    throw new Error(
      "An internal error occurred while trying to retrieve the metadata for an entry. Please try updating to the latest version of the Netlify Blobs client."
    );
  }
};

// src/region.ts
var REGION_AUTO = "auto";
var regions = {
  "us-east-1": true,
  "us-east-2": true,
  "eu-central-1": true,
  "ap-southeast-1": true,
  "ap-southeast-2": true
};
var isValidRegion = (input) => Object.keys(regions).includes(input);
var InvalidBlobsRegionError = class extends Error {
  constructor(region) {
    super(
      `${region} is not a supported Netlify Blobs region. Supported values are: ${Object.keys(regions).join(", ")}.`
    );
    this.name = "InvalidBlobsRegionError";
  }
};

// src/retry.ts
var DEFAULT_RETRY_DELAY = getEnvironment().get("NODE_ENV") === "test" ? 1 : 5e3;
var MIN_RETRY_DELAY = 1e3;
var MAX_RETRY = 5;
var RATE_LIMIT_HEADER = "X-RateLimit-Reset";
var fetchAndRetry = async (fetch, url, options, attemptsLeft = MAX_RETRY) => {
  try {
    const res = await fetch(url, options);
    if (attemptsLeft > 0 && (res.status === 429 || res.status >= 500)) {
      const delay = getDelay(res.headers.get(RATE_LIMIT_HEADER));
      await sleep(delay);
      return fetchAndRetry(fetch, url, options, attemptsLeft - 1);
    }
    return res;
  } catch (error) {
    if (attemptsLeft === 0) {
      throw error;
    }
    const delay = getDelay();
    await sleep(delay);
    return fetchAndRetry(fetch, url, options, attemptsLeft - 1);
  }
};
var getDelay = (rateLimitReset) => {
  if (!rateLimitReset) {
    return DEFAULT_RETRY_DELAY;
  }
  return Math.max(Number(rateLimitReset) * 1e3 - Date.now(), MIN_RETRY_DELAY);
};
var sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

// src/headers.ts
var NF_ERROR = "x-nf-error";
var NF_REQUEST_ID = "x-nf-request-id";

// src/util.ts
var BlobsInternalError = class extends Error {
  constructor(res) {
    let details = res.headers.get(NF_ERROR) || `${res.status} status code`;
    if (res.headers.has(NF_REQUEST_ID)) {
      details += `, ID: ${res.headers.get(NF_REQUEST_ID)}`;
    }
    super(`Netlify Blobs has generated an internal error (${details})`);
    this.name = "BlobsInternalError";
  }
};
var collectIterator = async (iterator) => {
  const result = [];
  for await (const item of iterator) {
    result.push(item);
  }
  return result;
};

// src/client.ts
var SIGNED_URL_ACCEPT_HEADER = "application/json;type=signed-url";
var Client = class {
  constructor({ apiURL, consistency, edgeURL, fetch, region, siteID, token, uncachedEdgeURL }) {
    this.apiURL = apiURL;
    this.consistency = consistency ?? "eventual";
    this.edgeURL = edgeURL;
    this.fetch = fetch ?? globalThis.fetch;
    this.region = region;
    this.siteID = siteID;
    this.token = token;
    this.uncachedEdgeURL = uncachedEdgeURL;
    if (!this.fetch) {
      throw new Error(
        "Netlify Blobs could not find a `fetch` client in the global scope. You can either update your runtime to a version that includes `fetch` (like Node.js 18.0.0 or above), or you can supply your own implementation using the `fetch` property."
      );
    }
  }
  async getFinalRequest({
    consistency: opConsistency,
    key,
    metadata,
    method,
    parameters = {},
    storeName
  }) {
    const encodedMetadata = encodeMetadata(metadata);
    const consistency = opConsistency ?? this.consistency;
    let urlPath = `/${this.siteID}`;
    if (storeName) {
      urlPath += `/${storeName}`;
    }
    if (key) {
      urlPath += `/${key}`;
    }
    if (this.edgeURL) {
      if (consistency === "strong" && !this.uncachedEdgeURL) {
        throw new BlobsConsistencyError();
      }
      const headers = {
        authorization: `Bearer ${this.token}`
      };
      if (encodedMetadata) {
        headers[METADATA_HEADER_INTERNAL] = encodedMetadata;
      }
      if (this.region) {
        urlPath = `/region:${this.region}${urlPath}`;
      }
      const url2 = new URL(urlPath, consistency === "strong" ? this.uncachedEdgeURL : this.edgeURL);
      for (const key2 in parameters) {
        url2.searchParams.set(key2, parameters[key2]);
      }
      return {
        headers,
        url: url2.toString()
      };
    }
    const apiHeaders = { authorization: `Bearer ${this.token}` };
    const url = new URL(`/api/v1/blobs${urlPath}`, this.apiURL ?? "https://api.netlify.com");
    for (const key2 in parameters) {
      url.searchParams.set(key2, parameters[key2]);
    }
    if (this.region) {
      url.searchParams.set("region", this.region);
    }
    if (storeName === void 0 || key === void 0) {
      return {
        headers: apiHeaders,
        url: url.toString()
      };
    }
    if (encodedMetadata) {
      apiHeaders[METADATA_HEADER_EXTERNAL] = encodedMetadata;
    }
    if (method === "head" /* HEAD */ || method === "delete" /* DELETE */) {
      return {
        headers: apiHeaders,
        url: url.toString()
      };
    }
    const res = await this.fetch(url.toString(), {
      headers: { ...apiHeaders, accept: SIGNED_URL_ACCEPT_HEADER },
      method
    });
    if (res.status !== 200) {
      throw new BlobsInternalError(res);
    }
    const { url: signedURL } = await res.json();
    const userHeaders = encodedMetadata ? { [METADATA_HEADER_INTERNAL]: encodedMetadata } : void 0;
    return {
      headers: userHeaders,
      url: signedURL
    };
  }
  async makeRequest({
    body,
    consistency,
    headers: extraHeaders,
    key,
    metadata,
    method,
    parameters,
    storeName
  }) {
    const { headers: baseHeaders = {}, url } = await this.getFinalRequest({
      consistency,
      key,
      metadata,
      method,
      parameters,
      storeName
    });
    const headers = {
      ...baseHeaders,
      ...extraHeaders
    };
    if (method === "put" /* PUT */) {
      headers["cache-control"] = "max-age=0, stale-while-revalidate=60";
    }
    const options = {
      body,
      headers,
      method
    };
    if (body instanceof ReadableStream) {
      options.duplex = "half";
    }
    return fetchAndRetry(this.fetch, url, options);
  }
};
var getClientOptions = (options, contextOverride) => {
  const context = contextOverride ?? getEnvironmentContext();
  const siteID = context.siteID ?? options.siteID;
  const token = context.token ?? options.token;
  if (!siteID || !token) {
    throw new MissingBlobsEnvironmentError(["siteID", "token"]);
  }
  if (options.region !== void 0 && !isValidRegion(options.region)) {
    throw new InvalidBlobsRegionError(options.region);
  }
  const clientOptions = {
    apiURL: context.apiURL ?? options.apiURL,
    consistency: options.consistency,
    edgeURL: context.edgeURL ?? options.edgeURL,
    fetch: options.fetch,
    region: options.region,
    siteID,
    token,
    uncachedEdgeURL: context.uncachedEdgeURL ?? options.uncachedEdgeURL
  };
  return clientOptions;
};

// src/store.ts
var DEPLOY_STORE_PREFIX = "deploy:";
var LEGACY_STORE_INTERNAL_PREFIX = "netlify-internal/legacy-namespace/";
var SITE_STORE_PREFIX = "site:";
var Store = class _Store {
  constructor(options) {
    this.client = options.client;
    if ("deployID" in options) {
      _Store.validateDeployID(options.deployID);
      let name = DEPLOY_STORE_PREFIX + options.deployID;
      if (options.name) {
        name += `:${options.name}`;
      }
      this.name = name;
    } else if (options.name.startsWith(LEGACY_STORE_INTERNAL_PREFIX)) {
      const storeName = options.name.slice(LEGACY_STORE_INTERNAL_PREFIX.length);
      _Store.validateStoreName(storeName);
      this.name = storeName;
    } else {
      _Store.validateStoreName(options.name);
      this.name = SITE_STORE_PREFIX + options.name;
    }
  }
  async delete(key) {
    const res = await this.client.makeRequest({ key, method: "delete" /* DELETE */, storeName: this.name });
    if (![200, 204, 404].includes(res.status)) {
      throw new BlobsInternalError(res);
    }
  }
  async get(key, options) {
    const { consistency, type } = options ?? {};
    const res = await this.client.makeRequest({ consistency, key, method: "get" /* GET */, storeName: this.name });
    if (res.status === 404) {
      return null;
    }
    if (res.status !== 200) {
      throw new BlobsInternalError(res);
    }
    if (type === void 0 || type === "text") {
      return res.text();
    }
    if (type === "arrayBuffer") {
      return res.arrayBuffer();
    }
    if (type === "blob") {
      return res.blob();
    }
    if (type === "json") {
      return res.json();
    }
    if (type === "stream") {
      return res.body;
    }
    throw new BlobsInternalError(res);
  }
  async getMetadata(key, { consistency } = {}) {
    const res = await this.client.makeRequest({ consistency, key, method: "head" /* HEAD */, storeName: this.name });
    if (res.status === 404) {
      return null;
    }
    if (res.status !== 200 && res.status !== 304) {
      throw new BlobsInternalError(res);
    }
    const etag = res?.headers.get("etag") ?? void 0;
    const metadata = getMetadataFromResponse(res);
    const result = {
      etag,
      metadata
    };
    return result;
  }
  async getWithMetadata(key, options) {
    const { consistency, etag: requestETag, type } = options ?? {};
    const headers = requestETag ? { "if-none-match": requestETag } : void 0;
    const res = await this.client.makeRequest({
      consistency,
      headers,
      key,
      method: "get" /* GET */,
      storeName: this.name
    });
    if (res.status === 404) {
      return null;
    }
    if (res.status !== 200 && res.status !== 304) {
      throw new BlobsInternalError(res);
    }
    const responseETag = res?.headers.get("etag") ?? void 0;
    const metadata = getMetadataFromResponse(res);
    const result = {
      etag: responseETag,
      metadata
    };
    if (res.status === 304 && requestETag) {
      return { data: null, ...result };
    }
    if (type === void 0 || type === "text") {
      return { data: await res.text(), ...result };
    }
    if (type === "arrayBuffer") {
      return { data: await res.arrayBuffer(), ...result };
    }
    if (type === "blob") {
      return { data: await res.blob(), ...result };
    }
    if (type === "json") {
      return { data: await res.json(), ...result };
    }
    if (type === "stream") {
      return { data: res.body, ...result };
    }
    throw new Error(`Invalid 'type' property: ${type}. Expected: arrayBuffer, blob, json, stream, or text.`);
  }
  list(options = {}) {
    const iterator = this.getListIterator(options);
    if (options.paginate) {
      return iterator;
    }
    return collectIterator(iterator).then(
      (items) => items.reduce(
        (acc, item) => ({
          blobs: [...acc.blobs, ...item.blobs],
          directories: [...acc.directories, ...item.directories]
        }),
        { blobs: [], directories: [] }
      )
    );
  }
  async set(key, data, { metadata } = {}) {
    _Store.validateKey(key);
    const res = await this.client.makeRequest({
      body: data,
      key,
      metadata,
      method: "put" /* PUT */,
      storeName: this.name
    });
    if (res.status !== 200) {
      throw new BlobsInternalError(res);
    }
  }
  async setJSON(key, data, { metadata } = {}) {
    _Store.validateKey(key);
    const payload = JSON.stringify(data);
    const headers = {
      "content-type": "application/json"
    };
    const res = await this.client.makeRequest({
      body: payload,
      headers,
      key,
      metadata,
      method: "put" /* PUT */,
      storeName: this.name
    });
    if (res.status !== 200) {
      throw new BlobsInternalError(res);
    }
  }
  static formatListResultBlob(result) {
    if (!result.key) {
      return null;
    }
    return {
      etag: result.etag,
      key: result.key
    };
  }
  static validateKey(key) {
    if (key === "") {
      throw new Error("Blob key must not be empty.");
    }
    if (key.startsWith("/") || key.startsWith("%2F")) {
      throw new Error("Blob key must not start with forward slash (/).");
    }
    if (new TextEncoder().encode(key).length > 600) {
      throw new Error(
        "Blob key must be a sequence of Unicode characters whose UTF-8 encoding is at most 600 bytes long."
      );
    }
  }
  static validateDeployID(deployID) {
    if (!/^\w{1,24}$/.test(deployID)) {
      throw new Error(`'${deployID}' is not a valid Netlify deploy ID.`);
    }
  }
  static validateStoreName(name) {
    if (name.includes("/") || name.includes("%2F")) {
      throw new Error("Store name must not contain forward slashes (/).");
    }
    if (new TextEncoder().encode(name).length > 64) {
      throw new Error(
        "Store name must be a sequence of Unicode characters whose UTF-8 encoding is at most 64 bytes long."
      );
    }
  }
  getListIterator(options) {
    const { client, name: storeName } = this;
    const parameters = {};
    if (options?.prefix) {
      parameters.prefix = options.prefix;
    }
    if (options?.directories) {
      parameters.directories = "true";
    }
    return {
      [Symbol.asyncIterator]() {
        let currentCursor = null;
        let done = false;
        return {
          async next() {
            if (done) {
              return { done: true, value: void 0 };
            }
            const nextParameters = { ...parameters };
            if (currentCursor !== null) {
              nextParameters.cursor = currentCursor;
            }
            const res = await client.makeRequest({
              method: "get" /* GET */,
              parameters: nextParameters,
              storeName
            });
            let blobs = [];
            let directories = [];
            if (![200, 204, 404].includes(res.status)) {
              throw new BlobsInternalError(res);
            }
            if (res.status === 404) {
              done = true;
            } else {
              const page = await res.json();
              if (page.next_cursor) {
                currentCursor = page.next_cursor;
              } else {
                done = true;
              }
              blobs = (page.blobs ?? []).map(_Store.formatListResultBlob).filter(Boolean);
              directories = page.directories ?? [];
            }
            return {
              done: false,
              value: {
                blobs,
                directories
              }
            };
          }
        };
      }
    };
  }
};

// src/store_factory.ts
var getDeployStore = (input = {}) => {
  const context = getEnvironmentContext();
  const options = typeof input === "string" ? { name: input } : input;
  const deployID = options.deployID ?? context.deployID;
  if (!deployID) {
    throw new MissingBlobsEnvironmentError(["deployID"]);
  }
  const clientOptions = getClientOptions(options, context);
  if (!clientOptions.region) {
    if (clientOptions.edgeURL || clientOptions.uncachedEdgeURL) {
      if (!context.primaryRegion) {
        throw new Error(
          "When accessing a deploy store, the Netlify Blobs client needs to be configured with a region, and one was not found in the environment. To manually set the region, set the `region` property in the `getDeployStore` options. If you are using the Netlify CLI, you may have an outdated version; run `npm install -g netlify-cli@latest` to update and try again."
        );
      }
      clientOptions.region = context.primaryRegion;
    } else {
      clientOptions.region = REGION_AUTO;
    }
  }
  const client = new Client(clientOptions);
  return new Store({ client, deployID, name: options.name });
};
var getStore = (input) => {
  if (typeof input === "string") {
    const clientOptions = getClientOptions({});
    const client = new Client(clientOptions);
    return new Store({ client, name: input });
  }
  if (typeof input?.name === "string" && typeof input?.siteID === "string" && typeof input?.token === "string") {
    const { name, siteID, token } = input;
    const clientOptions = getClientOptions(input, { siteID, token });
    if (!name || !siteID || !token) {
      throw new MissingBlobsEnvironmentError(["name", "siteID", "token"]);
    }
    const client = new Client(clientOptions);
    return new Store({ client, name });
  }
  if (typeof input?.name === "string") {
    const { name } = input;
    const clientOptions = getClientOptions(input);
    if (!name) {
      throw new MissingBlobsEnvironmentError(["name"]);
    }
    const client = new Client(clientOptions);
    return new Store({ client, name });
  }
  if (typeof input?.deployID === "string") {
    const clientOptions = getClientOptions(input);
    const { deployID } = input;
    if (!deployID) {
      throw new MissingBlobsEnvironmentError(["deployID"]);
    }
    const client = new Client(clientOptions);
    return new Store({ client, deployID });
  }
  throw new Error(
    "The `getStore` method requires the name of the store as a string or as the `name` property of an options object"
  );
};

// src/store_list.ts
function listStores(options = {}) {
  const context = getEnvironmentContext();
  const clientOptions = getClientOptions(options, context);
  const client = new Client(clientOptions);
  const iterator = getListIterator(client, SITE_STORE_PREFIX);
  if (options.paginate) {
    return iterator;
  }
  return collectIterator(iterator).then((results) => ({ stores: results.flatMap((page) => page.stores) }));
}
var formatListStoreResponse = (stores) => stores.filter((store) => !store.startsWith(DEPLOY_STORE_PREFIX)).map((store) => store.startsWith(SITE_STORE_PREFIX) ? store.slice(SITE_STORE_PREFIX.length) : store);
var getListIterator = (client, prefix) => {
  const parameters = {
    prefix
  };
  return {
    [Symbol.asyncIterator]() {
      let currentCursor = null;
      let done = false;
      return {
        async next() {
          if (done) {
            return { done: true, value: void 0 };
          }
          const nextParameters = { ...parameters };
          if (currentCursor !== null) {
            nextParameters.cursor = currentCursor;
          }
          const res = await client.makeRequest({
            method: "get" /* GET */,
            parameters: nextParameters
          });
          if (res.status === 404) {
            return { done: true, value: void 0 };
          }
          const page = await res.json();
          if (page.next_cursor) {
            currentCursor = page.next_cursor;
          } else {
            done = true;
          }
          return {
            done: false,
            value: {
              ...page,
              stores: formatListStoreResponse(page.stores)
            }
          };
        }
      };
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  connectLambda,
  getDeployStore,
  getStore,
  listStores,
  setEnvironmentContext
});
