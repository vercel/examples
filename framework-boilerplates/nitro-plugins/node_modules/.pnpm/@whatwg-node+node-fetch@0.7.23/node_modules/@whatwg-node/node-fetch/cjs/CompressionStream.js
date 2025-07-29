"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillCompressionStream = void 0;
const node_zlib_1 = require("node:zlib");
const TransformStream_js_1 = require("./TransformStream.js");
class PonyfillCompressionStream extends TransformStream_js_1.PonyfillTransformStream {
    static supportedFormats = globalThis.process?.version?.startsWith('v2')
        ? ['gzip', 'deflate', 'br']
        : ['gzip', 'deflate', 'deflate-raw', 'br'];
    constructor(compressionFormat) {
        switch (compressionFormat) {
            case 'x-gzip':
            case 'gzip':
                super((0, node_zlib_1.createGzip)());
                break;
            case 'x-deflate':
            case 'deflate':
                super((0, node_zlib_1.createDeflate)());
                break;
            case 'deflate-raw':
                super((0, node_zlib_1.createDeflateRaw)());
                break;
            case 'br':
                super((0, node_zlib_1.createBrotliCompress)());
                break;
            default:
                throw new Error(`Unsupported compression format: ${compressionFormat}`);
        }
    }
}
exports.PonyfillCompressionStream = PonyfillCompressionStream;
