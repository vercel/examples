import { PonyfillBlob } from './Blob.js';
export class PonyfillFile extends PonyfillBlob {
    name;
    lastModified;
    constructor(fileBits, name, options) {
        super(fileBits, options);
        this.name = name;
        this.lastModified = options?.lastModified || Date.now();
    }
    webkitRelativePath = '';
}
