import { M as Message, P as Peer, t as toBufferLike } from '../shared/crossws.DfCzGthR.mjs';
import { a as adapterUtils, A as AdapterHookable } from '../shared/crossws.D9ehKjSh.mjs';
import 'uncrypto';

const uwsAdapter = (options = {}) => {
  const hooks = new AdapterHookable(options);
  const peers = /* @__PURE__ */ new Set();
  return {
    ...adapterUtils(peers),
    websocket: {
      ...options.uws,
      close(ws, code, message) {
        const peer = getPeer(ws, peers);
        peer._internal.ws.readyState = 2;
        peers.delete(peer);
        hooks.callHook("close", peer, {
          code,
          reason: message?.toString()
        });
        peer._internal.ws.readyState = 3;
      },
      message(ws, message, isBinary) {
        const peer = getPeer(ws, peers);
        hooks.callHook("message", peer, new Message(message, peer));
      },
      open(ws) {
        const peer = getPeer(ws, peers);
        peers.add(peer);
        hooks.callHook("open", peer);
      },
      async upgrade(res, req, uwsContext) {
        let aborted = false;
        res.onAborted(() => {
          aborted = true;
        });
        const { upgradeHeaders, endResponse, context } = await hooks.upgrade(
          new UWSReqProxy(req)
        );
        if (endResponse) {
          res.writeStatus(`${endResponse.status} ${endResponse.statusText}`);
          for (const [key, value] of endResponse.headers) {
            res.writeHeader(key, value);
          }
          if (endResponse.body) {
            for await (const chunk of endResponse.body) {
              if (aborted) break;
              res.write(chunk);
            }
          }
          if (!aborted) {
            res.end();
          }
          return;
        }
        if (aborted) {
          return;
        }
        res.writeStatus("101 Switching Protocols");
        if (upgradeHeaders) {
          const headers = upgradeHeaders instanceof Headers ? upgradeHeaders : new Headers(upgradeHeaders);
          for (const [key, value] of headers) {
            res.writeHeader(key, value);
          }
        }
        res.cork(() => {
          const key = req.getHeader("sec-websocket-key");
          const protocol = req.getHeader("sec-websocket-protocol");
          const extensions = req.getHeader("sec-websocket-extensions");
          res.upgrade(
            {
              req,
              res,
              protocol,
              extensions,
              context
            },
            key,
            protocol,
            extensions,
            uwsContext
          );
        });
      }
    }
  };
};
function getPeer(uws, peers) {
  const uwsData = uws.getUserData();
  if (uwsData.peer) {
    return uwsData.peer;
  }
  const peer = new UWSPeer({
    peers,
    uws,
    ws: new UwsWebSocketProxy(uws),
    request: new UWSReqProxy(uwsData.req),
    uwsData
  });
  uwsData.peer = peer;
  return peer;
}
class UWSPeer extends Peer {
  get remoteAddress() {
    try {
      const addr = new TextDecoder().decode(
        this._internal.uws.getRemoteAddressAsText()
      );
      return addr;
    } catch {
    }
  }
  get context() {
    return this._internal.uwsData.context;
  }
  send(data, options) {
    const dataBuff = toBufferLike(data);
    const isBinary = typeof dataBuff !== "string";
    return this._internal.uws.send(dataBuff, isBinary, options?.compress);
  }
  subscribe(topic) {
    this._topics.add(topic);
    this._internal.uws.subscribe(topic);
  }
  unsubscribe(topic) {
    this._topics.delete(topic);
    this._internal.uws.unsubscribe(topic);
  }
  publish(topic, message, options) {
    const data = toBufferLike(message);
    const isBinary = typeof data !== "string";
    this._internal.uws.publish(topic, data, isBinary, options?.compress);
    return 0;
  }
  close(code, reason) {
    this._internal.uws.end(code, reason);
  }
  terminate() {
    this._internal.uws.close();
  }
}
class UWSReqProxy {
  _headers;
  _rawHeaders = [];
  url;
  constructor(_req) {
    let host = "localhost";
    let proto = "http";
    _req.forEach((key, value) => {
      if (key === "host") {
        host = value;
      } else if (key === "x-forwarded-proto" && value === "https") {
        proto = "https";
      }
      this._rawHeaders.push([key, value]);
    });
    const query = _req.getQuery();
    const pathname = _req.getUrl();
    this.url = `${proto}://${host}${pathname}${query ? `?${query}` : ""}`;
  }
  get headers() {
    if (!this._headers) {
      this._headers = new Headers(this._rawHeaders);
    }
    return this._headers;
  }
}
class UwsWebSocketProxy {
  constructor(_uws) {
    this._uws = _uws;
  }
  readyState = 1;
  get bufferedAmount() {
    return this._uws?.getBufferedAmount();
  }
  get protocol() {
    return this._uws?.getUserData().protocol;
  }
  get extensions() {
    return this._uws?.getUserData().extensions;
  }
}

export { uwsAdapter as default };
