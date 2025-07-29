import { dirname, normalize } from 'path';
import { getBasePath } from '../../utils/base_path.js';
import { MODULE_FORMAT } from '../../utils/module_format.js';
import { getSrcFiles } from './src_files.js';
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
    return {
        basePath: getBasePath(dirnames),
        includedFiles,
        inputs: srcFiles,
        mainFile,
        moduleFormat: MODULE_FORMAT.COMMONJS,
        srcFiles,
    };
};
const bundler = { bundle, getSrcFiles };
export default bundler;
