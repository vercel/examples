import { extname } from 'path';
import { getFlags } from './feature_flags.js';
import { getFunctionFromPath, getFunctionsFromPaths } from './runtimes/index.js';
import { parseFile } from './runtimes/node/in_source_config/index.js';
import { RUNTIME } from './runtimes/runtime.js';
import { RuntimeCache } from './utils/cache.js';
import { listFunctionsDirectories, resolveFunctionsDirectories } from './utils/fs.js';
export { zipFunction, zipFunctions } from './zip.js';
export { ARCHIVE_FORMAT } from './archive.js';
export { NODE_BUNDLER } from './runtimes/node/bundlers/types.js';
export { RUNTIME } from './runtimes/runtime.js';
export { MODULE_FORMAT } from './runtimes/node/utils/module_format.js';
const augmentWithStaticAnalysis = async (func) => {
    if (func.runtime.name !== RUNTIME.JAVASCRIPT) {
        return func;
    }
    const staticAnalysisResult = await parseFile(func.mainFile, {
        functionName: func.name,
    });
    return { ...func, staticAnalysisResult };
};
// List all Netlify Functions main entry files for a specific directory.
export const listFunctions = async function (relativeSrcFolders, { featureFlags: inputFeatureFlags, config, configFileDirectories, parseISC = false } = {}) {
    const featureFlags = getFlags(inputFeatureFlags);
    const srcFolders = resolveFunctionsDirectories(relativeSrcFolders);
    const paths = await listFunctionsDirectories(srcFolders);
    const cache = new RuntimeCache();
    const functionsMap = await getFunctionsFromPaths(paths, { cache, config, configFileDirectories, featureFlags });
    const functions = [...functionsMap.values()];
    const augmentedFunctions = parseISC
        ? await Promise.all(functions.map((func) => augmentWithStaticAnalysis(func)))
        : functions;
    return augmentedFunctions.map(getListedFunction);
};
// Finds a function at a specific path.
export const listFunction = async function (path, { featureFlags: inputFeatureFlags, config, configFileDirectories, parseISC = false } = {}) {
    const featureFlags = getFlags(inputFeatureFlags);
    const cache = new RuntimeCache();
    const func = await getFunctionFromPath(path, { cache, config, configFileDirectories, featureFlags });
    if (!func) {
        return;
    }
    const augmentedFunction = parseISC ? await augmentWithStaticAnalysis(func) : func;
    return getListedFunction(augmentedFunction);
};
// List all Netlify Functions files for a specific directory
export const listFunctionsFiles = async function (relativeSrcFolders, { basePath, config, configFileDirectories, featureFlags: inputFeatureFlags, parseISC = false, } = {}) {
    const featureFlags = getFlags(inputFeatureFlags);
    const srcFolders = resolveFunctionsDirectories(relativeSrcFolders);
    const paths = await listFunctionsDirectories(srcFolders);
    const cache = new RuntimeCache();
    const functionsMap = await getFunctionsFromPaths(paths, { cache, config, configFileDirectories, featureFlags });
    const functions = [...functionsMap.values()];
    const augmentedFunctions = parseISC
        ? await Promise.all(functions.map((func) => augmentWithStaticAnalysis(func)))
        : functions;
    const listedFunctionsFiles = await Promise.all(augmentedFunctions.map((func) => getListedFunctionFiles(func, { basePath, featureFlags })));
    return listedFunctionsFiles.flat();
};
const getListedFunction = function ({ config, extension, staticAnalysisResult, mainFile, name, runtime, }) {
    return {
        displayName: config.name,
        extension,
        excludedRoutes: staticAnalysisResult?.excludedRoutes,
        generator: config.generator,
        timeout: config.timeout,
        mainFile,
        name,
        routes: staticAnalysisResult?.routes,
        runtime: runtime.name,
        runtimeAPIVersion: staticAnalysisResult ? (staticAnalysisResult?.runtimeAPIVersion ?? 1) : undefined,
        schedule: staticAnalysisResult?.config?.schedule ?? config.schedule,
        inputModuleFormat: staticAnalysisResult?.inputModuleFormat,
    };
};
const getListedFunctionFiles = async function (func, options) {
    const srcFiles = await getSrcFiles({
        ...func,
        ...options,
        runtimeAPIVersion: func.staticAnalysisResult?.runtimeAPIVersion ?? 1,
    });
    return srcFiles.map((srcFile) => ({ ...getListedFunction(func), srcFile, extension: extname(srcFile) }));
};
const getSrcFiles = async function ({ extension, runtime, srcPath, ...args }) {
    const { getSrcFiles: getRuntimeSrcFiles } = runtime;
    if (extension === '.zip' || typeof getRuntimeSrcFiles !== 'function') {
        return [srcPath];
    }
    return await getRuntimeSrcFiles({
        extension,
        runtime,
        srcPath,
        ...args,
    });
};
