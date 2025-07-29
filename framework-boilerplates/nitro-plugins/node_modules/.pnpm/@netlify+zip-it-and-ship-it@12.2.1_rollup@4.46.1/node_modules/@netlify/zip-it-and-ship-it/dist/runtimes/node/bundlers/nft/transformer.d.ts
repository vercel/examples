import type { FunctionConfig } from '../../../../config.js';
import { ModuleFormat } from '../../utils/module_format.js';
type Transformer = {
    aliases: Map<string, string>;
    bundle?: boolean;
    bundledPaths?: string[];
    format: ModuleFormat;
    newMainFile?: string;
    rewrites: Map<string, string>;
};
export declare const getTransformer: (runtimeAPIVersion: number, mainFile: string, repositoryRoot?: string) => Promise<Transformer | undefined>;
interface TransformOptions {
    bundle?: boolean;
    config: FunctionConfig;
    format?: ModuleFormat;
    name: string;
    path: string;
}
export declare const transform: ({ bundle, config, format, name, path }: TransformOptions) => Promise<{
    bundledPaths: string[];
    transpiled: string;
}>;
export {};
