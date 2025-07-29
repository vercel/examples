"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillFile = void 0;
const Blob_js_1 = require("./Blob.js");
class PonyfillFile extends Blob_js_1.PonyfillBlob {
    name;
    lastModified;
    constructor(fileBits, name, options) {
        super(fileBits, options);
        this.name = name;
        this.lastModified = options?.lastModified || Date.now();
    }
    webkitRelativePath = '';
}
exports.PonyfillFile = PonyfillFile;
