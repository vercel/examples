import { Buffer } from 'node:buffer';
interface BlobOptions {
    /**
     * @default 'utf8'
     */
    encoding?: BufferEncoding | undefined;
    /**
     * The Blob content-type. The intent is for `type` to convey
     * the MIME media type of the data, however no validation of the type format
     * is performed.
     */
    type?: string | undefined;
    /**
     * The size of the Blob object in bytes.
     */
    size?: number | null;
}
export declare function hasBufferMethod(obj: any): obj is {
    buffer(): Promise<Buffer>;
};
export declare function hasArrayBufferMethod(obj: any): obj is {
    arrayBuffer(): Promise<ArrayBuffer>;
    size?: number;
};
export declare function hasBytesMethod(obj: any): obj is {
    bytes(): Promise<Uint8Array>;
};
export declare function hasTextMethod(obj: any): obj is {
    text(): Promise<string>;
};
export declare function hasSizeProperty(obj: any): obj is {
    size: number;
};
export declare function hasStreamMethod(obj: any): obj is {
    stream(): any;
};
export declare function hasBlobSignature(obj: any): obj is Blob;
export declare function isArrayBuffer(obj: any): obj is ArrayBuffer;
export declare class PonyfillBlob implements Blob {
    private blobParts;
    type: string;
    private encoding;
    private _size;
    constructor(blobParts?: BlobPart[], options?: BlobOptions);
    _buffer: Buffer | null;
    buffer(): Promise<Buffer<ArrayBufferLike>>;
    arrayBuffer(): Promise<ArrayBuffer>;
    bytes(): Promise<Uint8Array>;
    _text: string | null;
    text(): Promise<string>;
    _json: any;
    json(): Promise<any>;
    _formData: FormData | null;
    formData(): Promise<FormData>;
    get size(): number;
    stream(): any;
    slice(): any;
}
export interface PonyfillBlob {
    prototype: Blob;
    new (blobParts?: BlobPart[], options?: BlobPropertyBag): Blob;
}
export {};
