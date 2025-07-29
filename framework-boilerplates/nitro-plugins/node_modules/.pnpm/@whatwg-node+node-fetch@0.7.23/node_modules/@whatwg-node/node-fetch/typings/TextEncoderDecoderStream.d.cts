import { PonyfillTransformStream } from './TransformStream.cjs';
export declare class PonyfillTextDecoderStream extends PonyfillTransformStream implements TextDecoderStream {
    private textDecoder;
    constructor(encoding?: BufferEncoding, options?: TextDecoderOptions);
    get encoding(): string;
    get fatal(): boolean;
    get ignoreBOM(): boolean;
}
export declare class PonyfillTextEncoderStream extends PonyfillTransformStream implements TextEncoderStream {
    private textEncoder;
    constructor(encoding?: BufferEncoding);
    get encoding(): string;
    encode(input: string): Uint8Array;
}
