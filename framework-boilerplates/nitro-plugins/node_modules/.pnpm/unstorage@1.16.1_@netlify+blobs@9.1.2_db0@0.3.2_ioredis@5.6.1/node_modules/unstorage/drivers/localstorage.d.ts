export interface LocalStorageOptions {
    base?: string;
    window?: typeof window;
    windowKey?: "localStorage" | "sessionStorage";
    storage?: typeof window.localStorage | typeof window.sessionStorage;
    /** @deprecated use `storage` option */
    sessionStorage?: typeof window.sessionStorage;
    /** @deprecated use `storage` option */
    localStorage?: typeof window.localStorage;
}
declare const _default: (opts: LocalStorageOptions | undefined) => import("..").Driver<LocalStorageOptions | undefined, Storage>;
export default _default;
