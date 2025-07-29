import { MODULE_FILE_EXTENSION, MODULE_FORMAT } from '../../utils/module_format.js';
import { DEFAULT_NODE_VERSION, getNodeSupportMatrix, parseVersion } from '../../utils/node_version.js';
import { getClosestPackageJson } from '../../utils/package_json.js';
const versionMap = {
    14: 'node14',
    16: 'node16',
    18: 'node18',
    20: 'node20',
    22: 'node22',
};
const getBundlerTarget = (suppliedVersion) => {
    const version = parseVersion(suppliedVersion);
    if (version && version in versionMap) {
        return versionMap[version];
    }
    return versionMap[DEFAULT_NODE_VERSION];
};
const getModuleFormat = async ({ srcDir, featureFlags, extension, runtimeAPIVersion, configVersion, }) => {
    if (extension === MODULE_FILE_EXTENSION.MJS && (runtimeAPIVersion === 2 || featureFlags.zisi_pure_esm_mjs)) {
        return {
            includedFiles: [],
            moduleFormat: MODULE_FORMAT.ESM,
        };
    }
    if (runtimeAPIVersion === 2 || featureFlags.zisi_pure_esm) {
        const nodeSupport = getNodeSupportMatrix(configVersion);
        if (extension.includes('ts') && nodeSupport.esm) {
            return {
                includedFiles: [],
                moduleFormat: MODULE_FORMAT.ESM,
            };
        }
        const packageJsonFile = await getClosestPackageJson(srcDir);
        if (packageJsonFile?.contents.type === 'module' && nodeSupport.esm) {
            return {
                includedFiles: [packageJsonFile.path],
                moduleFormat: MODULE_FORMAT.ESM,
            };
        }
    }
    return {
        includedFiles: [],
        moduleFormat: MODULE_FORMAT.COMMONJS,
    };
};
export { getBundlerTarget, getModuleFormat };
