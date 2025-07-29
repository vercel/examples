import { PonyfillBlob } from './Blob.js';
export declare class PonyfillFile extends PonyfillBlob implements File {
    name: string;
    lastModified: number;
    constructor(fileBits: BlobPart[], name: string, options?: FilePropertyBag);
    webkitRelativePath: string;
}
