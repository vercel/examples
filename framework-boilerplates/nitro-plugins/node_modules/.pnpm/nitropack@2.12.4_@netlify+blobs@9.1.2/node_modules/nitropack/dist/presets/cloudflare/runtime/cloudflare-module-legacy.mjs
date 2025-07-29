import "#nitro-internal-pollyfills";
import {
  getAssetFromKV,
  mapRequestToAsset
} from "@cloudflare/kv-asset-handler";
import wsAdapter from "crossws/adapters/cloudflare";
import { withoutBase } from "ufo";
import { useNitroApp, useRuntimeConfig } from "nitropack/runtime";
import { getPublicAssetMeta } from "#nitro-internal-virtual/public-assets";
import { createHandler } from "./_module-handler.mjs";
import manifest from "__STATIC_CONTENT_MANIFEST";
const nitroApp = useNitroApp();
const ws = import.meta._websocket ? wsAdapter(nitroApp.h3App.websocket) : void 0;
export default createHandler({
  async fetch(request, env, context) {
    if (import.meta._websocket && request.headers.get("upgrade") === "websocket") {
      return ws.handleUpgrade(request, env, context);
    }
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil(promise) {
            return context.waitUntil(promise);
          }
        },
        {
          cacheControl: assetsCacheControl,
          mapRequestToAsset: baseURLModifier,
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: JSON.parse(manifest)
        }
      );
    } catch {
    }
  }
});
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
