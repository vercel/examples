const fetch = globalThis.fetch;
const Headers = globalThis.Headers;
const Request = globalThis.Request;
const Response = globalThis.Response;
const FormData = globalThis.FormData;
const ReadableStream = globalThis.ReadableStream;
const WritableStream = globalThis.WritableStream;
const TransformStream = globalThis.TransformStream;
const CompressionStream = globalThis.CompressionStream;
const DecompressionStream = globalThis.DecompressionStream;
const TextDecoderStream = globalThis.TextDecoderStream;
const TextEncoderStream = globalThis.TextEncoderStream;
const Blob = globalThis.Blob;
const File = globalThis.File;
const crypto = globalThis.crypto;
const btoa = globalThis.btoa;
const TextEncoder = globalThis.TextEncoder;
const TextDecoder = globalThis.TextDecoder;
const URLPattern = globalThis.URLPattern;
const URL = globalThis.URL;
const URLSearchParams = globalThis.URLSearchParams;

export {
    fetch,
    Headers,
    Request,
    Response,
    FormData,
    ReadableStream,
    WritableStream,
    TransformStream,
    CompressionStream,
    DecompressionStream,
    TextDecoderStream,
    TextEncoderStream,
    Blob,
    File,
    crypto,
    btoa,
    TextEncoder,
    TextDecoder,
    URLPattern,
    URL,
    URLSearchParams
}

export function createFetch() {
    return {
    fetch,
    Headers,
    Request,
    Response,
    FormData,
    ReadableStream,
    WritableStream,
    TransformStream,
    CompressionStream,
    DecompressionStream,
    TextDecoderStream,
    TextEncoderStream,
    Blob,
    File,
    crypto,
    btoa,
    TextEncoder,
    TextDecoder,
    URLPattern,
    URL,
    URLSearchParams
    };
}