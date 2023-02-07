import type { CssImports, ClientComponentImports } from '../loaders/next-flight-client-entry-loader';
import { webpack } from 'next/dist/compiled/webpack/webpack';
interface Options {
    dev: boolean;
    appDir: string;
    isEdgeServer: boolean;
}
export declare const injectedClientEntries: Map<any, any>;
export declare const serverModuleIds: Map<string, string | number>;
export declare const edgeServerModuleIds: Map<string, string | number>;
export declare class FlightClientEntryPlugin {
    dev: boolean;
    appDir: string;
    isEdgeServer: boolean;
    constructor(options: Options);
    apply(compiler: webpack.Compiler): void;
    createClientEntries(compiler: any, compilation: any): Promise<void>;
    collectClientComponentsAndCSSForDependency({ entryRequest, compilation, dependency, clientEntryDependencyMap, }: {
        entryRequest: string;
        compilation: any;
        dependency: any;
        clientEntryDependencyMap?: Record<string, any>;
    }): [ClientComponentImports, CssImports];
    injectClientEntryAndSSRModules({ compiler, compilation, entryName, clientComponentImports, bundlePath, }: {
        compiler: webpack.Compiler;
        compilation: webpack.Compilation;
        entryName: string;
        clientComponentImports: ClientComponentImports;
        bundlePath: string;
    }): Promise<boolean>;
    addEntry(compilation: any, context: string, dependency: webpack.Dependency, options: webpack.EntryOptions): Promise<any>;
}
export {};
