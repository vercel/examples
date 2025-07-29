import { promises as fs } from 'fs';
import { dirname } from 'path';
import { nonNullable } from '../../../../utils/non_nullable.js';
import { getModuleName } from '../../utils/module.js';
import { getNodeSupportMatrix } from '../../utils/node_version.js';
import { getNestedDependencies, handleModuleNotFound } from './nested.js';
import { getPublishedFiles } from './published.js';
import { resolvePackage } from './resolve.js';
import { getSideFiles } from './side_files.js';
// When a file requires a module, we find its path inside `node_modules` and
// use all its published files. We also recurse on the module's dependencies.
export const getDependencyPathsForDependency = async function ({ dependency, basedir, state, packageJson, pluginsModulesPath, nodeVersion, }) {
    const moduleName = getModuleName(dependency);
    // Happens when doing require("@scope") (not "@scope/name") or other oddities
    // Ignore those.
    if (moduleName === null) {
        return [];
    }
    try {
        return await getDependenciesForModuleName({ moduleName, basedir, state, pluginsModulesPath, nodeVersion });
    }
    catch (error) {
        return handleModuleNotFound({ error, moduleName, packageJson });
    }
};
const getDependenciesForModuleName = async function ({ moduleName, basedir, state, pluginsModulesPath, nodeVersion, }) {
    if (isExcludedModule(moduleName, nodeVersion)) {
        return [];
    }
    // Find the Node.js module directory path
    const packagePath = await resolvePackage(moduleName, [basedir, pluginsModulesPath].filter(nonNullable));
    if (packagePath === undefined) {
        return [];
    }
    const modulePath = dirname(packagePath);
    if (state.modulePaths.has(modulePath)) {
        return [];
    }
    state.moduleNames.add(moduleName);
    state.modulePaths.add(modulePath);
    // The path depends on the user's build, i.e. must be dynamic
    const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf8'));
    const [publishedFiles, sideFiles, depsPaths] = await Promise.all([
        getPublishedFiles(modulePath),
        getSideFiles(modulePath, moduleName),
        getNestedModules({ modulePath, state, packageJson, pluginsModulesPath, nodeVersion }),
    ]);
    return [...publishedFiles, ...sideFiles, ...depsPaths];
};
const isExcludedModule = function (moduleName, nodeVersion) {
    if (moduleName.startsWith('@types/')) {
        return true;
    }
    const nodeSupport = getNodeSupportMatrix(nodeVersion);
    return nodeSupport.awsSDKV3 ? moduleName.startsWith('@aws-sdk/') : moduleName === 'aws-sdk';
};
const getNestedModules = async function ({ modulePath, state, packageJson, pluginsModulesPath, nodeVersion, }) {
    const dependencies = getNestedDependencies(packageJson);
    const depsPaths = await Promise.all(dependencies.map((dependency) => getDependencyPathsForDependency({
        dependency,
        basedir: modulePath,
        state,
        packageJson,
        pluginsModulesPath,
        nodeVersion,
    })));
    return depsPaths.flat();
};
