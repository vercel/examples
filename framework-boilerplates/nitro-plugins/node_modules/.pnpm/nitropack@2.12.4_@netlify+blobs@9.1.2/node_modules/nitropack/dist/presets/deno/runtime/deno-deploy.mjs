import "#nitro-internal-pollyfills";
import { useNitroApp } from "nitropack/runtime";
import wsAdapter from "crossws/adapters/deno";
const nitroApp = useNitroApp();
const ws = import.meta._websocket ? wsAdapter(nitroApp.h3App.websocket) : void 0;
Deno.serve((request, info) => {
  if (import.meta._websocket && request.headers.get("upgrade") === "websocket") {
    return ws.handleUpgrade(request, info);
  }
  return handleRequest(request, info);
});
async function handleRequest(request, info) {
  const url = new URL(request.url);
  const headers = new Headers(request.headers);
  headers.append("x-forwarded-for", info.remoteAddr.hostname);
  if (!headers.has("x-forwarded-proto")) {
    headers.set("x-forwarded-proto", "https");
  }
  let body;
  if (request.body) {
    body = await request.arrayBuffer();
  }
  return nitroApp.localFetch(url.pathname + url.search, {
    host: url.hostname,
    protocol: url.protocol,
    headers,
    method: request.method,
    redirect: request.redirect,
    body
  });
}
