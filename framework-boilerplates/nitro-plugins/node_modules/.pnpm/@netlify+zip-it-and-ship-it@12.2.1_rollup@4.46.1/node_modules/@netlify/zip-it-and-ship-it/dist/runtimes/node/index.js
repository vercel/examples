import { dirname, extname, join } from 'path';
import { copyFile } from 'copy-file';
import { INVOCATION_MODE } from '../../function.js';
import { Priority } from '../../priority.js';
import { getTrafficRulesConfig } from '../../rate_limit.js';
import getInternalValue from '../../utils/get_internal_value.js';
import { RUNTIME } from '../runtime.js';
import { getBundler, getBundlerName } from './bundlers/index.js';
import { NODE_BUNDLER } from './bundlers/types.js';
import { findFunctionsInPaths, findFunctionInPath } from './finder.js';
import { augmentFunctionConfig, parseFile } from './in_source_config/index.js';
import { MODULE_FORMAT, MODULE_FILE_EXTENSION } from './utils/module_format.js';
import { getNodeRuntime, getNodeRuntimeForV2 } from './utils/node_runtime.js';
import { createAliases as createPluginsModulesPathAliases, getPluginsModulesPath } from './utils/plugin_modules_path.js';
import { zipNodeJs } from './utils/zip.js';
// A proxy for the `getSrcFiles` that calls `getSrcFiles` on the bundler
const getSrcFilesWithBundler = async (parameters) => {
    const { config, extension, featureFlags, mainFile, runtimeAPIVersion, srcDir } = parameters;
    const pluginsModulesPath = await getPluginsModulesPath(srcDir);
    const bundlerName = await getBundlerName({
        config,
        extension,
        featureFlags,
        mainFile,
        runtimeAPIVersion,
    });
    const bundler = getBundler(bundlerName);
    const result = await bundler.getSrcFiles({ ...parameters, pluginsModulesPath });
    return result.srcFiles;
};
const zipFunction = async function ({ archiveFormat, basePath, branch, cache, config = {}, destFolder, extension, featureFlags, filename, isInternal, logger, mainFile, name, repositoryRoot, runtime, srcDir, srcPath, stat, }) {
    // If the file is a zip, we assume the function is bundled and ready to go.
    // We simply copy it to the destination path with no further processing.
    if (extension === '.zip') {
        const destPath = join(destFolder, filename);
        await copyFile(srcPath, destPath);
        return { config, path: destPath, entryFilename: '' };
    }
    // If the function is inside the plugins modules path, we need to treat that
    // directory as the base path, not as an extra directory used for module
    // resolution. So we unset `pluginsModulesPath` for this function. We do
    // this because we want the modules used by those functions to be isolated
    // from the ones defined in the project root.
    let pluginsModulesPath = await getPluginsModulesPath(srcDir);
    const isInPluginsModulesPath = Boolean(pluginsModulesPath && srcDir.startsWith(pluginsModulesPath));
    if (isInPluginsModulesPath) {
        basePath = dirname(pluginsModulesPath);
        pluginsModulesPath = undefined;
    }
    const staticAnalysisResult = await parseFile(mainFile, { functionName: name });
    const runtimeAPIVersion = staticAnalysisResult.runtimeAPIVersion === 2 ? 2 : 1;
    const mergedConfig = augmentFunctionConfig(mainFile, config, staticAnalysisResult.config);
    const bundlerName = await getBundlerName({
        config: mergedConfig,
        extension,
        featureFlags,
        mainFile,
        runtimeAPIVersion,
    });
    const bundler = getBundler(bundlerName);
    const { aliases = new Map(), cleanupFunction, basePath: basePathFromBundler, bundlerWarnings, includedFiles, inputs, mainFile: finalMainFile = mainFile, moduleFormat, nativeNodeModules, rewrites = new Map(), srcFiles, } = await bundler.bundle({
        basePath,
        cache,
        config: mergedConfig,
        extension,
        featureFlags,
        filename,
        logger,
        mainFile,
        name,
        pluginsModulesPath,
        repositoryRoot,
        runtime,
        runtimeAPIVersion,
        srcDir,
        srcPath,
        stat,
    });
    createPluginsModulesPathAliases(srcFiles, pluginsModulesPath, aliases, basePathFromBundler);
    // If the function is inside the plugins modules path, we need to force the
    // base path to be that directory. If not, we'll run the logic that finds the
    // common path prefix and that will break module resolution, as the modules
    // will no longer be inside a `node_modules` directory.
    const finalBasePath = isInPluginsModulesPath ? basePath : basePathFromBundler;
    const generator = mergedConfig?.generator || getInternalValue(isInternal);
    const zipResult = await zipNodeJs({
        aliases,
        archiveFormat,
        basePath: finalBasePath,
        branch,
        cache,
        destFolder,
        extension,
        featureFlags,
        filename,
        mainFile: finalMainFile,
        moduleFormat,
        name,
        repositoryRoot,
        rewrites,
        runtimeAPIVersion,
        srcFiles,
        generator,
    });
    await cleanupFunction?.();
    // Getting the invocation mode from ISC, in case the function is using the
    // `stream` helper.
    let { invocationMode } = staticAnalysisResult;
    // If we're using the V2 API, force the invocation to "stream".
    if (runtimeAPIVersion === 2) {
        invocationMode = INVOCATION_MODE.Stream;
    }
    // If this is a background function, set the right `invocationMode` value.
    if (name.endsWith('-background')) {
        invocationMode = INVOCATION_MODE.Background;
    }
    const outputModuleFormat = extname(finalMainFile) === MODULE_FILE_EXTENSION.MJS ? MODULE_FORMAT.ESM : MODULE_FORMAT.COMMONJS;
    const priority = isInternal ? Priority.GeneratedFunction : Priority.UserFunction;
    const trafficRules = mergedConfig?.rateLimit ? getTrafficRulesConfig(mergedConfig.rateLimit) : undefined;
    return {
        bootstrapVersion: zipResult.bootstrapVersion,
        bundler: bundlerName,
        bundlerWarnings,
        config: mergedConfig,
        displayName: mergedConfig?.name,
        entryFilename: zipResult.entryFilename,
        generator,
        timeout: mergedConfig?.timeout,
        inputs,
        includedFiles,
        staticAnalysisResult,
        invocationMode,
        outputModuleFormat,
        nativeNodeModules,
        path: zipResult.path,
        priority,
        trafficRules,
        runtimeVersion: runtimeAPIVersion === 2
            ? getNodeRuntimeForV2(mergedConfig.nodeVersion)
            : getNodeRuntime(mergedConfig.nodeVersion),
    };
};
const zipWithFunctionWithFallback = async ({ config = {}, ...parameters }) => {
    // If a specific JS bundler version is specified, we'll use it.
    if (config.nodeBundler !== NODE_BUNDLER.ESBUILD_ZISI) {
        return zipFunction({ ...parameters, config });
    }
    // Otherwise, we'll try to bundle with esbuild and, if that fails, fallback
    // to zisi.
    try {
        return await zipFunction({ ...parameters, config: { ...config, nodeBundler: NODE_BUNDLER.ESBUILD } });
    }
    catch (esbuildError) {
        try {
            const data = await zipFunction({ ...parameters, config: { ...config, nodeBundler: NODE_BUNDLER.ZISI } });
            return { ...data, bundlerErrors: esbuildError.errors };
        }
        catch {
            throw esbuildError;
        }
    }
};
const runtime = {
    findFunctionsInPaths,
    findFunctionInPath,
    getSrcFiles: getSrcFilesWithBundler,
    name: RUNTIME.JAVASCRIPT,
    zipFunction: zipWithFunctionWithFallback,
};
export default runtime;
