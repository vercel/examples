import { PackageJson } from '../../utils/package_json.js';
import { TraversalCache } from '../../utils/traversal_cache.js';
export declare const getDependencyPathsForDependency: ({ dependency, basedir, state, packageJson, pluginsModulesPath, nodeVersion, }: {
    dependency: string;
    basedir: string;
    state: TraversalCache;
    packageJson: PackageJson;
    pluginsModulesPath?: string;
    nodeVersion?: string;
}) => Promise<string[]>;
