import { notImplemented } from "../../_internal/utils.mjs";
export const ReadableStream = globalThis.ReadableStream || /* @__PURE__ */ notImplemented("stream.web.ReadableStream");
export const ReadableStreamDefaultReader = globalThis.ReadableStreamDefaultReader || /* @__PURE__ */ notImplemented("stream.web.ReadableStreamDefaultReader");
// @ts-ignore
export const ReadableStreamBYOBReader = globalThis.ReadableStreamBYOBReader || /* @__PURE__ */ notImplemented("stream.web.ReadableStreamBYOBReader");
// @ts-ignore
export const ReadableStreamBYOBRequest = globalThis.ReadableStreamBYOBRequest || /* @__PURE__ */ notImplemented("stream.web.ReadableStreamBYOBRequest");
// @ts-ignore
export const ReadableByteStreamController = globalThis.ReadableByteStreamController || /* @__PURE__ */ notImplemented("stream.web.ReadableByteStreamController");
export const ReadableStreamDefaultController = globalThis.ReadableStreamDefaultController || /* @__PURE__ */ notImplemented("stream.web.ReadableStreamDefaultController");
export const TransformStream = globalThis.TransformStream || /* @__PURE__ */ notImplemented("stream.web.TransformStream");
export const TransformStreamDefaultController = globalThis.TransformStreamDefaultController || /* @__PURE__ */ notImplemented("stream.web.TransformStreamDefaultController");
export const WritableStream = globalThis.WritableStream || /* @__PURE__ */ notImplemented("stream.web.WritableStream");
export const WritableStreamDefaultWriter = globalThis.WritableStreamDefaultWriter || /* @__PURE__ */ notImplemented("stream.web.WritableStreamDefaultWriter");
export const WritableStreamDefaultController = globalThis.WritableStreamDefaultController || /* @__PURE__ */ notImplemented("stream.web.WritableStreamDefaultController");
export const ByteLengthQueuingStrategy = globalThis.ByteLengthQueuingStrategy || /* @__PURE__ */ notImplemented("stream.web.ByteLengthQueuingStrategy");
export const CountQueuingStrategy = globalThis.CountQueuingStrategy || /* @__PURE__ */ notImplemented("stream.web.CountQueuingStrategy");
export const TextEncoderStream = globalThis.TextEncoderStream || /* @__PURE__ */ notImplemented("stream.web.TextEncoderStream");
export const TextDecoderStream = globalThis.TextDecoderStream || /* @__PURE__ */ notImplemented("stream.web.TextDecoderStream");
export const DecompressionStream = globalThis.DecompressionStream || /* @__PURE__ */ notImplemented("stream.web.DecompressionStream");
export const CompressionStream = globalThis.DecompressionStream || /* @__PURE__ */ notImplemented("stream.web.CompressionStream");
// @ts-ignore
export default {
	ReadableStream,
	ReadableStreamDefaultReader,
	ReadableStreamBYOBReader,
	ReadableStreamBYOBRequest,
	ReadableByteStreamController,
	ReadableStreamDefaultController,
	TransformStream,
	TransformStreamDefaultController,
	WritableStream,
	WritableStreamDefaultWriter,
	WritableStreamDefaultController,
	ByteLengthQueuingStrategy,
	CountQueuingStrategy,
	TextEncoderStream,
	TextDecoderStream,
	DecompressionStream,
	CompressionStream
};
