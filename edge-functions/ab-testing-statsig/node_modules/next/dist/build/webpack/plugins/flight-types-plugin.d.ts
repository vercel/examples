import { webpack } from 'next/dist/compiled/webpack/webpack';
interface Options {
    dir: string;
    appDir: string;
    dev: boolean;
    isEdgeServer: boolean;
}
export declare class FlightTypesPlugin {
    dir: string;
    appDir: string;
    dev: boolean;
    isEdgeServer: boolean;
    constructor(options: Options);
    apply(compiler: webpack.Compiler): void;
}
export {};
