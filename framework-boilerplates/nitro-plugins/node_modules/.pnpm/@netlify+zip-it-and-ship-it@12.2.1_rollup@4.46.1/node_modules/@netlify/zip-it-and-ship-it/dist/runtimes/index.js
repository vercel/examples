import { extname, basename } from 'path';
import { getConfigForFunction } from '../config.js';
import { defaultFlags } from '../feature_flags.js';
import { FunctionBundlingUserError } from '../utils/error.js';
import goRuntime from './go/index.js';
import jsRuntime from './node/index.js';
import { ENTRY_FILE_NAME } from './node/utils/entry_file.js';
import rustRuntime from './rust/index.js';
/**
 * Finds functions for a list of paths using a specific runtime. The return
 * value is an object containing an array of the functions found (`functions`)
 * and an array with the paths that haven't been recognized by the runtime
 * (`remainingPaths`).
 */
const findFunctionsInRuntime = async function ({ cache, dedupe = false, featureFlags, paths, runtime, }) {
    const functions = await runtime.findFunctionsInPaths({ cache, featureFlags, paths });
    // If `dedupe` is true, we use the function name (`filename`) as the map key,
    // so that `function-1.js` will overwrite `function-1.go`. Otherwise, we use
    // `srcPath`, so that both functions are returned.
    const key = dedupe ? 'name' : 'srcPath';
    // Augmenting the function objects with additional information.
    const augmentedFunctions = functions.map((func) => {
        if (func.name === ENTRY_FILE_NAME) {
            throw new FunctionBundlingUserError(`'${ENTRY_FILE_NAME}' is a reserved word and cannot be used as a function name.`, {
                functionName: func.name,
                runtime: runtime.name,
            });
        }
        return [
            func[key],
            {
                ...func,
                extension: extname(func.mainFile),
                filename: basename(func.srcPath),
                runtime,
            },
        ];
    });
    const usedPaths = new Set(augmentedFunctions.map(([path]) => path));
    const remainingPaths = paths.filter((path) => !usedPaths.has(path));
    return { functions: augmentedFunctions, remainingPaths };
};
// The order of this array determines the priority of the runtimes. If a path
// is used by the first time, it won't be made available to the subsequent
// runtimes.
const RUNTIMES = [jsRuntime, goRuntime, rustRuntime];
/**
 * Gets a list of functions found in a list of paths.
 */
export const getFunctionsFromPaths = async (paths, { cache, config, configFileDirectories = [], dedupe = false, featureFlags = defaultFlags, }) => {
    // We cycle through the ordered array of runtimes, passing each one of them
    // through `findFunctionsInRuntime`. For each iteration, we collect all the
    // functions found plus the list of paths that still need to be evaluated,
    // using them as the input for the next iteration until the last runtime.
    const { functions } = await RUNTIMES.reduce(async (aggregate, runtime) => {
        const { functions: aggregateFunctions, remainingPaths: aggregatePaths } = await aggregate;
        const { functions: runtimeFunctions, remainingPaths: runtimePaths } = await findFunctionsInRuntime({
            cache,
            dedupe,
            featureFlags,
            paths: aggregatePaths,
            runtime,
        });
        return {
            functions: [...aggregateFunctions, ...runtimeFunctions],
            remainingPaths: runtimePaths,
        };
    }, Promise.resolve({ functions: [], remainingPaths: paths }));
    const functionConfigs = await Promise.all(functions.map(([, func]) => getConfigForFunction({ config, configFileDirectories, func })));
    const functionsWithConfig = functions.map(([name, func], index) => [
        name,
        { ...func, config: functionConfigs[index] },
    ]);
    return new Map(functionsWithConfig);
};
/**
 * Gets a list of functions found in a list of paths.
 */
export const getFunctionFromPath = async (path, { cache, config, configFileDirectories, featureFlags = defaultFlags, }) => {
    for (const runtime of RUNTIMES) {
        const func = await runtime.findFunctionInPath({ path, cache, featureFlags });
        if (func) {
            const functionConfig = await getConfigForFunction({
                config,
                configFileDirectories,
                func: { ...func, runtime },
            });
            return {
                ...func,
                runtime,
                config: functionConfig,
            };
        }
    }
    return undefined;
};
