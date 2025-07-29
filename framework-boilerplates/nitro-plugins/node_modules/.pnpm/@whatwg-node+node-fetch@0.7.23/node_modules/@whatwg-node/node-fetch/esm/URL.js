import NodeBuffer from 'node:buffer';
import { randomUUID } from 'node:crypto';
const NativeURL = globalThis.URL;
class URL extends NativeURL {
    // This part is only needed to handle `PonyfillBlob` objects
    static blobRegistry = new Map();
    static createObjectURL(blob) {
        const blobUrl = `blob:whatwgnode:${randomUUID()}`;
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
        return (this.blobRegistry.get(url) || NodeBuffer?.resolveObjectURL?.(url));
    }
}
export { URL as PonyfillURL };
