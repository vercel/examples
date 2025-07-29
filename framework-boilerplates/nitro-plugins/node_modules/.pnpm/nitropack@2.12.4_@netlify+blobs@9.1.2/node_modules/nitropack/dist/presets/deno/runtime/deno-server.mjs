import "#nitro-internal-pollyfills";
import "./_deno-env-polyfill";
import { useNitroApp } from "nitropack/runtime";
import { useRuntimeConfig } from "nitropack/runtime";
import { startScheduleRunner } from "nitropack/runtime/internal";
import wsAdapter from "crossws/adapters/deno";
import destr from "destr";
const nitroApp = useNitroApp();
if (Deno.env.get("DEBUG")) {
  addEventListener(
    "unhandledrejection",
    (event) => console.error("[unhandledRejection]", event.reason)
  );
  addEventListener(
    "error",
    (event) => console.error("[uncaughtException]", event.error)
  );
} else {
  addEventListener(
    "unhandledrejection",
    (err) => console.error("[unhandledRejection] " + err)
  );
  addEventListener(
    "error",
    (event) => console.error("[uncaughtException] " + event.error)
  );
}
const serveOptions = {
  key: Deno.env.get("NITRO_SSL_KEY"),
  cert: Deno.env.get("NITRO_SSL_CERT"),
  port: destr(Deno.env.get("NITRO_PORT") || Deno.env.get("PORT")) || 3e3,
  hostname: Deno.env.get("NITRO_HOST") || Deno.env.get("HOST"),
  onListen: (opts) => {
    const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
    const url = `${opts.hostname}:${opts.port}${baseURL}`;
    console.log(`Listening ${url}`);
  }
};
if (!serveOptions.key || !serveOptions.cert) {
  delete serveOptions.key;
  delete serveOptions.cert;
}
Deno.serve(serveOptions, handler);
const ws = import.meta._websocket ? wsAdapter(nitroApp.h3App.websocket) : void 0;
async function handler(request, info) {
  if (import.meta._websocket && request.headers.get("upgrade") === "websocket") {
    return ws.handleUpgrade(request, info);
  }
  const url = new URL(request.url);
  let body;
  if (request.body) {
    body = await request.arrayBuffer();
  }
  return nitroApp.localFetch(url.pathname + url.search, {
    host: url.hostname,
    protocol: url.protocol,
    headers: request.headers,
    method: request.method,
    redirect: request.redirect,
    body
  });
}
if (import.meta._tasks) {
  startScheduleRunner();
}
export default {};
