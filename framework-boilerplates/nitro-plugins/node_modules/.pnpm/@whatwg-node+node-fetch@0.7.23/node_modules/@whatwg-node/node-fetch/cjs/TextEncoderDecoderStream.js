"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillTextEncoderStream = exports.PonyfillTextDecoderStream = void 0;
const TextEncoderDecoder_js_1 = require("./TextEncoderDecoder.js");
const TransformStream_js_1 = require("./TransformStream.js");
class PonyfillTextDecoderStream extends TransformStream_js_1.PonyfillTransformStream {
    textDecoder;
    constructor(encoding, options) {
        super({
            transform: (chunk, controller) => controller.enqueue(this.textDecoder.decode(chunk, { stream: true })),
        });
        this.textDecoder = new TextEncoderDecoder_js_1.PonyfillTextDecoder(encoding, options);
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
exports.PonyfillTextDecoderStream = PonyfillTextDecoderStream;
class PonyfillTextEncoderStream extends TransformStream_js_1.PonyfillTransformStream {
    textEncoder;
    constructor(encoding) {
        super({
            transform: (chunk, controller) => controller.enqueue(this.textEncoder.encode(chunk)),
        });
        this.textEncoder = new TextEncoderDecoder_js_1.PonyfillTextEncoder(encoding);
    }
    get encoding() {
        return this.textEncoder.encoding;
    }
    encode(input) {
        return this.textEncoder.encode(input);
    }
}
exports.PonyfillTextEncoderStream = PonyfillTextEncoderStream;
