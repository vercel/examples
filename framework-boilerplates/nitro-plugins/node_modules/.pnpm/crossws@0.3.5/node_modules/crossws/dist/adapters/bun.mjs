import { M as Message, P as Peer, t as toBufferLike } from '../shared/crossws.DfCzGthR.mjs';
import { a as adapterUtils, A as AdapterHookable } from '../shared/crossws.D9ehKjSh.mjs';
import 'uncrypto';

const bunAdapter = (options = {}) => {
  const hooks = new AdapterHookable(options);
  const peers = /* @__PURE__ */ new Set();
  return {
    ...adapterUtils(peers),
    async handleUpgrade(request, server) {
      const { upgradeHeaders, endResponse, context } = await hooks.upgrade(request);
      if (endResponse) {
        return endResponse;
      }
      const upgradeOK = server.upgrade(request, {
        data: {
          server,
          request,
          context
        },
        headers: upgradeHeaders
      });
      if (!upgradeOK) {
        return new Response("Upgrade failed", { status: 500 });
      }
    },
    websocket: {
      message: (ws, message) => {
        const peer = getPeer(ws, peers);
        hooks.callHook("message", peer, new Message(message, peer));
      },
      open: (ws) => {
        const peer = getPeer(ws, peers);
        peers.add(peer);
        hooks.callHook("open", peer);
      },
      close: (ws, code, reason) => {
        const peer = getPeer(ws, peers);
        peers.delete(peer);
        hooks.callHook("close", peer, { code, reason });
      }
    }
  };
};
function getPeer(ws, peers) {
  if (ws.data?.peer) {
    return ws.data.peer;
  }
  const peer = new BunPeer({ ws, request: ws.data.request, peers });
  ws.data = {
    ...ws.data,
    peer
  };
  return peer;
}
class BunPeer extends Peer {
  get remoteAddress() {
    return this._internal.ws.remoteAddress;
  }
  get context() {
    return this._internal.ws.data.context;
  }
  send(data, options) {
    return this._internal.ws.send(toBufferLike(data), options?.compress);
  }
  publish(topic, data, options) {
    return this._internal.ws.publish(
      topic,
      toBufferLike(data),
      options?.compress
    );
  }
  subscribe(topic) {
    this._topics.add(topic);
    this._internal.ws.subscribe(topic);
  }
  unsubscribe(topic) {
    this._topics.delete(topic);
    this._internal.ws.unsubscribe(topic);
  }
  close(code, reason) {
    this._internal.ws.close(code, reason);
  }
  terminate() {
    this._internal.ws.terminate();
  }
}

export { bunAdapter as default };
