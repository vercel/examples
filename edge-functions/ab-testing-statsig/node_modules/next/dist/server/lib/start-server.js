"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.startServer = startServer;
var _log = require("../../build/output/log");
var _http = _interopRequireDefault(require("http"));
var _next = _interopRequireDefault(require("../next"));
var _cluster = _interopRequireDefault(require("cluster"));
var _v8 = _interopRequireDefault(require("v8"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const MAXIMUM_HEAP_SIZE_ALLOWED = _v8.default.getHeapStatistics().heap_size_limit / 1024 / 1024 * 0.9;
function startServer(opts) {
    let requestHandler;
    const server = _http.default.createServer((req, res)=>{
        return requestHandler(req, res).finally(()=>{
            if (_cluster.default.worker && process.memoryUsage().heapUsed / 1024 / 1024 > MAXIMUM_HEAP_SIZE_ALLOWED) {
                _cluster.default.worker.kill();
            }
        });
    });
    if (opts.keepAliveTimeout) {
        server.keepAliveTimeout = opts.keepAliveTimeout;
    }
    return new Promise((resolve, reject)=>{
        let port = opts.port;
        let retryCount = 0;
        server.on("error", (err)=>{
            if (port && opts.allowRetry && err.code === "EADDRINUSE" && retryCount < 10) {
                (0, _log).warn(`Port ${port} is in use, trying ${port + 1} instead.`);
                port += 1;
                retryCount += 1;
                server.listen(port, opts.hostname);
            } else {
                reject(err);
            }
        });
        let upgradeHandler;
        if (!opts.dev) {
            server.on("upgrade", (req, socket, upgrade)=>{
                upgradeHandler(req, socket, upgrade);
            });
        }
        server.on("listening", ()=>{
            const addr = server.address();
            const hostname = !opts.hostname || opts.hostname === "0.0.0.0" ? "localhost" : opts.hostname;
            const app = (0, _next).default({
                ...opts,
                hostname,
                customServer: false,
                httpServer: server,
                port: addr && typeof addr === "object" ? addr.port : port
            });
            requestHandler = app.getRequestHandler();
            upgradeHandler = app.getUpgradeHandler();
            resolve(app);
        });
        server.listen(port, opts.hostname);
    });
}

//# sourceMappingURL=start-server.js.map