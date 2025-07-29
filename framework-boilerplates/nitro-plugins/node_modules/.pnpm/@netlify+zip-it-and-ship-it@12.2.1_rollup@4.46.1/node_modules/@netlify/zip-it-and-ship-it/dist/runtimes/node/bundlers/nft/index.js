import { basename, dirname, extname, join, normalize, resolve } from 'path';
import { nodeFileTrace } from '@vercel/nft';
import resolveDependency from '@vercel/nft/out/resolve-dependency.js';
import { cachedReadFile, getPathWithExtension } from '../../../../utils/fs.js';
import { minimatch } from '../../../../utils/matching.js';
import { getBasePath } from '../../utils/base_path.js';
import { filterExcludedPaths, getPathsOfIncludedFiles } from '../../utils/included_files.js';
import { MODULE_FILE_EXTENSION, tsExtensions } from '../../utils/module_format.js';
import { getNodeSupportMatrix } from '../../utils/node_version.js';
import { processESM } from './es_modules.js';
import { getSideFiles } from './side_files.js';
import { transform, getTransformer } from './transformer.js';
const appearsToBeModuleName = (name) => !name.startsWith('.');
const bundle = async ({ basePath, cache, config, featureFlags, mainFile, name, pluginsModulesPath, repositoryRoot = basePath, runtimeAPIVersion, srcPath, stat, }) => {
    const { includedFiles = [], includedFilesBasePath, nodeBundler } = config;
    // In the legacy `zisi` bundler, functions defined in a sub-directory had any
    // side files automatically added to the bundle. We replicate this behavior
    // here when all the following conditions are met:
    //
    // 1. The `traceWithNft` flag is enabled, meaning we're in the process of
    //    replacing the legacy bundler with NFT
    // 2. No bundler configuration was supplied, meaning the default option is
    //    being used
    // 3. The function uses the V1 syntax, since we don't want to extend this
    //    behavior to V2 functions
    if (featureFlags.traceWithNft && nodeBundler === undefined && runtimeAPIVersion === 1) {
        const sideFiles = await getSideFiles(srcPath, stat);
        includedFiles.push(...sideFiles);
    }
    const { excludePatterns, paths: includedFilePaths } = await getPathsOfIncludedFiles(includedFiles, includedFilesBasePath || basePath);
    const { aliases, bundledPaths = [], mainFile: normalizedMainFile, moduleFormat, rewrites, tracedPaths, } = await traceFilesAndTranspile({
        basePath: repositoryRoot,
        cache,
        config,
        featureFlags,
        mainFile,
        pluginsModulesPath,
        name,
        repositoryRoot,
        runtimeAPIVersion,
    });
    const includedPaths = filterExcludedPaths(includedFilePaths, excludePatterns);
    const filteredIncludedPaths = [...filterExcludedPaths(tracedPaths, excludePatterns), ...includedPaths];
    const dirnames = filteredIncludedPaths.map((filePath) => normalize(dirname(filePath))).sort();
    // Sorting the array to make the checksum deterministic.
    const srcFiles = [...filteredIncludedPaths].sort();
    // The inputs are the union of any traced paths (included as files in the end
    // result) and any bundled paths (merged together in the bundle).
    const inputs = bundledPaths.length === 0 ? tracedPaths : [...new Set([...tracedPaths, ...bundledPaths])];
    return {
        aliases,
        basePath: getBasePath(dirnames),
        includedFiles: includedPaths,
        inputs,
        mainFile: normalizedMainFile,
        moduleFormat,
        rewrites,
        srcFiles,
    };
};
const getIgnoreFunction = (config) => {
    const nodeSupport = getNodeSupportMatrix(config.nodeVersion);
    // Paths that will be excluded from the tracing process.
    const ignore = nodeSupport.awsSDKV3 ? ['node_modules/@aws-sdk/**'] : ['node_modules/aws-sdk/**'];
    return (path) => {
        const shouldIgnore = ignore.some((expression) => minimatch(path, expression));
        return shouldIgnore;
    };
};
const traceFilesAndTranspile = async function ({ basePath, cache, config, featureFlags, mainFile, pluginsModulesPath, name, repositoryRoot, runtimeAPIVersion, }) {
    const isTSFunction = tsExtensions.has(extname(mainFile));
    const transformer = runtimeAPIVersion === 2 || isTSFunction ? await getTransformer(runtimeAPIVersion, mainFile, repositoryRoot) : null;
    const { fileList: dependencyPaths, esmFileList, reasons, } = await nodeFileTrace([mainFile], {
        // Default is 1024. Allowing double the fileIO in parallel makes nft faster, but uses a little more memory.
        fileIOConcurrency: 2048,
        base: basePath,
        cache: cache.nftCache,
        ignore: getIgnoreFunction(config),
        readFile: async (path) => {
            try {
                const isMainFile = path === mainFile;
                // Transform this file if this is the main file and we're processing a
                // V2 functions (which always bundle local imports), or if this path is
                // a TypeScript file (which should only happen for V1 TS functions that
                // set the bundler to "nft").
                if ((isMainFile && transformer) || tsExtensions.has(extname(path))) {
                    const { bundledPaths, transpiled } = await transform({
                        bundle: transformer?.bundle,
                        config,
                        name,
                        format: transformer?.format,
                        path,
                    });
                    // If this is the main file, the final path of the compiled file may
                    // have been set by the transformer. It's fine to do this, since the
                    // only place where this file will be imported from is our entry file
                    // and we'll know the right path to use.
                    const newPath = transformer?.newMainFile ?? getPathWithExtension(path, MODULE_FILE_EXTENSION.JS);
                    // Overriding the contents of the `.ts` file.
                    transformer?.rewrites.set(path, transpiled);
                    // Rewriting the `.ts` path to `.js` in the bundle.
                    transformer?.aliases.set(path, newPath);
                    // Registering the input files that were bundled into the transpiled
                    // file.
                    transformer?.bundledPaths?.push(...bundledPaths);
                    return transpiled;
                }
                return await cachedReadFile(cache.fileCache, path);
            }
            catch (error) {
                if (error.code === 'ENOENT' || error.code === 'EISDIR') {
                    return null;
                }
                throw error;
            }
        },
        resolve: async (specifier, parent, ...args) => {
            try {
                return await resolveDependency.default(specifier, parent, ...args);
            }
            catch (error) {
                // If we get a `MODULE_NOT_FOUND` error for what appears to be a module
                // name, we try to resolve it a second time using `pluginsModulesPath`
                // as the base directory.
                if (error.code === 'MODULE_NOT_FOUND' && pluginsModulesPath && appearsToBeModuleName(specifier)) {
                    const newParent = join(pluginsModulesPath, basename(parent));
                    return await resolveDependency.default(specifier, newParent, ...args);
                }
                throw error;
            }
        },
    });
    const normalizedTracedPaths = [...dependencyPaths].map((path) => (basePath ? resolve(basePath, path) : resolve(path)));
    if (transformer) {
        return {
            aliases: transformer.aliases,
            bundledPaths: transformer.bundledPaths,
            mainFile: transformer.newMainFile ?? getPathWithExtension(mainFile, MODULE_FILE_EXTENSION.JS),
            moduleFormat: transformer.format,
            rewrites: transformer.rewrites,
            tracedPaths: normalizedTracedPaths,
        };
    }
    const { moduleFormat, rewrites } = await processESM({
        basePath,
        cache,
        config,
        esmPaths: esmFileList,
        featureFlags,
        mainFile,
        reasons,
        name,
        runtimeAPIVersion,
    });
    return {
        mainFile,
        moduleFormat,
        rewrites,
        tracedPaths: normalizedTracedPaths,
    };
};
const getSrcFiles = async function ({ basePath, config, mainFile }) {
    const { includedFiles = [], includedFilesBasePath } = config;
    const { excludePatterns, paths: includedFilePaths } = await getPathsOfIncludedFiles(includedFiles, includedFilesBasePath);
    const { fileList: dependencyPaths } = await nodeFileTrace([mainFile], {
        base: basePath,
        ignore: getIgnoreFunction(config),
    });
    const normalizedDependencyPaths = [...dependencyPaths].map((path) => basePath ? resolve(basePath, path) : resolve(path));
    const srcFiles = filterExcludedPaths(normalizedDependencyPaths, excludePatterns);
    const includedPaths = filterExcludedPaths(includedFilePaths, excludePatterns);
    return {
        srcFiles: [...srcFiles, ...includedPaths],
        includedFiles: includedPaths,
    };
};
const bundler = { bundle, getSrcFiles };
export default bundler;
