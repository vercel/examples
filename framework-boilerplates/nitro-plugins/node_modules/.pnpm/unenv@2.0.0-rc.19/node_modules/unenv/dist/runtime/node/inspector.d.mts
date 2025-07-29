import type nodeInspector from "node:inspector";
export declare const close: typeof nodeInspector.close;
export declare const console: nodeInspector.InspectorConsole;
export declare const open: typeof nodeInspector.open;
export declare const url: typeof nodeInspector.url;
export declare const waitForDebugger: typeof nodeInspector.waitForDebugger;
// `node:inspector` and `node:inspector/promises` share the same implementation with only Session being in the promises module:
// https://github.com/nodejs/node/blob/main/lib/inspector/promises.js
export declare const Session: typeof nodeInspector.Session;
export declare const Network: typeof nodeInspector.Network;
declare const _default: {};
export default _default;
