import {
  __name,
  init_esm
} from "./chunk-3R76H35D.mjs";

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/error.js
init_esm();
var S2Error = class extends Error {
  static {
    __name(this, "S2Error");
  }
  code;
  status;
  constructor({ message, code, status }) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = "S2Error";
  }
};
var SeqNumMismatchError = class extends S2Error {
  static {
    __name(this, "SeqNumMismatchError");
  }
  /** The expected next sequence number for the stream. */
  expectedSeqNum;
  constructor({ message, code, status, expectedSeqNum }) {
    super({
      message: `${message}
Expected sequence number: ${expectedSeqNum}`,
      code,
      status
    });
    this.name = "SeqNumMismatchError";
    this.expectedSeqNum = expectedSeqNum;
  }
};
var FencingTokenMismatchError = class extends S2Error {
  static {
    __name(this, "FencingTokenMismatchError");
  }
  /** The expected fencing token for the stream. */
  expectedFencingToken;
  constructor({ message, code, status, expectedFencingToken }) {
    super({
      message: `${message}
Expected fencing token: ${expectedFencingToken}`,
      code,
      status
    });
    this.name = "FencingTokenMismatchError";
    this.expectedFencingToken = expectedFencingToken;
  }
};
var RangeNotSatisfiableError = class extends S2Error {
  static {
    __name(this, "RangeNotSatisfiableError");
  }
  constructor({ message = "Range not satisfiable: requested position is beyond the stream tail. Use 'clamp: true' to start from the tail instead.", code, status = 416 } = {}) {
    super({
      message,
      code,
      status
    });
    this.name = "RangeNotSatisfiableError";
  }
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/utils.js
init_esm();
function appendRecordMake(body, headers, timestamp) {
  return {
    body,
    headers,
    timestamp
  };
}
__name(appendRecordMake, "appendRecordMake");
function appendRecordCommand(command, body, timestamp) {
  const headers = (() => {
    if (typeof command === "string") {
      return [["", command]];
    }
    return [[new TextEncoder().encode(""), command]];
  })();
  return AppendRecord.make(body, headers, timestamp);
}
__name(appendRecordCommand, "appendRecordCommand");
var AppendRecord = {
  // overloads for only string or only bytes
  make: appendRecordMake,
  command: appendRecordCommand,
  fence: /* @__PURE__ */ __name((fencing_token, timestamp) => {
    return AppendRecord.command("fence", fencing_token, timestamp);
  }, "fence"),
  trim: /* @__PURE__ */ __name((seqNum, timestamp) => {
    const buffer = new Uint8Array(8);
    const view = new DataView(buffer.buffer);
    view.setBigUint64(0, BigInt(seqNum), false);
    return AppendRecord.command(new TextEncoder().encode("trim"), buffer, timestamp);
  }, "trim")
};
function utf8ByteLength(str) {
  let bytes = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code <= 127) {
      bytes += 1;
    } else if (code <= 2047) {
      bytes += 2;
    } else if (code >= 55296 && code <= 56319) {
      if (i + 1 < str.length) {
        const next = str.charCodeAt(i + 1);
        if (next >= 56320 && next <= 57343) {
          bytes += 4;
          i++;
        } else {
          bytes += 3;
        }
      } else {
        bytes += 3;
      }
    } else if (code >= 56320 && code <= 57343) {
      bytes += 3;
    } else {
      bytes += 3;
    }
  }
  return bytes;
}
__name(utf8ByteLength, "utf8ByteLength");
function meteredSizeBytes(record) {
  let numHeaders = 0;
  let headersSize = 0;
  if (record.headers) {
    if (Array.isArray(record.headers)) {
      numHeaders = record.headers.length;
      headersSize = record.headers.reduce((sum, [k, v]) => {
        const keySize = typeof k === "string" ? utf8ByteLength(k) : k.length;
        const valueSize = typeof v === "string" ? utf8ByteLength(v) : v.length;
        return sum + keySize + valueSize;
      }, 0);
    } else {
      const entries = Object.entries(record.headers);
      numHeaders = entries.length;
      headersSize = entries.reduce((sum, [k, v]) => {
        return sum + utf8ByteLength(k) + utf8ByteLength(v);
      }, 0);
    }
  }
  const bodySize = record.body ? typeof record.body === "string" ? utf8ByteLength(record.body) : record.body.length : 0;
  return 8 + 2 * numHeaders + headersSize + bodySize;
}
__name(meteredSizeBytes, "meteredSizeBytes");
function computeAppendRecordFormat(record) {
  let result = "string";
  if (record.body && typeof record.body !== "string") {
    result = "bytes";
  }
  if (record.headers && Array.isArray(record.headers) && record.headers.some(([k, v]) => typeof k !== "string" || typeof v !== "string")) {
    result = "bytes";
  }
  return result;
}
__name(computeAppendRecordFormat, "computeAppendRecordFormat");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/generated/client/utils.gen.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/generated/core/auth.gen.js
init_esm();
var getAuthToken = /* @__PURE__ */ __name(async (auth, callback) => {
  const token = typeof callback === "function" ? await callback(auth) : callback;
  if (!token) {
    return;
  }
  if (auth.scheme === "bearer") {
    return `Bearer ${token}`;
  }
  if (auth.scheme === "basic") {
    return `Basic ${btoa(token)}`;
  }
  return token;
}, "getAuthToken");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/generated/core/bodySerializer.gen.js
init_esm();
var jsonBodySerializer = {
  bodySerializer: /* @__PURE__ */ __name((body) => JSON.stringify(body, (_key, value2) => typeof value2 === "bigint" ? value2.toString() : value2), "bodySerializer")
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/generated/core/pathSerializer.gen.js
init_esm();
var separatorArrayExplode = /* @__PURE__ */ __name((style) => {
  switch (style) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, "separatorArrayExplode");
var separatorArrayNoExplode = /* @__PURE__ */ __name((style) => {
  switch (style) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
}, "separatorArrayNoExplode");
var separatorObjectExplode = /* @__PURE__ */ __name((style) => {
  switch (style) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, "separatorObjectExplode");
var serializeArrayParam = /* @__PURE__ */ __name(({ allowReserved, explode, name, style, value: value2 }) => {
  if (!explode) {
    const joinedValues2 = (allowReserved ? value2 : value2.map((v) => encodeURIComponent(v))).join(separatorArrayNoExplode(style));
    switch (style) {
      case "label":
        return `.${joinedValues2}`;
      case "matrix":
        return `;${name}=${joinedValues2}`;
      case "simple":
        return joinedValues2;
      default:
        return `${name}=${joinedValues2}`;
    }
  }
  const separator = separatorArrayExplode(style);
  const joinedValues = value2.map((v) => {
    if (style === "label" || style === "simple") {
      return allowReserved ? v : encodeURIComponent(v);
    }
    return serializePrimitiveParam({
      allowReserved,
      name,
      value: v
    });
  }).join(separator);
  return style === "label" || style === "matrix" ? separator + joinedValues : joinedValues;
}, "serializeArrayParam");
var serializePrimitiveParam = /* @__PURE__ */ __name(({ allowReserved, name, value: value2 }) => {
  if (value2 === void 0 || value2 === null) {
    return "";
  }
  if (typeof value2 === "object") {
    throw new Error("Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.");
  }
  return `${name}=${allowReserved ? value2 : encodeURIComponent(value2)}`;
}, "serializePrimitiveParam");
var serializeObjectParam = /* @__PURE__ */ __name(({ allowReserved, explode, name, style, value: value2, valueOnly }) => {
  if (value2 instanceof Date) {
    return valueOnly ? value2.toISOString() : `${name}=${value2.toISOString()}`;
  }
  if (style !== "deepObject" && !explode) {
    let values = [];
    Object.entries(value2).forEach(([key, v]) => {
      values = [
        ...values,
        key,
        allowReserved ? v : encodeURIComponent(v)
      ];
    });
    const joinedValues2 = values.join(",");
    switch (style) {
      case "form":
        return `${name}=${joinedValues2}`;
      case "label":
        return `.${joinedValues2}`;
      case "matrix":
        return `;${name}=${joinedValues2}`;
      default:
        return joinedValues2;
    }
  }
  const separator = separatorObjectExplode(style);
  const joinedValues = Object.entries(value2).map(([key, v]) => serializePrimitiveParam({
    allowReserved,
    name: style === "deepObject" ? `${name}[${key}]` : key,
    value: v
  })).join(separator);
  return style === "label" || style === "matrix" ? separator + joinedValues : joinedValues;
}, "serializeObjectParam");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/generated/core/utils.gen.js
init_esm();
var PATH_PARAM_RE = /\{[^{}]+\}/g;
var defaultPathSerializer = /* @__PURE__ */ __name(({ path, url: _url }) => {
  let url = _url;
  const matches = _url.match(PATH_PARAM_RE);
  if (matches) {
    for (const match of matches) {
      let explode = false;
      let name = match.substring(1, match.length - 1);
      let style = "simple";
      if (name.endsWith("*")) {
        explode = true;
        name = name.substring(0, name.length - 1);
      }
      if (name.startsWith(".")) {
        name = name.substring(1);
        style = "label";
      } else if (name.startsWith(";")) {
        name = name.substring(1);
        style = "matrix";
      }
      const value2 = path[name];
      if (value2 === void 0 || value2 === null) {
        continue;
      }
      if (Array.isArray(value2)) {
        url = url.replace(match, serializeArrayParam({ explode, name, style, value: value2 }));
        continue;
      }
      if (typeof value2 === "object") {
        url = url.replace(match, serializeObjectParam({
          explode,
          name,
          style,
          value: value2,
          valueOnly: true
        }));
        continue;
      }
      if (style === "matrix") {
        url = url.replace(match, `;${serializePrimitiveParam({
          name,
          value: value2
        })}`);
        continue;
      }
      const replaceValue = encodeURIComponent(style === "label" ? `.${value2}` : value2);
      url = url.replace(match, replaceValue);
    }
  }
  return url;
}, "defaultPathSerializer");
var getUrl = /* @__PURE__ */ __name(({ baseUrl, path, query, querySerializer, url: _url }) => {
  const pathUrl = _url.startsWith("/") ? _url : `/${_url}`;
  let url = (baseUrl ?? "") + pathUrl;
  if (path) {
    url = defaultPathSerializer({ path, url });
  }
  let search = query ? querySerializer(query) : "";
  if (search.startsWith("?")) {
    search = search.substring(1);
  }
  if (search) {
    url += `?${search}`;
  }
  return url;
}, "getUrl");
function getValidRequestBody(options) {
  const hasBody = options.body !== void 0;
  const isSerializedBody = hasBody && options.bodySerializer;
  if (isSerializedBody) {
    if ("serializedBody" in options) {
      const hasSerializedBody = options.serializedBody !== void 0 && options.serializedBody !== "";
      return hasSerializedBody ? options.serializedBody : null;
    }
    return options.body !== "" ? options.body : null;
  }
  if (hasBody) {
    return options.body;
  }
  return void 0;
}
__name(getValidRequestBody, "getValidRequestBody");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/generated/client/utils.gen.js
var createQuerySerializer = /* @__PURE__ */ __name(({ parameters = {}, ...args } = {}) => {
  const querySerializer = /* @__PURE__ */ __name((queryParams) => {
    const search = [];
    if (queryParams && typeof queryParams === "object") {
      for (const name in queryParams) {
        const value2 = queryParams[name];
        if (value2 === void 0 || value2 === null) {
          continue;
        }
        const options = parameters[name] || args;
        if (Array.isArray(value2)) {
          const serializedArray = serializeArrayParam({
            allowReserved: options.allowReserved,
            explode: true,
            name,
            style: "form",
            value: value2,
            ...options.array
          });
          if (serializedArray)
            search.push(serializedArray);
        } else if (typeof value2 === "object") {
          const serializedObject = serializeObjectParam({
            allowReserved: options.allowReserved,
            explode: true,
            name,
            style: "deepObject",
            value: value2,
            ...options.object
          });
          if (serializedObject)
            search.push(serializedObject);
        } else {
          const serializedPrimitive = serializePrimitiveParam({
            allowReserved: options.allowReserved,
            name,
            value: value2
          });
          if (serializedPrimitive)
            search.push(serializedPrimitive);
        }
      }
    }
    return search.join("&");
  }, "querySerializer");
  return querySerializer;
}, "createQuerySerializer");
var getParseAs = /* @__PURE__ */ __name((contentType) => {
  if (!contentType) {
    return "stream";
  }
  const cleanContent = contentType.split(";")[0]?.trim();
  if (!cleanContent) {
    return;
  }
  if (cleanContent.startsWith("application/json") || cleanContent.endsWith("+json")) {
    return "json";
  }
  if (cleanContent === "multipart/form-data") {
    return "formData";
  }
  if (["application/", "audio/", "image/", "video/"].some((type) => cleanContent.startsWith(type))) {
    return "blob";
  }
  if (cleanContent.startsWith("text/")) {
    return "text";
  }
  return;
}, "getParseAs");
var checkForExistence = /* @__PURE__ */ __name((options, name) => {
  if (!name) {
    return false;
  }
  if (options.headers.has(name) || options.query?.[name] || options.headers.get("Cookie")?.includes(`${name}=`)) {
    return true;
  }
  return false;
}, "checkForExistence");
var setAuthParams = /* @__PURE__ */ __name(async ({ security, ...options }) => {
  for (const auth of security) {
    if (checkForExistence(options, auth.name)) {
      continue;
    }
    const token = await getAuthToken(auth, options.auth);
    if (!token) {
      continue;
    }
    const name = auth.name ?? "Authorization";
    switch (auth.in) {
      case "query":
        if (!options.query) {
          options.query = {};
        }
        options.query[name] = token;
        break;
      case "cookie":
        options.headers.append("Cookie", `${name}=${token}`);
        break;
      case "header":
      default:
        options.headers.set(name, token);
        break;
    }
  }
}, "setAuthParams");
var buildUrl = /* @__PURE__ */ __name((options) => getUrl({
  baseUrl: options.baseUrl,
  path: options.path,
  query: options.query,
  querySerializer: typeof options.querySerializer === "function" ? options.querySerializer : createQuerySerializer(options.querySerializer),
  url: options.url
}), "buildUrl");
var mergeConfigs = /* @__PURE__ */ __name((a, b) => {
  const config = { ...a, ...b };
  if (config.baseUrl?.endsWith("/")) {
    config.baseUrl = config.baseUrl.substring(0, config.baseUrl.length - 1);
  }
  config.headers = mergeHeaders(a.headers, b.headers);
  return config;
}, "mergeConfigs");
var headersEntries = /* @__PURE__ */ __name((headers) => {
  const entries = [];
  headers.forEach((value2, key) => {
    entries.push([key, value2]);
  });
  return entries;
}, "headersEntries");
var mergeHeaders = /* @__PURE__ */ __name((...headers) => {
  const mergedHeaders = new Headers();
  for (const header of headers) {
    if (!header) {
      continue;
    }
    const iterator = header instanceof Headers ? headersEntries(header) : Object.entries(header);
    for (const [key, value2] of iterator) {
      if (value2 === null) {
        mergedHeaders.delete(key);
      } else if (Array.isArray(value2)) {
        for (const v of value2) {
          mergedHeaders.append(key, v);
        }
      } else if (value2 !== void 0) {
        mergedHeaders.set(key, typeof value2 === "object" ? JSON.stringify(value2) : value2);
      }
    }
  }
  return mergedHeaders;
}, "mergeHeaders");
var Interceptors = class {
  static {
    __name(this, "Interceptors");
  }
  fns = [];
  clear() {
    this.fns = [];
  }
  eject(id) {
    const index = this.getInterceptorIndex(id);
    if (this.fns[index]) {
      this.fns[index] = null;
    }
  }
  exists(id) {
    const index = this.getInterceptorIndex(id);
    return Boolean(this.fns[index]);
  }
  getInterceptorIndex(id) {
    if (typeof id === "number") {
      return this.fns[id] ? id : -1;
    }
    return this.fns.indexOf(id);
  }
  update(id, fn) {
    const index = this.getInterceptorIndex(id);
    if (this.fns[index]) {
      this.fns[index] = fn;
      return id;
    }
    return false;
  }
  use(fn) {
    this.fns.push(fn);
    return this.fns.length - 1;
  }
};
var createInterceptors = /* @__PURE__ */ __name(() => ({
  error: new Interceptors(),
  request: new Interceptors(),
  response: new Interceptors()
}), "createInterceptors");
var defaultQuerySerializer = createQuerySerializer({
  allowReserved: false,
  array: {
    explode: true,
    style: "form"
  },
  object: {
    explode: true,
    style: "deepObject"
  }
});
var defaultHeaders = {
  "Content-Type": "application/json"
};
var createConfig = /* @__PURE__ */ __name((override = {}) => ({
  ...jsonBodySerializer,
  headers: defaultHeaders,
  parseAs: "auto",
  querySerializer: defaultQuerySerializer,
  ...override
}), "createConfig");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/generated/client/client.gen.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/generated/core/serverSentEvents.gen.js
init_esm();
var createSseClient = /* @__PURE__ */ __name(({ onRequest, onSseError, onSseEvent, responseTransformer, responseValidator, sseDefaultRetryDelay, sseMaxRetryAttempts, sseMaxRetryDelay, sseSleepFn, url, ...options }) => {
  let lastEventId;
  const sleep = sseSleepFn ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  const createStream2 = /* @__PURE__ */ __name(async function* () {
    let retryDelay = sseDefaultRetryDelay ?? 3e3;
    let attempt = 0;
    const signal = options.signal ?? new AbortController().signal;
    while (true) {
      if (signal.aborted)
        break;
      attempt++;
      const headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
      if (lastEventId !== void 0) {
        headers.set("Last-Event-ID", lastEventId);
      }
      try {
        const requestInit = {
          redirect: "follow",
          ...options,
          body: options.serializedBody,
          headers,
          signal
        };
        let request = new Request(url, requestInit);
        if (onRequest) {
          request = await onRequest(url, requestInit);
        }
        const _fetch = options.fetch ?? globalThis.fetch;
        const response = await _fetch(request);
        if (!response.ok)
          throw new Error(`SSE failed: ${response.status} ${response.statusText}`);
        if (!response.body)
          throw new Error("No body in SSE response");
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let buffer = "";
        const abortHandler = /* @__PURE__ */ __name(() => {
          try {
            reader.cancel();
          } catch {
          }
        }, "abortHandler");
        signal.addEventListener("abort", abortHandler);
        try {
          while (true) {
            const { done, value: value2 } = await reader.read();
            if (done)
              break;
            buffer += value2;
            const chunks = buffer.split("\n\n");
            buffer = chunks.pop() ?? "";
            for (const chunk of chunks) {
              const lines = chunk.split("\n");
              const dataLines = [];
              let eventName;
              for (const line of lines) {
                if (line.startsWith("data:")) {
                  dataLines.push(line.replace(/^data:\s*/, ""));
                } else if (line.startsWith("event:")) {
                  eventName = line.replace(/^event:\s*/, "");
                } else if (line.startsWith("id:")) {
                  lastEventId = line.replace(/^id:\s*/, "");
                } else if (line.startsWith("retry:")) {
                  const parsed = Number.parseInt(line.replace(/^retry:\s*/, ""), 10);
                  if (!Number.isNaN(parsed)) {
                    retryDelay = parsed;
                  }
                }
              }
              let data;
              let parsedJson = false;
              if (dataLines.length) {
                const rawData = dataLines.join("\n");
                try {
                  data = JSON.parse(rawData);
                  parsedJson = true;
                } catch {
                  data = rawData;
                }
              }
              if (parsedJson) {
                if (responseValidator) {
                  await responseValidator(data);
                }
                if (responseTransformer) {
                  data = await responseTransformer(data);
                }
              }
              onSseEvent?.({
                data,
                event: eventName,
                id: lastEventId,
                retry: retryDelay
              });
              if (dataLines.length) {
                yield data;
              }
            }
          }
        } finally {
          signal.removeEventListener("abort", abortHandler);
          reader.releaseLock();
        }
        break;
      } catch (error) {
        onSseError?.(error);
        if (sseMaxRetryAttempts !== void 0 && attempt >= sseMaxRetryAttempts) {
          break;
        }
        const backoff = Math.min(retryDelay * 2 ** (attempt - 1), sseMaxRetryDelay ?? 3e4);
        await sleep(backoff);
      }
    }
  }, "createStream");
  const stream = createStream2();
  return { stream };
}, "createSseClient");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/generated/client/client.gen.js
var createClient = /* @__PURE__ */ __name((config = {}) => {
  let _config = mergeConfigs(createConfig(), config);
  const getConfig = /* @__PURE__ */ __name(() => ({ ..._config }), "getConfig");
  const setConfig = /* @__PURE__ */ __name((config2) => {
    _config = mergeConfigs(_config, config2);
    return getConfig();
  }, "setConfig");
  const interceptors = createInterceptors();
  const beforeRequest = /* @__PURE__ */ __name(async (options) => {
    const opts = {
      ..._config,
      ...options,
      fetch: options.fetch ?? _config.fetch ?? globalThis.fetch,
      headers: mergeHeaders(_config.headers, options.headers),
      serializedBody: void 0
    };
    if (opts.security) {
      await setAuthParams({
        ...opts,
        security: opts.security
      });
    }
    if (opts.requestValidator) {
      await opts.requestValidator(opts);
    }
    if (opts.body !== void 0 && opts.bodySerializer) {
      opts.serializedBody = opts.bodySerializer(opts.body);
    }
    if (opts.body === void 0 || opts.serializedBody === "") {
      opts.headers.delete("Content-Type");
    }
    const url = buildUrl(opts);
    return { opts, url };
  }, "beforeRequest");
  const request = /* @__PURE__ */ __name(async (options) => {
    const { opts, url } = await beforeRequest(options);
    const requestInit = {
      redirect: "follow",
      ...opts,
      body: getValidRequestBody(opts)
    };
    let request2 = new Request(url, requestInit);
    for (const fn of interceptors.request.fns) {
      if (fn) {
        request2 = await fn(request2, opts);
      }
    }
    const _fetch = opts.fetch;
    let response = await _fetch(request2);
    for (const fn of interceptors.response.fns) {
      if (fn) {
        response = await fn(response, request2, opts);
      }
    }
    const result = {
      request: request2,
      response
    };
    if (response.ok) {
      const parseAs = (opts.parseAs === "auto" ? getParseAs(response.headers.get("Content-Type")) : opts.parseAs) ?? "json";
      if (response.status === 204 || response.headers.get("Content-Length") === "0") {
        let emptyData;
        switch (parseAs) {
          case "arrayBuffer":
          case "blob":
          case "text":
            emptyData = await response[parseAs]();
            break;
          case "formData":
            emptyData = new FormData();
            break;
          case "stream":
            emptyData = response.body;
            break;
          case "json":
          default:
            emptyData = {};
            break;
        }
        return opts.responseStyle === "data" ? emptyData : {
          data: emptyData,
          ...result
        };
      }
      let data;
      switch (parseAs) {
        case "arrayBuffer":
        case "blob":
        case "formData":
        case "json":
        case "text":
          data = await response[parseAs]();
          break;
        case "stream":
          return opts.responseStyle === "data" ? response.body : {
            data: response.body,
            ...result
          };
      }
      if (parseAs === "json") {
        if (opts.responseValidator) {
          await opts.responseValidator(data);
        }
        if (opts.responseTransformer) {
          data = await opts.responseTransformer(data);
        }
      }
      return opts.responseStyle === "data" ? data : {
        data,
        ...result
      };
    }
    const textError = await response.text();
    let jsonError;
    try {
      jsonError = JSON.parse(textError);
    } catch {
    }
    const error = jsonError ?? textError;
    let finalError = error;
    for (const fn of interceptors.error.fns) {
      if (fn) {
        finalError = await fn(error, response, request2, opts);
      }
    }
    finalError = finalError || {};
    if (opts.throwOnError) {
      throw finalError;
    }
    return opts.responseStyle === "data" ? void 0 : {
      error: finalError,
      ...result
    };
  }, "request");
  const makeMethodFn = /* @__PURE__ */ __name((method) => (options) => request({ ...options, method }), "makeMethodFn");
  const makeSseFn = /* @__PURE__ */ __name((method) => async (options) => {
    const { opts, url } = await beforeRequest(options);
    return createSseClient({
      ...opts,
      body: opts.body,
      headers: opts.headers,
      method,
      onRequest: /* @__PURE__ */ __name(async (url2, init) => {
        let request2 = new Request(url2, init);
        for (const fn of interceptors.request.fns) {
          if (fn) {
            request2 = await fn(request2, opts);
          }
        }
        return request2;
      }, "onRequest"),
      url
    });
  }, "makeSseFn");
  return {
    buildUrl,
    connect: makeMethodFn("CONNECT"),
    delete: makeMethodFn("DELETE"),
    get: makeMethodFn("GET"),
    getConfig,
    head: makeMethodFn("HEAD"),
    interceptors,
    options: makeMethodFn("OPTIONS"),
    patch: makeMethodFn("PATCH"),
    post: makeMethodFn("POST"),
    put: makeMethodFn("PUT"),
    request,
    setConfig,
    sse: {
      connect: makeSseFn("CONNECT"),
      delete: makeSseFn("DELETE"),
      get: makeSseFn("GET"),
      head: makeSseFn("HEAD"),
      options: makeSseFn("OPTIONS"),
      patch: makeSseFn("PATCH"),
      post: makeSseFn("POST"),
      put: makeSseFn("PUT"),
      trace: makeSseFn("TRACE")
    },
    trace: makeMethodFn("TRACE")
  };
}, "createClient");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/generated/client/index.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/redacted.js
init_esm();
var redactedRegistry = /* @__PURE__ */ new WeakMap();
var NodeInspectSymbol = Symbol.for("nodejs.util.inspect.custom");
var proto = {
  toString() {
    return "<redacted>";
  },
  toJSON() {
    return "<redacted>";
  },
  [NodeInspectSymbol]() {
    return "<redacted>";
  }
};
var make = /* @__PURE__ */ __name((value2) => {
  const redacted = Object.create(proto);
  redactedRegistry.set(redacted, value2);
  return redacted;
}, "make");
var value = /* @__PURE__ */ __name((self) => {
  if (redactedRegistry.has(self)) {
    return redactedRegistry.get(self);
  } else {
    throw new Error("Unable to get redacted value");
  }
}, "value");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/index.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/batch-transform.js
init_esm();
var BatchTransform = class extends TransformStream {
  static {
    __name(this, "BatchTransform");
  }
  currentBatch = [];
  currentBatchSize = 0;
  lingerTimer = null;
  controller = null;
  maxBatchRecords;
  maxBatchBytes;
  lingerDuration;
  fencing_token;
  next_match_seq_num;
  constructor(args) {
    let controller;
    super({
      start: /* @__PURE__ */ __name((c) => {
        controller = c;
      }, "start"),
      transform: /* @__PURE__ */ __name((chunk, c) => {
        if (!this.controller) {
          this.controller = c;
        }
        this.handleRecord(chunk);
      }, "transform"),
      flush: /* @__PURE__ */ __name(() => {
        this.flush();
      }, "flush")
    });
    this.maxBatchRecords = Math.min(args?.maxBatchRecords ?? 1e3, 1e3);
    this.maxBatchBytes = Math.min(args?.maxBatchBytes ?? 1024 * 1024, 1024 * 1024);
    this.lingerDuration = args?.lingerDurationMillis ?? 5;
    this.fencing_token = args?.fencing_token;
    this.next_match_seq_num = args?.match_seq_num;
  }
  handleRecord(record) {
    const recordSize = meteredSizeBytes(record);
    if (recordSize > this.maxBatchBytes) {
      throw new S2Error({
        message: `Record size ${recordSize} bytes exceeds maximum batch size of ${this.maxBatchBytes} bytes`
      });
    }
    if (this.currentBatch.length === 0 && this.lingerDuration > 0) {
      this.startLingerTimer();
    }
    const wouldExceedRecords = this.currentBatch.length + 1 > this.maxBatchRecords;
    const wouldExceedBytes = this.currentBatchSize + recordSize > this.maxBatchBytes;
    if (wouldExceedRecords || wouldExceedBytes) {
      this.flush();
      if (this.lingerDuration > 0) {
        this.startLingerTimer();
      }
    }
    this.currentBatch.push(record);
    this.currentBatchSize += recordSize;
    const nowExceedsRecords = this.currentBatch.length >= this.maxBatchRecords;
    const nowExceedsBytes = this.currentBatchSize >= this.maxBatchBytes;
    if (nowExceedsRecords || nowExceedsBytes) {
      this.flush();
    }
  }
  flush() {
    this.cancelLingerTimer();
    if (this.currentBatch.length === 0) {
      return;
    }
    const match_seq_num = this.next_match_seq_num;
    if (this.next_match_seq_num !== void 0) {
      this.next_match_seq_num += this.currentBatch.length;
    }
    if (this.controller) {
      const batch = {
        records: [...this.currentBatch]
      };
      if (this.fencing_token !== void 0) {
        batch.fencing_token = this.fencing_token;
      }
      if (match_seq_num !== void 0) {
        batch.match_seq_num = match_seq_num;
      }
      this.controller.enqueue(batch);
    }
    this.currentBatch = [];
    this.currentBatchSize = 0;
  }
  startLingerTimer() {
    this.cancelLingerTimer();
    this.lingerTimer = setTimeout(() => {
      this.lingerTimer = null;
      if (this.currentBatch.length > 0) {
        this.flush();
      }
    }, this.lingerDuration);
  }
  cancelLingerTimer() {
    if (this.lingerTimer) {
      clearTimeout(this.lingerTimer);
      this.lingerTimer = null;
    }
  }
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/s2.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/accessTokens.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/generated/sdk.gen.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/generated/client.gen.js
init_esm();
var client = createClient(createConfig({
  baseUrl: "https://aws.s2.dev/v1"
}));

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/generated/sdk.gen.js
var listAccessTokens = /* @__PURE__ */ __name((options) => {
  return (options?.client ?? client).get({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/access-tokens",
    ...options
  });
}, "listAccessTokens");
var issueAccessToken = /* @__PURE__ */ __name((options) => {
  return (options.client ?? client).post({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/access-tokens",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });
}, "issueAccessToken");
var revokeAccessToken = /* @__PURE__ */ __name((options) => {
  return (options.client ?? client).delete({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/access-tokens/{id}",
    ...options
  });
}, "revokeAccessToken");
var listBasins = /* @__PURE__ */ __name((options) => {
  return (options?.client ?? client).get({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/basins",
    ...options
  });
}, "listBasins");
var createBasin = /* @__PURE__ */ __name((options) => {
  return (options.client ?? client).post({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/basins",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });
}, "createBasin");
var deleteBasin = /* @__PURE__ */ __name((options) => {
  return (options.client ?? client).delete({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/basins/{basin}",
    ...options
  });
}, "deleteBasin");
var getBasinConfig = /* @__PURE__ */ __name((options) => {
  return (options.client ?? client).get({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/basins/{basin}",
    ...options
  });
}, "getBasinConfig");
var reconfigureBasin = /* @__PURE__ */ __name((options) => {
  return (options.client ?? client).patch({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/basins/{basin}",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });
}, "reconfigureBasin");
var accountMetrics = /* @__PURE__ */ __name((options) => {
  return (options.client ?? client).get({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/metrics",
    ...options
  });
}, "accountMetrics");
var basinMetrics = /* @__PURE__ */ __name((options) => {
  return (options.client ?? client).get({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/metrics/{basin}",
    ...options
  });
}, "basinMetrics");
var streamMetrics = /* @__PURE__ */ __name((options) => {
  return (options.client ?? client).get({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/metrics/{basin}/{stream}",
    ...options
  });
}, "streamMetrics");
var listStreams = /* @__PURE__ */ __name((options) => {
  return (options?.client ?? client).get({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/streams",
    ...options
  });
}, "listStreams");
var createStream = /* @__PURE__ */ __name((options) => {
  return (options.client ?? client).post({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/streams",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });
}, "createStream");
var deleteStream = /* @__PURE__ */ __name((options) => {
  return (options.client ?? client).delete({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/streams/{stream}",
    ...options
  });
}, "deleteStream");
var getStreamConfig = /* @__PURE__ */ __name((options) => {
  return (options.client ?? client).get({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/streams/{stream}",
    ...options
  });
}, "getStreamConfig");
var reconfigureStream = /* @__PURE__ */ __name((options) => {
  return (options.client ?? client).patch({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/streams/{stream}",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });
}, "reconfigureStream");
var read = /* @__PURE__ */ __name((options) => {
  return (options.client ?? client).get({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/streams/{stream}/records",
    ...options
  });
}, "read");
var append = /* @__PURE__ */ __name((options) => {
  return (options.client ?? client).post({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/streams/{stream}/records",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });
}, "append");
var checkTail = /* @__PURE__ */ __name((options) => {
  return (options.client ?? client).get({
    security: [
      {
        scheme: "bearer",
        type: "http"
      }
    ],
    url: "/streams/{stream}/records/tail",
    ...options
  });
}, "checkTail");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/accessTokens.js
var S2AccessTokens = class {
  static {
    __name(this, "S2AccessTokens");
  }
  client;
  constructor(client2) {
    this.client = client2;
  }
  /**
   * List access tokens.
   *
   * @param args.prefix Filter to IDs beginning with this prefix
   * @param args.start_after Filter to IDs lexicographically after this value
   * @param args.limit Max results (up to 1000)
   */
  async list(args, options) {
    const response = await listAccessTokens({
      client: this.client,
      query: args,
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
  /**
   * Issue a new access token.
   *
   * @param args.id Unique token ID (1-96 bytes)
   * @param args.scope Token scope (operations and resource sets)
   * @param args.auto_prefix_streams Namespace stream names by configured prefix scope
   * @param args.expires_at Expiration in ISO 8601; defaults to requestor's token expiry
   */
  async issue(args, options) {
    const response = await issueAccessToken({
      client: this.client,
      body: args,
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
  /**
   * Revoke an access token by ID.
   *
   * @param args.id Token ID to revoke
   */
  async revoke(args, options) {
    const response = await revokeAccessToken({
      client: this.client,
      path: args,
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/basin.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/stream.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/stream/factory.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/stream/runtime.js
init_esm();
function detectRuntime() {
  if (typeof Deno !== "undefined") {
    return "deno";
  }
  if (typeof Bun !== "undefined") {
    return "bun";
  }
  if (typeof process !== "undefined" && process.versions?.node !== void 0) {
    return "node";
  }
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return "browser";
  }
  return "unknown";
}
__name(detectRuntime, "detectRuntime");
function supportsHttp2() {
  const runtime = detectRuntime();
  switch (runtime) {
    case "node":
    case "deno":
    case "bun":
      return true;
    case "browser":
      return false;
    default:
      return false;
  }
}
__name(supportsHttp2, "supportsHttp2");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/stream/transport/fetch/index.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/base64.js
init_esm();
var encodeToBase64 = /* @__PURE__ */ __name((bytes) => {
  const length = bytes.length;
  let result = "";
  let i;
  for (i = 2; i < length; i += 3) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
    result += base64abc[(bytes[i - 1] & 15) << 2 | bytes[i] >> 6];
    result += base64abc[bytes[i] & 63];
  }
  if (i === length + 1) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 3) << 4];
    result += "==";
  }
  if (i === length) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
    result += base64abc[(bytes[i - 1] & 15) << 2];
    result += "=";
  }
  return result;
}, "encodeToBase64");
var decodeFromBase64 = /* @__PURE__ */ __name((str) => {
  const stripped = stripCrlf(str);
  const length = stripped.length;
  if (length % 4 !== 0) {
    throw new Error(`Length must be a multiple of 4, but is ${length}`);
  }
  const index = stripped.indexOf("=");
  if (index !== -1 && (index < length - 2 || index === length - 2 && stripped[length - 1] !== "=")) {
    throw new Error("Found a '=' character, but it is not at the end");
  }
  try {
    const missingOctets = stripped.endsWith("==") ? 2 : stripped.endsWith("=") ? 1 : 0;
    const result = new Uint8Array(3 * (length / 4) - missingOctets);
    for (let i = 0, j = 0; i < length; i += 4, j += 3) {
      const buffer = getBase64Code(stripped.charCodeAt(i)) << 18 | getBase64Code(stripped.charCodeAt(i + 1)) << 12 | getBase64Code(stripped.charCodeAt(i + 2)) << 6 | getBase64Code(stripped.charCodeAt(i + 3));
      result[j] = buffer >> 16;
      result[j + 1] = buffer >> 8 & 255;
      result[j + 2] = buffer & 255;
    }
    return result;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : "Invalid input");
  }
}, "decodeFromBase64");
var stripCrlf = /* @__PURE__ */ __name((str) => str.replace(/[\n\r]/g, ""), "stripCrlf");
function getBase64Code(charCode) {
  if (charCode >= base64codes.length) {
    throw new TypeError(`Invalid character ${String.fromCharCode(charCode)}`);
  }
  const code = base64codes[charCode];
  if (code === 255) {
    throw new TypeError(`Invalid character ${String.fromCharCode(charCode)}`);
  }
  return code;
}
__name(getBase64Code, "getBase64Code");
var base64abc = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "+",
  "/"
];
var base64codes = [
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  62,
  255,
  255,
  255,
  63,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  255,
  255,
  255,
  0,
  255,
  255,
  255,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  255,
  255,
  255,
  255,
  255,
  255,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51
];

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/event-stream.js
init_esm();
var EventStream = class extends ReadableStream {
  static {
    __name(this, "EventStream");
  }
  constructor(responseBody, parse) {
    const upstream = responseBody.getReader();
    let buffer = new Uint8Array();
    super({
      async pull(downstream) {
        try {
          while (true) {
            const match = findBoundary(buffer);
            if (!match) {
              const chunk = await upstream.read();
              if (chunk.done)
                return downstream.close();
              buffer = concatBuffer(buffer, chunk.value);
              continue;
            }
            const message = buffer.slice(0, match.index);
            buffer = buffer.slice(match.index + match.length);
            const item = parseMessage(message, parse);
            if (item) {
              if (item.batch) {
                for (const chunk of item.value) {
                  downstream.enqueue(chunk);
                }
              } else if (item.value) {
                downstream.enqueue(item.value);
              } else if (item.done) {
                await upstream.cancel("done");
                downstream.close();
              }
            }
          }
        } catch (e) {
          downstream.error(e);
          await upstream.cancel(e);
        }
      },
      cancel: /* @__PURE__ */ __name((reason) => upstream.cancel(reason), "cancel")
    });
  }
  async [Symbol.asyncDispose]() {
    await this.cancel("disposed");
  }
  // Polyfill for older browsers
  [Symbol.asyncIterator]() {
    const fn = ReadableStream.prototype[Symbol.asyncIterator];
    if (typeof fn === "function")
      return fn.call(this);
    const reader = this.getReader();
    return {
      next: /* @__PURE__ */ __name(async () => {
        const r = await reader.read();
        if (r.done) {
          reader.releaseLock();
          return { done: true, value: void 0 };
        }
        return { done: false, value: r.value };
      }, "next"),
      throw: /* @__PURE__ */ __name(async (e) => {
        await reader.cancel(e);
        reader.releaseLock();
        return { done: true, value: void 0 };
      }, "throw"),
      return: /* @__PURE__ */ __name(async () => {
        await reader.cancel("done");
        reader.releaseLock();
        return { done: true, value: void 0 };
      }, "return"),
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
};
function concatBuffer(a, b) {
  const c = new Uint8Array(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}
__name(concatBuffer, "concatBuffer");
function findBoundary(buf) {
  const len = buf.length;
  for (let i = 0; i < len; i++) {
    if (i <= len - 4 && buf[i] === 13 && buf[i + 1] === 10 && buf[i + 2] === 13 && buf[i + 3] === 10) {
      return { index: i, length: 4 };
    }
    if (i <= len - 2 && buf[i] === 13 && buf[i + 1] === 13) {
      return { index: i, length: 2 };
    }
    if (i <= len - 2 && buf[i] === 10 && buf[i + 1] === 10) {
      return { index: i, length: 2 };
    }
  }
  return null;
}
__name(findBoundary, "findBoundary");
function parseMessage(chunk, parse) {
  const text = new TextDecoder().decode(chunk);
  const lines = text.split(/\r\n|\r|\n/);
  const dataLines = [];
  const ret = {};
  let ignore = true;
  for (const line of lines) {
    if (!line || line.startsWith(":"))
      continue;
    ignore = false;
    const i = line.indexOf(":");
    const field = line.slice(0, i);
    const value2 = line[i + 1] === " " ? line.slice(i + 2) : line.slice(i + 1);
    if (field === "data")
      dataLines.push(value2);
    else if (field === "event")
      ret.event = value2;
    else if (field === "id")
      ret.id = value2;
    else if (field === "retry") {
      const n = Number(value2);
      if (!isNaN(n))
        ret.retry = n;
    }
  }
  if (ignore)
    return;
  if (dataLines.length)
    ret.data = dataLines.join("\n");
  return parse(ret);
}
__name(parseMessage, "parseMessage");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/stream/transport/fetch/shared.js
init_esm();
async function streamRead(stream, client2, args, options) {
  const { as, ...queryParams } = args ?? {};
  const response = await read({
    client: client2,
    path: {
      stream
    },
    headers: {
      ...as === "bytes" ? { "s2-format": "base64" } : {}
    },
    query: queryParams,
    ...options
  });
  if (response.error) {
    if ("message" in response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    } else {
      throw new RangeNotSatisfiableError({
        status: response.response.status
      });
    }
  }
  if (args?.as === "bytes") {
    const res = {
      ...response.data,
      records: response.data.records?.map((record) => ({
        ...record,
        body: record.body ? decodeFromBase64(record.body) : void 0,
        headers: record.headers?.map((header) => header.map((h) => decodeFromBase64(h)))
      }))
    };
    return res;
  } else {
    const res = {
      ...response.data,
      records: response.data.records.map((record) => ({
        ...record,
        headers: record.headers ? Object.fromEntries(record.headers) : void 0
      }))
    };
    return res;
  }
}
__name(streamRead, "streamRead");
async function streamAppend(stream, client2, records, args, options) {
  const recordsArray = Array.isArray(records) ? records : [records];
  if (recordsArray.length === 0) {
    throw new S2Error({ message: "Cannot append empty array of records" });
  }
  let batchMeteredSize = 0;
  for (const record of recordsArray) {
    batchMeteredSize += meteredSizeBytes(record);
  }
  if (batchMeteredSize > 1024 * 1024) {
    throw new S2Error({
      message: `Batch size ${batchMeteredSize} bytes exceeds maximum of 1 MiB (1048576 bytes)`
    });
  }
  if (recordsArray.length > 1e3) {
    throw new S2Error({
      message: `Batch of ${recordsArray.length} exceeds maximum batch size of 1000 records`
    });
  }
  let encodedRecords = [];
  let hasAnyBytesRecords = false;
  for (const record of recordsArray) {
    const format = computeAppendRecordFormat(record);
    if (format === "bytes") {
      const formattedRecord = record;
      const encodedRecord = {
        ...formattedRecord,
        body: formattedRecord.body ? encodeToBase64(formattedRecord.body) : void 0,
        headers: formattedRecord.headers?.map((header) => header.map((h) => encodeToBase64(h)))
      };
      encodedRecords.push(encodedRecord);
    } else {
      const normalizeHeaders = /* @__PURE__ */ __name((headers) => {
        if (headers === void 0) {
          return void 0;
        } else if (Array.isArray(headers)) {
          return headers;
        } else {
          return Object.entries(headers);
        }
      }, "normalizeHeaders");
      const formattedRecord = record;
      const encodedRecord = {
        ...formattedRecord,
        headers: formattedRecord.headers ? normalizeHeaders(formattedRecord.headers) : void 0
      };
      encodedRecords.push(encodedRecord);
    }
  }
  const response = await append({
    client: client2,
    path: {
      stream
    },
    body: {
      fencing_token: args?.fencing_token,
      match_seq_num: args?.match_seq_num,
      records: encodedRecords
    },
    headers: {
      ...hasAnyBytesRecords ? { "s2-format": "base64" } : {}
    },
    ...options
  });
  if (response.error) {
    if ("message" in response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    } else {
      if ("seq_num_mismatch" in response.error) {
        throw new SeqNumMismatchError({
          message: "Append condition failed: sequence number mismatch",
          code: "APPEND_CONDITION_FAILED",
          status: response.response.status,
          expectedSeqNum: response.error.seq_num_mismatch
        });
      } else if ("fencing_token_mismatch" in response.error) {
        throw new FencingTokenMismatchError({
          message: "Append condition failed: fencing token mismatch",
          code: "APPEND_CONDITION_FAILED",
          status: response.response.status,
          expectedFencingToken: response.error.fencing_token_mismatch
        });
      } else {
        throw new S2Error({
          message: "Append condition failed",
          status: response.response.status
        });
      }
    }
  }
  return response.data;
}
__name(streamAppend, "streamAppend");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/stream/transport/fetch/index.js
var FetchReadSession = class _FetchReadSession extends EventStream {
  static {
    __name(this, "FetchReadSession");
  }
  static async create(client2, name, args, options) {
    const { as, ...queryParams } = args ?? {};
    const response = await read({
      client: client2,
      path: {
        stream: name
      },
      headers: {
        accept: "text/event-stream",
        ...as === "bytes" ? { "s2-format": "base64" } : {}
      },
      query: queryParams,
      parseAs: "stream",
      ...options
    });
    if (response.error) {
      if ("message" in response.error) {
        throw new S2Error({
          message: response.error.message,
          code: response.error.code ?? void 0,
          status: response.response.status
        });
      } else {
        throw new RangeNotSatisfiableError({
          status: response.response.status
        });
      }
    }
    if (!response.response.body) {
      throw new S2Error({
        message: "No body in SSE response"
      });
    }
    const format = args?.as ?? "string";
    return new _FetchReadSession(response.response.body, format);
  }
  _lastReadPosition = void 0;
  constructor(stream, format) {
    super(stream, (msg) => {
      if (msg.event === "batch" && msg.data) {
        const rawBatch = JSON.parse(msg.data);
        const batch = (() => {
          if (format === "bytes") {
            return {
              ...rawBatch,
              records: rawBatch.records.map((record) => ({
                ...record,
                body: record.body ? decodeFromBase64(record.body) : void 0,
                headers: record.headers?.map((header) => header.map((h) => decodeFromBase64(h)))
              }))
            };
          } else {
            return {
              ...rawBatch,
              records: rawBatch.records.map((record) => ({
                ...record,
                headers: record.headers ? Object.fromEntries(record.headers) : void 0
              }))
            };
          }
        })();
        if (batch.tail) {
          this._lastReadPosition = batch.tail;
        }
        return { done: false, batch: true, value: batch.records ?? [] };
      }
      if (msg.event === "error") {
        throw new S2Error({ message: msg.data ?? "Unknown error" });
      }
      return { done: false };
    });
  }
  lastReadPosition() {
    return this._lastReadPosition;
  }
};
var AcksStream = class extends ReadableStream {
  static {
    __name(this, "AcksStream");
  }
  constructor(setController) {
    super({
      start: /* @__PURE__ */ __name((controller) => {
        setController(controller);
      }, "start")
    });
  }
  async [Symbol.asyncDispose]() {
    await this.cancel("disposed");
  }
  // Polyfill for older browsers
  [Symbol.asyncIterator]() {
    const fn = ReadableStream.prototype[Symbol.asyncIterator];
    if (typeof fn === "function")
      return fn.call(this);
    const reader = this.getReader();
    return {
      next: /* @__PURE__ */ __name(async () => {
        const r = await reader.read();
        if (r.done) {
          reader.releaseLock();
          return { done: true, value: void 0 };
        }
        return { done: false, value: r.value };
      }, "next"),
      throw: /* @__PURE__ */ __name(async (e) => {
        await reader.cancel(e);
        reader.releaseLock();
        return { done: true, value: void 0 };
      }, "throw"),
      return: /* @__PURE__ */ __name(async () => {
        await reader.cancel("done");
        reader.releaseLock();
        return { done: true, value: void 0 };
      }, "return"),
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
};
var FetchAppendSession = class _FetchAppendSession {
  static {
    __name(this, "FetchAppendSession");
  }
  _lastAckedPosition = void 0;
  queue = [];
  pendingResolvers = [];
  inFlight = false;
  options;
  stream;
  acksController;
  _readable;
  _writable;
  closed = false;
  processingPromise = null;
  queuedBytes = 0;
  maxQueuedBytes;
  waitingForCapacity = [];
  client;
  readable;
  writable;
  static async create(stream, transportConfig, sessionOptions, requestOptions) {
    return new _FetchAppendSession(stream, transportConfig, sessionOptions, requestOptions);
  }
  constructor(stream, transportConfig, sessionOptions, requestOptions) {
    this.options = requestOptions;
    this.stream = stream;
    this.maxQueuedBytes = sessionOptions?.maxQueuedBytes ?? 10 * 1024 * 1024;
    this.client = createClient(createConfig({
      baseUrl: transportConfig.baseUrl,
      auth: /* @__PURE__ */ __name(() => value(transportConfig.accessToken), "auth")
    }));
    this._readable = new AcksStream((controller) => {
      this.acksController = controller;
    });
    this.readable = this._readable;
    let writableController;
    this._writable = new WritableStream({
      start: /* @__PURE__ */ __name((controller) => {
        writableController = controller;
      }, "start"),
      write: /* @__PURE__ */ __name(async (chunk) => {
        let batchMeteredSize = 0;
        for (const record of chunk.records) {
          batchMeteredSize += meteredSizeBytes(record);
        }
        while (this.queuedBytes + batchMeteredSize > this.maxQueuedBytes && !this.closed) {
          await new Promise((resolve) => {
            this.waitingForCapacity.push(resolve);
          });
        }
        this.submit(chunk.records, {
          fencing_token: chunk.fencing_token ?? void 0,
          match_seq_num: chunk.match_seq_num ?? void 0
        }, batchMeteredSize);
      }, "write"),
      close: /* @__PURE__ */ __name(async () => {
        this.closed = true;
        await this.waitForDrain();
      }, "close"),
      abort: /* @__PURE__ */ __name(async (reason) => {
        this.closed = true;
        this.queue = [];
        this.queuedBytes = 0;
        const error = new S2Error({
          message: `AppendSession was aborted: ${reason}`
        });
        for (const resolver of this.pendingResolvers) {
          resolver.reject(error);
        }
        this.pendingResolvers = [];
        for (const resolver of this.waitingForCapacity) {
          resolver();
        }
        this.waitingForCapacity = [];
      }, "abort")
    });
    this.writable = this._writable;
  }
  async [Symbol.asyncDispose]() {
    await this.close();
  }
  /**
   * Get a stream of acknowledgements for appends.
   */
  acks() {
    return this._readable;
  }
  /**
   * Close the append session.
   * Waits for all pending appends to complete before resolving.
   */
  async close() {
    await this.writable.close();
  }
  /**
   * Submit an append request to the session.
   * The request will be queued and sent when no other request is in-flight.
   * Returns a promise that resolves when the append is acknowledged or rejects on error.
   */
  submit(records, args, precalculatedSize) {
    if (this.closed) {
      return Promise.reject(new S2Error({ message: "AppendSession is closed" }));
    }
    const recordsArray = Array.isArray(records) ? records : [records];
    if (recordsArray.length > 1e3) {
      return Promise.reject(new S2Error({
        message: `Batch of ${recordsArray.length} exceeds maximum batch size of 1000 records`
      }));
    }
    let batchMeteredSize = precalculatedSize ?? 0;
    if (batchMeteredSize === 0) {
      for (const record of recordsArray) {
        batchMeteredSize += meteredSizeBytes(record);
      }
    }
    if (batchMeteredSize > 1024 * 1024) {
      return Promise.reject(new S2Error({
        message: `Batch size ${batchMeteredSize} bytes exceeds maximum of 1 MiB (1048576 bytes)`
      }));
    }
    return new Promise((resolve, reject) => {
      this.queue.push({
        records: recordsArray,
        fencing_token: args?.fencing_token,
        match_seq_num: args?.match_seq_num,
        meteredSize: batchMeteredSize
      });
      this.queuedBytes += batchMeteredSize;
      this.pendingResolvers.push({ resolve, reject });
      if (!this.processingPromise) {
        this.processingPromise = this.processLoop();
      }
    });
  }
  /**
   * Main processing loop that sends queued requests one at a time.
   */
  async processLoop() {
    while (this.queue.length > 0) {
      this.inFlight = true;
      const args = this.queue.shift();
      const resolver = this.pendingResolvers.shift();
      try {
        const ack = await streamAppend(this.stream, this.client, args.records, {
          fencing_token: args.fencing_token,
          match_seq_num: args.match_seq_num
        }, this.options);
        this._lastAckedPosition = ack;
        if (this.acksController) {
          this.acksController.enqueue(ack);
        }
        resolver.resolve(ack);
        this.queuedBytes -= args.meteredSize;
        while (this.waitingForCapacity.length > 0) {
          const waiter = this.waitingForCapacity.shift();
          waiter();
          break;
        }
      } catch (error) {
        this.inFlight = false;
        this.processingPromise = null;
        resolver.reject(error);
        for (const pendingResolver of this.pendingResolvers) {
          pendingResolver.reject(error);
        }
        this.pendingResolvers = [];
        this.queue = [];
        this.queuedBytes = 0;
        for (const waiter of this.waitingForCapacity) {
          waiter();
        }
        this.waitingForCapacity = [];
      }
      this.inFlight = false;
    }
    this.processingPromise = null;
  }
  async waitForDrain() {
    if (this.processingPromise) {
      await this.processingPromise;
    }
    while (this.queue.length > 0 || this.inFlight) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    if (this.acksController) {
      this.acksController.close();
    }
  }
  lastAckedPosition() {
    return this._lastAckedPosition;
  }
};
var FetchTransport = class {
  static {
    __name(this, "FetchTransport");
  }
  client;
  transportConfig;
  constructor(config) {
    this.client = createClient(createConfig({
      baseUrl: config.baseUrl,
      auth: /* @__PURE__ */ __name(() => value(config.accessToken), "auth")
    }));
    this.transportConfig = config;
  }
  async makeAppendSession(stream, sessionOptions, requestOptions) {
    return FetchAppendSession.create(stream, this.transportConfig, sessionOptions, requestOptions);
  }
  async makeReadSession(stream, args, options) {
    return FetchReadSession.create(this.client, stream, args, options);
  }
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/stream/factory.js
async function createSessionTransport(config) {
  if (config?.forceTransport === "fetch") {
    return new FetchTransport(config);
  } else if (config?.forceTransport === "s2s") {
    const { S2STransport } = await import("./s2s-JFEOHMO4.mjs");
    return new S2STransport(config);
  }
  if (supportsHttp2()) {
    const { S2STransport } = await import("./s2s-JFEOHMO4.mjs");
    return new S2STransport(config);
  }
  return new FetchTransport(config);
}
__name(createSessionTransport, "createSessionTransport");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/stream.js
var S2Stream = class {
  static {
    __name(this, "S2Stream");
  }
  client;
  transportConfig;
  _transport;
  name;
  constructor(name, client2, transportConfig) {
    this.name = name;
    this.client = client2;
    this.transportConfig = transportConfig;
  }
  /**
   * Get or create the transport instance
   */
  async getTransport() {
    if (!this._transport) {
      this._transport = await createSessionTransport(this.transportConfig);
    }
    return this._transport;
  }
  /**
   * Check the tail of the stream.
   *
   * Returns the next sequence number and timestamp to be assigned (`tail`).
   */
  async checkTail(options) {
    const response = await checkTail({
      client: this.client,
      path: {
        stream: this.name
      },
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
  /**
   * Read records from the stream.
   *
   * - When `as: "bytes"` is provided, bodies and headers are decoded from base64 to `Uint8Array`.
   * - Supports starting position by `seq_num`, `timestamp`, or `tail_offset` and can clamp to the tail.
   * - Non-streaming reads are bounded by `count` and `bytes` (defaults 1000 and 1 MiB).
   * - Use `readSession` for streaming reads
   */
  async read(args, options) {
    return await streamRead(this.name, this.client, args, options);
  }
  /**
   * Append one or more records to the stream.
   *
   * - Automatically base64-encodes when format is "bytes".
   * - Supports conditional appends via `fencing_token` and `match_seq_num`.
   * - Returns the acknowledged range and the stream tail after the append.
   *
   * All records in a single append call must use the same format (either all string or all bytes).
   * For high-throughput sequential appends, use `appendSession()` instead.
   *
   * @param records The record(s) to append
   * @param args Optional append arguments (fencing_token, match_seq_num)
   * @param options Optional request options
   */
  async append(records, args, options) {
    return await streamAppend(this.name, this.client, records, args, options);
  }
  /**
   * Open a streaming read session
   *
   * Use the returned session as an async iterable or as a readable stream.
   * When `as: "bytes"` is provided, bodies and headers are decoded to `Uint8Array`.
   */
  async readSession(args, options) {
    const transport = await this.getTransport();
    return await transport.makeReadSession(this.name, args, options);
  }
  /**
   * Create an append session that guarantees ordering of submissions.
   *
   * Use this to coordinate high-throughput, sequential appends with backpressure.
   * Records can be either string or bytes format - the format is specified in each record.
   *
   * @param options Optional request options
   */
  async appendSession(sessionOptions, requestOptions) {
    const transport = await this.getTransport();
    return await transport.makeAppendSession(this.name, sessionOptions, requestOptions);
  }
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/streams.js
init_esm();
var S2Streams = class {
  static {
    __name(this, "S2Streams");
  }
  client;
  constructor(client2) {
    this.client = client2;
  }
  /**
   * List streams in the basin.
   *
   * @param args.prefix Return streams whose names start with the given prefix
   * @param args.start_after Name to start after (for pagination)
   * @param args.limit Max results (up to 1000)
   */
  async list(args, options) {
    const response = await listStreams({
      client: this.client,
      query: args,
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
  /**
   * Create a stream.
   *
   * @param args.stream Stream name (1-512 bytes, unique within the basin)
   * @param args.config Stream configuration (retention, storage class, timestamping, delete-on-empty)
   */
  async create(args, options) {
    const response = await createStream({
      client: this.client,
      body: args,
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
  /**
   * Get stream configuration.
   *
   * @param args.stream Stream name
   */
  async getConfig(args, options) {
    const response = await getStreamConfig({
      client: this.client,
      path: args,
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
  /**
   * Delete a stream.
   *
   * @param args.stream Stream name
   */
  async delete(args, options) {
    const response = await deleteStream({
      client: this.client,
      path: args,
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
  /**
   * Reconfigure a stream.
   *
   * @param args.stream Stream name
   * @param args.body Configuration fields to change
   */
  async reconfigure(args, options) {
    const response = await reconfigureStream({
      client: this.client,
      path: args,
      body: args,
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/basin.js
var S2Basin = class {
  static {
    __name(this, "S2Basin");
  }
  client;
  transportConfig;
  name;
  streams;
  /**
   * Create a basin-scoped client that talks to `https://{basin}.b.aws.s2.dev/v1`.
   *
   * Use this to work with streams inside a single basin.
   * @param name Basin name
   * @param accessToken Redacted access token from the parent `S2` client
   * @param baseUrl Base URL for the basin (e.g. `https://my-basin.b.aws.s2.dev/v1`)
   * @param includeBasinHeader Include the `S2-Basin` header with the request
   */
  constructor(name, options) {
    this.name = name;
    this.transportConfig = {
      baseUrl: options.baseUrl,
      accessToken: options.accessToken
    };
    this.client = createClient(createConfig({
      baseUrl: options.baseUrl,
      auth: /* @__PURE__ */ __name(() => value(this.transportConfig.accessToken), "auth"),
      headers: options.includeBasinHeader ? { "s2-basin": name } : {}
    }));
    this.streams = new S2Streams(this.client);
  }
  /**
   * Create a stream-scoped helper bound to `this` basin.
   * @param name Stream name
   */
  stream(name, options) {
    return new S2Stream(name, this.client, {
      ...this.transportConfig,
      forceTransport: options?.forceTransport
    });
  }
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/basins.js
init_esm();
var S2Basins = class {
  static {
    __name(this, "S2Basins");
  }
  client;
  constructor(client2) {
    this.client = client2;
  }
  /**
   * List basins.
   *
   * @param args.prefix Return basins whose names start with the given prefix
   * @param args.start_after Name to start after (for pagination)
   * @param args.limit Max results (up to 1000)
   */
  async list(args, options) {
    const response = await listBasins({
      client: this.client,
      query: args,
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
  /**
   * Create a basin.
   *
   * @param args.basin Globally unique basin name (8-48 chars, lowercase letters, numbers, hyphens; cannot begin or end with a hyphen)
   * @param args.config Optional basin configuration (e.g. default stream config)
   * @param args.scope Basin scope
   */
  async create(args, options) {
    const response = await createBasin({
      client: this.client,
      body: args,
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
  /**
   * Get basin configuration.
   *
   * @param args.basin Basin name
   */
  async getConfig(args, options) {
    const response = await getBasinConfig({
      client: this.client,
      path: args,
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
  /**
   * Delete a basin.
   *
   * @param args.basin Basin name
   */
  async delete(args, options) {
    const response = await deleteBasin({
      client: this.client,
      path: args,
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
  /**
   * Reconfigure a basin.
   *
   * @param args.basin Basin name
   * @param args.body Configuration fields to change (e.g. default stream config)
   */
  async reconfigure(args, options) {
    const response = await reconfigureBasin({
      client: this.client,
      path: args,
      body: args,
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/metrics.js
init_esm();
var S2Metrics = class {
  static {
    __name(this, "S2Metrics");
  }
  client;
  constructor(client2) {
    this.client = client2;
  }
  /**
   * Account-level metrics.
   *
   * @param args.set Metric set to return
   * @param args.start Optional start timestamp (Unix seconds)
   * @param args.end Optional end timestamp (Unix seconds)
   * @param args.interval Optional aggregation interval for timeseries sets
   */
  async account(args, options) {
    const response = await accountMetrics({
      client: this.client,
      query: args,
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
  /**
   * Basin-level metrics.
   *
   * @param args.basin Basin name
   * @param args.set Metric set to return
   * @param args.start Optional start timestamp (Unix seconds)
   * @param args.end Optional end timestamp (Unix seconds)
   * @param args.interval Optional aggregation interval for timeseries sets
   */
  async basin(args, options) {
    const response = await basinMetrics({
      client: this.client,
      path: args,
      query: args,
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
  /**
   * Stream-level metrics.
   *
   * @param args.basin Basin name
   * @param args.stream Stream name
   * @param args.set Metric set to return
   * @param args.start Optional start timestamp (Unix seconds)
   * @param args.end Optional end timestamp (Unix seconds)
   * @param args.interval Optional aggregation interval for timeseries sets
   */
  async stream(args, options) {
    const response = await streamMetrics({
      client: this.client,
      path: args,
      query: args,
      ...options
    });
    if (response.error) {
      throw new S2Error({
        message: response.error.message,
        code: response.error.code ?? void 0,
        status: response.response.status
      });
    }
    return response.data;
  }
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/s2.js
var defaultBaseUrl = "https://aws.s2.dev/v1";
var defaultMakeBasinBaseUrl = /* @__PURE__ */ __name((basin) => `https://${basin}.b.aws.s2.dev/v1`, "defaultMakeBasinBaseUrl");
var S2 = class {
  static {
    __name(this, "S2");
  }
  accessToken;
  client;
  makeBasinBaseUrl;
  includeBasinHeader;
  /**
   * Account-scoped basin management operations.
   *
   * - List, create, delete and reconfigure basins.
   */
  basins;
  /** Manage access tokens for the account (list, issue, revoke). */
  accessTokens;
  /** Account, basin and stream level metrics. */
  metrics;
  /**
   * Create a new S2 client.
   *
   * @param options Access token configuration.
   */
  constructor(options) {
    this.accessToken = make(options.accessToken);
    this.client = createClient(createConfig({
      baseUrl: options.baseUrl ?? defaultBaseUrl,
      auth: /* @__PURE__ */ __name(() => value(this.accessToken), "auth")
    }));
    this.basins = new S2Basins(this.client);
    this.accessTokens = new S2AccessTokens(this.client);
    this.metrics = new S2Metrics(this.client);
    this.makeBasinBaseUrl = options.makeBasinBaseUrl ?? defaultMakeBasinBaseUrl;
    this.includeBasinHeader = !!options.makeBasinBaseUrl;
  }
  /**
   * Create a basin-scoped client bound to a specific basin name.
   *
   * @param name Basin name.
   */
  basin(name) {
    return new S2Basin(name, {
      accessToken: this.accessToken,
      baseUrl: this.makeBasinBaseUrl(name),
      includeBasinHeader: this.includeBasinHeader
    });
  }
};

export {
  S2Error,
  AppendRecord,
  meteredSizeBytes,
  BatchTransform,
  createConfig,
  createClient,
  value,
  S2
};
//# sourceMappingURL=chunk-4DSI7GE4.mjs.map
