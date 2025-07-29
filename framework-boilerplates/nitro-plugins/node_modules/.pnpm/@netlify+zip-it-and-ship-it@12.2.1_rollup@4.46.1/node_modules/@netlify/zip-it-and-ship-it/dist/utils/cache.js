export class RuntimeCache {
    // Cache for fs.readFile() calls
    fileCache;
    // Cache for fs.lstat() calls
    lstatCache;
    // Cache fs.readdir() calls
    readdirCache;
    // NFT cache, which should not be used in zisi and only supplied to NFT
    // this cache shares the file cache with zisi
    nftCache;
    constructor() {
        this.fileCache = new Map();
        this.lstatCache = new Map();
        this.readdirCache = new Map();
        this.nftCache = Object.create(null);
        this.nftCache.fileCache = this.fileCache;
    }
}
