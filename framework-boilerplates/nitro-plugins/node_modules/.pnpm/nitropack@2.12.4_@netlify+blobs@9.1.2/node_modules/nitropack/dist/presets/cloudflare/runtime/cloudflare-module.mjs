import "#nitro-internal-pollyfills";
import wsAdapter from "crossws/adapters/cloudflare";
import { useNitroApp } from "nitropack/runtime";
import { isPublicAssetURL } from "#nitro-internal-virtual/public-assets";
import { createHandler } from "./_module-handler.mjs";
const nitroApp = useNitroApp();
const ws = import.meta._websocket ? wsAdapter(nitroApp.h3App.websocket) : void 0;
export default createHandler({
  fetch(request, env, context, url) {
    if (env.ASSETS && isPublicAssetURL(url.pathname)) {
      return env.ASSETS.fetch(request);
    }
    if (import.meta._websocket && request.headers.get("upgrade") === "websocket") {
      return ws.handleUpgrade(request, env, context);
    }
  }
});
