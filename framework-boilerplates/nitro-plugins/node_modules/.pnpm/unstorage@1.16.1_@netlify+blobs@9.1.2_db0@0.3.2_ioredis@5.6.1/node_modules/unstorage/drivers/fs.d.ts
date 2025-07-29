import { type ChokidarOptions } from "chokidar";
export interface FSStorageOptions {
    base?: string;
    ignore?: string[];
    readOnly?: boolean;
    noClear?: boolean;
    watchOptions?: ChokidarOptions;
}
declare const _default: (opts: FSStorageOptions | undefined) => import("..").Driver<FSStorageOptions | undefined, never>;
export default _default;
