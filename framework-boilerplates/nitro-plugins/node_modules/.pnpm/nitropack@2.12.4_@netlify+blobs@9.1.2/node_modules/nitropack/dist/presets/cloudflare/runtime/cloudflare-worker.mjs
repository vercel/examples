import "#nitro-internal-pollyfills";
import { useNitroApp, useRuntimeConfig } from "nitropack/runtime";
import { requestHasBody } from "nitropack/runtime/internal";
import { getPublicAssetMeta } from "#nitro-internal-virtual/public-assets";
import {
  getAssetFromKV,
  mapRequestToAsset
} from "@cloudflare/kv-asset-handler";
import wsAdapter from "crossws/adapters/cloudflare";
import { withoutBase } from "ufo";
addEventListener("fetch", (event) => {
  event.respondWith(handleEvent(event));
});
const nitroApp = useNitroApp();
const ws = import.meta._websocket ? wsAdapter(nitroApp.h3App.websocket) : void 0;
async function handleEvent(event) {
  if (import.meta._websocket && event.request.headers.get("upgrade") === "websocket") {
    return ws.handleUpgrade(event.request, {}, event);
  }
  try {
    return await getAssetFromKV(event, {
      cacheControl: assetsCacheControl,
      mapRequestToAsset: baseURLModifier
    });
  } catch {
  }
  const url = new URL(event.request.url);
  let body;
  if (requestHasBody(event.request)) {
    body = Buffer.from(await event.request.arrayBuffer());
  }
  return nitroApp.localFetch(url.pathname + url.search, {
    context: {
      waitUntil: (promise) => event.waitUntil(promise),
      _platform: {
        // https://developers.cloudflare.com/workers/runtime-apis/request#incomingrequestcfproperties
        cf: event.request.cf,
        cloudflare: {
          event
        }
      }
    },
    host: url.hostname,
    protocol: url.protocol,
    headers: event.request.headers,
    method: event.request.method,
    redirect: event.request.redirect,
    body
  });
}
function assetsCacheControl(_request) {
  const url = new URL(_request.url);
  const meta = getPublicAssetMeta(url.pathname);
  if (meta.maxAge) {
    return {
      browserTTL: meta.maxAge,
      edgeTTL: meta.maxAge
    };
  }
  return {};
}
const baseURLModifier = (request) => {
  const url = withoutBase(request.url, useRuntimeConfig().app.baseURL);
  return mapRequestToAsset(new Request(url, request));
};
