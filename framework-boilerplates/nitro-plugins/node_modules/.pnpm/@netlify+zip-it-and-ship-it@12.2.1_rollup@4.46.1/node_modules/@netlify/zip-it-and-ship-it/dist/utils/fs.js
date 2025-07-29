import { promises as fs } from 'fs';
import { dirname, format, join, parse, resolve } from 'path';
import { nonNullable } from './non_nullable.js';
export const cachedLstat = (cache, path) => {
    let result = cache.get(path);
    if (result === undefined) {
        // no await as we want to populate the cache instantly with the promise
        result = fs.lstat(path);
        cache.set(path, result);
    }
    return result;
};
export const cachedReaddir = (cache, path) => {
    let result = cache.get(path);
    if (result === undefined) {
        // no await as we want to populate the cache instantly with the promise
        result = fs.readdir(path, 'utf-8');
        cache.set(path, result);
    }
    return result;
};
export const cachedReadFile = (cache, path) => {
    let result = cache.get(path);
    // Check for null here, as we use the same cache in NFT which sets null on a not found file
    if (result === undefined || result === null) {
        // no await as we want to populate the cache instantly with the promise
        result = fs.readFile(path, 'utf-8');
        cache.set(path, result);
    }
    return result;
};
export const getPathWithExtension = (path, extension) => format({ ...parse(path), base: undefined, ext: extension });
export const safeUnlink = async (path) => {
    try {
        await fs.unlink(path);
    }
    catch {
        // no-op
    }
};
// Takes a list of absolute paths and returns an array containing all the
// filenames within those directories, if at least one of the directories
// exists. If not, an error is thrown.
export const listFunctionsDirectories = async function (srcFolders) {
    const filenamesByDirectory = await Promise.allSettled(srcFolders.map((srcFolder) => listFunctionsDirectory(srcFolder)));
    const errorMessages = [];
    const validDirectories = filenamesByDirectory
        .map((result) => {
        if (result.status === 'rejected') {
            // If the error is about `ENOENT` (FileNotFound) then we only throw later if this happens
            // for all directories.
            if (result.reason instanceof Error && result.reason.code === 'ENOENT') {
                return null;
            }
            // In any other error case besides `ENOENT` throw immediately
            throw result.reason;
        }
        return result.value;
    })
        .filter(nonNullable);
    if (validDirectories.length === 0) {
        throw new Error(`Functions folders do not exist: ${srcFolders.join(', ')}
${errorMessages.join('\n')}`);
    }
    return validDirectories.flat();
};
const listFunctionsDirectory = async function (srcPath) {
    try {
        const filenames = await fs.readdir(srcPath);
        return filenames.map((name) => join(srcPath, name));
    }
    catch (error) {
        // We could move the `stat` call up and use its result to decide whether to
        // treat the path as a file or as a directory. We're doing it this way since
        // historically this method only supported directories, and only later we
        // made it accept files. To roll out that change as safely as possible, we
        // keep the directory flow untouched and look for files only as a fallback.
        if (error.code === 'ENOTDIR') {
            const stat = await fs.stat(srcPath);
            if (stat.isFile()) {
                return srcPath;
            }
        }
        throw error;
    }
};
export const resolveFunctionsDirectories = (input) => {
    const directories = Array.isArray(input) ? input : [input];
    const absoluteDirectories = directories.map((srcFolder) => resolve(srcFolder));
    return absoluteDirectories;
};
export const mkdirAndWriteFile = async (path, ...params) => {
    if (typeof path === 'string') {
        const directory = dirname(path);
        await fs.mkdir(directory, { recursive: true });
    }
    return fs.writeFile(path, ...params);
};
