"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBrotliSizeGetter = exports.createGzipSizeGetter = void 0;
const zlib = __importStar(require("zlib"));
const util_1 = require("util");
const gzip = (0, util_1.promisify)(zlib.gzip);
const brotliCompress = (0, util_1.promisify)(zlib.brotliCompress);
const gzipOptions = (options) => ({
    level: 9,
    ...options,
});
const brotliOptions = (options, buffer) => ({
    params: {
        [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
        [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
        [zlib.constants.BROTLI_PARAM_SIZE_HINT]: buffer.length,
    },
    ...options,
});
const createGzipCompressor = (options) => (buffer) => gzip(buffer, gzipOptions(options || {}));
const createGzipSizeGetter = (options) => {
    const compress = createGzipCompressor(options);
    return async (code) => {
        const data = await compress(Buffer.from(code, "utf-8"));
        return data.length;
    };
};
exports.createGzipSizeGetter = createGzipSizeGetter;
const createBrotliCompressor = (options) => (buffer) => brotliCompress(buffer, brotliOptions(options || {}, buffer));
const createBrotliSizeGetter = (options) => {
    const compress = createBrotliCompressor(options);
    return async (code) => {
        const data = await compress(Buffer.from(code, "utf-8"));
        return data.length;
    };
};
exports.createBrotliSizeGetter = createBrotliSizeGetter;
