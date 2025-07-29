import { PackageJson } from '../../utils/package_json.js';
export declare const getNestedDependencies: ({ dependencies, peerDependencies, optionalDependencies, }: PackageJson) => string[];
export declare const handleModuleNotFound: ({ error, moduleName, packageJson, }: {
    error: Error & {
        code: string;
    };
    moduleName: string;
    packageJson: PackageJson;
}) => [] | never;
