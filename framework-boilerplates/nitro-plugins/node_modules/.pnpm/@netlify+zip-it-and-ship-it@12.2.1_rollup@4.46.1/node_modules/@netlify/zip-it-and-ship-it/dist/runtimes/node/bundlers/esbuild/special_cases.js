import { getNodeSupportMatrix } from '../../utils/node_version.js';
import { getPackageJsonIfAvailable } from '../../utils/package_json.js';
import { getBundlerTarget } from './bundler_target.js';
const EXTERNAL_MODULES = ['@prisma/client'];
const getModulesForNextJs = ({ dependencies, devDependencies }) => {
    const allDependencies = { ...dependencies, ...devDependencies };
    const externalModules = allDependencies.next ? ['critters', 'nanoid'] : [];
    const ignoredModules = [];
    return {
        externalModules,
        ignoredModules,
    };
};
const getAWSIgnoredModules = (config) => {
    const nodeSupport = getNodeSupportMatrix(getBundlerTarget(config.nodeVersion));
    return nodeSupport.awsSDKV3 ? ['@aws-sdk/*'] : ['aws-sdk'];
};
export const getExternalAndIgnoredModulesFromSpecialCases = async ({ config, srcDir, }) => {
    const { dependencies = {}, devDependencies = {} } = await getPackageJsonIfAvailable(srcDir);
    const { externalModules: nextJsExternalModules, ignoredModules: nextJsIgnoredModules } = getModulesForNextJs({
        dependencies,
        devDependencies,
    });
    const externalModules = [...EXTERNAL_MODULES, ...nextJsExternalModules];
    const ignoredModules = [...getAWSIgnoredModules(config), ...nextJsIgnoredModules];
    return {
        externalModules,
        ignoredModules,
    };
};
