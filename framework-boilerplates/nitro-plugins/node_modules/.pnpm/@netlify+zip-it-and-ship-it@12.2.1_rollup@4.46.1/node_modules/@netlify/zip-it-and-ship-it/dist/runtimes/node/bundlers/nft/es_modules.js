import { basename, dirname, extname, resolve } from 'path';
import { cachedReadFile } from '../../../../utils/fs.js';
import { MODULE_FILE_EXTENSION, MODULE_FORMAT } from '../../utils/module_format.js';
import { getNodeSupportMatrix } from '../../utils/node_version.js';
import { getPackageJsonIfAvailable } from '../../utils/package_json.js';
import { transpileESMToCJS } from './transpile.js';
const getPatchedESMPackages = async (packages, cache) => {
    const patchedPackages = await Promise.all(packages.map((path) => patchESMPackage(path, cache)));
    const patchedPackagesMap = new Map();
    packages.forEach((packagePath, index) => {
        patchedPackagesMap.set(packagePath, patchedPackages[index]);
    });
    return patchedPackagesMap;
};
const isEntrypointESM = ({ basePath, esmPaths, mainFile, }) => {
    const absoluteESMPaths = new Set([...esmPaths].map((path) => resolvePath(path, basePath)));
    const entrypointIsESM = absoluteESMPaths.has(mainFile);
    return entrypointIsESM;
};
const patchESMPackage = async (path, cache) => {
    const file = await cachedReadFile(cache.fileCache, path);
    const packageJson = JSON.parse(file);
    const patchedPackageJson = {
        ...packageJson,
        type: 'commonjs',
    };
    return JSON.stringify(patchedPackageJson);
};
export const processESM = async ({ basePath, cache, config, esmPaths, featureFlags, mainFile, reasons, name, runtimeAPIVersion, }) => {
    const extension = extname(mainFile);
    // If this is a .mjs file and we want to output pure ESM files, we don't need
    // to transpile anything.
    if (extension === MODULE_FILE_EXTENSION.MJS && (featureFlags.zisi_pure_esm_mjs || runtimeAPIVersion === 2)) {
        return {
            moduleFormat: MODULE_FORMAT.ESM,
        };
    }
    if (!isEntrypointESM({ basePath, esmPaths, mainFile })) {
        return {
            moduleFormat: MODULE_FORMAT.COMMONJS,
        };
    }
    const packageJson = await getPackageJsonIfAvailable(dirname(mainFile));
    const nodeSupport = getNodeSupportMatrix(config.nodeVersion);
    if ((featureFlags.zisi_pure_esm || runtimeAPIVersion === 2) && packageJson.type === 'module' && nodeSupport.esm) {
        return {
            moduleFormat: MODULE_FORMAT.ESM,
        };
    }
    const rewrites = await transpileESM({ basePath, cache, config, esmPaths, reasons, name });
    return {
        moduleFormat: MODULE_FORMAT.COMMONJS,
        rewrites,
    };
};
const resolvePath = (relativePath, basePath) => basePath ? resolve(basePath, relativePath) : resolve(relativePath);
const shouldTranspile = (path, cache, esmPaths, reasons) => {
    const cached = cache.get(path);
    if (typeof cached === 'boolean') {
        return cached;
    }
    const reason = reasons.get(path);
    // This isn't an expected case, but if the path doesn't exist in `reasons` we
    // don't transpile it.
    if (reason === undefined) {
        cache.set(path, false);
        return false;
    }
    const { parents } = reason;
    const parentPaths = [...parents].filter((parentPath) => parentPath !== path);
    // If the path is an entrypoint, we transpile it only if it's an ESM file.
    if (parentPaths.length === 0) {
        const isESM = esmPaths.has(path);
        cache.set(path, isESM);
        return isESM;
    }
    // This is called recursively, so it's possible that another iteration will
    // also try to answer the question of whether this path needs transpiling.
    // Assuming, for the sake of this iteration, that the answer is yes, just
    // to avoid an infinite loop. We'll rewrite the map entry with the correct
    // value before the iteration ends.
    cache.set(path, true);
    // The path should be transpiled if every parent will also be transpiled, or
    // if there is no parent.
    const shouldTranspilePath = parentPaths.every((parentPath) => shouldTranspile(parentPath, cache, esmPaths, reasons));
    cache.set(path, shouldTranspilePath);
    return shouldTranspilePath;
};
const transpileESM = async ({ basePath, cache, config, esmPaths, reasons, name, }) => {
    // Used for memoizing the check for whether a path should be transpiled.
    const shouldCompileCache = new Map();
    const pathsToTranspile = [...esmPaths].filter((path) => shouldTranspile(path, shouldCompileCache, esmPaths, reasons));
    const pathsToTranspileSet = new Set(pathsToTranspile);
    const packageJsonPaths = [...reasons.entries()]
        .filter(([path, reason]) => {
        if (basename(path) !== 'package.json') {
            return false;
        }
        const needsPatch = [...reason.parents].some((parentPath) => pathsToTranspileSet.has(parentPath));
        return needsPatch;
    })
        .map(([path]) => (basePath ? resolve(basePath, path) : resolve(path)));
    const rewrites = await getPatchedESMPackages(packageJsonPaths, cache);
    await Promise.all(pathsToTranspile.map(async (path) => {
        const absolutePath = resolvePath(path, basePath);
        const transpiled = await transpileESMToCJS({
            config,
            name,
            path: absolutePath,
        });
        rewrites.set(absolutePath, transpiled);
    }));
    return rewrites;
};
