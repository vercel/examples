import { PonyfillBlob } from './Blob.js';
declare const NativeURL: {
    new (url: string | globalThis.URL, base?: string | globalThis.URL): globalThis.URL;
    prototype: globalThis.URL;
    canParse(url: string | globalThis.URL, base?: string | globalThis.URL): boolean;
    createObjectURL(obj: Blob | MediaSource): string;
    parse(url: string | globalThis.URL, base?: string | globalThis.URL): globalThis.URL | null;
    revokeObjectURL(url: string): void;
};
declare class URL extends NativeURL {
    static blobRegistry: Map<string, Blob | PonyfillBlob>;
    static createObjectURL(blob: Blob): string;
    static revokeObjectURL(url: string): void;
    static getBlobFromURL(url: string): Blob | PonyfillBlob | undefined;
}
export { URL as PonyfillURL };
