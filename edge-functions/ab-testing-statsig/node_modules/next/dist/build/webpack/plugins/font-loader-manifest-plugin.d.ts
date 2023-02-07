import { webpack } from 'next/dist/compiled/webpack/webpack';
export declare type FontLoaderManifest = {
    pages: {
        [path: string]: string[];
    };
    app: {
        [moduleRequest: string]: string[];
    };
};
export declare class FontLoaderManifestPlugin {
    private appDirEnabled;
    private fontLoaderTargets;
    constructor(options: {
        appDirEnabled: boolean;
        fontLoaderTargets: string[];
    });
    apply(compiler: webpack.Compiler): void;
}
