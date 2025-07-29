import { promises as fs } from 'fs';
import { resolve } from 'path';
import { arch, platform } from 'process';
const MANIFEST_VERSION = 1;
export const createManifest = async ({ functions, path }) => {
    const formattedFunctions = functions.map((func) => formatFunctionForManifest(func));
    const payload = {
        functions: formattedFunctions,
        system: { arch, platform },
        timestamp: Date.now(),
        version: MANIFEST_VERSION,
    };
    await fs.writeFile(path, JSON.stringify(payload));
};
const formatFunctionForManifest = ({ bootstrapVersion, bundler, displayName, excludedRoutes, generator, invocationMode, mainFile, name, path, priority, trafficRules, routes, runtime, runtimeVersion, runtimeAPIVersion, schedule, timeout, }) => {
    const manifestFunction = {
        bundler,
        displayName,
        generator,
        timeout,
        invocationMode,
        buildData: { bootstrapVersion, runtimeAPIVersion },
        mainFile,
        name,
        priority,
        trafficRules,
        runtimeVersion,
        path: resolve(path),
        runtime,
        schedule,
    };
    if (routes?.length !== 0) {
        manifestFunction.routes = routes;
    }
    if (excludedRoutes && excludedRoutes.length !== 0) {
        manifestFunction.excludedRoutes = excludedRoutes;
    }
    return manifestFunction;
};
