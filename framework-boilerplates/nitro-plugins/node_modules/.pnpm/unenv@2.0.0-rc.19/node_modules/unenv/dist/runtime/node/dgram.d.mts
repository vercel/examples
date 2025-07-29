import type nodeDgram from "node:dgram";
export { Socket } from "./internal/dgram/socket.mjs";
export declare const _createSocketHandle: unknown;
export declare const createSocket: typeof nodeDgram.createSocket;
declare const _default: typeof nodeDgram;
export default _default;
