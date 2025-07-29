import "#nitro-internal-pollyfills";
import { useNitroApp } from "nitropack/runtime";
import { isPublicAssetURL } from "#nitro-internal-virtual/public-assets";
const nitroApp = useNitroApp();
addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (isPublicAssetURL(url.pathname) || url.pathname.includes("/_server/")) {
    return;
  }
  event.respondWith(handleEvent(url, event));
});
async function handleEvent(url, event) {
  let body;
  if (event.request.body) {
    body = await event.request.arrayBuffer();
  }
  return nitroApp.localFetch(url.pathname + url.search, {
    host: url.hostname,
    protocol: url.protocol,
    headers: event.request.headers,
    method: event.request.method,
    redirect: event.request.redirect,
    body
  });
}
self.addEventListener("install", () => {
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
