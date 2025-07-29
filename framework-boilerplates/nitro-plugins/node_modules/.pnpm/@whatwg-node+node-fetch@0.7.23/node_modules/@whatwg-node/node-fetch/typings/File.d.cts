import { PonyfillBlob } from './Blob.cjs';
export declare class PonyfillFile extends PonyfillBlob implements File {
    name: string;
    lastModified: number;
    constructor(fileBits: BlobPart[], name: string, options?: FilePropertyBag);
    webkitRelativePath: string;
}
