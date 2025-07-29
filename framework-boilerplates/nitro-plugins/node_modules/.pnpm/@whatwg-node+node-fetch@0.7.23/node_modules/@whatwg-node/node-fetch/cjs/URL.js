"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillURL = void 0;
const tslib_1 = require("tslib");
const node_buffer_1 = tslib_1.__importDefault(require("node:buffer"));
const node_crypto_1 = require("node:crypto");
const NativeURL = globalThis.URL;
class URL extends NativeURL {
    // This part is only needed to handle `PonyfillBlob` objects
    static blobRegistry = new Map();
    static createObjectURL(blob) {
        const blobUrl = `blob:whatwgnode:${(0, node_crypto_1.randomUUID)()}`;
        this.blobRegistry.set(blobUrl, blob);
        return blobUrl;
    }
    static revokeObjectURL(url) {
        if (!this.blobRegistry.has(url)) {
            NativeURL.revokeObjectURL(url);
        }
        else {
            this.blobRegistry.delete(url);
        }
    }
    static getBlobFromURL(url) {
        return (this.blobRegistry.get(url) || node_buffer_1.default?.resolveObjectURL?.(url));
    }
}
exports.PonyfillURL = URL;
