'use strict';

const ufo = require('ufo');
const cookieEs = require('cookie-es');
const radix3 = require('radix3');
const destr = require('destr');
const defu = require('defu');
const crypto = require('uncrypto');
const ironWebcrypto = require('iron-webcrypto');
const nodeMockHttp = require('node-mock-http');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const destr__default = /*#__PURE__*/_interopDefaultCompat(destr);
const crypto__default = /*#__PURE__*/_interopDefaultCompat(crypto);

function useBase(base, handler) {
  base = ufo.withoutTrailingSlash(base);
  if (!base || base === "/") {
    return handler;
  }
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _path = event._path || event.node.req.url || "/";
    event._path = ufo.withoutBase(event.path || "/", base);
    event.node.req.url = event._path;
    try {
      return await handler(event);
    } finally {
      event._path = event.node.req.url = _path;
    }
  });
}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function parse(multipartBodyBuffer, boundary) {
  let lastline = "";
  let state = 0 /* INIT */;
  let buffer = [];
  const allParts = [];
  let currentPartHeaders = [];
  for (let i = 0; i < multipartBodyBuffer.length; i++) {
    const prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null;
    const currByte = multipartBodyBuffer[i];
    const newLineChar = currByte === 10 || currByte === 13;
    if (!newLineChar) {
      lastline += String.fromCodePoint(currByte);
    }
    const newLineDetected = currByte === 10 && prevByte === 13;
    if (0 /* INIT */ === state && newLineDetected) {
      if ("--" + boundary === lastline) {
        state = 1 /* READING_HEADERS */;
      }
      lastline = "";
    } else if (1 /* READING_HEADERS */ === state && newLineDetected) {
      if (lastline.length > 0) {
        const i2 = lastline.indexOf(":");
        if (i2 > 0) {
          const name = lastline.slice(0, i2).toLowerCase();
          const value = lastline.slice(i2 + 1).trim();
          currentPartHeaders.push([name, value]);
        }
      } else {
        state = 2 /* READING_DATA */;
        buffer = [];
      }
      lastline = "";
    } else if (2 /* READING_DATA */ === state) {
      if (lastline.length > boundary.length + 4) {
        lastline = "";
      }
      if ("--" + boundary === lastline) {
        const j = buffer.length - lastline.length;
        const part = buffer.slice(0, j - 1);
        allParts.push(process(part, currentPartHeaders));
        buffer = [];
        currentPartHeaders = [];
        lastline = "";
        state = 3 /* READING_PART_SEPARATOR */;
      } else {
        buffer.push(currByte);
      }
      if (newLineDetected) {
        lastline = "";
      }
    } else if (3 /* READING_PART_SEPARATOR */ === state && newLineDetected) {
      state = 1 /* READING_HEADERS */;
    }
  }
  return allParts;
}
function process(data, headers) {
  const dataObj = {};
  const contentDispositionHeader = headers.find((h) => h[0] === "content-disposition")?.[1] || "";
  for (const i of contentDispositionHeader.split(";")) {
    const s = i.split("=");
    if (s.length !== 2) {
      continue;
    }
    const key = (s[0] || "").trim();
    if (key === "name" || key === "filename") {
      const _value = (s[1] || "").trim().replace(/"/g, "");
      dataObj[key] = Buffer.from(_value, "latin1").toString("utf8");
    }
  }
  const contentType = headers.find((h) => h[0] === "content-type")?.[1] || "";
  if (contentType) {
    dataObj.type = contentType;
  }
  dataObj.data = Buffer.from(data);
  return dataObj;
}

async function validateData(data, fn) {
  try {
    const res = await fn(data);
    if (res === false) {
      throw createValidationError();
    }
    if (res === true) {
      return data;
    }
    return res ?? data;
  } catch (error) {
    throw createValidationError(error);
  }
}
function createValidationError(validateError) {
  throw createError({
    status: 400,
    statusMessage: "Validation Error",
    message: validateError?.message || "Validation Error",
    data: validateError
  });
}

function getQuery(event) {
  return ufo.getQuery(event.path || "");
}
function getValidatedQuery(event, validate) {
  const query = getQuery(event);
  return validateData(query, validate);
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = ufo.decode(params[key]);
    }
  }
  return params;
}
function getValidatedRouterParams(event, validate, opts = {}) {
  const routerParams = getRouterParams(event, opts);
  return validateData(routerParams, validate);
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function getMethod(event, defaultMethod = "GET") {
  return (event.node.req.method || defaultMethod).toUpperCase();
}
function isMethod(event, expected, allowHead) {
  if (allowHead && event.method === "HEAD") {
    return true;
  }
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected, allowHead)) {
    throw createError({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
const getHeaders = getRequestHeaders;
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
const getHeader = getRequestHeader;
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = event.node.req.headers["x-forwarded-host"];
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
const DOUBLE_SLASH_RE = /[/\\]{2,}/g;
function getRequestPath(event) {
  const path = (event.node.req.url || "/").replace(DOUBLE_SLASH_RE, "/");
  return path;
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}
function toWebRequest(event) {
  return event.web?.request || new Request(getRequestURL(event), {
    // @ts-ignore Undici option
    duplex: "half",
    method: event.method,
    headers: event.headers,
    body: getRequestWebStream(event)
  });
}
function getRequestIP(event, opts = {}) {
  if (event.context.clientAddress) {
    return event.context.clientAddress;
  }
  if (opts.xForwardedFor) {
    const xForwardedFor = getRequestHeader(event, "x-forwarded-for")?.split(",").shift()?.trim();
    if (xForwardedFor) {
      return xForwardedFor;
    }
  }
  if (event.node.req.socket.remoteAddress) {
    return event.node.req.socket.remoteAddress;
  }
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
async function readValidatedBody(event, validate) {
  const _body = await readBody(event, { strict: true });
  return validateData(_body, validate);
}
async function readMultipartFormData(event) {
  const contentType = getRequestHeader(event, "content-type");
  if (!contentType || !contentType.startsWith("multipart/form-data")) {
    return;
  }
  const boundary = contentType.match(/boundary=([^;]*)(;|$)/i)?.[1];
  if (!boundary) {
    return;
  }
  const body = await readRawBody(event, false);
  if (!body) {
    return;
  }
  return parse(body, boundary);
}
async function readFormData(event) {
  return await toWebRequest(event).formData();
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return void 0;
  }
  try {
    return destr__default(body, { strict });
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return cookieEs.parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = cookieEs.serialize(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = cookieEs.parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

function serializeIterableValue(value) {
  switch (typeof value) {
    case "string": {
      return value;
    }
    case "boolean":
    case "number":
    case "bigint":
    case "symbol": {
      return value.toString();
    }
    case "function":
    case "undefined": {
      return void 0;
    }
    case "object": {
      if (value instanceof Uint8Array) {
        return value;
      }
      return JSON.stringify(value);
    }
  }
}
function coerceIterable(iterable) {
  if (typeof iterable === "function") {
    iterable = iterable();
  }
  if (Symbol.iterator in iterable) {
    return iterable[Symbol.iterator]();
  }
  if (Symbol.asyncIterator in iterable) {
    return iterable[Symbol.asyncIterator]();
  }
  return iterable;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeaders(event) {
  return event.node.res.getHeaders();
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    appendResponseHeader(event, name, value);
  }
}
const appendHeaders = appendResponseHeaders;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
const appendHeader = appendResponseHeader;
function clearResponseHeaders(event, headerNames) {
  if (headerNames && headerNames.length > 0) {
    for (const name of headerNames) {
      removeResponseHeader(event, name);
    }
  } else {
    for (const [name] of Object.entries(getResponseHeaders(event))) {
      removeResponseHeader(event, name);
    }
  }
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
const noop = () => {
};
function writeEarlyHints(event, hints, cb = noop) {
  if (!event.node.res.socket) {
    cb();
    return;
  }
  if (typeof hints === "string" || Array.isArray(hints)) {
    hints = { link: hints };
  }
  if (hints.link) {
    hints.link = Array.isArray(hints.link) ? hints.link : hints.link.split(",");
  }
  const headers = Object.entries(hints).map(
    (e) => [e[0].toLowerCase(), e[1]]
  );
  if (headers.length === 0) {
    cb();
    return;
  }
  let hint = "HTTP/1.1 103 Early Hints";
  if (hints.link) {
    hint += `\r
Link: ${hints.link.join(", ")}`;
  }
  for (const [header, value] of headers) {
    if (header === "link") {
      continue;
    }
    hint += `\r
${header}: ${value}`;
  }
  if (event.node.res.socket) {
    event.node.res.socket.write(
      `${hint}\r
\r
`,
      "utf8",
      cb
    );
  } else {
    cb();
  }
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}
function sendIterable(event, iterable, options) {
  const serializer = options?.serializer ?? serializeIterableValue;
  const iterator = coerceIterable(iterable);
  return sendStream(
    event,
    new ReadableStream({
      async pull(controller) {
        const { value, done } = await iterator.next();
        if (value !== void 0) {
          const chunk = serializer(value);
          if (chunk !== void 0) {
            controller.enqueue(chunk);
          }
        }
        if (done) {
          controller.close();
        }
      },
      cancel() {
        iterator.return?.();
      }
    })
  );
}

function resolveCorsOptions(options = {}) {
  const defaultOptions = {
    origin: "*",
    methods: "*",
    allowHeaders: "*",
    exposeHeaders: "*",
    credentials: false,
    maxAge: false,
    preflight: {
      statusCode: 204
    }
  };
  return defu.defu(options, defaultOptions);
}
function isPreflightRequest(event) {
  const origin = getRequestHeader(event, "origin");
  const accessControlRequestMethod = getRequestHeader(
    event,
    "access-control-request-method"
  );
  return event.method === "OPTIONS" && !!origin && !!accessControlRequestMethod;
}
function isCorsOriginAllowed(origin, options) {
  const { origin: originOption } = options;
  if (!origin || !originOption || originOption === "*" || originOption === "null") {
    return true;
  }
  if (Array.isArray(originOption)) {
    return originOption.some((_origin) => {
      if (_origin instanceof RegExp) {
        return _origin.test(origin);
      }
      return origin === _origin;
    });
  }
  return originOption(origin);
}
function createOriginHeaders(event, options) {
  const { origin: originOption } = options;
  const origin = getRequestHeader(event, "origin");
  if (!origin || !originOption || originOption === "*") {
    return { "access-control-allow-origin": "*" };
  }
  if (typeof originOption === "string") {
    return { "access-control-allow-origin": originOption, vary: "origin" };
  }
  return isCorsOriginAllowed(origin, options) ? { "access-control-allow-origin": origin, vary: "origin" } : {};
}
function createMethodsHeaders(options) {
  const { methods } = options;
  if (!methods) {
    return {};
  }
  if (methods === "*") {
    return { "access-control-allow-methods": "*" };
  }
  return methods.length > 0 ? { "access-control-allow-methods": methods.join(",") } : {};
}
function createCredentialsHeaders(options) {
  const { credentials } = options;
  if (credentials) {
    return { "access-control-allow-credentials": "true" };
  }
  return {};
}
function createAllowHeaderHeaders(event, options) {
  const { allowHeaders } = options;
  if (!allowHeaders || allowHeaders === "*" || allowHeaders.length === 0) {
    const header = getRequestHeader(event, "access-control-request-headers");
    return header ? {
      "access-control-allow-headers": header,
      vary: "access-control-request-headers"
    } : {};
  }
  return {
    "access-control-allow-headers": allowHeaders.join(","),
    vary: "access-control-request-headers"
  };
}
function createExposeHeaders(options) {
  const { exposeHeaders } = options;
  if (!exposeHeaders) {
    return {};
  }
  if (exposeHeaders === "*") {
    return { "access-control-expose-headers": exposeHeaders };
  }
  return { "access-control-expose-headers": exposeHeaders.join(",") };
}
function appendCorsPreflightHeaders(event, options) {
  appendHeaders(event, createOriginHeaders(event, options));
  appendHeaders(event, createCredentialsHeaders(options));
  appendHeaders(event, createExposeHeaders(options));
  appendHeaders(event, createMethodsHeaders(options));
  appendHeaders(event, createAllowHeaderHeaders(event, options));
}
function appendCorsHeaders(event, options) {
  appendHeaders(event, createOriginHeaders(event, options));
  appendHeaders(event, createCredentialsHeaders(options));
  appendHeaders(event, createExposeHeaders(options));
}

function handleCors(event, options) {
  const _options = resolveCorsOptions(options);
  if (isPreflightRequest(event)) {
    appendCorsPreflightHeaders(event, options);
    sendNoContent(event, _options.preflight.statusCode);
    return true;
  }
  appendCorsHeaders(event, options);
  return false;
}

async function getRequestFingerprint(event, opts = {}) {
  const fingerprint = [];
  if (opts.ip !== false) {
    fingerprint.push(
      getRequestIP(event, { xForwardedFor: opts.xForwardedFor })
    );
  }
  if (opts.method === true) {
    fingerprint.push(event.method);
  }
  if (opts.path === true) {
    fingerprint.push(event.path);
  }
  if (opts.userAgent === true) {
    fingerprint.push(getRequestHeader(event, "user-agent"));
  }
  const fingerprintString = fingerprint.filter(Boolean).join("|");
  if (!fingerprintString) {
    return null;
  }
  if (opts.hash === false) {
    return fingerprintString;
  }
  const buffer = await crypto__default.subtle.digest(
    opts.hash || "SHA-1",
    new TextEncoder().encode(fingerprintString)
  );
  const hash = [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return hash;
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

const getSessionPromise = Symbol("getSession");
const DEFAULT_NAME = "h3";
const DEFAULT_COOKIE = {
  path: "/",
  secure: true,
  httpOnly: true
};
async function useSession(event, config) {
  const sessionName = config.name || DEFAULT_NAME;
  await getSession(event, config);
  const sessionManager = {
    get id() {
      return event.context.sessions?.[sessionName]?.id;
    },
    get data() {
      return event.context.sessions?.[sessionName]?.data || {};
    },
    update: async (update) => {
      if (!isEvent(event)) {
        throw new Error("[h3] Cannot update read-only session.");
      }
      await updateSession(event, config, update);
      return sessionManager;
    },
    clear: () => {
      if (!isEvent(event)) {
        throw new Error("[h3] Cannot clear read-only session.");
      }
      clearSession(event, config);
      return Promise.resolve(sessionManager);
    }
  };
  return sessionManager;
}
async function getSession(event, config) {
  const sessionName = config.name || DEFAULT_NAME;
  if (!event.context.sessions) {
    event.context.sessions = /* @__PURE__ */ Object.create(null);
  }
  const existingSession = event.context.sessions[sessionName];
  if (existingSession) {
    return existingSession[getSessionPromise] || existingSession;
  }
  const session = {
    id: "",
    createdAt: 0,
    data: /* @__PURE__ */ Object.create(null)
  };
  event.context.sessions[sessionName] = session;
  let sealedSession;
  if (config.sessionHeader !== false) {
    const headerName = typeof config.sessionHeader === "string" ? config.sessionHeader.toLowerCase() : `x-${sessionName.toLowerCase()}-session`;
    const headerValue = _getReqHeader(event, headerName);
    if (typeof headerValue === "string") {
      sealedSession = headerValue;
    }
  }
  if (!sealedSession) {
    const cookieHeader = _getReqHeader(event, "cookie");
    if (cookieHeader) {
      sealedSession = cookieEs.parse(cookieHeader + "")[sessionName];
    }
  }
  if (sealedSession) {
    const promise = unsealSession(event, config, sealedSession).catch(() => {
    }).then((unsealed) => {
      Object.assign(session, unsealed);
      delete event.context.sessions[sessionName][getSessionPromise];
      return session;
    });
    event.context.sessions[sessionName][getSessionPromise] = promise;
    await promise;
  }
  if (!session.id) {
    if (!isEvent(event)) {
      throw new Error(
        "Cannot initialize a new session. Make sure using `useSession(event)` in main handler."
      );
    }
    session.id = config.generateId?.() ?? (config.crypto || crypto__default).randomUUID();
    session.createdAt = Date.now();
    await updateSession(event, config);
  }
  return session;
}
function _getReqHeader(event, name) {
  if (event.node) {
    return event.node?.req.headers[name];
  }
  if (event.request) {
    return event.request.headers?.get(name);
  }
  if (event.headers) {
    return event.headers.get(name);
  }
}
async function updateSession(event, config, update) {
  const sessionName = config.name || DEFAULT_NAME;
  const session = event.context.sessions?.[sessionName] || await getSession(event, config);
  if (typeof update === "function") {
    update = update(session.data);
  }
  if (update) {
    Object.assign(session.data, update);
  }
  if (config.cookie !== false) {
    const sealed = await sealSession(event, config);
    setCookie(event, sessionName, sealed, {
      ...DEFAULT_COOKIE,
      expires: config.maxAge ? new Date(session.createdAt + config.maxAge * 1e3) : void 0,
      ...config.cookie
    });
  }
  return session;
}
async function sealSession(event, config) {
  const sessionName = config.name || DEFAULT_NAME;
  const session = event.context.sessions?.[sessionName] || await getSession(event, config);
  const sealed = await ironWebcrypto.seal(config.crypto || crypto__default, session, config.password, {
    ...ironWebcrypto.defaults,
    ttl: config.maxAge ? config.maxAge * 1e3 : 0,
    ...config.seal
  });
  return sealed;
}
async function unsealSession(_event, config, sealed) {
  const unsealed = await ironWebcrypto.unseal(
    config.crypto || crypto__default,
    sealed,
    config.password,
    {
      ...ironWebcrypto.defaults,
      ttl: config.maxAge ? config.maxAge * 1e3 : 0,
      ...config.seal
    }
  );
  if (config.maxAge) {
    const age = Date.now() - (unsealed.createdAt || Number.NEGATIVE_INFINITY);
    if (age > config.maxAge * 1e3) {
      throw new Error("Session expired!");
    }
  }
  return unsealed;
}
function clearSession(event, config) {
  const sessionName = config.name || DEFAULT_NAME;
  if (event.context.sessions?.[sessionName]) {
    delete event.context.sessions[sessionName];
  }
  setCookie(event, sessionName, "", {
    ...DEFAULT_COOKIE,
    ...config.cookie
  });
  return Promise.resolve();
}

function formatEventStreamMessage(message) {
  let result = "";
  if (message.id) {
    result += `id: ${message.id}
`;
  }
  if (message.event) {
    result += `event: ${message.event}
`;
  }
  if (typeof message.retry === "number" && Number.isInteger(message.retry)) {
    result += `retry: ${message.retry}
`;
  }
  result += `data: ${message.data}

`;
  return result;
}
function formatEventStreamMessages(messages) {
  let result = "";
  for (const msg of messages) {
    result += formatEventStreamMessage(msg);
  }
  return result;
}
function setEventStreamHeaders(event) {
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "private, no-cache, no-store, no-transform, must-revalidate, max-age=0",
    "X-Accel-Buffering": "no"
    // prevent nginx from buffering the response
  };
  if (!isHttp2Request(event)) {
    headers.Connection = "keep-alive";
  }
  setResponseHeaders(event, headers);
}
function isHttp2Request(event) {
  return getHeader(event, ":path") !== void 0 && getHeader(event, ":method") !== void 0;
}

class EventStream {
  _h3Event;
  _transformStream = new TransformStream();
  _writer;
  _encoder = new TextEncoder();
  _writerIsClosed = false;
  _paused = false;
  _unsentData;
  _disposed = false;
  _handled = false;
  constructor(event, opts = {}) {
    this._h3Event = event;
    this._writer = this._transformStream.writable.getWriter();
    this._writer.closed.then(() => {
      this._writerIsClosed = true;
    });
    if (opts.autoclose !== false) {
      this._h3Event.node.req.on("close", () => this.close());
    }
  }
  async push(message) {
    if (typeof message === "string") {
      await this._sendEvent({ data: message });
      return;
    }
    if (Array.isArray(message)) {
      if (message.length === 0) {
        return;
      }
      if (typeof message[0] === "string") {
        const msgs = [];
        for (const item of message) {
          msgs.push({ data: item });
        }
        await this._sendEvents(msgs);
        return;
      }
      await this._sendEvents(message);
      return;
    }
    await this._sendEvent(message);
  }
  async _sendEvent(message) {
    if (this._writerIsClosed) {
      return;
    }
    if (this._paused && !this._unsentData) {
      this._unsentData = formatEventStreamMessage(message);
      return;
    }
    if (this._paused) {
      this._unsentData += formatEventStreamMessage(message);
      return;
    }
    await this._writer.write(this._encoder.encode(formatEventStreamMessage(message))).catch();
  }
  async _sendEvents(messages) {
    if (this._writerIsClosed) {
      return;
    }
    const payload = formatEventStreamMessages(messages);
    if (this._paused && !this._unsentData) {
      this._unsentData = payload;
      return;
    }
    if (this._paused) {
      this._unsentData += payload;
      return;
    }
    await this._writer.write(this._encoder.encode(payload)).catch();
  }
  pause() {
    this._paused = true;
  }
  get isPaused() {
    return this._paused;
  }
  async resume() {
    this._paused = false;
    await this.flush();
  }
  async flush() {
    if (this._writerIsClosed) {
      return;
    }
    if (this._unsentData?.length) {
      await this._writer.write(this._encoder.encode(this._unsentData));
      this._unsentData = void 0;
    }
  }
  /**
   * Close the stream and the connection if the stream is being sent to the client
   */
  async close() {
    if (this._disposed) {
      return;
    }
    if (!this._writerIsClosed) {
      try {
        await this._writer.close();
      } catch {
      }
    }
    if (this._h3Event._handled && this._handled && !this._h3Event.node.res.closed) {
      this._h3Event.node.res.end();
    }
    this._disposed = true;
  }
  /**
   * Triggers callback when the writable stream is closed.
   * It is also triggered after calling the `close()` method.
   */
  onClosed(cb) {
    this._writer.closed.then(cb);
  }
  async send() {
    setEventStreamHeaders(this._h3Event);
    setResponseStatus(this._h3Event, 200);
    this._h3Event._handled = true;
    this._handled = true;
    await sendStream(this._h3Event, this._transformStream.readable);
  }
}

function createEventStream(event, opts) {
  return new EventStream(event, opts);
}

async function serveStatic(event, options) {
  if (event.method !== "GET" && event.method !== "HEAD") {
    if (!options.fallthrough) {
      throw createError({
        statusMessage: "Method Not Allowed",
        statusCode: 405
      });
    }
    return false;
  }
  const originalId = ufo.decodePath(
    ufo.withLeadingSlash(ufo.withoutTrailingSlash(ufo.parseURL(event.path).pathname))
  );
  const acceptEncodings = parseAcceptEncoding(
    getRequestHeader(event, "accept-encoding"),
    options.encodings
  );
  if (acceptEncodings.length > 1) {
    setResponseHeader(event, "vary", "accept-encoding");
  }
  let id = originalId;
  let meta;
  const _ids = idSearchPaths(
    originalId,
    acceptEncodings,
    options.indexNames || ["/index.html"]
  );
  for (const _id of _ids) {
    const _meta = await options.getMeta(_id);
    if (_meta) {
      meta = _meta;
      id = _id;
      break;
    }
  }
  if (!meta) {
    if (!options.fallthrough) {
      throw createError({ statusCode: 404 });
    }
    return false;
  }
  if (meta.etag && !getResponseHeader(event, "etag")) {
    setResponseHeader(event, "etag", meta.etag);
  }
  const ifNotMatch = meta.etag && getRequestHeader(event, "if-none-match") === meta.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return send(event, "");
  }
  if (meta.mtime) {
    const mtimeDate = new Date(meta.mtime);
    const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
    if (ifModifiedSinceH && new Date(ifModifiedSinceH) >= mtimeDate) {
      setResponseStatus(event, 304, "Not Modified");
      return send(event, null);
    }
    if (!getResponseHeader(event, "last-modified")) {
      setResponseHeader(event, "last-modified", mtimeDate.toUTCString());
    }
  }
  if (meta.type && !getResponseHeader(event, "content-type")) {
    setResponseHeader(event, "content-type", meta.type);
  }
  if (meta.encoding && !getResponseHeader(event, "content-encoding")) {
    setResponseHeader(event, "content-encoding", meta.encoding);
  }
  if (meta.size !== void 0 && meta.size > 0 && !getResponseHeader(event, "content-length")) {
    setResponseHeader(event, "content-length", meta.size);
  }
  if (event.method === "HEAD") {
    return send(event, null);
  }
  const contents = await options.getContents(id);
  return isStream(contents) ? sendStream(event, contents) : send(event, contents);
}
function parseAcceptEncoding(header, encodingMap) {
  if (!encodingMap || !header) {
    return [];
  }
  return String(header || "").split(",").map((e) => encodingMap[e.trim()]).filter(Boolean);
}
function idSearchPaths(id, encodings, indexNames) {
  const ids = [];
  for (const suffix of ["", ...indexNames]) {
    for (const encoding of [...encodings, ""]) {
      ids.push(`${id}${suffix}${encoding}`);
    }
  }
  return ids;
}

function defineWebSocket(hooks) {
  return hooks;
}
function defineWebSocketHandler(hooks) {
  return defineEventHandler({
    handler() {
      throw createError({
        statusCode: 426,
        statusMessage: "Upgrade Required"
      });
    },
    websocket: hooks
  });
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function defineRequestMiddleware(fn) {
  return fn;
}
function defineResponseMiddleware(fn) {
  return fn;
}
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function dynamicEventHandler(initial) {
  let current = initial;
  const wrapper = eventHandler((event) => {
    if (current) {
      return current(event);
    }
  });
  wrapper.set = (handler) => {
    current = handler;
  };
  return wrapper;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

const H3Headers = globalThis.Headers;
const H3Response = globalThis.Response;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: ufo.joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: ufo.withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? ufo.parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = radix3.createRouter({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = radix3.toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = ufo.withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}

const defineNodeListener = (handler) => handler;
const defineNodeMiddleware = (middleware) => middleware;
function fromNodeMiddleware(handler) {
  if (isEventHandler(handler)) {
    return handler;
  }
  if (typeof handler !== "function") {
    throw new TypeError(
      "Invalid handler. It should be a function:",
      handler
    );
  }
  return eventHandler((event) => {
    return callNodeListener(
      handler,
      event.node.req,
      event.node.res
    );
  });
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}
function promisifyNodeListener(handler) {
  return function(req, res) {
    return callNodeListener(handler, req, res);
  };
}
function callNodeListener(handler, req, res) {
  const isMiddleware = handler.length > 2;
  return new Promise((resolve, reject) => {
    const next = (err) => {
      if (isMiddleware) {
        res.off("close", next);
        res.off("error", next);
      }
      return err ? reject(createError(err)) : resolve(void 0);
    };
    try {
      const returned = handler(req, res, next);
      if (isMiddleware && returned === void 0) {
        res.once("close", next);
        res.once("error", next);
      } else {
        resolve(returned);
      }
    } catch (error) {
      next(error);
    }
  });
}

function toPlainHandler(app) {
  const handler = (request) => {
    return _handlePlainRequest(app, request);
  };
  return handler;
}
function fromPlainHandler(handler) {
  return eventHandler(async (event) => {
    const res = await handler({
      method: event.method,
      path: event.path,
      headers: Object.fromEntries(event.headers.entries()),
      body: getRequestWebStream(event),
      context: event.context
    });
    setResponseStatus(event, res.status, res.statusText);
    for (const [key, value] of res.headers) {
      setResponseHeader(event, key, value);
    }
    return res.body;
  });
}
async function _handlePlainRequest(app, request) {
  const path = request.path;
  const method = (request.method || "GET").toUpperCase();
  const headers = new Headers(request.headers);
  const nodeReq = new nodeMockHttp.IncomingMessage();
  const nodeRes = new nodeMockHttp.ServerResponse(nodeReq);
  nodeReq.method = method;
  nodeReq.url = path;
  nodeReq.headers = Object.fromEntries(headers.entries());
  const event = createEvent(nodeReq, nodeRes);
  event._method = method;
  event._path = path;
  event._headers = headers;
  if (request.body) {
    event._requestBody = request.body;
  }
  if (request._eventOverrides) {
    Object.assign(event, request._eventOverrides);
  }
  if (request.context) {
    Object.assign(event.context, request.context);
  }
  try {
    await app.handler(event);
  } catch (_error) {
    const error = createError(_error);
    if (!isError(_error)) {
      error.unhandled = true;
    }
    if (app.options.onError) {
      await app.options.onError(error, event);
    }
    if (!event.handled) {
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      await sendError(event, error, !!app.options.debug);
    }
  }
  return {
    status: nodeRes.statusCode,
    statusText: nodeRes.statusMessage,
    headers: _normalizeUnenvHeaders(nodeRes._headers),
    body: nodeRes._data
  };
}
function _normalizeUnenvHeaders(input) {
  const headers = [];
  const cookies = [];
  for (const _key in input) {
    const key = _key.toLowerCase();
    if (key === "set-cookie") {
      cookies.push(
        ...splitCookiesString(input["set-cookie"])
      );
      continue;
    }
    const value = input[key];
    if (Array.isArray(value)) {
      for (const _value of value) {
        headers.push([key, _value]);
      }
    } else if (value !== void 0) {
      headers.push([key, String(value)]);
    }
  }
  if (cookies.length > 0) {
    for (const cookie of cookies) {
      headers.push(["set-cookie", cookie]);
    }
  }
  return headers;
}

function toWebHandler(app) {
  const webHandler = (request, context) => {
    return _handleWebRequest(app, request, context);
  };
  return webHandler;
}
function fromWebHandler(handler) {
  return eventHandler((event) => handler(toWebRequest(event), event.context));
}
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
async function _handleWebRequest(app, request, context) {
  const url = new URL(request.url);
  const res = await _handlePlainRequest(app, {
    _eventOverrides: {
      web: { request, url }
    },
    context,
    method: request.method,
    path: url.pathname + url.search,
    headers: request.headers,
    body: request.body
  });
  const body = nullBodyResponses.has(res.status) || request.method === "HEAD" ? null : res.body;
  return new Response(body, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers
  });
}

exports.H3Error = H3Error;
exports.H3Event = H3Event;
exports.H3Headers = H3Headers;
exports.H3Response = H3Response;
exports.MIMES = MIMES;
exports.appendCorsHeaders = appendCorsHeaders;
exports.appendCorsPreflightHeaders = appendCorsPreflightHeaders;
exports.appendHeader = appendHeader;
exports.appendHeaders = appendHeaders;
exports.appendResponseHeader = appendResponseHeader;
exports.appendResponseHeaders = appendResponseHeaders;
exports.assertMethod = assertMethod;
exports.callNodeListener = callNodeListener;
exports.clearResponseHeaders = clearResponseHeaders;
exports.clearSession = clearSession;
exports.createApp = createApp;
exports.createAppEventHandler = createAppEventHandler;
exports.createError = createError;
exports.createEvent = createEvent;
exports.createEventStream = createEventStream;
exports.createRouter = createRouter;
exports.defaultContentType = defaultContentType;
exports.defineEventHandler = defineEventHandler;
exports.defineLazyEventHandler = defineLazyEventHandler;
exports.defineNodeListener = defineNodeListener;
exports.defineNodeMiddleware = defineNodeMiddleware;
exports.defineRequestMiddleware = defineRequestMiddleware;
exports.defineResponseMiddleware = defineResponseMiddleware;
exports.defineWebSocket = defineWebSocket;
exports.defineWebSocketHandler = defineWebSocketHandler;
exports.deleteCookie = deleteCookie;
exports.dynamicEventHandler = dynamicEventHandler;
exports.eventHandler = eventHandler;
exports.fetchWithEvent = fetchWithEvent;
exports.fromNodeMiddleware = fromNodeMiddleware;
exports.fromPlainHandler = fromPlainHandler;
exports.fromWebHandler = fromWebHandler;
exports.getCookie = getCookie;
exports.getHeader = getHeader;
exports.getHeaders = getHeaders;
exports.getMethod = getMethod;
exports.getProxyRequestHeaders = getProxyRequestHeaders;
exports.getQuery = getQuery;
exports.getRequestFingerprint = getRequestFingerprint;
exports.getRequestHeader = getRequestHeader;
exports.getRequestHeaders = getRequestHeaders;
exports.getRequestHost = getRequestHost;
exports.getRequestIP = getRequestIP;
exports.getRequestPath = getRequestPath;
exports.getRequestProtocol = getRequestProtocol;
exports.getRequestURL = getRequestURL;
exports.getRequestWebStream = getRequestWebStream;
exports.getResponseHeader = getResponseHeader;
exports.getResponseHeaders = getResponseHeaders;
exports.getResponseStatus = getResponseStatus;
exports.getResponseStatusText = getResponseStatusText;
exports.getRouterParam = getRouterParam;
exports.getRouterParams = getRouterParams;
exports.getSession = getSession;
exports.getValidatedQuery = getValidatedQuery;
exports.getValidatedRouterParams = getValidatedRouterParams;
exports.handleCacheHeaders = handleCacheHeaders;
exports.handleCors = handleCors;
exports.isCorsOriginAllowed = isCorsOriginAllowed;
exports.isError = isError;
exports.isEvent = isEvent;
exports.isEventHandler = isEventHandler;
exports.isMethod = isMethod;
exports.isPreflightRequest = isPreflightRequest;
exports.isStream = isStream;
exports.isWebResponse = isWebResponse;
exports.lazyEventHandler = lazyEventHandler;
exports.parseCookies = parseCookies;
exports.promisifyNodeListener = promisifyNodeListener;
exports.proxyRequest = proxyRequest;
exports.readBody = readBody;
exports.readFormData = readFormData;
exports.readMultipartFormData = readMultipartFormData;
exports.readRawBody = readRawBody;
exports.readValidatedBody = readValidatedBody;
exports.removeResponseHeader = removeResponseHeader;
exports.sanitizeStatusCode = sanitizeStatusCode;
exports.sanitizeStatusMessage = sanitizeStatusMessage;
exports.sealSession = sealSession;
exports.send = send;
exports.sendError = sendError;
exports.sendIterable = sendIterable;
exports.sendNoContent = sendNoContent;
exports.sendProxy = sendProxy;
exports.sendRedirect = sendRedirect;
exports.sendStream = sendStream;
exports.sendWebResponse = sendWebResponse;
exports.serveStatic = serveStatic;
exports.setCookie = setCookie;
exports.setHeader = setHeader;
exports.setHeaders = setHeaders;
exports.setResponseHeader = setResponseHeader;
exports.setResponseHeaders = setResponseHeaders;
exports.setResponseStatus = setResponseStatus;
exports.splitCookiesString = splitCookiesString;
exports.toEventHandler = toEventHandler;
exports.toNodeListener = toNodeListener;
exports.toPlainHandler = toPlainHandler;
exports.toWebHandler = toWebHandler;
exports.toWebRequest = toWebRequest;
exports.unsealSession = unsealSession;
exports.updateSession = updateSession;
exports.use = use;
exports.useBase = useBase;
exports.useSession = useSession;
exports.writeEarlyHints = writeEarlyHints;
