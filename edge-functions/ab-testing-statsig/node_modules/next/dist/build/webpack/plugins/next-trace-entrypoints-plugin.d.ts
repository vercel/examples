import { Span } from '../../../trace';
import { webpack } from 'next/dist/compiled/webpack/webpack';
import { NextConfigComplete } from '../../../server/config-shared';
export declare class TraceEntryPointsPlugin implements webpack.WebpackPluginInstance {
    private appDir;
    private appDirEnabled?;
    private tracingRoot;
    private entryTraces;
    private traceIgnores;
    private esmExternals?;
    private turbotrace?;
    private chunksToTrace;
    private turbotraceOutputPath?;
    private turbotraceFiles?;
    constructor({ appDir, appDirEnabled, traceIgnores, esmExternals, outputFileTracingRoot, turbotrace, }: {
        appDir: string;
        appDirEnabled?: boolean;
        traceIgnores?: string[];
        outputFileTracingRoot?: string;
        esmExternals?: NextConfigComplete['experimental']['esmExternals'];
        turbotrace?: NextConfigComplete['experimental']['turbotrace'];
    });
    createTraceAssets(compilation: any, assets: any, span: Span, readlink: any, stat: any): Promise<void>;
    tapfinishModules(compilation: webpack.Compilation, traceEntrypointsPluginSpan: Span, doResolve: (request: string, parent: string, job: import('@vercel/nft/out/node-file-trace').Job, isEsmRequested: boolean) => Promise<string>, readlink: any, stat: any): void;
    apply(compiler: webpack.Compiler): void;
}
