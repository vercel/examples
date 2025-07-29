import "#nitro-internal-pollyfills";
import { toPlainHandler } from "h3";
import { useNitroApp } from "nitropack/runtime";
import { toBuffer } from "nitropack/runtime/internal";
import { hasProtocol, joinURL } from "ufo";
const nitroApp = useNitroApp();
const _handler = toPlainHandler(nitroApp.h3App);
async function _handleEvent(event) {
  try {
    const res = await _handler({
      path: event.request.url.pathname + (event.request.url.search ? `?${event.request.url.search}` : ""),
      method: event.request.getMethod() || "GET",
      body: event.request.body,
      headers: event.request.headers,
      context: {
        waitUntil: (promise) => event.waitUntil(promise),
        _platform: {
          winterjs: {
            event
          }
        }
      }
    });
    const body = typeof res.body === "string" ? res.body : await toBuffer(res.body);
    return new Response(body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers
    });
  } catch (error) {
    const errString = error?.message + "\n" + error?.stack;
    console.error(errString);
    return new Response(errString, { status: 500 });
  }
}
addEventListener("fetch", async (event) => {
  event.respondWith(await _handleEvent(event));
});
if (!Headers.prototype.entries) {
  Headers.prototype.entries = function() {
    return [...this];
  };
}
if (!URL.prototype.pathname) {
  Object.defineProperty(URL.prototype, "pathname", {
    get() {
      return this.path || "/";
    }
  });
}
const _URL = globalThis.URL;
globalThis.URL = class URL2 extends _URL {
  constructor(url, base) {
    if (!base || hasProtocol(url)) {
      super(url);
      return;
    }
    super(joinURL(base, url));
  }
};
const _Response = globalThis.Response;
globalThis.Response = class Response2 extends _Response {
  _body;
  constructor(body, init) {
    super(body, init);
    this._body = body;
  }
  get body() {
    return this._body;
  }
};
