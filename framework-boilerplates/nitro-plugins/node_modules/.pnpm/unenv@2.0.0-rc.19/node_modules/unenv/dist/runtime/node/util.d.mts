// https://nodejs.org/api/util.html
import type nodeUtil from "node:util";
export { MIMEParams, MIMEType } from "./internal/util/mime.mjs";
export * from "./internal/util/legacy-types.mjs";
export * from "./internal/util/log.mjs";
export { inherits } from "./internal/util/inherits.mjs";
export { promisify } from "./internal/util/promisify.mjs";
export { default as types } from "node:util/types";
// @ts-expect-error
export declare const TextDecoder: typeof nodeUtil.TextDecoder;
export declare const TextEncoder: typeof nodeUtil.TextEncoder;
export declare const deprecate: typeof nodeUtil.deprecate;
export declare const _errnoException: unknown;
export declare const _exceptionWithHostPort: unknown;
export declare const _extend: unknown;
export declare const aborted: unknown;
export declare const callbackify: unknown;
export declare const getSystemErrorMap: unknown;
export declare const getSystemErrorName: unknown;
export declare const toUSVString: unknown;
export declare const stripVTControlCharacters: unknown;
export declare const transferableAbortController: unknown;
export declare const transferableAbortSignal: unknown;
export declare const parseArgs: unknown;
export declare const parseEnv: unknown;
export declare const styleText: unknown;
/** @deprecated */
export declare const getCallSite: unknown;
export declare const getCallSites: unknown;
export declare const getSystemErrorMessage: unknown;
declare const _default: {};
export default _default;
