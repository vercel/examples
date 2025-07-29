import * as stream from 'node:stream';
import http, { IncomingMessage, OutgoingMessage } from 'node:http';
import { EventEmitter } from 'node:events';

interface ProxyTargetDetailed {
    host: string;
    port: number;
    protocol?: string;
    hostname?: string;
    socketPath?: string;
    key?: string;
    passphrase?: string;
    pfx?: Buffer | string;
    cert?: string;
    ca?: string;
    ciphers?: string;
    secureProtocol?: string;
}
type ProxyTarget = ProxyTargetUrl | ProxyTargetDetailed;
type ProxyTargetUrl = string | Partial<URL>;
interface ProxyServerOptions {
    /** URL string to be parsed with the url module. */
    target?: ProxyTarget;
    /** URL string to be parsed with the url module. */
    forward?: ProxyTargetUrl;
    /** Object to be passed to http(s).request. */
    agent?: any;
    /** Object to be passed to https.createServer(). */
    ssl?: any;
    /** If you want to proxy websockets. */
    ws?: boolean;
    /** Adds x- forward headers. */
    xfwd?: boolean;
    /** Verify SSL certificate. */
    secure?: boolean;
    /** Explicitly specify if we are proxying to another proxy. */
    toProxy?: boolean;
    /** Specify whether you want to prepend the target's path to the proxy path. */
    prependPath?: boolean;
    /** Specify whether you want to ignore the proxy path of the incoming request. */
    ignorePath?: boolean;
    /** Local interface string to bind for outgoing connections. */
    localAddress?: string;
    /** Changes the origin of the host header to the target URL. */
    changeOrigin?: boolean;
    /** specify whether you want to keep letter case of response header key */
    preserveHeaderKeyCase?: boolean;
    /** Basic authentication i.e. 'user:password' to compute an Authorization header. */
    auth?: string;
    /** Rewrites the location hostname on (301 / 302 / 307 / 308) redirects, Default: null. */
    hostRewrite?: string;
    /** Rewrites the location host/ port on (301 / 302 / 307 / 308) redirects based on requested host/ port.Default: false. */
    autoRewrite?: boolean;
    /** Rewrites the location protocol on (301 / 302 / 307 / 308) redirects to 'http' or 'https'.Default: null. */
    protocolRewrite?: string;
    /** Rewrites domain of set-cookie headers. */
    cookieDomainRewrite?: false | string | {
        [oldDomain: string]: string;
    };
    /** Rewrites path of set-cookie headers. Default: false */
    cookiePathRewrite?: false | string | {
        [oldPath: string]: string;
    };
    /** Object with extra headers to be added to target requests. */
    headers?: {
        [header: string]: string;
    };
    /** Timeout (in milliseconds) when proxy receives no response from target. Default: 120000 (2 minutes) */
    proxyTimeout?: number;
    /** Timeout (in milliseconds) for incoming requests */
    timeout?: number;
    /** If set to true, none of the webOutgoing passes are called and it's your responsibility to appropriately return the response by listening and acting on the proxyRes event */
    selfHandleResponse?: boolean;
    /** Buffer */
    buffer?: stream.Stream;
}

type ProxyMiddleware = (req: IncomingMessage, res: OutgoingMessage, opts: ProxyServerOptions & {
    target: URL;
    forward: URL;
}, server?: ProxyServer, head?: Buffer, callback?: (err: any, req: IncomingMessage, socket: OutgoingMessage, url?: any) => void) => void | true;

declare class ProxyServer extends EventEmitter {
    private _server?;
    _webPasses: ProxyMiddleware[];
    _wsPasses: ProxyMiddleware[];
    options: ProxyServerOptions;
    web: (req: http.IncomingMessage, res: http.OutgoingMessage, opts?: ProxyServerOptions, head?: any) => Promise<void>;
    ws: (req: http.IncomingMessage, socket: http.OutgoingMessage, opts: ProxyServerOptions, head?: any) => Promise<void>;
    /**
     * Creates the proxy server with specified options.
     * @param options - Config object passed to the proxy
     */
    constructor(options?: ProxyServerOptions);
    /**
     * A function that wraps the object in a webserver, for your convenience
     * @param port - Port to listen on
     * @param hostname - The hostname to listen on
     */
    listen(port: number, hostname: string): this;
    /**
     * A function that closes the inner webserver and stops listening on given port
     */
    close(callback: () => void): void;
    before(type: "ws" | "web", passName: string, pass: ProxyMiddleware): void;
    after(type: "ws" | "web", passName: string, pass: ProxyMiddleware): void;
}
/**
 * Creates the proxy server.
 *
 * Examples:
 *
 *    httpProxy.createProxyServer({ .. }, 8000)
 *    // => '{ web: [Function], ws: [Function] ... }'
 *
 * @param {Object} Options Config object passed to the proxy
 *
 * @return {Object} Proxy Proxy object with handlers for `ws` and `web` requests
 *
 * @api public
 */
declare function createProxyServer(options?: ProxyServerOptions): ProxyServer;

export { ProxyServer, type ProxyServerOptions, type ProxyTargetDetailed, createProxyServer };
