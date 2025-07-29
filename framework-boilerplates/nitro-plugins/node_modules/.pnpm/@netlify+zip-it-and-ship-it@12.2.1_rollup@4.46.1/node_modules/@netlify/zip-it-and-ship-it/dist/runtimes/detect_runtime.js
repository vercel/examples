import { readFile } from 'fs/promises';
import { detect, Runtime as BinaryRuntime, Arch, Platform } from '@netlify/binary-info';
import { RUNTIME } from './runtime.js';
const isValidFunctionBinary = (info) => info.arch === Arch.Amd64 && info.platform === Platform.Linux;
const warnIncompatibleBinary = function (path, binaryInfo) {
    if (!global.ZISI_CLI) {
        console.warn(`
Found incompatible prebuilt function binary in ${path}.
The binary needs to be built for Linux/Amd64, but it was built for ${Platform[binaryInfo.platform]}/${Arch[binaryInfo.arch]}`);
    }
    return undefined;
};
// Try to guess the runtime by inspecting the binary file.
export const detectBinaryRuntime = async function ({ path }) {
    try {
        const fileContents = await readFile(path);
        const binaryInfo = detect(new Uint8Array(fileContents.buffer, fileContents.byteOffset, fileContents.byteLength / Uint8Array.BYTES_PER_ELEMENT));
        if (!isValidFunctionBinary(binaryInfo)) {
            return warnIncompatibleBinary(path, binaryInfo);
        }
        switch (binaryInfo.runtime) {
            case BinaryRuntime.Go:
                return RUNTIME.GO;
            case BinaryRuntime.Rust:
                return RUNTIME.RUST;
            default:
                return undefined;
        }
    }
    catch {
        // Possible errors are: non binary files, arch/platforms not supported by binary-info, path is directory
    }
};
