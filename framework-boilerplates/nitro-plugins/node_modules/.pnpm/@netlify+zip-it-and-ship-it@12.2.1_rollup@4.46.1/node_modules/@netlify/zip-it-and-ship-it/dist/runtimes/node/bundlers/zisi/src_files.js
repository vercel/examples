import { dirname, basename, normalize } from 'path';
import { isNotJunk as notJunk } from 'junk';
import { nonNullable } from '../../../../utils/non_nullable.js';
import { filterExcludedPaths, getPathsOfIncludedFiles } from '../../utils/included_files.js';
import { getPackageJson } from '../../utils/package_json.js';
import { getNewCache } from '../../utils/traversal_cache.js';
import { listImports } from './list_imports.js';
import { resolvePathPreserveSymlinks } from './resolve.js';
import { getDependencyPathsForDependency } from './traverse.js';
import { getTreeFiles } from './tree_files.js';
import { shouldTreeShake } from './tree_shake.js';
// Retrieve the paths to the Node.js files to zip.
// We only include the files actually needed by the function because AWS Lambda
// has a size limit for the zipped file. It also makes cold starts faster.
export const getSrcFiles = async function ({ config, featureFlags, mainFile, name, pluginsModulesPath, srcDir, srcPath, stat, }) {
    const { includedFiles = [], includedFilesBasePath, nodeVersion } = config;
    const { excludePatterns, paths: includedFilePaths } = await getPathsOfIncludedFiles(includedFiles, includedFilesBasePath);
    const [treeFiles, depFiles] = await Promise.all([
        getTreeFiles(srcPath, stat),
        getDependencies({ featureFlags, functionName: name, mainFile, pluginsModulesPath, srcDir, nodeVersion }),
    ]);
    const files = [...treeFiles, ...depFiles].map(normalize);
    const uniqueFiles = [...new Set(files)];
    // We sort so that the archive's checksum is deterministic.
    // Mutating is fine since `Array.filter()` returns a shallow copy
    const filteredFiles = uniqueFiles.filter(isNotJunk).sort();
    const srcFiles = filterExcludedPaths(filteredFiles, excludePatterns);
    const includedPaths = filterExcludedPaths(includedFilePaths, excludePatterns);
    return { srcFiles: [...srcFiles, ...includedPaths], includedFiles: includedPaths };
};
// Remove temporary files like *~, *.swp, etc.
const isNotJunk = function (file) {
    return notJunk(basename(file));
};
// Retrieve all the files recursively required by a Node.js file
const getDependencies = async function ({ featureFlags, functionName, mainFile, pluginsModulesPath, srcDir, nodeVersion, }) {
    const packageJson = await getPackageJson(srcDir);
    const state = getNewCache();
    try {
        return await getFileDependencies({
            featureFlags,
            functionName,
            path: mainFile,
            packageJson,
            pluginsModulesPath,
            state,
            nodeVersion,
        });
    }
    catch (error) {
        error.message = `In file "${mainFile}"\n${error.message}`;
        throw error;
    }
};
const getFileDependencies = async function ({ featureFlags, functionName, path, packageJson, pluginsModulesPath, state, treeShakeNext = false, nodeVersion, }) {
    if (state.localFiles.has(path)) {
        return [];
    }
    state.localFiles.add(path);
    const basedir = dirname(path);
    const dependencies = await listImports({ featureFlags, functionName, path });
    const depsPaths = await Promise.all(dependencies.filter(nonNullable).map((dependency) => getImportDependencies({
        dependency,
        basedir,
        featureFlags,
        functionName,
        packageJson,
        pluginsModulesPath,
        state,
        treeShakeNext,
        nodeVersion,
    })));
    return depsPaths.flat();
};
const getImportDependencies = function ({ dependency, basedir, featureFlags, functionName, packageJson, pluginsModulesPath, state, treeShakeNext, nodeVersion, }) {
    const shouldTreeShakeNext = treeShakeNext || isNextOnNetlify(dependency);
    if (shouldTreeShake(dependency, shouldTreeShakeNext)) {
        return getTreeShakedDependencies({
            dependency,
            basedir,
            featureFlags,
            functionName,
            packageJson,
            pluginsModulesPath,
            state,
            treeShakeNext: shouldTreeShakeNext,
        });
    }
    return getDependencyPathsForDependency({ dependency, basedir, state, packageJson, pluginsModulesPath, nodeVersion });
};
const isNextOnNetlify = function (dependency) {
    return basename(dependency, '.js') === 'renderNextPage';
};
// When a file requires another one, we apply the top-level logic recursively
const getTreeShakedDependencies = async function ({ dependency, basedir, featureFlags, functionName, packageJson, pluginsModulesPath, state, treeShakeNext, nodeVersion, }) {
    const path = await resolvePathPreserveSymlinks(dependency, [basedir, pluginsModulesPath].filter(nonNullable));
    const depsPath = await getFileDependencies({
        featureFlags,
        functionName,
        path,
        packageJson,
        pluginsModulesPath,
        state,
        treeShakeNext,
        nodeVersion,
    });
    return [path, ...depsPath];
};
