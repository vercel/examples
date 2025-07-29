import type { InvocationMode } from './function.js';
import type { TrafficRules } from './rate_limit.js';
import type { FunctionResult } from './utils/format_result.js';
import type { ExtendedRoute, Route } from './utils/routes.js';
interface ManifestFunction {
    buildData?: Record<string, unknown>;
    bundler?: string;
    displayName?: string;
    excludedRoutes?: Route[];
    generator?: string;
    invocationMode?: InvocationMode;
    mainFile: string;
    name: string;
    path: string;
    priority?: number;
    routes?: ExtendedRoute[];
    runtime: string;
    runtimeVersion?: string;
    schedule?: string;
    timeout?: number;
    trafficRules?: TrafficRules;
}
export interface Manifest {
    functions: ManifestFunction[];
    system: {
        arch: string;
        platform: string;
    };
    timestamp: number;
    version: number;
}
export declare const createManifest: ({ functions, path }: {
    functions: FunctionResult[];
    path: string;
}) => Promise<void>;
export {};
