import { filterExcludedPaths, getPathsOfIncludedFiles } from '../../utils/included_files.js';
import { getPackageJson } from '../../utils/package_json.js';
import { getNewCache } from '../../utils/traversal_cache.js';
import { getDependencyPathsForDependency } from '../zisi/traverse.js';
export const getSrcFiles = async ({ config, mainFile, pluginsModulesPath, srcDir }) => {
    const { externalNodeModules = [], includedFiles = [], includedFilesBasePath, nodeVersion } = config;
    const { excludePatterns, paths: includedFilePaths } = await getPathsOfIncludedFiles(includedFiles, includedFilesBasePath);
    const dependencyPaths = await getSrcFilesForDependencies({
        basedir: srcDir,
        dependencies: externalNodeModules,
        pluginsModulesPath,
        nodeVersion,
    });
    const srcFiles = filterExcludedPaths(dependencyPaths, excludePatterns);
    const includedPaths = filterExcludedPaths(includedFilePaths, excludePatterns);
    return {
        srcFiles: [...srcFiles, ...includedPaths, mainFile],
        includedFiles: includedPaths,
    };
};
const getSrcFilesForDependencies = async function ({ basedir, dependencies: dependencyNames, state = getNewCache(), pluginsModulesPath, nodeVersion, }) {
    if (dependencyNames.length === 0) {
        return [];
    }
    const packageJson = await getPackageJson(basedir);
    const dependencies = await Promise.all(dependencyNames.map((dependencyName) => getSrcFilesForDependency({
        dependency: dependencyName,
        basedir,
        state,
        packageJson,
        pluginsModulesPath,
        nodeVersion,
    })));
    const paths = new Set(dependencies.flat());
    return [...paths];
};
const getSrcFilesForDependency = async function ({ dependency, basedir, state = getNewCache(), packageJson, pluginsModulesPath, nodeVersion, }) {
    try {
        const paths = await getDependencyPathsForDependency({
            dependency,
            basedir,
            state,
            packageJson,
            pluginsModulesPath,
            nodeVersion,
        });
        return paths;
    }
    catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            return [];
        }
        throw error;
    }
};
