export interface FSStorageOptions {
    base?: string;
    ignore?: (path: string) => boolean;
    readOnly?: boolean;
    noClear?: boolean;
}
declare const _default: (opts: FSStorageOptions | undefined) => import("..").Driver<FSStorageOptions | undefined, never>;
export default _default;
