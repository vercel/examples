import "./node-polyfill-fetch";
import * as log from "../build/output/log";
import loadConfig from "./config";
import { resolve } from "path";
import { NON_STANDARD_NODE_ENV } from "../lib/constants";
import { PHASE_DEVELOPMENT_SERVER } from "../shared/lib/constants";
import { PHASE_PRODUCTION_SERVER } from "../shared/lib/constants";
import { loadRequireHook, overrideBuiltInReactPackages } from "../build/webpack/require-hook";
loadRequireHook();
let ServerImpl;
const getServerImpl = async ()=>{
    if (ServerImpl === undefined) {
        ServerImpl = (await Promise.resolve(require("./next-server"))).default;
    }
    return ServerImpl;
};
export class NextServer {
    constructor(options){
        this.options = options;
    }
    get hostname() {
        return this.options.hostname;
    }
    get port() {
        return this.options.port;
    }
    getRequestHandler() {
        return async (req, res, parsedUrl)=>{
            const requestHandler = await this.getServerRequestHandler();
            return requestHandler(req, res, parsedUrl);
        };
    }
    getUpgradeHandler() {
        return async (req, socket, head)=>{
            const server = await this.getServer();
            // @ts-expect-error we mark this as protected so it
            // causes an error here
            return server.handleUpgrade.apply(server, [
                req,
                socket,
                head
            ]);
        };
    }
    setAssetPrefix(assetPrefix) {
        if (this.server) {
            this.server.setAssetPrefix(assetPrefix);
        } else {
            this.preparedAssetPrefix = assetPrefix;
        }
    }
    logError(...args) {
        if (this.server) {
            this.server.logError(...args);
        }
    }
    async render(...args) {
        const server = await this.getServer();
        return server.render(...args);
    }
    async renderToHTML(...args) {
        const server = await this.getServer();
        return server.renderToHTML(...args);
    }
    async renderError(...args) {
        const server = await this.getServer();
        return server.renderError(...args);
    }
    async renderErrorToHTML(...args) {
        const server = await this.getServer();
        return server.renderErrorToHTML(...args);
    }
    async render404(...args) {
        const server = await this.getServer();
        return server.render404(...args);
    }
    async serveStatic(...args) {
        const server = await this.getServer();
        return server.serveStatic(...args);
    }
    async prepare() {
        const server = await this.getServer();
        return server.prepare();
    }
    async close() {
        const server = await this.getServer();
        return server.close();
    }
    async createServer(options) {
        if (options.dev) {
            const DevServer = require("./dev/next-dev-server").default;
            return new DevServer(options);
        }
        const ServerImplementation = await getServerImpl();
        return new ServerImplementation(options);
    }
    async loadConfig() {
        return loadConfig(this.options.dev ? PHASE_DEVELOPMENT_SERVER : PHASE_PRODUCTION_SERVER, resolve(this.options.dir || "."), this.options.conf);
    }
    async getServer() {
        if (!this.serverPromise) {
            this.serverPromise = this.loadConfig().then(async (conf)=>{
                if (conf.experimental.appDir) {
                    process.env.NEXT_PREBUNDLED_REACT = "1";
                    overrideBuiltInReactPackages();
                }
                this.server = await this.createServer({
                    ...this.options,
                    conf
                });
                if (this.preparedAssetPrefix) {
                    this.server.setAssetPrefix(this.preparedAssetPrefix);
                }
                return this.server;
            });
        }
        return this.serverPromise;
    }
    async getServerRequestHandler() {
        // Memoize request handler creation
        if (!this.reqHandlerPromise) {
            this.reqHandlerPromise = this.getServer().then((server)=>server.getRequestHandler().bind(server));
        }
        return this.reqHandlerPromise;
    }
}
// This file is used for when users run `require('next')`
function createServer(options) {
    // The package is used as a TypeScript plugin.
    if (options && "typescript" in options && "version" in options.typescript) {
        return require("./next-typescript").createTSPlugin(options);
    }
    if (options == null) {
        throw new Error("The server has not been instantiated properly. https://nextjs.org/docs/messages/invalid-server-options");
    }
    if (!("isNextDevCommand" in options) && process.env.NODE_ENV && ![
        "production",
        "development",
        "test"
    ].includes(process.env.NODE_ENV)) {
        log.warn(NON_STANDARD_NODE_ENV);
    }
    if (options.dev && typeof options.dev !== "boolean") {
        console.warn("Warning: 'dev' is not a boolean which could introduce unexpected behavior. https://nextjs.org/docs/messages/invalid-server-options");
    }
    return new NextServer(options);
}
// Support commonjs `require('next')`
module.exports = createServer;
exports = module.exports;
// Support `import next from 'next'`
export default createServer;

//# sourceMappingURL=next.js.map