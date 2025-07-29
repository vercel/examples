import { randomUUID } from 'uncrypto';

const kNodeInspect = /* @__PURE__ */ Symbol.for(
  "nodejs.util.inspect.custom"
);
function toBufferLike(val) {
  if (val === void 0 || val === null) {
    return "";
  }
  const type = typeof val;
  if (type === "string") {
    return val;
  }
  if (type === "number" || type === "boolean" || type === "bigint") {
    return val.toString();
  }
  if (type === "function" || type === "symbol") {
    return "{}";
  }
  if (val instanceof Uint8Array || val instanceof ArrayBuffer) {
    return val;
  }
  if (isPlainObject(val)) {
    return JSON.stringify(val);
  }
  return val;
}
function toString(val) {
  if (typeof val === "string") {
    return val;
  }
  const data = toBufferLike(val);
  if (typeof data === "string") {
    return data;
  }
  const base64 = btoa(String.fromCharCode(...new Uint8Array(data)));
  return `data:application/octet-stream;base64,${base64}`;
}
function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

class Message {
  /** Access to the original [message event](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/message_event) if available. */
  event;
  /** Access to the Peer that emitted the message. */
  peer;
  /** Raw message data (can be of any type). */
  rawData;
  #id;
  #uint8Array;
  #arrayBuffer;
  #blob;
  #text;
  #json;
  constructor(rawData, peer, event) {
    this.rawData = rawData || "";
    this.peer = peer;
    this.event = event;
  }
  /**
   * Unique random [uuid v4](https://developer.mozilla.org/en-US/docs/Glossary/UUID) identifier for the message.
   */
  get id() {
    if (!this.#id) {
      this.#id = randomUUID();
    }
    return this.#id;
  }
  // --- data views ---
  /**
   * Get data as [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) value.
   *
   * If raw data is in any other format or string, it will be automatically converted and encoded.
   */
  uint8Array() {
    const _uint8Array = this.#uint8Array;
    if (_uint8Array) {
      return _uint8Array;
    }
    const rawData = this.rawData;
    if (rawData instanceof Uint8Array) {
      return this.#uint8Array = rawData;
    }
    if (rawData instanceof ArrayBuffer || rawData instanceof SharedArrayBuffer) {
      this.#arrayBuffer = rawData;
      return this.#uint8Array = new Uint8Array(rawData);
    }
    if (typeof rawData === "string") {
      this.#text = rawData;
      return this.#uint8Array = new TextEncoder().encode(this.#text);
    }
    if (Symbol.iterator in rawData) {
      return this.#uint8Array = new Uint8Array(rawData);
    }
    if (typeof rawData?.length === "number") {
      return this.#uint8Array = new Uint8Array(rawData);
    }
    if (rawData instanceof DataView) {
      return this.#uint8Array = new Uint8Array(
        rawData.buffer,
        rawData.byteOffset,
        rawData.byteLength
      );
    }
    throw new TypeError(
      `Unsupported message type: ${Object.prototype.toString.call(rawData)}`
    );
  }
  /**
   * Get data as [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) or [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) value.
   *
   * If raw data is in any other format or string, it will be automatically converted and encoded.
   */
  arrayBuffer() {
    const _arrayBuffer = this.#arrayBuffer;
    if (_arrayBuffer) {
      return _arrayBuffer;
    }
    const rawData = this.rawData;
    if (rawData instanceof ArrayBuffer || rawData instanceof SharedArrayBuffer) {
      return this.#arrayBuffer = rawData;
    }
    return this.#arrayBuffer = this.uint8Array().buffer;
  }
  /**
   * Get data as [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) value.
   *
   * If raw data is in any other format or string, it will be automatically converted and encoded. */
  blob() {
    const _blob = this.#blob;
    if (_blob) {
      return _blob;
    }
    const rawData = this.rawData;
    if (rawData instanceof Blob) {
      return this.#blob = rawData;
    }
    return this.#blob = new Blob([this.uint8Array()]);
  }
  /**
   * Get stringified text version of the message.
   *
   * If raw data is in any other format, it will be automatically converted and decoded.
   */
  text() {
    const _text = this.#text;
    if (_text) {
      return _text;
    }
    const rawData = this.rawData;
    if (typeof rawData === "string") {
      return this.#text = rawData;
    }
    return this.#text = new TextDecoder().decode(this.uint8Array());
  }
  /**
   * Get parsed version of the message text with [`JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).
   */
  json() {
    const _json = this.#json;
    if (_json) {
      return _json;
    }
    return this.#json = JSON.parse(this.text());
  }
  /**
   * Message data (value varies based on `peer.websocket.binaryType`).
   */
  get data() {
    switch (this.peer?.websocket?.binaryType) {
      case "arraybuffer": {
        return this.arrayBuffer();
      }
      case "blob": {
        return this.blob();
      }
      case "nodebuffer": {
        return globalThis.Buffer ? Buffer.from(this.uint8Array()) : this.uint8Array();
      }
      case "uint8array": {
        return this.uint8Array();
      }
      case "text": {
        return this.text();
      }
      default: {
        return this.rawData;
      }
    }
  }
  // --- inspect ---
  toString() {
    return this.text();
  }
  [Symbol.toPrimitive]() {
    return this.text();
  }
  [kNodeInspect]() {
    return { data: this.rawData };
  }
}

class Peer {
  _internal;
  _topics;
  _id;
  #ws;
  constructor(internal) {
    this._topics = /* @__PURE__ */ new Set();
    this._internal = internal;
  }
  get context() {
    return this._internal.context ??= {};
  }
  /**
   * Unique random [uuid v4](https://developer.mozilla.org/en-US/docs/Glossary/UUID) identifier for the peer.
   */
  get id() {
    if (!this._id) {
      this._id = randomUUID();
    }
    return this._id;
  }
  /** IP address of the peer */
  get remoteAddress() {
    return void 0;
  }
  /** upgrade request */
  get request() {
    return this._internal.request;
  }
  /**
   * Get the [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) instance.
   *
   * **Note:** crossws adds polyfill for the following properties if native values are not available:
   * - `protocol`: Extracted from the `sec-websocket-protocol` header.
   * - `extensions`: Extracted from the `sec-websocket-extensions` header.
   * - `url`: Extracted from the request URL (http -> ws).
   * */
  get websocket() {
    if (!this.#ws) {
      const _ws = this._internal.ws;
      const _request = this._internal.request;
      this.#ws = _request ? createWsProxy(_ws, _request) : _ws;
    }
    return this.#ws;
  }
  /** All connected peers to the server */
  get peers() {
    return this._internal.peers || /* @__PURE__ */ new Set();
  }
  /** All topics, this peer has been subscribed to. */
  get topics() {
    return this._topics;
  }
  /** Abruptly close the connection */
  terminate() {
    this.close();
  }
  /** Subscribe to a topic */
  subscribe(topic) {
    this._topics.add(topic);
  }
  /** Unsubscribe from a topic */
  unsubscribe(topic) {
    this._topics.delete(topic);
  }
  // --- inspect ---
  toString() {
    return this.id;
  }
  [Symbol.toPrimitive]() {
    return this.id;
  }
  [Symbol.toStringTag]() {
    return "WebSocket";
  }
  [kNodeInspect]() {
    return Object.fromEntries(
      [
        ["id", this.id],
        ["remoteAddress", this.remoteAddress],
        ["peers", this.peers],
        ["webSocket", this.websocket]
      ].filter((p) => p[1])
    );
  }
}
function createWsProxy(ws, request) {
  return new Proxy(ws, {
    get: (target, prop) => {
      const value = Reflect.get(target, prop);
      if (!value) {
        switch (prop) {
          case "protocol": {
            return request?.headers?.get("sec-websocket-protocol") || "";
          }
          case "extensions": {
            return request?.headers?.get("sec-websocket-extensions") || "";
          }
          case "url": {
            return request?.url?.replace(/^http/, "ws") || void 0;
          }
        }
      }
      return value;
    }
  });
}

export { Message as M, Peer as P, toString as a, toBufferLike as t };
