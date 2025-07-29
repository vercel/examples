"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillDecompressionStream = void 0;
const node_zlib_1 = require("node:zlib");
const TransformStream_js_1 = require("./TransformStream.js");
class PonyfillDecompressionStream extends TransformStream_js_1.PonyfillTransformStream {
    static supportedFormats = globalThis.process?.version?.startsWith('v2')
        ? ['gzip', 'deflate', 'br']
        : ['gzip', 'deflate', 'deflate-raw', 'br'];
    constructor(compressionFormat) {
        switch (compressionFormat) {
            case 'x-gzip':
            case 'gzip':
                super((0, node_zlib_1.createGunzip)());
                break;
            case 'x-deflate':
            case 'deflate':
                super((0, node_zlib_1.createInflate)());
                break;
            case 'deflate-raw':
                super((0, node_zlib_1.createInflateRaw)());
                break;
            case 'br':
                super((0, node_zlib_1.createBrotliDecompress)());
                break;
            default:
                throw new TypeError(`Unsupported compression format: '${compressionFormat}'`);
        }
    }
}
exports.PonyfillDecompressionStream = PonyfillDecompressionStream;
