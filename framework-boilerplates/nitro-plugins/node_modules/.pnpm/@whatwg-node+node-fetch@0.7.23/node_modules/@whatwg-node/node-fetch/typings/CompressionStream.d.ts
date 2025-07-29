import { PonyfillTransformStream } from './TransformStream.js';
export type PonyfillCompressionFormat = 'x-gzip' | 'gzip' | 'x-deflate' | 'deflate' | 'deflate-raw' | 'br';
export declare class PonyfillCompressionStream extends PonyfillTransformStream implements CompressionStream {
    static supportedFormats: PonyfillCompressionFormat[];
    constructor(compressionFormat: PonyfillCompressionFormat);
}
