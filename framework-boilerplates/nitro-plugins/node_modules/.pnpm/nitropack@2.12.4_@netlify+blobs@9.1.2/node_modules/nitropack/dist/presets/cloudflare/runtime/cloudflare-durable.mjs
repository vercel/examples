import "#nitro-internal-pollyfills";
import { DurableObject } from "cloudflare:workers";
import wsAdapter from "crossws/adapters/cloudflare-durable";
import { useNitroApp } from "nitropack/runtime";
import { isPublicAssetURL } from "#nitro-internal-virtual/public-assets";
import { createHandler, fetchHandler } from "./_module-handler.mjs";
const DURABLE_BINDING = "$DurableObject";
const DURABLE_INSTANCE = "server";
const nitroApp = useNitroApp();
const getDurableStub = (env) => {
  const binding = env[DURABLE_BINDING];
  if (!binding) {
    throw new Error(
      `Durable Object binding "${DURABLE_BINDING}" not available.`
    );
  }
  const id = binding.idFromName(DURABLE_INSTANCE);
  return binding.get(id);
};
const ws = import.meta._websocket ? wsAdapter({
  ...nitroApp.h3App.websocket,
  instanceName: DURABLE_INSTANCE,
  bindingName: DURABLE_BINDING
}) : void 0;
export default createHandler({
  fetch(request, env, context, url, ctxExt) {
    if (env.ASSETS && isPublicAssetURL(url.pathname)) {
      return env.ASSETS.fetch(request);
    }
    ctxExt.durableFetch = (req = request) => getDurableStub(env).fetch(req);
    if (import.meta._websocket && request.headers.get("upgrade") === "websocket") {
      return ws.handleUpgrade(request, env, context);
    }
  }
});
export class $DurableObject extends DurableObject {
  constructor(state, env) {
    super(state, env);
    state.waitUntil(
      nitroApp.hooks.callHook("cloudflare:durable:init", this, {
        state,
        env
      })
    );
    if (import.meta._websocket) {
      ws.handleDurableInit(this, state, env);
    }
  }
  fetch(request) {
    if (import.meta._websocket && request.headers.get("upgrade") === "websocket") {
      return ws.handleDurableUpgrade(this, request);
    }
    const url = new URL(request.url);
    return fetchHandler(request, this.env, this.ctx, url, nitroApp, {
      durable: this
    });
  }
  publish(topic, data, opts) {
    if (!ws) {
      throw new Error("WebSocket not available");
    }
    return ws.publish(topic, data, opts);
  }
  alarm() {
    this.ctx.waitUntil(
      nitroApp.hooks.callHook("cloudflare:durable:alarm", this)
    );
  }
  async webSocketMessage(client, message) {
    if (import.meta._websocket) {
      return ws.handleDurableMessage(this, client, message);
    }
  }
  async webSocketClose(client, code, reason, wasClean) {
    if (import.meta._websocket) {
      return ws.handleDurableClose(this, client, code, reason, wasClean);
    }
  }
}
