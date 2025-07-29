'use strict';

const http = require('node:http');
const https = require('node:https');
const node_events = require('node:events');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const http__default = /*#__PURE__*/_interopDefaultCompat(http);
const https__default = /*#__PURE__*/_interopDefaultCompat(https);

const upgradeHeader = /(^|,)\s*upgrade\s*($|,)/i;
const isSSL = /^https|wss/;
function setupOutgoing(outgoing, options, req, forward) {
  outgoing.port = options[forward || "target"].port || (isSSL.test(options[forward || "target"].protocol) ? 443 : 80);
  for (const e of [
    "host",
    "hostname",
    "socketPath",
    "pfx",
    "key",
    "passphrase",
    "cert",
    "ca",
    "ciphers",
    "secureProtocol"
  ]) {
    outgoing[e] = options[forward || "target"][e];
  }
  outgoing.method = options.method || req.method;
  outgoing.headers = { ...req.headers };
  if (options.headers) {
    outgoing.headers = { ...outgoing.headers, ...options.headers };
  }
  if (options.auth) {
    outgoing.auth = options.auth;
  }
  if (options.ca) {
    outgoing.ca = options.ca;
  }
  if (isSSL.test(options[forward || "target"].protocol)) {
    outgoing.rejectUnauthorized = options.secure === undefined ? true : options.secure;
  }
  outgoing.agent = options.agent || false;
  outgoing.localAddress = options.localAddress;
  if (!outgoing.agent) {
    outgoing.headers = outgoing.headers || {};
    if (typeof outgoing.headers.connection !== "string" || !upgradeHeader.test(outgoing.headers.connection)) {
      outgoing.headers.connection = "close";
    }
  }
  const target = options[forward || "target"];
  const targetPath = target && options.prependPath !== false ? target.pathname || target.path || "" : "";
  const parsed = new URL(req.url, "http://localhost");
  let outgoingPath = options.toProxy ? req.url : parsed.pathname + parsed.search || "";
  outgoingPath = options.ignorePath ? "" : outgoingPath;
  outgoing.path = joinURL(targetPath, outgoingPath);
  if (options.changeOrigin) {
    outgoing.headers.host = requiresPort(outgoing.port, options[forward || "target"].protocol) && !hasPort(outgoing.host) ? outgoing.host + ":" + outgoing.port : outgoing.host;
  }
  return outgoing;
}
function joinURL(base, path) {
  if (!base || base === "/") {
    return path || "/";
  }
  if (!path || path === "/") {
    return base || "/";
  }
  const baseHasTrailing = base[base.length - 1] === "/";
  const pathHasLeading = path[0] === "/";
  if (baseHasTrailing && pathHasLeading) {
    return base + path.slice(1);
  }
  if (!baseHasTrailing && !pathHasLeading) {
    return base + "/" + path;
  }
  return base + path;
}
function setupSocket(socket) {
  socket.setTimeout(0);
  socket.setNoDelay(true);
  socket.setKeepAlive(true, 0);
  return socket;
}
function getPort(req) {
  const res = req.headers.host ? req.headers.host.match(/:(\d+)/) : "";
  if (res) {
    return res[1];
  }
  return hasEncryptedConnection(req) ? "443" : "80";
}
function hasEncryptedConnection(req) {
  return Boolean(req.connection.encrypted || req.connection.pair);
}
function rewriteCookieProperty(header, config, property) {
  if (Array.isArray(header)) {
    return header.map(function(headerElement) {
      return rewriteCookieProperty(headerElement, config, property);
    });
  }
  return header.replace(
    new RegExp(String.raw`(;\s*` + property + "=)([^;]+)", "i"),
    function(match, prefix, previousValue) {
      let newValue;
      if (previousValue in config) {
        newValue = config[previousValue];
      } else if ("*" in config) {
        newValue = config["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function hasPort(host) {
  return !!~host.indexOf(":");
}
function requiresPort(_port, _protocol) {
  const protocol = _protocol.split(":")[0];
  const port = +_port;
  if (!port) return false;
  switch (protocol) {
    case "http":
    case "ws": {
      return port !== 80;
    }
    case "https":
    case "wss": {
      return port !== 443;
    }
    case "ftp": {
      return port !== 21;
    }
    case "gopher": {
      return port !== 70;
    }
    case "file": {
      return false;
    }
  }
  return port !== 0;
}

function defineProxyMiddleware(m) {
  return m;
}
function defineProxyOutgoingMiddleware(m) {
  return m;
}

const redirectRegex = /^201|30([1278])$/;
const removeChunked = defineProxyOutgoingMiddleware((req, res, proxyRes) => {
  if (req.httpVersion === "1.0") {
    delete proxyRes.headers["transfer-encoding"];
  }
});
const setConnection = defineProxyOutgoingMiddleware((req, res, proxyRes) => {
  if (req.httpVersion === "1.0") {
    proxyRes.headers.connection = req.headers.connection || "close";
  } else if (req.httpVersion !== "2.0" && !proxyRes.headers.connection) {
    proxyRes.headers.connection = req.headers.connection || "keep-alive";
  }
});
const setRedirectHostRewrite = defineProxyOutgoingMiddleware(
  (req, res, proxyRes, options) => {
    if ((options.hostRewrite || options.autoRewrite || options.protocolRewrite) && proxyRes.headers.location && redirectRegex.test(String(proxyRes.statusCode))) {
      const target = new URL(options.target);
      const u = new URL(proxyRes.headers.location);
      if (target.host !== u.host) {
        return;
      }
      if (options.hostRewrite) {
        u.host = options.hostRewrite;
      } else if (options.autoRewrite) {
        u.host = req.headers.host;
      }
      if (options.protocolRewrite) {
        u.protocol = options.protocolRewrite;
      }
      proxyRes.headers.location = u.toString();
    }
  }
);
const writeHeaders = defineProxyOutgoingMiddleware(
  (req, res, proxyRes, options) => {
    let rewriteCookieDomainConfig = options.cookieDomainRewrite;
    let rewriteCookiePathConfig = options.cookiePathRewrite;
    const preserveHeaderKeyCase = options.preserveHeaderKeyCase;
    let rawHeaderKeyMap;
    const setHeader = function(key, header) {
      if (header === undefined) {
        return;
      }
      if (rewriteCookieDomainConfig && key.toLowerCase() === "set-cookie") {
        header = rewriteCookieProperty(
          header,
          rewriteCookieDomainConfig,
          "domain"
        );
      }
      if (rewriteCookiePathConfig && key.toLowerCase() === "set-cookie") {
        header = rewriteCookieProperty(header, rewriteCookiePathConfig, "path");
      }
      res.setHeader(String(key).trim(), header);
    };
    if (typeof rewriteCookieDomainConfig === "string") {
      rewriteCookieDomainConfig = { "*": rewriteCookieDomainConfig };
    }
    if (typeof rewriteCookiePathConfig === "string") {
      rewriteCookiePathConfig = { "*": rewriteCookiePathConfig };
    }
    if (preserveHeaderKeyCase && proxyRes.rawHeaders !== undefined) {
      rawHeaderKeyMap = {};
      for (let i = 0; i < proxyRes.rawHeaders.length; i += 2) {
        const key = proxyRes.rawHeaders[i];
        rawHeaderKeyMap[key.toLowerCase()] = key;
      }
    }
    for (let key of Object.keys(proxyRes.headers)) {
      const header = proxyRes.headers[key];
      if (preserveHeaderKeyCase && rawHeaderKeyMap) {
        key = rawHeaderKeyMap[key] || key;
      }
      setHeader(key, header);
    }
  }
);
const writeStatusCode = defineProxyOutgoingMiddleware((req, res, proxyRes) => {
  if (proxyRes.statusMessage) {
    res.statusCode = proxyRes.statusCode;
    res.statusMessage = proxyRes.statusMessage;
  } else {
    res.statusCode = proxyRes.statusCode;
  }
});
const webOutgoingMiddleware = [
  removeChunked,
  setConnection,
  setRedirectHostRewrite,
  writeHeaders,
  writeStatusCode
];

const nativeAgents = { http: http__default, https: https__default };
const deleteLength = defineProxyMiddleware((req) => {
  if ((req.method === "DELETE" || req.method === "OPTIONS") && !req.headers["content-length"]) {
    req.headers["content-length"] = "0";
    delete req.headers["transfer-encoding"];
  }
});
const timeout = defineProxyMiddleware((req, res, options) => {
  if (options.timeout) {
    req.socket.setTimeout(options.timeout);
  }
});
const XHeaders$1 = defineProxyMiddleware((req, res, options) => {
  if (!options.xfwd) {
    return;
  }
  const encrypted = req.isSpdy || hasEncryptedConnection(req);
  const values = {
    for: req.connection.remoteAddress || req.socket.remoteAddress,
    port: getPort(req),
    proto: encrypted ? "https" : "http"
  };
  for (const header of ["for", "port", "proto"]) {
    req.headers["x-forwarded-" + header] = (req.headers["x-forwarded-" + header] || "") + (req.headers["x-forwarded-" + header] ? "," : "") + values[header];
  }
  req.headers["x-forwarded-host"] = req.headers["x-forwarded-host"] || req.headers.host || "";
});
const stream$1 = defineProxyMiddleware(
  (req, res, options, server, head, callback) => {
    server.emit("start", req, res, options.target || options.forward);
    const agents = nativeAgents;
    const http = agents.http;
    const https = agents.https;
    if (options.forward) {
      const forwardReq = (options.forward.protocol === "https:" ? https : http).request(setupOutgoing(options.ssl || {}, options, req, "forward"));
      const forwardError = createErrorHandler(forwardReq, options.forward);
      req.on("error", forwardError);
      forwardReq.on("error", forwardError);
      (options.buffer || req).pipe(forwardReq);
      if (!options.target) {
        res.end();
        return;
      }
    }
    const proxyReq = (options.target.protocol === "https:" ? https : http).request(setupOutgoing(options.ssl || {}, options, req));
    proxyReq.on("socket", (socket) => {
      if (server && !proxyReq.getHeader("expect")) {
        server.emit("proxyReq", proxyReq, req, res, options);
      }
    });
    if (options.proxyTimeout) {
      proxyReq.setTimeout(options.proxyTimeout, function() {
        proxyReq.abort();
      });
    }
    req.on("aborted", function() {
      proxyReq.abort();
    });
    const proxyError = createErrorHandler(proxyReq, options.target);
    req.on("error", proxyError);
    proxyReq.on("error", proxyError);
    function createErrorHandler(proxyReq2, url) {
      return function proxyError2(err) {
        if (req.socket.destroyed && err.code === "ECONNRESET") {
          server.emit("econnreset", err, req, res, url);
          return proxyReq2.abort();
        }
        if (callback) {
          callback(err, req, res, url);
        } else {
          server.emit("error", err, req, res, url);
        }
      };
    }
    (options.buffer || req).pipe(proxyReq);
    proxyReq.on("response", function(proxyRes) {
      if (server) {
        server.emit("proxyRes", proxyRes, req, res);
      }
      if (!res.headersSent && !options.selfHandleResponse) {
        for (const pass of webOutgoingMiddleware) {
          if (pass(req, res, proxyRes, options)) {
            break;
          }
        }
      }
      if (res.finished) {
        if (server) {
          server.emit("end", req, res, proxyRes);
        }
      } else {
        res.on("close", function() {
          proxyRes.destroy();
        });
        proxyRes.on("end", function() {
          if (server) {
            server.emit("end", req, res, proxyRes);
          }
        });
        if (!options.selfHandleResponse) {
          proxyRes.pipe(res);
        }
      }
    });
  }
);
const webIncomingMiddleware = [
  deleteLength,
  timeout,
  XHeaders$1,
  stream$1
];

const checkMethodAndHeader = defineProxyMiddleware((req, socket) => {
  if (req.method !== "GET" || !req.headers.upgrade) {
    socket.destroy();
    return true;
  }
  if (req.headers.upgrade.toLowerCase() !== "websocket") {
    socket.destroy();
    return true;
  }
});
const XHeaders = defineProxyMiddleware((req, socket, options) => {
  if (!options.xfwd) {
    return;
  }
  const values = {
    for: req.connection.remoteAddress || req.socket.remoteAddress,
    port: getPort(req),
    proto: hasEncryptedConnection(req) ? "wss" : "ws"
  };
  for (const header of ["for", "port", "proto"]) {
    req.headers["x-forwarded-" + header] = (req.headers["x-forwarded-" + header] || "") + (req.headers["x-forwarded-" + header] ? "," : "") + values[header];
  }
});
const stream = defineProxyMiddleware(
  (req, socket, options, server, head, callback) => {
    const createHttpHeader = function(line, headers) {
      return Object.keys(headers).reduce(
        function(head2, key) {
          const value = headers[key];
          if (!Array.isArray(value)) {
            head2.push(key + ": " + value);
            return head2;
          }
          for (const element of value) {
            head2.push(key + ": " + element);
          }
          return head2;
        },
        [line]
      ).join("\r\n") + "\r\n\r\n";
    };
    setupSocket(socket);
    if (head && head.length > 0) {
      socket.unshift(head);
    }
    const proxyReq = (isSSL.test(options.target.protocol) ? https__default : http__default).request(setupOutgoing(options.ssl || {}, options, req));
    if (server) {
      server.emit("proxyReqWs", proxyReq, req, socket, options, head);
    }
    proxyReq.on("error", onOutgoingError);
    proxyReq.on("response", function(res) {
      if (!res.upgrade) {
        socket.write(
          createHttpHeader(
            "HTTP/" + res.httpVersion + " " + res.statusCode + " " + res.statusMessage,
            res.headers
          )
        );
        res.pipe(socket);
      }
    });
    proxyReq.on("upgrade", function(proxyRes, proxySocket, proxyHead) {
      proxySocket.on("error", onOutgoingError);
      proxySocket.on("end", function() {
        server.emit("close", proxyRes, proxySocket, proxyHead);
      });
      socket.on("error", function() {
        proxySocket.end();
      });
      setupSocket(proxySocket);
      if (proxyHead && proxyHead.length > 0) {
        proxySocket.unshift(proxyHead);
      }
      socket.write(
        createHttpHeader("HTTP/1.1 101 Switching Protocols", proxyRes.headers)
      );
      proxySocket.pipe(socket).pipe(proxySocket);
      server.emit("open", proxySocket);
      server.emit("proxySocket", proxySocket);
    });
    proxyReq.end();
    function onOutgoingError(err) {
      if (callback) {
        callback(err, req, socket);
      } else {
        server.emit("error", err, req, socket);
      }
      socket.end();
    }
  }
);
const websocketIncomingMiddleware = [
  checkMethodAndHeader,
  XHeaders,
  stream
];

class ProxyServer extends node_events.EventEmitter {
  _server;
  _webPasses = [...webIncomingMiddleware];
  _wsPasses = [...websocketIncomingMiddleware];
  options;
  web;
  ws;
  /**
   * Creates the proxy server with specified options.
   * @param options - Config object passed to the proxy
   */
  constructor(options = {}) {
    super();
    this.options = options || {};
    this.options.prependPath = options.prependPath !== false;
    this.web = _createProxyFn("web", this);
    this.ws = _createProxyFn("ws", this);
  }
  /**
   * A function that wraps the object in a webserver, for your convenience
   * @param port - Port to listen on
   * @param hostname - The hostname to listen on
   */
  listen(port, hostname) {
    const closure = (req, res) => {
      this.web(req, res);
    };
    this._server = this.options.ssl ? https__default.createServer(this.options.ssl, closure) : http__default.createServer(closure);
    if (this.options.ws) {
      this._server.on("upgrade", (req, socket, head) => {
        this._ws(req, socket, head);
      });
    }
    this._server.listen(port, hostname);
    return this;
  }
  /**
   * A function that closes the inner webserver and stops listening on given port
   */
  close(callback) {
    if (this._server) {
      this._server.close((...args) => {
        this._server = undefined;
        if (callback) {
          Reflect.apply(callback, undefined, args);
        }
      });
    }
  }
  before(type, passName, pass) {
    if (type !== "ws" && type !== "web") {
      throw new Error("type must be `web` or `ws`");
    }
    const passes = type === "ws" ? this._wsPasses : this._webPasses;
    let i = false;
    for (const [idx, v] of passes.entries()) {
      if (v.name === passName) {
        i = idx;
      }
    }
    if (i === false) {
      throw new Error("No such pass");
    }
    passes.splice(i, 0, pass);
  }
  after(type, passName, pass) {
    if (type !== "ws" && type !== "web") {
      throw new Error("type must be `web` or `ws`");
    }
    const passes = type === "ws" ? this._wsPasses : this._webPasses;
    let i = false;
    for (const [idx, v] of passes.entries()) {
      if (v.name === passName) {
        i = idx;
      }
    }
    if (i === false) {
      throw new Error("No such pass");
    }
    passes.splice(i++, 0, pass);
  }
}
function createProxyServer(options = {}) {
  return new ProxyServer(options);
}
function _createProxyFn(type, server) {
  return function(req, res, opts, head) {
    const requestOptions = { ...opts, ...server.options };
    for (const key of ["target", "forward"]) {
      if (typeof requestOptions[key] === "string") {
        requestOptions[key] = new URL(requestOptions[key]);
      }
    }
    if (!requestOptions.target && !requestOptions.forward) {
      return this.emit(
        "error",
        new Error("Must provide a proper URL as target")
      );
    }
    let _resolve;
    let _reject;
    const callbackPromise = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    res.on("close", () => {
      _resolve();
    });
    res.on("error", (error) => {
      _reject(error);
    });
    for (const pass of type === "ws" ? server._wsPasses : server._webPasses) {
      const stop = pass(
        req,
        res,
        requestOptions,
        server,
        head,
        (error) => {
          _reject(error);
        }
      );
      if (stop) {
        _resolve();
        break;
      }
    }
    return callbackPromise;
  };
}

exports.ProxyServer = ProxyServer;
exports.createProxyServer = createProxyServer;
