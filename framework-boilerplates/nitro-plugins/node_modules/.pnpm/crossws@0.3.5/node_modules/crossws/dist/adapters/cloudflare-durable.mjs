import { M as Message, P as Peer, t as toBufferLike } from '../shared/crossws.DfCzGthR.mjs';
import { a as adapterUtils, A as AdapterHookable } from '../shared/crossws.D9ehKjSh.mjs';
import 'uncrypto';

const cloudflareDurableAdapter = (opts = {}) => {
  const hooks = new AdapterHookable(opts);
  const peers = /* @__PURE__ */ new Set();
  const resolveDurableStub = opts.resolveDurableStub || ((_req, env, _context) => {
    const bindingName = opts.bindingName || "$DurableObject";
    const binding = env[bindingName];
    if (!binding) {
      throw new Error(
        `Durable Object binding "${bindingName}" not available`
      );
    }
    const instanceId = binding.idFromName(opts.instanceName || "crossws");
    return binding.get(instanceId);
  });
  return {
    ...adapterUtils(peers),
    handleUpgrade: async (req, env, context) => {
      const stub = await resolveDurableStub(req, env, context);
      return stub.fetch(req);
    },
    handleDurableInit: async (obj, state, env) => {
    },
    handleDurableUpgrade: async (obj, request) => {
      const { upgradeHeaders, endResponse } = await hooks.upgrade(
        request
      );
      if (endResponse) {
        return endResponse;
      }
      const pair = new WebSocketPair();
      const client = pair[0];
      const server = pair[1];
      const peer = CloudflareDurablePeer._restore(
        obj,
        server,
        request
      );
      peers.add(peer);
      obj.ctx.acceptWebSocket(server);
      await hooks.callHook("open", peer);
      return new Response(null, {
        status: 101,
        webSocket: client,
        headers: upgradeHeaders
      });
    },
    handleDurableMessage: async (obj, ws, message) => {
      const peer = CloudflareDurablePeer._restore(obj, ws);
      await hooks.callHook("message", peer, new Message(message, peer));
    },
    handleDurableClose: async (obj, ws, code, reason, wasClean) => {
      const peer = CloudflareDurablePeer._restore(obj, ws);
      peers.delete(peer);
      const details = { code, reason, wasClean };
      await hooks.callHook("close", peer, details);
    }
  };
};
class CloudflareDurablePeer extends Peer {
  get peers() {
    return new Set(
      this.#getwebsockets().map(
        (ws) => CloudflareDurablePeer._restore(this._internal.durable, ws)
      )
    );
  }
  #getwebsockets() {
    return this._internal.durable.ctx.getWebSockets();
  }
  send(data) {
    return this._internal.ws.send(toBufferLike(data));
  }
  subscribe(topic) {
    super.subscribe(topic);
    const state = getAttachedState(this._internal.ws);
    if (!state.t) {
      state.t = /* @__PURE__ */ new Set();
    }
    state.t.add(topic);
    setAttachedState(this._internal.ws, state);
  }
  publish(topic, data) {
    const websockets = this.#getwebsockets();
    if (websockets.length < 2) {
      return;
    }
    const dataBuff = toBufferLike(data);
    for (const ws of websockets) {
      if (ws === this._internal.ws) {
        continue;
      }
      const state = getAttachedState(ws);
      if (state.t?.has(topic)) {
        ws.send(dataBuff);
      }
    }
  }
  close(code, reason) {
    this._internal.ws.close(code, reason);
  }
  static _restore(durable, ws, request) {
    let peer = ws._crosswsPeer;
    if (peer) {
      return peer;
    }
    const state = ws.deserializeAttachment() || {};
    peer = ws._crosswsPeer = new CloudflareDurablePeer({
      ws,
      request: request || { url: state.u },
      durable
    });
    if (state.i) {
      peer._id = state.i;
    }
    if (request?.url) {
      state.u = request.url;
    }
    state.i = peer.id;
    setAttachedState(ws, state);
    return peer;
  }
}
function getAttachedState(ws) {
  let state = ws._crosswsState;
  if (state) {
    return state;
  }
  state = ws.deserializeAttachment() || {};
  ws._crosswsState = state;
  return state;
}
function setAttachedState(ws, state) {
  ws._crosswsState = state;
  ws.serializeAttachment(state);
}

export { cloudflareDurableAdapter as default };
