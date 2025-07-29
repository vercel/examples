import type { NodeBundlerName } from '../runtimes/node/bundlers/types.js';
import type { RuntimeName } from '../runtimes/runtime.js';
interface CustomErrorLocation {
    functionName: string;
    runtime: RuntimeName;
    bundler?: NodeBundlerName;
}
interface CustomErrorInfo {
    type: 'functionsBundling';
    location: CustomErrorLocation;
}
type UserError = Error & {
    customErrorInfo: CustomErrorInfo;
};
export declare class FunctionBundlingUserError extends Error {
    constructor(message: string, customErrorInfo: CustomErrorLocation);
    static addCustomErrorInfo(error: Error, customErrorInfo: CustomErrorLocation): UserError;
}
export {};
