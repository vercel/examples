import type { FunctionConfig } from '../../../../config.js';
interface TranspileESMToCJSOptions {
    config: FunctionConfig;
    name: string;
    path: string;
}
export declare const transpileESMToCJS: ({ config, name, path }: TranspileESMToCJSOptions) => Promise<string>;
export {};
