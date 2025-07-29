import { promises as fs } from 'fs';
import { basename, extname, dirname, join } from 'path';
import isPathInside from 'is-path-inside';
// @ts-expect-error(serhalp) -- Remove once https://github.com/schnittstabil/merge-options/pull/28 is merged, or replace
// this dependency.
import mergeOptions from 'merge-options';
import { z } from 'zod';
import { nodeBundler } from './runtimes/node/bundlers/types.js';
import { moduleFormat } from './runtimes/node/utils/module_format.js';
import { minimatch } from './utils/matching.js';
export const functionConfig = z.object({
    externalNodeModules: z.array(z.string()).optional().catch([]),
    generator: z.string().optional().catch(undefined),
    includedFiles: z.array(z.string()).optional().catch([]),
    includedFilesBasePath: z.string().optional().catch(undefined),
    ignoredNodeModules: z.array(z.string()).optional().catch([]),
    name: z.string().optional().catch(undefined),
    nodeBundler: nodeBundler.optional().catch(undefined),
    nodeSourcemap: z.boolean().optional().catch(undefined),
    nodeVersion: z.string().optional().catch(undefined),
    rustTargetDirectory: z.string().optional().catch(undefined),
    schedule: z.string().optional().catch(undefined),
    timeout: z.number().optional().catch(undefined),
    zipGo: z.boolean().optional().catch(undefined),
    // Temporary configuration property, only meant to be used by the deploy
    // configuration API. Once we start emitting ESM files for all ESM functions,
    // we can remove this.
    nodeModuleFormat: moduleFormat.optional().catch(undefined),
});
const getConfigForFunction = async ({ config, configFileDirectories, func, }) => {
    const fromConfig = getFromMainConfig({ config, func });
    // We try to read from a function config file if the function directory is
    // inside one of `configFileDirectories`.
    const shouldReadConfigFile = configFileDirectories?.some((directory) => isPathInside(func.mainFile, directory));
    if (!shouldReadConfigFile) {
        return fromConfig;
    }
    const fromFile = await getFromFile(func);
    return {
        ...fromConfig,
        ...fromFile,
    };
};
const getFromMainConfig = ({ config, func, }) => {
    if (!config) {
        return {};
    }
    // It's safe to mutate the array because it's local to this function.
    const matches = Object.keys(config)
        .filter((expression) => minimatch(func.name, expression))
        .map((expression) => {
        const wildcardCount = [...expression].filter((char) => char === '*').length;
        // The weight increases with the number of hardcoded (i.e. non-wildcard)
        // characters — e.g. "netlify" has a higher weight than "net*". We do a
        // subtraction of 1 if there is at least one wildcard character, so that
        // "netlify" has a higher weight than "netlify*".
        const weight = expression.length - wildcardCount - (wildcardCount === 0 ? 0 : 1);
        return {
            expression,
            weight,
        };
    })
        .sort(({ weight: weightA }, { weight: weightB }) => weightA - weightB)
        .map(({ expression }) => config[expression]);
    return mergeOptions.apply({ concatArrays: true, ignoreUndefined: true }, matches);
};
const getFromFile = async (func) => {
    const filename = `${basename(func.mainFile, extname(func.mainFile))}.json`;
    const configFilePath = join(dirname(func.mainFile), filename);
    try {
        const data = await fs.readFile(configFilePath, 'utf8');
        const configFile = JSON.parse(data);
        if (configFile.version === 1) {
            return configFile.config;
        }
    }
    catch {
        // no-op
    }
    return {};
};
export { getConfigForFunction };
