import type nodeConsole from "node:console";
import { Writable } from "node:stream";
// undocumented public APIs
export declare const _ignoreErrors: boolean;
export declare const _stderr: Writable;
export declare const _stdout: Writable;
export declare const log: typeof nodeConsole.log;
export declare const info: typeof nodeConsole.info;
export declare const trace: typeof nodeConsole.trace;
export declare const debug: typeof nodeConsole.debug;
export declare const table: typeof nodeConsole.table;
export declare const error: typeof nodeConsole.error;
export declare const warn: typeof nodeConsole.warn;
// https://developer.chrome.com/docs/devtools/console/api#createtask
export declare const createTask: unknown;
export declare const assert: typeof nodeConsole.assert;
// noop
export declare const clear: typeof nodeConsole.clear;
export declare const count: typeof nodeConsole.count;
export declare const countReset: typeof nodeConsole.countReset;
export declare const dir: typeof nodeConsole.dir;
export declare const dirxml: typeof nodeConsole.dirxml;
export declare const group: typeof nodeConsole.group;
export declare const groupEnd: typeof nodeConsole.groupEnd;
export declare const groupCollapsed: typeof nodeConsole.groupCollapsed;
export declare const profile: typeof nodeConsole.profile;
export declare const profileEnd: typeof nodeConsole.profileEnd;
export declare const time: typeof nodeConsole.time;
export declare const timeEnd: typeof nodeConsole.timeEnd;
export declare const timeLog: typeof nodeConsole.timeLog;
export declare const timeStamp: typeof nodeConsole.timeStamp;
export declare const Console: typeof nodeConsole.Console;
export declare const _times: unknown;
export declare function context();
export declare const _stdoutErrorHandler: unknown;
export declare const _stderrErrorHandler: unknown;
declare const _default: {};
export default _default;
