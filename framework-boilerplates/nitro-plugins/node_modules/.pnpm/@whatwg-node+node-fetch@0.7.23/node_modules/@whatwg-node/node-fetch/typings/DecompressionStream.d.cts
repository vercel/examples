import { PonyfillCompressionFormat } from './CompressionStream.cjs';
import { PonyfillTransformStream } from './TransformStream.cjs';
export declare class PonyfillDecompressionStream extends PonyfillTransformStream implements DecompressionStream {
    static supportedFormats: PonyfillCompressionFormat[];
    constructor(compressionFormat: PonyfillCompressionFormat);
}
