export interface HTTPOptions {
    base: string;
    headers?: Record<string, string>;
}
declare const _default: (opts: HTTPOptions) => import("..").Driver<HTTPOptions, never>;
export default _default;
