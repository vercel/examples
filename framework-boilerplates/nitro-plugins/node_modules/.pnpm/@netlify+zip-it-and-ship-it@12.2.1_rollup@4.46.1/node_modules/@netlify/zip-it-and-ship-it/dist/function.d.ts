import { Stats } from 'fs';
import type { FunctionConfig } from './config.js';
import type { Runtime, ZipFunctionResult } from './runtimes/runtime.js';
import { ObjectValues } from './types/utils.js';
export declare const INVOCATION_MODE: {
    readonly Background: "background";
    readonly Buffer: "buffer";
    readonly Stream: "stream";
};
export type InvocationMode = ObjectValues<typeof INVOCATION_MODE>;
export type FunctionArchive = ZipFunctionResult & {
    mainFile: string;
    name: string;
    runtime: Runtime;
    size?: number;
};
export interface SourceFile {
    extension: string;
    filename: string;
    mainFile: string;
    name: string;
    srcDir: string;
    srcPath: string;
    stat: Stats;
}
export type FunctionSource = SourceFile & {
    config: FunctionConfig;
    runtime: Runtime;
};
