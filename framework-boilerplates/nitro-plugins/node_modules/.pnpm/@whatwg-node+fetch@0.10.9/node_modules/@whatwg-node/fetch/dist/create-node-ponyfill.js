const shouldSkipPonyfill = require('./shouldSkipPonyfill');
let newNodeFetch;

module.exports = function createNodePonyfill(opts = {}) {
  const ponyfills = {};
  
  ponyfills.URLPattern = globalThis.URLPattern;

  // We call this previously to patch `Bun`
  if (!ponyfills.URLPattern) {
    const urlPatternModule = require('urlpattern-polyfill');
    ponyfills.URLPattern = urlPatternModule.URLPattern;
  }

  if (opts.skipPonyfill || shouldSkipPonyfill()) {
    return {
      fetch: globalThis.fetch,
      Headers: globalThis.Headers,
      Request: globalThis.Request,
      Response: globalThis.Response,
      FormData: globalThis.FormData,
      ReadableStream: globalThis.ReadableStream,
      WritableStream: globalThis.WritableStream,
      TransformStream: globalThis.TransformStream,
      CompressionStream: globalThis.CompressionStream,
      DecompressionStream: globalThis.DecompressionStream,
      TextDecoderStream: globalThis.TextDecoderStream,
      TextEncoderStream: globalThis.TextEncoderStream,
      Blob: globalThis.Blob,
      File: globalThis.File,
      crypto: globalThis.crypto,
      btoa: globalThis.btoa,
      TextEncoder: globalThis.TextEncoder,
      TextDecoder: globalThis.TextDecoder,
      URLPattern: ponyfills.URLPattern,
      URL: globalThis.URL,
      URLSearchParams: globalThis.URLSearchParams
    };
  }

  newNodeFetch ||= require('@whatwg-node/node-fetch');

  ponyfills.fetch = newNodeFetch.fetch;
  ponyfills.Request = newNodeFetch.Request;
  ponyfills.Response = newNodeFetch.Response;
  ponyfills.Headers = newNodeFetch.Headers;
  ponyfills.FormData = newNodeFetch.FormData;
  ponyfills.ReadableStream = newNodeFetch.ReadableStream;

  ponyfills.URL = newNodeFetch.URL;
  ponyfills.URLSearchParams = newNodeFetch.URLSearchParams;

  ponyfills.WritableStream = newNodeFetch.WritableStream;
  ponyfills.TransformStream = newNodeFetch.TransformStream;
  ponyfills.CompressionStream = newNodeFetch.CompressionStream;
  ponyfills.DecompressionStream = newNodeFetch.DecompressionStream;
  ponyfills.TextDecoderStream = newNodeFetch.TextDecoderStream;
  ponyfills.TextEncoderStream = newNodeFetch.TextEncoderStream;

  ponyfills.Blob = newNodeFetch.Blob;
  ponyfills.File = newNodeFetch.File;
  ponyfills.crypto = globalThis.crypto;
  ponyfills.btoa = newNodeFetch.btoa;
  ponyfills.TextEncoder = newNodeFetch.TextEncoder;
  ponyfills.TextDecoder = newNodeFetch.TextDecoder;

  if (opts.formDataLimits) {
    ponyfills.Body = class Body extends newNodeFetch.Body {
      constructor(body, userOpts) {
        super(body, {
          formDataLimits: opts.formDataLimits,
          ...userOpts,
        });
      }
    }
    ponyfills.Request = class Request extends newNodeFetch.Request {
      constructor(input, userOpts) {
        super(input, {
          formDataLimits: opts.formDataLimits,
          ...userOpts,
        });
      }
    }
    ponyfills.Response = class Response extends newNodeFetch.Response {
      constructor(body, userOpts) {
        super(body, {
          formDataLimits: opts.formDataLimits,
          ...userOpts,
        });
      }
    }
  }

  if (!ponyfills.crypto) {
    const cryptoModule = require("crypto");
    ponyfills.crypto = cryptoModule.webcrypto;
  }

  return ponyfills;
}
