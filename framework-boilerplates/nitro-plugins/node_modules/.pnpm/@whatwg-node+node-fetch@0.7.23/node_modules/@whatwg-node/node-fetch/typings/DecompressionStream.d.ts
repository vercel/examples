import { PonyfillCompressionFormat } from './CompressionStream.js';
import { PonyfillTransformStream } from './TransformStream.js';
export declare class PonyfillDecompressionStream extends PonyfillTransformStream implements DecompressionStream {
    static supportedFormats: PonyfillCompressionFormat[];
    constructor(compressionFormat: PonyfillCompressionFormat);
}
