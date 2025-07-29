import { extname } from 'path';
const markerModules = ['bindings', 'nan', 'node-gyp', 'node-gyp-build', 'node-pre-gyp', 'prebuild'];
export const isNativeModule = ({ binary, dependencies = {}, devDependencies = {}, files = [], gypfile, }) => {
    if (binary || gypfile) {
        return true;
    }
    const hasMarkerModule = markerModules.some((marker) => dependencies[marker] || devDependencies[marker]);
    if (hasMarkerModule) {
        return true;
    }
    // Check if files is an array, as we never know (see https://github.com/math-utils/hamming-distance/pull/4)
    const hasBinaryFile = Array.isArray(files)
        ? files.some((path) => !path.startsWith('!') && extname(path) === '.node')
        : false;
    return hasBinaryFile;
};
