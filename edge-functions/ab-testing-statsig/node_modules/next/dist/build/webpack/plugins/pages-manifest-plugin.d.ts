import { webpack } from 'next/dist/compiled/webpack/webpack';
export declare type PagesManifest = {
    [page: string]: string;
};
export default class PagesManifestPlugin implements webpack.WebpackPluginInstance {
    dev: boolean;
    isEdgeRuntime: boolean;
    appDirEnabled: boolean;
    constructor({ dev, isEdgeRuntime, appDirEnabled, }: {
        dev: boolean;
        isEdgeRuntime: boolean;
        appDirEnabled: boolean;
    });
    createAssets(compilation: any, assets: any): void;
    apply(compiler: webpack.Compiler): void;
}
