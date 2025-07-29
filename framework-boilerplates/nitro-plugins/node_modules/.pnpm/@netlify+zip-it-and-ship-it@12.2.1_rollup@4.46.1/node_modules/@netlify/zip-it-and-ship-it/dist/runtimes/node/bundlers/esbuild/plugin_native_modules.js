import path from 'path';
import { isNativeModule } from '../../utils/detect_native_module.js';
import { readPackageJson } from '../../utils/package_json.js';
// Filters out relative or absolute file paths.
const packageFilter = /^([^./]*)$/;
// Filters valid package names and extracts the base directory.
const packageName = /^([^@][^/]*|@[^/]*\/[^/]+)(?:\/|$)/;
const findNativeModule = (packageJsonPath, cache) => {
    if (cache[packageJsonPath] === undefined) {
        cache[packageJsonPath] = readPackageJson(packageJsonPath).then((data) => [Boolean(isNativeModule(data)), data], () => [undefined, {}]);
    }
    return cache[packageJsonPath];
};
export const getNativeModulesPlugin = (externalizedModules) => ({
    name: 'external-native-modules',
    setup(build) {
        const cache = {};
        build.onResolve({ filter: packageFilter }, async (args) => {
            const pkg = packageName.exec(args.path);
            if (!pkg)
                return;
            let directory = args.resolveDir;
            while (true) {
                if (path.basename(directory) !== 'node_modules') {
                    const modulePath = path.join(directory, 'node_modules', pkg[1]);
                    const packageJsonPath = path.join(modulePath, 'package.json');
                    const [isNative, packageJsonData] = await findNativeModule(packageJsonPath, cache);
                    if (isNative === true) {
                        if (externalizedModules[args.path] === undefined) {
                            externalizedModules[args.path] = {};
                        }
                        externalizedModules[args.path][modulePath] = packageJsonData.version;
                        return { path: args.path, external: true };
                    }
                    if (isNative === false) {
                        return;
                    }
                }
                const parentDirectory = path.dirname(directory);
                if (parentDirectory === directory) {
                    break;
                }
                directory = parentDirectory;
            }
        });
    },
});
