import { join, dirname, basename, extname } from 'path';
import { locatePath } from 'locate-path';
import { cachedLstat } from '../../utils/fs.js';
import { nonNullable } from '../../utils/non_nullable.js';
// List of extensions that this runtime will look for, in order of precedence.
const allowedExtensions = ['.js', '.zip', '.mjs', '.cjs', '.ts', '.tsx', '.mts', '.cts'];
// Sorting function, compatible with the callback of Array.sort, which sorts
// entries by extension according to their position in `allowedExtensions`.
// It places extensions with a higher precedence last in the array, so that
// they "win" when the array is flattened into a Map.
const sortByExtension = (fA, fB) => {
    const indexA = allowedExtensions.indexOf(fA.extension);
    const indexB = allowedExtensions.indexOf(fB.extension);
    return indexB - indexA;
};
export const findFunctionsInPaths = async function ({ cache, featureFlags, paths }) {
    const functions = await Promise.all(paths.map((path) => findFunctionInPath({ cache, featureFlags, path })));
    // It's fine to mutate the array since its scope is local to this function.
    const sortedFunctions = functions.filter(nonNullable).sort((fA, fB) => {
        // We first sort the functions array to put directories first. This is so
        // that `{name}/{name}.js` takes precedence over `{name}.js`.
        const directorySort = Number(fA.stat.isDirectory()) - Number(fB.stat.isDirectory());
        if (directorySort !== 0) {
            return directorySort;
        }
        // If the functions have the same name, we sort them according to the order
        // defined in `allowedExtensions`.
        if (fA.name === fB.name) {
            return sortByExtension(fA, fB);
        }
        return 0;
    });
    return sortedFunctions;
};
export const findFunctionInPath = async function ({ cache, path: srcPath }) {
    const filename = basename(srcPath);
    if (filename === 'node_modules') {
        return;
    }
    const stat = await cachedLstat(cache.lstatCache, srcPath);
    const mainFile = await getMainFile(srcPath, filename, stat);
    if (mainFile === undefined) {
        return;
    }
    const extension = extname(srcPath);
    const srcDir = stat.isDirectory() ? srcPath : dirname(srcPath);
    const name = basename(srcPath, extname(srcPath));
    return { extension, filename, mainFile, name, srcDir, srcPath, stat };
};
// Each `srcPath` can also be a directory with an `index` file or a file using
// the same filename as its directory.
const getMainFile = async function (srcPath, filename, stat) {
    if (stat.isDirectory()) {
        return await locatePath([
            // The order of these declarations is important, so that we always bundle the same way
            // even if multiple files are found
            join(srcPath, `${filename}.js`),
            join(srcPath, 'index.js'),
            join(srcPath, `${filename}.ts`),
            join(srcPath, 'index.ts'),
            join(srcPath, `${filename}.mjs`),
            join(srcPath, 'index.mjs'),
            join(srcPath, `${filename}.cjs`),
            join(srcPath, 'index.cjs'),
            join(srcPath, `${filename}.tsx`),
            join(srcPath, 'index.tsx'),
            join(srcPath, `${filename}.mts`),
            join(srcPath, 'index.mts'),
            join(srcPath, `${filename}.cts`),
            join(srcPath, 'index.cts'),
        ], { type: 'file' });
    }
    const extension = extname(srcPath);
    if (allowedExtensions.includes(extension)) {
        return srcPath;
    }
};
