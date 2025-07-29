"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourcemapModules = void 0;
const path_1 = __importDefault(require("path"));
const source_map_1 = require("source-map");
const getBytesPerFileUsingSourceMap = (bundleId, code, map, dir) => {
    const modules = {};
    let line = 1;
    let column = 0;
    const codeChars = [...code];
    for (let i = 0; i < codeChars.length; i++, column++) {
        const { source } = map.originalPositionFor({
            line,
            column,
        });
        if (source != null) {
            const id = path_1.default.resolve(path_1.default.dirname(path_1.default.join(dir, bundleId)), source);
            const char = codeChars[i];
            modules[id] = modules[id] || { id, renderedLength: 0, code: [] };
            modules[id].renderedLength += Buffer.byteLength(char);
            modules[id].code.push(char);
        }
        if (code[i] === "\n") {
            line += 1;
            column = -1;
        }
    }
    return modules;
};
const getSourcemapModules = (id, outputChunk, dir) => {
    if (outputChunk.map == null) {
        return Promise.resolve({});
    }
    return source_map_1.SourceMapConsumer.with(outputChunk.map, null, (map) => {
        return getBytesPerFileUsingSourceMap(id, outputChunk.code, map, dir);
    });
};
exports.getSourcemapModules = getSourcemapModules;
