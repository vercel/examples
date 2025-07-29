// https://nodejs.org/api/net.html
import type nodeNet from "node:net";
export { Server } from "./internal/net/server.mjs";
// require('node:net').Socket === require('node:net').Stream
export { Socket, SocketAddress, Socket as Stream } from "./internal/net/socket.mjs";
export declare const createServer: typeof nodeNet.createServer;
export declare const BlockList: typeof nodeNet.BlockList;
export declare const connect: typeof nodeNet.connect;
export declare const createConnection: typeof nodeNet.createConnection;
export declare const getDefaultAutoSelectFamily: typeof nodeNet.getDefaultAutoSelectFamily;
export declare const setDefaultAutoSelectFamily: typeof nodeNet.setDefaultAutoSelectFamily;
export declare const getDefaultAutoSelectFamilyAttemptTimeout: typeof nodeNet.getDefaultAutoSelectFamilyAttemptTimeout;
export declare const setDefaultAutoSelectFamilyAttemptTimeout: typeof nodeNet.setDefaultAutoSelectFamilyAttemptTimeout;
export declare const isIPv4: typeof nodeNet.isIPv4;
export declare const isIPv6: typeof nodeNet.isIPv6;
export declare const isIP: typeof nodeNet.isIP;
// --- internal ---
export declare const _createServerHandle: unknown;
export declare const _normalizeArgs: unknown;
export declare const _setSimultaneousAccepts: unknown;
declare const exports: typeof nodeNet;
export default exports;
