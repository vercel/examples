import { dirname, extname, normalize } from 'path';
import { FunctionBundlingUserError } from '../../../../utils/error.js';
import { RUNTIME } from '../../../runtime.js';
import { getBasePath } from '../../utils/base_path.js';
import { filterExcludedPaths, getPathsOfIncludedFiles } from '../../utils/included_files.js';
import { MODULE_FORMAT } from '../../utils/module_format.js';
import { getNodeSupportMatrix } from '../../utils/node_version.js';
import { getPackageJsonIfAvailable } from '../../utils/package_json.js';
import { NODE_BUNDLER } from '../types.js';
/**
 * This bundler is a simple no-op bundler, that does no bundling at all.
 * It returns the detected moduleFormat and the mainFile + includedFiles from the config.
 */
// Uses the same algorithm as the ESM_FILE_FORMAT resolver from Node.js to get
// the right module format for a function based on its main file.
// See https://nodejs.org/api/esm.html#resolver-algorithm-specification.
const getModuleFormat = async function (mainFile) {
    const extension = extname(mainFile);
    if (extension === '.mjs') {
        return MODULE_FORMAT.ESM;
    }
    if (extension === '.cjs') {
        return MODULE_FORMAT.COMMONJS;
    }
    const packageJson = await getPackageJsonIfAvailable(dirname(mainFile));
    if (packageJson.type === 'module') {
        return MODULE_FORMAT.ESM;
    }
    return MODULE_FORMAT.COMMONJS;
};
export const getSrcFiles = async function ({ config, mainFile }) {
    const { includedFiles = [], includedFilesBasePath } = config;
    const { excludePatterns, paths: includedFilePaths } = await getPathsOfIncludedFiles(includedFiles, includedFilesBasePath);
    const includedPaths = filterExcludedPaths(includedFilePaths, excludePatterns);
    return { srcFiles: [mainFile, ...includedPaths], includedFiles: includedPaths };
};
const bundle = async ({ basePath, config, extension, featureFlags, filename, mainFile, name, pluginsModulesPath, runtime, srcDir, srcPath, stat, }) => {
    const { srcFiles, includedFiles } = await getSrcFiles({
        basePath,
        config: {
            ...config,
            includedFilesBasePath: config.includedFilesBasePath || basePath,
        },
        extension,
        featureFlags,
        filename,
        mainFile,
        name,
        pluginsModulesPath,
        runtime,
        srcDir,
        srcPath,
        stat,
    });
    const dirnames = srcFiles.map((filePath) => normalize(dirname(filePath)));
    const moduleFormat = await getModuleFormat(mainFile);
    const nodeSupport = getNodeSupportMatrix(config.nodeVersion);
    if (moduleFormat === MODULE_FORMAT.ESM && !nodeSupport.esm) {
        throw new FunctionBundlingUserError(`Function file is an ES module, which the Node.js version specified in the config (${config.nodeVersion}) does not support. ES modules are supported as of version 14 of Node.js.`, {
            functionName: name,
            runtime: RUNTIME.JAVASCRIPT,
            bundler: NODE_BUNDLER.NONE,
        });
    }
    return {
        basePath: getBasePath(dirnames),
        includedFiles,
        inputs: srcFiles,
        mainFile,
        moduleFormat,
        srcFiles,
    };
};
const bundler = { bundle, getSrcFiles };
export default bundler;
