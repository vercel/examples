import { notImplemented, notImplementedClass } from "../_internal/utils.mjs";
import { Readable } from "./internal/stream/readable.mjs";
import { Writable } from "./internal/stream/writable.mjs";
import { Duplex } from "./internal/stream/duplex.mjs";
import { Transform } from "./internal/stream/transform.mjs";
import promises from "node:stream/promises";
export { promises };
export { Readable } from "./internal/stream/readable.mjs";
export { Writable } from "./internal/stream/writable.mjs";
export { Duplex } from "./internal/stream/duplex.mjs";
export { Transform } from "./internal/stream/transform.mjs";
export const Stream = /* @__PURE__ */ notImplementedClass("stream.Stream");
export const PassThrough = /* @__PURE__ */ notImplementedClass("PassThrough");
export const pipeline = /* @__PURE__ */ notImplemented("stream.pipeline");
export const finished = /* @__PURE__ */ notImplemented("stream.finished");
export const addAbortSignal = /* @__PURE__ */ notImplemented("stream.addAbortSignal");
export const isDisturbed = /* @__PURE__ */ notImplemented("stream.isDisturbed");
export const isReadable = /* @__PURE__ */ notImplemented("stream.isReadable");
export const compose = /* @__PURE__ */ notImplemented("stream.compose");
export const isErrored = /* @__PURE__ */ notImplemented("stream.isErrored");
export const destroy = /* @__PURE__ */ notImplemented("stream.destroy");
export const _isUint8Array = /* @__PURE__ */ notImplemented("stream._isUint8Array");
export const _uint8ArrayToBuffer = /* @__PURE__ */ notImplemented("stream._uint8ArrayToBuffer");
export const _isArrayBufferView = /* @__PURE__ */ notImplemented("stream._isArrayBufferView");
export const duplexPair = /* @__PURE__ */ notImplemented("stream.duplexPair");
export const getDefaultHighWaterMark = /* @__PURE__ */ notImplemented("stream.getDefaultHighWaterMark");
export const isDestroyed = /* @__PURE__ */ notImplemented("stream.isDestroyed");
export const isWritable = /* @__PURE__ */ notImplemented("stream.isWritable");
export const setDefaultHighWaterMark = /* @__PURE__ */ notImplemented("stream.setDefaultHighWaterMark");
export default {
	Readable,
	Writable,
	Duplex,
	Transform,
	Stream,
	PassThrough,
	pipeline,
	finished,
	addAbortSignal,
	promises,
	isDisturbed,
	isReadable,
	compose,
	_uint8ArrayToBuffer,
	isErrored,
	destroy,
	_isUint8Array,
	_isArrayBufferView,
	duplexPair,
	getDefaultHighWaterMark,
	isDestroyed,
	isWritable,
	setDefaultHighWaterMark
};
