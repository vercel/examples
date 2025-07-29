import { Buffer } from 'node:buffer';
export declare class PonyfillTextEncoder implements TextEncoder {
    encoding: BufferEncoding;
    constructor(encoding?: BufferEncoding);
    encode(input: string): Buffer;
    encodeInto(source: string, destination: Uint8Array): TextEncoderEncodeIntoResult;
}
export declare class PonyfillTextDecoder implements TextDecoder {
    encoding: BufferEncoding;
    fatal: boolean;
    ignoreBOM: boolean;
    constructor(encoding?: BufferEncoding, options?: TextDecoderOptions);
    decode(input: BufferSource): string;
}
export declare function PonyfillBtoa(input: string): string;
