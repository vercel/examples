import { dirname } from 'path';
// @ts-expect-error(serhalp) -- Remove once https://github.com/schnittstabil/merge-options/pull/28 is merged, or replace
// this dependency.
import mergeOptions from 'merge-options';
import { z } from 'zod';
import { functionConfig } from '../../../config.js';
import { INVOCATION_MODE } from '../../../function.js';
import { rateLimit } from '../../../rate_limit.js';
import { ensureArray } from '../../../utils/ensure_array.js';
import { FunctionBundlingUserError } from '../../../utils/error.js';
import { getRoutes } from '../../../utils/routes.js';
import { RUNTIME } from '../../runtime.js';
import { createBindingsMethod } from '../parser/bindings.js';
import { traverseNodes } from '../parser/exports.js';
import { getImports } from '../parser/imports.js';
import { safelyParseSource, safelyReadSource } from '../parser/index.js';
import { parse as parseSchedule } from './properties/schedule.js';
export const IN_SOURCE_CONFIG_MODULE = '@netlify/functions';
const httpMethod = z.enum(['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE', 'HEAD']);
const httpMethods = z.preprocess((input) => (typeof input === 'string' ? input.toUpperCase() : input), httpMethod);
const path = z.string().startsWith('/', { message: "Must start with a '/'" });
export const inSourceConfig = functionConfig
    .pick({
    externalNodeModules: true,
    generator: true,
    includedFiles: true,
    ignoredNodeModules: true,
    name: true,
    nodeBundler: true,
    nodeVersion: true,
    schedule: true,
    timeout: true,
})
    .extend({
    method: z
        .union([httpMethods, z.array(httpMethods)], {
        errorMap: () => ({ message: 'Must be a string or array of strings' }),
    })
        .transform(ensureArray)
        .optional(),
    path: z
        .union([path, z.array(path)], { errorMap: () => ({ message: 'Must be a string or array of strings' }) })
        .transform(ensureArray)
        .optional(),
    excludedPath: z
        .union([path, z.array(path)], { errorMap: () => ({ message: 'Must be a string or array of strings' }) })
        .transform(ensureArray)
        .optional(),
    preferStatic: z.boolean().optional().catch(undefined),
    rateLimit: rateLimit.optional().catch(undefined),
});
const validateScheduleFunction = (functionFound, scheduleFound, functionName) => {
    if (!functionFound) {
        throw new FunctionBundlingUserError("The `schedule` helper was imported but we couldn't find any usages. If you meant to schedule a function, please check that `schedule` is invoked and `handler` correctly exported.", { functionName, runtime: RUNTIME.JAVASCRIPT });
    }
    if (!scheduleFound) {
        throw new FunctionBundlingUserError('Unable to find cron expression for scheduled function. The cron expression (first argument) for the `schedule` helper needs to be accessible inside the file and cannot be imported.', { functionName, runtime: RUNTIME.JAVASCRIPT });
    }
};
/**
 * Loads a file at a given path, parses it into an AST, and returns a series of
 * data points, such as in-source configuration properties and other metadata.
 */
export const parseFile = async (sourcePath, { functionName }) => {
    const source = await safelyReadSource(sourcePath);
    if (source === null) {
        return {
            config: {},
        };
    }
    return parseSource(source, { functionName });
};
/**
 * Takes a JS/TS source as a string, parses it into an AST, and returns a
 * series of data points, such as in-source configuration properties and
 * other metadata.
 */
export const parseSource = (source, { functionName }) => {
    const ast = safelyParseSource(source);
    if (ast === null) {
        return {
            config: {},
        };
    }
    const imports = ast.body.flatMap((node) => getImports(node, IN_SOURCE_CONFIG_MODULE));
    const scheduledFunctionExpected = imports.some(({ imported }) => imported === 'schedule');
    let scheduledFunctionFound = false;
    let scheduleFound = false;
    const getAllBindings = createBindingsMethod(ast.body);
    const { configExport, handlerExports, hasDefaultExport, inputModuleFormat } = traverseNodes(ast.body, getAllBindings);
    const isV2API = handlerExports.length === 0 && hasDefaultExport;
    if (isV2API) {
        const result = {
            config: {},
            inputModuleFormat,
            runtimeAPIVersion: 2,
        };
        const { data, error, success } = inSourceConfig.safeParse(configExport);
        if (success) {
            result.config = data;
            result.excludedRoutes = getRoutes(functionName, data.excludedPath);
            result.routes = getRoutes(functionName, data.path).map((route) => ({
                ...route,
                methods: data.method ?? [],
                prefer_static: data.preferStatic || undefined,
            }));
        }
        else {
            // TODO: Handle multiple errors.
            const [issue] = error.issues;
            throw new FunctionBundlingUserError(`Function ${functionName} has a configuration error on '${issue.path.join('.')}': ${issue.message}`, {
                functionName,
                runtime: RUNTIME.JAVASCRIPT,
            });
        }
        return result;
    }
    const result = {
        config: {},
        inputModuleFormat,
        runtimeAPIVersion: 1,
    };
    handlerExports.forEach((node) => {
        // We're only interested in exports with call expressions, since that's
        // the pattern we use for the wrapper functions.
        if (node.type !== 'call-expression') {
            return;
        }
        const { args, local: exportName } = node;
        const matchingImport = imports.find(({ local: importName }) => importName === exportName);
        if (matchingImport === undefined) {
            return;
        }
        switch (matchingImport.imported) {
            case 'schedule': {
                const parsed = parseSchedule({ args }, getAllBindings);
                scheduledFunctionFound = true;
                if (parsed.schedule) {
                    scheduleFound = true;
                }
                if (parsed.schedule !== undefined) {
                    result.config.schedule = parsed.schedule;
                }
                return;
            }
            case 'stream': {
                result.invocationMode = INVOCATION_MODE.Stream;
                return;
            }
            default:
            // no-op
        }
        return;
    });
    if (scheduledFunctionExpected) {
        validateScheduleFunction(scheduledFunctionFound, scheduleFound, functionName);
    }
    return result;
};
export const augmentFunctionConfig = (mainFile, tomlConfig, inSourceConfig = {}) => {
    const mergedConfig = mergeOptions.call({ concatArrays: true }, tomlConfig, inSourceConfig);
    // We can't simply merge included files from the TOML and from in-source
    // configuration because their globs are relative to different base paths.
    // In the future, we could shift things around so we resolve each glob
    // relative to the right base, but for now we say that included files in
    // the source override any files defined in the TOML. It doesn't make a lot
    // of sense to be defining include files for a framework-generated function
    // in the TOML anyway.
    if (inSourceConfig?.includedFiles && inSourceConfig.includedFiles.length !== 0) {
        mergedConfig.includedFiles = inSourceConfig.includedFiles;
        mergedConfig.includedFilesBasePath = dirname(mainFile);
    }
    return mergedConfig;
};
