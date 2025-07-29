import { createBrotliCompress, createDeflate, createDeflateRaw, createGzip } from 'node:zlib';
import { PonyfillTransformStream } from './TransformStream.js';
export class PonyfillCompressionStream extends PonyfillTransformStream {
    static supportedFormats = globalThis.process?.version?.startsWith('v2')
        ? ['gzip', 'deflate', 'br']
        : ['gzip', 'deflate', 'deflate-raw', 'br'];
    constructor(compressionFormat) {
        switch (compressionFormat) {
            case 'x-gzip':
            case 'gzip':
                super(createGzip());
                break;
            case 'x-deflate':
            case 'deflate':
                super(createDeflate());
                break;
            case 'deflate-raw':
                super(createDeflateRaw());
                break;
            case 'br':
                super(createBrotliCompress());
                break;
            default:
                throw new Error(`Unsupported compression format: ${compressionFormat}`);
        }
    }
}
