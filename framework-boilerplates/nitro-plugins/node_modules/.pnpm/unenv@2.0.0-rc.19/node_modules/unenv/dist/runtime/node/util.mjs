import types from "node:util/types";
import { notImplemented } from "../_internal/utils.mjs";
import { inherits } from "./internal/util/inherits.mjs";
import { promisify } from "./internal/util/promisify.mjs";
import { MIMEParams, MIMEType } from "./internal/util/mime.mjs";
import { isArray, isBoolean, isBuffer, isDate, isDeepStrictEqual, isError, isFunction, isNull, isNullOrUndefined, isNumber, isObject, isPrimitive, isRegExp, isString, isSymbol, isUndefined } from "./internal/util/legacy-types.mjs";
import { debug, debuglog, format, formatWithOptions, inspect, log } from "./internal/util/log.mjs";
export { MIMEParams, MIMEType } from "./internal/util/mime.mjs";
export * from "./internal/util/legacy-types.mjs";
export * from "./internal/util/log.mjs";
export { inherits } from "./internal/util/inherits.mjs";
export { promisify } from "./internal/util/promisify.mjs";
export { default as types } from "node:util/types";
// @ts-expect-error
export const TextDecoder = globalThis.TextDecoder;
export const TextEncoder = globalThis.TextEncoder;
export const deprecate = (fn) => fn;
export const _errnoException = /* @__PURE__ */ notImplemented("util._errnoException");
export const _exceptionWithHostPort = /* @__PURE__ */ notImplemented("util._exceptionWithHostPort");
export const _extend = /* @__PURE__ */ notImplemented("util._extend");
export const aborted = /* @__PURE__ */ notImplemented("util.aborted");
export const callbackify = /* @__PURE__ */ notImplemented("util.callbackify");
export const getSystemErrorMap = /* @__PURE__ */ notImplemented("util.getSystemErrorMap");
export const getSystemErrorName = /* @__PURE__ */ notImplemented("util.getSystemErrorName");
export const toUSVString = /* @__PURE__ */ notImplemented("util.toUSVString");
export const stripVTControlCharacters = /* @__PURE__ */ notImplemented("util.stripVTControlCharacters");
export const transferableAbortController = /* @__PURE__ */ notImplemented("util.transferableAbortController");
export const transferableAbortSignal = /* @__PURE__ */ notImplemented("util.transferableAbortSignal");
export const parseArgs = /* @__PURE__ */ notImplemented("util.parseArgs");
export const parseEnv = /* @__PURE__ */ notImplemented("util.parseEnv");
export const styleText = /* @__PURE__ */ notImplemented("util.styleText");
/** @deprecated */
export const getCallSite = /* @__PURE__ */ notImplemented("util.getCallSite");
export const getCallSites = /* @__PURE__ */ notImplemented("util.getCallSites");
export const getSystemErrorMessage = /* @__PURE__ */ notImplemented("util.getSystemErrorMessage");
export default {
	_errnoException,
	_exceptionWithHostPort,
	_extend,
	aborted,
	callbackify,
	deprecate,
	getCallSite,
	getCallSites,
	getSystemErrorMessage,
	getSystemErrorMap,
	getSystemErrorName,
	inherits,
	promisify,
	stripVTControlCharacters,
	toUSVString,
	TextDecoder,
	TextEncoder,
	types,
	transferableAbortController,
	transferableAbortSignal,
	parseArgs,
	parseEnv,
	styleText,
	MIMEParams,
	MIMEType,
	isArray,
	isBoolean,
	isBuffer,
	isDate,
	isDeepStrictEqual,
	isError,
	isFunction,
	isNull,
	isNullOrUndefined,
	isNumber,
	isObject,
	isPrimitive,
	isRegExp,
	isString,
	isSymbol,
	isUndefined,
	debug,
	debuglog,
	format,
	formatWithOptions,
	inspect,
	log
};
