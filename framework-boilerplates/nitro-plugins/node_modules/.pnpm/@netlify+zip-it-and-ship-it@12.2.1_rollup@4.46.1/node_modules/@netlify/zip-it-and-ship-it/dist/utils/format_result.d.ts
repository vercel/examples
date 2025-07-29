import { FunctionArchive } from '../function.js';
import { RuntimeName } from '../runtimes/runtime.js';
import type { ExtendedRoute, Route } from './routes.js';
export type FunctionResult = Omit<FunctionArchive, 'runtime'> & {
    bootstrapVersion?: string;
    routes?: ExtendedRoute[];
    excludedRoutes?: Route[];
    runtime: RuntimeName;
    schedule?: string;
    runtimeAPIVersion?: number;
};
export declare const formatZipResult: (archive: FunctionArchive) => FunctionResult;
