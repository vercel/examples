import { PonyfillTextDecoder, PonyfillTextEncoder } from './TextEncoderDecoder.js';
import { PonyfillTransformStream } from './TransformStream.js';
export class PonyfillTextDecoderStream extends PonyfillTransformStream {
    textDecoder;
    constructor(encoding, options) {
        super({
            transform: (chunk, controller) => controller.enqueue(this.textDecoder.decode(chunk, { stream: true })),
        });
        this.textDecoder = new PonyfillTextDecoder(encoding, options);
    }
    get encoding() {
        return this.textDecoder.encoding;
    }
    get fatal() {
        return this.textDecoder.fatal;
    }
    get ignoreBOM() {
        return this.textDecoder.ignoreBOM;
    }
}
export class PonyfillTextEncoderStream extends PonyfillTransformStream {
    textEncoder;
    constructor(encoding) {
        super({
            transform: (chunk, controller) => controller.enqueue(this.textEncoder.encode(chunk)),
        });
        this.textEncoder = new PonyfillTextEncoder(encoding);
    }
    get encoding() {
        return this.textEncoder.encoding;
    }
    encode(input) {
        return this.textEncoder.encode(input);
    }
}
